import { Demo } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import CustomImage from "./scichart-logo-white.png";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        await demo.chart(drawExample(CustomImage));
    });
