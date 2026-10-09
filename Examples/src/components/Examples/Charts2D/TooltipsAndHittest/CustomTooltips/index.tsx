import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { useState, useRef, useEffect } from "react";

type TooltipType = "cursor" | "rollover" | "verticalSlice";

export default function ChartComponent() {
    const [type, setType] = useState<TooltipType>("cursor");
    const setTypeFunc = useRef(null);
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

    const stateInfo =
        type === "verticalSlice" && showClickData && clickInfo
            ? clickInfo
            : type === "cursor" && showData && seriesInfos?.length
            ? `index: ${seriesInfos[0].dataSeriesIndex}, xValue: ${seriesInfos[0].xValue.toFixed(
                  2
              )}, yValue[0]: ${seriesInfos[0].yValue.toFixed(2)}`
            : type === "rollover" && showRolloverData && rolloverInfo
            ? `index: ${rolloverInfo.dataSeriesIndex}, xValue: ${rolloverInfo.xValue.toFixed(
                  2
              )}, yValue: ${rolloverInfo.yValue.toFixed(2)}`
            : null;

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Tooltip mode">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={type === "cursor"}
                        onClick={() => setType("cursor")}
                    >
                        Cursor
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={type === "rollover"}
                        onClick={() => setType("rollover")}
                    >
                        Rollover
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={type === "verticalSlice"}
                        onClick={() => setType("verticalSlice")}
                    >
                        Vertical slice
                    </button>
                </div>
            </header>
            {stateInfo ? (
                <div className="absolute" style={{ left: 10, bottom: 30, zIndex: 900 }}>
                    <div>Currently in React state:</div>
                    <div>{stateInfo}</div>
                </div>
            ) : null}

            <SciChartReact
                initChart={drawExample}
                className="sc-chart-wrapper"
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    // get the "setMap" function that is returned by "drawExample"
                    const { setType, callBack } = initResult;

                    // assign function to ref so we can call it later
                    setTypeFunc.current = setType;

                    // set callback
                    cb.current = callBack;
                }}
            />
        </div>
    );
}
