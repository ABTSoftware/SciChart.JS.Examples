import { useState, useRef, useCallback, type MouseEvent } from "react";
import { DeleteSweepIcon } from "../../../icons";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

const POINT_OPTIONS = [3, 5, 7, 9];

export default function PairedDashedPolylineAnnotation() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample> | undefined>(undefined);
    const [pointCount, setPointCount] = useState(0);
    const [isConnectorLineVisible, setIsConnectorLineVisible] = useState(true);

    const handlePointCountChange = useCallback((_event: MouseEvent<HTMLElement>, nextPointCount: number | null) => {
        if (!nextPointCount) return;

        setPointCount(nextPointCount);
        controlsRef.current?.startPlacement(nextPointCount);
    }, []);

    return (
        <div
            className="sc-chart-wrapper"
            onClick={() => {
                if (pointCount !== 0 && !controlsRef.current?.isPlacing()) setPointCount(0);
            }}
        >
            <header className="sc-toolbar-row">
                <label className="sc-switch">
                    <input
                        type="checkbox"
                        checked={isConnectorLineVisible}
                        onChange={(e) => {
                            controlsRef.current?.togglePairConnectors();
                            setIsConnectorLineVisible(!isConnectorLineVisible);
                        }}
                    />
                    <span>Show connectors</span>
                </label>

                <div className="flex gap-2 items-center">
                    <span>&nbsp;Place polyline with N points:</span>

                    <div 
                        className="sc-button-group" 
                        role="group" 
                        aria-label="Polyline point count"
                    >
                        {POINT_OPTIONS.map((count) => (
                            <button
                                type="button"
                                className="sc-button"
                                aria-pressed={pointCount === count}
                                key={count}
                                aria-label={`${count} points`}
                                onClick={(event) => handlePointCountChange(event, count)}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    className="sc-button sc-button-icon sc-button-destructive"
                    title="Delete all annotations"
                    aria-label="Delete all annotations"
                    onClick={() => controlsRef.current?.deleteAllAnnotations()}
                    type="button"
                >
                    <DeleteSweepIcon fontSize="small" />
                </button>
            </header>

            <SciChartReact
                initChart={drawExample}
                onInit={(result: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = result;
                }}
            />
        </div>
    );
}
