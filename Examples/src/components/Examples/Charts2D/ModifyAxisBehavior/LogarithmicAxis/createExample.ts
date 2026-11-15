import { Demo, element, choices } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import { AxisBase2D } from "scichart";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const toolbar = element("header", root, "sc-toolbar-row");
        const {
            sciChartSurface: surface,
            xAxisLogarithmic: logX,
            yAxisLogarithmic: logY,
            xAxisLinear: linearX,
            yAxisLinear: linearY,
        } = await demo.chart(drawExample);
        const labels = ["Logarithmic X & Y Axis", "Log X Axis, Linear Y Axis", "Linear X & Y Axis"];
        choices(
            toolbar,
            "Axis scale",
            labels.map((label, value) => ({ label, value })),
            0,
            (value) => {
                const axes: [AxisBase2D, boolean][] = [
                    [logX, value !== 2],
                    [logY, value === 0],
                    [linearX, value === 2],
                    [linearY, value !== 0],
                ];
                axes.forEach(([axis, enabled]) => {
                    axis.isVisible = enabled;
                    axis.isPrimaryAxis = enabled;
                });
                surface.title = labels[value];
                surface.renderableSeries.asArray().forEach((series) => {
                    series.xAxisId = logX.isVisible ? logX.id : linearX.id;
                    series.yAxisId = logY.isVisible ? logY.id : linearY.id;
                });
                surface.zoomExtents();
            }
        );
    });
