// A candlestick chart that turns into a footprint chart when you zoom in.
//
// Each footprint is drawn with plain SciChart series on the same surface as the candles:
//   fpSeries   rectangles: sell volume left of the candle, buy volume right of it
//   pocSeries  rectangles: a yellow outline on each candle's busiest price level
//   fpText     text: the volume numbers, once there's room for them
//
// Whenever the visible range changes we check how big the candles are on screen and switch modes.

import {
  SciChartSurface,
  SciChartJSDarkTheme,
  DateTimeNumericAxis,
  NumericAxis,
  NumberRange,
  EAxisAlignment,
  EAutoRange,
  ENumericFormat,
  OhlcDataSeries,
  FastCandlestickRenderableSeries,
  XyxyDataSeries,
  FastRectangleRenderableSeries,
  EColumnMode,
  EColumnYMode,
  XyTextDataSeries,
  FastTextRenderableSeries,
  DefaultPaletteProvider,
  NumericLabelProvider,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  ZoomExtentsModifier,
  XAxisDragModifier,
  YAxisDragModifier,
  ModifierMouseArgs,
  CursorModifier,
  AnnotationHoverModifier,
  ECursorStyle,
  EXyDirection,
  Thickness,
} from "scichart";
import { OrderFlowData, Candles, FootprintCell } from "./data";
import { argb, decimalsFor, formatCursorTime, lowerBound, niceStep } from "./utils";

export const TIMEFRAMES = [
  { label: "15s", k: 1 },
  { label: "1m", k: 4 },
  { label: "5m", k: 20 },
];

// Candles become footprints when they're at least this wide and (typically) this tall on screen
const FOOTPRINT_MIN_WIDTH_PX = 14;
const FOOTPRINT_MIN_HEIGHT_PX = 24;
// Volume numbers need a bit more room
const TEXT_MIN_WIDTH_PX = 64;
const TEXT_MIN_HEIGHT_PX = 9;

export type ViewInfo = { mode: "Candles" | "Footprint"; timeframe: string; visibleCandles: number; bucket: number };

export type FootprintChartControls = {
  setTimeframe: (index: number) => void;
  resetZoom: () => void;
  setShowCandlesInFootprint: (on: boolean) => void;
};

/** "$108.55K". Uses as many decimals as the tick step needs, and the crosshair label matches. */
class PriceLabelProvider extends NumericLabelProvider {
  constructor() {
    super({ labelFormat: ENumericFormat.Engineering, cursorLabelFormat: ENumericFormat.Engineering, labelPrefix: "$" });
  }
  getLabels(ticks: number[]) {
    if (ticks.length > 1) {
      const decimals = decimalsFor((ticks[1] - ticks[0]) / 1000); // labels are in thousands
      if (decimals !== this.precision) {
        this.precision = decimals;
        this.cursorPrecision = decimals;
      }
    }
    return super.getLabels(ticks);
  }
}

/** Dragging the price axis stops it auto-fitting, so the drag sticks. */
class PriceAxisDragModifier extends YAxisDragModifier {
  modifierMouseDown(args: ModifierMouseArgs) {
    super.modifierMouseDown(args);
    if (this.isClickedOverYAxis) this.parentSurface.yAxes.asArray().forEach((a) => (a.autoRange = EAutoRange.Never));
  }
}

/** One colour per rectangle, from an array we fill in ourselves. */
class ArrayPaletteProvider extends DefaultPaletteProvider {
  colors = new Uint32Array(0) as Uint32Array;
  private changed = true;
  get isRangeIndependant() {
    return true;
  }
  setColors(colors: Uint32Array) {
    this.colors = colors;
    this.changed = true;
  }
  shouldUpdatePalette() {
    const c = this.changed;
    this.changed = false;
    return c;
  }
  overrideFillArgb(_x: number, _y: number, index: number) {
    return this.colors[index];
  }
  overrideStrokeArgb(_x: number, _y: number, index: number) {
    return this.colors[index];
  }
}

export async function createFootprintChart(
  rootElement: string | HTMLDivElement,
  data: OrderFlowData,
  onViewChanged: (info: ViewInfo) => void
) {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
    theme: new SciChartJSDarkTheme(),
  });

  // ------ axes ------
  const gridStyle = { color: "#ffffff10", strokeThickness: 1, strokeDashArray: [4, 4] };
  const xAxis = new DateTimeNumericAxis(wasmContext, {
    visibleRange: new NumberRange(data.startS, data.endS),
    drawMajorBands: false,
    drawMinorGridLines: false,
    majorGridLineStyle: gridStyle,
  });
  xAxis.labelProvider.formatCursorLabel = formatCursorTime;

  const yAxis = new NumericAxis(wasmContext, {
    axisAlignment: EAxisAlignment.Right,
    autoRange: EAutoRange.Always, // fit the visible candles
    growBy: new NumberRange(0.06, 0.06),
    drawMajorBands: false,
    drawMinorGridLines: false,
    majorGridLineStyle: gridStyle,
    labelProvider: new PriceLabelProvider(),
  });
  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);
  const fitPrice = () => (yAxis.autoRange = EAutoRange.Always);

  // ------ series ------
  const ohlc = new OhlcDataSeries(wasmContext, { dataIsSortedInX: true, containsNaN: false });
  const candleSeries = new FastCandlestickRenderableSeries(wasmContext, {
    dataSeries: ohlc,
    strokeThickness: 1,
    dataPointWidth: 0.7,
    brushUp: "#26a69aee",
    brushDown: "#ef5350ee",
    strokeUp: "#26a69a",
    strokeDown: "#ef5350",
  });

  const fpPalette = new ArrayPaletteProvider();
  const fpData = new XyxyDataSeries(wasmContext, { containsNaN: false, dataIsSortedInX: false });
  const fpSeries = new FastRectangleRenderableSeries(wasmContext, {
    dataSeries: fpData,
    columnXMode: EColumnMode.StartEnd,
    columnYMode: EColumnYMode.TopBottom,
    strokeThickness: 0,
    paletteProvider: fpPalette,
    isVisible: false,
  });
  const pocData = new XyxyDataSeries(wasmContext, { containsNaN: false, dataIsSortedInX: false });
  const pocSeries = new FastRectangleRenderableSeries(wasmContext, {
    dataSeries: pocData,
    columnXMode: EColumnMode.StartEnd,
    columnYMode: EColumnYMode.TopBottom,
    fill: "#00000000",
    stroke: "#ffd54a",
    strokeThickness: 1,
    isVisible: false,
  });
  const textData = new XyTextDataSeries(wasmContext, { containsNaN: false, dataIsSortedInX: false });
  const fpText = new FastTextRenderableSeries(wasmContext, {
    dataSeries: textData,
    isVisible: false,
    dataLabels: { style: { fontSize: 9, fontFamily: "Arial" }, color: "#f2f5fa", calculateTextBounds: false },
  });
  // Footprint bars first, the thin candle over them, numbers on top
  sciChartSurface.renderableSeries.add(fpSeries, pocSeries, candleSeries, fpText);

  // ------ interaction ------
  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
    new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
    new XAxisDragModifier(),
    new PriceAxisDragModifier(),
    new ZoomExtentsModifier({
      xyDirection: EXyDirection.XDirection,
      onZoomExtents: () => {
        fitPrice();
        return true;
      },
    }),
    new AnnotationHoverModifier({ enableCursor: true, idleCursor: ECursorStyle.Crosshair }),
    new CursorModifier({
      showTooltip: false,
      showAxisLabels: true,
      crosshairStroke: "#c8c8c8aa",
      crosshairStrokeThickness: 1,
      crosshairStrokeDashArray: [4, 4],
      axisLabelFill: "#4a4a4a",
      axisLabelStroke: "#ffffff",
      axisLabelPadding: new Thickness(2, 8, 2, 8),
    })
  );

  // ------ state ------
  let tfIndex = 1;
  let candles: Candles = data.candles(TIMEFRAMES[tfIndex].k);
  let footprintOn = false;
  let showCandlesInFootprint = true;
  let cells: FootprintCell[] = [];
  let built: { k: number; bucket: number; from: number; to: number } | null = null;

  const plotWidth = () => sciChartSurface.seriesViewRect.width / window.devicePixelRatio;
  const plotHeight = () => sciChartSurface.seriesViewRect.height / window.devicePixelRatio;
  const candleSeconds = () => candles.k * data.baseSeconds;
  const candleCentre = (cb: number, k: number) => data.startS + (cb + k / 2) * data.baseSeconds;

  // Don't zoom in past 4 candles. (Not xAxis.visibleRangeSizeLimit: in scichart 6.0.1 a fast trackpad
  // flick can collapse the range in a single wheel event and get past it.)
  xAxis.visibleRangeChanged.subscribe(() => {
    const { min, max } = xAxis.visibleRange;
    const minSpan = candleSeconds() * 4;
    if (max - min < minSpan) {
      const mid = (min + max) / 2;
      xAxis.visibleRange = new NumberRange(mid - minSpan / 2, mid + minSpan / 2);
    }
  });
  xAxis.visibleRangeChanged.subscribe(update);
  yAxis.visibleRangeChanged.subscribe(update);

  function update() {
    if (!sciChartSurface.seriesViewRect) return; // not drawn yet
    const xr = xAxis.visibleRange;
    const yr = yAxis.visibleRange;
    const first = lowerBound(candles.x, candles.n, xr.min - candleSeconds() / 2);
    const last = lowerBound(candles.x, candles.n, xr.max + candleSeconds() / 2);

    // Typical candle height in the view, from a sample of up to ~200 candles
    const heights: number[] = [];
    for (let i = first; i < last; i += Math.max(1, Math.floor((last - first) / 200))) {
      heights.push(candles.h[i] - candles.l[i]);
    }
    heights.sort((a, b) => a - b);
    const typicalHeight = heights[heights.length >> 1] ?? 0;

    const widthPx = (candleSeconds() / (xr.max - xr.min)) * plotWidth();
    const heightPx = (typicalHeight / (yr.max - yr.min)) * plotHeight();
    setFootprintMode(widthPx >= FOOTPRINT_MIN_WIDTH_PX && heightPx >= FOOTPRINT_MIN_HEIGHT_PX);

    // About 16 price levels per typical candle, but never less than ~6px tall
    const bucket = Math.max(niceStep(typicalHeight / 16), niceStep((yr.max - yr.min) / (plotHeight() / 6)));
    if (footprintOn) {
      buildFootprint(bucket);
      buildText();
    }
    onViewChanged({
      mode: footprintOn ? "Footprint" : "Candles",
      timeframe: TIMEFRAMES[tfIndex].label,
      visibleCandles: last - first,
      bucket,
    });
  }

  function setFootprintMode(on: boolean) {
    if (on === footprintOn) return;
    footprintOn = on;
    fpSeries.isVisible = on;
    pocSeries.isVisible = on;
    fpText.isVisible = false;
    candleSeries.dataPointWidth = on ? 0.06 : 0.7; // a thin line through the footprint
    candleSeries.isVisible = !on || showCandlesInFootprint;
  }

  // ------ footprint ------
  function buildFootprint(bucket: number) {
    // Only the candles on screen, so off-screen bars don't stretch the price axis fit
    const k = candles.k;
    const xr = xAxis.visibleRange;
    const from = Math.max(0, Math.floor((xr.min - data.startS) / data.baseSeconds / k) * k);
    const to = Math.ceil((xr.max - data.startS) / data.baseSeconds / k) * k - 1;
    if (built && built.k === k && built.bucket === bucket && built.from === from && built.to === to) return;
    cells = data.footprint(k, bucket, from, to);
    built = { k, bucket, from, to };

    // Largest volume and busiest level per candle
    const maxVolume = new Map<number, number>();
    const busiest = new Map<number, FootprintCell>();
    const levels = new Map<number, number>();
    for (const c of cells) {
      maxVolume.set(c.cb, Math.max(maxVolume.get(c.cb) ?? 0, c.buy, c.sell));
      const b = busiest.get(c.cb);
      if (!b || c.buy + c.sell > b.buy + b.sell) busiest.set(c.cb, c);
      levels.set(c.cb, (levels.get(c.cb) ?? 0) + 1);
    }

    const x: number[] = [], y: number[] = [], x1: number[] = [], y1: number[] = [], colors: number[] = [];
    const halfWidth = candleSeconds() * 0.46;
    const gap = bucket * 0.07;
    const addBar = (left: number, right: number, c: FootprintCell, color: number) => {
      x.push(left);
      x1.push(right);
      y.push(c.pb + bucket - gap);
      y1.push(c.pb + gap);
      colors.push(color);
    };
    for (const c of cells) {
      const centre = candleCentre(c.cb, k);
      const max = maxVolume.get(c.cb) || 1;
      // Brighter when one side outweighs the other 3 to 1
      if (c.sell > 0) {
        const a = 0.3 + 0.7 * (c.sell / max);
        const color = c.sell >= 3 * c.buy ? argb(Math.min(1, a + 0.15), 255, 40, 90) : argb(a * 0.75, 200, 80, 80);
        addBar(centre - halfWidth * Math.max(0.04, c.sell / max), centre, c, color);
      }
      if (c.buy > 0) {
        const a = 0.3 + 0.7 * (c.buy / max);
        const color = c.buy >= 3 * c.sell ? argb(Math.min(1, a + 0.15), 0, 230, 150) : argb(a * 0.75, 60, 170, 150);
        addBar(centre, centre + halfWidth * Math.max(0.04, c.buy / max), c, color);
      }
    }
    fpPalette.setColors(Uint32Array.from(colors));
    fpData.clear();
    fpData.appendRange(x, y, x1, y1);

    // Point of control outline (only for candles with a few levels)
    pocData.clear();
    for (const [cb, c] of busiest) {
      if ((levels.get(cb) ?? 0) < 3) continue;
      const centre = candleCentre(cb, k);
      pocData.append(centre - halfWidth, c.pb + bucket, centre + halfWidth, c.pb);
    }
  }

  function buildText() {
    if (!built) return;
    const xr = xAxis.visibleRange;
    const yr = yAxis.visibleRange;
    const widthPx = (candleSeconds() / (xr.max - xr.min)) * plotWidth();
    const heightPx = (built.bucket / (yr.max - yr.min)) * plotHeight();
    fpText.isVisible = widthPx >= TEXT_MIN_WIDTH_PX && heightPx >= TEXT_MIN_HEIGHT_PX;
    if (!fpText.isVisible) return;

    // Text isn't clipped to the chart area, so skip numbers near the edges
    const marginX = (30 / plotWidth()) * (xr.max - xr.min);
    const marginY = (8 / plotHeight()) * (yr.max - yr.min);
    const inView = (px: number, py: number) =>
      px > xr.min + marginX && px < xr.max - marginX && py > yr.min + marginY && py < yr.max - marginY;
    const format = (v: number) => v.toFixed(v >= 100 ? 0 : v >= 10 ? 1 : 2);

    const x: number[] = [], y: number[] = [], text: string[] = [];
    const offset = candleSeconds() * 0.23;
    for (const c of cells) {
      const centre = candleCentre(c.cb, built.k);
      const mid = c.pb + built.bucket / 2;
      if (c.sell > 0 && inView(centre - offset, mid)) {
        x.push(centre - offset);
        y.push(mid);
        text.push(format(c.sell));
      }
      if (c.buy > 0 && inView(centre + offset, mid)) {
        x.push(centre + offset);
        y.push(mid);
        text.push(format(c.buy));
      }
    }
    textData.clear();
    textData.appendRange(x, y, text);
  }

  // ------ controls ------
  function setTimeframe(index: number) {
    tfIndex = index;
    candles = data.candles(TIMEFRAMES[index].k);
    ohlc.clear();
    const n = candles.n;
    ohlc.appendRange(
      candles.x.subarray(0, n),
      candles.o.subarray(0, n),
      candles.h.subarray(0, n),
      candles.l.subarray(0, n),
      candles.c.subarray(0, n)
    );
    built = null;
    fitPrice();
    update();
  }

  setTimeframe(tfIndex);

  const controls: FootprintChartControls = {
    setTimeframe,
    resetZoom: () => {
      fitPrice();
      xAxis.animateVisibleRange(new NumberRange(data.startS, data.endS), 300);
    },
    setShowCandlesInFootprint: (on) => {
      showCandlesInFootprint = on;
      candleSeries.isVisible = !footprintOn || on;
    },
  };
  return { sciChartSurface, wasmContext, controls };
}
