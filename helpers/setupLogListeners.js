import LogListener from "./logListener.js";

export default function setupLogListeners({ relevantConfig, eventEmitter }) {
  ["errorLog", "pageLog"].map(
    (type) =>
      new LogListener({
        filePath: relevantConfig[type],
        relevantConfig,
        eventEmitter,
      })
  );
}
