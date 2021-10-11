import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { DpiHelper } from 'scichart/Charting/Visuals/TextureManager/DpiHelper';
import { CustomAnnotation } from 'scichart/Charting/Visuals/Annotations/CustomAnnotation';
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from 'scichart/types/AnchorPoint';
import { NumberRange } from 'scichart/Core/NumberRange';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { StackedColumnRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries';
import { StackedColumnCollection } from 'scichart/Charting/Visuals/RenderableSeries/StackedColumnCollection';
import { HitTestInfo } from 'scichart/Charting/Visuals/RenderableSeries/HitTest/HitTestInfo';

export async function hitTestStackedColumnTs(divId: string) {
    const xValues = [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003];
    const porkData = [10, 13, 7, 16, 4, 6, 20, 14, 16, 10, 24, 11];
    const vealData = [12, 17, 21, 15, 19, 18, 13, 21, 22, 20, 5, 10];
    const tomatoesData = [7, 30, 27, 24, 21, 15, 17, 26, 22, 28, 21, 22];
    const cucumberData = [16, 10, 9, 8, 22, 14, 12, 27, 25, 23, 17, 17];
    const pepperData = [7, 24, 21, 11, 19, 17, 14, 27, 26, 22, 28, 16];

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);
    const xAxis = new NumericAxis(wasmContext);
    xAxis.labelProvider.precision = 0;
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext);
    yAxis.growBy = new NumberRange(0, 0.1);
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries1 = new XyDataSeries(wasmContext, { xValues, yValues: porkData, dataSeriesName: 'Pork' });
    const dataSeries2 = new XyDataSeries(wasmContext, { xValues, yValues: vealData, dataSeriesName: 'Veal' });
    const dataSeries3 = new XyDataSeries(wasmContext, { xValues, yValues: tomatoesData, dataSeriesName: 'Tomato' });
    const dataSeries4 = new XyDataSeries(wasmContext, { xValues, yValues: cucumberData, dataSeriesName: 'Cucumber' });
    const dataSeries5 = new XyDataSeries(wasmContext, { xValues, yValues: pepperData, dataSeriesName: 'Pepper' });

    const rendSeries1 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries1.fill = '#226Fb7';
    rendSeries1.stroke = 'black';
    rendSeries1.strokeThickness = 1;
    rendSeries1.dataSeries = dataSeries1;
    rendSeries1.rolloverModifierProps.markerColor = '#19548b';
    rendSeries1.rolloverModifierProps.tooltipColor = '#226Fb7';
    rendSeries1.rolloverModifierProps.tooltipTextColor = '#fff';
    rendSeries1.stackedGroupId = 'Meat';

    const rendSeries2 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries2.fill = '#ff9a2e';
    rendSeries2.dataSeries = dataSeries2;
    rendSeries2.rolloverModifierProps.markerColor = '#db8428';
    rendSeries2.rolloverModifierProps.tooltipColor = '#ff9a2e';
    rendSeries2.rolloverModifierProps.tooltipTextColor = '#000';
    rendSeries2.stackedGroupId = 'Meat';

    const rendSeries3 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries3.fill = '#dc443f';
    rendSeries3.dataSeries = dataSeries3;
    rendSeries3.rolloverModifierProps.markerColor = '#b83735';
    rendSeries3.rolloverModifierProps.tooltipColor = '#dc443f';
    rendSeries3.rolloverModifierProps.tooltipTextColor = '#fff';
    rendSeries3.stackedGroupId = 'Vegetables';

    const rendSeries4 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries4.fill = '#aad34f';
    rendSeries4.dataSeries = dataSeries4;
    rendSeries4.rolloverModifierProps.markerColor = '#87a73e';
    rendSeries4.rolloverModifierProps.tooltipColor = '#aad34f';
    rendSeries4.rolloverModifierProps.tooltipTextColor = '#000';
    rendSeries4.stackedGroupId = 'Vegetables';

    const rendSeries5 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries5.fill = '#8562b4';
    rendSeries5.dataSeries = dataSeries5;
    rendSeries5.rolloverModifierProps.markerColor = '#715195';
    rendSeries5.rolloverModifierProps.tooltipColor = '#8562b4';
    rendSeries5.rolloverModifierProps.tooltipTextColor = '#fff';
    rendSeries5.stackedGroupId = 'Vegetables';

    const verticallyStackedColumnCollection = new StackedColumnCollection(wasmContext);
    verticallyStackedColumnCollection.dataPointWidth = 0.8;
    verticallyStackedColumnCollection.add(rendSeries3, rendSeries4, rendSeries5, rendSeries1, rendSeries2);

    sciChartSurface.renderableSeries.add(verticallyStackedColumnCollection);

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
        const hitTestResults: HitTestInfo[] = verticallyStackedColumnCollection
            .asArray()
            .reduce((acc: HitTestInfo[], stackedColumnRenderableSeries: StackedColumnRenderableSeries) => {
                const hitTestInfo = stackedColumnRenderableSeries.hitTestProvider.hitTest(
                    premultipliedX,
                    premultipliedY
                );
                acc.push(hitTestInfo);
                return acc;
            }, []);
        svgAnnotation.x1 = hitTestResults[0].hitTestPointValues.x;
        svgAnnotation.y1 = hitTestResults[0].hitTestPointValues.y;
        svgAnnotation.isHidden = false;

        const resultDiv = document.getElementById('result');
        resultDiv.innerText = JSON.stringify(
            hitTestResults.map((hitTestInfo, index) => `${index} isHit = ${hitTestInfo.isHit}; `)
        );
        console.log('hitTestResults', hitTestResults);
    });
}
