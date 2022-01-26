import { chartBuilder } from "scichart/Builder/chartBuilder";
import { WaveAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import { TWebAssemblyChart } from "scichart/Charting/Visuals/SciChartSurface";
import { EAxisType } from "scichart/types/AxisType";
import { EChart2DModifierType } from "scichart/types/ChartModifierType";
import { ESeriesType } from "scichart/types/SeriesType";
import { EThemeProviderType } from "scichart/types/ThemeProviderType";
import { getChartBuilderData } from "../services/data.service";
import { colors } from "../utils/colors";
import { axisOptionsCommon, theme } from "../utils/theme";

export const builderChart = "builderChart";

export const drawChartBuilderExample = async () => {
    const { wasmContext, sciChartSurface } = (await chartBuilder.buildChart(builderChart, {
        surface: {
            theme: {
                type: EThemeProviderType.Light,
                ...theme
            }
        },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                ...axisOptionsCommon
            }
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                ...axisOptionsCommon
            }
        },
        series: [
            {
                type: ESeriesType.LineSeries,
                options: {
                    stroke: colors.primary,
                    animation: new WaveAnimation({
                        zeroLine: 0,
                        pointDurationFraction: 0.5,
                        duration: 2000,
                        fadeEffect: true,
                        delay: 1000
                    })
                },
                xyData: getChartBuilderData()[0]
            },
            {
                type: ESeriesType.LineSeries,
                options: {
                    stroke: colors.secondary,
                    animation: new WaveAnimation({
                        zeroLine: 0,
                        pointDurationFraction: 0.5,
                        duration: 2000,
                        fadeEffect: true
                    })
                },
                xyData: getChartBuilderData()[1]
            }
        ],
        modifiers: [
            {
                type: EChart2DModifierType.Rollover,
                options: {
                    rolloverLineStroke: colors.blueSchema[300]
                }
            },
            { type: EChart2DModifierType.ZoomPan }
        ]
    })) as TWebAssemblyChart;
    return sciChartSurface;
};
