import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { fetchGeoJson } from "../../../ExampleData/ExampleDataProvider";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

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
        <div className={commonClasses.ChartWithToolbar}>
            <div className={commonClasses.ToolbarRow}>
                <ToggleButtonGroup
                    className={commonClasses.ToggleButtonGroup}
                    exclusive
                    value={mapName}
                    onChange={handleToggleButtonChanged}
                    size="medium"
                    color="primary"
                    aria-label="map region"
                >
                    <ToggleButton value="worldConverted">World</ToggleButton>
                    <ToggleButton value="europeConverted">Europe</ToggleButton>
                    <ToggleButton value="australiaConverted">Australia</ToggleButton>
                    <ToggleButton value="africaConverted">Africa</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div className={commonClasses.FullHeightChartWrapper}>
                {mapData ? (
                    <SciChartReact
                        initChart={drawExample}
                        className={commonClasses.ChartWrapper}
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
