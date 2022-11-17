import * as React from "react";
import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {chartBuilder} from "scichart/Builder/chartBuilder";
import classes from "../../../Examples/Examples.module.scss";
import {ESeriesType} from "scichart/types/SeriesType";
import {appTheme} from "../../theme";
import {EAxisType} from "scichart/types/AxisType";
import {EAnimationType} from "scichart/types/AnimationType";

const divElementId = "chart";
const drawExample = async () => {

    // Create a chart as simple as possible
    return await chartBuilder.build2DChart(divElementId, {
        surface: { theme: appTheme.SciChartJsTheme },
        // @ts-ignore
        xAxes: { type: EAxisType.NumericAxis, options: { growBy: { min: 0.1, max: 0.1 }}},
        // @ts-ignore
        yAxes: { type: EAxisType.NumericAxis, options: { growBy: { min: 0.1, max: 0.1 }}},
        series: {
            type: ESeriesType.SplineLineSeries,
            options: {
                strokeThickness: 5,
                interpolationPoints: 20,
                stroke: appTheme.VividTeal,
                animation: { type: EAnimationType.Sweep, options: { duration: 500 } } },
                xyData: { xValues: [1, 3, 4, 7, 9], yValues: [10, 6, 7, 2, 16],
            }
        }
    });
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function BuilderSimpleChart() {
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
