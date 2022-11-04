import EventEmitter from "node:events";
import getRelevantConfiguration from "./helpers/getRelevantConfiguration.js";
import checkConfiguration from "./helpers/checkConfiguration.js";
import setupLogListeners from "./helpers/setupLogListeners.js";
import printJobRegistry from "./helpers/printJobRegistry.js";

const eventEmitter = new EventEmitter();

const relevantConfig = await getRelevantConfiguration();

{
  const { mssg, ok } = checkConfiguration(relevantConfig);
  if (!ok) {
    throw new Error(mssg);
  }
}

setupLogListeners({ relevantConfig, eventEmitter });

printJobRegistry(eventEmitter);

export default eventEmitter;
