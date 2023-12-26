import {
    EAxisAlignment,
    EStrokePaletteMode,
    FastLineRenderableSeries,
    HeatmapColorMap,
    IRenderableSeries,
    IStrokePaletteProvider,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    PaletteFactory,
    RolloverModifier,
    SciChartJsNavyTheme,
    SciChartSurface,
    TGradientStop,
    UniformHeatmapDataSeries,
    UniformHeatmapRenderableSeries,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier
} from 'scichart';

async function initSciChart() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-root', {
        theme: new SciChartJsNavyTheme()
    });

    const xAxis = new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Bottom});
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(0, 120)});
    sciChartSurface.yAxes.add(yAxis);

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "steelblue",
        strokeThickness: 3,
    });
    const dataSeries = new XyDataSeries(wasmContext);
    const flatDataSeries = new XyDataSeries(wasmContext);
    const heatMapData: number[][] = [[]];
    let i = 0;
    for (let x = 0; x < 10; x += 0.2) {
        let y = 50 + 50 * Math.sin(x);
        dataSeries.append(x, y);
        // Heatmap data usng index
        heatMapData[0][i] = y;
        i++;
        // flat data for heatmap line
        flatDataSeries.append(x, 105);
    }
    lineSeries.dataSeries = dataSeries;

    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 0.2,
        yStart: 0,
        yStep: 1,
        zValues: heatMapData,
    });

    const gradientStops: TGradientStop[] = [
        { offset: 0, color: '#00008B' },
        { offset: 0.2, color: '#6495ED' },
        { offset: 0.4, color: '#006400' },
        { offset: 0.6, color: '#7FFF00' },
        { offset: 0.8, color: '#FFFF00' },
        { offset: 1.0, color: '#FF0000' },
    ];

    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: heatmapDataSeries,
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: 100,
            gradientStops
        }),
    });

    const colorData: number[] = PaletteFactory.createColorMap(
        wasmContext,
        gradientStops
    );
    const palette: IStrokePaletteProvider = {
        strokePaletteMode: EStrokePaletteMode.GRADIENT,
        onAttached(parentSeries: IRenderableSeries): void {
        },
        onDetached(): void {},
        overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
            const y = dataSeries.getNativeYValues().get(index);
            const lerpFactor = y / 100;
            const mapIndex = wasmContext.NumberUtil.Constrain(
                Math.round(lerpFactor * (colorData.length - 1)),
                0,
                colorData.length - 1
            );
            const result = colorData[mapIndex];
            return result;
        }
    };
    lineSeries.paletteProvider = palette;

    const heatMapLine = new FastLineRenderableSeries(wasmContext);
    heatMapLine.strokeThickness = 10;
    heatMapLine.stroke = "steelBlue";
    heatMapLine.dataSeries = flatDataSeries;
    heatMapLine.paletteProvider = palette;

    sciChartSurface.renderableSeries.add(
        lineSeries,
        heatmapSeries,
        // heatMapLine
    );

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier(), new RolloverModifier());

    // OPTIONAL:
    // Override HeatmapDataSeries.getYRange() to always return the bottom 5% of the chart
    // NOTE: Use this with caution as DataSeries.getYRange() is also used in the yAxis autorange algorithm
    // so you will need to specify a visiblerange on the yaxis or have other series as well.
    heatmapDataSeries.getYRange = () => {
        return new NumberRange(yAxis.visibleRange.min, yAxis.visibleRange.diff * 0.05 + yAxis.visibleRange.min);
    };
}

initSciChart();
