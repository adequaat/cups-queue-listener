import test from "ava";
import parseErrorLogLine from "../helpers/parseErrorLogLine.js";

test("should parse all properties and values from an error log line", (t) => {
  t.deepEqual(
    parseErrorLogLine(`E [09/Nov/2022:12:16:26 +0100] [Job 7] No suitable destination host found by cups-browsed.
`),
    {
      level: "error",
      time: "09/Nov/2022:12:16:26 +0100",
      id: "7",
      message: "No suitable destination host found by cups-browsed",
    }
  );

  t.deepEqual(
    parseErrorLogLine(
      "E [18/Mar/2022:09:00:47 +0100] [Job 34] Files have gone away."
    ),
    {
      level: "error",
      time: "18/Mar/2022:09:00:47 +0100",
      id: "34",
      message: "Files have gone away",
    }
  );

  t.deepEqual(
    parseErrorLogLine("E [nowhitespacehere] [Job 99999] No period at the end"),
    {
      level: "error",
      time: "nowhitespacehere",
      id: "99999",
      message: "No period at the end",
    }
  );
});

test("should correctly identify all levels of messages", (t) => {
  t.deepEqual(parseErrorLogLine("A [1] [Job 1] Message."), {
    level: "alert",
    time: "1",
    id: "1",
    message: "Message",
  });

  t.deepEqual(parseErrorLogLine("C [1] [Job 1] Message."), {
    level: "critical_error",
    time: "1",
    id: "1",
    message: "Message",
  });

  t.deepEqual(parseErrorLogLine("D [1] [Job 1] Message."), {
    level: "debug",
    time: "1",
    id: "1",
    message: "Message",
  });

  t.deepEqual(parseErrorLogLine("d [1] [Job 1] Message."), {
    level: "detailed_debug",
    time: "1",
    id: "1",
    message: "Message",
  });

  t.deepEqual(parseErrorLogLine("E [1] [Job 1] Message."), {
    level: "error",
    time: "1",
    id: "1",
    message: "Message",
  });

  t.deepEqual(parseErrorLogLine("I [1] [Job 1] Message."), {
    level: "informational",
    time: "1",
    id: "1",
    message: "Message",
  });

  t.deepEqual(parseErrorLogLine("N [1] [Job 1] Message."), {
    level: "notice",
    time: "1",
    id: "1",
    message: "Message",
  });

  t.deepEqual(parseErrorLogLine("W [1] [Job 1] Message."), {
    level: "warning",
    time: "1",
    id: "1",
    message: "Message",
  });

  t.deepEqual(parseErrorLogLine("X [1] [Job 1] Message."), {
    level: "emergency_error",
    time: "1",
    id: "1",
    message: "Message",
  });
});

test("should also gracefully handle unexpected input", (t) => {
  t.deepEqual(parseErrorLogLine("this will not match..."), {
    level: "warning",
    time: undefined,
    id: undefined,
    message: "Non parsable error message received: this will not match...",
  });

  t.deepEqual(parseErrorLogLine(""), {
    level: "warning",
    time: undefined,
    id: undefined,
    message: "Non parsable error message received: ",
  });
});
