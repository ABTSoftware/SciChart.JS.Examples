import { TModifierDefinition } from 'scichart/Builder/buildModifiers';
import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { Rect } from 'scichart/Core/Rect';
import { EChart2DModifierType } from 'scichart/types/ChartModifierType';
import { ESeriesType } from 'scichart/types/SeriesType';
import { chartBuilder } from 'scichart/Builder/chartBuilder';
import { I2DSubSurfaceOptions } from 'scichart/Charting/Visuals/I2DSurfaceOptions';
import { Thickness } from 'scichart/Core/Thickness';
import { ISubChartDefinition } from 'scichart/Builder/buildSurface';
import { EAxisType } from 'scichart/types/AxisType';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { ZoomPanModifier } from 'scichart/Charting/ChartModifiers/ZoomPanModifier';
import { MouseWheelZoomModifier } from 'scichart/Charting/ChartModifiers/MouseWheelZoomModifier';

const subChartsNumber = 100;
let columnsNumber = 10;
let rowsNumber = 10;

function getData(shift: number, points: number) {
    const xValues = Array.from(Array(points).keys());
    const harmonics = 20;
    const arr = Array(harmonics).fill(1);
    const yValues = getSpectrum(
        points,
        arr.map((_, i) => i / 50 + (i / 50) * Math.random() * 0.05),
        arr,
        shift
    );
    return { xValues, yValues };
}

function getSpectrum(points: number, frequencies: number[], amplitudes: number[], shift: number) {
    const values: number[] = [];
    for (let x = 0; x < points; x++) {
        let y = 0;
        for (let i = 0; i < frequencies.length; i++) {
            y = y + amplitudes[i] * Math.sin((x + shift) * frequencies[i]);
        }
        values.push(y);
    }
    return values;
}

function getSubChartPositionIndexes(chartIndex: number, columnNumber: number) {
    const rowIndex = Math.floor(chartIndex / columnNumber);
    const columnIndex = chartIndex % columnNumber;
    return { rowIndex, columnIndex };
}

export const createChart = async (rootDivElementId: string) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootDivElementId, {
        padding: Thickness.fromNumber(0),
    });

    for (let subChartIndex = 0; subChartIndex < subChartsNumber; ++subChartIndex) {
        const { rowIndex, columnIndex } = getSubChartPositionIndexes(subChartIndex, columnsNumber);
        const width = 1 / columnsNumber;
        const height = 1 / rowsNumber;

        const position = new Rect(columnIndex * width, rowIndex * height, width, height);

        const subChartOptions: I2DSubSurfaceOptions = {
            subChartPadding: Thickness.fromNumber(10),
            id: `subChart-${subChartIndex}`,
            position,
        };

        const subSurface = sciChartSurface.addSubChart(subChartOptions);
        
        subSurface.xAxes.add(new NumericAxis(wasmContext, { isVisible: false }));
        subSurface.yAxes.add(new NumericAxis(wasmContext, { isVisible: false }));
        
        subSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { containsNaN: false, isSorted: true, ...getData(0, 1000) }),
                stroke: '#44C8F1',
                strokeThickness: 3,
            })
        );
        subSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier())
    }

    sciChartSurface.subCharts.forEach((subSurface) => {
        // synchronise x ranges
        subSurface.xAxes.get(0).visibleRangeChanged.subscribe((data) => {
            sciChartSurface.subCharts.forEach((otherSubSurface) => {
                if (subSurface !== otherSubSurface) {
                    otherSubSurface.xAxes.get(0).visibleRange = data.visibleRange;
                }
            });
        });
    });

    return sciChartSurface;
};

export const createChartWithBuilderApi = async (rootDivElementId: string) => {
    const modifiers: TModifierDefinition[] = [
        { type: EChart2DModifierType.ZoomPan },
        { type: EChart2DModifierType.MouseWheelZoom },
    ];

    const subCharts: ISubChartDefinition[] = [];
    for (let subChartIndex = 0; subChartIndex < subChartsNumber; ++subChartIndex) {
        const { rowIndex, columnIndex } = getSubChartPositionIndexes(subChartIndex, columnsNumber);
        const width = 1 / columnsNumber;
        const height = 1 / rowsNumber;

        const position = new Rect(columnIndex * width, rowIndex * height, width, height);

        subCharts.push({
            surface: {
                id: `subChart-${subChartIndex}`,
                subChartPadding: Thickness.fromNumber(10),
                position,
            },
            xAxes: {
                type: EAxisType.NumericAxis,
                options: { isVisible: false },
            },
            yAxes: {
                type: EAxisType.NumericAxis,
                options: { isVisible: false },
            },
            series: {
                type: ESeriesType.LineSeries,
                xyData: { containsNaN: false, isSorted: true, ...getData(0, 1000) },
                options: { stroke: '#44C8F1', strokeThickness: 3 },
            },
            modifiers,
        });
    }

    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(rootDivElementId, {
        surface: { padding: Thickness.fromNumber(0) },
        subCharts,
    });

    sciChartSurface.subCharts.forEach((subSurface) => {
        // synchronise x ranges
        subSurface.xAxes.get(0).visibleRangeChanged.subscribe((data) => {
            sciChartSurface.subCharts.forEach((otherSubSurface) => {
                if (subSurface !== otherSubSurface) {
                    otherSubSurface.xAxes.get(0).visibleRange = data.visibleRange;
                }
            });
        });
    });

    return sciChartSurface;
};

createChart('scichart-root-1');
createChartWithBuilderApi('scichart-root-2');
