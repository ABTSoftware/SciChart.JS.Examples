import { useState } from "react";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

export default function DynamicLayout() {
    const [initResult, setInitResult] = useState<TResolvedReturnType<typeof drawExample>>();
    const [isGrid, setIsGrid] = useState<boolean>(false);

    const handleToggleButtonChanged = (value: boolean) => {
        initResult.setIsGridLayoutMode(value);
        setIsGrid(value);
    };
    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Chart layout">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={isGrid === false}
                        disabled={!initResult}
                        onClick={() => handleToggleButtonChanged(false)}
                    >
                        Single Chart
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={isGrid === true}
                        disabled={!initResult}
                        onClick={() => handleToggleButtonChanged(true)}
                    >
                        Chart Per Series
                    </button>
                </div>
            </header>
            <SciChartReact initChart={drawExample} onInit={setInitResult} />
        </div>
    );
};
