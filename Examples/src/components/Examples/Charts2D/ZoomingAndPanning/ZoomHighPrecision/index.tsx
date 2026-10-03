import * as React from "react";
import { useContext } from "react";
import { SciChartReact, SciChartSurfaceContext, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import type { TDatasetId } from "./createDatasets";

export default function HighPrecisionDatasets() {
    return (
        <SciChartReact className="sc-chart-wrapper" initChart={drawExample}>
            <ChartHeader />
        </SciChartReact>
    );
}

const ChartHeader = () => {
    const initResult = useContext(SciChartSurfaceContext) as TResolvedReturnType<typeof drawExample>;
    const [dataset, setDataset] = React.useState("nanosecondPrecision");
    const [isZoomInActive, setIsZoomInActive] = React.useState(false);

    const handleDatasetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as TDatasetId;
        setDataset(value);
        initResult?.controls.useDataset(value);
        setIsZoomInActive(false);
    };

    const handleZoomToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setIsZoomInActive(isChecked);

        if (isChecked) {
            initResult?.controls.zoomInPrecise();
        } else {
            initResult?.controls.zoomOut();
        }
    };

    return (
        <header className="sc-toolbar-row">
            <label className="sc-control" htmlFor="precision-dataset">
                Dataset
                <select
                    className="sc-select"
                    id="precision-dataset"
                    value={dataset}
                    onChange={handleDatasetChange}
                >
                    <option value="secondPrecision">Precision: 1 Second / Range: 1 BILLION Years</option>
                    <option value="millisecondPrecision">Precision: 1 Millisecond / Range: 70000 Years</option>
                    <option value="microsecondPrecision">Precision: 1 Microsecond / Range: 40 Years</option>
                    <option value="nanosecondPrecision">Precision: 1 Nanosecond / Range: 50 Days</option>
                </select>
            </label>

            <label className="sc-switch">
                <input type="checkbox" checked={isZoomInActive} onChange={handleZoomToggle} />
                Precise Zoom In
            </label>
        </header>
    );
};
