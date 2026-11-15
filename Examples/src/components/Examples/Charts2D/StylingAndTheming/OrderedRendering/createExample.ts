import { PlayArrowIcon, RefreshIcon, StopIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let chart: Awaited<ReturnType<typeof drawExample>> | undefined;
        let originalOrder = true;
        let paused = false;

        const update = () => {
            const label = paused ? "Resume animation" : "Pause animation";
            pauseButton.setAttribute("aria-label", label);
            pauseButton.title = label;
            pauseButton.replaceChildren(paused ? PlayArrowIcon() : StopIcon());
            originalButton.setAttribute("aria-pressed", String(originalOrder));
            reversedButton.setAttribute("aria-pressed", String(!originalOrder));
        };
        const changeOrder = (original: boolean) => {
            chart?.changeOrder(original);
            originalOrder = original;
            update();
        };

        const pauseButton = h(
            "button",
            {
                type: "button",
                class: "sc-button sc-button-icon",
                "aria-label": "Pause animation",
                title: "Pause animation",
                disabled: true,
                onclick: () => {
                    chart?.setAnimationPaused(!paused);
                    paused = !paused;
                    update();
                },
            },
            StopIcon()
        );
        const resetButton = h(
            "button",
            {
                type: "button",
                class: "sc-button sc-button-icon",
                "aria-label": "Reset demo",
                title: "Reset demo",
                disabled: true,
                onclick: () => {
                    chart?.resetDemo();
                    originalOrder = true;
                    paused = false;
                    update();
                },
            },
            RefreshIcon()
        );
        const originalButton = h(
            "button",
            {
                type: "button",
                class: "sc-button sc-button-outline",
                "aria-pressed": "true",
                disabled: true,
                onclick: () => changeOrder(true),
            },
            "Original"
        );
        const reversedButton = h(
            "button",
            {
                type: "button",
                class: "sc-button sc-button-outline",
                "aria-pressed": "false",
                disabled: true,
                onclick: () => changeOrder(false),
            },
            "Reversed"
        );

        const host = h("div", { class: "w-full h-full" });
        root.append(
            h(
                "div",
                { class: "sc-toolbar-row" },
                h("div", { class: "flex items-center gap-2" }, pauseButton, resetButton),
                h(
                    "div",
                    { class: "flex items-center gap-2" },
                    h("span", {}, "Band order:"),
                    h(
                        "div",
                        { class: "sc-button-group", role: "group", "aria-label": "Band order" },
                        originalButton,
                        reversedButton
                    )
                )
            ),
            host
        );
        chart = await demo.mount(drawExample, host, (result) => result.setAnimationPaused(true));
        for (const control of [pauseButton, resetButton, originalButton, reversedButton]) control.disabled = false;
    });
