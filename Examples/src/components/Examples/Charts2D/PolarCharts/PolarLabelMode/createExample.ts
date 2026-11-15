import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import { EPolarLabelMode } from "scichart";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: Awaited<ReturnType<typeof drawExample>>["controls"] | undefined;

        const modes = Object.keys(EPolarLabelMode) as EPolarLabelMode[];
        const modeButtons = modes.map((mode) =>
            h(
                "button",
                {
                    type: "button",
                    class: "sc-button",
                    "aria-pressed": String(mode === EPolarLabelMode.Horizontal),
                    onclick: () => {
                        modeButtons.forEach((button, index) =>
                            button.setAttribute("aria-pressed", String(modes[index] === mode))
                        );
                        controls?.changePolarLabelMode(mode);
                    },
                },
                mode
            )
        );
        const innerAxisSwitch = h("input", {
            type: "checkbox",
            role: "switch",
            onchange: () => controls?.toggleIsInnerAxis(innerAxisSwitch.checked),
        });

        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h("div", { class: "sc-button-group", role: "group", "aria-label": "Polar label mode" }, ...modeButtons),
                h("label", { class: "sc-switch" }, innerAxisSwitch, "Inner axis")
            )
        );
        ({ controls } = await demo.chart(drawExample));
    });
