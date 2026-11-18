import { PlayArrowIcon, StopIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: Awaited<ReturnType<typeof drawExample>>["controls"] | undefined;
        let isStarted = false;

        const showStarted = (started: boolean) => {
            isStarted = started;
            const label = isStarted ? "Pause updates" : "Start updates";
            toggleButton.setAttribute("aria-label", label);
            toggleButton.title = label;
            toggleButton.replaceChildren(isStarted ? StopIcon() : PlayArrowIcon());
        };
        const toggleButton = h(
            "button",
            {
                class: "sc-button sc-button-icon",
                "aria-label": "Start updates",
                title: "Start updates",
                type: "button",
                onclick: () => {
                    if (!controls) return;
                    if (isStarted) controls.stopUpdate();
                    else controls.startUpdate();
                    showStarted(!isStarted);
                },
            },
            PlayArrowIcon()
        );

        // Live statistics, updated after every rendered frame
        const numberPoints = document.createTextNode("0");
        const fps = document.createTextNode("00");
        const numberSeries = document.createTextNode("0");
        const chartHost = h("div", { class: "w-full h-full" });
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row monospace" },
                toggleButton,
                h("div", {}, "# DataPoints: ", numberPoints),
                h("div", {}, "FPS: ", fps),
                h("div", {}, "# Series: ", numberSeries, " ")
            ),
            chartHost
        );

        const { sciChartSurface, controls: chartControls } = await demo.mount(drawExample, chartHost, (result) =>
            result.controls.stopUpdate()
        );
        controls = chartControls;

        let lastRendered = Date.now();
        const updateStats = () => {
            const currentTime = Date.now();
            const timeDiffSeconds = (currentTime - lastRendered) / 1000;
            lastRendered = currentTime;
            const seriesCount = sciChartSurface.renderableSeries.size();
            numberSeries.data = String(seriesCount);
            numberPoints.data = (
                seriesCount * sciChartSurface.renderableSeries.get(0).dataSeries.count()
            ).toLocaleString();
            fps.data = (1 / timeDiffSeconds).toFixed(0).padStart(2, "0");
        };
        sciChartSurface.rendered.subscribe(updateStats);
        demo.cleanup(() => sciChartSurface.rendered.unsubscribe(updateStats));

        controls.startUpdate();
        showStarted(true);
    });
