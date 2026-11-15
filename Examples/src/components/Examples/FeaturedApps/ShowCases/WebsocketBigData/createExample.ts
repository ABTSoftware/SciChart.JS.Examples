import { PlayArrowIcon, StopIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { drawExample, ISettings, TMessage } from "./drawExample";
import { ESeriesType } from "scichart";

type TControls = Awaited<ReturnType<ReturnType<typeof drawExample>>>["controls"];

const maxPoints = 10000000;
const logScale = (value: number) => Math.round(10 ** value);

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

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("sc-responsive-chart-wrapper");

        // State
        let controls: TControls | undefined;
        let isRunning = false;
        let settings: ISettings = {
            seriesCount: 10,
            pointsOnChart: 4, // 10000
            pointsPerUpdate: 1, // 10
            sendEvery: 100,
            initialPoints: 4, // 10000
        };
        let maxSettings: ISettings = {
            seriesCount: 100,
            pointsOnChart: 6, // 1000000
            pointsPerUpdate: 4, // 10000
            sendEvery: 5, // Minimum
            initialPoints: 6, // 1000000
        };

        // Handlers
        const handleSeriesCount = (seriesCount: number) => {
            const newMax = Math.log10(Math.min(1000000, maxPoints / seriesCount));
            maxSettings = { ...maxSettings, pointsOnChart: newMax, initialPoints: newMax };
            const pointsOnChart = Math.min(settings.pointsOnChart, newMax);
            const initialPoints = Math.min(settings.initialPoints, newMax);
            settings = { ...settings, seriesCount, pointsOnChart, initialPoints };
            controls.updateSettings({
                seriesCount,
                pointsOnChart: logScale(pointsOnChart),
                initialPoints: logScale(initialPoints),
            });
        };
        const handleInitialPoints = (newValue: number) => {
            const initialPoints = Math.min(newValue, settings.pointsOnChart);
            controls.updateSettings({ initialPoints: logScale(initialPoints) });
            settings = { ...settings, initialPoints };
        };
        const handlePointsOnChart = (pointsOnChart: number) => {
            const initialPoints = Math.min(settings.initialPoints, pointsOnChart);
            const newMaxSeries = Math.min(100, Math.floor(maxPoints / logScale(pointsOnChart)));
            maxSettings = { ...maxSettings, seriesCount: newMaxSeries };
            const seriesCount = Math.min(settings.seriesCount, newMaxSeries);
            settings = { ...settings, seriesCount, pointsOnChart, initialPoints };
            controls.updateSettings({
                seriesCount,
                pointsOnChart: logScale(pointsOnChart),
                initialPoints: logScale(initialPoints),
            });
        };
        const handlePointsPerUpdate = (pointsPerUpdate: number) => {
            controls.updateSettings({ pointsPerUpdate: logScale(pointsPerUpdate) });
            settings = { ...settings, pointsPerUpdate };
        };
        const handleSendEvery = (sendEvery: number) => {
            settings = { ...settings, sendEvery };
            controls.updateSettings({ sendEvery });
        };
        const toggleStreaming = () => {
            if (!controls) return;
            controls.stopUpdate();
            if (!isRunning) controls.startUpdate();
            isRunning = !isRunning;
            render();
        };

        /** A labelled range input. Changes are ignored (and the slider reverts) while the chart is loading. */
        const slider = (
            id: keyof ISettings | "InitialPoints",
            label: string,
            unit: string,
            step: number | "any",
            change: (value: number) => void
        ) => {
            const valueText = document.createTextNode("");
            const input = h("input", {
                class: "sc-range",
                type: "range",
                id,
                step,
                oninput: () => {
                    if (controls) change(input.valueAsNumber);
                    render();
                },
            });
            aside.append(h("label", { for: id }, `${label}: `, valueText, unit), input);
            return { input, valueText };
        };

        // Chart and controls
        let chartHost = h("div", { class: "sc-chart-wrapper" });
        const toggleButton = h("button", {
            class: "sc-button sc-button-icon",
            type: "button",
            onclick: toggleStreaming,
        });
        const chartTypeSelect = h(
            "select",
            {
                id: "chart-type-select",
                class: "sc-select w-full",
                "aria-label": "Chart type",
                value: ESeriesType.LineSeries,
                onchange: () => initChart(chartTypeSelect.value as ESeriesType),
            },
            h("option", { value: ESeriesType.LineSeries }, "Line Chart"),
            h("option", { value: ESeriesType.ColumnSeries }, "Column Chart"),
            h("option", { value: ESeriesType.StackedMountainSeries }, "Mountain Chart"),
            h("option", { value: ESeriesType.BandSeries }, "Band Chart"),
            h("option", { value: ESeriesType.ScatterSeries }, "Scatter Chart"),
            h("option", { value: ESeriesType.CandlestickSeries }, "Candlestick Chart")
        );
        const aside = h(
            "aside",
            { class: "sc-responsive-controls" },
            h("div", { class: "flex gap-2 mb-2" }, toggleButton, chartTypeSelect)
        );
        const seriesCount = slider("seriesCount", "Number of Series", "", 1, handleSeriesCount);
        const initialPoints = slider("InitialPoints", "Initial Points", "", "any", (value) =>
            handleInitialPoints(snapLogSliderValue(value, maxSettings.initialPoints))
        );
        const pointsOnChart = slider("pointsOnChart", "Max Points On Chart", "", "any", (value) =>
            handlePointsOnChart(snapLogSliderValue(value, maxSettings.pointsOnChart))
        );
        const pointsPerUpdate = slider("pointsPerUpdate", "Points Per Update", "", "any", (value) =>
            handlePointsPerUpdate(snapLogSliderValue(value, maxSettings.pointsPerUpdate))
        );
        const sendEvery = slider("sendEvery", "Send Data Interval", " ms", 1, handleSendEvery);

        const results = h("dl");
        const setMessages = (messages: TMessage[]) =>
            results.replaceChildren(
                ...messages.map(({ title, detail }) =>
                    h(
                        "div",
                        { class: "flex gap-2 justify-between w-full" },
                        h("dt", {}, title, ":"),
                        h("dd", { class: "m-0" }, detail)
                    )
                )
            );
        aside.append(
            h(
                "section",
                { class: "mt-auto monospace", "aria-label": "Performance results" },
                h("h4", {}, "Performance Results"),
                results
            )
        );
        root.append(chartHost, aside);

        /** Sync the controls with the current state. */
        const render = () => {
            const streamingLabel = isRunning ? "Stop streaming" : "Start streaming";
            toggleButton.disabled = !controls;
            toggleButton.title = streamingLabel;
            toggleButton.setAttribute("aria-label", streamingLabel);
            toggleButton.replaceChildren(isRunning ? StopIcon() : PlayArrowIcon());

            const setSlider = (
                { input, valueText }: { input: HTMLInputElement; valueText: Text },
                min: number,
                max: number,
                value: number,
                text: number,
                ariaValueText?: string
            ) => {
                input.min = String(min);
                input.max = String(max);
                input.value = String(value);
                valueText.data = String(text);
                if (ariaValueText) input.setAttribute("aria-valuetext", ariaValueText);
            };
            const points = (value: number) => `${logScale(value)} points`;
            setSlider(seriesCount, 1, maxSettings.seriesCount, settings.seriesCount, settings.seriesCount);
            setSlider(
                initialPoints,
                0.1,
                maxSettings.initialPoints,
                settings.initialPoints,
                logScale(settings.initialPoints),
                points(settings.initialPoints)
            );
            setSlider(
                pointsOnChart,
                0.1,
                maxSettings.pointsOnChart,
                settings.pointsOnChart,
                logScale(settings.pointsOnChart),
                points(settings.pointsOnChart)
            );
            setSlider(
                pointsPerUpdate,
                0.1,
                maxSettings.pointsPerUpdate,
                settings.pointsPerUpdate,
                logScale(settings.pointsPerUpdate),
                points(settings.pointsPerUpdate)
            );
            setSlider(
                sendEvery,
                maxSettings.sendEvery,
                500,
                settings.sendEvery,
                settings.sendEvery,
                `${settings.sendEvery} ms`
            );
        };

        // Every chart type gets a fresh chart: the previous one is stopped and deleted first.
        let chartDemo: Demo | undefined;
        const initChart = (seriesType: ESeriesType) => {
            chartDemo?.dispose();
            controls = undefined;
            isRunning = false;
            render();

            const host = h("div", { class: "sc-chart-wrapper" });
            chartHost.replaceWith(host);
            chartHost = host;
            chartDemo = new Demo(host, async (chart) => {
                const result = await chart.mount(drawExample(setMessages, seriesType), host, (result) =>
                    result.controls.stopUpdate()
                );
                controls = result.controls;
                controls.updateSettings({
                    ...settings,
                    initialPoints: logScale(settings.initialPoints),
                    pointsOnChart: logScale(settings.pointsOnChart),
                    pointsPerUpdate: logScale(settings.pointsPerUpdate),
                });
                controls.startUpdate();
                isRunning = true;
                render();
            });
            return chartDemo.ready;
        };

        setMessages([
            { title: "Avg Load Time", detail: "0" },
            { title: "Avg Render Time", detail: "0" },
            { title: "Max FPS", detail: "0" },
        ]);
        demo.cleanup(() => chartDemo?.dispose());
        await initChart(ESeriesType.LineSeries);
    });
