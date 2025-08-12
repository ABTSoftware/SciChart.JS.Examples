import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { useState, useRef, useEffect } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

type TooltipType = "cursor" | "rollover" | "verticalSlice";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [type, setType] = useState<TooltipType>("cursor");
    const [cutRight, setCutRight] = useState(false);
    const setMapFunc = useRef(null);
    const setDataFunc = useRef(null);
    const setSlice = useRef(null);

    useEffect(() => {
        if (setMapFunc.current) {
            setMapFunc.current(type);
        }
    }, [type]);

    return (
        <div className="" style={{ width: "100%", height: "100%", position: "relative" }}>
            <div className="" style={{ position: "absolute", zIndex: "900", pointerEvents: "none" }}>
                <div style={{ pointerEvents: "all" }}>
                    <button
                        onClick={() => setType("cursor")}
                        style={{
                            color: type === "cursor" ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: type === "cursor" ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        CURSOR
                    </button>

                    <button
                        onClick={() => setType("rollover")}
                        style={{
                            color: type === "rollover" ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: type === "rollover" ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        ROLLOVER
                    </button>
                    <button
                        onClick={() => setType("verticalSlice")}
                        style={{
                            color: type === "verticalSlice" ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: type === "verticalSlice" ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        VERTICAL SLICE
                    </button>

                    {type === "verticalSlice" ? (
                        <span className="">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={cutRight}
                                        onChange={() => {
                                            setCutRight((value) => !value);
                                            setSlice.current(!cutRight);
                                            console.log({ cutRight: !cutRight });
                                        }}
                                    />
                                }
                                label={`Slice ${cutRight ? "right" : "left"}`}
                                style={{ margin: 0, background: "#163149", color: "white", paddingRight: "10px" }}
                            />
                            <button
                                onClick={() => {
                                    setDataFunc.current();
                                }}
                                style={{
                                    color: "rgb(0, 188, 212)",
                                    display: "inline-block",
                                    padding: "10px 24px",
                                    background: "#163149",
                                    cursor: "pointer",
                                }}
                            >
                                RESET DATA
                            </button>
                        </span>
                    ) : null}
                </div>
            </div>
            <SciChartReact
                initChart={drawExample}
                className={commonClasses.ChartWrapper}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    // get the "setMap" function that is returned by "drawExample"
                    let { setType, setData, sliceRightFunction } = initResult;

                    // assign function to ref so we can call it later
                    setMapFunc.current = setType;

                    // reset data
                    setDataFunc.current = setData;

                    // set slice direction
                    setSlice.current = sliceRightFunction;
                }}
            />
        </div>
    );
}
