import * as React from "react";
import { useContext } from "react";
import { SciChartReact, SciChartSurfaceContext, TResolvedReturnType } from "scichart-react";
import { appTheme } from "../../../theme";
import { drawExample } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function DynamicLayout() {
    return (
        <SciChartReact className="sc-chart-wrapper" initChart={drawExample}>
            <ChartToolbar />
        </SciChartReact>
    );
}

const ChartToolbar = () => {
    const initResult = useContext(SciChartSurfaceContext) as TResolvedReturnType<typeof drawExample>;
    const [isGrid, setIsGrid] = React.useState<boolean>(false);

    const handleToggleButtonChanged = (event: any, value: boolean) => {
        initResult.setIsGridLayoutMode(value);
        setIsGrid(value);
    };
    return (
        <header
            className="sc-toolbar-row"
            style={{ order: -1 }} // to show the toolbar above the chart, not below it
        >
            <div className="sc-button-group" role="group" aria-label="Chart layout">
                <button
                    type="button"
                    className="sc-button"
                    aria-pressed={isGrid === false}
                    onClick={(event) => handleToggleButtonChanged(event, false)}
                >
                    Single Chart
                </button>
                <button
                    type="button"
                    className="sc-button"
                    aria-pressed={isGrid === true}
                    onClick={(event) => handleToggleButtonChanged(event, true)}
                >
                    Chart Per Series
                </button>
            </div>
        </header>
    );
};
