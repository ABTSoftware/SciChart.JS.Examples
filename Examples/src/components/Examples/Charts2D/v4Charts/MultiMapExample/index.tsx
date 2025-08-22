import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { useEffect, useRef, useState } from "react";
import { fetchGeoJson } from "../../../ExampleData/ExampleDataProvider";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [mapName, setMapName] = useState("worldConverted");
    const [mapData, setMapData] = useState();
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);

    useEffect(() => {
        fetchGeoJson(mapName)
            .then((data) => {
                if (mapData === undefined) {
                    setMapData(data);
                } else {
                    controlsRef.current.setConvertedData(data);
                    controlsRef.current.setMap();
                }
            })
            .catch((error) => console.error(error));

        return () => {
            controlsRef.current.clearMap();
        };
    }, [mapName]);

    return (
        <div className="" style={{ width: "100%", height: "100%", position: "relative" }}>
            <div className="" style={{ position: "absolute", zIndex: "100" }}>
                <div className="">
                    <button
                        onClick={() => setMapName("worldConverted")}
                        style={{
                            color: mapName === "worldConverted" ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: mapName === "worldConverted" ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        WORLD
                    </button>
                    <button
                        onClick={() => setMapName("europeConverted")}
                        style={{
                            color: mapName === "europeConverted" ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: mapName === "europeConverted" ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        EUROPE
                    </button>
                    <button
                        onClick={() => setMapName("australiaConverted")}
                        style={{
                            color: mapName === "australiaConverted" ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: mapName === "australiaConverted" ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        AUSTRALIA
                    </button>
                    <button
                        onClick={() => setMapName("africaConverted")}
                        style={{
                            color: mapName === "africaConverted" ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: mapName === "africaConverted" ? "#14233c" : "#163149",
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
                        let { controls } = initResult;

                        // set geojson
                        // setMapJson(mapData);
                        controls.setConvertedData(mapData);

                        // set the initial map
                        controls.setMap();

                        controlsRef.current = controls;
                    }}
                />
            ) : null}
        </div>
    );
}
