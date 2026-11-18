const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad2 = (n: number) => String(n).padStart(2, "0");

/** "9 Nov, 13:30", or "9 Nov '25, 13:30" for earlier years. UTC, like the axis labels. */
export function formatCursorTime(seconds: number) {
  const d = new Date(seconds * 1000);
  const year = d.getUTCFullYear() < new Date().getUTCFullYear() ? ` '${pad2(d.getUTCFullYear() % 100)}` : "";
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}${year}, ${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}`;
}

/** Packs a colour into the 0xAARRGGBB number SciChart palette providers return. `a` is 0..1. */
export const argb = (a: number, r: number, g: number, b: number) =>
  (((Math.round(a * 255) & 255) << 24) | (r << 16) | (g << 8) | b) >>> 0;

/** Rounds up to 1, 2, 2.5 or 5 x 10^n (minimum 1). */
export function niceStep(raw: number) {
  if (!(raw > 1)) return 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * mag >= raw - 1e-9) return m * mag;
  return 10 * mag;
}

/** How many decimals it takes to show `value` exactly (up to `max`). */
export function decimalsFor(value: number, max = 3) {
  let d = 0;
  while (d < max && Math.abs(Math.round(value * 10 ** d) - value * 10 ** d) > 1e-9) d++;
  return d;
}

/** Index of the first element >= v in a sorted array. */
export function lowerBound(arr: Float64Array, n: number, v: number) {
  let lo = 0;
  let hi = n;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (arr[m] < v) lo = m + 1;
    else hi = m;
  }
  return lo;
}
