import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { useRef, useState } from "react";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [isGradient, setIsGradient] = useState(true);
    const setChartFunc = useRef(null);

    return (
        <div className="" style={{ width: "100%", height: "100%", position: "relative" }}>
            <div className="" style={{ position: "absolute", zIndex: "100" }}>
                <div className="">
                    <button
                        onClick={() => {
                            setIsGradient(true);
                            setChartFunc.current(true);
                        }}
                        style={{
                            color: isGradient ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: isGradient ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        GRADIENT COLOURS
                    </button>
                    <button
                        onClick={() => {
                            setIsGradient(false);
                            setChartFunc.current(false);
                        }}
                        style={{
                            color: !isGradient ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: !isGradient ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        SOLID COLOURS
                    </button>
                </div>
            </div>

            <SciChartReact
                initChart={drawExample}
                className={commonClasses.ChartWrapper}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    // get the "setChart" function that is returned by "drawExample"
                    let { setChart } = initResult;

                    // assign function to ref so we can call it later
                    setChartFunc.current = setChart;
                }}
            />
        </div>
    );
}
