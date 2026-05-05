import "./App.css";
import { useEffect, useRef, useState } from "react";
import { SciChartReact, type TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { australiaData, getMinMax, interpolateColor, keyData } from "./helpers";

export default function App() {
    const [mapData, setMapData] = useState<unknown[] | null>(null);
    const setMapFunc = useRef<(() => void) | null>(null);

    useEffect(() => {
        fetch("./australiaConverted.json")
            .then((res) => res.json())
            .then((data: unknown[]) => setMapData(data))
            .catch((err) => console.error("Failed to load map data", err));
    }, []);

    const [min, max] = getMinMax("population", australiaData);

    return (
        <div className="map-page">
            <div className="map-legend">
                {australiaData.map((d) => {
                    const color = interpolateColor(min, max, keyData[d.state]["population"]);
                    return (
                        <span key={d.state} className="map-legend-item">
                            <span className="map-legend-swatch" style={{ backgroundColor: color }} />
                            {d.state} — {new Intl.NumberFormat().format(keyData[d.state]["population"])}
                        </span>
                    );
                })}
            </div>
            {mapData && (
                <SciChartReact
                    initChart={drawExample}
                    className="map-chart"
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        const { setMap, setMapJson } = initResult;
                        setMapJson(mapData);
                        setMap();
                        setMapFunc.current = setMap;
                    }}
                />
            )}
        </div>
    );
}
