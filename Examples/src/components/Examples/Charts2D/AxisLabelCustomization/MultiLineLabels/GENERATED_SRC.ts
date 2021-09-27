export const code = `import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { IStrokePaletteProvider, IFillPaletteProvider, EStrokePaletteMode, EFillPaletteMode } from "scichart/Charting/Model/IPaletteProvider";
import { IPointMetadata } from "scichart/Charting/Model/IPointMetadata";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { ELabelAlignment } from "scichart/Charting/Visuals/Axis/ELabelAlignment";
import { TextLabelProvider } from "scichart/Charting/Visuals/Axis/LabelProvider/TextLabelProvider";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { EAutoRange } from "scichart/types/AutoRange";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";

const divElementId = "chart";

// This PaletteProvider is used by all the Axis Label Customization examples
export class EmojiPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    private readonly pfYellow = parseColorToUIntArgb("FFCC4D");
    private readonly pfBlue = parseColorToUIntArgb("5DADEC");
    private readonly pfOrange = parseColorToUIntArgb("F58E01");
    private readonly pfRed = parseColorToUIntArgb("DE2A43");
    private readonly pfPink = parseColorToUIntArgb("FE7891");

    // tslint:disable-next-line:no-empty
    public onAttached(parentSeries: IRenderableSeries): void {}

    // tslint:disable-next-line:no-empty
    public onDetached(): void {}

    public overrideFillArgb(xValue: number, yValue: number, index: number): number {
        if (xValue === 1 || xValue === 5 || xValue === 9) {
            return this.pfYellow;
        } else if (xValue === 2 || xValue === 8) {
            return this.pfBlue;
        } else if (xValue === 3 || xValue === 6) {
            return this.pfOrange;
        } else if (xValue === 4 || xValue === 7) {
            return this.pfRed;
        } else if (xValue === 10) {
            return this.pfPink;
        } else {
            return undefined;
        }
    }

    public overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        return undefined;
    }
}

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    // sciChartSurface.debugRendering = true;
    const xAxis = new CategoryAxis(wasmContext);
    const labelProvider = new TextLabelProvider({
        labels: [
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
        ],
        maxLength: 10
    });
    xAxis.labelProvider = labelProvider;
    xAxis.labelStyle.alignment = ELabelAlignment.Center;

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Always });
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

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function MultiLineLabels() {
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
`;