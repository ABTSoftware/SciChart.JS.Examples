import * as React from "react";
import {EPieType, SciChartPieSurface} from "scichart/Charting/Visuals/SciChartPieSurface/SciChartPieSurface";
import {PieSegment} from "scichart/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment";
import {GradientParams} from "scichart/Core/GradientParams";
import {Point} from "scichart/Core/Point";
import classes from "../../../../Examples/Examples.module.scss";
import {appTheme} from "../../../theme";
import {ELegendOrientation, ELegendPlacement} from "scichart/Charting/Visuals/Legend/SciChartLegendBase";

export const divElementId1 = "chart1";

export const drawExample = async () => {

    // Create the pie chart
    const sciChartPieSurface = await SciChartPieSurface.create(divElementId1, {
        theme: appTheme.SciChartJsTheme,
        pieType: EPieType.Pie,
        animate: true,
        seriesSpacing: 15,
        showLegend: true,
        showLegendSeriesMarkers: true,
        animateLegend: true,
    });
    // Optional placement of legend
    sciChartPieSurface.legend.orientation = ELegendOrientation.Horizontal;
    sciChartPieSurface.legend.placement = ELegendPlacement.BottomLeft;

    // SciChart.js expects a list of PieSegment, however data is often formatted like this
    // Dataset = 'percentage market share of phones, 2022'
    const dataset = [
        { name: "Apple", percent: 28.41 },
        { name: "Samsung", percent: 28.21 },
        { name: "Xiaomi", percent: 12.73 },
        { name: "Huawei", percent: 5.27 },
        { name: "Oppo", percent: 5.53 },
        { name: "Vivo", percent: 4.31 },
        { name: "Realme", percent: 3.16 },
        { name: "Motorola", percent: 2.33 },
        { name: "Unknown", percent: 2.19 },
        { name: "LG", percent: 0.85 },
        { name: "OnePlus", percent: 1.11 },
        { name: "Tecno", percent: 1.09 },
        { name: "Infinix", percent: 0.96 },
        { name: "Google", percent: 0.77 },
        { name: "Nokia", percent: 0.45 },
    ];

    // Colors are just hex strings, supporting #FFFFFF (RBG) or 8-digit with RGBA or CSS color strings e.g. rgba()
    const colors = [
        appTheme.VividOrange,
        appTheme.Indigo,
        appTheme.MutedSkyBlue,
        appTheme.MutedTeal,
        appTheme.VividSkyBlue,
        appTheme.MutedRed,
        appTheme.MutedPink,
        appTheme.VividPink,
        appTheme.VividPurple,
        appTheme.MutedOrange,
        appTheme.VividOrange,
        appTheme.PaleTeal,
        appTheme.PaleBlue,
        appTheme.PaleOrange,
        appTheme.PalePink,
    ];

    // Optional Relative radius adjustment per segment
    const radiusSize = [
        0.8,0.8,0.8,0.8,0.85,0.85,0.85,0.9,0.9,0.9,0.95,0.95,0.95,0.95,0.95
    ];

    const toPieSegment = (name: string, value: number, color1: string, radiusAdjustment: number) => {
        return new PieSegment({
            value,
            text: name,
            labelStyle: { color: appTheme.ForegroundColor },
            radiusAdjustment,
            showLabel: value > 2,
            colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: color1, offset: 0 },
                { color: color1 + "77", offset: 1 }
            ]),
        });
    }

    // Transform the data to pie segment and add to scichart
    const pieSegments = dataset.map((row, index) => toPieSegment(row.name, row.percent, colors[index], radiusSize[index]));

    sciChartPieSurface.pieSegments.add(...pieSegments);

    return sciChartPieSurface;
};

export default function PieChart() {
    const [chart, setChart] = React.useState<SciChartPieSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setChart(res);
        })();
        // Deleting sciChartSurface to prevent memory leak
        return () => chart?.delete();
    }, []);

    return (
        <div className={classes.ChartWrapper}>
            <div id={divElementId1} style={{ width: "100%", height: "100%", float: "left" }}/>
            {/*Placeholder until we have a proper chart title (soon!)*/}
            <span style={{color: appTheme.ForegroundColor, fontSize: 20,
                position: "absolute", left: "50%", top: "20px", transform: "translate(-50%)"}}>
                Market share of Mobile Phone Manufacturers (2022)
            </span>
        </div>
    );
}
