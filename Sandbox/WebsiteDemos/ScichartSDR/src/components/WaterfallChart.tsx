import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  EAxisAlignment,
  HeatmapColorMap,
  NumericAxis,
  NumberRange,
  SciChartSurface,
  Thickness,
  UniformHeatmapDataSeries,
  UniformHeatmapRenderableSeries,
} from "scichart";
import { withSciChartCreateLock } from "./scichartCreateLock";
import { ensureSciChartWasmConfigured } from "./scichartWasm";

type WaterfallChartProps = {
  frequencyHz: number;
  sampleRate: number;
  zoomLevel: number;
  fftSize: number;
  rows: number;
  decimation: number;
  minDb: number;
  maxDb: number;
  spectrumDb: Float64Array | null;
  onTune: (frequencyHz: number) => void;
  onError: (message: string) => void;
  onReadyChange?: (ready: boolean) => void;
};

type WaterfallRenderState = {
  fftSize: number;
  frequencyHz: number;
  maxDb: number;
  minDb: number;
  rows: number;
  sampleRate: number;
  visibleMaxHz: number;
  visibleMinHz: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}


function getChartErrorMessage(exception: unknown): string {
  if (!exception || typeof exception !== "object") {
    return String(exception);
  }
  const error = exception as { message?: string; cause?: unknown };
  if (typeof error.message === "string" && error.message.length > 0) {
    return error.message;
  }
  return String(error.cause ?? exception);
}

function makeFallbackRows(rowCount: number, colCount: number, minDb: number, maxDb: number): number[][] {
  const rows = new Array<number[]>(rowCount);
  for (let r = 0; r < rowCount; r += 1) {
    const row = new Array<number>(colCount);
    for (let c = 0; c < colCount; c += 1) {
      const base = minDb + 16 + 8 * Math.sin(c / 42) + 4 * Math.cos((r + c) / 23);
      row[c] = clamp(base, minDb, maxDb);
    }
    rows[r] = row;
  }
  return rows;
}

export function WaterfallChart({
  frequencyHz,
  sampleRate,
  zoomLevel,
  fftSize,
  rows,
  decimation,
  minDb,
  maxDb,
  spectrumDb,
  onTune,
  onError,
  onReadyChange,
}: WaterfallChartProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const surfaceRef = useRef<SciChartSurface | null>(null);
  const xAxisRef = useRef<NumericAxis | null>(null);
  const dataSeriesRef = useRef<UniformHeatmapDataSeries | null>(null);
  const rowsRef = useRef<number[][]>(makeFallbackRows(rows, fftSize, minDb, maxDb));
  const frameCountRef = useRef(0);
  const lastRenderMsRef = useRef(0);

  const visibleSpanHz = sampleRate / clamp(zoomLevel, 1, 4);
  const visibleMinHz = frequencyHz - visibleSpanHz / 2;
  const visibleMaxHz = frequencyHz + visibleSpanHz / 2;
  const renderStateRef = useRef<WaterfallRenderState>({
    fftSize,
    frequencyHz,
    maxDb,
    minDb,
    rows,
    sampleRate,
    visibleMaxHz,
    visibleMinHz,
  });

  useLayoutEffect(() => {
    renderStateRef.current = {
      fftSize,
      frequencyHz,
      maxDb,
      minDb,
      rows,
      sampleRate,
      visibleMaxHz,
      visibleMinHz,
    };
  }, [fftSize, frequencyHz, maxDb, minDb, rows, sampleRate, visibleMaxHz, visibleMinHz]);

  const resetWaterfallSurface = useCallback(() => {
    const xAxis = xAxisRef.current;
    const dataSeries = dataSeriesRef.current;
    if (!xAxis || !dataSeries) {
      return;
    }

    const state = renderStateRef.current;
    rowsRef.current = makeFallbackRows(
      state.rows,
      state.fftSize,
      state.minDb,
      state.maxDb,
    );
    frameCountRef.current = 0;
    lastRenderMsRef.current = 0;
    dataSeries.xStart = state.frequencyHz - state.sampleRate / 2;
    dataSeries.xStep = state.sampleRate / state.fftSize;
    xAxis.visibleRange = new NumberRange(state.visibleMinHz, state.visibleMaxHz);
    dataSeries.setZValues(rowsRef.current);
    surfaceRef.current?.invalidateElement();
  }, []);

  // One-time SciChart surface initialization; dynamic updates are handled by separate effects.
  useEffect(() => {
    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;

    const initChart = async () => {
      if (!hostRef.current || surfaceRef.current) {
        return;
      }
      ensureSciChartWasmConfigured();

      // Wait briefly for layout so SciChart doesn't initialize on a 0-height host.
      for (let i = 0; i < 10; i += 1) {
        const rect = hostRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          break;
        }
        await new Promise((resolve) => window.setTimeout(resolve, 16));
      }

      const host = hostRef.current;
      if (!host) {
        return;
      }
      const { sciChartSurface, wasmContext } = await withSciChartCreateLock(() =>
        SciChartSurface.createSingle(host),
      );
      const initialState = renderStateRef.current;

      if (disposed) {
        sciChartSurface.delete();
        return;
      }

      sciChartSurface.padding = Thickness.fromNumber(0);
      sciChartSurface.background = "#04102a";

      const xAxis = new NumericAxis(wasmContext, {
        isVisible: false,
        drawLabels: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        drawMajorBands: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        axisThickness: 0,
      });
      const yAxis = new NumericAxis(wasmContext, {
        isVisible: false,
        axisAlignment: EAxisAlignment.Left,
        axisThickness: 0,
        drawLabels: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMajorBands: false,
        flippedCoordinates: true,
      });
      yAxis.visibleRange = new NumberRange(0, initialState.rows);

      sciChartSurface.xAxes.add(xAxis);
      sciChartSurface.yAxes.add(yAxis);

      const dataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: initialState.frequencyHz - initialState.sampleRate / 2,
        xStep: initialState.sampleRate / initialState.fftSize,
        yStart: 0,
        yStep: 1,
        zValues: rowsRef.current,
      });

      sciChartSurface.renderableSeries.add(
        new UniformHeatmapRenderableSeries(wasmContext, {
          dataSeries,
          colorMap: new HeatmapColorMap({
            minimum: initialState.minDb,
            maximum: initialState.maxDb,
            gradientStops: [
              { offset: 0, color: "#031132" },
              { offset: 0.18, color: "#15499e" },
              { offset: 0.36, color: "#0f8c85" },
              { offset: 0.52, color: "#7bcf4f" },
              { offset: 0.66, color: "#f0d66e" },
              { offset: 0.8, color: "#ec9646" },
              { offset: 0.9, color: "#db36ea" },
              { offset: 1, color: "#eef5f9" },
            ],
          }),
        }),
      );

      surfaceRef.current = sciChartSurface;
      xAxisRef.current = xAxis;
      dataSeriesRef.current = dataSeries;
      resetWaterfallSurface();

      if (hostRef.current) {
        resizeObserver = new ResizeObserver(() => {
          surfaceRef.current?.invalidateElement();
        });
        resizeObserver.observe(hostRef.current);
      }

      onReadyChange?.(true);
    };

    void initChart().catch((exception) => {
      onError(`Chart initialization failed: ${getChartErrorMessage(exception)}`);
    });

    return () => {
      disposed = true;
      surfaceRef.current?.delete();
      surfaceRef.current = null;
      xAxisRef.current = null;
      dataSeriesRef.current = null;
      resizeObserver?.disconnect();
      resizeObserver = null;
      onReadyChange?.(false);
    };
  }, [onError, onReadyChange, resetWaterfallSurface]);

  useEffect(() => {
    resetWaterfallSurface();
  }, [resetWaterfallSurface, fftSize, frequencyHz, maxDb, minDb, rows, sampleRate, visibleMaxHz, visibleMinHz]);

  useEffect(() => {
    if (!spectrumDb || spectrumDb.length !== fftSize) return;

    frameCountRef.current += 1;
    if (frameCountRef.current % decimation !== 0) return;

    const now = performance.now();
    if (now - lastRenderMsRef.current < 16) return; // cap at ~60fps
    lastRenderMsRef.current = now;

    const nextRow = Array.from(spectrumDb, (value) => clamp(value, minDb, maxDb));
    rowsRef.current.pop();
    rowsRef.current.unshift(nextRow);

    const dataSeries = dataSeriesRef.current;
    if (!dataSeries) return;
    dataSeries.setZValues(rowsRef.current);
    surfaceRef.current?.invalidateElement();
  }, [decimation, fftSize, maxDb, minDb, spectrumDb]);

  const handleChartPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    onTune(Math.max(100_000, Math.round(visibleMinHz + ratio * visibleSpanHz)));
  };

  const handleChartPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.buttons === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    onTune(Math.max(100_000, Math.round(visibleMinHz + ratio * visibleSpanHz)));
  };

  return (
    <div
      ref={hostRef}
      id="scichart-waterfall"
      className="chart-host waterfall-host"
      onPointerDown={handleChartPointerDown}
      onPointerMove={handleChartPointerMove}
    />
  );
}
