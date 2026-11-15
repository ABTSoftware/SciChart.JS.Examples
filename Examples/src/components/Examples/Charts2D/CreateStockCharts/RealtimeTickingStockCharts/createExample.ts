import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import { sciChartOverview } from "./createCandlestickChart";
import { SciChartOverview } from "scichart";

type TChartControls = Awaited<ReturnType<ReturnType<typeof drawExample>>>["controls"];

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: TChartControls | undefined;
        let preset = 0;

        const handleToggleButtonChanged = (state: number) => {
            if (!controls) return;
            preset = state;
            candlestickButton.setAttribute("aria-pressed", String(preset === 0));
            ohlcButton.setAttribute("aria-pressed", String(preset === 1));
            if (state === 0) controls.enableCandlestick();
            if (state === 1) controls.enableOhlc();
        };

        const candlestickButton = h(
            "button",
            { type: "button", class: "sc-button", "aria-pressed": "true", onclick: () => handleToggleButtonChanged(0) },
            "Candlestick Series"
        );
        const ohlcButton = h(
            "button",
            {
                type: "button",
                class: "sc-button",
                "aria-pressed": "false",
                onclick: () => handleToggleButtonChanged(1),
            },
            "OHLC Series"
        );
        const dataSourceSelect: HTMLSelectElement = h(
            "select",
            {
                class: "sc-select",
                id: "data-source-select",
                value: "Random",
                onchange: (): void => void createChart(dataSourceSelect.value),
            },
            h("option", { value: "Random" }, "Random"),
            h("option", { value: "com" }, "Binance.com"),
            h("option", { value: "us" }, "Binance.us")
        );
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h(
                    "div",
                    { class: "sc-button-group", role: "group", "aria-label": "Playback" },
                    candlestickButton,
                    ohlcButton
                ),
                h("label", { class: "sc-control", for: "data-source-select" }, "Data Source", dataSourceSelect)
            )
        );

        // The chart (with its overview) is recreated from scratch whenever the data source changes
        let disposeChart = () => {};
        const createChart = async (dataSource: string) => {
            disposeChart();
            const mainHost = h("div", { style: { width: "100%", height: "100%" } });
            const overviewHost = h("div", { class: "sc-overview", style: { position: "relative" } });
            const host = h(
                "div",
                { class: "sc-overview-chart", style: { position: "relative" } },
                mainHost,
                overviewHost
            );
            root.append(host);

            let disposed = false;
            const disposers = [() => host.remove()];
            const dispose = () => {
                disposed = true;
                disposers
                    .splice(0)
                    .reverse()
                    .forEach((disposer) => disposer());
            };
            disposeChart = dispose;

            const result = await drawExample(dataSource)(mainHost);
            disposers.push(
                () => result.sciChartSurface.delete(),
                () => result.subscription.unsubscribe()
            );
            if (disposed) return dispose();
            controls = result.controls;
            if (preset === 1) controls.enableOhlc();

            const overview = await SciChartOverview.create(result.sciChartSurface, overviewHost, sciChartOverview);
            disposers.push(() => overview.delete());
            if (disposed) dispose();
        };
        demo.cleanup(() => disposeChart());
        await createChart("Random");
    });
