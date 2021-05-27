export const code = `import { Button, Typography } from "@material-ui/core";
import React = require("react");
import { SciChartSurface } from "scichart";
import { CursorModifier } from "scichart/Charting/ChartModifiers/CursorModifier";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAutoRange } from "scichart/types/AutoRange";
import { TSciChart } from "scichart/types/TSciChart";

export const divElementId = "chart";

function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

export const drawExample = async () => {
    // NOTE: This crashes Intel HD 630 in 20 seconds when you full screen
    const {sciChartSurface, wasmContext} = await SciChartSurface.create(divElementId);

    // NOTE: This does not crash
    // const {sciChartSurface, wasmContext} = await SciChartSurface.createSingle(chartId);

    const xAxis = new NumericAxis(wasmContext);
    xAxis.autoRange = EAutoRange.Always;
    const yAxis = new NumericAxis(wasmContext);
    yAxis.autoRange = EAutoRange.Never;
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries: XyDataSeries[] = [];

    for (let i = 1; i <= 10; i++) {
        const newColor = 'rgba(getRandomInt(256), getRandomInt(256), getRandomInt(256), 1)';
        const newDataSeries = new XyDataSeries(wasmContext, { dataSeriesName: "Line " + (i) });
        dataSeries.push(newDataSeries);
        const newLineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: newDataSeries,
            strokeThickness: 2,
            stroke: newColor
        });

        const xValues = [];
        const yValues = [];
        for (let j = 0; j < 5; j++) {
            xValues.push(j);
            yValues.push(Math.random());
        }

        // newDataSeries.appendRange(xValues, yValues);

        sciChartSurface.renderableSeries.add(newLineSeries);
    }

    sciChartSurface.zoomExtents();

    const cursorModifier = new CursorModifier({ modifierGroup: "first" });
    cursorModifier.showTooltip = true;

    const legendModifier = new LegendModifier();
    const mouseWheelZoomModifier = new MouseWheelZoomModifier();
    const zoomExtentsModifer = new ZoomExtentsModifier();
    const zoomPanModifier = new ZoomPanModifier({ modifierGroup: "first" });

    sciChartSurface.chartModifiers.add(cursorModifier);
    sciChartSurface.chartModifiers.add(legendModifier);
    sciChartSurface.chartModifiers.add(mouseWheelZoomModifier);
    sciChartSurface.chartModifiers.add(zoomExtentsModifer);
    sciChartSurface.chartModifiers.add(zoomPanModifier);

    // zoom to fit
    sciChartSurface.zoomExtents();

    let k = 0;
    // tslint:disable-next-line:no-empty
    let updateChart = () => { };

    updateChart = () => {
        const axis = sciChartSurface.yAxes.get(0);
        axis.visibleRange = new NumberRange(0, 1 + Math.sin(k * 100));
        k++;
        setTimeout(updateChart, 10);
    };

    updateChart();

    return { sciChartSurface, wasmContext };
};




export default function ContextLossTest() {
    const wasmRef = React.useRef<TSciChart>();
    const surfaceRef = React.useRef<SciChartSurface>();
    const extensionRef = React.useRef<WEBGL_lose_context>();

    React.useEffect(() => {
        let scs: SciChartSurface;
        let wsm: TSciChart;
        (async () => {
            const { sciChartSurface, wasmContext } = await drawExample();
            scs = sciChartSurface;
            wsm = wasmContext;
            wasmRef.current = wasmContext;
            surfaceRef.current = sciChartSurface;
        })();

        return () => scs?.delete();
    }, []);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Test WebGL context loss in a realtime example
            </Typography>
            <div style={{ maxWidth: 800, marginBottom: 20 }}>
                <Typography variant="body1" style={{ color: "blue" }}>
                    Leave the example running & full screen on Intel HD hardware to see the context loss
                </Typography>
            </div>
            <div id={divElementId} style={{ width: "100%", marginBottom: 20 }} />
            <Button onClick={() => {
                extensionRef.current = wasmRef.current.canvas.getContext("webgl2").getExtension("WEBGL_lose_context");
                extensionRef.current.loseContext();
            }}>
                Lose WebGL context
            </Button>
            <Button onClick={() => {
                extensionRef.current.restoreContext();
            }}>
                Restore WebGL context
            </Button>
        </div>
    );
}

`;
