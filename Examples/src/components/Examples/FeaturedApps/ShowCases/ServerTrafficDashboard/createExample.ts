import { CloseIcon, SettingsIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { ChartModifierBase2D, SciChartOverview } from "scichart";
import { getMainChartConfig } from "./main-chart-config";
import { getPageStatisticsChartConfig } from "./page-statistics-chart-config";
import { getServerLoadChartConfig } from "./server-load-chart-config";
import { getRegionStatisticsColumnChartConfig, createRegionStatisticsPieChart } from "./region-statistic-charts";
import { overviewOptions } from "./Overview";
import { afterAllChartsInit } from "./after-all-charts-init";
import { VisibleRangeSynchronizationManager } from "./VisibleRangeSynchronizationManager";
import { ModifierGroup } from "./ModifierGroup";
import { GridLayoutModifier } from "./GridLayoutModifier";
import { appTheme } from "../../../theme";
import "./styles.css";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("sc-server-traffic");
        const group = new ModifierGroup();
        const syncManager = new VisibleRangeSynchronizationManager();
        let page: Awaited<ReturnType<ReturnType<typeof getPageStatisticsChartConfig>>> | undefined;
        let load: Awaited<ReturnType<ReturnType<typeof getServerLoadChartConfig>>> | undefined;
        let gridModifier: GridLayoutModifier | undefined;

        // Configuration dialog, shown as an overlay on the page body while open
        const closeDialog = () => backdrop.remove();
        const closeButton = h(
            "button",
            {
                class: "sc-button sc-button-icon",
                "aria-label": "Close chart configurations",
                type: "button",
                onclick: closeDialog,
            },
            CloseIcon()
        );
        const setting = (label: string, checked: boolean, change: (checked: boolean) => void) => {
            const input = h("input", { type: "checkbox", checked, onchange: () => change(input.checked) });
            return h("label", { class: "sc-switch" }, input, label);
        };
        const backdrop = h(
            "div",
            {
                class: "sc-modal-backdrop",
                onclick: (event: MouseEvent) => event.target === event.currentTarget && closeDialog(),
                onkeydown: (event: KeyboardEvent) => event.key === "Escape" && closeDialog(),
            },
            h(
                "section",
                { class: "sc-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "server-config-title" },
                h(
                    "header",
                    { class: "sc-modal-header" },
                    h("strong", { id: "server-config-title" }, "Chart Configurations"),
                    closeButton
                ),
                h(
                    "div",
                    { class: "sc-modal-body" },
                    h("strong", {}, "Main Chart"),
                    setting("Sync X-Axis visible range", true, (checked) => (syncManager.enabled = checked)),
                    h("strong", {}, "URL Statistics Chart"),
                    setting("is 100% collection", false, () => page?.toggleIsHundredPercent()),
                    h("strong", {}, "Server Load Statistics Chart"),
                    setting("is Grid Layout", false, (isGrid) => {
                        if (!load || !gridModifier) return;
                        gridModifier.isGrid = isGrid;
                        load.sciChartSurface.titleStyle.color = isGrid ? "transparent" : appTheme.ForegroundColor;
                        load.sciChartSurface.subCharts.forEach((chart) => {
                            const modifier = chart.chartModifiers.getById(
                                "ServerLoadCursorModifier"
                            ) as ChartModifierBase2D;
                            if (isGrid) group.add(modifier);
                            else group.remove(modifier);
                        });
                    })
                )
            )
        );
        demo.cleanup(closeDialog);

        // Dashboard layout
        const mainPlot = h("div", { style: { height: "100%", width: "100%" } });
        const overviewHost = h("div", { style: { position: "relative", height: "20%" } });
        const mainHost = h(
            "div",
            { class: "relative sc-server-main-chart h-full", style: { position: "relative" } },
            mainPlot,
            overviewHost
        );
        const pageHost = h("div", { class: "sc-server-page-chart", style: { position: "relative" } });
        const loadHost = h("div", { class: "sc-server-load-chart", style: { position: "relative" } });
        const regionHost = h("div", { class: "sc-server-region-chart", style: { position: "relative" } });
        const pieHost = h("div", { class: "sc-server-region-pie", style: { position: "relative" } });
        root.append(
            h(
                "div",
                { class: "h-full sc-server-traffic-grid", style: { position: "relative" } },
                h(
                    "div",
                    { class: "sc-server-traffic-settings m-1", title: "Chart Configurations" },
                    h(
                        "button",
                        {
                            class: "sc-button sc-button-icon",
                            "aria-label": "Chart configurations",
                            type: "button",
                            onclick: () => {
                                document.body.append(backdrop);
                                closeButton.focus();
                            },
                        },
                        SettingsIcon()
                    )
                ),
                mainHost,
                pageHost,
                loadHost,
                regionHost,
                pieHost
            )
        );

        const width = root.getBoundingClientRect().width;
        const viewInfo = { isLargeView: width > 1200, isMobileView: width < 600 };
        const results = await Promise.all([
            demo.mount(getMainChartConfig(viewInfo), mainPlot),
            demo.mount(getPageStatisticsChartConfig(viewInfo), pageHost),
            demo.mount(getServerLoadChartConfig(viewInfo), loadHost),
            demo.mount(getRegionStatisticsColumnChartConfig(viewInfo), regionHost),
            demo.mount(createRegionStatisticsPieChart, pieHost),
        ]);
        const main = results[0];
        page = results[1];
        load = results[2];
        const addModifier = (surface: typeof main.sciChartSurface, ...ids: string[]) =>
            ids.forEach((id) => group.add(surface.chartModifiers.getById(id) as ChartModifierBase2D));
        addModifier(main.sciChartSurface, "TotalRequestsCursorModifier", "TotalRequestsRolloverModifier");
        addModifier(page.sciChartSurface, "PageStatisticsRolloverModifier");
        addModifier(load.sciChartSurface, "ServerLoadCursorModifier");
        gridModifier = load.sciChartSurface.chartModifiers.getById("GridLayoutModifier") as GridLayoutModifier;

        // Threshold slider, pinned to the top right corner of the main chart's series area
        const threshold = h(
            "div",
            { class: "absolute", style: { fontSize: "0.875rem" }, hidden: true },
            "Duration Threshold",
            h("br"),
            h("input", {
                type: "range",
                min: "0",
                max: "2000",
                class: "sc-range",
                value: "1600",
                oninput: (event: Event) => main.updateThreshold(parseInt((event.target as HTMLInputElement).value)),
            })
        );
        mainPlot.after(threshold);
        const positionThreshold = () => {
            const bounds = main.sciChartSurface.seriesViewRect;
            if (!bounds) return;
            threshold.hidden = false;
            threshold.style.top = `${bounds.top - 13}px`;
            threshold.style.right = `${main.sciChartSurface.renderSurface.viewportSize.width - bounds.right - 10}px`;
        };
        main.sciChartSurface.rendered.subscribe(positionThreshold);
        positionThreshold();
        demo.cleanup(() => main.sciChartSurface.rendered.unsubscribe(positionThreshold));

        afterAllChartsInit(syncManager)(results);
        const overview = await SciChartOverview.create(main.sciChartSurface, overviewHost, overviewOptions);
        demo.cleanup(() => overview.delete());
    });
