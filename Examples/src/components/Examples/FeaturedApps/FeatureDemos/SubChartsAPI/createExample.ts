import { CloseIcon, PlayArrowIcon, SettingsIcon, StopIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { drawGridExample, TMessage } from "./drawExample";

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        let controls: Awaited<ReturnType<typeof drawGridExample>>["controls"] | undefined;
        let isStarted = false;

        const toggleButton = h(
            "button",
            {
                class: "sc-button sc-button-icon",
                "aria-label": "Start updates",
                title: "Start updates",
                type: "button",
                onclick: () => {
                    if (!controls) return;
                    if (isStarted) controls.stopUpdate();
                    else controls.startUpdate();
                    isStarted = !isStarted;
                    const label = isStarted ? "Pause updates" : "Start updates";
                    toggleButton.setAttribute("aria-label", label);
                    toggleButton.title = label;
                    toggleButton.replaceChildren(isStarted ? StopIcon() : PlayArrowIcon());
                },
            },
            PlayArrowIcon()
        );

        // Configuration dialog: added to the document body while it is open.
        let backdrop: HTMLDivElement | undefined;
        const closeDialog = () => {
            backdrop?.remove();
            backdrop = undefined;
        };
        const openDialog = () => {
            if (backdrop) return;
            const closeButton = h(
                "button",
                {
                    class: "sc-button sc-button-icon",
                    "aria-label": "Close chart configurations",
                    type: "button",
                    onclick: closeDialog,
                },
                CloseIcon()
            );
            backdrop = h(
                "div",
                {
                    class: "sc-modal-backdrop",
                    onclick: (event: MouseEvent) => event.target === event.currentTarget && closeDialog(),
                    onkeydown: (event: KeyboardEvent) => event.key === "Escape" && closeDialog(),
                },
                h(
                    "section",
                    {
                        class: "sc-modal",
                        role: "dialog",
                        "aria-modal": "true",
                        "aria-labelledby": "subcharts-config-title",
                    },
                    h(
                        "header",
                        { class: "sc-modal-header" },
                        h("strong", { id: "subcharts-config-title" }, "Chart Configurations"),
                        closeButton
                    ),
                    h(
                        "div",
                        { class: "sc-modal-body" },
                        h(
                            "label",
                            { class: "sc-switch" },
                            h("input", {
                                type: "checkbox",
                                onchange: (event: Event) =>
                                    controls?.setLabels((event.currentTarget as HTMLInputElement).checked),
                            }),
                            "Axis Labels"
                        )
                    )
                )
            );
            document.body.append(backdrop);
            closeButton.focus();
        };
        demo.cleanup(closeDialog);

        const messages = h("div", { class: "flex gap-2 mr-2", style: { flex: "1 1 20%" } });
        const showMessages = (newMessages: TMessage[]) =>
            messages.replaceChildren(
                ...newMessages.map((msg) =>
                    h(
                        "div",
                        {
                            class: "flex-none text-end p-1",
                            style: { width: "16%", fontSize: "0.875rem", textWrap: "nowrap" },
                        },
                        h("div", {}, msg.title),
                        h("div", {}, msg.detail)
                    )
                )
            );

        const chartHost = h("div");
        root.append(
            h(
                "header",
                { class: "sc-toolbar-row" },
                toggleButton,
                h(
                    "button",
                    {
                        class: "sc-button sc-button-icon",
                        "aria-label": "Chart configurations",
                        title: "Chart Configurations",
                        type: "button",
                        onclick: openDialog,
                    },
                    SettingsIcon()
                ),
                messages
            ),
            chartHost
        );

        const chart = await demo.mount(
            (host) => drawGridExample(host, showMessages),
            chartHost,
            (result) => result.controls.stopUpdate()
        );
        controls = chart.controls;
    });
