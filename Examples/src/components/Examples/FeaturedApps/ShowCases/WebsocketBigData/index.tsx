import { CloseIcon, PlayArrowIcon, SettingsIcon, StopIcon } from "../../../icons";
import { BodyPortal } from "../../../Portal";

import * as React from "react";
import { useRef } from "react";
import { ESeriesType, SciChartSurface } from "scichart";
import { appTheme } from "../../../theme";
import { drawExample, ISettings, TMessage } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { useViewType } from "../../../containerSizeHooks";
import { ChartGroupLoader } from "scichart-react";

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
    const logSliderMarks = [1, 2, 5, 10];
    for (let exponent = 1; exponent <= 6; exponent++) {
        logSliderMarks.push(...[2, 5, 10].map((multiple) => multiple * 10 ** exponent));
    }
    const logSliderMarkValues = logSliderMarks.map(Math.log10);
    const snapLogSliderValue = (value: number, max: number) => {
        const marks = logSliderMarkValues.filter((mark) => mark >= 0.1 && mark <= max);
        return marks.reduce(
            (closest, mark) => (Math.abs(value - mark) < Math.abs(value - closest) ? mark : closest),
            marks[0]
        );
    };

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
        <div
            className="flex flex-col gap-2"
            role="group"
            aria-label="Streaming controls"
        >
            <button
                className="sc-button sc-button-icon"
                type="button"
                aria-label={isDirty ? "Restart streaming" : "Start streaming"}
                title={isDirty ? "Restart streaming" : "Start streaming"}
                onClick={handleStartStreaming}
            >
                <PlayArrowIcon />
            </button>

            <button
                className="sc-button sc-button-icon"
                type="button"
                aria-label="Stop streaming"
                title="Stop streaming"
                onClick={handleStopStreaming}
            >
                <StopIcon />
            </button>
        </div>
    );

    const controlPanel = (
        <>
            <select
                id="chart-type-select"
                className="sc-select sc-select-standard w-full"
                aria-label="Chart type"
                value={seriesType}
                onChange={changeChart}
            >
                <option value={ESeriesType.LineSeries}>Line Chart</option>
                <option value={ESeriesType.ColumnSeries}>Column Chart</option>
                <option value={ESeriesType.StackedMountainSeries}>Mountain Chart</option>
                <option value={ESeriesType.BandSeries}>Band Chart</option>
                <option value={ESeriesType.ScatterSeries}>Scatter Chart</option>
                <option value={ESeriesType.CandlestickSeries}>Candlestick Chart</option>
            </select>

            <span className="sc-control-label">Number of Series {settings.seriesCount}</span>
            <input
                className="sc-range"
                type="range"
                id="seriesCount"
                onChange={(event) => handleSeriesCount(event, event.currentTarget.valueAsNumber)}
                step={1}
                min={1}
                max={maxSettings.seriesCount}
                value={settings.seriesCount}
            />
            <span>Initial Points {logScale(settings.initialPoints)}</span>
            <input
                className="sc-range"
                type="range"
                id="InitialPoints"
                list="log-slider-marks"
                onChange={(event) =>
                    handleInitialPoints(
                        event,
                        snapLogSliderValue(event.currentTarget.valueAsNumber, maxSettings.initialPoints)
                    )
                }
                step="any"
                min={0.1}
                max={maxSettings.initialPoints}
                value={settings.initialPoints}
            />
            <span>Max Points On Chart {logScale(settings.pointsOnChart)}</span>
            <input
                className="sc-range"
                type="range"
                id="pointsOnChart"
                list="log-slider-marks"
                onChange={(event) =>
                    handlePointsOnChart(
                        event,
                        snapLogSliderValue(event.currentTarget.valueAsNumber, maxSettings.pointsOnChart)
                    )
                }
                step="any"
                min={0.1}
                max={maxSettings.pointsOnChart}
                value={settings.pointsOnChart}
            />
            <span>Points Per Update {logScale(settings.pointsPerUpdate)}</span>
            <input
                className="sc-range"
                type="range"
                id="pointsPerUpdate"
                list="log-slider-marks"
                onChange={(event) =>
                    handlePointsPerUpdate(
                        event,
                        snapLogSliderValue(event.currentTarget.valueAsNumber, maxSettings.pointsPerUpdate)
                    )
                }
                step="any"
                min={0.1}
                max={maxSettings.pointsPerUpdate}
                value={settings.pointsPerUpdate}
            />
            <span>Send Data Interval {settings.sendEvery} ms</span>
            <input
                className="sc-range"
                type="range"
                id="sendEvery"
                onChange={(event) => handleSendEvery(event, event.currentTarget.valueAsNumber)}
                step={1}
                min={maxSettings.sendEvery}
                max={500}
                value={settings.sendEvery}
            />
            <datalist id="log-slider-marks">
                {logSliderMarks.map((value) => (
                    <option key={value} value={Math.log10(value)} />
                ))}
            </datalist>
        </>
    );

    const performanceResultBox = (
        <div className="flex-1">
            <h4>Performance Results</h4>
            {messages.map((ms, index) => (
                <div key={index}>
                    {ms.title}: {ms.detail}
                </div>
            ))}
        </div>
    );

    const configurationDialog =
        isMobileView && isDialogOpen ? (
            <BodyPortal>
                <div
                    className="sc-modal-backdrop"
                    onClick={(event) => event.target === event.currentTarget && handleClose()}
                    onKeyDown={(event) => event.key === "Escape" && handleClose()}
                >
                    <section
                        className="sc-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="websocket-config-title"
                    >
                        <header className="sc-modal-header">
                            <strong id="websocket-config-title">Chart Configurations</strong>
                            <button
                                className="sc-button sc-button-icon"
                                aria-label="Close chart configurations"
                                onClick={handleClose}
                                autoFocus
                                type="button"
                            >
                                <CloseIcon />
                            </button>
                        </header>
                        <div className="sc-modal-body">{controlPanel}</div>
                        <button
                            className="sc-button sc-button-primary sc-modal-action"
                            disabled={!isDirty}
                            onClick={handleStartStreaming}
                            autoFocus
                            type="button"
                        >
                            Apply
                        </button>
                    </section>
                </div>
            </BodyPortal>
        ) : null;

    return (
        <ChartGroupLoader className="sc-chart-wrapper">
            <div
                ref={viewRef}
                className="flex w-full h-full"
                style={{ flexDirection: isMobileView ? "column" : "row" }}
            >
                <SciChartReact
                    key={seriesType}
                    className="sc-chart-wrapper"
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
                        <header className="sc-toolbar-row">
                            {controlButtons}
                            {performanceResultBox}
                        </header>
                    ) : null}
                </SciChartReact>

                {isMobileView ? (
                    <div
                        style={{ position: "absolute", pointerEvents: "none", touchAction: "none", zIndex: 2 }}
                        title="Chart Configurations"
                    >
                        <button
                            className="sc-button sc-button-icon"
                            aria-label="Chart configurations"
                            title="Chart configurations"
                            onClick={handleClickOpen}
                            type="button"
                        >
                            <SettingsIcon fontSize="large" />
                        </button>

                        {configurationDialog}
                    </div>
                ) : (
                    <div
                        style={{
                            flex: "none",
                            width: isLargeView ? "300px" : "200px",
                            padding: "0px 10px 0px 10px",
                            color: "#FFFFFF",
                            fontSize: "0.8em",
                        }}
                    >
                        {isLargeView ? controlButtons : null}
                        {controlPanel}
                        {isLargeView ? performanceResultBox : null}
                    </div>
                )}
            </div>
        </ChartGroupLoader>
    );
}
