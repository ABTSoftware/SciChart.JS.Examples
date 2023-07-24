import { Button, makeStyles } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import {
    AUTO_COLOR,
    EAxisAlignment,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    RolloverModifier,
    SciChartSurface,
    SweepAnimation,
    WaveAnimation,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";
import {appTheme, RandomWalkGenerator } from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";
import { GridLayoutModifier } from "./GridLayoutModifier";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Create an XAxis and YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.05, 0.05)
        })
    );

    const POINTS = 1000;
    for (let i = 0; i < 10; i++) {
        
        // Create arrays of x, y values (just arrays of numbers)
        const { xValues, yValues } = new RandomWalkGenerator().getRandomWalkSeries(POINTS);

        // Create a Series and add to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: `Series ${i + 1}` }),
                stroke: AUTO_COLOR,
                strokeThickness: 3,
                animation: new SweepAnimation({ duration: 500, fadeEffect: true })
            })
        );
    }

    // Optional: Add some interactivity to the chart
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier({ modifierGroup: "chart"}),
        new MouseWheelZoomModifier({ modifierGroup: "chart"}),
        new ZoomPanModifier({ modifierGroup: "chart"}),
        new RolloverModifier({ modifierGroup: "chart"})
    );

    const glm = new GridLayoutModifier();
    sciChartSurface.chartModifiers.add(glm);

    sciChartSurface.zoomExtents();

    return { wasmContext, sciChartSurface, modifer: glm };
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
export default function DynamicLayout() {
    const localClasses = useStyles();
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();
    const modiferRef = React.useRef<GridLayoutModifier>();
    const [isGrid, setIsGrid] = React.useState<boolean>(false);

    React.useEffect(() => {
        const chartPromise = drawExample().then(res => {
            sciChartSurfaceRef.current = res.sciChartSurface;
            modiferRef.current = res.modifer;
        });
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
                sciChartSurfaceRef.current = undefined;
                modiferRef.current = undefined;
            } else {
                chartPromise.then(()=> {
                    sciChartSurfaceRef.current.delete();
                    sciChartSurfaceRef.current = undefined;
                    modiferRef.current = undefined;
                });
            }
        }
    }, []);

    const handleToggleButtonChanged = (event: any, value: boolean) => {
        modiferRef.current.isGrid = value;
        setIsGrid(value);
    };

    return (
        <React.Fragment>
            <div className={classes.ChartWrapper}>
                <div className={localClasses.flexOuterContainer}>
                    <div className={localClasses.toolbarRow}>
                        <ToggleButtonGroup
                            exclusive
                            value={isGrid}
                            onChange={handleToggleButtonChanged}
                            size="medium"
                            color="primary"
                            aria-label="small outlined button group">
                            <ToggleButton value={false} style={{color: appTheme.ForegroundColor}}>Single Chart</ToggleButton>
                            <ToggleButton value={true} style={{color: appTheme.ForegroundColor}}>Chart Per Series</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div className={localClasses.chartArea} id={divElementId}></div>
                </div>
            </div>
        </React.Fragment>
    );
}