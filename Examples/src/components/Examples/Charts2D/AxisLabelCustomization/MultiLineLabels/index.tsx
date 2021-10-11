import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { EFillPaletteMode, EStrokePaletteMode, IFillPaletteProvider, IStrokePaletteProvider } from "scichart/Charting/Model/IPaletteProvider";
import { IPointMetadata } from "scichart/Charting/Model/IPointMetadata";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { TextLabelProvider } from "scichart/Charting/Visuals/Axis/LabelProvider/TextLabelProvider";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { Thickness } from "scichart/Core/Thickness";
import { EAutoRange } from "scichart/types/AutoRange";
import { ELabelAlignment } from "scichart/types/LabelAlignment";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import classes from "../../../Examples.module.scss";

const divElementId = "chart";

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
        maxLength: 9
    });
    xAxis.labelProvider = labelProvider;
    xAxis.labelStyle.alignment = ELabelAlignment.Center;
    xAxis.labelStyle.padding = new Thickness(2,1,2,1);
    // Allow rotated labels to overlap
    xAxis.axisRenderer.hideOverlappingLabels = false;
    // Keep first and last labels aligned to their ticks
    xAxis.axisRenderer.keepLabelsWithinAxis = false;

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Always });
    // Pass array to axisTitle to make it multiline
    yAxis.axisTitle = ["Number of tweets that contained", "at least one emoji per ten thousand tweets"];
    yAxis.axisTitleStyle.fontSize = 14;
    
    sciChartSurface.yAxes.add(yAxis);

    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        strokeThickness: 0,
        dataPointWidth: 0.5,
        paletteProvider: new EmojiPaletteProvider(),
        opacity: 0.7
    });
    sciChartSurface.renderableSeries.add(columnSeries);

    const dataSeries = new XyDataSeries(wasmContext);
    dataSeries.appendRange([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [220, 170, 105, 85, 80, 75, 60, 50, 45, 45]);
    columnSeries.dataSeries = dataSeries;

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext, labelProvider };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function MultiLineLabels() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [labelProvider, setLabelProvider] = React.useState<TextLabelProvider>();
    const [preset, setPreset] = React.useState<number>(0);

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
            setLabelProvider(res.labelProvider);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const handlePreset = (event: any, value: number) => {
        setPreset(value);
        switch (value) {
            case 0:
                labelProvider.rotation = 0;
                labelProvider.maxLength = 9;
                break;
            case 1:
                labelProvider.rotation = 20;
                labelProvider.maxLength = 0;
                break;
            case 2:
                labelProvider.rotation = 30;
                labelProvider.maxLength = 12;
                break;
            default:
                labelProvider.rotation = 0;
                labelProvider.maxLength = 9;
                break;
        }
    };


    return (<div>
            <div id={divElementId} className={classes.ChartWrapper} />
            <ToggleButtonGroup 
                exclusive 
                value={preset}
                onChange={handlePreset}
                size="medium" color="primary" aria-label="small outlined button group">
                <ToggleButton value={0} >
                    Multi-Line
                </ToggleButton>
                <ToggleButton value={1} >
                    Single Line Rotated
                </ToggleButton>
                <ToggleButton value={2} >
                    Multi-Line Rotated
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}

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
        if (xValue === 0 || xValue === 4 || xValue === 8) {
            return this.pfYellow;
        } else if (xValue === 1 || xValue === 7) {
            return this.pfBlue;
        } else if (xValue === 2 || xValue === 5) {
            return this.pfOrange;
        } else if (xValue === 3 || xValue === 6) {
            return this.pfRed;
        } else if (xValue === 9) {
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