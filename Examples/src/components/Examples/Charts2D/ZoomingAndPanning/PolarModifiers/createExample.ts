import { Demo, h } from "../../../demoHelpers";
import { drawExample, POLAR_MODIFIER_INFO } from "./drawExample";
import { EChart2DModifierType } from "scichart";

const ALL_POLAR_MODIFIER_TYPES = Object.keys(POLAR_MODIFIER_INFO);

const CONFLICTING_MODIFIER_TYPES = [
    [EChart2DModifierType.PolarPan, EChart2DModifierType.PolarArcZoom],
    [EChart2DModifierType.PolarMouseWheelZoom, EChart2DModifierType.PolarMouseWheelZoom + " [Pan]"],
    [EChart2DModifierType.PolarPan + " [Cartesian]", EChart2DModifierType.PolarPan + " [Polar]"],
];

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("sc-responsive-chart-wrapper");
        let toggleModifier = (_modifier: EChart2DModifierType) => {};
        const modifiersActive: Record<string, boolean> = {
            [EChart2DModifierType.PolarZoomExtents]: true,
            [EChart2DModifierType.PolarMouseWheelZoom]: true,
            [EChart2DModifierType.PolarPan + " [Cartesian]"]: true,
        };
        let warning: HTMLParagraphElement | undefined;

        const onChanged = (type: string) => {
            toggleModifier(type as EChart2DModifierType);
            modifiersActive[type] = !modifiersActive[type];
            const conflict = CONFLICTING_MODIFIER_TYPES.find(([a, b]) => modifiersActive[a] && modifiersActive[b]);
            warning?.remove();
            warning = undefined;
            if (conflict) {
                warning = h(
                    "p",
                    { role: "alert", class: "text-error" },
                    `Warning: "${conflict[0]}" conflicts with "${conflict[1]}". It may lead to unexpected behavior.`
                );
                panel.append(warning);
            }
        };

        const panel = h(
            "aside",
            { class: "sc-responsive-controls", "aria-label": "Polar modifiers" },
            h("h2", {}, "Polar modifiers"),
            ...ALL_POLAR_MODIFIER_TYPES.map((type) =>
                h(
                    "label",
                    { class: "sc-switch" },
                    h("input", {
                        type: "checkbox",
                        "aria-label": `Enable ${type}`,
                        checked: !!modifiersActive[type],
                        onchange: () => onChanged(type),
                    }),
                    type
                )
            )
        );
        const host = h("div");
        root.append(host, panel);
        const { controls } = await demo.mount(drawExample, host);
        toggleModifier = controls.toggleModifier;
    });
