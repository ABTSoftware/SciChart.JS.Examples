import {
    drawSimpleChartUsingBuilderApi,
    drawComplexChartUsingBuilderApi,
} from "./BasicExample";
import {
    drawWithComplexOptionsUsingBuilderApi,
    drawChartWithRegisteredFunctionUsingBuilderApi,
    drawChartWithCustomSubtypeUsingBuilderApi,
    drawWithComplexOptionsAlternativeUsingBuilderApi,
} from "./ComplexOptions";
import {
    drawChartWithSharedDataSeries,
    drawChartWithManuallyCreatedDataSeries,
    drawChartWithBuiltRenderableSeries,
} from "./SupplyingData";
import {
    drawAndSerializeChart,
    deserializeAndDrawChart,
} from "./SerializationAndDeserialization";
import { drawChartWithMetaData } from "./MetaData";
import {
    drawSimplePieChartUsingBuilderApi,
    drawSimplePieChartUsingGenericBuilderApi,
} from "./PieChart";
import { drawChartWithFilterUsingBuilderApi } from "./FilterApi";

drawSimpleChartUsingBuilderApi("scichart-div-1");
drawComplexChartUsingBuilderApi("scichart-div-2");
//drawWithComplexOptionsUsingBuilderApi("scichart-div-3");
drawWithComplexOptionsAlternativeUsingBuilderApi("scichart-div-3");
drawChartWithRegisteredFunctionUsingBuilderApi("scichart-div-4");
drawChartWithCustomSubtypeUsingBuilderApi("scichart-div-5");
drawChartWithSharedDataSeries("scichart-div-6");
drawChartWithManuallyCreatedDataSeries("scichart-div-7");
drawChartWithBuiltRenderableSeries("scichart-div-8");
drawAndSerializeChart("scichart-div-9");
deserializeAndDrawChart("scichart-div-10");
drawChartWithMetaData("scichart-div-11");
drawSimplePieChartUsingBuilderApi("scichart-div-12");
drawSimplePieChartUsingGenericBuilderApi("scichart-div-13");
drawChartWithFilterUsingBuilderApi("scichart-div-14");
