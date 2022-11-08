import * as React from "react";
import {SciChartSurface} from "scichart";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {ENumericFormat} from "scichart/types/NumericFormat";
import {LogarithmicAxis} from "scichart/Charting/Visuals/Axis/LogarithmicAxis";
import {RubberBandXyZoomModifier} from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import {SweepAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/SweepAnimation";
import {appTheme} from "../../../theme";
import {ExampleDataProvider} from "../../../ExampleData/ExampleDataProvider";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {NumericAxis} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Visuals/Axis/NumericAxis";
import classes from "../../../Examples.module.scss";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
const divElementId = "chart1";

const Y_AXIS_LINEAR_ID = "Y_AXIS_LINEAR_ID";

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
    const yAxisLogarithmic = new LogarithmicAxis(wasmContext, {
        logBase: 10,
        labelFormat: ENumericFormat.Scientific,
        labelPrecision: 2,
    });
    sciChartSurface.yAxes.add(yAxisLogarithmic);

    const yAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        isVisible: false,
        id: Y_AXIS_LINEAR_ID
    });
    sciChartSurface.yAxes.add(yAxisLinear);

    // Create some data
    const data0 = ExampleDataProvider.getExponentialCurve(1.8, 100);
    const data1 = ExampleDataProvider.getExponentialCurve(1.9, 100);
    const data2 = ExampleDataProvider.getExponentialCurve(2.0, 100);

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
    return { sciChartSurface, wasmContext, yAxisLogarithmic, yAxisLinear };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function LogarithmicAxisExample() {

    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [logAxis, setLogAxis] = React.useState<LogarithmicAxis>();
    const [linearAxis, setLinearAxis] = React.useState<NumericAxis>();
    let isLogarithmicAxis = true;

    React.useEffect(() => {
        console.log("React.useEffect");
        drawExample().then(res => {
            // Store some variables which we will need later
            setSciChartSurface(res.sciChartSurface);
            setLogAxis(res.yAxisLogarithmic);
            setLinearAxis(res.yAxisLinear);
        });
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const handleIsLogAxis = (event: any, value: any) => {
        isLogarithmicAxis = !isLogarithmicAxis;
        logAxis.isVisible = isLogarithmicAxis;
        linearAxis.isVisible = !isLogarithmicAxis;
        const activeAxisId = isLogarithmicAxis ? logAxis.id : linearAxis.id;
        console.log(`Setting YaxisId = ${activeAxisId}`);
        sciChartSurface.renderableSeries.asArray().forEach(rs => rs.yAxisId = activeAxisId);
        // Toggle linear to log axis on click
        sciChartSurface.zoomExtents();
    };

    return (<div className={classes.ChartWrapper} style={{background: appTheme.DarkIndigo, }}>
            <div id={divElementId} style={{height: "calc(100% - 100px)", width: "100%"}}/>
            <ToggleButtonGroup
                style={{height: "100px", padding: "10",}}
                exclusive
                value={isLogarithmicAxis}
                onChange={handleIsLogAxis}
                size="medium" color="primary" aria-label="small outlined button group">
                <ToggleButton value={true} style={{color: appTheme.ForegroundColor}}>
                    Logarithmic X &amp; Y Axis
                </ToggleButton>
                <ToggleButton value={false} style={{color: appTheme.ForegroundColor}}>
                    Linear Y Axis
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );;
}
