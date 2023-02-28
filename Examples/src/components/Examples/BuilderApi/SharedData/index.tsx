import * as React from "react";
import {
    SciChartSurface,
    chartBuilder,
    ESeriesType,
    ISciChart2DDefinition,
    TSharedDataDefinition,
    EAnnotationType,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint
} from "scichart";
import classes from "../../../Examples/Examples.module.scss";
import {appTheme} from "../../theme";

const divElementId = "chart";

const drawExample = async () => {
    // Create a definition using dataIds
    const chartTemplate: ISciChart2DDefinition = {
        // Set theme
        surface: {theme: appTheme.SciChartJsTheme},
        // Set template of series without data and data Ids
        series: [
            {
                type: ESeriesType.ColumnSeries,
                options: {dataPointWidth: 0.5, fill: appTheme.VividSkyBlue + "77", stroke: appTheme.PaleSkyBlue},
                xyData: {xDataId: "x", yDataId: "col"}
            },
            {
                type: ESeriesType.LineSeries,
                options: {stroke: appTheme.VividPink, strokeThickness: 3},
                xyData: {xDataId: "x", yDataId: "line"}
            },
            {
                type: ESeriesType.SplineBandSeries,
                options: {
                    stroke: appTheme.VividOrange, strokeY1: appTheme.VividSkyBlue,
                    fill: appTheme.VividOrange + "33", fillY1: appTheme.VividSkyBlue + "33"
                },
                xyyData: {xDataId: "x", yDataId: "col", y1DataId: "line"}
            }
        ],
        // Add annotations
        annotations: [
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "Builder API Demo",
                    x1: 0.5,
                    y1: 0.5,
                    opacity: 0.33,
                    yCoordShift: -52,
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
                    text: "Create SciChart templates with JSON Objects",
                    x1: 0.5,
                    y1: 0.5,
                    yCoordShift: 0,
                    opacity: 0.33,
                    xCoordinateMode: ECoordinateMode.Relative,
                    yCoordinateMode: ECoordinateMode.Relative,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Center,
                    fontSize: 28,
                    fontWeight: "Bold"
                }
            }
        ],
    };

    // When you want to add data for the chart later
    const sharedData: TSharedDataDefinition = {x: [1, 2, 3, 4, 5], col: [8, 2, 3, 7, 10], line: [10, 6, 7, 2, 16]};

    // Build the chart by combining the definition and data
    return await chartBuilder.build2DChart(divElementId, {
        ...chartTemplate,
        sharedData
    });
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function BuilderSharedData() {
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
