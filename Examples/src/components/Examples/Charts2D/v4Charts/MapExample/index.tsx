import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { getMinMax, australiaData, Keytype, interpolateColor, keyData } from "./helpers";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [key, setKey] = useState<Keytype>("population");
    const [mapData, setMapData] = useState<any>();
    const setMapFunc = useRef<((nextKey: Keytype) => void) | null>(null);

    const setMap = (nextKey: Keytype) => {
        setMapFunc.current?.(nextKey);
        setKey(nextKey);
    };

    const handleToggleButtonChanged = (_event: MouseEvent<HTMLElement>, value: Keytype | null) => {
        if (!value) return;
        setMap(value);
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
        <div className={commonClasses.ChartWithToolbar}>
            <div className={commonClasses.ToolbarRow}>
                <ToggleButtonGroup
                    className={commonClasses.ToggleButtonGroup}
                    exclusive
                    value={key}
                    onChange={handleToggleButtonChanged}
                    size="medium"
                    color="primary"
                    aria-label="map metric"
                >
                    <ToggleButton value="population">Population</ToggleButton>
                    <ToggleButton value="area_km2">
                        Area (km<sup>2</sup>)
                    </ToggleButton>
                    <ToggleButton value="population_density">Population Density</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div className={commonClasses.FullHeightChartWrapper}>
                <span
                    style={{
                        position: "absolute",
                        top: "8px",
                        left: "10px",
                        zIndex: 1,
                        display: "flex",
                        flexDirection: "column",
                        color: "var(--text)",
                        fontSize: "11px",
                        pointerEvents: "none",
                    }}
                >
                    {australiaData.map((d) => {
                        const [minValue, maxValue] = getMinMax(key, australiaData);
                        const color = interpolateColor(minValue, maxValue, keyData[d.state][key]);
                        return (
                            <span key={d.state} style={{ color: "var(--text)" }}>
                                <span
                                    style={{
                                        width: 10,
                                        height: 10,
                                        backgroundColor: color,
                                        display: "inline-block",
                                        marginRight: "6px",
                                    }}
                                />
                                {d.state} - {new Intl.NumberFormat().format(keyData[d.state][key])}
                            </span>
                        );
                    })}
                </span>
                {mapData ? (
                    <SciChartReact
                        initChart={drawExample}
                        className={commonClasses.ChartWrapper}
                        onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                            const { setMap, setMapJson } = initResult;

                            setMapJson(mapData);
                            setMap(key);
                            setMapFunc.current = setMap;
                        }}
                    />
                ) : null}
            </div>
        </div>
    );
}
