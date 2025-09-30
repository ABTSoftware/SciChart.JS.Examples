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
    CursorModifier,
    LegendModifier,
    CategoryAxis,
    DateTimeNumericAxis,
    NumericLabelProvider,
    ENumericFormat,
    DateLabelProvider,
    EVerticalTextPosition,
    Thickness,
    IPointMetadata,
    DataLabelProvider,
    DataPointSelectionModifier,
    DataPointSelectionPaletteProvider,
    ILabel2DOptions,
    TextLabelProvider,
    ELabelAlignment,
    RolloverModifier,
    SeriesInfo,
    RolloverTooltipSvgAnnotation,
} from "scichart";

// Define a custom metadata interface that includes the Input1 value
interface IWaferPointMetadata extends IPointMetadata {
    isSelected: boolean;
    input1: number;
    input2: number;
    batch: number;
    measure1: number;
    measure2: number;
    measure3: number;
    quality: string;
    date: string;
}

import { WaferLotData } from "./waferData";

import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";
import { appTheme } from "../../../theme";

export const drawExample = async (
    rootElement: string | HTMLDivElement,
    waferData: WaferLotData[] = [],
    onPointSelected?: (point: WaferLotData, index: number) => void
) => {
    console.log({ waferData });

    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: "Yield Trend",
        titleStyle: {
            fontSize: 14,
            // fontWeight: "bold",
            useNativeText: false,
            color: appTheme.PaleSkyBlue,
        },
    });

    const growByY = new NumberRange(0.4, 0.4);
    const growByX = new NumberRange(0.05, 0.05);

    // Create the X,Y Axis
    // Using NumericAxis for dates since DateTimeAxis is not available
    // sciChartSurface.xAxes.add(
    //     new DateTimeNumericAxis(wasmContext, {
    //         axisTitle: "Date",
    //         // labelFormat: ENumericFormat.Date_DDMMYYYY,
    //         labelProvider: new DateLabelProvider({ labelFormat: ENumericFormat.Date_DDMMYYYY }),
    //         growBy: growByX,
    //         labelStyle: {
    //             fontSize: 10,
    //         },
    //         axisTitleStyle: {
    //             fontSize: 12,
    //         },
    //     })
    // );

    // Create the labelProvider
    const labelProvider = new TextLabelProvider({
        // When passed as an array, labels will be used in order
        labels: waferData.map((d, i) => `Lot ${i + 1}`),
        // labels: waferData.map((d, i) => ["Lot", (i + 1).toString()]),
    });

    // Create an XAxis with a TextLabelProvider
    const xAxis = new NumericAxis(wasmContext, {
        labelProvider,
        growBy: growByX,
        axisTitle: "Lot version",
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        labelStyle: {
            fontSize: 10,
            alignment: ELabelAlignment.Center,
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
            minorDelta: 1,
            majorDelta: 1,
            // visibleRange: new NumberRange(0.5, 3.5),
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            drawMajorGridLines: false,
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
    // const xValues = waferData.map(item => new Date(item.Date).getTime());
    const xValues = waferData.map((item, i) => i); //new Date(item.Date).getTime() / 1000);

    const yValues = waferData.map((item) => item.Input2);

    // Create metadata for each point to store Input1 values
    const metadata = waferData.map(
        (item) =>
            ({
                isSelected: false,
                input1: item.Input1,
                input2: item.Input2,
                batch: item.Batch,
                measure1: item.Measure1,
                measure2: item.Measure2,
                measure3: item.Measure3,
                quality: item.Quality,
                date: item.Date,
            } as IWaferPointMetadata)
    );

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
            stroke: appTheme.DarkIndigo,
            strokeThickness: 2,
        }),
        paletteProvider: new DataPointSelectionPaletteProvider({
            fill: appTheme.PaleTeal, // Selected fill color
            stroke: appTheme.PaleSkyBlue, // Selected stroke color
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
            return `${pointMetadata.input2}`;
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
                    const metadata = point.metadata as IWaferPointMetadata;
                    const selectedWaferData = waferData[point.index];
                    if (selectedWaferData) {
                        onPointSelected(selectedWaferData, point.index);
                    }
                }
            });
        } else {
            console.log("No points selected");
        }
    });

    const customTooltipTemplate = (
        id: string, //
        seriesInfo: SeriesInfo, // ,
        rolloverTooltip: RolloverTooltipSvgAnnotation //
    ) => {
        let width, height, size;

        if (sciChartSurface.domCanvas2D.width < 1024) {
            width = 70;
            height = 21;
            rolloverTooltip.updateSize(width, height);
            size = "small";
        } else {
            width = 97;
            height = 65;
            rolloverTooltip.updateSize(width, height);
            size = "big";
        }

        // <circle cx="50%" cy="50%" r="50%" fill="${seriesInfo.stroke}"/>
        // <text y="40" font-size="13" font-family="Verdana" dy="0" fill="${"black"}">
        //     <tspan x="15" dy="1.2em">${seriesInfo.seriesName}</tspan>
        //     <tspan x="15" dy="1.2em">x: ${seriesInfo.formattedXValue} y: ${seriesInfo.formattedYValue}</tspan>
        // </text>
        //

        // Measure1 = Film thickness (nm).
        // Measure2 = Line width (nm).
        // Measure3 = Sheet resistance (Ω/□).

        const pointMetadata = seriesInfo.pointMetadata as IWaferPointMetadata;

        if (pointMetadata && pointMetadata.date) {
            console.log({ pointMetadata });

            return size === "small"
                ? `
        <svg width="${width}" height="${height}">
            <rect rx="3" width="${width}" height="${height}" fill="${
                      seriesInfo.stroke
                  }" stroke="black" stroke-width="0.5"/>
            <text x="2" y="15" "fill="${"black"}" font-size="12">${pointMetadata.date}</text>
        </svg>`
                : `
        <svg width="${width}" height="${height}">
            <rect rx="3" width="${width}" height="${height}" fill="${
                      seriesInfo.stroke
                  }" stroke="black" stroke-width="0.5"/>
            <text  y="15" "fill="${"black"}" font-size="12">
                  <tspan x="2">${pointMetadata.date}</tspan>
                  <tspan x="2" dy="1.2em"><tspan font-weight="bold">THK:</tspan> ${pointMetadata.measure1} nm</tspan>
                  <tspan x="2" dy="1.2em"><tspan font-weight="bold">LW:</tspan> ${pointMetadata.measure2} nm</tspan>
                  <tspan x="2" dy="1.2em"><tspan font-weight="bold">RSH:</tspan> ${pointMetadata.measure3} Ω/sq</tspan>
            </text>
        </svg>`;
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
