import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import customAxisMarkerImage from './img/CustomAxisMarkerImage.png';
import { NumberRange } from 'scichart/Core/NumberRange';
import { createImageAsync } from 'scichart/utils/imageUtil';
import { AxisMarkerAnnotation } from 'scichart/Charting/Visuals/Annotations/AxisMarkerAnnotation';

async function customAxisMarkerAnnotationTs(divId: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 10) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 10) }));

    const htmlImageElement = await createImageAsync(customAxisMarkerImage);

    // pass imageWidth and imageHeight options to specify annotation width and height
    const customAxisMarkerAnnotation = new AxisMarkerAnnotation({
        x1: 5,
        isEditable: true,
        image: htmlImageElement,
        // imageWidth: 100,
        // imageHeight: 100
    });

    sciChartSurface.annotations.add(customAxisMarkerAnnotation);
}

customAxisMarkerAnnotationTs('scichart');
