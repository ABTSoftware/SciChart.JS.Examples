import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import { fetchGeoJson } from "../../../ExampleData/ExampleDataProvider";

type MapName = "worldConverted" | "europeConverted" | "australiaConverted" | "africaConverted";

const regions: { label: string; mapName: MapName }[] = [
    { label: "World", mapName: "worldConverted" },
    { label: "Europe", mapName: "europeConverted" },
    { label: "Australia", mapName: "australiaConverted" },
    { label: "Africa", mapName: "africaConverted" },
];

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: Awaited<ReturnType<typeof drawExample>>["controls"] | undefined;
        let chartRequested = false;

        const setMapName = (mapName: MapName) => {
            buttons.forEach((button, index) =>
                button.setAttribute("aria-pressed", String(regions[index].mapName === mapName))
            );
            controls?.clearMap();
            return fetchGeoJson(mapName)
                .then(async (data) => {
                    if (!chartRequested) {
                        // The chart is created once the first map has loaded.
                        chartRequested = true;
                        const chartHost = h("div", { class: "sc-chart-wrapper" });
                        chartContainer.append(chartHost);
                        const chart = await demo.mount(drawExample, chartHost, (result) => result.controls.clearMap());
                        chart.controls.setConvertedData(data);
                        chart.controls.setMap();
                        controls = chart.controls;
                    } else {
                        controls?.setConvertedData(data);
                        controls?.setMap();
                    }
                })
                .catch((error) => {
                    if (error?.name !== "AbortError") console.error(error);
                });
        };

        const buttons = regions.map(({ label, mapName }) =>
            h(
                "button",
                {
                    type: "button",
                    class: "sc-button",
                    "aria-pressed": String(mapName === "worldConverted"),
                    onclick: () => setMapName(mapName),
                },
                label
            )
        );
        const chartContainer = h("div", { class: "sc-chart-wrapper flex-auto" });
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h("div", { class: "sc-button-group", role: "group", "aria-label": "map region" }, ...buttons)
            ),
            chartContainer
        );

        await setMapName("worldConverted");
    });
