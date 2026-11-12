// duration.ts — turn feed durations (h:mm:ss or m:ss) into a short plain
// label such as "2h 14m". Seconds are dropped once there are hours or
// minutes; a sub-minute clip still shows seconds.

/** "01:52:00" → "1h 52m"; "45:30" → "45m"; "00:12" → "12s". */
export function formatDuration(raw: string): string {
  const parts = raw.split(":").map((p) => Number(p));
  if (parts.length < 2 || parts.length > 3 || parts.some((n) => !Number.isFinite(n) || n < 0)) {
    return raw;
  }
  const hours = parts.length === 3 ? parts[0]! : 0;
  const minutes = parts.length === 3 ? parts[1]! : parts[0]!;
  const seconds = parts.length === 3 ? parts[2]! : parts[1]!;
  const chunks: string[] = [];
  if (hours > 0) chunks.push(`${String(hours)}h`);
  if (minutes > 0) chunks.push(`${String(minutes)}m`);
  if (chunks.length === 0 && seconds > 0) chunks.push(`${String(seconds)}s`);
  return chunks.length > 0 ? chunks.join(" ") : raw;
}
