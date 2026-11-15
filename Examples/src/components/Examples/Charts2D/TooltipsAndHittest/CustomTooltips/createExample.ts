import { Demo, element, choices } from "../../../demoHelpers";
import { drawExample } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        const toolbar = element("header", root, "sc-toolbar-row");
        const { setType, callBack } = await demo.chart(drawExample);
        const readout = element("div", root, "absolute");
        Object.assign(readout.style, { left: "0.625rem", bottom: "1.875rem", zIndex: "900" });
        element("div", readout, "", "Current tooltip data:");
        const text = element("div", readout);
        let type = "cursor";
        callBack((info: any) => {
            const point = type === "cursor" ? info?.[0] : info;
            text.textContent =
                type === "verticalSlice"
                    ? String(info ?? "")
                    : point
                    ? `index: ${point.dataSeriesIndex}, xValue: ${point.xValue.toFixed(2)}, yValue${
                          type === "cursor" ? "[0]" : ""
                      }: ${point.yValue.toFixed(2)}`
                    : "";
            readout.hidden = !text.textContent;
        });
        choices(
            toolbar,
            "Tooltip mode",
            [
                { label: "Cursor", value: "cursor" },
                { label: "Rollover", value: "rollover" },
                { label: "Vertical slice", value: "verticalSlice" },
            ],
            "cursor",
            (value) => {
                type = value;
                readout.hidden = true;
                setType(value);
            }
        );
        readout.hidden = true;
    });
