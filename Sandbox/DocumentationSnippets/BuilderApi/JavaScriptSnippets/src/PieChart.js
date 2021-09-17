import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESciChartSurfaceType } from "scichart/types/SciChartSurfaceType";

export async function drawSimplePieChartUsingBuilderApi(divElementId) {
    return chartBuilder.buildPieChart(divElementId, {
        segments: [
            { text: "This", value: 10, color: "red" },
            { text: "That", value: 5, color: "blue" },
            { text: "Other", value: 7, color: "green" }
        ]
    });
}

export async function drawSimplePieChartUsingGenericBuilderApi(divElementId) {
    return chartBuilder.buildChart(divElementId, {
        type: ESciChartSurfaceType.Pie2D,
        options: {
            segments: [
                { text: "This", value: 10, color: "red" },
                { text: "That", value: 5, color: "blue" },
                { text: "Other", value: 7, color: "green" }
            ]
        }
    });
}
