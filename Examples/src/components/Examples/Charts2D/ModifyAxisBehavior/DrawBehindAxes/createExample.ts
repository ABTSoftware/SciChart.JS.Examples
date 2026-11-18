import { Demo, element, choices } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const toolbar = element("header", root, "sc-toolbar-row");
        const { sciChartSurface: surface } = await demo.chart(drawExample);
        choices(
            toolbar,
            "Series rendering mode",
            [
                { label: "Draw Series behind Axis", value: 0 },
                { label: "Clip series at Viewport Edge", value: 1 },
            ],
            0,
            (value) => {
                surface.drawSeriesBehindAxis = value === 0;
                surface.title =
                    value === 0
                        ? "SciChartSurface with Series Drawn Behind Axis"
                        : "SciChartSurface with Series clipped to Viewport";
                surface.yAxes.get(0).axisBorder.borderLeft = value;
                surface.xAxes.get(0).axisBorder.borderTop = value;
            }
        );
    });
