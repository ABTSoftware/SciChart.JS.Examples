import * as React from "react";
import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {ENumericFormat} from "scichart/types/NumericFormat";
import {LogarithmicAxis} from "scichart/Charting/Visuals/Axis/LogarithmicAxis";
import {RubberBandXyZoomModifier} from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import classes from "../../../../Examples/Examples.module.scss";
import {Checkbox} from "@material-ui/core";

const divElementId = "chart1";

const baseValue = 10;

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Create an X and Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    const yAxis = new LogarithmicAxis(wasmContext, {
        logBase: baseValue,
        labelFormat: ENumericFormat.Scientific,
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

    // Create a function to change axis parameters which gets passed back to the example
    const changeAxisParams = (checked: boolean) => {
        if (checked) {
            yAxis.logBase = Math.E;
        } else {
            yAxis.logBase = 10;
        }
    };

    return { sciChartSurface, wasmContext, changeAxisParams };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function LogarithmicAxisExample() {

    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [changeAxisParams, setChangeAxisParams] = React.useState<(checked: boolean) => void>();

    React.useEffect(() => {
        drawExample().then(res => {
            // Store some variables which we will need later
            setSciChartSurface(res.sciChartSurface);
            setChangeAxisParams(res.changeAxisParams);
        });
        // Delete sciChartSurface on unmount component to prevent memory leak
        // @ts-ignore
        return () => sciChartSurface?.delete();
    }, []);

    return (
        <div>
            <div id={divElementId} className={classes.ChartWrapper} />
            <Checkbox onChange={(e) => changeAxisParams(e.target.checked)}/>
        </div>
    );
}
