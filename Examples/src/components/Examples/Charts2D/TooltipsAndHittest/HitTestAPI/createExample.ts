import { Demo, element, choices } from "../../../demoHelpers";
import { drawExample, HIT_TEST, HIT_TEST_DATAPOINT, HIT_TEST_X_SLICE } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const toolbar = element("header", root, "sc-toolbar-row");
        const { controls } = await demo.chart(drawExample);
        choices(
            toolbar,
            "Hit test mode",
            [
                { label: "Hit-Test Datapoint", value: HIT_TEST_DATAPOINT },
                { label: "Hit-Test X-Slice", value: HIT_TEST_X_SLICE },
                { label: "Hit-Test Series Body", value: HIT_TEST },
            ],
            HIT_TEST_DATAPOINT,
            controls.updateHitTestMethod
        );
    });
