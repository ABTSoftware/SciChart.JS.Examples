import { Demo } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import BackgroundImage from "./BackgroundGradient.jpg";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.style.backgroundSize = "100% 100%";
        root.style.backgroundImage = `url(${BackgroundImage})`;
        await demo.chart(drawExample);
    });
