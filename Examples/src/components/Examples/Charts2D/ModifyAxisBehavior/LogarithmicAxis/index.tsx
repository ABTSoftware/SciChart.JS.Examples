import * as React from "react";
import {ChangeEvent} from "react";
import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {ENumericFormat} from "scichart/types/NumericFormat";
import {LogarithmicAxis} from "scichart/Charting/Visuals/Axis/LogarithmicAxis";
import {RubberBandXyZoomModifier} from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import {LogarithmicLabelProvider} from "scichart/Charting/Visuals/Axis/LabelProvider/LogarithmicLabelProvider";
import classes from "../../../../Examples/Examples.module.scss";

const divElementId = "chart1";

const baseValue = 10;

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Create an X and Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    const yAxis = new LogarithmicAxis(wasmContext, {
        logBase: baseValue,
        labelFormat: ENumericFormat.Exponential,
        labelPrecision: 2,
    });
    sciChartSurface.yAxes.add(yAxis);

    // Create some data
    const xValues = [];
    const yValues = [];
    for (let x = 1; x < 300; x++) {
        const y = Math.pow(x / 100, baseValue);
        xValues.push(x);
        yValues.push(y);
    }

    // Create a line chart with the data
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
    }));

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new RubberBandXyZoomModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier());

    return { sciChartSurface, wasmContext, yAxis };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function LogarithmicAxisExample() {

    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [logAxis, setLogAxis] = React.useState<LogarithmicAxis>();

    React.useEffect(() => {
        drawExample().then(res => {
            // Store some variables which we will need later
            setSciChartSurface(res.sciChartSurface);
            setLogAxis(res.yAxis);
        });
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const onNotationChanged = (e: ChangeEvent<HTMLSelectElement>) => {
        const labelFormat = e.target.value as ENumericFormat;
        const labelPrecision = 2;
        logAxis.labelProvider = new LogarithmicLabelProvider({ labelFormat, labelPrecision })
    };

    const onLogBaseChanged = (e: ChangeEvent<HTMLSelectElement>) => {
        logAxis.logBase = parseFloat(e.target.value);
    };

    return (
        <div>
            <div id={divElementId} className={classes.ChartWrapper} />
            <div className={classes.SelectWrapper}>
                <div className={classes.InputSelectWrapper}>
                    <label id="sciChartLogAxis-label">
                        Log Axis Label Notation
                        <select
                            onChange={onNotationChanged}>
                            <option key="Exponential" value="Exponential">Engineering</option>
                            <option key="Scientific" value="Scientific">Scientific</option>
                            <option key="Decimal" value="Decimal">Decimal</option>
                        </select>
                    </label>
                    <label id="sciChartLogBase-label">
                        Logarithmic Base
                        <select
                            onChange={onLogBaseChanged}>
                            <option key="10" value="10">Log 10</option>
                            <option key={Math.E} value={Math.E}>Log E</option>
                            <option key="2" value="2">Log 2</option>
                        </select>
                    </label>
                </div>
            </div>
        </div>
    );
}
