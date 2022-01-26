import { PieSegment } from "scichart/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment";
import {
    EPieType,
    SciChartPieSurface
} from "scichart/Charting/Visuals/SciChartPieSurface/SciChartPieSurface";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";
import { getPieChartData } from "../services/data.service";
import { colors } from "../utils/colors";
import { theme } from "../utils/theme";

export const pieChart = "pieChart";

export const drawPieChartExample = async () => {
    const sciChartPieSurface = await SciChartPieSurface.create(pieChart, { theme });
    sciChartPieSurface.pieType = EPieType.Pie;
    sciChartPieSurface.holeRadius = 1;
    sciChartPieSurface.animate = true;
    sciChartPieSurface.legend.showLegend = false;

    const colorLinearGradientsList: GradientParams[] = generateGradientsList();

    getPieChartData().forEach(({ value, text }, index: number) => {
        sciChartPieSurface.pieSegments.add(
            new PieSegment({
                value,
                text,
                colorLinearGradient: colorLinearGradientsList[index]
            })
        );
    });
    return sciChartPieSurface;
};

const generateGradientsList = (): GradientParams[] => {
    return [
        new GradientParams(new Point(1, 0), new Point(0.5, 1), [
            { color: colors.primary, offset: 0 },
            { color: colors.primaryLight, offset: 1 }
        ]),
        new GradientParams(new Point(1, 1), new Point(0, 0.9), [
            { color: colors.primary, offset: 0 },
            { color: colors.primaryLight, offset: 0.9 }
        ]),
        new GradientParams(new Point(0.5, 1), new Point(1, 0), [
            { color: colors.primary, offset: 0 },
            { color: colors.primaryLight, offset: 0.75 }
        ]),
        new GradientParams(new Point(0, 0), new Point(1, 0), [
            { color: colors.primary, offset: 0 },
            { color: colors.primaryLight, offset: 0.8 }
        ]),
        new GradientParams(new Point(0, 0), new Point(0.6, 1), [
            { color: colors.primary, offset: 0 },
            { color: colors.primaryLight, offset: 1 }
        ])
    ];
};
