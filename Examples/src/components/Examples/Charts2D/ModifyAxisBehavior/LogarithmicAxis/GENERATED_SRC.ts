export const code = `import * as React from "react";
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
import {SweepAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/SweepAnimation";
import {EPointMarkerType} from "scichart/types/PointMarkerType";
import classes from "../../../../Examples/Examples.module.scss";

const divElementId = "chart1";

const baseValue = 10;

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Create an X and Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));

    // The LogarithmicAxis will apply logarithmic scaling and labelling to your data.
    // Simply replace a NumericAxis for a LogarithmicAxis on X or Y to apply this scaling
    // Note options logBase, labelFormat which lets you specify exponent on labels
    const yAxis = new LogarithmicAxis(wasmContext, {
        logBase: baseValue,
        labelFormat: ENumericFormat.Scientific,
        labelPrecision: 2,
    });
    sciChartSurface.yAxes.add(yAxis);

    // Create some data
    const xValues = [];
    const yValues = [];
    const y1Values = [];
    const y2Values = [];
    for (let x = 1; x < 100; x++) {
        xValues.push(x);
        yValues.push(Math.pow((x + 20) / 20, baseValue));
        y1Values.push(Math.pow((x + 20) / 50, baseValue));
        y2Values.push(Math.pow((x + 20) / 100, baseValue));
    }

    // Create some line charts with the data
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        animation: new SweepAnimation({ duration: 3200, delay: 0 }),
        pointMarker: { type: EPointMarkerType.Ellipse, options: { width: 7, height: 7, fill: "LightSteelBlue", stroke: "#fff" }}
    }));

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y1Values }),
        animation: new SweepAnimation({ duration: 1600, delay: 0}),
        pointMarker: { type: EPointMarkerType.Ellipse, options: { width: 7, height: 7, fill: "LightSteelBlue", stroke: "#fff" }}
    }));

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues,  yValues: y2Values }),
        animation: new SweepAnimation({ duration: 800, delay: 0}),
        pointMarker: { type: EPointMarkerType.Ellipse, options: { width: 7, height: 7, fill: "LightSteelBlue", stroke: "#fff" }}
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
`;