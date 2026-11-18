import { Demo, h } from "../../../demoHelpers";
import { drawExample, X_RANGE_LOG, X_RANGE_LINEAR, Y_RANGE_LOG, Y_RANGE_LINEAR } from "./drawExample";
import { LogarithmicAxis3D, NumericAxis3D } from "scichart";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let chart: Awaited<ReturnType<typeof drawExample>> | undefined;

        const axisControl = (axis: "x" | "y") => {
            const label = axis.toUpperCase();
            let isLog = true;
            const logButton = h("button", { type: "button", class: "sc-button", "aria-pressed": "true" }, "Log");
            const linearButton = h("button", { type: "button", class: "sc-button", "aria-pressed": "false" }, "Linear");

            const setScale = (useLog: boolean) => {
                if (!chart || useLog === isLog) return;
                const { sciChartSurface, wasmContext } = chart;
                const axisTitle = axis === "x" ? "Frequency (Hz)" : "PSD (V²/Hz)";
                const visibleRange =
                    axis === "x" ? (useLog ? X_RANGE_LOG : X_RANGE_LINEAR) : useLog ? Y_RANGE_LOG : Y_RANGE_LINEAR;
                const replacement = useLog
                    ? new LogarithmicAxis3D(wasmContext, { axisTitle, logBase: 10, visibleRange })
                    : new NumericAxis3D(wasmContext, { axisTitle, visibleRange });
                if (axis === "x") sciChartSurface.xAxis = replacement;
                else sciChartSurface.yAxis = replacement;
                isLog = useLog;
                logButton.setAttribute("aria-pressed", String(isLog));
                linearButton.setAttribute("aria-pressed", String(!isLog));
            };
            logButton.onclick = () => setScale(true);
            linearButton.onclick = () => setScale(false);

            return h(
                "div",
                { class: "flex gap-2 items-center" },
                h("strong", {}, `${label} axis:`),
                h(
                    "div",
                    { class: "sc-button-group", role: "group", "aria-label": `${label} axis scale` },
                    logButton,
                    linearButton
                )
            );
        };

        const host = h("div", { class: "w-full h-full" });
        root.append(h("div", { class: "sc-toolbar-row" }, axisControl("x"), axisControl("y")), host);
        chart = await demo.mount(drawExample, host);
    });
