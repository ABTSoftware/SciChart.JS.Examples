export const code = `
import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ENumericFormat } from "scichart/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";

const divElementId = "chart1";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const ID_Y_AXIS_2 = "yAxis2";

    // FIRST CHART
    const titleStyle1 = {
        color: "#228B22",
        fontSize: 30,
        fontFamily: "Courier New",
    };
    const labelStyle1 = {
        color: "#228B22",
    };
    const setXAxis1 = () => {
        const xAxis = new NumericAxis(wasmContext);
        xAxis.axisAlignment = EAxisAlignment.Bottom;
        xAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
        sciChartSurface.xAxes.add(xAxis);
    };
    setXAxis1();

    const setYAxis1 = () => {
        const yAxis = new NumericAxis(wasmContext);
        yAxis.axisAlignment = EAxisAlignment.Left;
        yAxis.axisTitle = "Left Axis";
        yAxis.titleStyle = titleStyle1;
        yAxis.labelStyle = labelStyle1;
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
            dataSeries: lineData,
        });
        sciChartSurface.renderableSeries.add(lineSeries);
    };
    setSeries1();

    // SECOND CHART
    const titleStyle2 = {
        color: "#368BC1",
        fontSize: 30,
        fontFamily: "Courier New",
    };
    const labelStyle2 = {
        color: "#368BC1",
    };

    const setYAxis2 = () => {
        const yAxis = new NumericAxis(wasmContext);
        yAxis.id = ID_Y_AXIS_2;
        yAxis.titleStyle = titleStyle2;
        yAxis.labelStyle = labelStyle2;
        yAxis.axisAlignment = EAxisAlignment.Right;
        yAxis.axisTitle = "Right Axis";
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
            dataSeries: lineData,
        });
        sciChartSurface.renderableSeries.add(lineSeries);
    };
    setSeries2();

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());

    return { sciChartSurface, wasmContext };
};

export default function SecondaryYAxes() {
    React.useEffect(() => {
        drawExample();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}

`;
