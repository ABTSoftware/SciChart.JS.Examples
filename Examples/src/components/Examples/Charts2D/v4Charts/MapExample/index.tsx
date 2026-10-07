import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { useEffect, useRef, useState } from "react";
import { getMinMax, australiaData, Keytype, interpolateColor, keyData } from "./helpers";

export default function ChartComponent() {
    const [key, setKey] = useState<Keytype>("population");
    const [mapData, setMapData] = useState<any>();
    const setMapFunc = useRef<((nextKey: Keytype) => void) | null>(null);

    const setMap = (nextKey: Keytype) => {
        setMapFunc.current?.(nextKey);
        setKey(nextKey);
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
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="map metric">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={key === "population"}
                        onClick={() => setMap("population")}
                    >
                        Population
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={key === "area_km2"}
                        onClick={() => setMap("area_km2")}
                    >
                        <span>
                            Area (km<sup>2</sup>)
                        </span>
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={key === "population_density"}
                        onClick={() => setMap("population_density")}
                    >
                        Population Density
                    </button>
                </div>
            </header>
            <div className="sc-chart-wrapper flex-auto">
                {mapData ? (
                    <SciChartReact
                        initChart={drawExample}
                        className="sc-chart-wrapper"
                        onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                            const { setMap, setMapJson } = initResult;

                            setMapJson(mapData);
                            setMap(key);
                            setMapFunc.current = setMap;
                        }}
                    />
                ) : null}

                <div
                    className="absolute flex flex-col top-2 left-2 pointer-events-none"
                    style={{ fontSize: 11 }}
                >
                    {australiaData.map((d) => {
                        const [minValue, maxValue] = getMinMax(key, australiaData);
                        const color = interpolateColor(minValue, maxValue, keyData[d.state][key]);
                        return (
                            <span key={d.state}>
                                <span
                                    style={{
                                        width: 10,
                                        height: 10,
                                        display: "inline-block",
                                        marginRight: 6,
                                        backgroundColor: color,
                                    }}
                                />
                                {d.state} - {new Intl.NumberFormat().format(keyData[d.state][key])}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
