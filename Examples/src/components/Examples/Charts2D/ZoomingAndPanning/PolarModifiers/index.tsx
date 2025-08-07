import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample, POLAR_MODIFIER_INFO } from "./drawExample";
import { useState } from "react";
import { EChart2DModifierType } from "scichart";
import { Checkbox } from "@mui/material";
import { appTheme } from "../../../theme";

const ALL_POLAR_MODIFIER_TYPES = Array.from(Object.keys(POLAR_MODIFIER_INFO));

const CONFLICTING_MODIFIER_TYPES = [
    [
        EChart2DModifierType.PolarPan,
        EChart2DModifierType.PolarArcZoom,
    ],
    [
        EChart2DModifierType.PolarMouseWheelZoom,
        EChart2DModifierType.PolarMouseWheelZoom + " [Pan]"
    ],
    [
        EChart2DModifierType.PolarPan + " [Cartesian]",
        EChart2DModifierType.PolarPan + " [Polar]",
    ]
];


// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [ modifiersActive, setModifiersActive ] = useState<{ [key: string]: boolean }>({
        [EChart2DModifierType.PolarZoomExtents]: true,
        [EChart2DModifierType.PolarMouseWheelZoom]: true,
        [EChart2DModifierType.PolarPan + " [Cartesian]"]: true,
        [EChart2DModifierType.PolarDataPointSelection]: true,
    });
    const [ conflictWarning, setConflictWarning ] = useState<string | null>(null);

    const [controls, setControls] = useState({ 
        toggleModifier: (modifier: EChart2DModifierType) => {},
    })

    const handleToggleButtonChanged = (e: any, value: EChart2DModifierType) => {
        if (value === null) return;

        controls.toggleModifier(value);

        setModifiersActive((prevState) => ({
            ...prevState,
            [value]: !prevState[value],
        }));

        if (CONFLICTING_MODIFIER_TYPES.some((pair) => pair.includes(value))) {
            const conflictingModifier = CONFLICTING_MODIFIER_TYPES.find((pair) => pair.includes(value))?.find((modifier) => modifier !== value);
            if (conflictingModifier && modifiersActive[conflictingModifier]) {
                setConflictWarning(`Warning: "${value}" conflicts with "${conflictingModifier}". It may lead to unexpected behavior.`);
            } else {
                setConflictWarning(null);
            }
        }
    };

    return (
        <div className={commonClasses.ChartWrapper}>
            <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                background: appTheme.DarkIndigo,
            }}>
                <div style={{
                    height: '100%', 
                    maxWidth: "40%",
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: 10, 
                    padding: 10,
                    position: "relative",
                    overflowY: "auto",
                }}>
                    <h3>Polar Modifiers:</h3>

                    {Object.values(ALL_POLAR_MODIFIER_TYPES).map((type) => (
                        <div key={type} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            width: '100%',
                            gap: 10, paddingRight: 10 
                        }}>
                            <Checkbox
                                checked={modifiersActive[type]}
                                onChange={(event) => handleToggleButtonChanged(event, type as EChart2DModifierType)}
                                inputProps={{ 'aria-label': 'controlled' }}
                                style={{
                                    color: appTheme.Indigo,
                                }}
                            />

                            <p style={{
                                color: modifiersActive[type] ? "#fff" : "#bbb",
                                fontSize: 16,
                                fontWeight: modifiersActive[type] ? "semibold" : "normal",
                            }}>{type}</p>
                        </div>
                    ))}

                    {/* conflict handling */}
                    {conflictWarning && (
                        <div style={{
                            position: "absolute",
                            color: "red",
                            fontSize: 14,
                            bottom: 0,
                            margin: 14,
                        }}>
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
    )
}
