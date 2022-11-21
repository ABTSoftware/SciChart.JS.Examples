export const code = `import * as React from "react";
import {SciChartSurface} from "scichart";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {XyMovingAverageFilter} from "scichart/Charting/Model/Filters/XyMovingAverageFilter";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import classes from "../../../Examples.module.scss";
import {EAxisAlignment} from "scichart/types/AxisAlignment";
import {LegendModifier} from "scichart/Charting/ChartModifiers/LegendModifier";
import {appTheme} from "../../../theme";
import {RandomWalkGenerator} from "../../../ExampleData/RandomWalkGenerator";
import {XyScaleOffsetFilter} from "scichart/Charting/Model/Filters/XyScaleOffsetFilter";
import {XyLinearTrendFilter} from "scichart/Charting/Model/Filters/XyLinearTrendFilter";
import {NumberRange} from "scichart/Core/NumberRange";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {ECoordinateMode} from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import {EHorizontalAnchorPoint, EVerticalAnchorPoint} from "scichart/types/AnchorPoint";
import {XyRatioFilter} from "scichart/Charting/Model/Filters/XyRatioFilter";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {
    ELegendOrientation,
    ELegendPlacement
} from "scichart/Charting/Visuals/Legend/SciChartLegendBase";

export const divElementId = "chart";

const RATIO_YAXIS_ID = "RatioYAxisId";

export const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        axisTitle: "X Axis",
    }));

    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        axisTitle: "Original Data Y Axis",
        growBy: new NumberRange(0.1, 0.1)
    }));

    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        axisTitle: "Ratio Axis",
        id: RATIO_YAXIS_ID,
        growBy: new NumberRange(0.1, 0.1),
        visibleRange: new NumberRange(-20, 20)
    }));

    // Create an original Data Series with some X,Y data
    const data1 = new RandomWalkGenerator().Seed(420).getRandomWalkSeries(500);
    const originalDataSeries = new XyDataSeries(wasmContext, { xValues: data1.xValues, yValues: data1.yValues, dataSeriesName: "Original" });
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        strokeThickness: 3,
        stroke: appTheme.VividSkyBlue,
        dataSeries: originalDataSeries,
    }));

    // Compute a moving average using filters API and apply to the chart
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        stroke: appTheme.VividRed,
        strokeThickness: 3,
        dataSeries: new XyMovingAverageFilter(originalDataSeries, { length: 10, dataSeriesName: "Moving Average (10)" }),
    }));

    // Compute a moving average using filters API and apply to the chart
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        stroke: appTheme.VividOrange,
        strokeThickness: 3,
        dataSeries: new XyMovingAverageFilter(originalDataSeries, { length: 20, dataSeriesName: "Moving Average (20)" }),
    }));

    // Compute an offset of the original series
    const offsetSeries = new XyScaleOffsetFilter(originalDataSeries, { offset: -0.5, scale: 2, dataSeriesName: "Offset -0.5 / Scaled x2" });
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        stroke: appTheme.VividSkyBlue + "33",
        strokeThickness: 3,
        dataSeries: offsetSeries,
    }));

    // Compute a trendline
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        stroke: appTheme.MutedPurple,
        strokeDashArray: [3, 3],
        strokeThickness: 3,
        dataSeries: new XyLinearTrendFilter(originalDataSeries, { dataSeriesName: "Linear Trendline"}),
    }));

    // Compute a ratio between the trendline & the original series
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        strokeThickness: 3,
        stroke: appTheme.MutedRed,
        yAxisId: RATIO_YAXIS_ID,
        dataSeries: new XyRatioFilter(originalDataSeries, { divisorSeries: offsetSeries, dataSeriesName: "Ratio (Original vs. Offset)"}),
    }));

    // Add a title over the chart with information
    sciChartSurface.annotations.add(new TextAnnotation({
        x1: 0.5,
        y1: 0,
        yCoordShift: 20,
        xCoordShift: -20,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        fontSize: 18,
        opacity: .55,
        textColor: appTheme.ForegroundColor,
        text: "SciChart.js supports dynamic transforms like Moving Averages, Trendlines, Ratios"
    }));

    // Optional: add some chartmodifiers for interaction and to show the legend
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new LegendModifier({ placement: ELegendPlacement.BottomLeft, orientation: ELegendOrientation.Horizontal}));

    return { sciChartSurface, wasmContext };
};

let scs: SciChartSurface;

export default function TrendMARatio() {

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            scs?.delete();
        };
    }, []);

    return (
        <div>
            <div id={divElementId} className={classes.ChartWrapper} />
        </div>
    );
}
`;