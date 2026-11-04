import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { useEffect, useRef, useState } from "react";
import { fetchGeoJson } from "../../../ExampleData/ExampleDataProvider";

type MapName = "worldConverted" | "europeConverted" | "australiaConverted" | "africaConverted";

export default function ChartComponent() {
    const [mapName, setMapName] = useState<MapName>("worldConverted");
    const [mapData, setMapData] = useState<any>();
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);

    useEffect(() => {
        fetchGeoJson(mapName)
            .then((data) => {
                if (mapData === undefined) {
                    setMapData(data);
                } else {
                    controlsRef.current?.setConvertedData(data);
                    controlsRef.current?.setMap();
                }
            })
            .catch((error) => console.error(error));

        return () => {
            controlsRef.current?.clearMap();
        };
    }, [mapName]);

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="map region">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={mapName === "worldConverted"}
                        onClick={() => setMapName("worldConverted")}
                    >
                        World
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={mapName === "europeConverted"}
                        onClick={() => setMapName("europeConverted")}
                    >
                        Europe
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={mapName === "australiaConverted"}
                        onClick={() => setMapName("australiaConverted")}
                    >
                        Australia
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={mapName === "africaConverted"}
                        onClick={() => setMapName("africaConverted")}
                    >
                        Africa
                    </button>
                </div>
            </header>
            <div className="sc-chart-wrapper flex-auto">
                {mapData ? (
                    <SciChartReact
                        initChart={drawExample}
                        className="sc-chart-wrapper"
                        onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                            const { controls } = initResult;
                            controls.setConvertedData(mapData);
                            controls.setMap();
                            controlsRef.current = controls;
                        }}
                    />
                ) : null}
            </div>
        </div>
    );
}
