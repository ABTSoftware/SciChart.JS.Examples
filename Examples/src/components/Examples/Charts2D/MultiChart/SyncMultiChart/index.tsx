import * as React from "react";
import { makeStyles } from "tss-react/mui";
import commonClasses from "../../../styles/Examples.module.scss";
import { appTheme } from "../../../theme";

import { Button, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { NumberRange, SciChartSurface, SciChartVerticalGroup } from "scichart";
import { AxisSynchroniser } from "./AxisSynchroniser";
import { addToOverview, createChart, createOverview, removeFromOverview } from "./drawExample";

export const divOverview = "multiChartOverview";
export const divChart1 = "multiChart1";
export const divChart2 = "multiChart2";
export const divChart3 = "multiChart3";
export const divChart4 = "multiChart4";
export const divChart5 = "multiChart5";

type ChartPane = {
    id: number;
    divId: string;
    isSynced: boolean;
    sciChartSurface: SciChartSurface;
};

// Styles for the 3x3 grid
const useStyles = makeStyles()((theme) => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo,
    },
    chartRow: {
        display: "flex",
        flex: "auto",
        flexDirection: "row",
        padding: 0,
        width: "100%",
        color: appTheme.ForegroundColor,
    },
    emptyRow: {
        display: "flex",
        flexBasis: 0,
        padding: 0,
        width: "100%",
        color: appTheme.ForegroundColor,
    },
    toolCol: {
        display: "flex",
        flex: "none",
        width: "130px",
        padding: "10 10 5 0",
        color: appTheme.ForegroundColor,
    },
    chartArea: {
        flex: "auto",
        padding: "0",
        height: "100%",
    },
}));

export default function SyncMultiChart() {
    // We are using a fixed set of divs here as it simplifies the html handling, but this could with dynamic html and an arbitrary number of charts
    const [chartPanes, setChartPanes] = React.useState<ChartPane[]>([
        { id: 0, divId: divOverview, isSynced: true, sciChartSurface: undefined },
        { id: 1, divId: divChart1, isSynced: true, sciChartSurface: undefined },
        { id: 2, divId: divChart2, isSynced: true, sciChartSurface: undefined },
        { id: 3, divId: divChart3, isSynced: true, sciChartSurface: undefined },
        { id: 4, divId: divChart4, isSynced: true, sciChartSurface: undefined },
        { id: 5, divId: divChart5, isSynced: true, sciChartSurface: undefined },
    ]);

    const verticalGroupRef = React.useRef<SciChartVerticalGroup>(new SciChartVerticalGroup());
    const axisSynchroniserRef = React.useRef<AxisSynchroniser>(new AxisSynchroniser(new NumberRange(200, 500)));

    const cleanup = () => {
        chartPanes.forEach((pane) => {
            if (pane.sciChartSurface) {
                console.log("cleaning pane ", pane.id);
                axisSynchroniserRef.current.removeAxis(pane.sciChartSurface.xAxes.get(0));
                verticalGroupRef.current.removeSurface(pane.sciChartSurface);
                pane.sciChartSurface.delete();
            }
        });
        chartPanes.length = 0;
    };

    const { classes } = useStyles();

    React.useEffect(() => {
        const chartInitializationPromise = Promise.all([addChart(0), addChart(1), addChart(2), addChart(3)]);

        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            // check if chart is already initialized
            if (chartPanes.length > 0) {
                cleanup();
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                cleanup();
            });
        };
    }, []);

    const addChart = async (id: number) => {
        const pane = chartPanes[id];
        if (id === 0) {
            const { sciChartSurface } = await createOverview(pane.divId, axisSynchroniserRef.current);
            verticalGroupRef.current.addSurfaceToGroup(sciChartSurface);
            pane.sciChartSurface = sciChartSurface;
        } else {
            const { sciChartSurface } = await createChart(pane.divId, id);
            verticalGroupRef.current.addSurfaceToGroup(sciChartSurface);
            axisSynchroniserRef.current.addAxis(sciChartSurface.xAxes.get(0));
            pane.sciChartSurface = sciChartSurface;
            addToOverview(sciChartSurface.renderableSeries.get(0), chartPanes[0].sciChartSurface);
        }
        setChartPanes([...chartPanes]);
    };

    const removeChart = (id: number) => {
        const pane = chartPanes[id];
        if (id > 0) {
            removeFromOverview(pane.sciChartSurface.renderableSeries.get(0), chartPanes[0].sciChartSurface);
        }
        verticalGroupRef.current.removeSurface(pane.sciChartSurface);
        axisSynchroniserRef.current.removeAxis(pane.sciChartSurface.xAxes.get(0));
        pane.sciChartSurface.delete();
        pane.sciChartSurface = undefined;
        setChartPanes([...chartPanes]);
    };

    const handleChangeSynced = (id: number) => {
        const pane = chartPanes[id];
        if (pane.isSynced) {
            axisSynchroniserRef.current.removeAxis(pane.sciChartSurface.xAxes.get(0));
        } else {
            axisSynchroniserRef.current.addAxis(pane.sciChartSurface.xAxes.get(0));
        }
        pane.isSynced = !pane.isSynced;
        setChartPanes([...chartPanes]);
    };

    const firstFreePane = chartPanes.find((pane) => !pane.sciChartSurface);
    return (
        <div className={commonClasses.ChartWrapper}>
            <div className={classes.flexOuterContainer}>
                <div style={{ width: "100%", height: "100px", flex: "none" }}>
                    <div className={classes.chartArea} id={chartPanes[0].divId}></div>
                </div>
                {firstFreePane ? (
                    <div
                        style={{
                            width: "100%",
                            height: "40px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flex: "none",
                        }}
                    >
                        <Typography style={{ color: appTheme.ForegroundColor, marginLeft: "20px" }}>
                            Click and drag or mousewheel to zoom/pan the charts.
                        </Typography>
                        <Button
                            color="primary"
                            variant="outlined"
                            onClick={() => addChart(firstFreePane.id)}
                            style={{
                                width: "120px",
                                flex: "none",
                                color: appTheme.ForegroundColor,
                                marginRight: "10px",
                            }}
                        >
                            Add Chart
                        </Button>
                    </div>
                ) : (
                    ""
                )}
                {chartPanes
                    .filter((pane) => pane.id > 0)
                    .map((pane) => (
                        <div className={pane.sciChartSurface ? classes.chartRow : classes.emptyRow} key={pane.id}>
                            <div
                                className={pane.sciChartSurface ? classes.chartArea : classes.emptyRow}
                                id={pane.divId}
                            ></div>
                            {pane.sciChartSurface ? (
                                <div className={classes.toolCol}>
                                    <div>
                                        <Button
                                            color="primary"
                                            variant="outlined"
                                            onClick={() => removeChart(pane.id)}
                                            style={{ color: appTheme.ForegroundColor }}
                                        >
                                            Remove Chart
                                        </Button>
                                        <FormControlLabel
                                            className={commonClasses.FormControlLabel}
                                            control={
                                                <Checkbox
                                                    checked={pane.isSynced}
                                                    onChange={() => handleChangeSynced(pane.id)}
                                                />
                                            }
                                            labelPlacement="start"
                                            label="Sync?"
                                        />
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}
