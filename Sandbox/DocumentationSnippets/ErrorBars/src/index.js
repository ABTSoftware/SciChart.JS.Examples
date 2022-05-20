import {
    drawBasicErrorBarsChart,
    drawHorizontalErrorBars,
    drawErrorBarsWithErrorMode,
    drawErrorBarsWithCustomOptions,
    drawErrorBarsWithBuilderApi,
} from './ErrorBarsChartExamples';

const divElementId1 = 'scichart-div-1';
const divElementId2 = 'scichart-div-2';
const divElementId3 = 'scichart-div-3';
const divElementId4 = 'scichart-div-4';
const divElementId5 = 'scichart-div-5';
const divElementId6 = 'scichart-div-6';
const divElementId7 = 'scichart-div-7';
const divElementId8 = 'scichart-div-8';

drawBasicErrorBarsChart(divElementId1);
drawHorizontalErrorBars(divElementId2);
drawErrorBarsWithErrorMode(divElementId3);
drawErrorBarsWithCustomOptions(divElementId4);
drawErrorBarsWithBuilderApi(divElementId5);
