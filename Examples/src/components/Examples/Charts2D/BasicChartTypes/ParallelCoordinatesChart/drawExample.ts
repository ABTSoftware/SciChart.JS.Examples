import {
    EAxisType,
    EXyDirection,
    IRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    RubberBandXyZoomModifier,
    SciChartSurface,
    SeriesSelectionModifier,
    SplineLineRenderableSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme } from "../../../theme";
import { ParallelCoordinateAxisReorderModifier } from "./ParallelCoordinateAxisReorderModifier";
import { ParallelCoordinateCursorModifier } from "./ParallelCoordinateCursorModifier";
import { ParallelCoordinateDataSource, PCP_HIDDEN_YAXIS_ID } from "./ParallelCoordinateDataSource";
import { ParallelCoordinatePlotHighlightModifier } from "./ParallelCoordinatePlotHighlightModifier";
import { ParallelCoordinateRecordSelectionModifier } from "./ParallelCoordinateRecordSelectionModifier";
import { ParallelCoordinateSingleHighlightModifier } from "./ParallelCoordinateSingleHighlightModifier";
import { SplineLineHitTestProvider } from "./SplineLineHitTestProvider";
import { createParallelCoordinateTooltipDataTemplate } from "./parallelCoordinateTooltipDataTemplate";

const originList = ["USA", "Europe", "Japan"];

// Per-origin engine profiles reproduce the classic auto-mpg relationships:
// USA cars trend to big engines / low mpg, European and Japanese cars to smaller engines / higher mpg.
const originProfiles: Record<string, { minCyl: number; maxCyl: number }> = {
    USA: { minCyl: 6, maxCyl: 8 },
    Europe: { minCyl: 4, maxCyl: 6 },
    Japan: { minCyl: 3, maxCyl: 4 },
};

const originColors: Record<string, string> = {
    USA: appTheme.VividOrange,
    Europe: appTheme.VividSkyBlue,
    Japan: appTheme.VividTeal,
};

// Mulberry32 - a small deterministic PRNG so the generated dataset is reproducible
const createSeededRandom = (seed: number) => {
    let state = seed;
    return () => {
        state |= 0;
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

interface ICarsData {
    origins: string[];
    mpg: number[];
    cylinders: number[];
    displacement: number[];
    horsepower: number[];
    weight: number[];
    acceleration: number[];
}

// Generate a synthetic "Cars" dataset of recordCount records. Uses a seeded PRNG so the data is reproducible.
const generateData = (recordCount: number): ICarsData => {
    const random = createSeededRandom(1972);
    const data: ICarsData = {
        origins: [],
        mpg: [],
        cylinders: [],
        displacement: [],
        horsepower: [],
        weight: [],
        acceleration: [],
    };
    for (let i = 0; i < recordCount; i++) {
        const origin = originList[i % originList.length];
        const profile = originProfiles[origin];
        // Correlated values: cylinders drives displacement -> horsepower -> weight; mpg and acceleration fall
        // as the engine grows.
        const cyl = Math.round(profile.minCyl + random() * (profile.maxCyl - profile.minCyl));
        const disp = Math.round((60 + cyl * 45) * (0.85 + random() * 0.3));
        const hp = Math.round(disp * (0.4 + random() * 0.25));
        const wt = Math.round(1400 + disp * 6 * (0.85 + random() * 0.3));
        const mpgVal = Math.max(9, Math.round(46 - hp * 0.12 - cyl * 1.5 + random() * 6));
        const accel = Math.round((26 - hp * 0.05 + random() * 4) * 10) / 10;
        data.origins.push(origin);
        data.cylinders.push(cyl);
        data.displacement.push(disp);
        data.horsepower.push(hp);
        data.weight.push(wt);
        data.mpg.push(mpgVal);
        data.acceleration.push(accel);
    }
    return data;
};

const addCategories = (source: ParallelCoordinateDataSource, data: ICarsData): void => {
    source.addCategory("mpg", data.mpg, EAxisType.NumericAxis);
    source.addCategory("cylinders", data.cylinders, EAxisType.NumericAxis);
    source.addCategory("displacement", data.displacement, EAxisType.NumericAxis);
    source.addCategory("horsepower", data.horsepower, EAxisType.NumericAxis);
    source.addCategory("weight", data.weight, EAxisType.NumericAxis);
    source.addCategory("acceleration", data.acceleration, EAxisType.NumericAxis);
    source.addCategory("origin", data.origins, EAxisType.CategoryAxis);
};

export const MULTI_SERIES_RECORD_COUNT = 100;
export const SINGLE_SERIES_RECORD_COUNT = 100000;

/**
 * Multi-series: one renderable series per record (100 records). Each line can be hovered/clicked with
 * the {@link SeriesSelectionModifier}, which highlights that record via onSelectedChanged/onHoveredChanged.
 * Drag a range on one of the category axes with the {@link ParallelCoordinatePlotHighlightModifier} to highlight
 * all records passing through that range (click to clear).
 */
export const drawMultiSeriesExample = async (rootElement: string | HTMLDivElement, interpolate: boolean = false) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    const xAxis = new NumericAxis(wasmContext, { drawLabels: false, growBy: new NumberRange(0.07, 0.07) });
    sciChartSurface.xAxes.add(xAxis);

    const carsData = generateData(MULTI_SERIES_RECORD_COUNT);
    const data = new ParallelCoordinateDataSource(wasmContext, sciChartSurface, {
        useSingleSeries: false,
        pointMarkerSize: 0,
    });
    addCategories(data, carsData);

    // Bold + opaque when selected or hovered, faint otherwise; keeps the origin colour.
    const applySelectionStyle = (series: IRenderableSeries) => {
        series.strokeThickness = series.isSelected ? 4 : series.isHovered ? 3 : 2;
        series.opacity = series.isSelected || series.isHovered ? 1 : 0.5;
    };
    data.createSeriesFn = (index) => ({
        // interpolationPoints > 0 -> SplineLineRenderableSeries (smooth curves); 0 -> straight segments
        interpolationPoints: interpolate ? 5 : 0,
        stroke: originColors[carsData.origins[index]],
        strokeThickness: 2,
        opacity: 0.5,
        onSelectedChanged: applySelectionStyle,
        onHoveredChanged: applySelectionStyle,
    });
    data.build();

    // Spline series render a curve that bows away from the straight chords the default line hit-test uses, so
    // hover/selection would miss the visible line. Swap in a provider that tests against the spline points.
    if (interpolate) {
        data.renderableSeries.forEach((series) => {
            if (series instanceof SplineLineRenderableSeries) {
                series.hitTestProvider = new SplineLineHitTestProvider(series, wasmContext);
            }
        });
    }

    // Both left-drag modifiers share the same gesture, so they are exposed as independent toggles in the demo
    // UI and both start disabled - enable at most one at a time.
    const highlightModifier = new ParallelCoordinatePlotHighlightModifier(data);
    highlightModifier.isEnabled = false;
    // X-only rubber-band zoom: EXyDirection.XDirection makes getRubberBandRect span the full Y height, so only
    // the horizontal drag extent matters.
    const rubberBandZoomModifier = new RubberBandXyZoomModifier({ xyDirection: EXyDirection.XDirection });
    rubberBandZoomModifier.isEnabled = false;
    // Drag a category axis left/right to reorder the dimensions (reorders categories + rebuilds the source).
    const axisReorderModifier = new ParallelCoordinateAxisReorderModifier(data);
    axisReorderModifier.isEnabled = false;
    const panModifier = new ZoomPanModifier({ xyDirection: EXyDirection.XDirection });
    panModifier.isEnabled = false;
    // Hover/click a record line to select it (drives the per-series onHovered/onSelectedChanged styling above).
    const seriesSelectionModifier = new SeriesSelectionModifier({ enableHover: true, enableSelection: true });
    seriesSelectionModifier.isEnabled = false;
    // Hover tooltip showing the nearest record's values (independent of the left-drag group).
    const cursorModifier = new ParallelCoordinateCursorModifier({
        showAxisLabels: false,
        showTooltip: true,
        hitTestRadius: 2000,
        tooltipDataTemplate: createParallelCoordinateTooltipDataTemplate(data),
        isSvgOnly: true,
    });
    cursorModifier.isEnabled = false;

    sciChartSurface.chartModifiers.add(
        highlightModifier,
        rubberBandZoomModifier,
        axisReorderModifier,
        panModifier,
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ includedYAxisIds: [PCP_HIDDEN_YAXIS_ID] }),
        seriesSelectionModifier,
        cursorModifier
    );

    return {
        wasmContext,
        sciChartSurface,
        highlightModifier,
        rubberBandZoomModifier,
        axisReorderModifier,
        panModifier,
        seriesSelectionModifier,
        cursorModifier,
    };
};

/**
 * Single-series: all 100,000 records drawn by one renderable series (NaN gaps between records) for
 * performance. The {@link ParallelCoordinateCursorModifier} hit-tests the nearest record and shows all its values.
 */
export const drawSingleSeriesExample = async (rootElement: string | HTMLDivElement, interpolate: boolean = false) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    const xAxis = new NumericAxis(wasmContext, { drawLabels: false, growBy: new NumberRange(0.07, 0.07) });
    sciChartSurface.xAxes.add(xAxis);

    const carsData = generateData(SINGLE_SERIES_RECORD_COUNT);
    const data = new ParallelCoordinateDataSource(wasmContext, sciChartSurface, { useSingleSeries: true });
    addCategories(data, carsData);
    data.createSeriesFn = (index) => ({
        // interpolationPoints > 0 -> spline curves; 0 -> straight segments
        interpolationPoints: interpolate ? 5 : 0,
        stroke: originColors[carsData.origins[index]],
        strokeThickness: 2,
        opacity: 0.02,
    });
    data.build();

    // In spline mode the drawn curve bows away from the straight chords the default hit-test uses, so swap in a
    // provider that tests the spline points (and maps the hit back to a source point -> record for selection).
    if (interpolate) {
        const single = data.renderableSeries[0];
        if (single instanceof SplineLineRenderableSeries) {
            single.hitTestProvider = new SplineLineHitTestProvider(single, wasmContext);
        }
    }

    // All modifiers start disabled and are driven by the demo UI toggles (see index.tsx).
    const cursorModifier = new ParallelCoordinateCursorModifier({
        showAxisLabels: false,
        showTooltip: true,
        // hit-test the nearest data point in coordinate space, then show every value for its record
        hitTestRadius: 2000,
        tooltipDataTemplate: createParallelCoordinateTooltipDataTemplate(data),
        isSvgOnly: true,
    });
    cursorModifier.isEnabled = false;
    // Left-drag group (mutually exclusive, enforced in the UI): pan, X-only rubber-band zoom, axis reorder.
    const panModifier = new ZoomPanModifier({ xyDirection: EXyDirection.XDirection });
    panModifier.isEnabled = false;
    const rubberBandZoomModifier = new RubberBandXyZoomModifier({ xyDirection: EXyDirection.XDirection });
    rubberBandZoomModifier.isEnabled = false;
    const axisReorderModifier = new ParallelCoordinateAxisReorderModifier(data);
    axisReorderModifier.isEnabled = false;
    // Click a record polyline to select it: highlights that record and dims the rest via the palette provider
    // (single-series has no per-record series, so selection is done by paletting a subset of data points).
    const recordSelectionModifier = new ParallelCoordinateRecordSelectionModifier(data);
    recordSelectionModifier.isEnabled = false;
    // Range highlight: drag over a Y axis to highlight records passing through the range (palette-based).
    const highlightModifier = new ParallelCoordinateSingleHighlightModifier(data);
    highlightModifier.isEnabled = false;

    sciChartSurface.chartModifiers.add(
        cursorModifier,
        panModifier,
        rubberBandZoomModifier,
        axisReorderModifier,
        highlightModifier,
        recordSelectionModifier,
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ includedYAxisIds: [PCP_HIDDEN_YAXIS_ID] })
    );

    return {
        wasmContext,
        sciChartSurface,
        cursorModifier,
        panModifier,
        rubberBandZoomModifier,
        axisReorderModifier,
        highlightModifier,
        recordSelectionModifier,
    };
};

export const drawExample = drawMultiSeriesExample;
