import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample, POLAR_MODIFIER_INFO } from "./drawExample";
import { useState } from "react";
import { EChart2DModifierType } from "scichart";

const ALL_POLAR_MODIFIER_TYPES = Object.keys(POLAR_MODIFIER_INFO);

const CONFLICTING_MODIFIER_TYPES = [
    [EChart2DModifierType.PolarPan, EChart2DModifierType.PolarArcZoom],
    [EChart2DModifierType.PolarMouseWheelZoom, EChart2DModifierType.PolarMouseWheelZoom + " [Pan]"],
    [EChart2DModifierType.PolarPan + " [Cartesian]", EChart2DModifierType.PolarPan + " [Polar]"],
];

export default function ChartComponent() {
    const [modifiersActive, setModifiersActive] = useState<{ [key: string]: boolean }>({
        [EChart2DModifierType.PolarZoomExtents]: true,
        [EChart2DModifierType.PolarMouseWheelZoom]: true,
        [EChart2DModifierType.PolarPan + " [Cartesian]"]: true,
    });
    const [conflictWarning, setConflictWarning] = useState<string | null>(null);

    const [controls, setControls] = useState({
        toggleModifier: (_modifier: EChart2DModifierType) => {},
    });

    const handleToggleButtonChanged = (value: EChart2DModifierType) => {

        controls.toggleModifier(value);

        setModifiersActive((prevState) => {
            const newState = {
                ...prevState,
                [value]: !prevState[value],
            };

            let hasConflict = false;
            let conflictMessage = "";

            for (const pair of CONFLICTING_MODIFIER_TYPES) {
                if (newState[pair[0]] && newState[pair[1]]) {
                    hasConflict = true;
                    conflictMessage = `Warning: "${pair[0]}" conflicts with "${pair[1]}". It may lead to unexpected behavior.`;
                    break;
                }
            }

            if (hasConflict) {
                setConflictWarning(conflictMessage);
            } else {
                setConflictWarning(null);
            }

            return newState;
        });
    };

    return (
        <div className="sc-chart-wrapper sc-responsive-chart-wrapper">
            <SciChartReact
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    setControls(initResult.controls);
                }}
                initChart={drawExample}
            />

            <aside className="sc-responsive-controls" aria-label="Polar modifiers">
                <h2>Polar modifiers</h2>
                {ALL_POLAR_MODIFIER_TYPES.map((type) => (
                    <label key={type} className="sc-switch">
                        <input
                            type="checkbox"
                            aria-label={`Enable ${type}`}
                            checked={!!modifiersActive[type]}
                            onChange={() => handleToggleButtonChanged(type as EChart2DModifierType)}
                        />
                        {type}
                    </label>
                ))}

                {conflictWarning && (
                    <p role="alert" style={{ color: "var(--sc-error)" }}>
                        {conflictWarning}
                    </p>
                )}
            </aside>
        </div>
    );
}
