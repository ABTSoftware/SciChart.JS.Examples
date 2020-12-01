export const code = `import * as React from "react";
import { EDragMode } from "scichart/types/DragMode";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { SciChartSurface } from "scichart";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { XAxisDragModifier } from "scichart/Charting/ChartModifiers/XAxisDragModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { YAxisDragModifier } from "scichart/Charting/ChartModifiers/YAxisDragModifier";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { EColor } from "scichart/types/Color";
import { ENumericFormat } from "scichart/types/NumericFormat";

export const divElementId = "chart";

export const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    const ID_X_AXIS_2 = "xAxis2";
    const ID_Y_AXIS_2 = "yAxis2";

    const setXAxis1 = () => {
        const xAxis = new NumericAxis(wasmContext);
        xAxis.axisAlignment = EAxisAlignment.Top;
        xAxis.axisTitle = "Drag the X-Axis to Pan";
        xAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
        sciChartSurface.xAxes.add(xAxis);
    };

    const setXAxis2 = () => {
        const xAxis = new NumericAxis(wasmContext);
        xAxis.id = ID_X_AXIS_2;
        xAxis.axisAlignment = EAxisAlignment.Bottom;
        xAxis.axisTitle = "Drag the X-Axis to Pan";
        xAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
        sciChartSurface.xAxes.add(xAxis);
    };

    const setYAxis1 = () => {
        const yAxis = new NumericAxis(wasmContext);
        yAxis.axisAlignment = EAxisAlignment.Left;
        yAxis.axisTitle = "Drag the Y-Axis to Scale";
        yAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
        sciChartSurface.yAxes.add(yAxis);
    };

    const setYAxis2 = () => {
        const yAxis = new NumericAxis(wasmContext);
        yAxis.id = ID_Y_AXIS_2;
        yAxis.axisAlignment = EAxisAlignment.Right;
        yAxis.axisTitle = "Drag the Y-Axis to Scale";
        yAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
        sciChartSurface.yAxes.add(yAxis);
    };

    const setSeries1 = () => {
        const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke: EColor.Red });
        lineSeries.strokeThickness = 3;
        sciChartSurface.renderableSeries.add(lineSeries);
        const lineData = new XyDataSeries(wasmContext);

        // Define line data
        const iStep = 20;
        const fAmpltude = 100.0;
        const fFrequency = 1.0;
        for (let i = 0; i < 500 + iStep; i += iStep) {
            lineData.append(i, Math.sin((fFrequency * i * Math.PI) / 180.0) * fAmpltude);
        }

        lineSeries.dataSeries = lineData;
    };

    const setSeries2 = () => {
        const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke: EColor.Purple });
        lineSeries.xAxisId = ID_X_AXIS_2;
        lineSeries.yAxisId = ID_Y_AXIS_2;
        lineSeries.strokeThickness = 3;
        sciChartSurface.renderableSeries.add(lineSeries);
        const lineData = new XyDataSeries(wasmContext);

        // Define line data
        const iStep = 10;
        const fAmpltude = 200.0;
        const fFrequency = 1.5;
        for (let i = 0; i < 1.5 * 500 + iStep; i += iStep) {
            lineData.append(i, Math.sin((fFrequency * (i - 100) * Math.PI) / 180.0) * fAmpltude);
        }

        lineSeries.dataSeries = lineData;
    };

    setXAxis1();
    setXAxis2();
    setYAxis1();
    setYAxis2();

    setSeries1();
    setSeries2();

    // Add modifiers to enable YAxis and XAxis drag with dragMode as scale or pan
    sciChartSurface.chartModifiers.add(
        new XAxisDragModifier({ dragMode: EDragMode.Panning }),
        new YAxisDragModifier({ dragMode: EDragMode.Scaling })
    );

    // Add a modifier to zoom to fit on double-click
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

    sciChartSurface.zoomExtents();

    return sciChartSurface;
};

export default function DragAxisToScale() {
    React.useEffect(() => {
        let sciChartSurface: SciChartSurface;
        (async () => {
            sciChartSurface = await drawExample();
        })();

        return () => sciChartSurface?.delete();
    }, []);

    return (
        <div>
            <div id={divElementId} style={{ maxWidth: 900 }} />
        </div>
    );
}
`;