import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { TTextStyle } from "scichart/Charting/Visuals/Axis/AxisCore";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { ELabelAlignment } from "scichart/Charting/Visuals/Axis/ELabelAlignment";
import { LabelProviderBase2D } from "scichart/Charting/Visuals/Axis/LabelProvider/LabelProviderBase2D";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { DpiHelper } from "scichart/Charting/Visuals/TextureManager/DpiHelper";
import { measureTextWidth, TextureManager } from "scichart/Charting/Visuals/TextureManager/TextureManager";
import { Thickness } from "scichart/Core/Thickness";
import { EAutoRange } from "scichart/types/AutoRange";
import { ELabelProviderType } from "scichart/types/LabelProviderType";
import { getFontString } from "scichart/utils/font";
import classes from "../../../Examples.module.scss";
import { EmojiPaletteProvider } from "../MultiLineLabels";

const divElementId = "chart";

class RotatedTextLabelProvider extends LabelProviderBase2D {
    public readonly type = ELabelProviderType.Text;
    public labels: string[];
    public rotation: number;

    constructor() {
        super();
        this.formatLabel = (dataValue: number) => this.labels[dataValue] ?? "";
        this.formatCursorLabel = (dataValue: number) => this.labels[dataValue] ?? "";
    }

    public onBeginAxisDraw(): void {}

    public getLabels(majorTicks: number[]): string[] {
        return majorTicks.map(tick => this.formatLabel(tick));
    }

    public getLabelHeight(ctx: CanvasRenderingContext2D, labelText: string, labelStyle: TTextStyle): number {
        const { fontFamily, fontSize, fontWeight, fontStyle, color, padding } = labelStyle;
        ctx.font = getFontString(fontStyle, fontWeight, fontSize, fontFamily);
        const width = measureTextWidth(ctx, labelText) + padding?.left + padding?.right;
        return width * Math.abs(Math.sin((this.rotation * Math.PI) / 180));
    }

    public getLabelWidth(ctx: CanvasRenderingContext2D, labelText: string, labelStyle?: TTextStyle): number {
        return 14;
    }

    public getMaxLabelHeightForHorizontalAxis(
        majorTickLabels: string[],
        ctx: CanvasRenderingContext2D,
        labelStyle: TTextStyle
    ): number {
        let longestString = 0;
        for (const label of majorTickLabels) {
            const height = this.getLabelHeight(ctx, label, labelStyle);
            if (height > longestString) {
                longestString = height;
            }
        }

        return longestString;
    }

    public getLabelTexture(
        labelText: string,
        textureManager: TextureManager,
        labelStyle: TTextStyle,
        width?: number,
        height?: number
    ) {
        return textureManager.createTextTexture([labelText], labelStyle, this.rotation);
    }
}

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new CategoryAxis(wasmContext);
    const labelProvider = new RotatedTextLabelProvider();
    labelProvider.labels = [
        "Face with Tears of Joy",
        "Loudly Crying Face",
        "Pleading Face",
        "Red Heart",
        "Rolling on the Floor Laughing",
        "Sparkles",
        "Smiling Face with Heart-Eyes",
        "Folded Hands",
        "Smiling Face with Hearts",
        "Smiling Face with Smiling Eyes"
    ];
    labelProvider.rotation = 30;
    xAxis.labelProvider = labelProvider;

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Always });
    // if we specify getTitleTexture, we just need to set any value here, it could be just yAxis.axisTitle = "a";
    yAxis.axisTitle = "Number of tweets that contained at least one emoji per ten thousand tweets";
    yAxis.axisTitleStyle.fontSize = 14;
    yAxis.axisTitleStyle.alignment = ELabelAlignment.Center;
    yAxis.axisTitleRenderer.measure = (textStyle: TTextStyle, isHorizontal: boolean) => {
        // Hardcode this for now
        yAxis.axisTitleRenderer.desiredWidth = 34 * DpiHelper.PIXEL_RATIO;
    };

    yAxis.axisTitleRenderer.getTitleTexture = (text: string, textStyle: TTextStyle, textureManager: TextureManager) => {
        return textureManager.createTextTexture(
            ["Number of tweets that contained", "at least one emoji per ten thousand tweets"],
            { ...textStyle, padding: new Thickness(0, 0, 0, 0) }
        );
    };

    sciChartSurface.yAxes.add(yAxis);

    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        strokeThickness: 0,
        dataPointWidth: 0.5,
        paletteProvider: new EmojiPaletteProvider(),
        opacity: 0.7
    });
    sciChartSurface.renderableSeries.add(columnSeries);

    const dataSeries = new XyDataSeries(wasmContext);
    dataSeries.appendRange([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [220, 170, 105, 85, 80, 75, 60, 50, 45, 45]);
    columnSeries.dataSeries = dataSeries;

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function RotatedLabels() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
