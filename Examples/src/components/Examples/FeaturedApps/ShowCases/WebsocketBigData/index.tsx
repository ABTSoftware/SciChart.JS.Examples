import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import FormControl from "@mui/material/FormControl";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

// Note: `Mark` needs to be imported directly from the module as it is no longer exported from `@mui/material`.
// The direct import for Mark is as follows:
import { Slider as MuiSlider } from "@mui/material";
type Mark = typeof MuiSlider.prototype.defaultProps.marks;

import * as React from "react";
import { ESeriesType, SciChartSurface } from "scichart";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample, ISettings, TMessage } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

const useStyles = makeStyles()((theme) => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        background: appTheme.DarkIndigo,
    },

    chartArea: {
        flex: 1,
    },
}));

export default function RealtimeBigDataShowcase() {
    const controlsRef = React.useRef<TResolvedReturnType<typeof chartInitFunction>["controls"]>();

    const [seriesType, setSeriesType] = React.useState<ESeriesType>(ESeriesType.LineSeries);
    const [isDirty, setIsDirty] = React.useState<boolean>(false);
    const [settings, setSettings] = React.useState<ISettings>({
        seriesCount: 10,
        pointsOnChart: 4, // 10000
        pointsPerUpdate: 1, // 10
        sendEvery: 100,
        initialPoints: 4, // 10000
    });
    const [maxSettings, setMaxSettings] = React.useState<ISettings>({
        seriesCount: 100,
        pointsOnChart: 6, // 1000000
        pointsPerUpdate: 4, // 10000
        sendEvery: 5, // Minimum
        initialPoints: 6, // 1000000
    });
    const maxPoints = 10000000;
    const { classes } = useStyles();

    const [results, setResults] = React.useState({
        dimensions: null,
        measures: null,
        dataset: null,
        startDate: null,
        endDate: null,
    });

    const [messages, setMessages] = React.useState<TMessage[]>([]);

    const changeChart = (e: any) => {
        controlsRef.current.stopUpdate();
        setSeriesType(e.target.value);
    };

    const handleSeriesCount = (event: any, newValue: any) => {
        if (controlsRef.current) {
            const seriesCount = Number(newValue);
            const newMax = Math.log10(Math.min(1000000, maxPoints / seriesCount));
            setMaxSettings({ ...maxSettings, pointsOnChart: newMax, initialPoints: newMax });
            const pointsOnChart = Math.min(settings.pointsOnChart, newMax);
            const initialPoints = Math.min(settings.initialPoints, newMax);
            setSettings({ ...settings, seriesCount, pointsOnChart, initialPoints });
            controlsRef.current.updateSettings({
                seriesCount,
                pointsOnChart: logScale(pointsOnChart),
                initialPoints: logScale(initialPoints),
            });
            setIsDirty(true);
        }
    };
    const handleInitialPoints = (event: any, newValue: any) => {
        if (controlsRef.current) {
            const initialPoints = Math.min(Number(newValue), settings.pointsOnChart);
            controlsRef.current.updateSettings({ initialPoints: logScale(initialPoints) });
            setSettings({ ...settings, initialPoints });
            setIsDirty(true);
        }
    };
    const handlePointsPerUpdate = (event: any, newValue: any) => {
        if (controlsRef.current) {
            controlsRef.current.updateSettings({ pointsPerUpdate: logScale(Number(newValue)) });
            setSettings({ ...settings, pointsPerUpdate: Number(newValue) });
            setIsDirty(true);
        }
    };
    const handleSendEvery = (event: any, newValue: any) => {
        if (controlsRef.current) {
            setSettings({ ...settings, sendEvery: Number(newValue) });
            controlsRef.current.updateSettings({ sendEvery: Number(newValue) });
            setIsDirty(true);
        }
    };
    const handlePointsOnChart = (event: any, newValue: any) => {
        if (controlsRef.current) {
            const pointsOnChart = Number(newValue);
            const initialPoints = Math.min(settings.initialPoints, pointsOnChart);
            const newMaxSeries = Math.min(100, Math.floor(maxPoints / logScale(pointsOnChart)));
            setMaxSettings({ ...maxSettings, seriesCount: newMaxSeries });
            const seriesCount = Math.min(settings.seriesCount, newMaxSeries);
            setSettings({ ...settings, seriesCount, pointsOnChart, initialPoints });
            controlsRef.current.updateSettings({
                seriesCount,
                pointsOnChart: logScale(pointsOnChart),
                initialPoints: logScale(initialPoints),
            });
            setIsDirty(true);
        }
    };

    const handleStartStreaming = () => {
        if (controlsRef.current) {
            setIsDirty(false);
            controlsRef.current.startUpdate();
        }
    };

    const handleStopStreaming = () => {
        if (controlsRef.current) {
            setIsDirty(false);
            controlsRef.current.stopUpdate();
        }
    };

    const getLogMarks = (maxPower: number) => {
        const marks: number[] = [1, 2, 5, 10];
        for (let i = 1; i <= maxPower; i++) {
            const base = Math.pow(10, i);
            marks.push(...[2, 5, 10].map((m) => m * base));
        }
        return marks.map((m) => ({ value: Math.log10(m) })) as Mark[];
    };

    const logScale = (value: number) => {
        return Math.round(10 ** value);
    };

    const chartInitFunction = drawExample((newMessages: TMessage[]) => {
        setMessages([...newMessages]);
    }, seriesType);

    return (
        <div className={commonClasses.ChartWrapper}>
            <div className={classes.flexOuterContainer}>
                <SciChartReact
                    key={seriesType}
                    className={classes.chartArea}
                    style={{ flexBasis: 600, flexGrow: 1, flexShrink: 1 }}
                    initChart={chartInitFunction}
                    onInit={(initResult: TResolvedReturnType<typeof chartInitFunction>) => {
                        controlsRef.current = initResult.controls;
                        initResult.controls.updateSettings({
                            ...settings,
                            initialPoints: logScale(settings.initialPoints),
                            pointsOnChart: logScale(settings.pointsOnChart),
                            pointsPerUpdate: logScale(settings.pointsPerUpdate),
                        });

                        return () => {
                            initResult.controls.stopUpdate();
                        };
                    }}
                />
                <div
                    className={commonClasses.notificationsBlock}
                    style={{
                        margin: "10 10 0 10",
                        color: appTheme.ForegroundColor,
                        flexBasis: 100,
                        flexGrow: 1,
                        flexShrink: 1,
                    }}
                >
                    <div>
                        <FormControl className={commonClasses.formControl}>
                            <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                                <Button onClick={handleStartStreaming}>{isDirty ? "ReStart" : "Start"}</Button>
                                <Button onClick={handleStopStreaming}>Stop</Button>
                            </ButtonGroup>
                        </FormControl>
                    </div>
                    <FormControl className={commonClasses.formControl}>
                        <RadioGroup id="chartType" value={seriesType} onChange={changeChart}>
                            <FormControlLabel
                                className={commonClasses.FormControlLabel}
                                value={ESeriesType.LineSeries}
                                control={<Radio />}
                                label="Line Chart"
                            />
                            <FormControlLabel
                                className={commonClasses.FormControlLabel}
                                value={ESeriesType.ColumnSeries}
                                control={<Radio />}
                                label="Column Chart with Stacked Axes"
                            />
                            <FormControlLabel
                                className={commonClasses.FormControlLabel}
                                value={ESeriesType.StackedMountainSeries}
                                control={<Radio />}
                                label="Stacked Mountain Chart"
                            />
                            <FormControlLabel
                                className={commonClasses.FormControlLabel}
                                value={ESeriesType.BandSeries}
                                control={<Radio />}
                                label="Band Chart"
                            />
                            <FormControlLabel
                                className={commonClasses.FormControlLabel}
                                value={ESeriesType.ScatterSeries}
                                control={<Radio />}
                                label="Scatter Chart"
                            />
                            <FormControlLabel
                                className={commonClasses.FormControlLabel}
                                value={ESeriesType.CandlestickSeries}
                                control={<Radio />}
                                label="Candlestick Chart"
                            />
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
                    <Typography variant="body1">Max Points On Chart {logScale(settings.pointsOnChart)}</Typography>
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
                    <Typography variant="body1">Points Per Update {logScale(settings.pointsPerUpdate)}</Typography>
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
                        <Alert key="0" severity="info" className={commonClasses.Notification}>
                            {messages.map((msg, index) => (
                                <div key={index} style={{ paddingBottom: 10 }}>
                                    <AlertTitle className={commonClasses.NotificationTitle} style={{ lineHeight: 1 }}>
                                        {msg.title}
                                    </AlertTitle>
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
