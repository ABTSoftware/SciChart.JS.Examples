import React, { useContext, useState } from "react";
import { SciChartReact, SciChartSurfaceContext, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

export default function Overview() {
    return (
        <SciChartReact className="sc-chart-wrapper" initChart={drawExample}>
            <ChartHeader />
        </SciChartReact>
    );
}

const ChartHeader = () => {
    const initResult = useContext(SciChartSurfaceContext) as TResolvedReturnType<typeof drawExample>;
    const [useDateFns, setUseDateFns] = useState(true);

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;
        setUseDateFns(newValue);
        initResult?.controls.setUseDateFns(newValue);
    };

    return (
        <header className="sc-toolbar-row">
            <label className="sc-switch">
                <input type="checkbox" checked={useDateFns} onChange={handleToggle} />
                Use "date-fns" formatting for X-Axis
            </label>
        </header>
    );
};
