import { Checkbox, Input, InputLabel, Mark, MenuItem, Select, Slider, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import FormControl from "@material-ui/core/FormControl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import * as React from "react";
import { ESeriesType } from "scichart/types/SeriesType";
import { divElementId, drawExample, ISettings, TMessage } from "./drawExample";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 142
        },
        notificationsBlock: {
            flexBasis: 320,
            flexGrow: 0,
            flexShrink: 0,
            marginLeft: 24
        },
        notification: {
            marginBottom: 16
        },
        description: {
            width: 800,
            marginBottom: 20
        }
    })
);

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
        pointsPerUpdate: 4, //10000
        sendEvery: 5, // Minimum
        initialPoints: 6 // 1000000
    });
    const maxPoints = 10000000;
    const classes = useStyles();

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
        console.log(maxPower, marks);
        return marks.map(m => ({ value: Math.log10(m) })) as Mark[];
    };

    const logScale = (value: number) => {
        return Math.round(10 ** value);
    };

    return (
        <div>
            <div style={{ display: "flex", maxWidth: 1200 }}>
                <div id={divElementId} style={{ height: 600, flexBasis: 600, flexGrow: 1, flexShrink: 1 }} />
                <div className={classes.notificationsBlock} style={{ flexBasis: 100, flexGrow: 1, flexShrink: 1 }}>
                    <div>
                        <FormControl variant="filled" className={classes.formControl}>
                            <InputLabel id="is100Percent-label">Select Chart</InputLabel>
                            <Select
                                labelId="is100Percent-label"
                                id="is100Percent"
                                value={seriesType}
                                onChange={changeChart}
                            >
                                <MenuItem value={ESeriesType.LineSeries}>Line Chart</MenuItem>
                                <MenuItem value={ESeriesType.BubbleSeries}>Bubble Chart</MenuItem>
                                <MenuItem value={ESeriesType.StackedColumnSeries}>Stacked Column Chart</MenuItem>
                                <MenuItem value={ESeriesType.ColumnSeries}>Column Chart with Stacked Axes</MenuItem>
                                <MenuItem value={ESeriesType.StackedMountainSeries}>Stacked Mountain Chart</MenuItem>
                                <MenuItem value={ESeriesType.BandSeries}>Band Chart</MenuItem>
                                <MenuItem value={ESeriesType.ScatterSeries}>Scatter Chart</MenuItem>
                                <MenuItem value={ESeriesType.CandlestickSeries}>Candle Stick Chart</MenuItem>
                                <MenuItem value={ESeriesType.TextSeries}>Text</MenuItem>
                            </Select>
                        </FormControl>
                        <div className={classes.formControl}>
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
                        </div>
                        <div className={classes.formControl}>
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
                        </div>
                        <div className={classes.formControl}>
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
                        </div>
                        <div className={classes.formControl}>
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
                        </div>
                        <div className={classes.formControl}>
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
                        </div>

                        <FormControl className={classes.formControl}>
                            <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                                <Button id="startStreaming" onClick={handleStartStreaming}>
                                    {isDirty ? "ReStart" : "Start"}
                                </Button>
                                <Button id="stopStreaming" onClick={controls.stopStreaming}>
                                    Stop
                                </Button>
                            </ButtonGroup>
                        </FormControl>
                        {messages.length > 0 && (
                            <Alert key="0" severity="info" className={classes.notification}>
                                {messages.map((msg, index) => (
                                    <div key={index}>
                                        <AlertTitle>{msg.title}</AlertTitle>
                                        {msg.detail}
                                    </div>
                                ))}
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
