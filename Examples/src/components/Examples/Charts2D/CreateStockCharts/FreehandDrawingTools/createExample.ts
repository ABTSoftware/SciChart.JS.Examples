import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

const DEFAULT_DRAWING_COLOR = "#686c70";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let api: Awaited<ReturnType<typeof drawExample>> | undefined;
        let isDrawing = true;
        let color = DEFAULT_DRAWING_COLOR;
        let thickness = 4;
        let opacity = 100;

        const setDrawingMode = (enabled: boolean) => {
            if (enabled) api?.startDrawing(color, thickness, opacity / 100);
            else api?.stopDrawing();
            isDrawing = enabled;
            panButton.setAttribute("aria-pressed", String(!isDrawing));
            drawButton.setAttribute("aria-pressed", String(isDrawing));
            styleControls.style.opacity = isDrawing ? "1" : "0.5";
            colorInput.disabled = thicknessInput.disabled = opacityInput.disabled = !isDrawing;
        };
        const updateDrawingStyle = (nextColor: string, nextThickness: number, nextOpacity: number) => {
            if (!Number.isFinite(nextThickness) || nextThickness < 1 || nextThickness > 20) return;
            if (!Number.isFinite(nextOpacity) || nextOpacity < 0 || nextOpacity > 100) return;
            color = nextColor;
            thickness = nextThickness;
            opacity = nextOpacity;
            if (isDrawing) api?.startDrawing(color, thickness, opacity / 100);
        };

        const panButton = h(
            "button",
            { class: "sc-button", "aria-pressed": "false", type: "button", onclick: () => setDrawingMode(false) },
            "Pan"
        );
        const drawButton = h(
            "button",
            { class: "sc-button", "aria-pressed": "true", type: "button", onclick: () => setDrawingMode(true) },
            "Draw"
        );
        const colorInput = h("input", {
            class: "sc-input",
            type: "color",
            value: color,
            title: "Drawing color",
            oninput: () => updateDrawingStyle(colorInput.value, thickness, opacity),
        });
        const thicknessInput = h("input", {
            class: "sc-input",
            type: "number",
            min: "1",
            max: "20",
            step: "1",
            value: String(thickness),
            style: { width: "3.125rem" },
            title: "Stroke thickness in pixels",
            oninput: () => updateDrawingStyle(color, thicknessInput.valueAsNumber, opacity),
        });
        const opacityInput = h("input", {
            class: "sc-input",
            type: "number",
            min: "0",
            max: "100",
            step: "5",
            value: String(opacity),
            style: { width: "3.625rem" },
            oninput: () => updateDrawingStyle(color, thickness, opacityInput.valueAsNumber),
        });
        const styleControls = h(
            "div",
            { class: "flex items-center gap-2", style: { opacity: "1" } },
            h("label", { class: "sc-control" }, "Color", colorInput),
            h("label", { class: "sc-control" }, "Thickness", thicknessInput),
            h("label", { class: "sc-control" }, "Opacity (%)", opacityInput)
        );
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                h(
                    "div",
                    { class: "sc-button-group", role: "group", "aria-label": "Chart interaction mode" },
                    panButton,
                    drawButton
                ),
                styleControls
            )
        );

        // Backspace removes the last drawing, unless the user is typing in a field
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Backspace") return;
            const target = event.target as HTMLElement | null;
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable))
                return;
            api?.removeLast();
        };
        document.addEventListener("keydown", handleKeyDown);
        demo.cleanup(() => document.removeEventListener("keydown", handleKeyDown));

        api = await demo.chart(drawExample, root, "w-full h-full", (result) => result.stopDrawing());
        if (isDrawing) api.startDrawing(color, thickness, opacity / 100);
    });
