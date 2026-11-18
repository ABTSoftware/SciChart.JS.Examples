import { SciChartSurface } from "scichart";
import { Demo, h } from "../../../demoHelpers";
import { createDiscontinuousDateChart, createNumericChart, createCategoryChart } from "./drawExample";
import { AxisSynchroniser } from "../../MultiChart/SyncMultiChart/AxisSynchroniser";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const axisSynchroniser = new AxisSynchroniser();
        let customSettings = true;
        let surfaces: SciChartSurface[] = [];
        let generation = 0;

        const deleteCharts = () => {
            generation++;
            axisSynchroniser.clear();
            surfaces.forEach((surface) => surface.delete());
            surfaces = [];
            chartsHost.replaceChildren();
        };

        // Recreates the three charts with the chosen axis settings and synchronises their x axes.
        const createCharts = async () => {
            deleteCharts();
            const current = generation;
            const inits = [
                createDiscontinuousDateChart(customSettings),
                createNumericChart(customSettings),
                createCategoryChart(customSettings),
            ];
            const hosts = inits.map(() => h("div", { class: "w-full min-h-0", style: { flex: "1 1 0" } }));
            chartsHost.append(...hosts);
            const results = await Promise.all(inits.map((init, index) => init(hosts[index])));
            const created = results.map((result) => result.sciChartSurface as SciChartSurface);
            if (current !== generation) {
                // The settings changed again (or the example was disposed) while these charts were loading.
                created.forEach((surface) => surface.delete());
                return;
            }
            surfaces = created;
            surfaces.forEach((surface) => axisSynchroniser.addAxis(surface.xAxes.get(0)));
        };

        const setCustomSettings = (value: boolean) => {
            if (value === customSettings) return;
            customSettings = value;
            defaultButton.setAttribute("aria-pressed", String(!value));
            customButton.setAttribute("aria-pressed", String(value));
            void createCharts();
        };
        const defaultButton = h(
            "button",
            { type: "button", class: "sc-button", "aria-pressed": "false", onclick: () => setCustomSettings(false) },
            "Default axis settings"
        );
        const customButton = h(
            "button",
            { type: "button", class: "sc-button", "aria-pressed": "true", onclick: () => setCustomSettings(true) },
            "Custom LabelProvider & explicit tick delta"
        );
        const chartsHost = h("div", {
            class: "flex flex-col h-full w-full",
            style: { gap: "0.125rem", backgroundColor: "black" },
        });

        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h(
                    "div",
                    { class: "sc-button-group", role: "group", "aria-label": "axis settings toggle" },
                    defaultButton,
                    customButton
                )
            ),
            chartsHost
        );
        demo.cleanup(deleteCharts);
        await createCharts();
    });
