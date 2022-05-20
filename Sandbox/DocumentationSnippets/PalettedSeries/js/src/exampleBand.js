import { SciChartSurface } from 'scichart';
import { SciChartJSLightTheme } from 'scichart/Charting/Themes/SciChartJSLightTheme';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { NumberRange } from 'scichart/Core/NumberRange';
import { XyyDataSeries } from 'scichart/Charting/Model/XyyDataSeries';
import { FastBandRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastBandRenderableSeries';
import { EllipsePointMarker } from 'scichart/Charting/Visuals/PointMarkers/EllipsePointMarker';
import { DefaultPaletteProvider, EFillPaletteMode, EStrokePaletteMode } from 'scichart/Charting/Model/IPaletteProvider';
import { uintArgbColorMultiplyOpacity } from 'scichart/utils/colorUtil';
import {parseColorToUIntArgb} from "scichart/utils/parseColor";

export const drawExampleBand = async () => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create("scichart-div-id", {
        theme: new SciChartJSLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.4, 0.4) }));

    const dataSeries = new XyyDataSeries(wasmContext);
    const POINTS = 20;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= POINTS; i++) {
        const k = 1 - i / 2000;
        const y = Math.sin(i * STEP) * k * 0.7;
        const y1 = Math.cos(i * STEP) * k;
        dataSeries.append(i, y, y1);
    }
    const rendSeries = new FastBandRenderableSeries(wasmContext, {
        dataSeries,
        strokeThickness: 7,
        fill: 'rgba(39,155,39,0.7)',
        fillY1: 'rgba(255,25,25,0.7)',
        stroke: '#FF1919',
        strokeY1: '#279B27',
        opacity: 1,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 14,
            height: 14,
            strokeThickness: 4,
            stroke: '#FFFF33',
            fill: '#33FF33',
            opacity: 1
        })
    });

    rendSeries.paletteProvider = new BandPaletteProvider();

    sciChartSurface.renderableSeries.add(rendSeries);
    sciChartSurface.zoomExtents();
};

class BandPaletteProvider extends DefaultPaletteProvider {

    constructor() {
        super();
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.fillPaletteMode = EFillPaletteMode.SOLID;
        this.limeStroke = parseColorToUIntArgb('lime');
        this.yellowFill = parseColorToUIntArgb('rgba(255,255,0,0.7)');
        this.markerRedStroke = parseColorToUIntArgb('red');
        this.markerBlueFill = parseColorToUIntArgb('blue');
    }
    overrideFillArgb(
        xValue,
        yValue,
        index,
        opacity,
        metadata
    ) {
        if (xValue >= 6 && xValue <= 12) {
            return opacity !== undefined ? uintArgbColorMultiplyOpacity(this.yellowFill, opacity) : this.yellowFill;
        }
        return undefined;
    }

    overrideStrokeArgb(
        xValue,
        yValue,
        index,
        opacity,
        metadata
    ) {
        if (xValue >= 6 && xValue <= 12) {
            return opacity !== undefined ? uintArgbColorMultiplyOpacity(this.limeStroke, opacity) : this.limeStroke;
        }
        return undefined;
    }

    overridePointMarkerArgb(
        xValue,
        yValue,
        index,
        opacity,
        metadata
    ) {
        if (xValue >= 6 && xValue <= 12) return { stroke: this.markerRedStroke, fill: this.markerBlueFill };
        return undefined;
    }
}
