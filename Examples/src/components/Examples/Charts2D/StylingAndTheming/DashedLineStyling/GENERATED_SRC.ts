export const code = `import * as React from "react";
import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {TSciChart} from "scichart/types/TSciChart";
import {NumberRange} from "scichart/Core/NumberRange";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {ExampleDataProvider} from "../../../ExampleData/ExampleDataProvider";
import {ENumericFormat} from "scichart/types/NumericFormat";
import {TrianglePointMarker} from "scichart/Charting/Visuals/PointMarkers/TrianglePointMarker";

// tslint:disable:no-empty
// tslint:disable:max-classes-per-file

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Create XAxis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { labelFormat: ENumericFormat.Decimal_2 })
    );

    // Create YAxis
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
        })
    );

    // Create a line series no dash
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "SteelBlue",
            strokeThickness: 2,
            dataSeries: createLineData(wasmContext, 0),
            // Strokedash array defines the stroke dash. [2,2] means draw for 2pt, gap for 2pt
            strokeDashArray: [2, 2]
        })
    );

    // Create a line series dotted line
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "SteelBlue",
            strokeThickness: 2,
            dataSeries: createLineData(wasmContext, 1),
            // Strokedash array defines the stroke dash. [3,3] means draw for 3pts, gap for 3pts
            strokeDashArray: [3, 3],
        })
    );

    // Create a line series dotted line
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "SteelBlue",
            strokeThickness: 2,
            dataSeries: createLineData(wasmContext, 2),
            // Strokedash array defines the stroke dash. [10,5] means draw for 10pts, gap for 5pts
            strokeDashArray: [10, 5]
        })
    );

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
};

// Creates some dummy data and appends into an XyDataSeries for the example
const createLineData = (wasmContext: TSciChart, whichSeries: number) => {
    const data = ExampleDataProvider.getFourierSeriesZoomed(1.0, 0.1, 5.0, 5.15);
    const xyDataSeries = new XyDataSeries(wasmContext);

    xyDataSeries.appendRange(
        data.xValues,
        data.yValues.map(y => whichSeries === 0 ? y : whichSeries === 1 ? y * 1.1 : y * 1.5));
    return xyDataSeries;
};

export default function DashedLineStyling() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}
`;