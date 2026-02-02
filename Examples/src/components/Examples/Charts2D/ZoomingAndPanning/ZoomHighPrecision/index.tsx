import * as React from "react";
import { MenuItem, Select, FormControlLabel, Switch } from "@mui/material";
import { useContext } from "react";
import { SciChartReact, SciChartSurfaceContext, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";

export default function HighPrecisionDatasets() {
    return (
        <SciChartReact className={commonClasses.ChartWithNestedToolbar} initChart={drawExample}>
            <ChartHeader />
        </SciChartReact>
    );
}

const ChartHeader = () => {
    const initResult = useContext(SciChartSurfaceContext) as TResolvedReturnType<typeof drawExample>;
    const [dataset, setDataset] = React.useState("nanosecondPrecision");
    const [isZoomInActive, setIsZoomInActive] = React.useState(false);

    const handleDatasetChange = (event: any) => {
        const value = event.target.value;
        setDataset(value);
        initResult?.controls.setDataset(value);
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
        <div className={commonClasses.ToolbarRow} style={{ order: 1, gap: 12, padding: 12, alignItems: "center" }}>
            <Select
                size="small"
                value={dataset}
                onChange={handleDatasetChange}
                sx={{
                    color: "white",
                    minWidth: 260,
                    ".MuiSvgIcon-root": {
                        color: "white",
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                    },
                }}
            >
                <MenuItem value="secondPrecision">Precision: 1 Second / Range: 1 BILLION Years</MenuItem>
                <MenuItem value="millisecondPrecision">Precision: 1 Millisecond / Range: 70000 Years</MenuItem>
                <MenuItem value="microsecondPrecision">Precision: 1 Microsecond / Range: 40 Years</MenuItem>
                <MenuItem value="nanosecondPrecision">Precision: 1 Nanosecond / Range: 50 Days</MenuItem>
            </Select>

            <FormControlLabel
                control={<Switch checked={isZoomInActive} onChange={handleZoomToggle} />}
                label="Precise Zoom In"
            />
        </div>
    );
};
