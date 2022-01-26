import { DataPointSelectionChangedArgs } from "scichart/Charting/ChartModifiers/DataPointSelectionChangedArgs";
import { DataPointSelectionModifier } from "scichart/Charting/ChartModifiers/DataPointSelectionModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { DataPointSelectionPaletteProvider } from "scichart/Charting/Model/DataPointSelectionPaletteProvider";
import { IPointMetadata } from "scichart/Charting/Model/IPointMetadata";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericTickProvider } from "scichart/Charting/Numerics/TickProviders/NumericTickProvider";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { TextLabelProvider } from "scichart/Charting/Visuals/Axis/LabelProvider/TextLabelProvider";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { SweepAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/SweepAnimation";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { GradientParams } from "scichart/Core/GradientParams";
import { NumberRange } from "scichart/Core/NumberRange";
import { Point } from "scichart/Core/Point";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { TSciChart } from "scichart/types/TSciChart";
import { colors } from "../utils/colors";
import { axisOptionsCommon, theme } from "../utils/theme";
import { MONTHS_LABELS } from "../services/data.service";

export const lineChart = "lineChart";

export const drawLineChartExample = async (handleSelection: Function) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(lineChart, { theme });

    const xAxis: CategoryAxis = new CategoryAxis(wasmContext, {
        ...axisOptionsCommon,
        labelProvider: new TextLabelProvider({
            labels: MONTHS_LABELS
        }),
        visibleRange: new NumberRange(0, 12)
    });
    xAxis.tickProvider = new CustomXAxisTickProvider(wasmContext);

    const yAxis: NumericAxis = new NumericAxis(wasmContext, {
        ...axisOptionsCommon,
        axisAlignment: EAxisAlignment.Left,
        visibleRange: new NumberRange(0, 100)
    });
    yAxis.tickProvider = new CustomYAxisTickProvider(wasmContext);

    sciChartSurface.yAxes.add(yAxis);
    sciChartSurface.xAxes.add(xAxis);

    const dataSeries = new XyDataSeries(wasmContext, { xValues: [0], yValues: [0] });

    sciChartSurface.renderableSeries.add(
        new FastMountainRenderableSeries(wasmContext, {
            dataSeries,
            stroke: colors.primary,
            strokeThickness: 3,
            zeroLineY: 0.0,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                strokeThickness: 2,
                stroke: colors.primary,
                fill: colors.secondary
            }),
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: colors.secondary, offset: 0 },
                { color: colors.transparent, offset: 0.5 }
            ]),
            animation: new SweepAnimation({ duration: 500 }),
            paletteProvider: new DataPointSelectionPaletteProvider({ fill: colors.dark, stroke: colors.text })
        })
    );

    sciChartSurface.chartModifiers.add(
        new DataPointSelectionModifier({
            allowDragSelect: false,
            onSelectionChanged: (args: DataPointSelectionChangedArgs) => handleSelection(args)
        })
    );

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());
    return { sciChartSurface, dataSeries };
};

class CustomXAxisTickProvider extends NumericTickProvider {
    constructor(wasmContext: TSciChart) {
        super(wasmContext);
    }
    getMajorTicks(minorDelta: number, majorDelta: number, visibleRange: NumberRange): number[] {
        const majorTicks: number[] = [];
        for (let i = 0; i < visibleRange.max; i++) {
            majorTicks.push(i);
        }
        return majorTicks;
    }
}

class CustomYAxisTickProvider extends NumericTickProvider {
    constructor(wasmContext: TSciChart) {
        super(wasmContext);
    }
    getMajorTicks(minorDelta: number, majorDelta: number, visibleRange: NumberRange): number[] {
        return [0, 25, 50, 75, 100];
    }
}

export class CategoryMetadata implements IPointMetadata {
    public static create(title: string, isSelected?: boolean) {
        const categoryMetaData = new CategoryMetadata();
        categoryMetaData.title = title;
        categoryMetaData.isSelected = isSelected ?? categoryMetaData.isSelected;
        return categoryMetaData;
    }

    public isSelected: boolean = false;
    public title: string;
    private constructor() {}
}
