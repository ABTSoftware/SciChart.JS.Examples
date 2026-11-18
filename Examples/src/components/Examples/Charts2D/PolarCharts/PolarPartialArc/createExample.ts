import { PlayArrowIcon, StopIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: Awaited<ReturnType<typeof drawExample>>["controls"] | undefined;
        let isAnimating = false;
        const initialInnerRadius = 0.9977;
        const initialTotalAngle = 0.004;

        const toggleButton = h(
            "button",
            {
                type: "button",
                class: "sc-button sc-button-icon",
                "aria-label": "Start animation",
                title: "Start animation",
                disabled: true,
                onclick: () => {
                    if (isAnimating) controls?.endAnimation();
                    else controls?.startAnimation();
                    isAnimating = !isAnimating;
                    const label = isAnimating ? "Stop animation" : "Start animation";
                    toggleButton.setAttribute("aria-label", label);
                    toggleButton.title = label;
                    toggleButton.replaceChildren(isAnimating ? StopIcon() : PlayArrowIcon());
                },
            },
            PlayArrowIcon()
        );

        const innerRadiusText = h("strong", {});
        const innerRadiusInput = h("input", {
            type: "range",
            min: "0.001",
            max: "0.999",
            step: "0.001",
            value: String(initialInnerRadius),
            class: "sc-range -mt-1",
            oninput: () => {
                const value = parseFloat(innerRadiusInput.value);
                showInnerRadius(value);
                controls?.changeInnerRadiusInternal(value);
            },
        });
        const showInnerRadius = (value: number) => (innerRadiusText.textContent = value.toFixed(3));

        const totalAnglePiText = h("strong", {});
        const totalAngleText = h("strong", {});
        const totalAngleInput = h("input", {
            type: "range",
            min: "0",
            max: String(Math.PI * 2),
            step: "0.001",
            value: String(initialTotalAngle),
            class: "sc-range -mt-1",
            oninput: () => {
                const value = parseFloat(totalAngleInput.value);
                showTotalAngle(value);
                controls?.changeTotalAngleInternal(value);
            },
        });
        const showTotalAngle = (value: number) => {
            totalAnglePiText.replaceChildren((value / Math.PI).toFixed(3), " * π");
            totalAngleText.textContent = value.toFixed(3);
        };
        showInnerRadius(initialInnerRadius);
        showTotalAngle(initialTotalAngle);

        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                toggleButton,
                h(
                    "label",
                    { class: "sc-control flex-col flex-1 gap-0" },
                    h("span", {}, "Inner Radius: ", innerRadiusText),
                    innerRadiusInput
                ),
                h(
                    "label",
                    { class: "sc-control flex-col flex-1 gap-0" },
                    h("span", {}, "Total Angle: ", totalAnglePiText, " or ", totalAngleText),
                    totalAngleInput
                )
            )
        );

        const result = await demo.chart(
            (host) =>
                drawExample(host, initialInnerRadius, initialTotalAngle, (values) => {
                    // Keep the sliders and labels in step with the running animation
                    innerRadiusInput.value = String(values.innerRadius);
                    totalAngleInput.value = String(values.totalAngle);
                    showInnerRadius(values.innerRadius);
                    showTotalAngle(values.totalAngle);
                }),
            root,
            "w-full h-full",
            (chart) => chart.controls.endAnimation()
        );
        controls = result.controls;
        toggleButton.disabled = false;
    });
