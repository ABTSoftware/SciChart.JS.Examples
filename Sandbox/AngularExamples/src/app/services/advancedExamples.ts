import { EXAMPLES_PAGES } from "./angularExample";

import { AppComponent as AppLineChartComponent } from "../../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/LineChart/angular";
import { AppComponent as AppRealTimeMountainComponent } from "../../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/RealTimeMountainChart/angular";
import { AppComponent as ImageLabelsComponent } from "../../../../../Examples/src/components/Examples/Charts2D/AxisLabelCustomization/ImageLabels/angular";
import { AppComponent as AnnotationsAreEasyComponent } from "../../../../../Examples/src/components/Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy/angular";
import { AppComponent as UsePointMarkers } from "../../../../../Examples/src/components/Examples/Charts2D/StylingAndTheming/UsePointMarkers/angular";
import { AppComponent as TenorCurves3D } from "../../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/TenorCurves3D/angular";
import { AppComponent as CustomFilters } from "../../../../../Examples/src/components/Examples/Charts2D/Filters/CustomFilters/angular";
import { AppComponent as StackedColumnChart } from "../../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/StackedColumnChart/angular";
import { AppComponent as InteractiveWaterfallChartComponent } from "../../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/InteractiveWaterfallChart/angular";
import { AppComponent as EditableAnnotationsComponent } from "../../../../../Examples/src/components/Examples/Charts2D/ChartAnnotations/EditableAnnotations/angular";
import { AppComponent as Load1MillionPointsChartComponent } from "../../../../../Examples/src/components/Examples/FeaturedApps/PerformanceDemos/Load1MillionPoints/angular";
import { AppComponent as RealtimePerformanceDemoComponent } from "../../../../../Examples/src/components/Examples/FeaturedApps/PerformanceDemos/RealtimePerformanceDemo/angular";
import { AppComponent as LiDAR3DPointCloudDemoComponent } from "../../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/LiDAR3DPointCloudDemo/angular";
import { AppComponent as UserAnnotatedStockChartComponent } from "../../../../../Examples/src/components/Examples/Charts2D/CreateStockCharts/UserAnnotatedStockChart/angular";
import { AppComponent as MultiPaneStockChartsComponent } from "../../../../../Examples/src/components/Examples/Charts2D/CreateStockCharts/MultiPaneStockCharts/angular";
import { AppComponent as AudioAnalyzerComponent } from "../../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/AudioAnalyzer/angular";
import { AppComponent as VitalSignsMonitorComponent } from "../../../../../Examples/src/components/Examples/FeaturedApps/MedicalCharts/VitalSignsMonitorDemo/angular";
import { AppComponent as HeatmapChartComponent } from "../../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/HeatmapChart/angular";
import { AppComponent as Load500By500ChartComponent } from "../../../../../Examples/src/components/Examples/FeaturedApps/PerformanceDemos/Load500By500/angular";
import { AppComponent as PointLine3DChartComponent } from "../../../../../Examples/src/components/Examples/Charts3D/Basic3DChartTypes/PointLine3DChart/angular";
import { AppComponent as HeatmapInteractionsComponent } from "../../../../../Examples/src/components/Examples/FeaturedApps/ShowCases/HeatmapInteractions/angular";
// import {RealtimeBigDataShowcaseComponent} from '../../../../Examples/src/components/Examples/FeaturedApps/ShowCases/WebsocketBigData/angular'

const examplesWithNonDefaultSetup = {
    [EXAMPLES_PAGES.chart2D_basicCharts_LineChart.id]: AppLineChartComponent,
    [EXAMPLES_PAGES.chart2D_basicCharts_RealtimeMountainChart.id]: AppRealTimeMountainComponent,
    [EXAMPLES_PAGES.chart2D_axisLabelCustomization_ImageLabels.id]: ImageLabelsComponent,
    [EXAMPLES_PAGES.chart2D_chartAnnotations_AnnotationsAreEasy.id]: AnnotationsAreEasyComponent,
    [EXAMPLES_PAGES.chart2D_stylingAndTheming_UsePointMarkers.id]: UsePointMarkers,
    [EXAMPLES_PAGES.featuredApps_scientificCharts_TenorCurvesDemo.id]: TenorCurves3D,
    [EXAMPLES_PAGES.featuredApps_scientificCharts_WaterfallChartDemo.id]: InteractiveWaterfallChartComponent,
    [EXAMPLES_PAGES.chart2D_filters_CustomFilters.id]: CustomFilters,
    [EXAMPLES_PAGES.chart2D_basicCharts_StackedColumnChart.id]: StackedColumnChart,
    [EXAMPLES_PAGES.chart2D_chartAnnotations_EditableAnntations.id]: EditableAnnotationsComponent,
    [EXAMPLES_PAGES.featuredApps_performanceDemos_LoadOneMillionPoints.id]: Load1MillionPointsChartComponent,
    [EXAMPLES_PAGES.featuredApps_performanceDemos_RealtimePerformanceDemo.id]: RealtimePerformanceDemoComponent,
    [EXAMPLES_PAGES.featuredApps_scientificCharts_Lidar3DPointCloudDemo.id]: LiDAR3DPointCloudDemoComponent,
    [EXAMPLES_PAGES.chart2D_createStockCharts_SharedChart.id]: UserAnnotatedStockChartComponent,
    [EXAMPLES_PAGES.chart2D_createStockCharts_MultiPaneStockCharts.id]: MultiPaneStockChartsComponent,
    [EXAMPLES_PAGES.featuredApps_medicalCharts_VitalSignsMonitorDemo.id]: VitalSignsMonitorComponent,
    [EXAMPLES_PAGES.featuredApps_showcases_richInteractions.id]: HeatmapInteractionsComponent,
    [EXAMPLES_PAGES.featuredApps_scientificCharts_AudioAnalyzerDemo.id]: AudioAnalyzerComponent,
    [EXAMPLES_PAGES.chart2D_basicCharts_HeatmapChart.id]: HeatmapChartComponent,
    [EXAMPLES_PAGES.featuredApps_performanceDemos_Load500By500.id]: Load500By500ChartComponent,
    [EXAMPLES_PAGES.chart3D_basic3DChartTypes_PointLine3DChart.id]: PointLine3DChartComponent,
    // [EXAMPLES_PAGES.featuredApps_showcases_realtimebigdata.id ]: RealtimeBigDataShowcaseComponent,
};

const routeToExampleIdMap: Record<string, string> = Object.values(EXAMPLES_PAGES).reduce((acc, page) => {
    return Object.assign(acc, { [page.path]: page.id });
}, {});

export const getComponentByRoute = (path: string) => {
    const exampleId = routeToExampleIdMap[path];
    return examplesWithNonDefaultSetup[exampleId];
};
