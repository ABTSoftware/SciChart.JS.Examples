import { useState } from "react";
import { DataPointInfo } from "scichart";
import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";

export default function DatapointSelection() {
    const [selectedPoints, setSelectedPoints] = useState<DataPointInfo[]>([]);

    return (
        <div className="sc-chart-wrapper sc-responsive-chart-wrapper">
            <SciChartReact 
                initChart={(rootElement) => drawExample(rootElement, setSelectedPoints)} 
            />

            <div className="flex flex-col p-1 gap-1">
                <h3 className="text-center">Selected Points</h3>

                <div className="flex border-b border-t">
                    <div className="flex w-full text-center px-2 border-r">
                        Name
                    </div>

                    <div className="flex w-full text-center px-2 border-r">
                        X Value
                    </div>

                    <div className="flex w-full text-center px-2">
                        Y Value
                    </div>
                </div>

                <div className="flex-1" style={{ overflowY: "auto" }}>
                    {selectedPoints.map((dp, index) => (
                        <div className="flex border-b" key={"point-" + index}>
                            <div className="flex w-full text-center px-2 border-r">
                                {dp.seriesName}
                            </div>

                            <div className="flex w-full text-center px-2 border-r">
                                {dp.xValue.toFixed(0)}
                            </div>

                            <div className="flex w-full text-center px-2">
                                {dp.yValue.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
