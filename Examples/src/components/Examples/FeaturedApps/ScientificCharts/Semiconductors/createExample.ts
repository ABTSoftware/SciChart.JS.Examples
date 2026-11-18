import { Demo, h } from "../../../demoHelpers";
import { generateWaferLotData, WaferLotData, WaferDayData } from "./waferData";
import { drawLineChart } from "./lineChart";
import { drawColumnChart } from "./columnChart";
import { drawParetoChart } from "./paretoChart";
import { drawWaferGrid } from "./waferGrid";
import "./styles.css";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("sc-semiconductors-dashboard-container");
        const data = generateWaferLotData(15, 15, new Date(2023, 0, 1));
        data[0].Batches[0].isSelected = true;

        let showColumnChart = false;
        let columnChart: Awaited<ReturnType<typeof drawColumnChart>> | undefined;
        let paretoChart: Awaited<ReturnType<typeof drawParetoChart>> | undefined;
        let waferChart: Awaited<ReturnType<typeof drawWaferGrid>> | undefined;

        // A day selected in the line chart updates both batch charts (the hidden one stays in sync).
        const handlePointSelected = (point: WaferDayData) => {
            point.Batches[0].isSelected = true;
            columnChart?.updateData(point.Batches, showColumnChart);
            paretoChart?.updateData(point.Batches, !showColumnChart);
        };
        // A batch selected in the column or pareto chart is mirrored in the other one and shown in the wafer grid.
        const handleBatchSelected = (point: WaferLotData, isColumnChart: boolean) => {
            if (isColumnChart) paretoChart?.updateSelection(point);
            else columnChart?.updateSelection(point);
            waferChart?.generateSubcharts(point);
        };
        const setShowColumnChart = (value: boolean) => {
            showColumnChart = value;
            paretoButton.setAttribute("aria-pressed", String(!value));
            columnButton.setAttribute("aria-pressed", String(value));
            columnHost.hidden = !value;
            paretoHost.hidden = value;
        };

        const lineHost = h("div", { class: "sc-semiconductors-sci-chart" });
        const columnHost = h("div", { class: "sc-semiconductors-sci-chart", hidden: true });
        const paretoHost = h("div", { class: "sc-semiconductors-sci-chart" });
        const waferHost = h("div", { class: "sc-semiconductors-sci-chart cursor-pointer" });
        const paretoButton = h(
            "button",
            { type: "button", class: "sc-button", "aria-pressed": "true", onclick: () => setShowColumnChart(false) },
            "Pareto Chart"
        );
        const columnButton = h(
            "button",
            { type: "button", class: "sc-button", "aria-pressed": "false", onclick: () => setShowColumnChart(true) },
            "Column Chart"
        );

        root.append(
            h(
                "div",
                { class: "sc-semiconductors-dashboard-layout" },
                h("div", { class: "sc-semiconductors-line-chart-container" }, lineHost),
                // Row for the batch chart (pareto or column) and the wafer grid side by side
                h(
                    "div",
                    { class: "sc-semiconductors-charts-row" },
                    h(
                        "div",
                        { class: "sc-semiconductors-column-chart-container" },
                        h(
                            "div",
                            { class: "sc-semiconductors-chart-header" },
                            h(
                                "div",
                                { class: "sc-button-group", role: "group", "aria-label": "Batch chart type" },
                                paretoButton,
                                columnButton
                            )
                        ),
                        h("div", { class: "sc-semiconductors-chart-wrapper" }, columnHost, paretoHost)
                    ),
                    h("div", { class: "sc-semiconductors-scatter-wafer-container" }, waferHost)
                )
            )
        );

        await Promise.all([
            demo.mount((host) => drawLineChart(host, data, handlePointSelected), lineHost),
            demo
                .mount((host) => drawColumnChart(host, data[0].Batches, handleBatchSelected), columnHost)
                .then((chart) => (columnChart = chart)),
            demo
                .mount((host) => drawParetoChart(host, data[0].Batches, handleBatchSelected), paretoHost)
                .then((chart) => (paretoChart = chart)),
            demo
                .mount((host) => drawWaferGrid(host, data[0].Batches[0]), waferHost)
                .then((chart) => (waferChart = chart)),
        ]);
    });
