import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { DpiHelper } from 'scichart/Charting/Visuals/TextureManager/DpiHelper';
import { CustomAnnotation } from 'scichart/Charting/Visuals/Annotations/CustomAnnotation';
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from 'scichart/types/AnchorPoint';
import { EAxisAlignment } from 'scichart/types/AxisAlignment';
import { HeatmapColorMap } from 'scichart/Charting/Visuals/RenderableSeries/HeatmapColorMap';
import { UniformHeatmapDataSeries } from 'scichart/Charting/Model/UniformHeatmapDataSeries';
import { UniformHeatmapRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries';
import { NumberRange } from 'scichart/Core/NumberRange';

export async function hitTestHeatmapTs(divId: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { axisTitle: 'Heatmap X', growBy: new NumberRange(0.05, 0.05) })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: 'Heatmap Y',
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.05, 0.05)
        })
    );

    const gradientStops = [
        { offset: 0, color: 'yellow' },
        { offset: 1, color: 'red' }
    ];
    const colorMap = new HeatmapColorMap({
        minimum: 0,
        maximum: 3,
        gradientStops
    });

    const initialZValues = [
        [3, 0, 1, 2],
        [0, 1, 2, 3]
    ];

    const dataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 1,
        yStart: 3,
        yStep: 1,
        zValues: initialZValues
    });
    dataSeries.hasNaNs = true;

    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        opacity: 0.5,
        dataSeries,
        colorMap
    });

    sciChartSurface.renderableSeries.add(heatmapSeries);

    // Add an SVG annotation to display the mouse click
    const svgAnnotation = new CustomAnnotation({
        svgString: `<svg width="8" height="8"><circle cx="50%" cy="50%" r="4" fill="#FF0000"/></svg>`,
        isHidden: true,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center
    });
    sciChartSurface.annotations.add(svgAnnotation);

    sciChartSurface.domCanvas2D.addEventListener('mousedown', (mouseEvent: MouseEvent) => {
        const mouseClickX = mouseEvent.offsetX;
        const mouseClickY = mouseEvent.offsetY;
        console.log('mouseClickX', mouseClickX, 'mouseClickY', mouseClickY);
        const premultipliedX = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
        const premultipliedY = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;
        console.log('premultipliedX', premultipliedX, 'premultipliedY', premultipliedY);
        // IHitTestProvider.hitTest
        const hitTestInfo = heatmapSeries.hitTestProvider.hitTest(premultipliedX, premultipliedY);
        svgAnnotation.x1 = hitTestInfo.hitTestPointValues.x;
        svgAnnotation.y1 = hitTestInfo.hitTestPointValues.y;
        svgAnnotation.isHidden = false;

        const resultDiv = document.getElementById('result');
        resultDiv.innerText = `isHit = ${hitTestInfo.isHit}`;
        console.log('hitTestInfo', hitTestInfo);
    });
}
