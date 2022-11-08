import { spawn } from "node:child_process";
import parsePageLogLine from "./parsePageLogLine.js";
import parseErrorLogLine from "./parseErrorLogLine.js";

export default class LogListener {
  #childProcess;
  #type;
  #eventEmitter;

  constructor({ relevantConfig, filePath, eventEmitter }) {
    this.#eventEmitter = eventEmitter;

    this.#type = filePath === relevantConfig.errorLog ? "errorLog" : "pageLog";

    this.#childProcess = spawn("tail", ["-n", "1", "-f", filePath], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    // to skip the first output from tail received by stdout we bind after the first 'data' event has fired
    this.#childProcess.stdout.once("data", () => {
      this.#childProcess.stdout.on("data", (data) => {
        this.#parseAndemit(data);
      });
    });
    this.#childProcess.stderr.on("data", (data) => {
      this.#parseAndemit(data);
    });

    this.#childProcess.on("error", (err) => {
      console.error(err);
    });
  }

  kill(signal) {
    this.#childProcess.kill(signal);
  }

  #parseAndemit(data) {
    if ("errorLog" === this.#type) {
      this.#eventEmitter.emit(
        "print-errored",
        parseErrorLogLine(data.toString())
      );
    } else {
      this.#eventEmitter.emit(
        "print-successful",
        parsePageLogLine(data.toString())
      );
    }
  }
}
