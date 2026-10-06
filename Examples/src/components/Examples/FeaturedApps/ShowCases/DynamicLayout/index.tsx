import { useContext, useState } from "react";
import { SciChartReact, SciChartSurfaceContext, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

export default function DynamicLayout() {
    return (
        <SciChartReact className="sc-chart-wrapper" initChart={drawExample}>
            <ChartToolbar />
        </SciChartReact>
    );
}

const ChartToolbar = () => {
    const initResult = useContext(SciChartSurfaceContext) as TResolvedReturnType<typeof drawExample>;
    const [isGrid, setIsGrid] = useState<boolean>(false);

    const handleToggleButtonChanged = (value: boolean) => {
        initResult.setIsGridLayoutMode(value);
        setIsGrid(value);
    };
    return (
        <header className="sc-toolbar-row">
            <div className="sc-button-group" role="group" aria-label="Chart layout">
                <button
                    type="button"
                    className="sc-button"
                    aria-pressed={isGrid === false}
                    onClick={() => handleToggleButtonChanged(false)}
                >
                    Single Chart
                </button>
                <button
                    type="button"
                    className="sc-button"
                    aria-pressed={isGrid === true}
                    onClick={() => handleToggleButtonChanged(true)}
                >
                    Chart Per Series
                </button>
            </div>
        </header>
    );
};
