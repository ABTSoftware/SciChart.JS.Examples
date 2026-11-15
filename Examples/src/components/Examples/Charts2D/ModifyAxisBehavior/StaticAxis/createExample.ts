import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: { toggleStaticAxis: () => void } | undefined;
        let isStaticAxis = false;

        const setIsStaticAxis = (value: boolean) => {
            if (!controls) return;
            if (value !== isStaticAxis) controls.toggleStaticAxis();
            isStaticAxis = value;
            normalButton.setAttribute("aria-pressed", String(isStaticAxis));
            staticButton.setAttribute("aria-pressed", String(!isStaticAxis));
        };
        const normalButton = h(
            "button",
            { type: "button", class: "sc-button", "aria-pressed": "false", onclick: () => setIsStaticAxis(true) },
            "Normal Primary X Axis"
        );
        const staticButton = h(
            "button",
            { type: "button", class: "sc-button", "aria-pressed": "true", onclick: () => setIsStaticAxis(false) },
            "Static Primary X Axis"
        );

        const chartHost = h("div");
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h(
                    "div",
                    { class: "sc-button-group", role: "group", "aria-label": "Primary X Axis mode" },
                    normalButton,
                    staticButton
                )
            ),
            chartHost
        );

        controls = (await demo.mount(drawExample, chartHost)).controls;
    });
