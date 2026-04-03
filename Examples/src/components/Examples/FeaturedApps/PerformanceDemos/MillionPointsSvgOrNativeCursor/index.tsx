import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { appTheme } from "../../../theme";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

export default function HighPerformanceScatterCursor() {
    const [isSvgMode, setIsSvgMode] = React.useState(true);
    const [isCursor, setIsCursor] = React.useState(true);
    const controlsRef = React.useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);

    const handleModeChange = (event: React.MouseEvent<HTMLElement>, value: boolean) => {
        if (value !== null) {
            setIsSvgMode(value);
            if (controlsRef.current) {
                controlsRef.current.setSvgMode(value);
            }
        }
    };

    const handleModifierChange = (event: React.MouseEvent<HTMLElement>, value: boolean) => {
        if (value !== null) {
            setIsCursor(value);
            if (controlsRef.current) {
                controlsRef.current.toggleUseCursorOrRollover(value);
            }
        }
    };

    return (
        <div className={commonClasses.ChartWithToolbar}>
            <div className={commonClasses.ToolbarRow} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ToggleButtonGroup
                    exclusive
                    value={isSvgMode}
                    onChange={handleModeChange}
                    size="small"
                    color="primary"
                    aria-label="Cursor rendering mode (SVG or Native)"
                >
                    <ToggleButton value={true}>
                        SVG
                    </ToggleButton>
                    <ToggleButton value={false}>
                        Native
                    </ToggleButton>
                </ToggleButtonGroup>

                <ToggleButtonGroup
                    exclusive
                    value={isCursor}
                    onChange={handleModifierChange}
                    size="small"
                    color="primary"
                    aria-label="Choose Cursor or Rollover"
                >
                    <ToggleButton value={true}>
                        <svg
                            style={{ width: 32, height: 32 }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#FFF"
                        >
                            <path fill="#8886" strokeWidth="1" d="M3 3 3 21 L21 21L21 3L2.75 3" />
                            <path strokeWidth="0.5" d="M7 3, v18M3 14h18" />
                            <path strokeWidth="0.5" fill="#222" d="M8.2 4.7, v8, h8, v-8Z" />
                            <circle stroke="#38F" cx="7" cy="13" r="0.5" />
                            <text x="12" y="10" fontSize="4" strokeWidth="0.5" textAnchor="middle">
                                Y
                            </text>
                            <path
                                transform="translate(-0.9,7) scale(0.7)"
                                fill="#FFF"
                                stroke="#000000"
                                strokeWidth="0.75"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d=" M11.3,20.4c-0.3-0.4-0.6-1.1-1.2-2c-0.3-0.5-1.2-1.5-1.5-1.9c-0.2-0.4-0.2-0.6-0.1-1c0.1-0.6,0.7-1.1,1.4-1.1c0.5,0,1,0.4,1.4,0.7 c0.2,0.2,0.5,0.6,0.7,0.8c0.2,0.2,0.2,0.3,0.4,0.5c0.2,0.3,0.3,0.5,0.2,0.1c-0.1-0.5-0.2-1.3-0.4-2.1c-0.1-0.6-0.2-0.7-0.3-1.1 c-0.1-0.5-0.2-0.8-0.3-1.3c-0.1-0.3-0.2-1.1-0.3-1.5c-0.1-0.5-0.1-1.4,0.3-1.8c0.3-0.3,0.9-0.4,1.3-0.2c0.5,0.3,0.8,1,0.9,1.3 c0.2,0.5,0.4,1.2,0.5,2c0.2,1,0.5,2.5,0.5,2.8c0-0.4-0.1-1.1,0-1.5c0.1-0.3,0.3-0.7,0.7-0.8c0.3-0.1,0.6-0.1,0.9-0.1 c0.3,0.1,0.6,0.3,0.8,0.5c0.4,0.6,0.4,1.9,0.4,1.8c0.1-0.4,0.1-1.2,0.3-1.6c0.1-0.2,0.5-0.4,0.7-0.5c0.3-0.1,0.7-0.1,1,0 c0.2,0,0.6,0.3,0.7,0.5c0.2,0.3,0.3,1.3,0.4,1.7c0,0.1,0.1-0.4,0.3-0.7c0.4-0.6,1.8-0.8,1.9,0.6c0,0.7,0,0.6,0,1.1 c0,0.5,0,0.8,0,1.2c0,0.4-0.1,1.3-0.2,1.7c-0.1,0.3-0.4,1-0.7,1.4c0,0-1.1,1.2-1.2,1.8c-0.1,0.6-0.1,0.6-0.1,1 c0,0.4,0.1,0.9,0.1,0.9s-0.8,0.1-1.2,0c-0.4-0.1-0.9-0.8-1-1.1c-0.2-0.3-0.5-0.3-0.7,0c-0.2,0.4-0.7,1.1-1.1,1.1 c-0.7,0.1-2.1,0-3.1,0c0,0,0.2-1-0.2-1.4c-0.3-0.3-0.8-0.8-1.1-1.1L11.3,20.4z M15 16.5 v4,m2.3 -4 v4,m2.3 -4 v4"
                            />
                        </svg>
                        &nbsp; Cursor
                    </ToggleButton>
                    <ToggleButton value={false}>
                        <svg
                            style={{ width: 32, height: 32 }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#FFF"
                        >
                            <path fill="#8886" strokeWidth="1" d="M3 3 3 21 L21 21L21 3L2.75 3" />
                            <path strokeWidth="0.5" d="M7 3, v18Z" />
                            <path strokeWidth="0.5" fill="#222" d="M9 8, v8, h8, v-8Z" />
                            <circle stroke="#38F" cx="7" cy="12" r="0.5" />
                            <text x="13" y="13.3" fontSize="4" strokeWidth="0.5" textAnchor="middle">
                                Y
                            </text>
                            <path
                                transform="translate(-0.7,7) scale(0.7)"
                                fill="#FFF"
                                stroke="#000000"
                                strokeWidth="0.75"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d=" M11.3,20.4c-0.3-0.4-0.6-1.1-1.2-2c-0.3-0.5-1.2-1.5-1.5-1.9c-0.2-0.4-0.2-0.6-0.1-1c0.1-0.6,0.7-1.1,1.4-1.1c0.5,0,1,0.4,1.4,0.7 c0.2,0.2,0.5,0.6,0.7,0.8c0.2,0.2,0.2,0.3,0.4,0.5c0.2,0.3,0.3,0.5,0.2,0.1c-0.1-0.5-0.2-1.3-0.4-2.1c-0.1-0.6-0.2-0.7-0.3-1.1 c-0.1-0.5-0.2-0.8-0.3-1.3c-0.1-0.3-0.2-1.1-0.3-1.5c-0.1-0.5-0.1-1.4,0.3-1.8c0.3-0.3,0.9-0.4,1.3-0.2c0.5,0.3,0.8,1,0.9,1.3 c0.2,0.5,0.4,1.2,0.5,2c0.2,1,0.5,2.5,0.5,2.8c0-0.4-0.1-1.1,0-1.5c0.1-0.3,0.3-0.7,0.7-0.8c0.3-0.1,0.6-0.1,0.9-0.1 c0.3,0.1,0.6,0.3,0.8,0.5c0.4,0.6,0.4,1.9,0.4,1.8c0.1-0.4,0.1-1.2,0.3-1.6c0.1-0.2,0.5-0.4,0.7-0.5c0.3-0.1,0.7-0.1,1,0 c0.2,0,0.6,0.3,0.7,0.5c0.2,0.3,0.3,1.3,0.4,1.7c0,0.1,0.1-0.4,0.3-0.7c0.4-0.6,1.8-0.8,1.9,0.6c0,0.7,0,0.6,0,1.1 c0,0.5,0,0.8,0,1.2c0,0.4-0.1,1.3-0.2,1.7c-0.1,0.3-0.4,1-0.7,1.4c0,0-1.1,1.2-1.2,1.8c-0.1,0.6-0.1,0.6-0.1,1 c0,0.4,0.1,0.9,0.1,0.9s-0.8,0.1-1.2,0c-0.4-0.1-0.9-0.8-1-1.1c-0.2-0.3-0.5-0.3-0.7,0c-0.2,0.4-0.7,1.1-1.1,1.1 c-0.7,0.1-2.1,0-3.1,0c0,0,0.2-1-0.2-1.4c-0.3-0.3-0.8-0.8-1.1-1.1L11.3,20.4z M15 16.5 v4,m2.3 -4 v4,m2.3 -4 v4"
                            />
                        </svg>
                        &nbsp; Rollover
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>

            <SciChartReact
                className={commonClasses.Chart}
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = initResult.controls;
                }}
            />
        </div>
    );
}
