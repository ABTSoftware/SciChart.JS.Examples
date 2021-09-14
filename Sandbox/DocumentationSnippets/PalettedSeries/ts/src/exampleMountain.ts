import { SciChartSurface } from 'scichart';
import { SciChartJSLightTheme } from 'scichart/Charting/Themes/SciChartJSLightTheme';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { NumberRange } from 'scichart/Core/NumberRange';
import { FastMountainRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries';
import { EllipsePointMarker } from 'scichart/Charting/Visuals/PointMarkers/EllipsePointMarker';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import {
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IPointMarkerPaletteProvider,
    IStrokePaletteProvider,
    TPointMarkerArgb
} from 'scichart/Charting/Model/IPaletteProvider';
import { parseColorToUIntArgb } from 'scichart/utils/parseColor';
import { IRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/IRenderableSeries';
import { IPointMetadata } from 'scichart/Charting/Model/IPointMetadata';
import { uintArgbColorMultiplyOpacity } from 'scichart/utils/colorUtil';

export const drawExampleMountain = async (divElementId: string) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJSLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    const yAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.05) });
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries = new XyDataSeries(wasmContext, { containsNaN: true });
    const POINTS = 100;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= POINTS; i++) {
        dataSeries.append(i, Math.abs(Math.sin(i * STEP)));
    }

    const mountainSeries = new FastMountainRenderableSeries(wasmContext, {
        dataSeries,
        stroke: '#4682b4',
        strokeThickness: 10,
        zeroLineY: 0.0,
        fill: 'rgba(176, 196, 222, 1)',
        // pointMarker: new EllipsePointMarker(wasmContext, {
        //     width: 18,
        //     height: 18,
        //     strokeThickness: 5,
        //     fill: '#ff0000',
        //     stroke: '#000000',
        //     opacity: 1 // Does not work correctly with opacity 0.5
        // }),
        opacity: 1,
        paletteProvider: new MountainPaletteProvider()
    });

    sciChartSurface.renderableSeries.add(mountainSeries);
};

export class MountainPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    private readonly limeStroke = parseColorToUIntArgb('lime');
    private readonly yellowFill = parseColorToUIntArgb('yellow');

    public onAttached(parentSeries: IRenderableSeries): void {}

    public onDetached(): void {}

    public overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        if (yValue >= 0.5) {
            return opacity !== undefined ? uintArgbColorMultiplyOpacity(this.yellowFill, opacity) : this.yellowFill;
        }
        return undefined;
    }

    public overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        if (yValue >= 0.5) {
            return opacity !== undefined ? uintArgbColorMultiplyOpacity(this.limeStroke, opacity) : this.limeStroke;
        }
        return undefined;
    }
}

export class MountainPointMarkerPaletteProvider implements IPointMarkerPaletteProvider {
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    private readonly redStroke = parseColorToUIntArgb('red');
    private readonly blueFill = parseColorToUIntArgb('blue');

    public onAttached(parentSeries: IRenderableSeries): void {}

    public onDetached(): void {}

    public overridePointMarkerArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): TPointMarkerArgb {
        if (yValue >= 0.5) {
            // The opacity is already applied in the texture
            // And this opacity is the renderable series opacity, therefore we do not use it here
            const stroke = this.redStroke;
            const fill = this.blueFill;
            return { stroke, fill };
        }
        return undefined;
    }
}
