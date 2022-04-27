import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { MouseWheelZoomModifier } from 'scichart/Charting/ChartModifiers/MouseWheelZoomModifier';
import { ZoomExtentsModifier } from 'scichart/Charting/ChartModifiers/ZoomExtentsModifier';
import { ZoomPanModifier } from 'scichart/Charting/ChartModifiers/ZoomPanModifier';
import { EAxisAlignment } from 'scichart/types/AxisAlignment';
import { NumberRange } from 'scichart/Core/NumberRange';
import { AxisMarkerAnnotation } from 'scichart/Charting/Visuals/Annotations/AxisMarkerAnnotation';
import { MouseOverAnnotationModifier } from './MouseOverAnnotationModifier';
import { CustomBoxAnnotation } from './CustomBoxAnnotation';
import { createImageAsync } from 'scichart/utils/imageUtil';
import { MouseOverAxisModifier } from './MouseOverAxisModifier';
import { CustomAnnotation } from 'scichart/Charting/Visuals/Annotations/CustomAnnotation';
import {AxisMarkerAnnotationWithoutGrips} from "./AxisMarkerAnnotationWithoutGrips";

async function initSciChart() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-root');

    const xAxis = new NumericAxis(wasmContext);
    xAxis.visibleRange = new NumberRange(0, 10);
    xAxis.axisTitle = 'X Axis';
    xAxis.axisAlignment = EAxisAlignment.Top;
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    yAxis.visibleRange = new NumberRange(0, 10);
    yAxis.axisAlignment = EAxisAlignment.Left;

    // Add extra space for AxisMarkerAnnotation
    yAxis.axisBorder = { borderRight: 100 };
    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());

    // This adds modifier to change cursor when hover over annotations
    sciChartSurface.chartModifiers.add(new MouseOverAnnotationModifier());

    // This adds modifier to change cursor when hover over axes
    sciChartSurface.chartModifiers.add(new MouseOverAxisModifier());

    const axisMarkerAnnotation = new AxisMarkerAnnotation({
        color: '#03fc3d',
        backgroundColor: '#2d03fc',
        formattedValue: 'Axis Marker',
        y1: 7,
        isEditable: true,
    });

    // This creates a red circle image and waits until it is created
    const someSvgString: string = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" stroke="black" stroke-width="3" fill="red"/>
    </svg>`;
    const blob = new Blob([someSvgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const htmlImageElement = await createImageAsync(url);

    const customAxisMarkerAnnotation = new AxisMarkerAnnotationWithoutGrips({
        y1: 3,
        isEditable: true,
        image: htmlImageElement,
        imageWidth: 50,
        imageHeight: 50,
    });

    const callWhenSelectionChanges = (isSelected: boolean) => {
        if (isSelected) {
            console.log('green box was selected');
        } else {
            console.log('green box was deselected');
        }
    };

    const boxAnnotationGreen = new CustomBoxAnnotation(callWhenSelectionChanges, {
        stroke: '#33FF33',
        strokeThickness: 1,
        fill: 'rgba(50, 255, 50, 0.3)',
        x1: 3.0,
        x2: 6.0,
        y1: 6.0,
        y2: 8.0,
        isEditable: true,
    });
    const svg = `<svg width="400" height="110" style="pointer-events: all">
    <rect width="100%" height="100%" style="fill:rgb(0,0,0, .5);stroke-width:3;stroke:rgb(0,0,0)" />
    <foreignObject x="10%" y="10%" width="80%" height="80%">
        <body xmlns="http://www.w3.org/1999/xhtml">
            <form class="form" id="form">
                <div>
                    <label for="email">Email:</label>
                    <input type="text" id="email" placeholder="Enter email" class="form-control" />
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="text" id="password" placeholder="Enter password" class="form-control" />
                </div>
                <button id="send">Send</button>
            </form>
        </body>
    </foreignObject>
  </svg>`;
    const customAnnotation = new CustomAnnotation({
        x1: 2.0,
        y1: 4.0,
        svgString: svg,
    });

    sciChartSurface.annotations.add(
        axisMarkerAnnotation,
        customAxisMarkerAnnotation,
        boxAnnotationGreen,
        customAnnotation
    );
}

initSciChart();
