import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import { appTheme } from "../../../theme";
import "./styles.css";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("flex");

        // Live values, updated on every data tick
        const infoEcg = document.createTextNode("0");
        const infoBloodPressure1 = document.createTextNode("0");
        const infoBloodPressure2 = document.createTextNode("0");
        const infoBloodVolume = document.createTextNode("0.0");
        const infoBloodOxygenation = document.createTextNode("0");

        const chartHost = h("div", { class: "w-full" });
        root.append(
            chartHost,
            h(
                "div",
                { class: "sc-vitals-cards flex flex-col" },
                h(
                    "div",
                    { class: "sc-vitals-card flex flex-1 flex-col p-2", style: { color: appTheme.VividOrange } },
                    h(
                        "div",
                        { class: "flex flex-1" },
                        h("div", { class: "sc-vitals-title flex-1" }, "ECG"),
                        h("div", { class: "sc-vitals-value ml-auto" }, infoEcg)
                    ),
                    h(
                        "div",
                        { class: "flex items-end" },
                        h(
                            "div",
                            { class: "sc-vitals-details" },
                            h("div", {}, "V1 - 1.4MM", h("br"), "ST | +0.6 || +0.9")
                        )
                    )
                ),
                h(
                    "div",
                    { class: "sc-vitals-card flex flex-1 flex-col p-2", style: { color: appTheme.VividSkyBlue } },
                    h(
                        "div",
                        { class: "flex flex-1" },
                        h("div", { class: "sc-vitals-title flex-1" }, "NIBP"),
                        h("div", { class: "sc-vitals-meta" }, "AUTO", h("br"), "145/95")
                    ),
                    h(
                        "div",
                        { class: "flex items-end" },
                        h(
                            "div",
                            { class: "sc-vitals-value ml-auto" },
                            h("div", {}, infoBloodPressure1, "/", infoBloodPressure2)
                        )
                    )
                ),
                h(
                    "div",
                    { class: "sc-vitals-card flex flex-1 flex-col p-2", style: { color: appTheme.VividPink } },
                    h(
                        "div",
                        { class: "flex flex-1" },
                        h("div", { class: "sc-vitals-title flex-1" }, "SV"),
                        h("div", { class: "sc-vitals-meta" }, "ML 100", h("br"), "%**** 55")
                    ),
                    h(
                        "div",
                        { class: "flex items-end" },
                        h("div", { class: "sc-vitals-value ml-auto" }, h("div", {}, infoBloodVolume))
                    )
                ),
                h(
                    "div",
                    { class: "sc-vitals-card flex flex-1 flex-col p-2", style: { color: appTheme.VividTeal } },
                    h(
                        "div",
                        { class: "flex flex-1" },
                        h("div", { class: "sc-vitals-title flex-1" }, "SPO", h("span", {}, "2")),
                        h("div", { class: "sc-vitals-meta" }, "18:06")
                    ),
                    h(
                        "div",
                        { class: "flex items-end" },
                        h("div", { class: "sc-vitals-details" }, h("div", {}, "71-", h("br"), "RESP")),
                        h("div", { class: "sc-vitals-value ml-auto" }, infoBloodOxygenation)
                    )
                )
            )
        );

        const { subscribeToDataUpdates, controls } = await demo.mount(drawExample, chartHost, (result) =>
            result.controls.stopUpdate()
        );
        subscribeToDataUpdates((info) => {
            infoEcg.data = String(info.ecg);
            infoBloodPressure1.data = String(info.bloodPressure1);
            infoBloodPressure2.data = String(info.bloodPressure2);
            infoBloodVolume.data = info.bloodVolume.toFixed(1);
            infoBloodOxygenation.data = String(info.bloodOxygenation);
        });
        controls.startUpdate();
    });
