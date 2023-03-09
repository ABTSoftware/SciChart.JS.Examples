import * as React from "react";
import {
    SciChartSurface,
    ESeriesType,
    EAxisType,
    EAnimationType,
    NumberRange,
    EAnnotationType,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    ECoordinateMode
} from "scichart";
import {chartBuilder} from "scichart/Builder/chartBuilder";
import {appTheme} from "scichart-example-dependencies";
import classes from "scichart-example-dependencies/styles/Examples.module.scss";

const divElementId = "chart";

const drawExample = async () => {

    // Create a chart using the Builder-API, an api that allows defining a chart
    // with javascript-objects or JSON
    return await chartBuilder.build2DChart(divElementId, {
        // Set theme
        surface: {theme: appTheme.SciChartJsTheme},
        // Add xAxis
        xAxes: {type: EAxisType.NumericAxis, options: {growBy: new NumberRange(0.1, 0.1)}},
        // Add yAxis
        yAxes: {type: EAxisType.NumericAxis, options: {growBy: new NumberRange(0.1, 0.1)}},
        // Add series. More than one can be set in an array
        series: [{
            // each series has type, options in the builder-API
            type: ESeriesType.SplineLineSeries,
            options: {
                strokeThickness: 5,
                interpolationPoints: 20,
                stroke: appTheme.VividTeal,
                animation: {type: EAnimationType.Sweep, options: {duration: 500}}
            },
            xyData: {
                xValues: [1, 3, 4, 7, 9], yValues: [10, 6, 7, 2, 16],
            }
        }],
        // Add annotations
        annotations: [{
            type: EAnnotationType.SVGTextAnnotation,
            options: {
                text: "Builder API Demo",
                x1: 0.5,
                y1: 0.5,
                opacity: 0.33,
                yCoordShift: -26,
                xCoordinateMode: ECoordinateMode.Relative,
                yCoordinateMode: ECoordinateMode.Relative,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Center,
                fontSize: 42,
                fontWeight: "Bold"
            }
        },
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "Create SciChart charts with JSON Objects",
                    x1: 0.5,
                    y1: 0.5,
                    yCoordShift: 26,
                    opacity: 0.33,
                    xCoordinateMode: ECoordinateMode.Relative,
                    yCoordinateMode: ECoordinateMode.Relative,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Center,
                    fontSize: 36,
                    fontWeight: "Bold"
                }
            }]
    });
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function BuilderSimpleChart() {
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
        <div className={classes.ChartWrapper} id={divElementId}></div>
    );
}
