import { ChartInitializer } from "../ChartInitializer";
import { drawMemoryStatsGraph } from "../MetricsVisualization/MemoryStatsGraph";
import { drawPerformanceStatsGraph } from "../MetricsVisualization/PerformanceStatsGraph";

export class GraphSummaryInitializer extends ChartInitializer {
    override async outputMemoryUsageLogs() {
        const parentNode = document.getElementById("containerId");

        const rootElement = document.createElement("div") as HTMLDivElement;
        rootElement.id = "MemoryUsageGraph";
        rootElement.style.width = "100%";
        rootElement.style.height = "50%";
        parentNode.appendChild(rootElement);
        await drawMemoryStatsGraph(this.memoryUsageLogs)(rootElement);

        return super.outputMemoryUsageLogs();
    }

    public override async outputPerformanceData() {
        const parentNode = document.getElementById("containerId");

        const rootElement = document.createElement("div") as HTMLDivElement;
        rootElement.id = "PerformanceUsageGraph";
        rootElement.style.width = "100%";
        rootElement.style.height = "50%";
        parentNode.appendChild(rootElement);

        await drawPerformanceStatsGraph(
            super.outputPerformanceData(),
            this.outputBrowserAnimationFrameData()
        )(rootElement);

        return super.outputPerformanceData();
    }
}
