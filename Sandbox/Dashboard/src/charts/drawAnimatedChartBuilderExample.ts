import { chartBuilder } from "scichart/Builder/chartBuilder";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { ScatterAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/ScatterAnimation";
import { TWebAssemblyChart } from "scichart/Charting/Visuals/SciChartSurface";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAxisType } from "scichart/types/AxisType";
import { EChart2DModifierType } from "scichart/types/ChartModifierType";
import { ESeriesType } from "scichart/types/SeriesType";
import { EThemeProviderType } from "scichart/types/ThemeProviderType";
import { getAnimatedChartBuilderData } from "../services/data.service";
import { colors } from "../utils/colors";
import { axisOptionsCommon, theme } from "../utils/theme";

export const animatedChartBuilder = "animatedChartBuilder";

export const drawAnimatedChartBuilderExample = async () => {
    const { wasmContext, sciChartSurface } = (await chartBuilder.build2DChart(animatedChartBuilder, {
        surface: {
            theme: {
                type: EThemeProviderType.Light,
                ...theme
            }
        },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                ...axisOptionsCommon,
                visibleRange: new NumberRange(-0.5, 5.5)
            }
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                ...axisOptionsCommon,
                visibleRange: new NumberRange(-0.5, 5.5)
            }
        },
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

    const seriesArray = await chartBuilder.buildSeries(
        wasmContext,
        getAnimatedChartBuilderData(false).map(data => ({
            type: ESeriesType.ScatterSeries,
            options: {
                pointMarker: new EllipsePointMarker(wasmContext, {
                    width: 10,
                    height: 10,
                    fill: data.fill,
                    stroke: colors.blueSchema[100],
                    strokeThickness: 2
                })
            },
            xyData: data
        }))
    );

    sciChartSurface.renderableSeries.add(...seriesArray);

    const animateData = () => {
        getAnimatedChartBuilderData(true).forEach((data, index) => {
            seriesArray[index].runAnimation(
                new ScatterAnimation({
                    duration: 1000,
                    ease: easing.outQuad,
                    dataSeries: new XyDataSeries(wasmContext, data)
                })
            );
        });

        setTimeout(animateData, 1000);
    };

    animateData();

    return sciChartSurface;
};
