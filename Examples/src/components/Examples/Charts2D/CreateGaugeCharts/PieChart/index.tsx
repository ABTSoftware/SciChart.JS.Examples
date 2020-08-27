import * as React from "react";
import { EPieType, SciChartPieSurface } from "scichart/Charting/Visuals/SciChartPieSurface/SciChartPieSurface";
import { PieSegment } from "scichart/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";
import { ELegendOrientation, ELegendPlacement } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";

export const divElementId = "chart";

export const drawExample = async () => {
    const sciChartPieSurface = await SciChartPieSurface.create(divElementId);
    sciChartPieSurface.pieType = EPieType.Pie;
    sciChartPieSurface.holeRadius = 0.6;
    sciChartPieSurface.animate = true;
    sciChartPieSurface.legend.showLegend = true;
    sciChartPieSurface.legend.showCheckboxes = true;
    sciChartPieSurface.legend.animate = true;
    sciChartPieSurface.legend.placement = ELegendPlacement.TopRight;
    sciChartPieSurface.legend.orientation = ELegendOrientation.Vertical;
    const pieSegment1 = new PieSegment({
        color: "#228B22",
        value: 40,
        text: "Green",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#1D976C", offset: 0 },
            { color: "#93F9B9", offset: 1 },
        ]),
    });
    const pieSegment2 = new PieSegment({
        value: 10,
        text: "Red",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#DD5E89", offset: 0 },
            { color: "#F7BB97", offset: 1 },
        ]),
    });
    const pieSegment3 = new PieSegment({
        value: 20,
        text: "Blue",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#1FA2FF", offset: 0 },
            { color: "#12D8FA", offset: 0.5 },
            { color: "#A6FFCB", offset: 1 },
        ]),
    });
    const pieSegment4 = new PieSegment({
        value: 15,
        text: "Yellow",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#F09819", offset: 0 },
            { color: "#EDDE5D", offset: 1 },
        ]),
    });
    sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2, pieSegment3, pieSegment4);
    return sciChartPieSurface;
};

export default function PieChart() {
    React.useEffect(() => {
        drawExample();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}
