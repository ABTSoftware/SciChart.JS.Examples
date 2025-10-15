import {
    EllipsePointMarker,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    ScaleAnimation,
    SciChartSurface,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
    EVerticalTextPosition,
    Thickness,
    IPointMetadata,
    DataLabelProvider,
    DataPointSelectionModifier,
    DataPointSelectionPaletteProvider,
    TextLabelProvider,
    ELabelAlignment,
    RolloverModifier,
    SeriesInfo,
    RolloverTooltipSvgAnnotation,
    ENumericFormat,
    DateTimeNumericAxis,
} from "scichart";

// Define a custom metadata interface that includes the Input1 value
interface IWaferPointMetadata extends IPointMetadata {
    isSelected: boolean;
    input1: number;
    date: string;
}

import { WaferDayData } from "./waferData";

import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";
import { appTheme } from "../../../theme";

export const drawLineChart = async (
    rootElement: string | HTMLDivElement,
    waferData: WaferDayData[] = [],
    onPointSelected?: (point: WaferDayData, index: number) => void
) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: "Yield Trend",
        titleStyle: {
            fontSize: 16,
            useNativeText: false,
            color: appTheme.PaleSkyBlue,
            placeWithinChart: true,
        },
    });

    const sizeIsSmall = sciChartSurface.domCanvas2D.width < 1024 ? true : false;

    if (sizeIsSmall) {
        sciChartSurface.titleStyle = {
            fontSize: 16,
            useNativeText: false,
            color: appTheme.PaleSkyBlue,
            padding: new Thickness(15, 5, 5, 5),
        };
    } else {
        sciChartSurface.titleStyle = {
            fontSize: 26,
            useNativeText: false,
            color: appTheme.PaleSkyBlue,
            padding: new Thickness(25, 5, 5, 5),
        };
    }

    const growByY = new NumberRange(0.4, 0.4);
    const growByX = new NumberRange(0.05, 0.05);

    // Create an XAxis with a TextLabelProvider
    const xAxis = new DateTimeNumericAxis(wasmContext, {
        growBy: growByX,
        axisTitle: "Date",
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        majorDelta: 1,
        maxAutoTicks: 15,
        labelStyle: {
            fontSize: 10,
        },
        axisTitleStyle: {
            fontSize: 12,
        },
    });

    sciChartSurface.xAxes.add(xAxis);

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: growByY,
            axisTitle: "Quality",
            // labelProvider: qualityLabelProvider,
            // visibleRange: new NumberRange(0.5, 3.5),
            drawMinorTickLines: false,
            drawMinorGridLines: false,
            labelStyle: {
                fontSize: 10,
            },
            axisTitleStyle: {
                fontSize: 12,
            },
        })
    );

    // Convert dates to timestamps and quality to numeric values
    const xValues = waferData.map((item) => new Date(item.Date).getTime() / 1000);

    const yValues = waferData.map((item) => item.Mean2);

    // Create metadata for each point to store Input1 values
    const metadata = waferData.map(
        (item) =>
            ({
                isSelected: false,
                input1: item.Mean1,
                date: item.Date,
            } as IWaferPointMetadata)
    );
    metadata[0].isSelected = true;

    // Create a data series with all values and metadata
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        metadata,
    });

    // Create and add a line series to the chart
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: dataSeries,
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 3,
        isDigitalLine: false,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 20,
            height: 20,
            fill: appTheme.PaleSkyBlue,
            strokeThickness: 0,
        }),
        paletteProvider: new DataPointSelectionPaletteProvider({
            fill: appTheme.PaleOrange, // Selected fill color
        }),
        // Add data labels to show Input1 values
        dataLabels: {
            style: {
                fontFamily: "Arial",
                fontSize: 10,
                padding: new Thickness(5, 5, 5, 5),
            },
            color: "white",
            verticalTextPosition: EVerticalTextPosition.Above,
        },
        animation: new ScaleAnimation({ zeroLine: 0, duration: 500, fadeEffect: true }),
    });

    // Configure the data label provider to show Input1 values
    (lineSeries.dataLabelProvider as DataLabelProvider).getText = (state) => {
        const index = state.index;
        const pointMetadata = metadata[index] as IWaferPointMetadata;

        if (pointMetadata) {
            return `${pointMetadata.input1.toFixed(0)}`;
        }
        return undefined;
    };

    sciChartSurface.renderableSeries.add(lineSeries);

    // Inside initSciChart(), after adding the series:
    const selectionModifier = new DataPointSelectionModifier({
        allowClickSelect: true, // Enables single-click selection
        allowDragSelect: false, // Optional: Disable drag for simple clicks
    });

    selectionModifier.selectionChanged.subscribe((args) => {
        const selectedPoints = args.selectedDataPoints;
        if (selectedPoints.length > 0) {
            selectedPoints.forEach((point) => {
                // Call the callback function if provided
                if (onPointSelected && point.index !== undefined) {
                    const selectedWaferData = waferData[point.index];
                    if (selectedWaferData) {
                        onPointSelected(selectedWaferData, point.index);
                    }
                }
            });
        }
    });

    const customTooltipTemplate = (
        id: string, //
        seriesInfo: SeriesInfo, // ,
        rolloverTooltip: RolloverTooltipSvgAnnotation //
    ) => {
        let width, height;

        if (sciChartSurface.domCanvas2D.width < 1024) {
            width = 80;
            height = 50;
            rolloverTooltip.updateSize(width, height);
        } else {
            width = 97;
            height = 222;
            rolloverTooltip.updateSize(width, height);
        }

        const pointdata = waferData[seriesInfo.dataSeriesIndex];

        if (pointdata) {
            if (sizeIsSmall) {
                let batchSummary: number[] = [0, 0, 0];
                for (const batch of pointdata.Batches) {
                    const i = batch.Quality === "Good" ? 0 : batch.Quality === "Marginal" ? 1 : 2;
                    batchSummary[i]++;
                }
                return `
        <svg width="${width}" height="${height}">
            <rect rx="3" width="${width}" height="${height}" fill="${
                    seriesInfo.stroke
                }" stroke="black" stroke-width="0.5"/>
            <text x="2" y="2" "fill="${"black"}" font-size="12">
            <tspan x="2" dy="1.2em" stroke="green">Good: ${batchSummary[0]}</tspan>
            <tspan x="2" dy="1.2em" stroke="orange">Marginal: ${batchSummary[1]}</tspan>
            <tspan x="2" dy="1.2em" stroke="red">Fail: ${batchSummary[2]}</tspan>
            </text>
        </svg>`;
            } else {
                let batchString = "";
                for (const batch of pointdata.Batches) {
                    const stroke = batch.Quality === "Good" ? "green" : batch.Quality === "Marginal" ? "orange" : "red";
                    batchString += `<tspan x="2" dy="1.2em">${batch.Batch}: <tspan stroke="${stroke}">${batch.Quality}</tspan></tspan>
                    `;
                }
                return `
            <svg width="${width}" height="${height}">
                <rect rx="3" width="${width}" height="${height}" fill="${
                    seriesInfo.stroke
                }" stroke="black" stroke-width="0.5"/>
                <text x="2" y="2" "fill="${"black"}" font-size="12">
                    ${batchString}
                </text>
            </svg>`;
            }
        } else {
            return null;
        }
    };

    lineSeries.rolloverModifierProps.tooltipTemplate = (
        id: string,
        seriesInfo: SeriesInfo,
        rolloverTooltip: RolloverTooltipSvgAnnotation
    ) => {
        return customTooltipTemplate(id, seriesInfo, rolloverTooltip);
    };

    // Add interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new RolloverModifier({ showRolloverLine: false })
    );

    sciChartSurface.chartModifiers.add(selectionModifier);

    // Zoom to fit
    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
};
