import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { useEffect, useRef, useState } from "react";
import { getMinMax, australiaData, Keytype, interpolateColor, keyData } from "./helpers";
import applyGeoAlbersUSAProjection from "./geoAlbersUSAProjection"

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
        fetch("usaStates.json")
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                const projectedData = applyGeoAlbersUSAProjection(data);
                setMapData(projectedData);
            })
            .catch((error) => console.error(error));
    }, []);



    return (
        <div className="" style={{ width: "100%", height: "100%", position: "relative" }}>

            
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
