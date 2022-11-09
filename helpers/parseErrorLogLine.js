const regex = /^(\w)\s\[(.*?)\]\s\[Job\s(\d*)\]\s(.*?)\.?$/;

const levels = {
  A: "alert",
  C: "critical_error",
  D: "debug",
  d: "detailed_debug",
  E: "error",
  I: "informational",
  N: "notice",
  W: "warning",
  X: "emergency_error",
};

export default function parseErrorLogLine(logLine = "") {
  let matches = logLine.trim().match(regex);

  // to cater for parsing error_log lines for other events that print errors there's an escape hatch
  if (!matches) {
    // eslint-disable-next-line no-sparse-arrays
    matches = [
      ,
      "W",
      ,
      ,
      `Non parsable error message received: ${logLine}`,
    ];
  }

  const [, level, time, id, message] = matches;

  return {
    level: levels[level],
    time,
    id,
    message,
  };
}
