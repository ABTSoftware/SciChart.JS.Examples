import * as React from "react";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { AxisBase2D, IndexAxis, LogarithmicAxis, NumericAxis, SciChartSurface, CategoryAxis } from "scichart";
import { drawExample } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function LogarithmicAxisExample() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>(undefined);
    const [linearXAxis, setLinearXAxis] = React.useState<NumericAxis>();
    const [linearYAxis, setLinearYAxis] = React.useState<NumericAxis>();
    const [indexXAxsis, setIndexXAxis] = React.useState<IndexAxis>();
    const [categoryXAxis, setCategoryXAxis] = React.useState<CategoryAxis>();
    const [preset, setPreset] = React.useState<number>(0);

    const handleToggleButtonChanged = (event: any, state: number) => {
        const sciChartSurface = sciChartSurfaceRef.current;

        const toggleAxis = (axis: AxisBase2D, isEnabled: boolean) => {
            axis.isVisible = isEnabled; // toggle this axis as visible/invisible
            axis.isPrimaryAxis = isEnabled; // Only the primary axis shows gridlines
        };

        setPreset(state);
        switch (state) {
            case 0:
                console.log(`Index Axis`);
                toggleAxis(indexXAxsis, true);
                toggleAxis(linearXAxis, false);
                toggleAxis(categoryXAxis, false);
                toggleAxis(linearYAxis, true);
                sciChartSurface.title = "Index X Axis";
                break;
            case 1:
                console.log(`Linear X Axis`);
                toggleAxis(indexXAxsis, false);
                toggleAxis(linearXAxis, true);
                toggleAxis(categoryXAxis, false);
                toggleAxis(linearYAxis, true);
                sciChartSurface.title = "Linear X Axis";
                break;
            case 2:
                console.log(`Category X Axis`);
                toggleAxis(indexXAxsis, false);
                toggleAxis(linearXAxis, false);
                toggleAxis(categoryXAxis, true);
                toggleAxis(linearYAxis, true);
                sciChartSurface.title = "Category X Axis";
                break;
        }

        const activeXAxisId = indexXAxsis.isVisible
            ? indexXAxsis.id
            : linearXAxis.isVisible
            ? linearXAxis.id
            : categoryXAxis.id;
        const activeYAxisId = linearYAxis.id;

        // After switching visibility of axis - we need to set the X/Y AxisId on series
        sciChartSurface.renderableSeries.asArray().forEach((rs) => {
            rs.xAxisId = activeXAxisId;
            rs.yAxisId = activeYAxisId;
        });

        // Also update annotations to use the correct axis IDs
        sciChartSurface.annotations.asArray().forEach((annotation) => {
            annotation.xAxisId = activeXAxisId;
            annotation.yAxisId = activeYAxisId;
        });

        setTimeout(() => {
            // // Force a complete redraw
            // sciChartSurface.invalidateElement();
            // // Zoom to fit
            sciChartSurface.zoomExtents();
        }, 100);
    };

    return (
        <div className={commonClasses.ChartWithToolbar}>
            <div className={commonClasses.ToolbarRow}>
                <ToggleButtonGroup
                    className={commonClasses.ToggleButtonGroup}
                    exclusive
                    value={preset}
                    onChange={handleToggleButtonChanged}
                    size="medium"
                    color="primary"
                    aria-label="small outlined button group"
                >
                    <ToggleButton value={0} style={{ color: appTheme.ForegroundColor }}>
                        Index X Axis
                    </ToggleButton>
                    <ToggleButton value={1} style={{ color: appTheme.ForegroundColor }}>
                        Linear X Axis
                    </ToggleButton>
                    <ToggleButton value={2} style={{ color: appTheme.ForegroundColor }}>
                        Category X Axis
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <SciChartReact
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    const { sciChartSurface } = initResult;
                    sciChartSurfaceRef.current = sciChartSurface;
                    setIndexXAxis(initResult.xAxisIndex);
                    setLinearXAxis(initResult.xAxisLinear);
                    setLinearYAxis(initResult.yAxisLinear);
                    setCategoryXAxis(initResult.xAxisCategory);
                }}
            />
        </div>
    );
}
