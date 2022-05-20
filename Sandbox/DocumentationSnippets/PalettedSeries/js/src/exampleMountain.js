import { SciChartSurface } from 'scichart';
import { SciChartJSLightTheme } from 'scichart/Charting/Themes/SciChartJSLightTheme';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { NumberRange } from 'scichart/Core/NumberRange';
import { FastMountainRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import {
    DefaultPaletteProvider,
    EFillPaletteMode,
    EStrokePaletteMode
} from 'scichart/Charting/Model/IPaletteProvider';
import { parseColorToUIntArgb } from 'scichart/utils/parseColor';
import { uintArgbColorMultiplyOpacity } from 'scichart/utils/colorUtil';
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";

export const drawExampleMountain = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-div-id', {
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
        //     opacity: 1
        // }),
        opacity: 1,
        paletteProvider: new MountainPaletteProvider()
    });

    sciChartSurface.renderableSeries.add(mountainSeries);
};

export class MountainPaletteProvider extends DefaultPaletteProvider {
    constructor() {
        super();

        this.fillPaletteMode = EFillPaletteMode.SOLID;
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.limeStroke = parseColorToUIntArgb('lime');
        this.yellowFill = parseColorToUIntArgb('yellow');
    }

    overrideFillArgb(xValue, yValue, index, opacity, metadata) {
        if (yValue >= 0.5) {
            return opacity !== undefined ? uintArgbColorMultiplyOpacity(this.yellowFill, opacity) : this.yellowFill;
        }
        return undefined;
    }

    overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
        if (yValue >= 0.5) {
            return opacity !== undefined ? uintArgbColorMultiplyOpacity(this.limeStroke, opacity) : this.limeStroke;
        }
    return undefined;
    }
}

class MountainPointMarkerPaletteProvider extends DefaultPaletteProvider {

    constructor() {
        super();
        this.fillPaletteMode = EFillPaletteMode.SOLID;
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.redStroke = parseColorToUIntArgb('red');
        this.blueFill = parseColorToUIntArgb('blue');
    }

    overridePointMarkerArgb(xValue, yValue, index, opacity, metadata) {
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
