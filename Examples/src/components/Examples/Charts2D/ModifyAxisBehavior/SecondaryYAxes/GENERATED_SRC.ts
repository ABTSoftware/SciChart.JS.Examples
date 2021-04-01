export const code = `import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { YAxisDragModifier } from "scichart/Charting/ChartModifiers/YAxisDragModifier";
import { XAxisDragModifier } from "scichart/Charting/ChartModifiers/XAxisDragModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ENumericFormat } from "scichart/types/NumericFormat";
import classes from "../../../../Examples/Examples.module.scss";

const divElementId = "chart1";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const ID_Y_AXIS_2 = "yAxis2";

    // FIRST CHART
    const titleStyle1 = {
        color: "#228B22",
        fontSize: 30,
        fontFamily: "Courier New"
    };
    const labelStyle1 = {
        color: "#228B22"
    };
    const setXAxis1 = () => {
        const xAxis = new NumericAxis(wasmContext);
        xAxis.axisBorder = {
            borderTop: 1,
            color: "#EEEEEE",
        };
        xAxis.axisAlignment = EAxisAlignment.Bottom;
        xAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
        sciChartSurface.xAxes.add(xAxis);
    };
    setXAxis1();

    const setYAxis1 = () => {
        const yAxis = new NumericAxis(wasmContext);
        yAxis.axisAlignment = EAxisAlignment.Left;
        yAxis.axisTitle = "Left Axis";
        yAxis.axisTitleStyle = titleStyle1;
        yAxis.labelStyle = labelStyle1;
        yAxis.axisBorder = {
            borderRight: 1,
            color: "#228B22",
        };
        yAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
        sciChartSurface.yAxes.add(yAxis);
    };
    setYAxis1();

    const setSeries1 = () => {
        const lineData = new XyDataSeries(wasmContext);
        const iStep = 20;
        const fAmpltude = 100.0;
        const fFrequency = 1.0;
        for (let i = 0; i < 500 + iStep; i += iStep) {
            lineData.append(i, Math.sin((fFrequency * i * Math.PI) / 180.0) * fAmpltude);
        }
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            stroke: "#228B22",
            strokeThickness: 3,
            dataSeries: lineData
        });
        sciChartSurface.renderableSeries.add(lineSeries);
    };
    setSeries1();

    // SECOND CHART
    const titleStyle2 = {
        color: "#368BC1",
        fontSize: 30,
        fontFamily: "Courier New"
    };
    const labelStyle2 = {
        color: "#368BC1"
    };

    const setYAxis2 = () => {
        const yAxis = new NumericAxis(wasmContext);
        yAxis.id = ID_Y_AXIS_2;
        yAxis.axisTitleStyle = titleStyle2;
        yAxis.labelStyle = labelStyle2;
        yAxis.axisAlignment = EAxisAlignment.Right;
        yAxis.axisTitle = "Right Axis";
        yAxis.axisBorder = {
            borderLeft: 1,
            color: "#368BC1"
        };
        yAxis.labelProvider.numericFormat = ENumericFormat.Decimal_2;
        sciChartSurface.yAxes.add(yAxis);
    };
    setYAxis2();

    const setSeries2 = () => {
        const lineData = new XyDataSeries(wasmContext);
        const iStep = 10;
        const fAmpltude = 0.1;
        const fFrequency = 1.5;
        for (let i = 0; i < 500 + iStep; i += iStep) {
            lineData.append(i, Math.sin((fFrequency * (i - 100) * Math.PI) / 180.0) * fAmpltude);
        }
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            stroke: "#368BC1",
            yAxisId: ID_Y_AXIS_2,
            strokeThickness: 3,
            dataSeries: lineData
        });
        sciChartSurface.renderableSeries.add(lineSeries);
    };
    setSeries2();

    // Optional: Add some interactivity modifiers to enable zooming and panning
    sciChartSurface.chartModifiers.add(
        new YAxisDragModifier(),
        new XAxisDragModifier(),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier()
    );

    return { sciChartSurface, wasmContext };
};

export default function SecondaryYAxes() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
`;