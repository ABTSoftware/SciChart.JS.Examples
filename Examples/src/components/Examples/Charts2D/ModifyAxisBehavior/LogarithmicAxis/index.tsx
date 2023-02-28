import * as React from "react";
import {appTheme} from "../../../theme";
import classes from "../../../Examples.module.scss";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";
import {ExampleDataProvider} from "../../../ExampleData/ExampleDataProvider";
import {
    AxisBase2D,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    ENumericFormat,
    EllipsePointMarker,
    FastLineRenderableSeries,
    LegendModifier,
    LogarithmicAxis,
    MouseWheelZoomModifier,
    NumericAxis,
    RubberBandXyZoomModifier,
    SciChartSurface,
    SweepAnimation,
    TextAnnotation,
    XyDataSeries,
    ZoomExtentsModifier
} from "scichart";

const divElementId = "chart1";

const Y_AXIS_LINEAR_ID = "Y_AXIS_LINEAR_ID";
const X_AXIS_LINEAR_ID = "X_AXIS_LINEAR_ID";

const drawExample = async () => {
    // Create a SciChartSurface
    const {sciChartSurface, wasmContext} = await SciChartSurface.create(divElementId, {
        theme: {
            ...appTheme.SciChartJsTheme,
            majorGridLineBrush: appTheme.MutedSkyBlue + "55",
            minorGridLineBrush: appTheme.MutedSkyBlue + "22"
        }
    });

    // Create an X and Y Axis
    const xAxisLogarithmic = new LogarithmicAxis(wasmContext, {
        logBase: 10,
        labelFormat: ENumericFormat.Scientific,
        labelPrecision: 2,
        minorsPerMajor: 10
    });
    sciChartSurface.xAxes.add(xAxisLogarithmic);

    // The LogarithmicAxis will apply logarithmic scaling and labelling to your data.
    // Simply replace a NumericAxis for a LogarithmicAxis on X or Y to apply this scaling
    // Note options logBase, labelFormat which lets you specify exponent on labels
    const yAxisLogarithmic = new LogarithmicAxis(wasmContext, {
        logBase: 10,
        labelFormat: ENumericFormat.Scientific,
        labelPrecision: 2,
        minorsPerMajor: 10
    });
    sciChartSurface.yAxes.add(yAxisLogarithmic);

    const xAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        isVisible: false,
        id: X_AXIS_LINEAR_ID
    });
    sciChartSurface.xAxes.add(xAxisLinear);

    const yAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        isVisible: false,
        id: Y_AXIS_LINEAR_ID
    });
    sciChartSurface.yAxes.add(yAxisLinear);

    // Create some data
    const data0 = ExampleDataProvider.getExponentialCurve(2, 100);
    const data1 = ExampleDataProvider.getExponentialCurve(2.2, 100);
    const data2 = ExampleDataProvider.getExponentialCurve(2.4, 100);

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: data0.xValues,
                yValues: data0.yValues,
                dataSeriesName: "y = x ^ 2"
            }),
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 7,
                height: 7,
                fill: appTheme.VividSkyBlue,
                strokeThickness: 0
            }),
            animation: new SweepAnimation({duration: 800, delay: 0})
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: data1.xValues,
                yValues: data1.yValues,
                dataSeriesName: "y = x ^ 2.2"
            }),
            stroke: appTheme.VividPink,
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 7,
                height: 7,
                fill: appTheme.VividPink,
                strokeThickness: 0
            }),
            animation: new SweepAnimation({duration: 800, delay: 0})
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: data2.xValues,
                yValues: data2.yValues,
                dataSeriesName: "y = x ^ 2.4"
            }),
            stroke: appTheme.VividOrange,
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 7,
                height: 7,
                fill: appTheme.VividOrange,
                strokeThickness: 0
            }),
            animation: new SweepAnimation({duration: 800, delay: 0})
        })
    );

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new RubberBandXyZoomModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier(),
        new LegendModifier({showCheckboxes: false})
    );

    // Add title annotation
    const titleAnnotation = new TextAnnotation({
        text: "Logarithmic X & Y Axis",
        fontSize: 20,
        fontWeight: "Bold",
        textColor: appTheme.ForegroundColor,
        x1: 0.5,
        y1: 0,
        yCoordShift: 10,
        opacity: 0.77,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative
    });
    sciChartSurface.annotations.add(titleAnnotation);

    sciChartSurface.zoomExtents();
    return {
        sciChartSurface,
        wasmContext,
        yAxisLogarithmic,
        yAxisLinear,
        xAxisLinear,
        xAxisLogarithmic,
        titleAnnotation
    };
};

const useStyles = makeStyles(theme => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo
    },
    toolbarRow: {
        display: "flex",
        // flex: "auto",
        flexBasis: "70px",
        padding: 10,
        width: "100%",
        color: appTheme.ForegroundColor
    },
    chartArea: {
        flex: 1,
    }
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function LogarithmicAxisExample() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [linearXAxis, setLinearXAxis] = React.useState<NumericAxis>();
    const [logXAxis, setLogXAxis] = React.useState<LogarithmicAxis>();
    const [linearYAxis, setLinearYAxis] = React.useState<NumericAxis>();
    const [logYAxis, setLogYAxis] = React.useState<LogarithmicAxis>();
    const [titleAnnotation, setTitleAnnotation] = React.useState<TextAnnotation>();
    const [preset, setPreset] = React.useState<number>(0);

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            // Store some variables which we will need later when switching x,y axis type
            setSciChartSurface(res.sciChartSurface);
            setLogXAxis(res.xAxisLogarithmic);
            setLogYAxis(res.yAxisLogarithmic);
            setLinearXAxis(res.xAxisLinear);
            setLinearYAxis(res.yAxisLinear);
            setTitleAnnotation(res.titleAnnotation);
        })();

        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const handleToggleButtonChanged = (event: any, state: number) => {
        const toggleAxis = (axis: AxisBase2D, isEnabled: boolean) => {
            axis.isVisible = isEnabled; // toggle this axis as visible/invisible
            axis.isPrimaryAxis = isEnabled; // Only the primary axis shows gridlines
        };
        setPreset(state);
        switch (state) {
            case 0:
                console.log(`Setting state to Logarithmic X & Y Axis`);
                toggleAxis(logXAxis, true);
                toggleAxis(logYAxis, true);
                toggleAxis(linearXAxis, false);
                toggleAxis(linearYAxis, false);
                titleAnnotation.text = "Logarithmic X & Y Axis";
                break;
            case 1:
                console.log(`Setting state to Logarithmic X, Linear Y Axis`);
                toggleAxis(logXAxis, true);
                toggleAxis(logYAxis, false);
                toggleAxis(linearXAxis, false);
                toggleAxis(linearYAxis, true);
                titleAnnotation.text = "Logarithmic X Axis, Linear Y Axis";
                break;
            case 2:
                console.log(`Setting state to Linear X & Y Axis`);
                toggleAxis(logXAxis, false);
                toggleAxis(logYAxis, false);
                toggleAxis(linearXAxis, true);
                toggleAxis(linearYAxis, true);
                titleAnnotation.text = "Linear X & Y Axis";
                break;
        }

        const activeXAxisId = logXAxis.isVisible ? logXAxis.id : linearXAxis.id;
        const activeYAxisId = logYAxis.isVisible ? logYAxis.id : linearYAxis.id;

        // After switching visibility of axis - we need to set the X/Y AxisId on series
        sciChartSurface.renderableSeries.asArray().forEach(rs => {
            rs.xAxisId = activeXAxisId;
            rs.yAxisId = activeYAxisId;
        });
        // Zoom to fit
        sciChartSurface.zoomExtents();
    };

    const localClasses = useStyles();

    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <div className={localClasses.toolbarRow}>
                    <ToggleButtonGroup
                        exclusive
                        value={preset}
                        onChange={handleToggleButtonChanged}
                        size="medium"
                        color="primary"
                        aria-label="small outlined button group"
                    >
                        <ToggleButton value={0} style={{color: appTheme.ForegroundColor}}>
                            Logarithmic X &amp; Y Axis
                        </ToggleButton>
                        <ToggleButton value={1} style={{color: appTheme.ForegroundColor}}>
                            Log X Axis, Linear Y Axis
                        </ToggleButton>
                        <ToggleButton value={2} style={{color: appTheme.ForegroundColor}}>
                            Linear X &amp; Y Axis
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <div className={localClasses.chartArea} id={divElementId}></div>
            </div>
        </div>
    );
}
