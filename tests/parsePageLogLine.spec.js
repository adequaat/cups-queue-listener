import test from "ava";
import parsePageLogLine from "../helpers/parsePageLogLine.js";

test("should parse all properties and values from a pageLog line", (t) => {
  t.deepEqual(
    parsePageLogLine(
      "time=[1] id=[111] name=[blaat] destination=[some-printer]"
    ),
    {
      time: "1",
      id: "111",
      name: "blaat",
      destination: "some-printer",
    }
  );
});

test("should parse properties and values from a pageLog line with spaces", (t) => {
  t.deepEqual(
    parsePageLogLine(
      "time=[01/Nov/2022:14:45:16 +0100] id=[222] name=[bla at] destination=[some-printer]"
    ),
    {
      time: "01/Nov/2022:14:45:16 +0100",
      id: "222",
      name: "bla at",
      destination: "some-printer",
    }
  );
});
