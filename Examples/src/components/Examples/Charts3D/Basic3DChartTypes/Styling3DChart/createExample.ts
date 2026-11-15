import { ExpandMoreIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { drawExample, TAxis, TSelectedAxisPlane } from "./drawExample";
import { EAxisPlaneDrawLabelsMode, E3DLabelOrientationMode } from "scichart";
import { appTheme } from "../../../theme";

type AxisDemoConfig = {
    fontSize: number;
    titleOffset: number;
    tickLabelsOffset: number;
    labelOrientation: E3DLabelOrientationMode;
    majorGridLines: boolean;
    minorGridLines: boolean;
    bandsFill: string;
    majorGridColor: string;
    minorGridColor: string;
};

const defaultAxisConfig: AxisDemoConfig = {
    fontSize: 20,
    titleOffset: 10,
    tickLabelsOffset: 10,
    labelOrientation: E3DLabelOrientationMode.Auto,
    majorGridLines: false,
    minorGridLines: false,
    bandsFill: appTheme.DarkIndigo + "44",
    majorGridColor: "#5588AA",
    minorGridColor: "#225588",
};

// <input type="color"> only accepts #rrggbb
const formatHexForInput = (color: string) => (!color || !color.startsWith("#") ? "#000000" : color.substring(0, 7));

const options = (items: readonly (readonly [value: string, label: string])[]) =>
    items.map(([value, label]) => h("option", { value }, label));

/** `<label><span>Label</span>control</label>` row used by every setting in the side panel. */
const row = (props: { class: string }, label: (Node | string)[], control: HTMLElement) =>
    h("label", props, h("span", { class: "flex-none" }, ...label), control);

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("sc-responsive-chart-wrapper");

        let controls: Awaited<ReturnType<typeof drawExample>>["controls"] | undefined;
        let selectedAxis: TAxis = "x";
        let selectedPlane: TSelectedAxisPlane = "none";
        const axisSettings: Record<TAxis, AxisDemoConfig> = {
            x: { ...defaultAxisConfig },
            y: { ...defaultAxisConfig },
            z: { ...defaultAxisConfig },
        };
        const current = () => axisSettings[selectedAxis];

        // Axis section
        const axisSelect = h(
            "select",
            {
                "aria-label": "Select Axis",
                class: "sc-select flex-1 min-w-0",
                value: selectedAxis,
                onchange: () => {
                    selectedAxis = axisSelect.value as TAxis;
                    controls?.updateAxisTitleColor(selectedAxis);
                    showAxisSettings();
                },
            },
            ...options([
                ["x", "X Axis"],
                ["y", "Y Axis"],
                ["z", "Z Axis"],
            ])
        );
        const orientationSelect = h(
            "select",
            {
                class: "sc-select flex-1 min-w-0",
                "aria-label": "Label Orientation Mode",
                onchange: () => {
                    const mode = orientationSelect.value as E3DLabelOrientationMode;
                    current().labelOrientation = mode;
                    controls?.setLabelOrientationMode(mode, selectedAxis);
                },
            },
            ...options([
                [E3DLabelOrientationMode.Auto, "Auto"],
                [E3DLabelOrientationMode.Horizontal, "Horizontal"],
            ])
        );
        const slider = (label: string, min: number, max: number, change: (value: number) => void) => {
            const valueText = document.createTextNode("");
            const input = h("input", {
                type: "range",
                class: "sc-range flex-1 min-w-0",
                step: 1,
                min,
                max,
                "aria-label": label,
                oninput: () => {
                    valueText.data = input.value;
                    change(input.valueAsNumber);
                },
            });
            return {
                input,
                valueText,
                row: row({ class: "sc-control justify-between" }, [`${label}: `, valueText], input),
            };
        };
        const fontSize = slider("Axis Font Size", 10, 30, (value) => {
            current().fontSize = value;
            controls?.setAxisLabelFontSize(value, selectedAxis);
        });
        const titleOffset = slider("Axis Title Offset", 0, 100, (value) => {
            current().titleOffset = value;
            controls?.setTitleOffset(value, selectedAxis);
        });
        const tickLabelsOffset = slider("Tick Labels Offset", 0, 100, (value) => {
            current().tickLabelsOffset = value;
            controls?.setTickLabelsOffset(value, selectedAxis);
        });
        const majorGrid = h("input", {
            type: "checkbox",
            onchange: () => {
                current().majorGridLines = majorGrid.checked;
                controls?.enableMajorGridLines(majorGrid.checked, selectedAxis);
            },
        });
        const minorGrid = h("input", {
            type: "checkbox",
            onchange: () => {
                current().minorGridLines = minorGrid.checked;
                controls?.enableMinorGridLines(minorGrid.checked, selectedAxis);
            },
        });
        const colorInput = (label: string, change: (color: string) => void) => {
            const input = h("input", {
                type: "color",
                "aria-label": label,
                class: "sc-input",
                oninput: () => change(input.value),
            });
            return input;
        };
        const bandsFill = colorInput("Axis Bands Color", (color) => {
            current().bandsFill = color;
            controls?.setAxisBandsFill(color, selectedAxis);
        });
        const majorGridColor = colorInput("Major Grid Color", (color) => {
            current().majorGridColor = color;
            controls?.setMajorGridLineColor(color, selectedAxis);
        });
        const minorGridColor = colorInput("Minor Grid Color", (color) => {
            current().minorGridColor = color;
            controls?.setMinorGridLineColor(color, selectedAxis);
        });

        /** Show the settings stored for the selected axis. */
        const showAxisSettings = () => {
            const config = current();
            orientationSelect.value = config.labelOrientation;
            for (const [control, value] of [
                [fontSize, config.fontSize],
                [titleOffset, config.titleOffset],
                [tickLabelsOffset, config.tickLabelsOffset],
            ] as const) {
                control.input.value = control.valueText.data = String(value);
            }
            majorGrid.checked = config.majorGridLines;
            minorGrid.checked = config.minorGridLines;
            bandsFill.value = formatHexForInput(config.bandsFill);
            majorGridColor.value = formatHexForInput(config.majorGridColor);
            minorGridColor.value = formatHexForInput(config.minorGridColor);
        };
        showAxisSettings();

        // Plane section
        const planeSelect = h(
            "select",
            {
                "aria-label": "Select Plane",
                class: "sc-select flex-1 min-w-0",
                value: selectedPlane,
                onchange: () => {
                    selectedPlane = planeSelect.value as TSelectedAxisPlane;
                    controls?.setPlaneBackground(selectedPlane);
                    planeControls.forEach((node) => (node.disabled = selectedPlane === "none"));
                },
            },
            ...options([
                ["none", "None"],
                ["xy", "XY Plane"],
                ["zy", "ZY Plane"],
                ["zx", "ZX Plane"],
            ])
        );
        const planeOption = (
            label: string,
            value: string,
            items: readonly (readonly [string, string])[],
            change: (value: string) => void
        ) => {
            const node = h(
                "select",
                {
                    "aria-label": label,
                    disabled: true,
                    class: "sc-select flex-1 min-w-0",
                    value,
                    onchange: () => change(node.value),
                },
                ...options(items)
            );
            return node;
        };
        const drawModes = [
            [EAxisPlaneDrawLabelsMode.Both, "Both"],
            [EAxisPlaneDrawLabelsMode.Hidden, "Hidden"],
            [EAxisPlaneDrawLabelsMode.LocalX, "LocalX"],
            [EAxisPlaneDrawLabelsMode.LocalY, "LocalY"],
        ] as const;
        const visibilityMode = planeOption(
            "Visibility Mode",
            "auto",
            [
                ["auto", "Auto"],
                ["negativeSide", "Negative Side"],
                ["positiveSide", "Positive Side"],
            ],
            (value) => controls?.setVisibilityMode(selectedPlane, value)
        );
        const drawTitlesMode = planeOption("Draw Titles Mode", EAxisPlaneDrawLabelsMode.Both, drawModes, (value) =>
            controls?.setDrawTitlesMode(selectedPlane, value as EAxisPlaneDrawLabelsMode)
        );
        const drawLabelsMode = planeOption("Draw Labels Mode", EAxisPlaneDrawLabelsMode.Both, drawModes, (value) =>
            controls?.setDrawLabelsMode(selectedPlane, value as EAxisPlaneDrawLabelsMode)
        );
        const planeIsVisible = planeOption(
            "Is Visible",
            "true",
            [
                ["true", "True"],
                ["false", "False"],
            ],
            (value) => controls?.setIsPlaneVisible(selectedPlane, value)
        );
        const planeControls = [visibilityMode, drawTitlesMode, drawLabelsMode, planeIsVisible];

        // Only one accordion panel is expanded at a time
        const axisPanel = h(
            "details",
            {
                class: "sc-accordion",
                open: true,
                ontoggle: () => {
                    if (axisPanel.open) planePanel.open = false;
                },
            },
            h(
                "summary",
                { class: "sc-accordion-summary" },
                h("span", {}, "Axis Configuration"),
                ExpandMoreIcon("sc-accordion-chevron")
            ),
            h(
                "div",
                { class: "sc-accordion-details flex flex-col gap-2" },
                row({ class: "sc-control justify-between" }, ["Select Axis"], axisSelect),
                row({ class: "sc-control justify-between" }, ["Orientation"], orientationSelect),
                fontSize.row,
                titleOffset.row,
                tickLabelsOffset.row,
                row({ class: "sc-switch justify-between" }, ["Major Grid"], majorGrid),
                row({ class: "sc-switch justify-between" }, ["Minor Grid"], minorGrid),
                row({ class: "sc-control justify-between" }, ["Axis Bands Color"], bandsFill),
                row({ class: "sc-control justify-between" }, ["Major Grid Color"], majorGridColor),
                row({ class: "sc-control justify-between" }, ["Minor Grid Color"], minorGridColor)
            )
        );
        const planePanel: HTMLDetailsElement = h(
            "details",
            {
                class: "sc-accordion",
                ontoggle: () => {
                    if (planePanel.open) axisPanel.open = false;
                },
            },
            h(
                "summary",
                { class: "sc-accordion-summary" },
                h("span", {}, "Plane Configuration"),
                ExpandMoreIcon("sc-accordion-chevron")
            ),
            h(
                "div",
                { class: "sc-accordion-details flex flex-col gap-2" },
                row({ class: "sc-control justify-between" }, ["Select Plane"], planeSelect),
                row({ class: "sc-control justify-between" }, ["Visibility"], visibilityMode),
                row({ class: "sc-control justify-between" }, ["Draw Titles Mode"], drawTitlesMode),
                row({ class: "sc-control justify-between" }, ["Draw Labels Mode"], drawLabelsMode),
                row({ class: "sc-control justify-between" }, ["Is Visible"], planeIsVisible)
            )
        );

        const chartHost = h("div");
        root.append(chartHost, h("aside", { class: "sc-responsive-controls" }, axisPanel, planePanel));

        ({ controls } = await demo.mount(drawExample, chartHost));
    });
