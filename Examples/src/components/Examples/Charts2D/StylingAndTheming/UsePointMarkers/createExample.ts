import { Demo } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import customPointImage from "./img/CustomMarkerImage.png";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        await demo.chart(drawExample(customPointImage));
    });
