import { Demo } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const { controls } = await demo.chart(drawExample, demo.root, "w-full h-full", (result) =>
            result.controls.stopUpdate()
        );
        controls.startUpdate();
    });
