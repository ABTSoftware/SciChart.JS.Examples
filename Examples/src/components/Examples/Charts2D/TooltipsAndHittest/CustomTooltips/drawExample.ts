import { appTheme } from "../../../theme";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";
import {
    NumericAxis,
    NumberRange,
    SciChartSurface,
    XyDataSeries,
    ENumericFormat,
    FastLineRenderableSeries,
    EllipsePointMarker,
    CursorModifier,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    SeriesInfo,
    CursorTooltipSvgAnnotation,
    adjustTooltipPosition,
    RolloverModifier,
    RolloverTooltipSvgAnnotation,
    VerticalSliceModifier,
    ECoordinateMode,
} from "scichart";

const tooltipSvgTemplate = (seriesInfos: SeriesInfo[], svgAnnotation: CursorTooltipSvgAnnotation) => {
    const width = 160;
    const height = 75;
    const seriesInfo = seriesInfos[0];

    if (!seriesInfo?.isWithinDataBounds) {
        return "<svg></svg>";
    }

    let seriesName;
    let xValue;
    let yValue;
    let index;
    let yValueFromDS;
    let seriesColor;

    seriesInfos.forEach((si) => {
        // If hit (within hitTestRadius of point)
        if (si.isHit) {
            // SeriesInfo.seriesName comes from dataSeries.dataSeriesName
            seriesName = si.seriesName;
            // seriesInfo.xValue, yValue
            xValue = si.xValue.toFixed(2);

            yValue = si.yValue.toFixed(2);

            // index to the dataseries is available
            index = si.dataSeriesIndex;

            seriesColor = si.stroke;

            // Which can be used to get anything from the dataseries
            yValueFromDS = si.renderableSeries.dataSeries.getNativeYValues().get(si.dataSeriesIndex).toFixed(4);
        }
    });

    if (!seriesName) {
        return "<svg></svg>";
    }

    const x = seriesInfo ? seriesInfo.formattedXValue : "";
    const y = seriesInfo ? seriesInfo.formattedYValue : "";

    // this calculates and sets svgAnnotation.xCoordShift and svgAnnotation.yCoordShift. Do not set x1 or y1 at this point.
    adjustTooltipPosition(width, height, svgAnnotation);

    // #EDEFF1

    return `
            <svg width="${width}" height="${height}">
                <rect x="0" y="0" rx="${5}" ry="${5}" width="${width}" height="${height}" fill="${"#EDEFF1"}" stroke="white" stroke-width="2"/>
                <rect x="0" y="0" rx="${5}" ry="${5}" width="${width}" height="${20}" fill="${seriesColor}" stroke="white" stroke-width="2"/>
                <rect x="0" y="40" rx="${0}" ry="${0}" width="${width}" height="${16}" fill="${"white"}" stroke="white" stroke-width="2"/>
                <text y="12" font-family="Verdana" font-size="12" fill="${"white"}" text-anchor="middle" >
                    <tspan fill="${"white"}"  x="50%" font-size="14" dy="0.2em">${seriesName}</tspan>
                    <tspan fill="${"gray"}"  x="50%" dy="1.7em">x: ${xValue}</tspan>
                    <tspan fill="${"gray"}"  x="50%"  dy="1.4em">y: ${yValue}</tspan>
                    <tspan fill="${"gray"}"  x="50%"  dy="1.5em">index: ${index}</tspan>
                </text>
            </svg>`;
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    let sliceRight = false;

    const sliceRightFunction = (value: boolean) => {
        sliceRight = value;

        console.log("draw", { sliceRight });
    };

    // Create a SciChartSurface with X,Y Axis
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.05),
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 4,
        })
    );

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 4,
        })
    );

    const pointMarker1 = new EllipsePointMarker(wasmContext, {
        width: 10,
        height: 10,
        fill: appTheme.VividSkyBlue,
        strokeThickness: 2,
        stroke: appTheme.DarkIndigo,
    });

    const pointMarker2 = new EllipsePointMarker(wasmContext, {
        width: 10,
        height: 10,
        fill: appTheme.VividOrange,
        strokeThickness: 2,
        stroke: appTheme.DarkIndigo,
    });

    const pointMarker3 = new EllipsePointMarker(wasmContext, {
        width: 10,
        height: 10,
        fill: appTheme.MutedPink,
        strokeThickness: 2,
        stroke: appTheme.DarkIndigo,
    });

    // Add some data
    const data1 = ExampleDataProvider.getFourierSeriesZoomed(0.6, 0.13, 5.0, 5.15);
    const data2 = ExampleDataProvider.getFourierSeriesZoomed(0.5, 0.12, 5.0, 5.15);
    const data3 = ExampleDataProvider.getFourierSeriesZoomed(0.4, 0.11, 5.0, 5.15);

    const dataSeries1 = new XyDataSeries(wasmContext, {
        xValues: data1.xValues,
        yValues: data1.yValues,
        dataSeriesName: "First Line Series",
    });

    const dataSeries2 = new XyDataSeries(wasmContext, {
        xValues: data2.xValues,
        yValues: data2.yValues,
        dataSeriesName: "Second Line Series",
    });

    const dataSeries3 = new XyDataSeries(wasmContext, {
        xValues: data3.xValues,
        yValues: data3.yValues,
        dataSeriesName: "Third Line Series",
    });

    const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
        dataSeries: dataSeries1,
        strokeThickness: 3,
        stroke: appTheme.VividSkyBlue,
        pointMarker: pointMarker1,
    });

    const lineSeries2 = new FastLineRenderableSeries(wasmContext, {
        dataSeries: dataSeries2,
        strokeThickness: 3,
        stroke: appTheme.VividOrange,
        pointMarker: pointMarker2,
    });

    const lineSeries3 = new FastLineRenderableSeries(wasmContext, {
        dataSeries: dataSeries3,
        strokeThickness: 3,
        stroke: appTheme.MutedPink,
        pointMarker: pointMarker3,
    });

    sciChartSurface.renderableSeries.add(lineSeries1, lineSeries2, lineSeries3);

    const vSliceTooltipTemplate = (
        id: string,
        seriesInfo: SeriesInfo,
        rolloverTooltip: RolloverTooltipSvgAnnotation
    ) => {
        const width = 160;
        const height = 75;
        rolloverTooltip.updateSize(width, height);

        const myScript = () => {
            console.log("clicked", seriesInfo.seriesName);

            if (!sliceRight) {
                dataSeries1.removeRange(0, seriesInfo.dataSeriesIndex);
                dataSeries2.removeRange(0, seriesInfo.dataSeriesIndex);
                dataSeries3.removeRange(0, seriesInfo.dataSeriesIndex);
            } else {
                const totalCount = dataSeries1.count(); // total number of points in the series
                const countToRemove = totalCount - seriesInfo.dataSeriesIndex;

                dataSeries1.removeRange(seriesInfo.dataSeriesIndex, countToRemove);
                dataSeries2.removeRange(seriesInfo.dataSeriesIndex, countToRemove);
                dataSeries3.removeRange(seriesInfo.dataSeriesIndex, countToRemove);
            }

            // sciChartSurface.zoomExtents();
        };

        document.getElementById("cut-button")?.addEventListener("click", myScript);

        //

        let xButton = `
        <g transform="translate(140, 0)" style="pointer-events: all; cursor: pointer;"  >
            <rect width="20" height="20" fill="white" stroke="gray" stroke-width="2" />
            <line x1="4" y1="16" x2="16" y2="4" stroke="gray" stroke-width="2" style="pointer-events: none"/>
            <line x1="16" y1="16" x2="4" y2="4" stroke="gray" stroke-width="2" style="pointer-events: none"/>
        </g>`;

        return `
        <svg width="${width}" height="${height}" id="cut-button">
                <rect x="0" y="0" rx="${5}" ry="${5}" width="${width}" height="${height}" fill="${"#EDEFF1"}" stroke="white" stroke-width="2"/>
                <rect x="0" y="0" rx="${5}" ry="${5}" width="${width}" height="${21}" fill="${
            seriesInfo.stroke
        }" stroke="white" stroke-width="2" />
                <rect x="0" y="40" rx="${0}" ry="${0}" width="${width}" height="${16}" fill="${"white"}" stroke="white" stroke-width="2"/>
           
               ${seriesInfo.seriesName === "First Line Series" ? xButton : ""}

                <text y="12" font-family="Verdana" font-size="12" fill="${"white"}" text-anchor="middle" >
                    <tspan fill="${"white"}"  x="50%" font-size="14" dy="0.2em">${seriesInfo.seriesName}</tspan>
                    <tspan fill="${"gray"}"  x="50%" dy="1.7em">x: ${seriesInfo.formattedXValue}</tspan>
                    <tspan fill="${"gray"}"  x="50%"  dy="1.4em">y: ${seriesInfo.formattedYValue}</tspan>
                    <tspan fill="${"gray"}"  x="50%"  dy="1.5em">index: ${seriesInfo.dataSeriesIndex}</tspan>
                </text>
            </svg>`;
    };

    const customTooltipTemplate = (
        id: string,
        seriesInfo: SeriesInfo,
        rolloverTooltip: RolloverTooltipSvgAnnotation
    ) => {
        const width = 160;
        const height = 75;
        rolloverTooltip.updateSize(width, height);

        return `
        <svg width="${width}" height="${height}">
                <rect x="0" y="0" rx="${5}" ry="${5}" width="${width}" height="${height}" fill="${"#EDEFF1"}" stroke="white" stroke-width="2"/>
                <rect x="0" y="0" rx="${5}" ry="${5}" width="${width}" height="${20}" fill="${
            seriesInfo.stroke
        }" stroke="white" stroke-width="2" />
                <rect x="0" y="40" rx="${0}" ry="${0}" width="${width}" height="${16}" fill="${"white"}" stroke="white" stroke-width="2"/>
                <text y="12" font-family="Verdana" font-size="12" fill="${"white"}" text-anchor="middle" >
                    <tspan fill="${"white"}"  x="50%" font-size="14" dy="0.2em">${seriesInfo.seriesName}</tspan>
                    <tspan fill="${"gray"}"  x="50%" dy="1.7em">x: ${seriesInfo.formattedXValue}</tspan>
                    <tspan fill="${"gray"}"  x="50%"  dy="1.4em">y: ${seriesInfo.formattedYValue}</tspan>
                    <tspan fill="${"gray"}"  x="50%"  dy="1.5em">index: ${seriesInfo.dataSeriesIndex}</tspan>
                </text>
            </svg>`;
    };

    const setData = () => {
        dataSeries1.clear();
        dataSeries2.clear();
        dataSeries3.clear();
        dataSeries1.appendRange(data1.xValues, data1.yValues);
        dataSeries2.appendRange(data2.xValues, data2.yValues);
        dataSeries3.appendRange(data3.xValues, data3.yValues);
    };

    const setType = (type: string) => {
        console.log(type);

        if (type === "cursor") {
            setData();

            sciChartSurface.chartModifiers.clear(true);

            sciChartSurface.chartModifiers.add(
                // Add the CursorModifier (crosshairs) behaviour
                new CursorModifier({
                    showXLine: false,
                    showYLine: false,
                    // Shows the default tooltip
                    showTooltip: true,
                    hitTestRadius: 5,
                    // Shows an additional legend in top left of the screen
                    // tooltipLegendTemplate: getTooltipLegendTemplate,
                    tooltipSvgTemplate: tooltipSvgTemplate,
                }),
                // Add further zooming and panning behaviours
                new ZoomPanModifier({ enableZoom: true }),
                new ZoomExtentsModifier(),
                new MouseWheelZoomModifier()
            );
        } else if (type === "rollover") {
            setData();

            sciChartSurface.chartModifiers.clear(true);

            lineSeries1.rolloverModifierProps.tooltipTemplate = (
                id: string,
                seriesInfo: SeriesInfo,
                rolloverTooltip: RolloverTooltipSvgAnnotation
            ) => {
                return customTooltipTemplate(id, seriesInfo, rolloverTooltip);
            };

            lineSeries2.rolloverModifierProps.tooltipTemplate = (
                id: string,
                seriesInfo: SeriesInfo,
                rolloverTooltip: RolloverTooltipSvgAnnotation
            ) => {
                return customTooltipTemplate(id, seriesInfo, rolloverTooltip);
            };

            lineSeries3.rolloverModifierProps.tooltipTemplate = (
                id: string,
                seriesInfo: SeriesInfo,
                rolloverTooltip: RolloverTooltipSvgAnnotation
            ) => {
                return customTooltipTemplate(id, seriesInfo, rolloverTooltip);
            };
            sciChartSurface.chartModifiers.add(
                new RolloverModifier(),
                new ZoomPanModifier({ enableZoom: true }),
                new ZoomExtentsModifier(),
                new MouseWheelZoomModifier()
            );
        } else if (type === "verticalSlice") {
            setData();

            sciChartSurface.chartModifiers.clear(true);

            lineSeries1.rolloverModifierProps.tooltipTemplate = (
                id: string,
                seriesInfo: SeriesInfo,
                rolloverTooltip: RolloverTooltipSvgAnnotation
            ) => {
                return vSliceTooltipTemplate(id, seriesInfo, rolloverTooltip);
            };

            lineSeries2.rolloverModifierProps.tooltipTemplate = (
                id: string,
                seriesInfo: SeriesInfo,
                rolloverTooltip: RolloverTooltipSvgAnnotation
            ) => {
                return vSliceTooltipTemplate(id, seriesInfo, rolloverTooltip);
            };

            lineSeries3.rolloverModifierProps.tooltipTemplate = (
                id: string,
                seriesInfo: SeriesInfo,
                rolloverTooltip: RolloverTooltipSvgAnnotation
            ) => {
                return vSliceTooltipTemplate(id, seriesInfo, rolloverTooltip);
            };

            const vSlice1 = new VerticalSliceModifier({
                x1: 5.06,
                xCoordinateMode: ECoordinateMode.DataValue,
                isDraggable: true,
                // Defines if rollover vertical line is shown
                showRolloverLine: true,
                rolloverLineStrokeThickness: 1,
                rolloverLineStroke: appTheme.VividGreen,
                lineSelectionColor: appTheme.VividGreen,
                // Shows the default tooltip
                showTooltip: true,
                // Optional: Overrides the legend template to display additional info top-left of the chart
                // tooltipLegendTemplate: getTooltipLegendTemplate,
            });

            sciChartSurface.chartModifiers.add(vSlice1);

            sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }));
            sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
            sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
        }
    };

    setType("cursor");

    return { sciChartSurface, wasmContext, setType, setData, sliceRightFunction };
};

// Override the standard tooltip displayed by CursorModifier
const getTooltipLegendTemplate = (seriesInfos: SeriesInfo[], svgAnnotation: CursorTooltipSvgAnnotation) => {
    let outputSvgString = "";

    // Foreach series there will be a seriesInfo supplied by SciChart. This contains info about the series under the house
    seriesInfos.forEach((seriesInfo, index) => {
        const lineHeight = 30;
        const y = 20 + index * lineHeight;
        // Use the series stroke for legend text colour
        const textColor = seriesInfo.stroke;
        // Use the seriesInfo formattedX/YValue for text on the
        outputSvgString += `<text x="8" y="${y}" font-size="16" font-family="Verdana" fill="${textColor}">
            ${seriesInfo.seriesName}: X=${seriesInfo.formattedXValue}, Y=${seriesInfo.formattedYValue}
        </text>`;
    });

    return `<svg width="100%" height="100%">
                ${outputSvgString}
            </svg>`;
};
