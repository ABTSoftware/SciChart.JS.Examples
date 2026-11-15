import { Demo, h } from "../../demoHelpers";
import { drawExample, defaultJsonDefinition, detailedJsonDefinition, centralLayoutJsonDefinition } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("flex", "flex-col", "w-full", "h-full");

        let currentChartConfig = defaultJsonDefinition;
        let isCustom = false;

        // Errors reported while building the chart from JSON
        const errorsContainer = h("div", { class: "absolute left-4 top-4" });
        const setErrors = (errors: string) => {
            errorsContainer.replaceChildren();
            if (!errors) return;
            errorsContainer.append(
                h(
                    "div",
                    {
                        class: "text-error p-2",
                        style: {
                            border: "1px solid var(--sc-error)",
                            borderRadius: "var(--radius)",
                            background: "var(--sc-background)",
                        },
                        role: "alert",
                    },
                    h("strong", { style: { display: "block", marginBottom: "0.25rem" } }, "Errors"),
                    errors
                )
            );
        };

        // Each chart definition gets a fresh host element; the previous chart is deleted.
        const createHost = () => h("div", { style: { flexBasis: "25rem", flexGrow: "1" } });
        let host = createHost();
        let deleteChart = () => {};
        demo.cleanup(() => deleteChart());
        const buildChart = (json: string) => {
            currentChartConfig = json;
            deleteChart();
            const nextHost = createHost();
            host.replaceWith(nextHost);
            host = nextHost;
            let deleted = false;
            deleteChart = () => (deleted = true);
            return drawExample(nextHost, json, setErrors).then(({ sciChartSurface }) => {
                if (deleted) sciChartSurface?.delete();
                else deleteChart = () => sciChartSurface?.delete();
            });
        };

        const presets = [
            { id: "eg1", label: "Simple example", json: defaultJsonDefinition },
            { id: "eg2", label: "Full example", json: detailedJsonDefinition },
            { id: "eg3", label: "Central Axes", json: centralLayoutJsonDefinition },
        ];
        const presetButtons = presets.map(({ id, label, json }) =>
            h(
                "button",
                {
                    type: "button",
                    class: "sc-button sc-button-outline",
                    id,
                    onclick: () => {
                        editor.value = json;
                        isCustom = false;
                        if (json !== currentChartConfig) void buildChart(json);
                        update();
                    },
                },
                label
            )
        );
        const applyButton = h(
            "button",
            {
                class: "sc-button",
                type: "button",
                onclick: () => {
                    setErrors("");
                    if (editor.value !== currentChartConfig) void buildChart(editor.value);
                    update();
                },
            },
            "Apply"
        );
        const editor = h(
            "textarea",
            {
                class: "sc-input",
                "aria-label": "Chart JSON definition",
                rows: 8,
                oninput: () => {
                    isCustom = true;
                    update();
                },
            },
            defaultJsonDefinition
        );
        const update = () => {
            presetButtons.forEach((button, index) =>
                button.setAttribute("aria-checked", String(currentChartConfig === presets[index].json && !isCustom))
            );
            applyButton.disabled = !isCustom;
        };
        update();

        root.append(
            host,
            errorsContainer,
            h(
                "div",
                { class: "flex justify-between p-2" },
                h(
                    "div",
                    { class: "sc-button-group", role: "group", "aria-label": "Chart definition presets" },
                    ...presetButtons
                ),
                applyButton
            ),
            editor
        );

        await buildChart(currentChartConfig);
    });
