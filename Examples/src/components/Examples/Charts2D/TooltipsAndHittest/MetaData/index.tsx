import * as React from "react";
import Button from "@material-ui/core/Button";
import { TWebAssemblyChart } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { RolloverModifier, TRolloverTooltipDataTemplate } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { TSciChart } from "scichart/types/TSciChart";
import { IXyDataSeriesOptions, XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { XySeriesInfo } from "scichart/Charting/Model/ChartData/XySeriesInfo";
import { SciChartSurface } from "scichart";
import { ENumericFormat } from "scichart/types/NumericFormat";
import classes from "../../../../Examples/Examples.module.scss";
import { IPointMetadata } from "scichart/Charting/Model/IPointMetadata";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import { TCursorTooltipDataTemplate } from "scichart/Charting/ChartModifiers/CursorModifier";
import { SeriesInfo } from "scichart/Charting/Model/ChartData/SeriesInfo";
import { EStrokePaletteMode, IStrokePaletteProvider } from "scichart/Charting/Model/IPaletteProvider";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";

const divElementId = "chart";

class MyMetadata implements IPointMetadata {
    public static create(title: string, prevousValue?: number, isSelected?: boolean) {
        const md = new MyMetadata();
        md.title = title;
        md.previousValue = prevousValue ?? md.previousValue;
        md.isSelected = isSelected ?? md.isSelected;
        return md;
    }

    public isSelected: boolean = false;
    public title: string;
    public previousValue: number;
    public palettedStrokeRed: number = parseColorToUIntArgb("red");
    public palettedStrokeGreen: number = parseColorToUIntArgb("green");

    private constructor() {}
}

const tooltipDataTemplateRS: TRolloverTooltipDataTemplate = (seriesInfo: XySeriesInfo): string[] => {
    const valuesWithLabels: string[] = [];
    // Line Series
    const xySeriesInfo = seriesInfo as XySeriesInfo;

    if (seriesInfo.pointMetadata) {
        const testMd = seriesInfo.pointMetadata as MyMetadata;
        valuesWithLabels.push(testMd.title + " Previous: " + testMd.previousValue.toFixed(1));
    }
    valuesWithLabels.push("X: " + xySeriesInfo.formattedXValue + " Y: " + xySeriesInfo.formattedYValue);
    return valuesWithLabels;
};

class LinePaletteProvider implements IStrokePaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;

    // tslint:disable-next-line:no-empty
    public onAttached(parentSeries: IRenderableSeries): void {}

    // tslint:disable-next-line:no-empty
    public onDetached(): void {}

    public overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity: number,
        metadata: IPointMetadata
    ): number {
        const md = metadata as MyMetadata;
        if (md) {
            if (yValue < md.previousValue) {
                return md.palettedStrokeRed;
            }
            if (yValue > md.previousValue) {
                return md.palettedStrokeGreen;
            }
        }
        return undefined;
    }
}

const drawExample = async (): Promise<TWebAssemblyChart> => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) });
    xAxis.labelProvider.numericFormat = ENumericFormat.Decimal;
    xAxis.labelProvider.precision = 0;
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) });
    sciChartSurface.yAxes.add(yAxis);

    const firstSeriesData = createDataSeries(wasmContext, 0, { dataSeriesName: "Sinewave A" });

    const renderableSeries1 = new FastLineRenderableSeries(wasmContext, {
        stroke: "#368BC1",
        strokeThickness: 3,
        dataSeries: firstSeriesData,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 5,
            height: 5,
            strokeThickness: 2,
            fill: "white",
            stroke: "#368BC1"
        }),
        paletteProvider: new LinePaletteProvider(),
    });
    renderableSeries1.rolloverModifierProps.markerColor = "#368BC1";
    renderableSeries1.rolloverModifierProps.tooltipColor = "#368BC1";
    sciChartSurface.renderableSeries.add(renderableSeries1);

    renderableSeries1.rolloverModifierProps.tooltipDataTemplate = tooltipDataTemplateRS;

    sciChartSurface.chartModifiers.add(new RolloverModifier());
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

const createDataSeries = (wasmContext: TSciChart, index: number, options?: IXyDataSeriesOptions) => {
    const sigma = Math.pow(0.6, index);
    const dataSeries = new XyDataSeries(wasmContext, options);
    let prev = 0;
    for (let i = 0; i < 100; i++) {
        const grow = 1 + i / 99;
        const metadata = i > 0 ? MyMetadata.create("Metadata " + i.toString() , prev) : undefined;
        const y = Math.sin((Math.PI * i) / 15) * grow * sigma;
        dataSeries.append(i, y, metadata);
        prev = y;
    }
    return dataSeries;
};

export default function UsingMetaData() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [wasmContext, setWasmContext] = React.useState<TSciChart>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
            setWasmContext(res.wasmContext);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return (
        <div>
            <div id={divElementId} className={classes.ChartWrapper} />
        </div>
    );
}
