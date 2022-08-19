import {drawLineSeries} from "./LineSeriesExample";
import {drawLineSeriesBuilderApi} from "./LineSeriesExampleBuilderApi";
import {drawLineSeriesNanGaps} from "./LineSeriesExampleNanGaps";
import {drawLineSeriesNanGapsBuilderApi} from "./LineSeriesExampleNanGapsBuilderApi";
import {drawLineSeriesPointMarkers} from "./LineSeriesExamplePointMarkers";
import {drawLineSeriesPointMarkersBuilderApi} from "./LineSeriesExamplePointMarkersBuilderApi";
import {drawLineSeriesPaletteProvider} from "./LineSeriesExamplePaletteProvider";
import {drawLineSeriesPaletteProviderBuilderApi} from "./LineSeriesExamplePaletteProviderBuilderApi";

const divElementId1 = 'scichart-div-1';
const divElementId2 = 'scichart-div-2';
const divElementId3 = 'scichart-div-3';
const divElementId4 = 'scichart-div-4';
const divElementId5 = 'scichart-div-5';
const divElementId6 = 'scichart-div-6';
const divElementId7 = 'scichart-div-7';
const divElementId8 = 'scichart-div-8';

drawLineSeries(divElementId1);
drawLineSeriesBuilderApi(divElementId2);
drawLineSeriesNanGaps(divElementId3);
drawLineSeriesNanGapsBuilderApi(divElementId4);
drawLineSeriesPointMarkers(divElementId5);
drawLineSeriesPointMarkersBuilderApi(divElementId6);
drawLineSeriesPaletteProvider(divElementId7);
drawLineSeriesPaletteProviderBuilderApi(divElementId8);
