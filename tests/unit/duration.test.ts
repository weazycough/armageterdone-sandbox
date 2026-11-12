import { describe, expect, it } from "vite-plus/test";
import { formatDuration } from "../../app/lib/duration";

describe("formatDuration", () => {
  it("turns h:mm:ss into a short label and drops seconds", () => {
    expect(formatDuration("01:52:00")).toBe("1h 52m");
    expect(formatDuration("02:17:49")).toBe("2h 17m");
    expect(formatDuration("02:00:00")).toBe("2h");
  });

  it("treats m:ss as minutes and seconds", () => {
    expect(formatDuration("45:30")).toBe("45m");
    expect(formatDuration("00:12")).toBe("12s");
    expect(formatDuration("1:05")).toBe("1m");
  });
});
