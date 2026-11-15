import { Demo, element, h } from "../../../demoHelpers";
import { SciChartOverview } from "scichart";
import { createInitWaferChart } from "./waferChart";
import { createInitScatterPlot } from "./scatterPlot";
import { createInitMeasureChart, overviewOptions } from "./measureCharts";
import dataStore from "./dataStore";
import { generateWaferDataByValues } from "./waferData";
import { appTheme } from "../../../theme";
import "./styles.css";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("wafer-analysis-container");
        const seedValue = new URLSearchParams(window.location.search).get("seed");
        const seed = seedValue ? parseInt(seedValue, 10) : 1337;
        dataStore.getState().setData(generateWaferDataByValues(150, Number.isFinite(seed) ? seed : 1337));
        const state = dataStore.getState();
        const left = element("div", root, "left-panel");
        const waferHost = element("div", left, "wafer-chart-container");
        element("div", left).id = "wafer-legend";
        const colorPanel = element("div", element("div", left, "variable-selection"), "variable-selection-content");
        const variableSelect = h(
            "select",
            {
                class: "sc-select",
                "aria-label": "Color wafer by",
                onchange: () => wafer?.updatePaletteProvider(variableSelect.value, ranges[variableSelect.value]),
            },
            ...["DEFECT", "MR", "HR", "MR2", "HDI"].map((variable) => h("option", { value: variable }, variable))
        );
        colorPanel.append(h("p", {}, "Color by:"), variableSelect);
        const right = element("div", root, "right-panel");
        const scatterHost = element("div", right, "scatter-plot-container");
        const grid = element("div", right, "charts-grid");
        const top = element("div", grid, "charts-row"),
            bottom = element("div", grid, "charts-row");
        type Measure = Awaited<ReturnType<ReturnType<typeof createInitMeasureChart>>>;
        let wafer: Awaited<ReturnType<ReturnType<typeof createInitWaferChart>>>,
            scatter: Awaited<ReturnType<ReturnType<typeof createInitScatterPlot>>>;
        const measures: { chart: Measure; group: typeof state.MRs }[] = [];
        const refresh = () => {
            scatter?.updateScatterPlotData(state.dies.allFiltered());
            wafer?.updateWaferData(state.dies.allFiltered([state.Row, state.Col]));
            measures.forEach(({ chart, group }) =>
                chart.updateMeasureChartData(
                    group.all().map((d) => d.key),
                    group.all().map((d) => Math.abs(d.value as number))
                )
            );
        };
        const filter = (dimension: typeof state.Row, values: [number, number]) => {
            if (values?.[0] != null && values?.[1] != null) dimension.filter(values);
            else dimension.filterAll();
            refresh();
        };
        const ranges: Record<string, [number, number]> = {};
        for (const key of ["MR", "HR", "MR2", "HDI"] as const) {
            const dimension = state[key];
            ranges[key] = [dimension.bottom(1)[0]?.[key] ?? 0, dimension.top(1)[0]?.[key] ?? 1];
        }
        wafer = await demo.chart(
            createInitWaferChart(
                (values) => filter(state.Row, values),
                (values) => filter(state.Col, values),
                "DEFECT",
                undefined
            ),
            waferHost,
            "wafer-chart"
        );
        scatter = await demo.chart(createInitScatterPlot(), scatterHost, "sci-chart");
        const configs = [
            { key: "MR", group: state.MRs, dimension: state.MR, fill: appTheme.MutedTeal, parent: top },
            { key: "MR2", group: state.MR2s, dimension: state.MR2, fill: appTheme.MutedPurple, parent: top },
            { key: "HR", group: state.HRs, dimension: state.HR, fill: appTheme.PaleOrange, parent: bottom },
            { key: "HDI", group: state.HDIs, dimension: state.HDI, fill: appTheme.MutedSkyBlue, parent: bottom },
        ];
        for (const config of configs) {
            const panel = element("div", config.parent, "chart-column");
            const title = element("h5", panel, "chart-title");
            const showBounds = (bounds?: [number, number]) =>
                title.replaceChildren(
                    ...[`${config.key} values - `, bounds?.[0], " to ", bounds?.[1]]
                        .filter((part) => part != null)
                        .map(String)
                );
            showBounds();
            const chartHost = element("div", panel, "chart-with-overview");
            chartHost.style.position = "relative";
            const main = element("div", chartHost, "chart-inner-container");
            const overview = element("div", chartHost, "chart-overview");
            const values = config.group.all();
            const chart = await demo.chart(
                createInitMeasureChart(
                    values.map((d) => d.key),
                    values.map((d) => Math.abs(d.value as number)),
                    (bounds) => {
                        showBounds(bounds);
                        filter(config.dimension, bounds);
                    },
                    config.fill
                ),
                main
            );
            measures.push({ chart, group: config.group });
            const view = await SciChartOverview.create(chart.sciChartSurface, overview, overviewOptions);
            demo.cleanup(() => view.delete());
        }
        refresh();
        demo.cleanup(() => {
            [state.Row, state.Col, state.MR, state.MR2, state.HR, state.HDI].forEach((dimension) =>
                dimension.filterAll()
            );
        });
    });
