import { Demo } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import SciChartImage from "./scichart-logo-white.png";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        await demo.chart(drawExample(SciChartImage));
    });
