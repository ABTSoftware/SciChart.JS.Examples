import { SciChartSurface } from "scichart";

let configured = false;

export function ensureSciChartWasmConfigured(): void {
  if (configured) {
    return;
  }

  // Use explicit URLs so loading works consistently in Vite dev/build and subpath deployments.
  const base = import.meta.env.BASE_URL ?? "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  SciChartSurface.configure({
    wasmUrl: `${normalizedBase}scichart/scichart.wasm`,
    wasmNoSimdUrl: `${normalizedBase}scichart/scichart-nosimd.wasm`,
  });

  configured = true;
}
