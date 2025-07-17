import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { useEffect, useRef, useState } from "react";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [view, setView] = useState(false);
    const [mapData, setMapData] = useState();
    const setMapFunc = useRef(null);
    const setMapJsonFunc = useRef(null);
    const clearMapFunc = useRef(null);
    const setViewFunc = useRef(null);

    useEffect(() => {
        fetch("world.json")
            .then((response) => response.json())
            .then((data) => {
                if (mapData === undefined) {
                    setMapData(data);
                } else {
                    setViewFunc.current(view);
                    setMapJsonFunc.current(data);
                    setMapFunc.current();
                }
            })
            .catch((error) => console.error(error));

        return () => {
            // clearMapFunc.current();
        };
    }, [view]);

    return (
        <div className="" style={{ width: "100%", height: "100%", position: "relative" }}>
            <div className="" style={{ position: "absolute", zIndex: "100" }}>
                <div className="">
                    <button
                        onClick={() => {
                            setView(false);
                        }}
                        style={{
                            color: view === false ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: view === false ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        VIEW FROM NORTH
                    </button>
                    <button
                        onClick={() => {
                            setView(true);
                            // setViewFunc.current(true);
                        }}
                        style={{
                            color: view === true ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: view === true ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        VIEW FROM SOUTH
                    </button>
                </div>
            </div>
            {mapData ? (
                <SciChartReact
                    initChart={drawExample}
                    className={commonClasses.ChartWrapper}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        // get the "setMap" function that is returned by "drawExample"
                        let { setMapJson, setMap, setView } = initResult;

                        // set fiew point
                        setView(false);

                        // set geojson
                        setMapJson(mapData);

                        // set the initial map
                        setMap();

                        // // assign function to ref so we can call it later
                        setMapFunc.current = setMap;
                        setViewFunc.current = setView;
                        setMapJsonFunc.current = setMapJson;
                        // clearMapFunc.current = clearMap;
                    }}
                />
            ) : null}
        </div>
    );
}
