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
    ModifierMouseArgs,
    EChart2DModifierType,
    ChartModifierBase2D,
    testIsInBounds,
} from "scichart";

import { selectAll } from "./selection";

function interpolateColor(
    minValue: number,
    maxValue: number,
    minColor: string,
    maxColor: string,
    selectedValue: number
) {
    // Clamp the selected value to the min-max range
    const clampedValue = Math.max(minValue, Math.min(maxValue, selectedValue));

    // Calculate the ratio (0 to 1) of where the selected value falls in the range
    const ratio = (clampedValue - minValue) / (maxValue - minValue);

    // Helper function to parse hex color to RGB
    function hexToRgb(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : null;
    }

    // Helper function to convert RGB to hex
    function rgbToHex(r: number, g: number, b: number) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // Parse the min and max colors
    const minRgb = hexToRgb(minColor);
    const maxRgb = hexToRgb(maxColor);

    if (!minRgb || !maxRgb) {
        throw new Error("Invalid color format. Please use hex colors like #FF0000");
    }

    // Interpolate each RGB component
    const r = Math.round(minRgb.r + (maxRgb.r - minRgb.r) * ratio);
    const g = Math.round(minRgb.g + (maxRgb.g - minRgb.g) * ratio);
    const b = Math.round(minRgb.b + (maxRgb.b - minRgb.b) * ratio);

    // Return the interpolated color as hex
    return rgbToHex(r, g, b);
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    let setStuff: undefined | React.Dispatch<any>;
    let setClickStuff: undefined | React.Dispatch<any>;

    // Create a SciChartSurface with X,Y Axis
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const xAxis = sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.05),
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 4,
        })
    );

    const yAxis = sciChartSurface.yAxes.add(
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
    const data2 = ExampleDataProvider.getFourierSeriesZoomed(0.5, 0.5, 5.0, 5.15);
    const data3 = ExampleDataProvider.getFourierSeriesZoomed(0.4, 1, 5.0, 5.15);

    const maxData1 = Math.max(...data1.yValues);
    const maxData2 = Math.max(...data2.yValues);
    const maxData3 = Math.max(...data3.yValues);

    const minData1 = Math.min(...data1.yValues);
    const minData2 = Math.min(...data2.yValues);
    const minData3 = Math.min(...data3.yValues);

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

    let sInfos: any;

    const cursorSvgTemplate = (seriesInfos: SeriesInfo[], svgAnnotation: CursorTooltipSvgAnnotation) => {
        const width = 160;
        const height = 140;

        if (!seriesInfos.length) {
            return `<svg/>`;
        }

        // sInfos = seriesInfos;

        if (setStuff) {
            setStuff(seriesInfos);
        }

        let svgArray = seriesInfos.map((si, i) => {
            let min;
            let max;

            if (i === 0) {
                min = minData1;
                max = maxData1;
            } else if (i === 1) {
                min = minData2;
                max = maxData2;
            } else {
                min = minData3;
                max = maxData3;
            }

            // Text inside tooltip changes color based on Y value compared to min and max for series
            return `
                <g transform="translate(0,${i * 40})">
                    <rect  x="0" y="0" rx="${5}" ry="${5}" width="${width}" height="${40}" fill="${"#EDEFF1"}" stroke="white" stroke-width="2"/>
                    <rect  y="0" rx="${5}" ry="${5}" width="${width}" height="${20}" fill="${
                si.stroke
            }" stroke="white" stroke-width="2"/>
          
                    <text y="12" font-family="Verdana" font-size="12" fill="${"white"}" text-anchor="middle" >
                        <tspan fill="${"white"}"  x="50%" font-size="14" dy="0.2em">${si.seriesName}</tspan>
                        <tspan fill="${interpolateColor(
                            min,
                            max,
                            "#b2bec3",
                            "#d63031",
                            si.yValue
                        )}"  x="50%"  dy="1.5em" font-weight="bold">y: ${si.yValue.toFixed(2)}</tspan>
                    </text>
                </g>`;
        });

        // this calculates and sets svgAnnotation.xCoordShift and svgAnnotation.yCoordShift. Do not set x1 or y1 at this point.
        adjustTooltipPosition(width, height, svgAnnotation);

        return `
            <svg width="${width}" height="${height}">
                <rect y="0" rx="${5}" ry="${5}" width="${width}" height="${140}" fill="${"white"}" stroke="white" stroke-width="2"/>
                <text x="50%" dy="1.3em" font-family="Verdana" font-size="12" fill="${"gray"}" text-anchor="middle" >x: ${seriesInfos[0].xValue.toFixed(
            2
        )}, index: ${seriesInfos[0].dataSeriesIndex}</text>
                <g transform="translate(0,20)">${svgArray}</g>
                
            </svg>`;
    };

    let addedSlices: VerticalSliceModifier[] = [];

    const verticalSliceTooltipTemplate = (
        id: string,
        seriesInfo: SeriesInfo,
        rolloverTooltip: RolloverTooltipSvgAnnotation
    ) => {
        const width = 160;
        const height = 75;
        rolloverTooltip.updateSize(width, height);

        let hasBeenRemoved = false; // Add this flag

        const controller = new AbortController();

        const removeFunction = (e: Event) => {
            if (hasBeenRemoved) return; // Exit early if already executed
            hasBeenRemoved = true; // Set flag to prevent re-execution

            removeNearestVerticalSlice(seriesInfo.xValue);

            // Abort all listeners controlled by this controller
            controller.abort();

            // Remove the event listener after execution
            (e.target as Element).removeEventListener("click", removeFunction);
        };

        const removeNearestVerticalSlice = (xValue: number) => {
            let nearestSlice: VerticalSliceModifier | null = null;
            let minDistance = Infinity;

            // Find the nearest vertical slice
            addedSlices.forEach((slice) => {
                const distance = Math.abs(slice.x1 - xValue);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestSlice = slice;
                }
            });

            // Remove the nearest slice if found
            if (nearestSlice) {
                sciChartSurface.chartModifiers.remove(nearestSlice);
                addedSlices = addedSlices.filter((slice) => slice !== nearestSlice);
            }
        };

        let random = (Math.random() * 10000).toString().split(".")[1];

        let dynamicId = `remove-button-${random}`;

        // Use setTimeout to ensure the DOM element exists before attaching the event listener
        setTimeout(() => {
            selectAll(`.${dynamicId}`).on("click", function (event, d) {
                removeFunction(event);
            });
        }, 0);

        let xButton = `
        <g transform="translate(140, 1)" style="pointer-events: all; cursor: pointer;" >
            <rect width="18" height="18" fill="#ffffff00" stroke="#ffffff" stroke-width="1.5" rx="3"/>
            <line x1="3" y1="16" x2="16" y2="3" stroke="#ffffff" stroke-width="1" style="pointer-events: none"/>
            <line x1="16" y1="16" x2="3" y2="3" stroke="#ffffff" stroke-width="1" style="pointer-events: none"/>
        </g>`;

        return `
        <svg width="${width}" height="${height}" class="${dynamicId}">
                <rect x="0" y="0" rx="${5}" ry="${5}" width="${width}" height="${height}" fill="${"#EDEFF1"}" stroke="white" stroke-width="2"/>
                <rect x="0" y="0" rx="${5}" ry="${5}" width="${width}" height="${21}" fill="${
            seriesInfo.stroke
        }" stroke="white" stroke-width="2" />
                <rect x="0" y="40" rx="${0}" ry="${0}" width="${width}" height="${16}" fill="${"white"}" stroke="white" stroke-width="2"/>
           
                ${xButton}

                <text y="12" font-family="Verdana" font-size="12" fill="${"white"}" text-anchor="start" >
                    <tspan fill="${"white"}" x="2%"  font-size="14" dy="0.2em">${seriesInfo.seriesName}</tspan>
                    <tspan fill="${"gray"}"  x="20%" dy="1.7em">x: ${seriesInfo.formattedXValue}</tspan>
                    <tspan fill="${"gray"}"  x="20%"  dy="1.4em">y: ${seriesInfo.formattedYValue}</tspan>
                    <tspan fill="${"gray"}"  x="20%"  dy="1.5em">index: ${seriesInfo.dataSeriesIndex}</tspan>
                </text>
            </svg>`;
    };

    const rolloverTooltipTemplate = (
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

    // add VerticalSliceModifier on click
    class ClickVerticalSliceModifier extends ChartModifierBase2D {
        readonly type: EChart2DModifierType = EChart2DModifierType.Custom;
        private sliceCounter = 0;

        override modifierMouseDown(args: ModifierMouseArgs) {
            super.modifierMouseDown(args);

            const mousePoint = args.mousePoint;
            const { left, right, top, bottom } = this.parentSurface?.seriesViewRect;

            if (testIsInBounds(mousePoint.x, mousePoint.y, left, bottom, right, top)) {
                const xCoordinate = this.parentSurface?.xAxes
                    .get(0)
                    .getCurrentCoordinateCalculator()
                    .getDataValue(mousePoint.x);

                // Create different colored slices
                const colors = ["#FF6600", "#50C7E0", "#32CD32", "#FF69B4"];
                const color = colors[this.sliceCounter % colors.length];

                const verticalSlice = new VerticalSliceModifier({
                    x1: xCoordinate,
                    xCoordinateMode: ECoordinateMode.DataValue,
                    isDraggable: true,
                    showRolloverLine: true,
                    rolloverLineStrokeThickness: 2,
                    rolloverLineStroke: color,
                    lineSelectionColor: color,
                    showTooltip: true,
                });

                this.parentSurface?.chartModifiers.add(verticalSlice);
                addedSlices.push(verticalSlice);
                this.sliceCounter++;
                verticalSlice.modifierMouseMove(args);
            }
        }
    }

    const setType = (type: string) => {
        if (type === "cursor") {
            setData();

            sciChartSurface.chartModifiers.clear(true);

            sciChartSurface.chartModifiers.add(
                // Add the CursorModifier (crosshairs) behaviour
                new CursorModifier({
                    showTooltip: true,
                    tooltipSvgTemplate: cursorSvgTemplate,
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
                return rolloverTooltipTemplate(id, seriesInfo, rolloverTooltip);
            };

            lineSeries2.rolloverModifierProps.tooltipTemplate = (
                id: string,
                seriesInfo: SeriesInfo,
                rolloverTooltip: RolloverTooltipSvgAnnotation
            ) => {
                return rolloverTooltipTemplate(id, seriesInfo, rolloverTooltip);
            };

            lineSeries3.rolloverModifierProps.tooltipTemplate = (
                id: string,
                seriesInfo: SeriesInfo,
                rolloverTooltip: RolloverTooltipSvgAnnotation
            ) => {
                return rolloverTooltipTemplate(id, seriesInfo, rolloverTooltip);
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
                return verticalSliceTooltipTemplate(id, seriesInfo, rolloverTooltip);
            };

            lineSeries2.rolloverModifierProps.tooltipTemplate = (
                id: string,
                seriesInfo: SeriesInfo,
                rolloverTooltip: RolloverTooltipSvgAnnotation
            ) => {
                return verticalSliceTooltipTemplate(id, seriesInfo, rolloverTooltip);
            };

            lineSeries3.rolloverModifierProps.tooltipTemplate = (
                id: string,
                seriesInfo: SeriesInfo,
                rolloverTooltip: RolloverTooltipSvgAnnotation
            ) => {
                return verticalSliceTooltipTemplate(id, seriesInfo, rolloverTooltip);
            };

            class SimpleChartModifier extends ChartModifierBase2D {
                readonly type = EChart2DModifierType.Custom;

                modifierMouseDown(args: ModifierMouseArgs) {
                    super.modifierMouseDown(args);
                    if (setClickStuff) {
                        setClickStuff(
                            `MouseDown at point ${args.mousePoint.x.toFixed(2)}, ${args.mousePoint.y.toFixed(2)}`
                        );
                    }
                }

                modifierDoubleClick(args: ModifierMouseArgs) {
                    super.modifierDoubleClick(args);
                    if (setClickStuff) {
                        setClickStuff(
                            `DoubleClick at point  ${args.mousePoint.x.toFixed(2)}, ${args.mousePoint.y.toFixed(2)}`
                        );
                    }
                }
            }

            sciChartSurface.chartModifiers.add(new SimpleChartModifier());

            sciChartSurface.chartModifiers.add(new ClickVerticalSliceModifier());
            sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }));
            sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
            sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
        }
    };

    setType("cursor");

    const callBack = (fn: (arg0: string) => any) => {
        setStuff = fn;
    };

    const clickCallBack = (fn: (arg0: string) => any) => {
        setClickStuff = fn;
    };

    return { sciChartSurface, wasmContext, setType, setData, callBack, clickCallBack };
};
