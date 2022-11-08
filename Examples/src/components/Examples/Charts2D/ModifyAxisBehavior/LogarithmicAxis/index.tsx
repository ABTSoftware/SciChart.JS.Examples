import * as React from "react";
import {ChangeEvent} from "react";
import {SciChartSurface} from "scichart";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {ENumericFormat} from "scichart/types/NumericFormat";
import {LogarithmicAxis} from "scichart/Charting/Visuals/Axis/LogarithmicAxis";
import {RubberBandXyZoomModifier} from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import {SweepAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/SweepAnimation";
import classes from "../../../../Examples/Examples.module.scss";
import {appTheme} from "../../../theme";
import {ExampleDataProvider} from "../../../ExampleData/ExampleDataProvider";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
const divElementId = "chart1";

const drawExample = async () => {

    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: {
            ...appTheme.SciChartJsTheme,
            majorGridLineBrush: appTheme.MutedSkyBlue + "77",
            minorGridLineBrush: appTheme.MutedSkyBlue + "33",
        }
    });

    // Create an X and Y Axis
    const xAxis = new LogarithmicAxis(wasmContext, {
        logBase: 10,
        labelFormat: ENumericFormat.Scientific,
        labelPrecision: 2,
    });
    sciChartSurface.xAxes.add(xAxis);

    // The LogarithmicAxis will apply logarithmic scaling and labelling to your data.
    // Simply replace a NumericAxis for a LogarithmicAxis on X or Y to apply this scaling
    // Note options logBase, labelFormat which lets you specify exponent on labels
    const yAxis = new LogarithmicAxis(wasmContext, {
        logBase: 10,
        labelFormat: ENumericFormat.Scientific,
        labelPrecision: 2,
    });
    sciChartSurface.yAxes.add(yAxis);

    // Create some data
    const data0 = ExampleDataProvider.getExponentialCurve(1.8, 100);
    const data1 = ExampleDataProvider.getExponentialCurve(2.25, 100);
    const data2 = ExampleDataProvider.getExponentialCurve(3.59, 100);

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data0.xValues, yValues: data0.yValues }),
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: appTheme.VividSkyBlue, strokeThickness: 0 }),
        animation: new SweepAnimation({ duration: 800, delay: 0}),
    }));

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data1.xValues, yValues: data1.yValues }),
        stroke: appTheme.VividPink,
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: appTheme.VividPink, strokeThickness: 0 }),
        animation: new SweepAnimation({ duration: 800, delay: 0}),
    }));

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data2.xValues, yValues: data2.yValues }),
        stroke: appTheme.VividOrange,
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: appTheme.VividOrange, strokeThickness: 0 }),
        animation: new SweepAnimation({ duration: 800, delay: 0}),
    }));

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new RubberBandXyZoomModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier());

    sciChartSurface.zoomExtents();
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
        logAxis.labelProvider.numericFormat = labelFormat;
    };

    const onLogBaseChanged = (e: ChangeEvent<HTMLSelectElement>) => {
        // To update the logarithmic base set LogarithmicAxis.logBase = number
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
                            <option key="Scientific" value="Scientific">Scientific</option>
                            <option key="Exponential" value="Exponential">Engineering</option>
                            <option key="SignificantFigures" value="SignificantFigures">Significant Figures</option>
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
