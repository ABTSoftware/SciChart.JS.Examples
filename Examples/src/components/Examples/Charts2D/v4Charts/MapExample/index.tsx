import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { useEffect, useRef, useState } from "react";
import { getMinMax, australiaData, Keytype, interpolateColor, keyData } from "./helpers";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [key, setKey] = useState<Keytype>("population");
    const [mapData, setMapData] = useState();
    const setMapFunc = useRef(null);

    const setMap = (key: Keytype) => {
        setMapFunc.current(key);
        setKey(key);
    };

    useEffect(() => {
        fetch("australiaConverted.json")
            .then((response) => response.json())
            .then((data) => {
                setMapData(data);
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <div className="" style={{ width: "100%", height: "100%", position: "relative" }}>
            <div className="" style={{ position: "absolute", zIndex: "1", pointerEvents: "none" }}>
                <div className="" style={{ pointerEvents: "all" }}>
                    <button
                        onClick={() => setMap("population")}
                        style={{
                            color: key === "population" ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: key === "population" ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        POPULATION
                    </button>
                    <button
                        onClick={() => setMap("area_km2")}
                        style={{
                            color: key === "area_km2" ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: key === "area_km2" ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        AREA (km<sup>2</sup>)
                    </button>
                    <button
                        onClick={() => setMap("population_density")}
                        style={{
                            color: key === "population_density" ? "white" : "rgb(0, 188, 212)",
                            display: "inline-block",
                            padding: "10px 24px",
                            background: key === "population_density" ? "#14233c" : "#163149",
                            cursor: "pointer",
                        }}
                    >
                        POPULATION DENSITY
                    </button>
                </div>
                <span
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        color: "white",
                        fontSize: "11px",
                        pointerEvents: "none",
                        marginLeft: "10px",
                    }}
                >
                    {australiaData.map((d) => {
                        let color = interpolateColor(
                            getMinMax(key, australiaData)[0],
                            getMinMax(key, australiaData)[1],
                            keyData[d.state][key]
                        );
                        return (
                            <span key={d.state} style={{ pointerEvents: "none" }}>
                                <span
                                    style={{
                                        width: 10,
                                        height: 10,
                                        backgroundColor: color,
                                        display: "inline-block",
                                        pointerEvents: "none",
                                    }}
                                ></span>{" "}
                                {d.state} - {new Intl.NumberFormat().format(keyData[d.state][key])}
                            </span>
                        );
                    })}
                </span>
            </div>
            {mapData ? (
                <SciChartReact
                    initChart={drawExample}
                    className={commonClasses.ChartWrapper}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        // get the "setMap" function that is returned by "drawExample"
                        let { setMap, setMapJson } = initResult;

                        // set geojson
                        setMapJson(mapData);

                        // set the initial map
                        setMap(key);

                        // assign function to ref so we can call it later
                        setMapFunc.current = setMap;
                    }}
                />
            ) : null}
        </div>
    );
}
