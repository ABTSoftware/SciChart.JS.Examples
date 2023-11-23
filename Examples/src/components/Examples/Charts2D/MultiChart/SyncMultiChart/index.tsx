import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { appTheme, RandomWalkGenerator } from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";

import {
    AxisBase2D,
    buildSeries,
    EAutoRange,
    EAxisAlignment,
    ECoordinateMode,
    EExecuteOn,
    EHorizontalAnchorPoint,
    EllipsePointMarker,
    EventHandler,
    EVerticalAnchorPoint,
    FastLineRenderableSeries,
    IDeletable,
    IRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    OverviewRangeSelectionModifier,
    RubberBandXyZoomModifier,
    SciChartOverview,
    SciChartSurface,
    SciChartVerticalGroup,
    TextAnnotation,
    VisibleRangeChangedArgs,
    XyDataSeries,
    XyScatterRenderableSeries,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";
import { Button, Checkbox, FormControlLabel } from "@material-ui/core";

export const divOverview = "multiChartOverview";
export const divChart1 = "multiChart1";
export const divChart2 = "multiChart2";
export const divChart3 = "multiChart3";
export const divChart4 = "multiChart4";
export const divChart5 = "multiChart5";

/** A helper class for synchronising arbitrary number of axes */
class AxisSynchroniser {
    public visibleRange: NumberRange;
    private axes: AxisBase2D[] = [];
    public visibleRangeChanged: EventHandler<VisibleRangeChangedArgs> = new EventHandler<VisibleRangeChangedArgs>();

    public constructor(initialRange: NumberRange, axes?: AxisBase2D[]) {
        this.visibleRange = initialRange;
        this.publishChange = this.publishChange.bind(this);
        if (axes) {
            axes.forEach(a => this.addAxis(a));
        }    
    }

    public publishChange(data: VisibleRangeChangedArgs) {
        this.visibleRange = data.visibleRange;
        this.axes.forEach(a => a.visibleRange =this.visibleRange);
        this.visibleRangeChanged.raiseEvent(data);
    }

    public addAxis(axis: AxisBase2D) {
        if (!this.axes.includes(axis)) {
            this.axes.push(axis);
            axis.visibleRange = this.visibleRange;
            axis.visibleRangeChanged.subscribe(this.publishChange);
        }
    }

    public removeAxis(axis: AxisBase2D) {
        const index = this.axes.findIndex(a => a === axis);
        if (index >= 0) {
            this.axes.splice(index, 1);
            axis.visibleRangeChanged.unsubscribe(this.publishChange);
        }
    }
}

const createChart = async (divId: string, id: number) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divId, {
        theme: appTheme.SciChartJsTheme
    });

    // Create and add an XAxis and YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {  }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1),
            axisAlignment: EAxisAlignment.Left
        })
    );

    const stroke = appTheme.SciChartJsTheme.getStrokeColor(id, 5, wasmContext);
    const POINTS = 1000;
    const data0 = new RandomWalkGenerator().Seed((id + 1) * 10).getRandomWalkSeries(POINTS);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues: data0.xValues, yValues: data0.yValues }),
            strokeThickness: 3,
            stroke
        })
    );

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new RubberBandXyZoomModifier({ executeOn: EExecuteOn.MouseRightButton }));
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return { sciChartSurface, wasmContext };
}

const createOverview = async (divId: string, axisSynchroniser: AxisSynchroniser) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divId, {
        theme: appTheme.SciChartJsTheme
    });

    // Create and add an XAxis and YAxis
    const xAxis = new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 1000), autoRange: EAutoRange.Never });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1),
            axisAlignment: EAxisAlignment.Left
        })
    );

    const rangeSelectionModifier = new OverviewRangeSelectionModifier();
    rangeSelectionModifier.onSelectedAreaChanged = (selectedRange: NumberRange) => {
        if (!selectedRange.equals(axisSynchroniser.visibleRange)) {
            axisSynchroniser.publishChange({ visibleRange: selectedRange });
        }
    };
    rangeSelectionModifier.selectedArea = axisSynchroniser.visibleRange;
    sciChartSurface.chartModifiers.add(rangeSelectionModifier);

    axisSynchroniser.visibleRangeChanged.subscribe(({ visibleRange }) => {
        const updatedSelectedRange = visibleRange.clip(xAxis.visibleRange);
        const shouldUpdateSelectedRange = !updatedSelectedRange.equals(rangeSelectionModifier.selectedArea);
        if (shouldUpdateSelectedRange) {
            rangeSelectionModifier.selectedArea = updatedSelectedRange;
        }
    });
    return { wasmContext, sciChartSurface }
}

const addToOverview = (series: IRenderableSeries, overview: SciChartSurface) => {
    // Deep clone the series but without the data
    const cloneSeries = buildSeries(overview.webAssemblyContext2D, series.toJSON(true))[0];
    // Reference the original data
    cloneSeries.dataSeries = series.dataSeries;
    overview.renderableSeries.add(cloneSeries);
}

const removeFromOverview = (series: IRenderableSeries, overview: SciChartSurface) => {
    const overviewSeries = overview.renderableSeries.getById(series.id);
    // Do not delete children as this is using shared data
    overview.renderableSeries.remove(overviewSeries, false);
}

type ChartPane = {
    id: number;
    divId: string;
    isSynced: boolean;
    sciChartSurface: SciChartSurface;
}

// Styles for the 3x3 grid
const useStyles = makeStyles(theme => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo
    },
    chartRow: {
        display: "flex",
        flexDirection: "row",
        flexBasis: "70px",
        padding: 5,
        width: "100%",
        color: appTheme.ForegroundColor
    },
    toolCol: {
        display: "flex",
        // flex: "auto",
        flexBasis: "70px",
        padding: 5,
        color: appTheme.ForegroundColor
    },
    chartArea: {
        flex: 1,
        padding: "0",
        "min-height": "70px",
        height: "100px",
        resize: "vertical",
        overflow: "hidden"
      }
}));


export default function SyncMultiChart() {
    const [chartPanes, setChartPanes] = React.useState<ChartPane[]>([{ id: 0, divId: divOverview, isSynced: true, sciChartSurface: undefined},
        { id: 1, divId: divChart1, isSynced: true, sciChartSurface: undefined},
        { id: 2, divId: divChart2, isSynced: true, sciChartSurface: undefined},
        { id: 3, divId: divChart3, isSynced: true, sciChartSurface: undefined},
        { id: 4, divId: divChart4, isSynced: true, sciChartSurface: undefined},
        { id: 5, divId: divChart5, isSynced: true, sciChartSurface: undefined}]);
    const verticalGroupRef = React.useRef<SciChartVerticalGroup>(new SciChartVerticalGroup());
    const axisSynchroniserRef = React.useRef<AxisSynchroniser>(new AxisSynchroniser(new NumberRange(200, 500)));

    const cleanup = ()=> {
        chartPanes.forEach(pane => {
                if (pane.sciChartSurface) {
                    console.log("cleaning pane ", pane.id);
                    axisSynchroniserRef.current.removeAxis(pane.sciChartSurface.xAxes.get(0));
                    verticalGroupRef.current.removeSurface(pane.sciChartSurface);
                    pane.sciChartSurface.delete();
                }
            });
        chartPanes.length = 0;
    }

    const localClasses = useStyles();

    React.useEffect(() => {

        const chartInitializationPromise = addChart(0).then(() => addChart(1)).then(() => addChart(2));

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

    const addChart = async (id: number)=> {
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
    }

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
    }

    const handleChangeSynced = (id: number) => {
        const pane = chartPanes[id];
        if (pane.isSynced) {
            axisSynchroniserRef.current.removeAxis(pane.sciChartSurface.xAxes.get(0));
        } else {
            axisSynchroniserRef.current.addAxis(pane.sciChartSurface.xAxes.get(0));
        }
        pane.isSynced = !pane.isSynced;
        setChartPanes([...chartPanes]);
    }

    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                {chartPanes.map(pane => 
                    <div className={localClasses.chartRow} key={pane.id}>
                        <div className={localClasses.chartArea} id={pane.divId}></div>
                        <div className={localClasses.toolCol}>
                            {(pane.id > 0) ?
                                (pane.sciChartSurface ? <div>
                            <Button color="primary" onClick={() => removeChart(pane.id)}>
                                Remove Chart
                            </Button>
                            <FormControlLabel
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
                            :
                            <Button color="primary" onClick={() => addChart(pane.id)}>
                                Add Chart
                            </Button>
                                 ) : ""    
                            }
                        </div>   
                    </div>
                )}
            </div>
        </div>
    );
}
