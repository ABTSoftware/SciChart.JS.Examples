import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { useEffect, useRef, useState } from "react";
import transformToAlbersUSA from "./geoAlbersUSAProjection"

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [mapName, setMapName] = useState("regular");
    const [mapData, setMapData] = useState();
    const setMapFunc = useRef(null);
    const setMapJsonFunc = useRef(null);
    const clearMapFunc = useRef(null);

    useEffect(() => {
        fetch("usaStates.json")
            .then((response) => response.json())
            .then((data) => {
                if (mapData === undefined) {
                    setMapData(data);
                } else {
                    if (mapName === "regular") {
                        setMapJsonFunc.current(data);
                        setMapFunc.current();
                    } else {
                        setMapJsonFunc.current(transformToAlbersUSA(data));
                        setMapFunc.current();
                    }
                }
            })
            .catch((error) => console.error(error));

        return () => {
            clearMapFunc.current();
        };
    }, [mapName]);

    return (
        <div className="" style={{ width: "100%", height: "100%", position: "relative" }}>
            <div className="" style={{ position: "absolute", zIndex: "100" }}>
                <div className="">
                    <button
                        onClick={() => setMapName("regular")}
                        style={{
                            color: mapName === "regular" ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: mapName === "regular" ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        Mercator projection
                    </button>
                    <button
                        onClick={() => setMapName("albersUsa")}
                        style={{
                            color: mapName === "albersUsa" ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: mapName === "albersUsa" ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        Albers USA projection
                    </button>
                    {/* <button
                        onClick={() => setMapName("africa")}
                        style={{
                            color: mapName === "africa" ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: mapName === "africa" ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        AFRICA
                    </button> */}
                </div>
            </div>
            {mapData ? (
                <SciChartReact
                    initChart={drawExample}
                    className={commonClasses.ChartWrapper}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        // get the "setMap" function that is returned by "drawExample"
                        let { setMap, setMapJson, clearMap } = initResult;

                        // set geojson
                        setMapJson(mapData);

                        // set the initial map
                        setMap();

                        // assign function to ref so we can call it later
                        setMapFunc.current = setMap;
                        setMapJsonFunc.current = setMapJson;
                        clearMapFunc.current = clearMap;
                    }}
                />
            ) : null}
        </div>
    );
}
