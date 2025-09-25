import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { useState, useRef, useEffect } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

type TooltipType = "cursor" | "rollover" | "verticalSlice";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [type, setType] = useState<TooltipType>("cursor");
    const setTypeFunc = useRef(null);
    const setDataFunc = useRef(null);
    const cb = useRef(null);
    const cbClick = useRef(null);
    const [showData, setShowData] = useState(false);
    const [showClickData, setShowClickData] = useState(false);
    const [seriesInfos, setSeriesInfos] = useState(null);
    const [clickInfo, setClickInfo] = useState(null);

    useEffect(() => {
        if (!showData) {
            setSeriesInfos(null);
        }

        if (cb.current && showData) {
            cb.current(setSeriesInfos);
            setShowClickData(false);
        }
    }, [showData]);

    useEffect(() => {
        if (!showClickData) {
            setClickInfo(null);
        }

        if (cbClick.current && showClickData) {
            cbClick.current(setClickInfo);
            setShowData(false);
        }
    }, [showClickData]);

    useEffect(() => {
        if (setTypeFunc.current) {
            setTypeFunc.current(type);
            setShowClickData(false);
            setShowData(false);
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

                    {type === "cursor" ? (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={showData}
                                    onChange={() => {
                                        setShowData((value) => !value);
                                    }}
                                />
                            }
                            label={`${showData ? "hide data" : "show data"}`}
                            style={{ margin: 0, background: "#163149", color: "white", paddingRight: "10px" }}
                        />
                    ) : null}

                    {type === "cursor" && showData && seriesInfos?.length ? (
                        <div
                            style={{
                                color: "rgb(0, 188, 212)",
                                display: "inline-block",
                            }}
                        >
                            index: {seriesInfos[0].dataSeriesIndex}, xValue: {seriesInfos[0].xValue.toFixed(2)},
                            yValue[0]:
                            {seriesInfos[0].yValue.toFixed(2)}
                        </div>
                    ) : null}

                    {type === "verticalSlice" ? (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={showClickData}
                                    onChange={() => {
                                        setShowClickData((value) => !value);
                                    }}
                                />
                            }
                            label={`${showClickData ? "hide click data" : "show click data"}`}
                            style={{ margin: 0, background: "#163149", color: "white", paddingRight: "10px" }}
                        />
                    ) : null}

                    {type === "verticalSlice" && showClickData && clickInfo ? (
                        <div
                            style={{
                                color: "rgb(0, 188, 212)",
                                display: "inline-block",
                            }}
                        >
                            {clickInfo}
                        </div>
                    ) : null}
                </div>
            </div>
            <SciChartReact
                initChart={drawExample}
                className={commonClasses.ChartWrapper}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    // get the "setMap" function that is returned by "drawExample"
                    let { setType, setData, callBack, clickCallBack } = initResult;

                    // assign function to ref so we can call it later
                    setTypeFunc.current = setType;

                    // reset data
                    setDataFunc.current = setData;

                    cb.current = callBack;

                    cbClick.current = clickCallBack;
                }}
            />
        </div>
    );
}
