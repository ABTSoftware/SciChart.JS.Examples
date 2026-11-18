import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: Awaited<ReturnType<typeof drawExample>>["controls"] | undefined;

        const setHundredPercentMode = (value: boolean) => {
            stackedButton.setAttribute("aria-pressed", String(!value));
            percentButton.setAttribute("aria-pressed", String(value));
            controls?.toggleHundredPercentMode(value);
        };
        const stackedButton = h(
            "button",
            { type: "button", class: "sc-button", "aria-pressed": "true", onclick: () => setHundredPercentMode(false) },
            "Stacked mode"
        );
        const percentButton = h(
            "button",
            { type: "button", class: "sc-button", "aria-pressed": "false", onclick: () => setHundredPercentMode(true) },
            "100% Stacked mode"
        );

        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h(
                    "div",
                    { class: "sc-button-group", role: "group", "aria-label": "Stacked chart mode" },
                    stackedButton,
                    percentButton
                )
            )
        );
        ({ controls } = await demo.chart(drawExample));
    });
