import { PlayArrowIcon, StopIcon } from "../../../icons";

import { useRef, useState } from "react";
import { ESeriesType } from "scichart";
import { drawExample, ISettings, TMessage } from "./drawExample";
import { ChartGroupLoader, SciChartReact, TResolvedReturnType } from "scichart-react";

export default function RealtimeBigDataShowcase() {
    const controlsRef = useRef<TResolvedReturnType<typeof chartInitFunction>["controls"]>(undefined);

    const [seriesType, setSeriesType] = useState<ESeriesType>(ESeriesType.LineSeries);
    const [isRunning, setIsRunning] = useState(false);
    const [settings, setSettings] = useState<ISettings>({
        seriesCount: 10,
        pointsOnChart: 4, // 10000
        pointsPerUpdate: 1, // 10
        sendEvery: 100,
        initialPoints: 4, // 10000
    });
    const [maxSettings, setMaxSettings] = useState<ISettings>({
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

    const [messages, setMessages] = useState<TMessage[]>([
        { title: "Avg Load Time", detail: "0" },
        { title: "Avg Render Time", detail: "0" },
        { title: "Max FPS", detail: "0" },
    ]);

    const changeChart = (e: any) => {
        controlsRef.current?.stopUpdate();
        controlsRef.current = undefined;
        setIsRunning(false);
        setSeriesType(e.target.value);
    };

    const handleSeriesCount = (newValue: number) => {
        if (controlsRef.current) {
            const seriesCount = newValue;
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
        }
    };
    const handleInitialPoints = (newValue: number) => {
        if (controlsRef.current) {
            const initialPoints = Math.min(newValue, settings.pointsOnChart);
            controlsRef.current.updateSettings({ initialPoints: logScale(initialPoints) });
            setSettings({ ...settings, initialPoints });
        }
    };
    const handlePointsPerUpdate = (newValue: number) => {
        if (controlsRef.current) {
            controlsRef.current.updateSettings({ pointsPerUpdate: logScale(newValue) });
            setSettings({ ...settings, pointsPerUpdate: newValue });
        }
    };
    const handleSendEvery = (newValue: number) => {
        if (controlsRef.current) {
            setSettings({ ...settings, sendEvery: newValue });
            controlsRef.current.updateSettings({ sendEvery: newValue });
        }
    };
    const handlePointsOnChart = (newValue: number) => {
        if (controlsRef.current) {
            const pointsOnChart = newValue;
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
        }
    };

    const handleStartStreaming = () => {
        if (controlsRef.current) {
            if (isRunning) controlsRef.current.stopUpdate();
            controlsRef.current.startUpdate();
            setIsRunning(true);
        }
    };

    const handleStopStreaming = () => {
        if (controlsRef.current) {
            controlsRef.current?.stopUpdate();
            setIsRunning(false);
        }
    };

    const logScale = (value: number) => {
        return Math.round(10 ** value);
    };

    const chartInitFunction = drawExample((newMessages: TMessage[]) => {
        setMessages([...newMessages]);
    }, seriesType);

    return (
        <ChartGroupLoader className="sc-chart-wrapper sc-responsive-chart-wrapper">
            <SciChartReact
                key={seriesType}
                className="sc-chart-wrapper"
                initChart={chartInitFunction}
                onInit={(initResult: TResolvedReturnType<typeof chartInitFunction>) => {
                    controlsRef.current = initResult.controls;
                    initResult.controls.updateSettings({
                        ...settings,
                        initialPoints: logScale(settings.initialPoints),
                        pointsOnChart: logScale(settings.pointsOnChart),
                        pointsPerUpdate: logScale(settings.pointsPerUpdate),
                    });
                    initResult.controls.startUpdate();
                    setIsRunning(true);

                    return () => {
                        initResult.controls.stopUpdate();
                        if (controlsRef.current === initResult.controls) controlsRef.current = undefined;
                    };
                }}
            />

            <aside className="sc-responsive-controls">
                <div className="flex gap-2" style={{ marginBottom: 8 }}>
                    <button
                        className="sc-button sc-button-icon"
                        type="button"
                        disabled={!controlsRef.current}
                        aria-label={isRunning ? "Stop streaming" : "Start streaming"}
                        title={isRunning ? "Stop streaming" : "Start streaming"}
                        onClick={isRunning ? handleStopStreaming : handleStartStreaming}
                    >
                        {isRunning ? <StopIcon /> : <PlayArrowIcon />}
                    </button>

                    <select
                        id="chart-type-select"
                        className="sc-select w-full"
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
                </div>

                <label htmlFor="seriesCount">Number of Series {settings.seriesCount}</label>
                <input
                    className="sc-range"
                    type="range"
                    id="seriesCount"
                    onChange={(event) => handleSeriesCount(event.currentTarget.valueAsNumber)}
                    step={1}
                    min={1}
                    max={maxSettings.seriesCount}
                    value={settings.seriesCount}
                />

                <label htmlFor="InitialPoints">Initial Points {logScale(settings.initialPoints)}</label>
                <input
                    className="sc-range"
                    type="range"
                    id="InitialPoints"
                    list="log-slider-marks"
                    onChange={(event) =>
                        handleInitialPoints(
                            snapLogSliderValue(event.currentTarget.valueAsNumber, maxSettings.initialPoints)
                        )
                    }
                    step="any"
                    min={0.1}
                    max={maxSettings.initialPoints}
                    value={settings.initialPoints}
                    aria-valuetext={`${logScale(settings.initialPoints)} points`}
                />

                <label htmlFor="pointsOnChart">Max Points On Chart {logScale(settings.pointsOnChart)}</label>
                <input
                    className="sc-range"
                    type="range"
                    id="pointsOnChart"
                    list="log-slider-marks"
                    onChange={(event) =>
                        handlePointsOnChart(
                            snapLogSliderValue(event.currentTarget.valueAsNumber, maxSettings.pointsOnChart)
                        )
                    }
                    step="any"
                    min={0.1}
                    max={maxSettings.pointsOnChart}
                    value={settings.pointsOnChart}
                    aria-valuetext={`${logScale(settings.pointsOnChart)} points`}
                />

                <label htmlFor="pointsPerUpdate">Points Per Update {logScale(settings.pointsPerUpdate)}</label>
                <input
                    className="sc-range"
                    type="range"
                    id="pointsPerUpdate"
                    list="log-slider-marks"
                    onChange={(event) =>
                        handlePointsPerUpdate(
                            snapLogSliderValue(event.currentTarget.valueAsNumber, maxSettings.pointsPerUpdate)
                        )
                    }
                    step="any"
                    min={0.1}
                    max={maxSettings.pointsPerUpdate}
                    value={settings.pointsPerUpdate}
                    aria-valuetext={`${logScale(settings.pointsPerUpdate)} points`}
                />

                <label htmlFor="sendEvery">Send Data Interval {settings.sendEvery} ms</label>
                <input
                    className="sc-range"
                    type="range"
                    id="sendEvery"
                    onChange={(event) => handleSendEvery(event.currentTarget.valueAsNumber)}
                    step={1}
                    min={maxSettings.sendEvery}
                    max={500}
                    value={settings.sendEvery}
                    aria-valuetext={`${settings.sendEvery} ms`}
                />

                <datalist id="log-slider-marks">
                    {logSliderMarks.map((value) => (
                        <option key={value} value={Math.log10(value)} />
                    ))}
                </datalist>

                <section className="mt-auto monospace" aria-label="Performance results">
                    <h4>Performance Results</h4>
                    <dl>
                        {messages.map(({ title, detail }) => (
                            <div key={title} className="flex gap-2 justify-between w-full">
                                <dt>{title}:</dt>
                                <dd className="m-0">{detail}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            </aside>
        </ChartGroupLoader>
    );
}
