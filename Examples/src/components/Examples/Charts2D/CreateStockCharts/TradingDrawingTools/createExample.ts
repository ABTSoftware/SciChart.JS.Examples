import { CloseIcon, CopyIcon, DeleteSweepIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import { DrawingTool, toolGroups } from "./tools";
import { toolIcons } from "./toolIcons";

const toolIcon = (name: string) =>
    h("span", {
        class: "inline-flex flex-none",
        style: { width: "1.75rem", height: "1.75rem" },
        "aria-hidden": "true",
        innerHTML: toolIcons[name].replace("<svg ", '<svg style="width:100%;height:100%" '),
    });

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let api: Awaited<ReturnType<typeof drawExample>> | undefined;

        const stopTool = () => {
            api?.stopActiveTools();
            showSelectedTool(undefined);
        };
        const selectTool = (tool: DrawingTool) => {
            if (!api) return;
            if (tool.gesture === "erase") api.startEraser();
            else api.startTool(tool.annotationType, tool.options);
            showSelectedTool(tool);
            dialog.close();
        };

        // Toolbar
        const openButton = h(
            "button",
            {
                type: "button",
                class: "sc-button sc-button-outline",
                disabled: true,
                "aria-haspopup": "dialog",
                onclick: () => {
                    stopTool();
                    search.value = "";
                    renderTools();
                    dialog.showModal();
                    search.focus();
                },
            },
            toolIcon("Pen"),
            " Drawing tools"
        );
        const status = h("span", {
            class: "flex items-center gap-2",
            style: { fontSize: "0.875rem" },
            role: "status",
            hidden: true,
        });
        const cancelButton = h(
            "button",
            {
                type: "button",
                class: "sc-button sc-button-icon",
                title: "Cancel drawing (Esc)",
                "aria-label": "Cancel drawing",
                hidden: true,
                onclick: stopTool,
            },
            CloseIcon()
        );
        const duplicateButton = h(
            "button",
            {
                type: "button",
                class: "sc-button sc-button-icon",
                disabled: true,
                "aria-label": "Copy selected annotation",
                title: "Duplicate selected annotation (Ctrl/Cmd+D)",
                onclick: () => api?.duplicateSelectedAnnotation(),
            },
            CopyIcon()
        );
        const deleteButton = h(
            "button",
            {
                type: "button",
                class: "sc-button sc-button-icon sc-button-danger",
                disabled: true,
                "aria-label": "Delete all annotations",
                title: "Delete all annotations",
                onclick: () => {
                    stopTool();
                    api?.deleteAllAnnotations();
                },
            },
            DeleteSweepIcon()
        );
        const showSelectedTool = (tool: DrawingTool | undefined) => {
            status.hidden = cancelButton.hidden = !tool;
            status.replaceChildren();
            if (!tool) return;
            const gesture =
                tool.gesture === "erase"
                    ? "Click or drag to erase"
                    : tool.gesture === "drag"
                    ? "Drag to draw"
                    : "Click to place points";
            status.append(toolIcon(tool.icon), h("span", {}, `${tool.label} · ${gesture}`));
        };

        // Tool picker dialog
        const search = h("input", {
            type: "search",
            class: "sc-input",
            "aria-label": "Search drawing tools",
            placeholder: "Search drawing tools…",
            autofocus: true,
            oninput: () => renderTools(),
        });
        const hint = h(
            "p",
            { class: "text-xs" },
            "Choose a tool, then draw on the chart. Press Esc to cancel. Select a drawing to move or edit it."
        );
        const body = h("div", { class: "sc-modal-body" }, search, hint);
        const renderTools = () => {
            const query = search.value.trim().toLowerCase();
            const groups = toolGroups
                .map((group) => ({
                    ...group,
                    tools: group.tools.filter((tool) => `${group.label} ${tool.label}`.toLowerCase().includes(query)),
                }))
                .filter((group) => group.tools.length);
            // Sections follow the search box and hint, exactly as in the React markup.
            while (hint.nextSibling) hint.nextSibling.remove();
            body.append(
                ...groups.map((group) =>
                    h(
                        "section",
                        {},
                        h(
                            "h3",
                            { style: { margin: "0.3125rem 0.1875rem", fontSize: "0.875rem", fontWeight: "600" } },
                            group.label
                        ),
                        h(
                            "div",
                            {
                                class: "gap-2",
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 14.375rem), 1fr))",
                                },
                            },
                            ...group.tools.map((tool) =>
                                h(
                                    "button",
                                    {
                                        type: "button",
                                        class: "sc-button sc-button-outline justify-start",
                                        onclick: () => selectTool(tool),
                                    },
                                    toolIcon(tool.icon),
                                    h("span", {}, tool.label)
                                )
                            )
                        )
                    )
                )
            );
            if (!groups.length) body.append(h("p", { role: "status" }, `No tools match “${search.value}”.`));
        };
        const dialog = h(
            "dialog",
            {
                class: "sc-modal p-0",
                style: { width: "min(53.75rem, calc(100% - 2rem))", margin: "auto", touchAction: "auto" },
                "aria-labelledby": "trading-tools-title",
                onclick: (event: MouseEvent) => event.target === dialog && dialog.close(),
            },
            h(
                "header",
                { class: "sc-modal-header top-0 sticky pl-4", style: { background: "var(--sc-background)" } },
                h("strong", { id: "trading-tools-title" }, "Drawing tools"),
                h(
                    "button",
                    {
                        type: "button",
                        class: "sc-button sc-button-icon",
                        "aria-label": "Close drawing tools",
                        onclick: () => dialog.close(),
                    },
                    CloseIcon()
                )
            ),
            body
        );
        renderTools();

        const chartHost = h("div", { class: "flex-1" });
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row flex-wrap" },
                openButton,
                status,
                cancelButton,
                h("div", { class: "flex gap-2 ml-auto" }, duplicateButton, deleteButton)
            ),
            chartHost,
            dialog
        );

        // The controls render immediately and are enabled once the chart is ready.
        const chart = (api = await demo.mount(drawExample, chartHost, (result) => result.dispose()));
        const syncChartState = () => {
            if (!chart.isToolActive()) showSelectedTool(undefined);
            duplicateButton.disabled = !chart.sciChartSurface.annotations
                .asArray()
                .some((annotation) => annotation.isSelected);
        };
        chart.sciChartSurface.rendered.subscribe(syncChartState);
        demo.cleanup(() => chart.sciChartSurface.rendered.unsubscribe(syncChartState));
        syncChartState();
        openButton.disabled = deleteButton.disabled = false;
    });
