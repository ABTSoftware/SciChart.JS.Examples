import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample, POLAR_MODIFIER_INFO } from "./drawExample";
import { useState } from "react";
import { EChart2DModifierType } from "scichart";
import { appTheme } from "../../../theme";

const ALL_POLAR_MODIFIER_TYPES = Array.from(Object.keys(POLAR_MODIFIER_INFO));

const CONFLICTING_MODIFIER_TYPES = [
    [EChart2DModifierType.PolarPan, EChart2DModifierType.PolarArcZoom],
    [EChart2DModifierType.PolarMouseWheelZoom, EChart2DModifierType.PolarMouseWheelZoom + " [Pan]"],
    [EChart2DModifierType.PolarPan + " [Cartesian]", EChart2DModifierType.PolarPan + " [Polar]"],
];

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [modifiersActive, setModifiersActive] = useState<{ [key: string]: boolean }>({
        [EChart2DModifierType.PolarZoomExtents]: true,
        [EChart2DModifierType.PolarMouseWheelZoom]: true,
        [EChart2DModifierType.PolarPan + " [Cartesian]"]: true,
    });
    const [conflictWarning, setConflictWarning] = useState<string | null>(null);

    const [controls, setControls] = useState({
        toggleModifier: (modifier: EChart2DModifierType) => {},
    });

    const handleToggleButtonChanged = (e: any, value: EChart2DModifierType) => {
        if (value === null) return;

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
        <div className="sc-chart-wrapper">
            <div className="flex w-full h-full">
                <div
                    className="flex flex-col h-full gap-3 p-2 relative"
                    style={{
                        maxWidth: "40%",
                        overflowY: "auto",
                    }}
                >
                    <h2>&nbsp;Polar Modifiers:</h2>

                    {Object.values(ALL_POLAR_MODIFIER_TYPES).map((type) => (
                        <div
                            key={type}
                            className="flex items-center w-full gap-2"
                        >
                            <input
                                type="checkbox"
                                className="sc-checkbox"
                                aria-label={`Enable ${type}`}
                                checked={modifiersActive[type]}
                                onChange={(event) => handleToggleButtonChanged(event, type as EChart2DModifierType)}
                            />

                            <p
                                style={{
                                    color: "var(--text)",
                                    opacity: modifiersActive[type] ? 1 : 0.5,
                                    fontSize: 16,
                                    fontWeight: modifiersActive[type] ? "semibold" : "normal",
                                }}
                            >
                                {type}
                            </p>
                        </div>
                    ))}

                    {/* conflict handling */}
                    {conflictWarning && (
                        <div
                            style={{
                                position: "absolute",
                                color: "red",
                                fontSize: 14,
                                bottom: 0,
                                margin: 14,
                            }}
                        >
                            <span>{conflictWarning}</span>
                        </div>
                    )}
                </div>
                <SciChartReact
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        setControls(initResult.controls);
                    }}
                    initChart={drawExample}
                    style={{ flex: 1 }}
                />
            </div>
        </div>
    );
}
