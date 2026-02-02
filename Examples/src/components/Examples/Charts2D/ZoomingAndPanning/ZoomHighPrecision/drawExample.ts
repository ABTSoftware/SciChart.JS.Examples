import {
    DateTimeNumericAxis,
    EllipsePointMarker,
    isRealNumber,
    MouseWheelZoomModifier,
    RubberBandXyZoomModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
    XyDataSeries,
    NumericAxis,
    FastLineRenderableSeries,
    SciChartSurface,
    NumberRange,
    EAutoRange,
    EAxisAlignment,
    EExecuteOn,
    deleteSafe,
    SmartDateLabelProvider,
    EHighPrecisionLabelMode,
    EDatePrecision,
    formatNumber,
    ENumericFormat,
} from "scichart";
import { TDatasetId, createDatasets } from "./createDatasets";
import { getIndicesRange } from "scichart/Charting/Model/BaseDataSeries";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const xAxis = new DateTimeNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Bottom,
        useNativeText: true,
        growBy: new NumberRange(0.05, 0.05),
        labelProvider: new SmartDateLabelProvider({
            datePrecision: EDatePrecision.Seconds,
            highPrecisionLabelMode: EHighPrecisionLabelMode.Suffix,

            showWiderDateOnFirstLabel: true,
            showYearOnWiderDate: true,

            showSecondsOnPreciseDate: true,
            showSecondsOnWideDate: false,
        }),
    });

    // Special handling for huge dates that do not fit in standard JS Date object
    const sdlp = xAxis.labelProvider as SmartDateLabelProvider;
    const YEAR = 86400 * 365.25;
    const originalWideDateFormatter = sdlp.formatDateWide.bind(sdlp);
    const originalPreciseDateFormatter = sdlp.formatDatePrecise.bind(sdlp);

    sdlp.formatDateWide = (labelRange: string, valueInSeconds: number): string => {
        // even with huge values, use k, m, b suffixes for thousands, millions, billions or years
        if (valueInSeconds > YEAR * 9999) {
            return "Year " + formatNumber(valueInSeconds / YEAR, ENumericFormat.Engineering, 1); // e.g. "Year 500M" -> year 500 million
        }
        return originalWideDateFormatter(labelRange, valueInSeconds);
    };
    sdlp.formatDatePrecise = (labelRange: string, valueInSeconds: number, rawValue?: number): string => {
        if (valueInSeconds > YEAR * 9999) {
            const cutTime = valueInSeconds % 86400; // a bit of a hack, since we can't format dates hours from year 500 Million :)
            return originalPreciseDateFormatter(labelRange, cutTime, rawValue);
        }
        return originalPreciseDateFormatter(labelRange, valueInSeconds, rawValue);
    };
    sciChartSurface.xAxes.add(xAxis);

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.1, 0.1),
            labelPrecision: 3,
            autoRange: EAutoRange.Always,
        })
    );

    const datasets = createDatasets();
    let currentDataset = datasets[3]; // the NanoSeconds one

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: currentDataset.xValues,
            yValues: currentDataset.yValues,
            containsNaN: false,
            isSorted: true,
        }),
        stroke: appTheme.VividOrange,
        strokeThickness: 2,
        pointMarker: new EllipsePointMarker(wasmContext, {
            fill: appTheme.ForegroundColor,
        }),
    });

    sciChartSurface.renderableSeries.add(lineSeries);

    // Add modifiers
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new RubberBandXyZoomModifier({ executeCondition: { button: EExecuteOn.MouseRightButton } })
    );
    sciChartSurface.zoomExtents();

    return {
        wasmContext,
        sciChartSurface,
        controls: {
            zoomInPrecise: () => {
                const clusterIndex = currentDataset.id === "secondPrecision" ? 2 : 15;
                const pointsPerCluster = 10;

                const dataSeries = lineSeries.dataSeries as XyDataSeries;
                const xValues = dataSeries.getNativeXValues();

                const startDataIndex = clusterIndex * pointsPerCluster;
                const endDataIndex = startDataIndex + (pointsPerCluster - 1);

                if (endDataIndex >= xValues.size()) return;

                const minX = xValues.get(startDataIndex);
                const maxX = xValues.get(endDataIndex);

                let padding = 3;
                xAxis.animateVisibleRange(
                    new NumberRange(minX - padding, maxX + padding),
                    3000,
                    (t) => 1 - Math.pow(1 - t, 10) // very exaggerated ease out :)
                );
            },
            zoomOut: () => {
                sciChartSurface.zoomExtents(2000);
            },
            setDataset: (id: TDatasetId) => {
                const next = datasets.find((d) => d.id === id)!;
                currentDataset = next;

                const dataSeries = lineSeries.dataSeries as XyDataSeries;
                dataSeries.clear();
                dataSeries.appendRange(next.xValues, next.yValues);

                const sdlp = xAxis.labelProvider as SmartDateLabelProvider;
                switch (id) {
                    case "secondPrecision":
                        lineSeries.stroke = appTheme.VividOrange;
                        sdlp.datePrecision = EDatePrecision.Seconds;
                        sdlp.showSecondsOnPreciseDate = true;
                        break;
                    case "millisecondPrecision":
                        lineSeries.stroke = appTheme.VividPink;
                        sdlp.datePrecision = EDatePrecision.Milliseconds;
                        sdlp.showSecondsOnPreciseDate = false;
                        break;
                    case "microsecondPrecision":
                        lineSeries.stroke = appTheme.VividPurple;
                        sdlp.datePrecision = EDatePrecision.Microseconds;
                        sdlp.showSecondsOnPreciseDate = true;
                        break;
                    case "nanosecondPrecision":
                        lineSeries.stroke = appTheme.VividTeal;
                        sdlp.datePrecision = EDatePrecision.Nanoseconds;
                        sdlp.showSecondsOnPreciseDate = true;
                        break;
                }

                sciChartSurface.zoomExtents();
            },
        },
    };
};
