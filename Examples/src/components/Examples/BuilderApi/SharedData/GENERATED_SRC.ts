export const code = `import * as React from "react";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { chartBuilder } from "scichart/Builder/chartBuilder";
import classes from "../../../Examples/Examples.module.scss";
import { ButtonGroup, Button, TextField } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { ESeriesType } from "scichart/types/SeriesType";
import { EAxisType } from "scichart/types/AxisType";
import { ELabelProviderType } from "scichart/types/LabelProviderType";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: "dark", lineSeriesColor: "blue" } },
        series: [
            { type: ESeriesType.ColumnSeries, xyData: { xDataId: "x", yDataId: "col" } },
            { type: ESeriesType.LineSeries, xyData: { xDataId: "x", yDataId: "line" } },
            { type: ESeriesType.SplineBandSeries, xyyData: { xDataId: "x", yDataId: "col", y1DataId: "line" } }
        ],
        sharedData: { x: [1, 3, 4, 5, 6], col: [8, 2, 3, 7, 10], line: [10, 6, 7, 2, 16] }
    });

    return { sciChartSurface, wasmContext };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function BuilderSharedData() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Deleting sciChartSurface to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return (
        <>
            <div className={classes.ChartWrapper}>
                <div id={divElementId} />
            </div>
        </>
    );
}
`;