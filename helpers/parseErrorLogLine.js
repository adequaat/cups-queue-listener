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

export default function parseErrorLogLine(logLine = '') {
  const matches = logLine.match(regex);

  if (!matches) {
    throw new Error("input_incorrect");
  }

  const [, level, time, id, message] = matches;

  return {
    level: levels[level],
    time,
    id,
    message,
  };
}
