import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { useEffect, useRef, useState } from "react";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [view, setView] = useState(false);
    const [mapData, setMapData] = useState();
    const setMapFunc = useRef(null);
    const setMapJsonFunc = useRef(null);
    const clearMapFunc = useRef(null);
    const setViewFunc = useRef(null);

    useEffect(() => {
        fetch("world.json")
            .then((response) => response.json())
            .then((data) => {
                if (mapData === undefined) {
                    setMapData(data);
                } else {
                    setViewFunc.current(view);
                    setMapJsonFunc.current(data);
                    setMapFunc.current();
                }
            })
            .catch((error) => console.error(error));

        return () => {
            // clearMapFunc.current();
        };
    }, [view]);

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Map viewpoint">
                    <button type="button" className="sc-button" aria-pressed={!view} onClick={() => setView(false)}>
                        View from north
                    </button>
                    <button type="button" className="sc-button" aria-pressed={view} onClick={() => setView(true)}>
                        View from south
                    </button>
                </div>
            </header>
            {mapData ? (
                <SciChartReact
                    initChart={drawExample}
                    className="sc-chart-wrapper"
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        // get the "setMap" function that is returned by "drawExample"
                        let { setMapJson, setMap, setView } = initResult;

                        // set fiew point
                        setView(false);

                        // set geojson
                        setMapJson(mapData);

                        // set the initial map
                        setMap();

                        // // assign function to ref so we can call it later
                        setMapFunc.current = setMap;
                        setViewFunc.current = setView;
                        setMapJsonFunc.current = setMapJson;
                    }}
                />
            ) : null}
        </div>
    );
}
