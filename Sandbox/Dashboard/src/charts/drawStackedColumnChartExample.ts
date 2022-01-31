import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { TTextStyle } from "scichart/Charting/Visuals/Axis/AxisCore";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { StackedColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import {
    TextureManager,
    TTextureObject
} from "scichart/Charting/Visuals/TextureManager/TextureManager";
import { NumberRange } from "scichart/Core/NumberRange";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { createImagesArrayAsync } from "scichart/utils/imageUtil";

import { colors } from "../utils/colors";
import { ICONS, IIcon } from "../utils/icons";
import { axisOptionsCommon, theme } from "../utils/theme";
import { DpiHelper } from "scichart/Charting/Visuals/TextureManager/DpiHelper";
import { HitTestInfo } from "scichart/Charting/Visuals/RenderableSeries/HitTest/HitTestInfo";
import { getStackedColumnData } from "../services/data.service";

export const stackedColumnChart = "stackedColumnChart";

const { xValues, income, taxes } = getStackedColumnData();

export const drawStackedColumnChartExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(stackedColumnChart, { theme });

    const icons = await createImagesArrayAsync(ICONS.map((iconObj: IIcon) => iconObj.image));

    const xAxis: NumericAxis = new NumericAxis(wasmContext, {
        ...axisOptionsCommon,
        growBy: new NumberRange(0, 1),
        visibleRange: new NumberRange(-2, ICONS.length + 1)
    });

    xAxis.labelProvider.precision = 0;
    xAxis.labelProvider.numericFormat = ENumericFormat.NoFormat;
    xAxis.labelProvider.getLabelTexture = (
        labelText: string,
        textureManager: TextureManager,
        labelStyle: TTextStyle
    ): TTextureObject => {
        const index = parseInt(labelText);
        if (!isNaN(index)) {
            const icon = icons[index];
            if (icon) {
                return textureManager.createTextureFromImage(icon, ICONS[index].width, ICONS[index].height);
            }
        }
        return textureManager.createTextTexture([""], labelStyle);
    };

    const yAxis: NumericAxis = new NumericAxis(wasmContext, {
        ...axisOptionsCommon,
        drawMajorGridLines: true,
        growBy: new NumberRange(0, 0.1),
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 0,
        labelPrefix: "$",
        labelPostfix: " M"
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const incomeDataSeries = new XyDataSeries(wasmContext, { xValues, yValues: income, dataSeriesName: "Income" });
    const taxesDataSeries = new XyDataSeries(wasmContext, { xValues, yValues: taxes, dataSeriesName: "Taxes" });

    const rendSeries1 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries1.fill = colors.primary;
    rendSeries1.stroke = colors.text;
    rendSeries1.strokeThickness = 1;
    rendSeries1.dataSeries = incomeDataSeries;
    rendSeries1.stackedGroupId = "income";

    const rendSeries2 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries2.fill = colors.secondary;
    rendSeries2.stroke = colors.text;
    rendSeries2.strokeThickness = 1;
    rendSeries2.dataSeries = taxesDataSeries;
    rendSeries2.stackedGroupId = "taxes";

    sciChartSurface.renderableSeries.add(rendSeries1, rendSeries2);
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    sciChartSurface.chartModifiers.add(new RolloverModifier({ rolloverLineStroke: colors.blueSchema[300] }));
    sciChartSurface.domCanvas2D.addEventListener("mousedown", (mouseEvent: MouseEvent) => {
        const mouseClickX = mouseEvent.offsetX;
        const mouseClickY = mouseEvent.offsetY;
        console.log(mouseClickX, mouseClickY);
        const premultipliedX = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
        const premultipliedY = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;

        rendSeries1.stroke = colors.text;
        rendSeries1.strokeThickness = 1;
        rendSeries2.stroke = colors.text;
        rendSeries2.strokeThickness = 1;

        let hitTestResult: HitTestInfo = rendSeries1.hitTestProvider.hitTest(premultipliedX, premultipliedY);
        if (!hitTestResult.isHit) {
            hitTestResult = rendSeries2.hitTestProvider.hitTest(premultipliedX, premultipliedY);
        }
        if (hitTestResult.isHit) {
            hitTestResult.associatedSeries.stroke = colors.green;
            hitTestResult.associatedSeries.strokeThickness = 2;
        }
        console.log("hitTestResult: ", hitTestResult);
    });
    return sciChartSurface;
};
