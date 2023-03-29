import * as React from "react";
import {xValues, y1Values, y2Values, y3Values, y4Values} from "./data/stackedMountainChartData";
import classes from "../../../../Examples/Examples.module.scss";
import {appTheme} from "../../../theme";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";
import {
    SciChartSurface,
    NumericAxis,
    XyDataSeries,
    StackedMountainRenderableSeries,
    StackedMountainCollection,
    ZoomExtentsModifier,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    LegendModifier,
    ELegendOrientation,
    ELegendPlacement,
    WaveAnimation
} from "scichart";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const {wasmContext, sciChartSurface} = await SciChartSurface.create(divElementId,
        {
            theme: appTheme.SciChartJsTheme,
        });

    // Create an xAxis, yAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {labelPrecision: 0}));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {labelPrecision: 0}));

    // Create the three Stacked Mountain series
    const stackedMountain1 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {xValues, yValues: y1Values, dataSeriesName: "Apples"}),
        fill: appTheme.VividPurple + "AA",
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
    });
    const stackedMountain2 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {xValues, yValues: y2Values, dataSeriesName: "Pears"}),
        fill: appTheme.VividPink + "AA",
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
    });
    const stackedMountain3 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {xValues, yValues: y3Values, dataSeriesName: "Oranges"}),
        fill: appTheme.VividSkyBlue + "AA",
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
    });
    const stackedMountain4 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {xValues, yValues: y4Values, dataSeriesName: "Oranges"}),
        fill: appTheme.VividOrange + "AA",
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
    });

    // Group these StackedMountain series together in a StackedMountainCollection
    const stackedMountainCollection = new StackedMountainCollection(wasmContext);
    stackedMountainCollection.add(stackedMountain1, stackedMountain2, stackedMountain3, stackedMountain4);
    stackedMountainCollection.animation = new WaveAnimation({duration: 600, fadeEffect: true});

    // Add the StackedMountainCollection to the chart
    sciChartSurface.renderableSeries.add(stackedMountainCollection);

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    // Add a legend to the chart to show the series
    sciChartSurface.chartModifiers.add(
        new LegendModifier({
            placement: ELegendPlacement.TopLeft,
            orientation: ELegendOrientation.Vertical,
            showLegend: true,
            showCheckboxes: false,
            showSeriesMarkers: true
        })
    );

    sciChartSurface.zoomExtents();

    return {wasmContext, sciChartSurface, stackedMountainCollection};
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
        width: "100%"
    },
    chartArea: {
        flex: 1,
    }
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function StackedMountainChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [use100PercentStackedMode, setUse100PercentStackedMode] = React.useState(false);
    const [stackedMountainCollection, setStackedMountainCollection] = React.useState<StackedMountainCollection>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
            setStackedMountainCollection(res.stackedMountainCollection);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const handleUsePercentage = (event: any, value: boolean) => {
        if (value !== null) {
            console.log(`100% stacked? ${value}`);
            setUse100PercentStackedMode(value);
            // Toggle 100% mode on click
            stackedMountainCollection.isOneHundredPercent = value;
            sciChartSurface.zoomExtents(200);
        }
    };

    const localClasses = useStyles();
    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <ToggleButtonGroup
                    className={localClasses.toolbarRow}
                    exclusive
                    value={use100PercentStackedMode}
                    onChange={handleUsePercentage}
                    size="small" color="primary" aria-label="small outlined button group">
                    <ToggleButton value={false} style={{color: appTheme.ForegroundColor}}>
                        Stacked mode
                    </ToggleButton>
                    <ToggleButton value={true} style={{color: appTheme.ForegroundColor}}>
                        100% Stacked mode
                    </ToggleButton>
                </ToggleButtonGroup>
                <div id={divElementId} className={localClasses.chartArea}/>
            </div>
        </div>
    );
}
