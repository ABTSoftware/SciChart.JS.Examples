import { NumberRange, SciChartSurface, SciChartVerticalGroup } from "scichart";
import { DeleteSweepIcon, LinkIcon, LinkOffIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { AxisSynchroniser } from "./AxisSynchroniser";
import { MAX_CHARTS, addToOverview, createChart, createOverview, removeFromOverview } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const verticalGroup = new SciChartVerticalGroup();
        const axisSynchroniser = new AxisSynchroniser(new NumberRange(200, 500));
        // Disposers of the chart panes that are currently shown, by pane id
        const panes = new Map<number, () => void>();
        let nextId = 1;
        let overviewSurface: SciChartSurface | undefined;

        const addButton = h(
            "button",
            {
                type: "button",
                class: "sc-button sc-button-outline",
                onclick: () => panes.size < MAX_CHARTS && addPane(),
            },
            "Add Chart"
        );
        const overviewHost = h("div", { style: { height: "6.25rem", flex: "none" } });
        const panesHost = h("div", { class: "flex flex-col flex-1 overflow-hidden" });
        root.classList.add("flex", "flex-col", "h-full");
        root.append(
            overviewHost,
            h(
                "div",
                { class: "flex flex-none justify-between items-center p-2 pl-4" },
                h(
                    "span",
                    {},
                    h("strong", {}, "Click & drag"),
                    " or ",
                    h("strong", {}, "Mousewheel"),
                    " to zoom/pan the charts."
                ),
                addButton
            ),
            panesHost
        );

        const overviewReady = demo.mount(
            (host) => createOverview(host, axisSynchroniser),
            overviewHost,
            (result) => {
                axisSynchroniser.clear();
                verticalGroup.removeSurface(result.sciChartSurface);
            }
        );

        const addPane = () => {
            const id = nextId++;
            let surface: SciChartSurface | undefined;
            let isSynced = true;
            let removed = false;

            const syncButton = h(
                "button",
                {
                    type: "button",
                    class: "sc-button sc-button-icon",
                    title: "Unsync chart",
                    "aria-label": "Sync chart",
                    "aria-pressed": "true",
                    onclick: () => {
                        if (!surface) return;
                        const axis = surface.xAxes.get(0);
                        if (isSynced) axisSynchroniser.removeAxis(axis);
                        else axisSynchroniser.addAxis(axis);
                        isSynced = !isSynced;
                        syncButton.title = isSynced ? "Unsync chart" : "Sync chart";
                        syncButton.setAttribute("aria-pressed", String(isSynced));
                        syncButton.replaceChildren(isSynced ? LinkIcon() : LinkOffIcon());
                    },
                },
                LinkIcon()
            );
            const chartHost = h("div", { class: "w-full h-full" });
            const pane = h(
                "div",
                { class: "relative flex-1 h-full overflow-hidden", style: { position: "relative" } },
                chartHost,
                // Overlay controls
                h(
                    "div",
                    { class: "absolute top-0 right-0 flex items-center gap-1 m-2" },
                    syncButton,
                    h(
                        "button",
                        {
                            type: "button",
                            class: "sc-button sc-button-icon sc-button-danger",
                            title: "Remove chart",
                            "aria-label": "Remove chart",
                            onclick: () => removePane(),
                        },
                        DeleteSweepIcon()
                    )
                )
            );
            const removePane = () => {
                if (removed) return;
                removed = true;
                panes.delete(id);
                addButton.disabled = panes.size >= MAX_CHARTS;
                pane.remove();
                if (!surface) return;
                if (!overviewSurface.isDeleted) removeFromOverview(surface.renderableSeries.get(0), overviewSurface);
                axisSynchroniser.removeAxis(surface.xAxes.get(0));
                verticalGroup.removeSurface(surface);
                surface.delete();
            };
            panes.set(id, removePane);
            addButton.disabled = panes.size >= MAX_CHARTS;
            panesHost.append(pane);

            return (async () => {
                const { sciChartSurface: overview } = await overviewReady;
                const { sciChartSurface } = await createChart(chartHost, id);
                if (removed) return sciChartSurface.delete();
                surface = sciChartSurface;
                verticalGroup.addSurfaceToGroup(surface);
                axisSynchroniser.addAxis(surface.xAxes.get(0));
                addToOverview(surface.renderableSeries.get(0), overview);
            })().catch((error) => error?.name !== "AbortError" && console.error(error));
        };

        const initialPanes = [addPane(), addPane(), addPane()];

        overviewSurface = (await overviewReady).sciChartSurface;
        verticalGroup.addSurfaceToGroup(overviewSurface);
        // Registered after the overview, so the panes are removed before the overview is deleted
        demo.cleanup(() => [...panes.values()].forEach((removePane) => removePane()));
        await Promise.all(initialPanes);
    });
