import * as React from "react";
import {EPieType, SciChartPieSurface} from "scichart/Charting/Visuals/SciChartPieSurface/SciChartPieSurface";
import {PieSegment} from "scichart/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment";
import {GradientParams} from "scichart/Core/GradientParams";
import {Point} from "scichart/Core/Point";
import classes from "../../../../Examples/Examples.module.scss";
import {makeStyles} from "@material-ui/core/styles";
import {appTheme} from "../../../theme";

export const divElementId1 = "chart1";
export const divElementId2 = "chart2";
export const divElementId3 = "chart3";
export const divElementId4 = "chart4";

export const drawExample = async () => {

    // Helper function to create a gradient for pie segments
    const createGradient = (color1: string, color2: string) => {
        return new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: color1, offset: 0 },
            { color: color2, offset: 1 }
        ]);
    };

    const justPieChart = async () => {
        const sciChartPieSurface = await SciChartPieSurface.create(divElementId1, {
            theme: appTheme.SciChartJsTheme,
            pieType: EPieType.Pie,
            animate: true,
            showLegend: true,
            showLegendCheckBoxes: false,
            animateLegend: true,
        });

        sciChartPieSurface.pieSegments.add(
            new PieSegment({ value: 10, text: "Blue", colorLinearGradient: createGradient(appTheme.VividSkyBlue,appTheme.VividTeal)}),
            new PieSegment({ value: 10, text: "Red", colorLinearGradient: createGradient(appTheme.VividPink,appTheme.VividPurple)}),
            new  PieSegment({ value: 10, text: "Blue", colorLinearGradient: createGradient(appTheme.VividOrange,appTheme.MutedOrange)}),
            new PieSegment({ value: 10, text: "Orange", colorLinearGradient: createGradient(appTheme.VividGreen,appTheme.VividSkyBlue)})
            // newSegment(10, appTheme.VividSkyBlue,appTheme.VividTeal, "Blue"),
            // newSegment(10, "#DD5E89","#F7BB97", "Red"),
            // newSegment(10, "#1FA2FF","#A6FFCB", "Blue"),
            // newSegment(10, "#F09819","#EDDE5D", "Orange"),
        );
        return sciChartPieSurface;
    };

    const variableRadiusPie = async () => {
        const sciChartPieSurface = await SciChartPieSurface.create(divElementId2, {
            theme: appTheme.SciChartJsTheme,
            pieType: EPieType.Pie,
            animate: false,
            showLegend: false,
        });

        const newSegmentWithRadius = (value: number, color1: string, color2: string, segmentName: string, radiusAdjustment: number) => {
            return new PieSegment({
                value,
                text: segmentName,
                radiusAdjustment,
                colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                    { color: color1, offset: 0 },
                    { color: color2, offset: 1 }
                ])
            });
        }

        sciChartPieSurface.pieSegments.add(
            newSegmentWithRadius(40, "#1D976C","#93F9B9", "Green", 1),
            newSegmentWithRadius(10, "#DD5E89","#F7BB97", "Red", 1.1),
            newSegmentWithRadius(20, "#1FA2FF","#A6FFCB", "Blue", 1.2),
            newSegmentWithRadius(15, "#F09819","#EDDE5D", "Orange", 1.3),
        );
        return sciChartPieSurface;
    };

    const dynamicPie = async () => {
        const sciChartPieSurface = await SciChartPieSurface.create(divElementId3, {
            theme: appTheme.SciChartJsTheme,
            pieType: EPieType.Pie,
            animate: false,
            showLegend: false,
        });

        const newSegment = (value: number, color1: string, color2: string, segmentName: string) => {
            return new PieSegment({
                value,
                text: segmentName,
                colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                    { color: color1, offset: 0 },
                    { color: color2, offset: 1 }
                ])
            });
        }

        sciChartPieSurface.pieSegments.add(
            newSegment(50, "#1D976C","#93F9B9", "Green"),
            newSegment(50, "#DD5E89","#F7BB97", "Red"),
        );

        // const updateChart = () => {
        //     pieSegment1.value = value;
        //     pieSegment2.value = 100 - value;
        //     setTimeout(updateChart, 1000);
        // };
        // updateChart();

        return sciChartPieSurface;
    };

    const legendPie = async () => {

    };


    const charts = await Promise.all([justPieChart(), variableRadiusPie(), dynamicPie()
        // legendPie(), dynamicPie(),
    ]);
    return { charts };
};

// Styles for the 2x2 grid
const useStyles = makeStyles(theme => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: appTheme.DarkIndigo,
    },
    flexContainerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignContent: "stretch",
        margin: 10,
        height: "50%",
        width: "calc(100% - 10)",
        // background: "#00ff0033",
    },
    item: {
        height: "100%",
        width: "49%",
        // background: "#FF000033",
    }
}));

export default function PieChart() {
    const [charts, setCharts] = React.useState<SciChartPieSurface[]>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setCharts(res.charts);
        })();
        // Deleting sciChartSurface to prevent memory leak
        return () => charts?.forEach(chart => chart?.delete());
    }, []);

    const localClasses = useStyles();

    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <div className={localClasses.flexContainerRow}>
                    <div id={divElementId1} className={localClasses.item}/>
                    <div id={divElementId2} className={localClasses.item}/>
                </div>
                <div className={localClasses.flexContainerRow}>
                    <div id={divElementId3} className={localClasses.item}/>
                    <div id={divElementId4} className={localClasses.item}/>
                </div>
            </div>
        </div>
    );
}
