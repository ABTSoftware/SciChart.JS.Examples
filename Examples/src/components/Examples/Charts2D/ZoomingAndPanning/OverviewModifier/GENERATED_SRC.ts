export const code = `import * as React from "react";
import {NumberRange} from "scichart/Core/NumberRange";
import {RubberBandXyZoomModifier} from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {SciChartSurface} from "scichart";
import {XyScatterRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {SciChartOverview} from "scichart/Charting/Visuals/SciChartOverview";
import classes from "../../../../Examples/Examples.module.scss";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {EExecuteOn} from "scichart/types/ExecuteOn";
import {appTheme} from "../../../theme";
import {IDeletable} from "scichart/Core/IDeletable";
import {RandomWalkGenerator} from "../../../ExampleData/RandomWalkGenerator";
import {EAutoRange} from "scichart/types/AutoRange";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {ECoordinateMode} from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import {EHorizontalAnchorPoint, EVerticalAnchorPoint} from "scichart/types/AnchorPoint";

export const divElementId = "chart";
export const divOverviewId = "overview";

export const drawExample = async () => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create and add an XAxis and YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(500, 600)}));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, growBy: new NumberRange(0.1, 0.1)}));

    const POINTS = 1000;

    const data0 = new RandomWalkGenerator().Seed(1337).getRandomWalkSeries(POINTS);

    // Add a line series to the chart
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data0.xValues, yValues: data0.yValues }),
        strokeThickness: 3,
        stroke: appTheme.VividSkyBlue,
    }));

    const data1 = new RandomWalkGenerator().Seed(42069).getRandomWalkSeries(POINTS);

    // Add a scatter series to the chart
    sciChartSurface.renderableSeries.add(new XyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data1.xValues, yValues: data1.yValues }),
        pointMarker: new EllipsePointMarker(wasmContext, { fill: appTheme.VividPink, strokeThickness: 0 }),
        strokeThickness: 3,
    }));

    // Add an annotation with instructions over the chart
    sciChartSurface.annotations.add(new TextAnnotation({
        x1: 0,
        y1: 0,
        yCoordShift: 20,
        xCoordShift: 20,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        fontSize: 18,
        opacity: .55,
        textColor: appTheme.ForegroundColor,
        text: "SciChart.js supports an Overview scrollbar. Zoom the main chart or drag the overview to see it update"
    }));

    // Add Overview chart. This will automatically bind to the parent surface
    // displaying its series. Zooming the chart will zoom the overview and vice versa
    const overview = await SciChartOverview.create(sciChartSurface, divOverviewId, {
        theme: appTheme.SciChartJsTheme,
    });

    // Optional: add some zoom pan interaction
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new RubberBandXyZoomModifier({ executeOn: EExecuteOn.MouseRightButton }));
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return { sciChartSurface, overview };
};

const itemsToDelete: IDeletable[] = [];

export default function Overview() {
    React.useEffect(() => {
        (async () => {
            const { sciChartSurface, overview } = await drawExample();
            itemsToDelete.push(sciChartSurface, overview);
        })();
        return () => {
            itemsToDelete.forEach(item => item.delete())
        };
    }, []);

    return (
        <div className={classes.ChartWrapper}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div id={divElementId} style={{ flexBasis: 400, flexGrow: 1, flexShrink: 1 }} />
                <div id={divOverviewId} style={{ flexBasis: 100, flexGrow: 1, flexShrink: 1 }} />
            </div>
        </div>
    )
}
`;