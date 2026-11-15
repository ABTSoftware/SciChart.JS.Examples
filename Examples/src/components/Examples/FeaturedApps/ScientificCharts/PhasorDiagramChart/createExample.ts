import { PlayArrowIcon, StopIcon, iconButton, setButtonIcon } from "../../../icons/native";
import { Demo, element } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const { controls } = await demo.chart(drawExample, demo.root, "w-full h-full", (result) =>
            result.controls.stopAnimation()
        );
        const toolbar = element("header", root, "absolute top-2 left-2");
        let running = true;
        const toggle = iconButton(toolbar, "Stop rotation", StopIcon, () => {
            if (running) controls.stopAnimation();
            else controls.startAnimation();
            running = !running;
            update();
        });
        const update = () => {
            setButtonIcon(toggle, running ? StopIcon : PlayArrowIcon, running ? "Stop rotation" : "Start rotation");
            toggle.setAttribute("aria-pressed", String(running));
        };
        update();
    });
