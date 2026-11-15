import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let chart: Awaited<ReturnType<typeof drawExample>> | undefined;
        let mapData: { features: any[] };
        let view = false;

        const showView = (south: boolean) => {
            view = south;
            northButton.setAttribute("aria-pressed", String(!view));
            southButton.setAttribute("aria-pressed", String(view));
            if (!chart) return;
            chart.setView(view);
            chart.setMapJson(mapData);
            chart.setMap();
        };
        const northButton = h(
            "button",
            { type: "button", class: "sc-button", "aria-pressed": "true", onclick: () => showView(false) },
            "View from north"
        );
        const southButton = h(
            "button",
            { type: "button", class: "sc-button", "aria-pressed": "false", onclick: () => showView(true) },
            "View from south"
        );
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h(
                    "div",
                    { class: "sc-button-group", role: "group", "aria-label": "Map viewpoint" },
                    northButton,
                    southButton
                )
            )
        );

        // The chart is only created once the map data has arrived
        try {
            mapData = await (await fetch("world.json")).json();
        } catch (error) {
            console.error(error);
            return;
        }
        const chartHost = h("div", { class: "sc-chart-wrapper" });
        root.append(chartHost);
        chart = await demo.mount(drawExample, chartHost);
        showView(view);
    });
