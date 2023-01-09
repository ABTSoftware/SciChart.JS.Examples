import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { ECoordinateMode } from 'scichart/Charting/Visuals/Annotations/AnnotationBase';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumberRange } from 'scichart/Core/NumberRange';
import { Rect } from 'scichart/Core/Rect';
import { chartBuilder } from 'scichart/Builder/chartBuilder';
import { ESeriesType } from 'scichart/types/SeriesType';
import { EAxisType } from 'scichart/types/AxisType';
import { Thickness } from 'scichart/Core/Thickness';

export async function simpleSubChart(divElementId) {
    // create a main (regular) surface which will contain a sub-chart
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // axes here are optional, but may be required to draw a sub-chart with specific coordinate mode or to draw other chart elements
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add a sub-chart to the main surface
    const subChartSurface = sciChartSurface.addSubChart({ position: new Rect(0, 0, 0.5, 0.5) });

    // Add axes to the sub-surface
    subChartSurface.xAxes.add(new NumericAxis(wasmContext));
    subChartSurface.yAxes.add(new NumericAxis(wasmContext));
}

export async function subChartWithBuilderApi(divElementId) {
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        xAxes: { type: EAxisType.NumericAxis },
        yAxes: { type: EAxisType.NumericAxis },
        subCharts: [
            {
                surface: { position: new Rect(0, 0, 0.5, 0.5) },
            },
        ],
    });
}

export async function subChartOverLineSeries(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // axes here are required to draw renderable series
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [1, 2, 3, 4, 5],
                yValues: [3, 4, 7, 8, 9],
            }),
        })
    );

    // Add a sub-chart to the main surface
    const subChartSurface = sciChartSurface.addSubChart({ position: new Rect(0, 0, 0.5, 0.5) });

    // Add axes to the sub-surface
    subChartSurface.xAxes.add(new NumericAxis(wasmContext));
    subChartSurface.yAxes.add(new NumericAxis(wasmContext));
}

export async function subChartOverLineSeriesWithBuilderApi(divElementId) {
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        // axes here are required to draw renderable series
        xAxes: { type: EAxisType.NumericAxis },
        yAxes: { type: EAxisType.NumericAxis },
        series: {
            type: ESeriesType.LineSeries,
            xyData: {
                xValues: [1, 2, 3, 4, 5],
                yValues: [3, 4, 7, 8, 9],
            },
        },
        subCharts: [
            {
                surface: { position: new Rect(0, 0, 0.5, 0.5) },
            },
        ],
    });
}

export async function subChartPixelCoordinateMode(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const subChartSurface = sciChartSurface.addSubChart({
        coordinateMode: ECoordinateMode.Pixel,
        position: new Rect(200, 200, 100, 100),
    });

    subChartSurface.xAxes.add(new NumericAxis(wasmContext));
    subChartSurface.yAxes.add(new NumericAxis(wasmContext));
}

export async function subChartDataValueCoordinateMode(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const subChartSurface = sciChartSurface.addSubChart({
        coordinateMode: ECoordinateMode.DataValue,
        position: new Rect(0, 5, 4, 3),
    });

    subChartSurface.xAxes.add(new NumericAxis(wasmContext));
    subChartSurface.yAxes.add(new NumericAxis(wasmContext));
}

export async function subChartDataValueCoordinateModeWithBuilderApi(divElementId) {
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        xAxes: { type: EAxisType.NumericAxis },
        yAxes: { type: EAxisType.NumericAxis },
        subCharts: [
            {
                surface: {
                    coordinateMode: ECoordinateMode.DataValue,
                    position: new Rect(0, 5, 4, 3),
                },
            },
        ],
    });
}

export async function subChartParentAxes(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // define multiple X and Y Axes
    const mainSurfaceXAxis1 = new NumericAxis(wasmContext, {
        id: 'mainSurfaceXAxis1',
        axisTitle: 'X Axis 1',
        visibleRange: new NumberRange(0, 10),
    });
    const mainSurfaceXAxis2 = new NumericAxis(wasmContext, {
        id: 'mainSurfaceXAxis2',
        axisTitle: 'X Axis 2',
        visibleRange: new NumberRange(-5, 5),
    });
    const mainSurfaceYAxis1 = new NumericAxis(wasmContext, {
        id: 'mainSurfaceYAxis1',
        axisTitle: 'Y Axis 1',
        visibleRange: new NumberRange(0, 10),
    });
    const mainSurfaceYAxis2 = new NumericAxis(wasmContext, {
        id: 'mainSurfaceYAxis2',
        axisTitle: 'Y Axis 2',
        visibleRange: new NumberRange(-5, 5),
    });

    sciChartSurface.xAxes.add(mainSurfaceXAxis1, mainSurfaceXAxis2);
    sciChartSurface.yAxes.add(mainSurfaceYAxis1, mainSurfaceYAxis2);

    // create a sub-surface positioned accordingly to coordinates on mainSurfaceXAxis2 and mainSurfaceYAxis2
    const subChartSurface = sciChartSurface.addSubChart({
        coordinateMode: ECoordinateMode.DataValue,
        parentXAxisId: mainSurfaceXAxis2.id,
        parentYAxisId: mainSurfaceYAxis2.id,
        position: new Rect(0, 5, 4, 3),
    });

    subChartSurface.xAxes.add(new NumericAxis(wasmContext));
    subChartSurface.yAxes.add(new NumericAxis(wasmContext));
}

export async function subChartParentAxesWithBuilderApi(divElementId) {
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        // define multiple X and Y Axes
        xAxes: [
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: 'mainSurfaceXAxis1',
                    axisTitle: 'X Axis 1',
                    visibleRange: new NumberRange(0, 10),
                },
            },
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: 'mainSurfaceXAxis2',
                    axisTitle: 'X Axis 2',
                    visibleRange: new NumberRange(-5, 5),
                },
            },
        ],
        yAxes: [
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: 'mainSurfaceYAxis1',
                    axisTitle: 'Y Axis 1',
                    visibleRange: new NumberRange(0, 10),
                },
            },
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: 'mainSurfaceYAxis2',
                    axisTitle: 'Y Axis 2',
                    visibleRange: new NumberRange(-5, 5),
                },
            },
        ],
        subCharts: [
            {
                // create a sub-surface positioned accordingly to coordinates on mainSurfaceXAxis2 and mainSurfaceYAxis2
                surface: {
                    coordinateMode: ECoordinateMode.DataValue,
                    parentXAxisId: 'mainSurfaceXAxis2',
                    parentYAxisId: 'mainSurfaceYAxis2',
                    position: new Rect(0, 5, 4, 3),
                },
            },
        ],
    });
}

export async function updateSubChartPosition(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    const mainSurfaceXAxis1 = new NumericAxis(wasmContext, {
        id: 'mainSurfaceXAxis1',
        axisTitle: 'X Axis 1',
        visibleRange: new NumberRange(0, 10),
    });
    const mainSurfaceXAxis2 = new NumericAxis(wasmContext, {
        id: 'mainSurfaceXAxis2',
        axisTitle: 'X Axis 2',
        visibleRange: new NumberRange(-5, 5),
    });
    const mainSurfaceYAxis1 = new NumericAxis(wasmContext, {
        id: 'mainSurfaceYAxis1',
        axisTitle: 'Y Axis 1',
        visibleRange: new NumberRange(0, 10),
    });
    const mainSurfaceYAxis2 = new NumericAxis(wasmContext, {
        id: 'mainSurfaceYAxis2',
        axisTitle: 'Y Axis 2',
        visibleRange: new NumberRange(-5, 5),
    });

    sciChartSurface.xAxes.add(mainSurfaceXAxis1, mainSurfaceXAxis2);
    sciChartSurface.yAxes.add(mainSurfaceYAxis1, mainSurfaceYAxis2);

    const subChartSurface = sciChartSurface.addSubChart({
        coordinateMode: ECoordinateMode.DataValue,
        parentXAxisId: mainSurfaceXAxis2.id,
        parentYAxisId: mainSurfaceYAxis2.id,
        position: new Rect(0, 5, 4, 3),
    });

    subChartSurface.xAxes.add(new NumericAxis(wasmContext));
    subChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // modify sub-chart position
    subChartSurface.coordinateMode = ECoordinateMode.Pixel;
    subChartSurface.subPosition = new Rect(100, 100, 200, 200);
}

export async function updateSubChartPositionWithBuilderApi(divElementId) {
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        // define multiple X and Y Axes
        xAxes: [
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: 'mainSurfaceXAxis1',
                    axisTitle: 'X Axis 1',
                    visibleRange: new NumberRange(0, 10),
                },
            },
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: 'mainSurfaceXAxis2',
                    axisTitle: 'X Axis 2',
                    visibleRange: new NumberRange(-5, 5),
                },
            },
        ],
        yAxes: [
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: 'mainSurfaceYAxis1',
                    axisTitle: 'Y Axis 1',
                    visibleRange: new NumberRange(0, 10),
                },
            },
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: 'mainSurfaceYAxis2',
                    axisTitle: 'Y Axis 2',
                    visibleRange: new NumberRange(-5, 5),
                },
            },
        ],
        subCharts: [
            {
                // create a sub-surface positioned accordingly to coordinates on mainSurfaceXAxis2 and mainSurfaceYAxis2
                surface: {
                    coordinateMode: ECoordinateMode.DataValue,
                    parentXAxisId: 'mainSurfaceXAxis2',
                    parentYAxisId: 'mainSurfaceYAxis2',
                    position: new Rect(0, 5, 4, 3),
                },
            },
        ],
    });

    // get the sub-chart surface from collection
    const [subChartSurface] = sciChartSurface.subCharts;

    // modify sub-chart position
    subChartSurface.coordinateMode = ECoordinateMode.Pixel;
    subChartSurface.subPosition = new Rect(100, 100, 200, 200);
}

export async function subChartPadding(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add a sub-chart to the main surface
    const subChartSurface = sciChartSurface.addSubChart({
        position: new Rect(0, 0, 0.5, 0.5),
        subChartPadding: new Thickness(10, 20, 15, 30),
    });

    subChartSurface.xAxes.add(new NumericAxis(wasmContext));
    subChartSurface.yAxes.add(new NumericAxis(wasmContext));
}

export async function nonTransparentSubChart(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [1, 2, 3, 4, 5],
                yValues: [3, 4, 7, 8, 9],
            }),
        })
    );

    // Add a sub-chart with non transparent background
    const subChartSurface = sciChartSurface.addSubChart({
        position: new Rect(0, 0, 0.5, 0.5),
        isTransparent: false,
    });

    subChartSurface.xAxes.add(new NumericAxis(wasmContext));
    subChartSurface.yAxes.add(new NumericAxis(wasmContext));
}

export async function nonTransparentSubChartWithBuilderApi(divElementId) {
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        xAxes: { type: EAxisType.NumericAxis },
        yAxes: { type: EAxisType.NumericAxis },
        series: {
            type: ESeriesType.LineSeries,
            xyData: {
                xValues: [1, 2, 3, 4, 5],
                yValues: [3, 4, 7, 8, 9],
            },
        },
        subCharts: [
            {
                surface: {
                    position: new Rect(0, 0, 0.5, 0.5),
                    isTransparent: false,
                },
            },
        ],
    });
}

simpleSubChart('scichart-div-0');
subChartWithBuilderApi('scichart-div-0b');
subChartOverLineSeries('scichart-div-1');
subChartOverLineSeriesWithBuilderApi('scichart-div-1b');
subChartDataValueCoordinateMode('scichart-div-2');
subChartDataValueCoordinateModeWithBuilderApi('scichart-div-2b');
subChartParentAxes('scichart-div-3');
subChartParentAxesWithBuilderApi('scichart-div-3b');
updateSubChartPosition('scichart-div-4');
updateSubChartPositionWithBuilderApi('scichart-div-4b');
subChartPadding('scichart-div-5');
nonTransparentSubChart('scichart-div-6');
nonTransparentSubChartWithBuilderApi('scichart-div-6b');
subChartPixelCoordinateMode("scichart-div-7");
