import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { useEffect, useRef, useState } from "react";
import { getMinMax, australiaData, Keytype, interpolateColor, keyData } from "./helpers";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    // const [key, setKey] = useState<Keytype>("population");
    const [mapName, setMapName] = useState("australia");
    const [mapData, setMapData] = useState();
    const setMapFunc = useRef(null);
    const setMapJsonFunc = useRef(null);
    const clearMapFunc = useRef(null);

    useEffect(() => {
        fetch("/" + mapName + ".json")
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                if (mapData === undefined) {
                    setMapData(data);
                } else {
                    // clearMapFunc.current();

                    setMapJsonFunc.current(data);
                    setMapFunc.current();

                    // setTimeout(() => {
                    //     setMapJsonFunc.current(data);
                    //     setMapFunc.current();
                    // }, 200);
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
                        onClick={() => setMapName("australia")}
                        style={{
                            color: mapName === "australia" ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: mapName === "australia" ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        AUSTRALIA
                    </button>
                    <button
                        onClick={() => setMapName("world")}
                        style={{
                            color: mapName === "world" ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: mapName === "world" ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        WORLD
                    </button>
                    <button
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
                    </button>
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
