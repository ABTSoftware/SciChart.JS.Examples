import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import FormControl from "@mui/material/FormControl";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";

// Note: `Mark` needs to be imported directly from the module as it is no longer exported from `@mui/material`.
// The direct import for Mark is as follows:
import { Dialog, DialogTitle, IconButton, Slider as MuiSlider, Stack } from "@mui/material";
type Mark = typeof MuiSlider.prototype.defaultProps.marks;

import * as React from "react";
import { useRef } from "react";
import { ESeriesType, SciChartSurface } from "scichart";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample, ISettings, TMessage } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { useViewType } from "../../../containerSizeHooks";
import { ChartGroupLoader } from "../../../ChartGroupLoader";

export default function RealtimeBigDataShowcase() {
    const viewRef = useRef<HTMLDivElement>(undefined);
    const viewInfo = useViewType(viewRef);
    const { isLargeView, isMobileView } = viewInfo ?? {};

    const controlsRef = React.useRef<TResolvedReturnType<typeof chartInitFunction>["controls"]>(undefined);

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

    const [messages, setMessages] = React.useState<TMessage[]>([
        { title: "Avg Load Time", detail: "0" },
        { title: "Avg Render Time", detail: "0" },
        { title: "Max FPS", detail: "0" },
    ]);

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

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const handleClickOpen = () => {
        setIsDialogOpen(true);
    };

    const handleClose = () => {
        setIsDialogOpen(false);
    };

    const controlButtons = (
        <FormControl className={commonClasses.formControl}>
            <ButtonGroup
                fullWidth
                disableElevation
                size="medium"
                color="primary"
                aria-label="small outlined button group"
                sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}
                orientation={!isLargeView ? "vertical" : "horizontal"}
            >
                <Button onClick={handleStartStreaming}>{isDirty ? "ReStart" : "Start"}</Button>
                <Button onClick={handleStopStreaming}>Stop</Button>
            </ButtonGroup>
        </FormControl>
    );

    const controlPanel = (
        <>
            <FormControl fullWidth className={commonClasses.formControl}>
                <Select
                    labelId="chart-type-select-label"
                    id="chart-type-select"
                    variant="standard"
                    inputProps={{ MenuProps: { disableScrollLock: true }, "aria-label": "Without label" }}
                    sx={{ margin: "0.5em 0em", color: "inherit", "& .MuiSvgIcon-root": { color: "inherit" } }}
                    value={seriesType}
                    onChange={changeChart}
                >
                    {[
                        { type: ESeriesType.LineSeries, label: "Line Chart" },
                        { type: ESeriesType.ColumnSeries, label: "Column Chart" },
                        { type: ESeriesType.StackedMountainSeries, label: "Mountain Chart" },
                        { type: ESeriesType.BandSeries, label: "Band Chart" },
                        { type: ESeriesType.ScatterSeries, label: "Scatter Chart" },
                        { type: ESeriesType.CandlestickSeries, label: "Candlestick Chart" },
                    ].map(({ type, label }) => (
                        <MenuItem key={type} value={type}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography variant="inherit" className={commonClasses.FormControlLabel}>
                Number of Series {settings.seriesCount}
            </Typography>
            <Slider
                id="seriesCount"
                onChange={handleSeriesCount}
                step={1}
                min={1}
                max={maxSettings.seriesCount}
                value={settings.seriesCount}
                valueLabelDisplay="off"
            />
            <Typography variant="inherit">Initial Points {logScale(settings.initialPoints)}</Typography>
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
            <Typography variant="inherit">Max Points On Chart {logScale(settings.pointsOnChart)}</Typography>
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
            <Typography variant="inherit">Points Per Update {logScale(settings.pointsPerUpdate)}</Typography>
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
            <Typography variant="inherit">Send Data Interval {settings.sendEvery} ms</Typography>
            <Slider
                id="sendEvery"
                onChange={handleSendEvery}
                step={1}
                min={maxSettings.sendEvery}
                max={500}
                value={settings.sendEvery}
                valueLabelDisplay="off"
            />
        </>
    );

    const performanceResultBox = (
        <Alert
            key="0"
            className={commonClasses.Notification}
            sx={{
                flex: "auto",
                backgroundColor: appTheme.Indigo,
                color: appTheme.ForegroundColor,

                "& .MuiAlert-message": {
                    flex: "auto",
                },
            }}
            severity="info"
        >
            <AlertTitle className={commonClasses.NotificationTitle}>Performance Results</AlertTitle>
            {messages.map((msg, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>{msg.title}</p>
                    <p>{msg.detail}</p>
                </div>
            ))}
        </Alert>
    );

    const configurationDialog = isMobileView ? (
        <Dialog
            onClose={handleClose}
            open={isDialogOpen}
            sx={{ "& .MuiDialog-paper": { background: appTheme.DarkIndigo } }}
        >
            <DialogTitle flexDirection="row" noWrap>
                <span style={{ color: appTheme.ForegroundColor }}>Chart Configurations</span>

                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        flex: "none",
                        justifySelf: "flex-end",
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <div
                style={{
                    width: "100%",
                    padding: "0px 10px 0px 10px",
                    color: appTheme.ForegroundColor,
                    fontSize: "0.8em",
                }}
            >
                {controlPanel}
            </div>
            <Button disabled={!isDirty} onClick={handleStartStreaming} autoFocus>
                Apply
            </Button>
        </Dialog>
    ) : null;

    return (
        <ChartGroupLoader className={commonClasses.ChartWrapper}>
            <Stack
                ref={viewRef}
                sx={{
                    width: "100%",
                    height: "100%",
                    background: appTheme.DarkIndigo,
                }}
                direction={isMobileView ? "column" : "row"}
            >
                <SciChartReact
                    key={seriesType}
                    style={{ flexBasis: 600, flexGrow: 1, flexShrink: 1, display: "flex", flexDirection: "column" }}
                    innerContainerProps={{ style: { flex: "auto" } }}
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
                >
                    {!isLargeView ? (
                        <div className={commonClasses.ToolbarRow} style={{ gap: "0px", paddingRight: "0px" }}>
                            {controlButtons}
                            {performanceResultBox}
                        </div>
                    ) : null}
                </SciChartReact>

                {isMobileView ? (
                    <div
                        style={{ position: "absolute", pointerEvents: "none", touchAction: "none", zIndex: 2 }}
                        title="Chart Configurations"
                    >
                        <IconButton
                            sx={{ color: appTheme.ForegroundColor, pointerEvents: "all", touchAction: "all" }}
                            onClick={handleClickOpen}
                        >
                            <SettingsIcon fontSize="large" />
                        </IconButton>

                        {configurationDialog}
                    </div>
                ) : (
                    <div
                        style={{
                            flex: "none",
                            width: isLargeView ? "300px" : "200px",
                            padding: "0px 10px 0px 10px",
                            color: appTheme.ForegroundColor,
                            fontSize: "0.8em",
                        }}
                    >
                        {isLargeView ? controlButtons : null}
                        {controlPanel}
                        {isLargeView ? performanceResultBox : null}
                    </div>
                )}
            </Stack>
        </ChartGroupLoader>
    );
}
