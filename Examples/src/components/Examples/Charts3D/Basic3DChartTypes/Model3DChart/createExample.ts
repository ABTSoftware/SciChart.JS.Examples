import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import { estimateModelProgress, formatProgressPercent } from "./modelLoadProgress";
import carImage from "./javascript-3d-model-chart.jpg";
import "./styles.css";

/** How often the estimated progress is recomputed while the model downloads. */
const PROGRESS_TICK_MS = 100;

/** Roughly the transfer size of the asset package, so the wait is explicable. */
const PACKAGE_SIZE_LABEL = "~27 MB";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const chartHost = h("div", { class: "w-full h-full" });

        // The model is downloaded after the chart itself is created, so keep this overlay on screen
        // until the model is in the scene.
        const progressFill = h("div", { class: "sc-model-progress-fill h-full", style: { width: "0%" } });
        const progressPercent = document.createTextNode(formatProgressPercent(0));
        const overlay = h(
            "div",
            { class: "absolute flex flex-col items-center justify-end sc-model-loading-overlay" },
            h("img", { src: carImage, alt: "", class: "absolute w-full h-full sc-model-preview" }),
            h(
                "div",
                { class: "relative text-center sc-model-download-panel" },
                h("div", { class: "overflow-hidden sc-model-progress-track" }, progressFill),
                h(
                    "div",
                    { class: "sc-model-progress-label" },
                    "Downloading the 3D model (",
                    PACKAGE_SIZE_LABEL,
                    ")… ",
                    progressPercent
                )
            )
        );
        root.append(chartHost, overlay);

        // Estimated, not measured - see modelLoadProgress.ts for why the real byte count is not available.
        const startedAt = Date.now();
        const intervalId = setInterval(() => {
            const progress = estimateModelProgress(Date.now() - startedAt);
            progressFill.style.width = `${Math.min(progress, 1) * 100}%`;
            progressPercent.data = formatProgressPercent(progress);
        }, PROGRESS_TICK_MS);
        demo.cleanup(() => clearInterval(intervalId));

        const { waitForModel } = await demo.mount(drawExample, chartHost);
        // waitForModel polls the entity and hands back a disposer, so the poll cannot outlive the chart.
        demo.cleanup(
            waitForModel(() => {
                clearInterval(intervalId);
                overlay.remove();
            })
        );
    });
