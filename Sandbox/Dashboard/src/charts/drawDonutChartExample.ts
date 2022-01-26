import { PieSegment } from "scichart/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment";
import {
    EPieType,
    SciChartPieSurface
} from "scichart/Charting/Visuals/SciChartPieSurface/SciChartPieSurface";
import { getDonutChartData } from "../services/data.service";
import { theme } from "../utils/theme";

export const donutChart = "donutChart";

export const drawDonutChartExample = async () => {
    const sciChartPieSurface = await SciChartPieSurface.create(donutChart, { theme });

    sciChartPieSurface.pieType = EPieType.Donut;
    sciChartPieSurface.holeRadius = 0.4;
    sciChartPieSurface.animate = true;
    sciChartPieSurface.legend.showLegend = false;

    getDonutChartData().forEach(data => sciChartPieSurface.pieSegments.add(new PieSegment(data)));

    return sciChartPieSurface;
};
