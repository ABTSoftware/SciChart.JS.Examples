import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { fetchGeoJson } from "../../../ExampleData/ExampleDataProvider";

type MapName = "worldConverted" | "europeConverted" | "australiaConverted" | "africaConverted";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [mapName, setMapName] = useState<MapName>("worldConverted");
    const [mapData, setMapData] = useState<any>();
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);

    const handleToggleButtonChanged = (_event: MouseEvent<HTMLElement>, value: MapName | null) => {
        if (!value) return;
        setMapName(value);
    };

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
                        onClick={(event) => handleToggleButtonChanged(event, "worldConverted")}
                    >
                        World
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={mapName === "europeConverted"}
                        onClick={(event) => handleToggleButtonChanged(event, "europeConverted")}
                    >
                        Europe
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={mapName === "australiaConverted"}
                        onClick={(event) => handleToggleButtonChanged(event, "australiaConverted")}
                    >
                        Australia
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={mapName === "africaConverted"}
                        onClick={(event) => handleToggleButtonChanged(event, "africaConverted")}
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
