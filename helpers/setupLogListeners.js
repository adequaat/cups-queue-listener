import LogListener from "./logListener.js";

export default function setupLogListeners({ relevantConfig, eventEmitter }) {
  const listeners = ["errorLog", "pageLog"].map(
    (type) =>
      new LogListener({
        filePath: relevantConfig[type],
        relevantConfig,
        eventEmitter,
      })
  );
}
