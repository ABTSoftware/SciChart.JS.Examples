import * as React from "react";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { chartBuilder } from "scichart/Builder/chartBuilder";
import classes from "../../../Examples/Examples.module.scss";
import { ESeriesType } from "scichart/types/SeriesType";
import { EAxisType } from "scichart/types/AxisType";
import { ELabelProviderType } from "scichart/types/LabelProviderType";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { EChart2DModifierType } from "scichart/types/ChartModifierType";
import { EAnnotationType } from "scichart/Charting/Visuals/Annotations/IAnnotation";
import { ECoordinateMode } from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import { EPointMarkerType } from "scichart/types/PointMarkerType";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";
import { appTheme } from "../../theme";

const divElementId = "chart";

const drawExample = async () => {
    return await chartBuilder.build2DChart(divElementId, {
        surface: { theme: appTheme.SciChartJsThemeDark },
        xAxes: [{
            type: EAxisType.CategoryAxis,
            options: {
                axisTitle: "X Axis Title",
                labelProvider: {
                    type: ELabelProviderType.Text,
                    options: {
                        labels: { 1: "one", 2: "two", 3: "three", 4: "four", 5: "five" }
                    }
                }
            }
        }
        ],
        yAxes: [
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: "y1",
                    axisTitle: "Left Axis",
                    axisAlignment: EAxisAlignment.Left,
                    visibleRange: new NumberRange(0, 20),
                    zoomExtentsToInitialRange: true
                }
            },
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: "y2",
                    axisTitle: "Right Axis",
                    axisAlignment: EAxisAlignment.Right,
                    visibleRange: new NumberRange(0, 800),
                    labelPrecision: 0,
                    zoomExtentsToInitialRange: true
                }
            }
        ],
        series: [
            {
                type: ESeriesType.SplineMountainSeries,
                options: {
                    yAxisId: "y1",
                    stroke: appTheme.VividSkyBlue,
                    strokeThickness: 5,
                    fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                        { color: appTheme.VividTeal, offset: 0.2 },
                        { color: "Transparent", offset: 1 }
                    ]),
                },
                xyData: { xValues: [1,2,3,4,5], yValues: [8, 6, 7, 2, 16] }
            },
            {
                type: ESeriesType.BubbleSeries,
                options: {
                    yAxisId: "y2",
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 100,
                            height: 100,
                            strokeThickness: 10,
                            fill: appTheme.PaleSkyBlue,
                            stroke: appTheme.VividSkyBlue
                        }
                    }
                },
                xyzData: {
                    xValues: [1,2,3,4,5],
                    yValues: [320, 240, 280, 80, 640],
                    zValues: [20, 40, 20, 30, 35]
                }
            }
        ],
        annotations: [
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: { text: "Labels", yAxisId: "y1", x1: 0, y1: 10, yCoordinateMode: ECoordinateMode.DataValue }
            },
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: { text: "can be placed", yAxisId: "y1", x1: 1, y1: 8, yCoordinateMode: ECoordinateMode.DataValue }
            },
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: { text: "on the chart", yAxisId: "y1", x1: 2, y1: 9, yCoordinateMode: ECoordinateMode.DataValue }
            }
        ],
        modifiers: [
            { type: EChart2DModifierType.Rollover, options: { yAxisId: "y1" } },
            { type: EChart2DModifierType.MouseWheelZoom },
            { type: EChart2DModifierType.ZoomExtents }
        ]
    });
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function BuilderFullChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Deleting sciChartSurface to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return (
        <>
            <div className={classes.ChartWrapper}>
                <div id={divElementId} />
            </div>
        </>
    );
}
