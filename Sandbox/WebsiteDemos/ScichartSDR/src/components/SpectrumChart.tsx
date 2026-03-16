import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  EAxisAlignment,
  EAutoRange,
  FastMountainRenderableSeries,
  GradientParams,
  NumberRange,
  NumericAxis,
  Point,
  SciChartSurface,
  Thickness,
  XyDataSeries,
} from "scichart";
import { withSciChartCreateLock } from "./scichartCreateLock";
import { ensureSciChartWasmConfigured } from "./scichartWasm";

type SpectrumChartProps = {
  frequencyHz: number;
  sampleRate: number;
  zoomLevel: number;
  fftSize: number;
  minDb: number;
  maxDb: number;
  spectrumDb: Float64Array | null;
  onTune: (frequencyHz: number) => void;
  onError: (message: string) => void;
  onReadyChange?: (ready: boolean) => void;
};

type SpectrumRenderState = {
  fftSize: number;
  frequencyHz: number;
  maxDb: number;
  minDb: number;
  sampleRate: number;
  spectrumDb: Float64Array | null;
  visibleMaxHz: number;
  visibleMinHz: number;
};

type FrequencyAxisCache = {
  bins: number;
  frequencyHz: number;
  sampleRate: number;
  values: Float64Array;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function makeFrequencyAxis(
  centerHz: number,
  sampleRate: number,
  bins: number,
): Float64Array {
  const startHz = centerHz - sampleRate / 2;
  const stepHz = sampleRate / bins;
  const x = new Float64Array(bins);
  for (let i = 0; i < bins; i += 1) {
    x[i] = startHz + i * stepHz;
  }
  return x;
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

function makeFallbackSpectrum(
  fftSize: number,
  minDb: number,
  maxDb: number,
): Float64Array {
  const out = new Float64Array(fftSize);
  for (let i = 0; i < fftSize; i += 1) {
    const value = minDb + 12 + 5 * Math.sin(i / 28) + 2.5 * Math.cos(i / 9);
    out[i] = clamp(value, minDb, maxDb);
  }
  return out;
}

export function SpectrumChart({
  frequencyHz,
  sampleRate,
  zoomLevel,
  fftSize,
  minDb,
  maxDb,
  spectrumDb,
  onTune,
  onError,
  onReadyChange,
}: SpectrumChartProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const surfaceRef = useRef<SciChartSurface | null>(null);
  const xAxisRef = useRef<NumericAxis | null>(null);
  const yAxisRef = useRef<NumericAxis | null>(null);
  const dataSeriesRef = useRef<XyDataSeries | null>(null);
  const mountainRef = useRef<FastMountainRenderableSeries | null>(null);
  const frequencyAxisCacheRef = useRef<FrequencyAxisCache>({
    bins: fftSize,
    frequencyHz,
    sampleRate,
    values: makeFrequencyAxis(frequencyHz, sampleRate, fftSize),
  });

  const safeZoom = clamp(zoomLevel, 1, 4);
  const visibleSpanHz = sampleRate / safeZoom;
  const visibleMinHz = frequencyHz - visibleSpanHz / 2;
  const visibleMaxHz = frequencyHz + visibleSpanHz / 2;
  const renderStateRef = useRef<SpectrumRenderState>({
    fftSize,
    frequencyHz,
    maxDb,
    minDb,
    sampleRate,
    spectrumDb,
    visibleMaxHz,
    visibleMinHz,
  });

  useLayoutEffect(() => {
    renderStateRef.current = {
      fftSize,
      frequencyHz,
      maxDb,
      minDb,
      sampleRate,
      spectrumDb,
      visibleMaxHz,
      visibleMinHz,
    };
  }, [fftSize, frequencyHz, maxDb, minDb, sampleRate, spectrumDb, visibleMaxHz, visibleMinHz]);

  const syncChartData = useCallback(() => {
    const surface = surfaceRef.current;
    const dataSeries = dataSeriesRef.current;
    const xAxis = xAxisRef.current;
    const yAxis = yAxisRef.current;
    const mountain = mountainRef.current;
    if (!surface || !dataSeries || !xAxis || !yAxis || !mountain) {
      return;
    }

    const state = renderStateRef.current;
    const cachedAxis = frequencyAxisCacheRef.current;
    const x =
      cachedAxis.frequencyHz === state.frequencyHz &&
      cachedAxis.sampleRate === state.sampleRate &&
      cachedAxis.bins === state.fftSize
        ? cachedAxis.values
        : (() => {
            const values = makeFrequencyAxis(
              state.frequencyHz,
              state.sampleRate,
              state.fftSize,
            );
            frequencyAxisCacheRef.current = {
              bins: state.fftSize,
              frequencyHz: state.frequencyHz,
              sampleRate: state.sampleRate,
              values,
            };
            return values;
          })();
    const y =
      state.spectrumDb && state.spectrumDb.length === state.fftSize
        ? state.spectrumDb
        : makeFallbackSpectrum(state.fftSize, state.minDb, state.maxDb);

    dataSeries.clear();
    dataSeries.appendRange(x, y);
    xAxis.visibleRange = new NumberRange(state.visibleMinHz, state.visibleMaxHz);
    yAxis.visibleRange = new NumberRange(state.minDb, state.maxDb);
    mountain.zeroLineY = state.minDb;
    surface.invalidateElement();
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

      // Wait until host has valid size before creating the WebGL surface.
      for (let i = 0; i < 180; i += 1) {
        if (!hostRef.current) {
          return;
        }
        const rect = hostRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          break;
        }
        await new Promise((resolve) => window.setTimeout(resolve, 16));
      }
      if (!hostRef.current) {
        return;
      }
      const finalRect = hostRef.current.getBoundingClientRect();
      if (finalRect.width <= 0 || finalRect.height <= 0) {
        throw new Error("Spectrum host size is zero");
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
      sciChartSurface.background = "#001225";

      const xAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Top,
        autoRange: EAutoRange.Never,
        isInnerAxis: false,
        drawLabels: true,
        drawMajorGridLines: true,
        drawMinorGridLines: true,
        drawMajorBands: false,
        drawMajorTickLines: true,
        drawMinorTickLines: true,
        axisBorder: { color: "rgba(120, 170, 230, 0.45)" },
        labelStyle: {
          color: "rgba(176, 218, 255, 0.82)",
          fontSize: 11,
        },
        majorGridLineStyle: {
          color: "rgba(140, 210, 255, 0.72)",
          strokeThickness: 1,
        },
        minorGridLineStyle: {
          color: "rgba(100, 170, 220, 0.38)",
          strokeThickness: 1,
        },
      });
      xAxis.labelProvider.formatLabel = (value: number) => (value / 1_000_000).toFixed(3);

      const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        autoRange: EAutoRange.Never,
        isInnerAxis: true,
        drawLabels: true,
        drawMajorGridLines: true,
        drawMinorGridLines: true,
        drawMajorBands: false,
        drawMajorTickLines: true,
        drawMinorTickLines: true,
        axisBorder: { color: "rgba(120, 170, 230, 0.45)" },
        labelStyle: {
          color: "rgba(176, 218, 255, 0.82)",
          fontSize: 11,
        },
        majorGridLineStyle: {
          color: "rgba(140, 210, 255, 0.72)",
          strokeThickness: 1,
        },
        minorGridLineStyle: {
          color: "rgba(100, 170, 220, 0.38)",
          strokeThickness: 1,
        },
      });

      const dataSeries = new XyDataSeries(wasmContext, {
        capacity: initialState.fftSize,
        containsNaN: false,
        dataEvenlySpacedInX: true,
        dataIsSortedInX: true,
      });
      const fillGradient = new GradientParams(new Point(0, 0), new Point(0, 1), [
        { offset: 0,    color: "rgba(242, 248, 245, 0.95)" }, // top   → bright white
        { offset: 0.10, color: "rgba(215,  57, 234, 0.90)" }, // purple
        { offset: 0.22, color: "rgba(231, 141,  68, 0.85)" }, // orange
        { offset: 0.36, color: "rgba(239, 214, 106, 0.80)" }, // yellow
        { offset: 0.50, color: "rgba( 98, 192,  88, 0.70)" }, // green
        { offset: 0.66, color: "rgba( 15, 127, 128, 0.55)" }, // teal
        { offset: 0.82, color: "rgba( 18,  64, 158, 0.40)" }, // blue
        { offset: 1,    color: "rgba(  4,  17,  47, 0.15)" }, // bottom → near-black
      ]);
      const mountain = new FastMountainRenderableSeries(wasmContext, {
        dataSeries,
        stroke: "rgba(140, 220, 255, 0.85)",
        strokeThickness: 1.5,
        fillLinearGradient: fillGradient,
        zeroLineY: initialState.minDb,
      });

      sciChartSurface.xAxes.add(xAxis);
      sciChartSurface.yAxes.add(yAxis);
      sciChartSurface.renderableSeries.add(mountain);

      surfaceRef.current = sciChartSurface;
      xAxisRef.current = xAxis;
      yAxisRef.current = yAxis;
      dataSeriesRef.current = dataSeries;
      mountainRef.current = mountain;

      syncChartData();

      if (hostRef.current) {
        resizeObserver = new ResizeObserver(() => {
          if (!surfaceRef.current) {
            return;
          }
          surfaceRef.current.invalidateElement();
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
      yAxisRef.current = null;
      dataSeriesRef.current = null;
      mountainRef.current = null;
      resizeObserver?.disconnect();
      resizeObserver = null;
      onReadyChange?.(false);
    };
  }, [onError, onReadyChange, syncChartData]);

  useEffect(() => {
    syncChartData();
  }, [syncChartData, fftSize, frequencyHz, maxDb, minDb, sampleRate, spectrumDb, visibleMaxHz, visibleMinHz]);

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
    <div className="spectrum-layer">
      <div
        ref={hostRef}
        id="scichart-spectrum"
        className="chart-host spectrum-host"
        onPointerDown={handleChartPointerDown}
        onPointerMove={handleChartPointerMove}
      />
    </div>
  );
}
