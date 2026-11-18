import { Demo, element } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import "./styles.css";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("htmlAnnotationExampleChart");
        const { containerAnnotation } = await demo.chart(drawExample);
        const annotation = element(
            "div",
            containerAnnotation.htmlElement,
            "",
            "This annotation is rendered using the DOM."
        );
        Object.assign(annotation.style, {
            fontSize: "0.875rem",
            background: "linear-gradient(135deg, #ff6a00, #ee0979)",
            textWrap: "nowrap",
        });
        demo.cleanup(() => annotation.remove());
    });
