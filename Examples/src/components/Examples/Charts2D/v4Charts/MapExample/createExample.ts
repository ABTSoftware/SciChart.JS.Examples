import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import { getMinMax, australiaData, Keytype, interpolateColor, keyData } from "./helpers";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let key: Keytype = "population";
        let setChartMap: ((nextKey: Keytype) => void) | undefined;

        const metricButton = (value: Keytype, ...label: (Node | string)[]) =>
            h(
                "button",
                {
                    type: "button",
                    class: "sc-button",
                    "aria-pressed": String(key === value),
                    onclick: () => setMap(value),
                },
                ...label
            );
        const buttons: [Keytype, HTMLButtonElement][] = [
            ["population", metricButton("population", "Population")],
            ["area_km2", metricButton("area_km2", h("span", {}, "Area (km", h("sup", {}, "2"), ")"))],
            ["population_density", metricButton("population_density", "Population Density")],
        ];

        const legend = h("div", {
            class: "absolute flex flex-col top-2 left-2 pointer-events-none",
            style: { fontSize: "0.75rem" },
        });
        const renderLegend = () => {
            const [minValue, maxValue] = getMinMax(key, australiaData);
            legend.replaceChildren(
                ...australiaData.map((d) =>
                    h(
                        "span",
                        {},
                        h("span", {
                            style: {
                                width: "0.625rem",
                                height: "0.625rem",
                                display: "inline-block",
                                marginRight: "0.375rem",
                                backgroundColor: interpolateColor(minValue, maxValue, keyData[d.state][key]),
                            },
                        }),
                        d.state,
                        " - ",
                        new Intl.NumberFormat().format(keyData[d.state][key])
                    )
                )
            );
        };
        const setMap = (nextKey: Keytype) => {
            setChartMap?.(nextKey);
            key = nextKey;
            buttons.forEach(([value, button]) => button.setAttribute("aria-pressed", String(value === key)));
            renderLegend();
        };
        renderLegend();

        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h(
                    "div",
                    { class: "sc-button-group", role: "group", "aria-label": "map metric" },
                    ...buttons.map(([, button]) => button)
                )
            ),
            h("div", { class: "sc-chart-wrapper flex-auto" }, legend)
        );

        // The chart is created once the map outlines have been downloaded.
        let mapData: unknown;
        try {
            mapData = await (await fetch("australiaConverted.json")).json();
        } catch (error) {
            console.error(error);
            return;
        }
        const chartHost = h("div", { class: "sc-chart-wrapper" });
        legend.before(chartHost);
        const chart = await demo.mount(drawExample, chartHost);
        chart.setMapJson(mapData as Parameters<typeof chart.setMapJson>[0]);
        chart.setMap(key);
        setChartMap = chart.setMap;
    });
