import { Demo, h } from "../../../demoHelpers";
import "./OIlGasStyles.css";
import { SciChartVerticalGroup } from "scichart";
import init3dChart from "./charts/3d";
import init2dFirstChart from "./charts/2dcharts/first";
import init2dSecondChart from "./charts/2dcharts/second";
import init2dThirdChart from "./charts/2dcharts/third";
import init2dFourthChart from "./charts/2dcharts/fourth";
import init2dFifthChart from "./charts/2dcharts/fifth";
import init2dSixthChart from "./charts/2dcharts/sixth";
import init2dSeventhChart from "./charts/2dcharts/seventh";
import init2dEighthChart from "./charts/2dcharts/eighth";
import init2dNinthChart from "./charts/2dcharts/ninth";
import { appTheme } from "./theme";
import { RolloverModifier } from "scichart";
import { drawDensityChart } from "./charts/VerticalCharts/DensityChart";
import { drawPoreSpaceChart } from "./charts/VerticalCharts/PoreSpaceChart";
import { drawResistivityChart } from "./charts/VerticalCharts/ResistivityChart";
import { drawShaleChart } from "./charts/VerticalCharts/ShaleChart";
import { drawSonicChart } from "./charts/VerticalCharts/SonicChart";
import { drawTextureChart } from "./charts/VerticalCharts/TextureChart";

const SHALE_PATTERN =
    '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="grid1" patternUnits="userSpaceOnUse" width="10" height="10"><line x1="0" y1="0" x2="10" y2="10" stroke="#474747"/></pattern><pattern id="grid2" patternUnits="userSpaceOnUse" width="10" height="10"><line x1="0" y1="10" x2="10" y2="0" stroke="#474747"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid1)"/><rect width="100%" height="100%" fill="url(#grid2)"/></svg>';

const sidebarTitle = (title: string, from: string, unit: string, to: string) =>
    h(
        "div",
        { class: "sidebar-charts-2d-title-item sidebar-charts-2d-item sidebar-charts-2d-item-small" },
        h("div", { class: "sidebar-charts-2d-title" }, title),
        h("div", { class: "sidebar-charts-2d-line" }, h("div", {}, from), h("div", {}, unit), h("div", {}, to))
    );

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("flex");

        // Vertical well-log charts, each under its own legend
        const verticalCharts = [
            { legend: "shale-legend", init: drawShaleChart },
            { legend: "density-legend", init: drawDensityChart },
            { legend: "resistivity-legend", init: drawResistivityChart },
            { legend: "pore-space-legend", init: drawPoreSpaceChart },
            { legend: "sonic-legend", init: drawSonicChart },
            { legend: "texture-legend", init: drawTextureChart },
        ].map(({ legend, init }) => ({ init, host: h("div", { class: "chart-root" }), legend }));
        const main = h(
            "div",
            { class: "main-container" },
            h(
                "div",
                { id: "main-charts" },
                ...verticalCharts.map(({ legend, host }) =>
                    h(
                        "div",
                        { class: "chart-container" },
                        h("div", { id: legend, class: "legend-root" }),
                        legend === "shale-legend" &&
                            h("div", {
                                id: "shale-chart-background",
                                class: "chart-root",
                                style: { background: appTheme.ShaleBackgroundColor },
                                innerHTML: SHALE_PATTERN,
                            }),
                        host
                    )
                )
            )
        );
        root.append(main);

        // Sidebar with the small 2D charts and the 3D chart; only rendered on wide screens
        let removeSidebar: (() => void) | undefined;
        const addSidebar = () => {
            const chartHosts = [
                init2dFirstChart,
                init2dSecondChart,
                init2dThirdChart,
                init2dFourthChart,
                init2dFifthChart,
                init2dSixthChart,
                init2dSeventhChart,
                init2dEighthChart,
                init2dNinthChart,
            ].map((init) => ({ init, host: h("div", { class: "sidebar-charts-2d-item" }) }));
            const chart3dHost = h("div", { class: "sidebar-charts-3d" });
            const sidebar = h(
                "div",
                { class: "sidebar-charts" },
                h(
                    "div",
                    { id: "sidebar-charts-2d", class: "sidebar-charts-2d" },
                    h(
                        "div",
                        { class: "sidebar-charts-2d-title-container" },
                        sidebarTitle("GR", "0", "(GAP)", "200"),
                        sidebarTitle("RHDB", "100", "(RCI)", "206"),
                        sidebarTitle("NPHI", "0.45", "(VIV)", "4.11")
                    ),
                    h("div", { class: "grid-container" }, ...chartHosts.map(({ host }) => host))
                ),
                chart3dHost
            );
            main.before(sidebar);
            const charts = Promise.all([...chartHosts.map(({ init, host }) => init(host)), init3dChart(chart3dHost)]);
            removeSidebar = () => {
                removeSidebar = undefined;
                sidebar.remove();
                void charts.then((results) => results.forEach(({ sciChartSurface }) => sciChartSurface.delete()));
            };
            return charts;
        };
        const query = window.matchMedia("(max-width: 900px)");
        const updateSidebar = () => {
            removeSidebar?.();
            return query.matches ? undefined : addSidebar();
        };
        query.addEventListener("change", updateSidebar);
        demo.cleanup(() => {
            query.removeEventListener("change", updateSidebar);
            removeSidebar?.();
        });

        const [results] = await Promise.all([
            Promise.all(verticalCharts.map(({ init, host }) => demo.mount(init, host))),
            updateSidebar(),
        ]);

        // Synchronise the vertical charts: aligned axes and a shared rollover line
        const verticalGroup = new SciChartVerticalGroup();
        results.forEach(({ sciChartSurface }) => {
            verticalGroup.addSurfaceToGroup(sciChartSurface);
            sciChartSurface.chartModifiers.add(
                new RolloverModifier({
                    modifierGroup: "VerticalChartsGroup",
                    rolloverLineStroke: appTheme.RolloverLineColor,
                })
            );
        });
        demo.cleanup(() => results.forEach(({ sciChartSurface }) => verticalGroup.removeSurface(sciChartSurface)));
    });
