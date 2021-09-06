export const code = `import * as React from "react";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { chartBuilder } from "scichart/Builder/chartBuilder";
import classes from "../../../Examples/Examples.module.scss";
import { ButtonGroup, Button, TextField } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { ESeriesType } from "scichart/types/SeriesType";
import { EAxisType } from "scichart/types/AxisType";
import { ELabelProviderType } from "scichart/types/LabelProviderType";
import { NumberRange } from "../../../../../../../SciChart.Dev/Web/src/SciChart/lib/Core/NumberRange";

const divElementId = "chart";

const drawExample = async () => {
    // Create a chart as simple as possible
    return await chartBuilder.build2DChart(divElementId, {
        xAxes: [{ type: EAxisType.NumericAxis, options: {visibleRange: new NumberRange(0, 20)} }],
        series: { type: ESeriesType.LineSeries, xyData: { xValues: [1, 3, 4, 7, 9], yValues: [10, 6, 7, 2, 16] } }
    });
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function BuilderFullChart() {
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