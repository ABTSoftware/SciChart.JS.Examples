import { DeleteSweepIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

const POINT_OPTIONS = [3, 5, 7, 9];

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: Awaited<ReturnType<typeof drawExample>> | undefined;
        let pointCount = 0;

        const setPointCount = (count: number) => {
            pointCount = count;
            pointButtons.forEach((button, index) =>
                button.setAttribute("aria-pressed", String(POINT_OPTIONS[index] === pointCount))
            );
        };
        const pointButtons = POINT_OPTIONS.map((count) =>
            h(
                "button",
                {
                    type: "button",
                    class: "sc-button",
                    "aria-pressed": "false",
                    "aria-label": `${count} points`,
                    onclick: () => {
                        setPointCount(count);
                        controls?.startPlacement(count);
                    },
                },
                count
            )
        );

        // Clear the selected point count once the polyline has been placed.
        const clearFinishedPlacement = () => {
            if (pointCount !== 0 && !controls?.isPlacing()) setPointCount(0);
        };
        root.addEventListener("click", clearFinishedPlacement);
        demo.cleanup(() => root.removeEventListener("click", clearFinishedPlacement));

        const chartHost = h("div");
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h(
                    "label",
                    { class: "sc-switch" },
                    h("input", { type: "checkbox", checked: true, onchange: () => controls?.togglePairConnectors() }),
                    h("span", {}, "Show connectors")
                ),
                h(
                    "div",
                    { class: "flex gap-2 items-center" },
                    h("span", {}, " Place polyline with N points:"),
                    h(
                        "div",
                        { class: "sc-button-group", role: "group", "aria-label": "Polyline point count" },
                        ...pointButtons
                    )
                ),
                h(
                    "button",
                    {
                        class: "sc-button sc-button-icon sc-button-danger",
                        title: "Delete all annotations",
                        "aria-label": "Delete all annotations",
                        type: "button",
                        onclick: () => controls?.deleteAllAnnotations(),
                    },
                    DeleteSweepIcon()
                )
            ),
            chartHost
        );

        controls = await demo.mount(drawExample, chartHost);
    });
