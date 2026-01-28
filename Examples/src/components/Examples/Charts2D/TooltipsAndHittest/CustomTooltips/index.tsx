import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { useState, useRef, useEffect } from "react";

type TooltipType = "cursor" | "rollover" | "verticalSlice";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [type, setType] = useState<TooltipType>("cursor");
    const setTypeFunc = useRef(null);
    const setDataFunc = useRef(null);
    const cb = useRef(null);
    const [showData, setShowData] = useState(true);
    const [showRolloverData, setShowRolloverData] = useState(false);
    const [showClickData, setShowClickData] = useState(false);
    const [seriesInfos, setSeriesInfos] = useState(null);
    const [rolloverInfo, setRolloverInfo] = useState(null);
    const [clickInfo, setClickInfo] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            if (cb.current && showData) {
                cb.current(setSeriesInfos);
            }
        }, 500);
    }, []);

    useEffect(() => {
        if (!showData) {
            setSeriesInfos(null);
        }

        if (cb.current && showData) {
            cb.current(setSeriesInfos);
            setShowClickData(false);
            setShowRolloverData(false);
        }
    }, [showData]);

    useEffect(() => {
        if (!showRolloverData) {
            setRolloverInfo(null);
        }

        if (cb.current && showRolloverData) {
            cb.current(setRolloverInfo);
            setShowClickData(false);
            setShowData(false);
        }
    }, [showRolloverData]);

    useEffect(() => {
        if (!showClickData) {
            setClickInfo(null);
        }

        if (cb.current && showClickData) {
            cb.current(setClickInfo);
            setShowData(false);
            setShowRolloverData(false);
        }
    }, [showClickData]);

    useEffect(() => {
        if (setTypeFunc.current) {
            setTypeFunc.current(type);

            if (type === "cursor") {
                setShowClickData(false);
                setShowRolloverData(false);
                setShowData(true);
            }

            if (type === "verticalSlice") {
                setShowClickData(true);
                setShowRolloverData(false);
                setShowData(false);
            }

            if (type === "rollover") {
                setShowClickData(false);
                setShowRolloverData(true);
                setShowData(false);
            }
        }
    }, [type]);

    return (
        <div className="wrapperDiv" style={{ width: "100%", height: "100%", position: "relative" }}>
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
                </div>
            </div>
            {type === "verticalSlice" && showClickData && clickInfo ? (
                <div
                    className="verticalSliceInfo"
                    style={{
                        zIndex: 900,
                        position: "absolute",
                        color: "white",
                        left: "10px",
                        bottom: "20px",
                        fontSize: "12px",
                    }}
                >
                    <div className="">Currently in React state:</div>
                    <div className="">{clickInfo}</div>
                </div>
            ) : null}
            {type === "cursor" && showData && seriesInfos?.length ? (
                <div
                    style={{
                        zIndex: 900,
                        position: "absolute",
                        color: "white",
                        left: "10px",
                        bottom: "20px",
                        fontSize: "12px",
                    }}
                >
                    <div className="">Currently in React state:</div>
                    <div className="">
                        {" "}
                        index: {seriesInfos[0].dataSeriesIndex}, xValue: {seriesInfos[0].xValue.toFixed(2)}, yValue[0]:
                        {seriesInfos[0].yValue.toFixed(2)}
                    </div>
                </div>
            ) : null}

            {type === "rollover" && showRolloverData && rolloverInfo ? (
                <div
                    style={{
                        zIndex: 900,
                        position: "absolute",
                        color: "white",
                        left: "10px",
                        bottom: "20px",
                        fontSize: "12px",
                    }}
                >
                    <div className="">Currently in React state:</div>
                    <div className="">
                        {" "}
                        index: {rolloverInfo.dataSeriesIndex}, xValue: {rolloverInfo.xValue.toFixed(2)}, yValue:
                        {rolloverInfo.yValue.toFixed(2)}
                    </div>
                </div>
            ) : null}

            <SciChartReact
                initChart={drawExample}
                className={commonClasses.ChartWrapper}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    // get the "setMap" function that is returned by "drawExample"
                    let { setType, setData, callBack } = initResult;

                    // assign function to ref so we can call it later
                    setTypeFunc.current = setType;

                    // reset data
                    setDataFunc.current = setData;

                    // set callback
                    cb.current = callBack;
                }}
            />
        </div>
    );
}
