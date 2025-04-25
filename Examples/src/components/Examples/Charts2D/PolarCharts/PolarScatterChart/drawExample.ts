import {
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    XyDataSeries,
    PolarNumericAxis,
    SciChartPolarSurface,
    EPolarAxisMode, 
    NumberRange, 
    EAxisAlignment, 
    EPolarLabelMode,
    PolarXyScatterRenderableSeries,
    SweepAnimation,
    EHorizontalTextPosition,
    EVerticalTextPosition,
    Thickness,
    EllipsePointMarker,
    PolarLegendModifier,
    EDataLabelSkipMode,
    TrianglePointMarker,
    EPointMarkerType,
    ELegendPlacement,
    ELegendOrientation,
    TLegendItem,
    getLegendItemHtml,
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 1400),
        zoomExtentsToInitialRange: true,
        
        drawMinorTickLines: false,
        drawMajorTickLines: false,
        drawMinorGridLines: false,
        
        startAngle: Math.PI / 2,
        majorGridLineStyle: {
            color: appTheme.DarkIndigo,
            strokeThickness: 1,
        },
        drawLabels: false, // no radial labels
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        polarLabelMode: EPolarLabelMode.Parallel,
        visibleRange: new NumberRange(0, 360),
        startAngle: Math.PI / 2, // start at 12 o'clock
        flippedCoordinates: true, // go clockwise
        zoomExtentsToInitialRange: true,

        autoTicks: false,
        majorDelta: 30,

        drawMinorTickLines: false,
        drawMajorTickLines: false,
        drawMinorGridLines: false,

        useNativeText: true,
        labelPrecision: 0,
        labelPostfix: "°",
        labelStyle: {
            color: "white",
        },
        majorGridLineStyle: {
            color: appTheme.DarkIndigo,
            strokeThickness: 1,
        },
    });
    sciChartSurface.xAxes.add(polarXAxis);

    const xValues = Array.from({ length: 540 }, (_, i) => i);
    const SCATTER_DATA = [
        {
            yVals: xValues.map((x) => 2 * x + x * Math.random() * 0.5),
            color: appTheme.VividOrange,
            name: "Circle Series",
            pointMarkerType: EPointMarkerType.Ellipse
        }, 
        {
            yVals: xValues.map((x) => x + x * Math.random() * 0.5),
            color: appTheme.VividSkyBlue,
            name: "Triangular Series",
            pointMarkerType: EPointMarkerType.Triangle,
        }
    ]

    SCATTER_DATA.forEach(({ yVals, color, name, pointMarkerType }) => {
        const polarScatter = new PolarXyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: xValues,
                yValues: yVals,
                dataSeriesName: name,
            }),
            opacity: 0.7,
            stroke: color, // set stroke color for Legend modifier markers

            // @ts-ignore
            pointMarker: {
                type: pointMarkerType,
                options: {
                    width: 10,
                    height: 10,
                    stroke: color,
                    strokeThickness: 1,
                    fill: color + "88",
                }
            },
            animation: new SweepAnimation({ duration: 800 }),
        });
        sciChartSurface.renderableSeries.add(polarScatter);
    });

    // Extra feature -> Custom legend marker with SVG shapes
    const customMarkerLegendModifier = new PolarLegendModifier({
        showCheckboxes: true,
        showSeriesMarkers: true,
        backgroundColor: "#66666633"
    });
    // override "getLegendItemHTML" to add custom SVG shapes
    customMarkerLegendModifier.sciChartLegend.getLegendItemHTML = (
        orientation: ELegendOrientation,
        showCheckboxes: boolean,
        showSeriesMarkers: boolean,
        item: TLegendItem
    ): string => {
        const display = orientation === ELegendOrientation.Vertical ? "flex" : "inline-flex";
        let str = `<span class="scichart__legend-item" style="display: ${display}; align-items: center; margin-right: 4px; padding: 0 4px 0 5px; white-space: nowrap; gap: 5px">`;
        
        if (showCheckboxes) {
            const checked = item.checked ? "checked" : "";
            str += `<input ${checked} type="checkbox" id="${item.id}">`;
        }
        
        if (showSeriesMarkers) {
            str += `<svg 
                xmlns="http://www.w3.org/2000/svg"
                for="${item.id}" 
                style="width: 15px; height: 15px;" 
                viewBox="0 0 24 24"
                stroke-width="2"
            >
                ${(() => {
                    switch (item.name) {
                        case SCATTER_DATA[0].name: // Circle
                            return `<circle cx="12" cy="12" r="9" fill="${item.color + "88"}" stroke="${item.color}"/>`;

                        case SCATTER_DATA[1].name: // Triangle 
                            return `<polygon points="12,2 22,22 2,22" fill="${item.color + "88"}" stroke="${item.color}"/>`;

                        default: // Others 
                            return `<rect x="2" y="2" width="20" height="20" fill="${item.color + "88"}" stroke="${item.color}"/>`;
                    }
                })()}
            </svg>`
        }
        str += `<label for="${item.id}">${item.name}</label>`;
        str += `</span>`;
        return str;
    };

    sciChartSurface.chartModifiers.add(
        customMarkerLegendModifier,
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier(),
    );

    return { sciChartSurface, wasmContext };
};