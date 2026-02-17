import { ChartInitializer } from "../ChartInitializer";
import { drawMemoryStatsGraph } from "../MetricsVisualization/MemoryStatsGraph";
import { drawPerformanceStatsGraph } from "../MetricsVisualization/PerformanceStatsGraph";
import { MemoryUsageLogEntry, TCollectedPerformanceData } from "../types";

export class GraphSummaryInitializer extends ChartInitializer {
    private createModal(title: string): { modal: HTMLDivElement; chartContainer: HTMLDivElement } {
        // Create modal overlay
        const modalOverlay = document.createElement("div");
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        `;

        // Create modal content
        const modalContent = document.createElement("div");
        modalContent.style.cssText = `
            background-color: var(--bg-secondary, #252526);
            border: 1px solid var(--border-color, #3e3e42);
            border-radius: 8px;
            width: 90vw;
            height: 85vh;
            max-width: 1600px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        `;

        // Create header
        const modalHeader = document.createElement("div");
        modalHeader.style.cssText = `
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color, #3e3e42);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: var(--bg-tertiary, #2d2d30);
            border-radius: 8px 8px 0 0;
        `;

        const modalTitle = document.createElement("h2");
        modalTitle.textContent = title;
        modalTitle.style.cssText = `
            margin: 0;
            font-size: 18px;
            font-weight: 500;
            color: var(--text-primary, #e0e0e0);
        `;

        const closeButton = document.createElement("button");
        closeButton.textContent = "✕";
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: var(--text-primary, #e0e0e0);
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.2s;
        `;

        closeButton.addEventListener("mouseenter", () => {
            closeButton.style.backgroundColor = "var(--danger, #f48771)";
        });

        closeButton.addEventListener("mouseleave", () => {
            closeButton.style.backgroundColor = "transparent";
        });

        closeButton.addEventListener("click", () => {
            document.body.removeChild(modalOverlay);
        });

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        // Create chart container
        const chartContainer = document.createElement("div");
        chartContainer.style.cssText = `
            flex: 1;
            padding: 20px;
            overflow: auto;
        `;

        // Assemble modal
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(chartContainer);
        modalOverlay.appendChild(modalContent);

        // Close modal on overlay click
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
            }
        });

        // Close modal on Escape key
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                document.body.removeChild(modalOverlay);
                document.removeEventListener("keydown", handleEscape);
            }
        };
        document.addEventListener("keydown", handleEscape);

        return { modal: modalOverlay, chartContainer };
    }

    override async outputMemoryUsageLogs(): Promise<MemoryUsageLogEntry[]> {
        const { modal, chartContainer } = this.createModal("Memory Usage Statistics");

        const rootElement = document.createElement("div") as HTMLDivElement;
        rootElement.id = "MemoryUsageGraph";
        rootElement.style.width = "100%";
        rootElement.style.height = "100%";
        rootElement.style.minHeight = "600px";
        chartContainer.appendChild(rootElement);

        document.body.appendChild(modal);

        await drawMemoryStatsGraph(this.memoryUsageLogs)(rootElement);

        return super.outputMemoryUsageLogs();
    }

    public override async outputPerformanceData() {
        const { modal, chartContainer } = this.createModal("Performance Statistics");

        const rootElement = document.createElement("div") as HTMLDivElement;
        rootElement.id = "PerformanceUsageGraph";
        rootElement.style.width = "100%";
        rootElement.style.height = "100%";
        rootElement.style.minHeight = "600px";
        chartContainer.appendChild(rootElement);

        document.body.appendChild(modal);

        const performanceData = super.outputPerformanceData();

        // Check if performance data is valid (not empty arrays)
        const hasValidData = performanceData && performanceData.length > 0 &&
            performanceData.some((data: TCollectedPerformanceData) =>
                data.preRenderStart?.length > 0 ||
                data.renderToWebGl?.length > 0 ||
                data.renderEnd?.length > 0 ||
                data.framePainted?.length > 0
            );

        if (hasValidData) {
            await drawPerformanceStatsGraph(
                performanceData,
                this.outputBrowserAnimationFrameData()
            )(rootElement);
        } else {
            // Show message when no valid performance data
            rootElement.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #a0a0a0;">
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">⚡</div>
                        <div style="font-size: 20px; margin-bottom: 12px; color: #e0e0e0;">No Performance Data Available</div>
                        <div style="font-size: 14px; margin-bottom: 8px;">Performance tracing is disabled or no render events were captured.</div>
                        <div style="font-size: 13px; color: #666; margin-top: 16px;">
                            Set <code style="background: #2d2d2d; padding: 4px 8px; border-radius: 4px; color: #4ec9b0;">enableRenderTracing: true</code> in your test options.
                        </div>
                    </div>
                </div>
            `;
        }

        return performanceData;
    }
}
