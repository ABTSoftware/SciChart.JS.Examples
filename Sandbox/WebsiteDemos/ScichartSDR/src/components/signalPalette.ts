import {
  DB_CEILING_LIMIT,
  DB_FLOOR_LIMIT,
} from "../features/receiver/constants";

type ColorStop = {
  offset: number;
  r: number;
  g: number;
  b: number;
  a: number;
};

export type GradientStop = {
  offset: number;
  color: string;
};

const METER_STOPS: ColorStop[] = [
  { offset: 0, r: 3, g: 17, b: 50, a: 1 },
  { offset: 0.18, r: 21, g: 73, b: 158, a: 1 },
  { offset: 0.36, r: 15, g: 140, b: 133, a: 1 },
  { offset: 0.52, r: 123, g: 207, b: 79, a: 1 },
  { offset: 0.66, r: 240, g: 214, b: 110, a: 1 },
  { offset: 0.8, r: 236, g: 150, b: 70, a: 1 },
  { offset: 0.9, r: 219, g: 54, b: 234, a: 1 },
  { offset: 1, r: 238, g: 245, b: 249, a: 1 },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

function normalizeDb(value: number): number {
  const clamped = clamp(value, DB_FLOOR_LIMIT, DB_CEILING_LIMIT);
  return (clamped - DB_FLOOR_LIMIT) / (DB_CEILING_LIMIT - DB_FLOOR_LIMIT);
}

function sampleStop(stops: readonly ColorStop[], offset: number): ColorStop {
  if (offset <= stops[0].offset) {
    return { ...stops[0], offset };
  }
  const lastStop = stops[stops.length - 1];
  if (offset >= lastStop.offset) {
    return { ...lastStop, offset };
  }

  for (let index = 1; index < stops.length; index += 1) {
    const previous = stops[index - 1];
    const next = stops[index];
    if (offset <= next.offset) {
      const span = next.offset - previous.offset;
      const t = span > 0 ? (offset - previous.offset) / span : 0;
      return {
        offset,
        r: lerp(previous.r, next.r, t),
        g: lerp(previous.g, next.g, t),
        b: lerp(previous.b, next.b, t),
        a: lerp(previous.a, next.a, t),
      };
    }
  }

  return { ...lastStop, offset };
}

function toColorString(color: ColorStop): string {
  const r = Math.round(color.r);
  const g = Math.round(color.g);
  const b = Math.round(color.b);
  const alpha = Number(color.a.toFixed(3));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildGradientStops(
  stops: readonly ColorStop[],
  minDb: number,
  maxDb: number
): GradientStop[] {
  const start = normalizeDb(minDb);
  const end = normalizeDb(maxDb);
  if (end <= start + Number.EPSILON) {
    const color = toColorString(sampleStop(stops, start));
    return [
      { offset: 0, color },
      { offset: 1, color },
    ];
  }

  const scaledStops: GradientStop[] = [
    { offset: 0, color: toColorString(sampleStop(stops, start)) },
  ];

  for (const stop of stops) {
    if (stop.offset <= start || stop.offset >= end) {
      continue;
    }
    scaledStops.push({
      offset: (stop.offset - start) / (end - start),
      color: toColorString(stop),
    });
  }

  scaledStops.push({
    offset: 1,
    color: toColorString(sampleStop(stops, end)),
  });

  return scaledStops;
}

export function buildSignalMeterGradientStops(
  minDb: number,
  maxDb: number
): GradientStop[] {
  return buildGradientStops(METER_STOPS, minDb, maxDb);
}

export function toCssLinearGradient(stops: readonly GradientStop[]): string {
  const gradientStops = stops
    .map((stop) => `${stop.color} ${(stop.offset * 100).toFixed(2)}%`)
    .join(", ");
  return `linear-gradient(90deg, ${gradientStops})`;
}
