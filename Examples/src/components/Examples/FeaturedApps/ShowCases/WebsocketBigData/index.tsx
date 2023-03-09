import { FormControlLabel, FormLabel, InputLabel, Mark, MenuItem, Radio, RadioGroup, Select, Slider} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import * as React from "react";
import { ESeriesType } from "scichart/types/SeriesType";
import {appTheme} from "scichart-example-dependencies";
import classes from "scichart-example-dependencies/styles/Examples.module.scss";
import { divElementId, drawExample, ISettings, TMessage } from "./drawExample";

const useStyles = makeStyles(theme => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
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

export default function RealtimeBigDataShowcase() {
    const [seriesType, setSeriesType] = React.useState<ESeriesType>(ESeriesType.LineSeries);
    const [isDirty, setIsDirty] = React.useState<boolean>(false);
    const [settings, setSettings] = React.useState<ISettings>({
        seriesCount: 10,
        pointsOnChart: 4, // 10000
        pointsPerUpdate: 1, // 10
        sendEvery: 100,
        initialPoints: 4 // 10000
    });
    const [maxSettings, setMaxSettings] = React.useState<ISettings>({
        seriesCount: 100,
        pointsOnChart: 6, // 1000000
        pointsPerUpdate: 4, // 10000
        sendEvery: 5, // Minimum
        initialPoints: 6 // 1000000
    });
    const maxPoints = 10000000;
    const localClasses = useStyles();

    const [results, setResults] = React.useState({
        dimensions: null,
        measures: null,
        dataset: null,
        startDate: null,
        endDate: null
    });

    const [messages, setMessages] = React.useState<TMessage[]>([]);
    const [controls, setControls] = React.useState({
        startStreaming: () => {},
        stopStreaming: () => {},
        updateSettings: (newValues: ISettings) => {}
    });

    const changeChart = (e: any) => {
        controls?.stopStreaming();
        setSeriesType(e.target.value);
    };

    React.useEffect(() => {
        (async () => {
            const res = await drawExample((newMessages: TMessage[]) => {
                setMessages([...newMessages]);
            }, seriesType);
            setControls(res.controls);
            res.controls.updateSettings({
                ...settings,
                initialPoints: logScale(settings.initialPoints),
                pointsOnChart: logScale(settings.pointsOnChart),
                pointsPerUpdate: logScale(settings.pointsPerUpdate)
            });
            return () => {
                controls.stopStreaming();
                res.sciChartSurface?.delete();
            };
        })();
    }, [seriesType]);

    const handleSeriesCount = (event: any, newValue: any) => {
        const seriesCount = Number(newValue);
        const newMax = Math.log10(Math.min(1000000, maxPoints / seriesCount));
        setMaxSettings({ ...maxSettings, pointsOnChart: newMax, initialPoints: newMax });
        const pointsOnChart = Math.min(settings.pointsOnChart, newMax);
        const initialPoints = Math.min(settings.initialPoints, newMax);
        setSettings({ ...settings, seriesCount, pointsOnChart, initialPoints });
        controls.updateSettings({
            seriesCount,
            pointsOnChart: logScale(pointsOnChart),
            initialPoints: logScale(initialPoints)
        });
        setIsDirty(true);
    };
    const handleInitialPoints = (event: any, newValue: any) => {
        const initialPoints = Math.min(Number(newValue), settings.pointsOnChart);
        controls.updateSettings({ initialPoints: logScale(initialPoints) });
        setSettings({ ...settings, initialPoints });
        setIsDirty(true);
    };
    const handlePointsPerUpdate = (event: any, newValue: any) => {
        controls.updateSettings({ pointsPerUpdate: logScale(Number(newValue)) });
        setSettings({ ...settings, pointsPerUpdate: Number(newValue) });
        setIsDirty(true);
    };
    const handleSendEvery = (event: any, newValue: any) => {
        setSettings({ ...settings, sendEvery: Number(newValue) });
        controls.updateSettings({ sendEvery: Number(newValue) });
        setIsDirty(true);
    };
    const handlePointsOnChart = (event: any, newValue: any) => {
        const pointsOnChart = Number(newValue);
        const initialPoints = Math.min(settings.initialPoints, pointsOnChart);
        const newMaxSeries = Math.min(100, Math.floor(maxPoints / logScale(pointsOnChart)));
        setMaxSettings({ ...maxSettings, seriesCount: newMaxSeries });
        const seriesCount = Math.min(settings.seriesCount, newMaxSeries);
        setSettings({ ...settings, seriesCount, pointsOnChart, initialPoints });
        controls.updateSettings({
            seriesCount,
            pointsOnChart: logScale(pointsOnChart),
            initialPoints: logScale(initialPoints)
        });
        setIsDirty(true);
    };

    const handleStartStreaming = () => {
        setIsDirty(false);
        controls.startStreaming();
    };

    const getLogMarks = (maxPower: number) => {
        const marks: number[] = [1, 2, 5, 10];
        for (let i = 1; i <= maxPower; i++) {
            const base = Math.pow(10, i);
            marks.push(...[2, 5, 10].map(m => m * base));
        }
        return marks.map(m => ({ value: Math.log10(m) })) as Mark[];
    };

    const logScale = (value: number) => {
        return Math.round(10 ** value);
    };

    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <div id={divElementId} className={localClasses.chartArea} style={{ flexBasis: 600, flexGrow: 1, flexShrink: 1 }} />
                <div className={classes.notificationsBlock} style={{ margin: "10 10 0 10", color: appTheme.ForegroundColor, flexBasis: 100, flexGrow: 1, flexShrink: 1 }}>
                        <div>
                        <FormControl className={classes.formControl} >
                            <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                                <Button id="startStreaming" onClick={handleStartStreaming}>
                                    {isDirty ? "ReStart" : "Start"}
                                </Button>
                                <Button id="stopStreaming" onClick={controls.stopStreaming}>
                                    Stop
                                </Button>
                            </ButtonGroup>
                        </FormControl>
                        </div>
                        <FormControl className={classes.formControl} >
                            <RadioGroup
                                id="chartType"
                                value={seriesType}
                                onChange={changeChart}
                            >
                                <FormControlLabel value={ESeriesType.LineSeries} control={<Radio />} label="Line Chart" />
                                <FormControlLabel value={ESeriesType.ColumnSeries} control={<Radio />} label="Column Chart with Stacked Axes" />
                                <FormControlLabel value={ESeriesType.StackedMountainSeries} control={<Radio />} label="Stacked Mountain Chart" />
                                <FormControlLabel value={ESeriesType.BandSeries} control={<Radio />} label="Band Chart" />
                                <FormControlLabel value={ESeriesType.ScatterSeries} control={<Radio />} label="Scatter Chart" />
                                <FormControlLabel value={ESeriesType.CandlestickSeries} control={<Radio />} label="Candlestick Chart" />
                            </RadioGroup>
                        </FormControl>
                            <Typography variant="body1">Number of Series {settings.seriesCount}</Typography>
                            <Slider
                                id="seriesCount"
                                onChange={handleSeriesCount}
                                step={1}
                                min={1}
                                max={maxSettings.seriesCount}
                                value={settings.seriesCount}
                                valueLabelDisplay="off"
                            />
                            <Typography variant="body1">Initial Points {logScale(settings.initialPoints)}</Typography>
                            <Slider
                                id="InitialPoints"
                                onChange={handleInitialPoints}
                                step={null}
                                min={0.1}
                                scale={logScale}
                                marks={getLogMarks(maxSettings.initialPoints)}
                                max={maxSettings.initialPoints}
                                value={settings.initialPoints}
                                valueLabelDisplay="off"
                            />
                            <Typography variant="body1">
                                Max Points On Chart {logScale(settings.pointsOnChart)}
                            </Typography>
                            <Slider
                                id="pointsOnChart"
                                onChange={handlePointsOnChart}
                                step={null}
                                min={0.1}
                                scale={logScale}
                                marks={getLogMarks(maxSettings.pointsOnChart)}
                                max={maxSettings.pointsOnChart}
                                value={settings.pointsOnChart}
                                valueLabelDisplay="off"
                            />
                            <Typography variant="body1">
                                Points Per Update {logScale(settings.pointsPerUpdate)}
                            </Typography>
                            <Slider
                                id="pointsPerUpdate"
                                onChange={handlePointsPerUpdate}
                                step={null}
                                min={0.1}
                                scale={logScale}
                                marks={getLogMarks(maxSettings.pointsPerUpdate)}
                                max={maxSettings.pointsPerUpdate}
                                value={settings.pointsPerUpdate}
                                valueLabelDisplay="off"
                            />
                            <Typography variant="body1">Send Data Interval {settings.sendEvery} ms</Typography>
                            <Slider
                                id="sendEvery"
                                onChange={handleSendEvery}
                                step={1}
                                min={maxSettings.sendEvery}
                                max={500}
                                value={settings.sendEvery}
                                valueLabelDisplay="off"
                            />
                        {messages.length > 0 && (
                            <Alert key="0" severity="info" className={classes.notification}>
                                {messages.map((msg, index) => (
                                    <div key={index} style={{ paddingBottom: 10 }}>
                                        <AlertTitle style={{ lineHeight: 1}}>{msg.title}</AlertTitle>
                                        {msg.detail}
                                    </div>
                                ))}
                            </Alert>
                        )}
                </div>
            </div>
        </div>
    );
}
