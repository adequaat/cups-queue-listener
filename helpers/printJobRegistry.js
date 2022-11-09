const STARTED = "started";
const PRINTED = "printed";

const registries = {};
let alreadyCalled = false;

export default function (eventEmitter) {
  if (alreadyCalled) {
    throw new Error("printJobRegistry_can_only_be_called_once");
  }
  alreadyCalled = true;

  /*
    emit a 'print-queued' event on the eventEmitter from outside with
    an id property (the job id returned from the print command) and a
    'destination' property (the destination the job was started on) to help the
    listeners tie everything together and emit sensible events.
  */
  eventEmitter.on("print-queued", ({ id, destination }) => {
    if (!(destination in registries)) {
      registries[destination] = new Map();
    }

    const registry = registries[destination];
    registry?.set(id, STARTED);
  });

  eventEmitter.on("print-errored", (data) => {
    const { id, level } = data;

    // in case of non parsable error_log line we just emit a generic error event
    if (!id) {
      eventEmitter.emit("unparsable-print-error", data);
    }

    // filter out non errors
    if (level.includes("error") && id) {
      Object.entries(registries).forEach(([destination, registry]) => {
        if (registry.has(id)) {
          registry.set(id, "error");
          eventEmitter.emit(
            "print-error",
            Object.assign({ destination }, data)
          );
        }
      });
    }
  });

  eventEmitter.on("print-successful", (data) => {
    const { id, destination } = data;

    if (!(destination in registries)) {
      return;
    }

    eventEmitter.emit("print-success", data);
    eventEmitter.emit(`print-success-${destination}`, { id });

    const registry = registries[destination];
    registry?.set(id, PRINTED);

    const values = Array.from(registry.values());
    let printed = 0;
    let queued = 0;
    const queue = values.length;

    values.forEach((v) => {
      if (PRINTED === v) {
        printed++;
      } else if (STARTED === v) {
        queued++;
      }
    });

    eventEmitter.emit("queue-update", {
      queue,
      queued,
      printed,
      destination,
    });

    eventEmitter.emit(`queue-update-${destination}`, {
      queue,
      queued,
      printed,
    });

    if (queued < 5) {
      eventEmitter.emit("queue-almost-empty", { destination });
      eventEmitter.emit(`queue-almost-empty-${destination}`);
    }

    if (printed === queue) {
      eventEmitter.emit("all-printed", { destination });
      eventEmitter.emit(`all-printed-${destination}`);
    }
  });
}
