import React from "react";
import { EPageLayout, GalleryItem } from "../../helpers/types/types";
import { TPage } from "./pages";
import { TFrameworkTemplate } from "../../helpers/shared/Helpers/frameworkParametrization";
import { TDocumentationLink } from "../../helpers/types/ExampleDescriptionTypes";
import EXAMPLE_PAGES_DATA from "./examplePaths";

export type TExampleInfo = {
    exampleTitle: string;
    id: string;
    /**
     * Example title
     */
    title: TFrameworkTemplate;
    /**
     * Meta title
     */
    pageTitle: TFrameworkTemplate;
    path: string;

    /**
     * Content shown below title on example page
     */
    subtitle: (frameworkName: string) => React.ReactElement | string;
    /**
     * Page meta description
     */
    metaDescription: TFrameworkTemplate;

    /**
     * The first link is used in the docs button in the header
     */
    documentationLinks: TDocumentationLink[];

    // If this example has been created on scichart.com
    onWebsite?: boolean;
    /**
     * OPTIONAL: If provided, use these items as a See Also. If not, they will be auto-generated from similar items
     * in the top level menu. See {@link getSeeAlsoGalleryItems}
     */
    seeAlso?: GalleryItem[];

    /**
     * Page meta keywords
     */
    metaKeywords: string;
    thumbnailImage?: string;
    // path to actual folder for CodeSandbox
    filepath: string;
    // additional module dependencies
    extraDependencies?: Record<string, string>;
    codeSandBoxNotWorking?: boolean;
    sandboxConfig?: Record<string, any>;
    /**
     * Markdown content for the page, will help with SEO and editing
     */
    markdownContent?: TFrameworkTemplate;
    pageLayout?: EPageLayout;
    reactComponent?: string;
    exampleDirectory?: string;
};

export type TExamplePage = TPage & TExampleInfo;

/*
function asRecord<T extends Record<string, TExamplePage>>(arg: T): T & Record<string, TExamplePage> {
    return arg;
}

const EXAMPLES_PAGES_DATA = [
    "../Examples/Charts2D/Animations/DataAnimation",
    "../Examples/Charts2D/Animations/StyleAnimation",
    "../Examples/Charts2D/Animations/StartupAnimation",
    "../Examples/Charts2D/Animations/GenericAnimation",
    "../Examples/Charts2D/BasicChartTypes/BandSeriesChart",
    "../Examples/Charts2D/BasicChartTypes/SplineBandSeriesChart",
    "../Examples/Charts2D/BasicChartTypes/DigitalBandSeriesChart",
    "../Examples/Charts2D/BasicChartTypes/FanChart",
    "../Examples/Charts2D/BasicChartTypes/BubbleChart",
    "../Examples/Charts2D/BasicChartTypes/CandlestickChart",
    "../Examples/Charts2D/BasicChartTypes/OhlcChart",
    "../Examples/Charts2D/BasicChartTypes/ErrorBarsChart",
    "../Examples/Charts2D/BasicChartTypes/ColumnChart",
    "../Examples/Charts2D/BasicChartTypes/ImpulseChart",
    "../Examples/Charts2D/BasicChartTypes/HeatmapChart",
    "../Examples/Charts2D/BasicChartTypes/NonUniformHeatmapChart",
    "../Examples/Charts2D/BasicChartTypes/ContoursChart",
    "../Examples/Charts2D/BasicChartTypes/LineChart",
    "../Examples/Charts2D/BasicChartTypes/SplineLineChart",
    "../Examples/Charts2D/BasicChartTypes/DigitalLineChart",
    "../Examples/Charts2D/BasicChartTypes/MountainChart",
    "../Examples/Charts2D/BasicChartTypes/SplineMountainChart",
    "../Examples/Charts2D/BasicChartTypes/DigitalMountainChart",
    "../Examples/Charts2D/BasicChartTypes/ScatterChart",
    "../Examples/Charts2D/BasicChartTypes/DonutChart",
    "../Examples/Charts2D/BasicChartTypes/PieChart",
    "../Examples/Charts2D/BasicChartTypes/RealTimeMountainChart",
    "../Examples/Charts2D/BasicChartTypes/TextSeriesChart",
    "../Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy",
    "../Examples/Charts2D/ChartAnnotations/AnnotationLayers",
    "../Examples/Charts2D/ChartAnnotations/EditableAnnotations",
    "../Examples/Charts2D/ChartAnnotations/TradeMarkers",
    "../Examples/Charts2D/ChartAnnotations/DragHorizontalThreshold",
    "../Examples/Charts2D/ChartAnnotations/BackgroundAnnotations",
    "../Examples/FeaturedApps/PerformanceDemos/RealtimeGhostedTraces",
    "../Examples/FeaturedApps/PerformanceDemos/Load1MillionPoints",
    "../Examples/Charts2D/CreateStockCharts/MultiPaneStockCharts",
    "../Examples/Charts2D/CreateStockCharts/RealtimeTickingStockCharts",
    "../Examples/Charts2D/CreateStockCharts/SubChartStockCharts",
    "../Examples/Charts2D/CreateStockCharts/DepthChart",
    "../Examples/Charts2D/CreateStockCharts/UserAnnotatedStockChart",
    "../Examples/Charts2D/Legends/ChartLegendsAPI",
    "../Examples/Charts2D/ModifyAxisBehavior/MultipleXAxes",
    "../Examples/Charts2D/ModifyAxisBehavior/SecondaryYAxes",
    "../Examples/Charts2D/ModifyAxisBehavior/VerticalCharts",
    "../Examples/Charts2D/ModifyAxisBehavior/CentralAxes",
    "../Examples/Charts2D/ModifyAxisBehavior/StaticAxis",
    "../Examples/Charts2D/ModifyAxisBehavior/VerticallyStackedAxes",
    "../Examples/Charts2D/ModifyAxisBehavior/LogarithmicAxis",
    "../Examples/Charts2D/ModifyAxisBehavior/DrawBehindAxes",
    "../Examples/Charts2D/AxisLabelCustomization/MultiLineLabels",
    "../Examples/Charts2D/AxisLabelCustomization/ImageLabels",
    "../Examples/Charts2D/AxisLabelCustomization/RotatedLabels",
    "../Examples/Charts2D/BasicChartTypes/StackedColumnChart",
    "../Examples/Charts2D/BasicChartTypes/StackedColumnSideBySide",
    "../Examples/Charts2D/BasicChartTypes/StackedMountainChart",
    "../Examples/Charts2D/BasicChartTypes/SmoothStackedMountainChart",
    "../Examples/Charts2D/StylingAndTheming/UsePointMarkers",
    "../Examples/Charts2D/StylingAndTheming/UsingThemeManager",
    "../Examples/Charts2D/StylingAndTheming/CreateACustomTheme",
    "../Examples/Charts2D/StylingAndTheming/StylingInCode",
    "../Examples/Charts2D/StylingAndTheming/PerPointColoring",
    "../Examples/Charts2D/StylingAndTheming/DashedLineStyling",
    "../Examples/Charts2D/StylingAndTheming/TransparentBackground",
    "../Examples/Charts2D/StylingAndTheming/DataLabels",
    "../Examples/Charts2D/StylingAndTheming/MultiStyleSeries",
    "../Examples/Charts2D/StylingAndTheming/LineSplittingThresholds",
    "../Examples/Charts2D/TooltipsAndHittest/HitTestAPI",
    "../Examples/Charts2D/TooltipsAndHittest/UsingRolloverModifierTooltips",
    "../Examples/Charts2D/TooltipsAndHittest/UsingCursorModifierTooltips",
    "../Examples/Charts2D/TooltipsAndHittest/MetaData",
    "../Examples/Charts2D/TooltipsAndHittest/DatapointSelection",
    "../Examples/Charts2D/TooltipsAndHittest/SeriesSelection",
    "../Examples/Charts2D/TooltipsAndHittest/UsingVerticalSliceModifier",
    "../Examples/Charts2D/ZoomingAndPanning/DragAxisToScale",
    "../Examples/Charts2D/ZoomingAndPanning/RealtimeZoomPan",
    "../Examples/Charts2D/ZoomingAndPanning/MultipleZoomPanModifiers",
    "../Examples/Charts2D/ZoomingAndPanning/OverviewModifier",
    "../Examples/Charts2D/ZoomingAndPanning/VirtualizedDataWithOverview",
    "../Examples/Charts2D/Filters/PercentageChange",
    "../Examples/Charts2D/Filters/TrendMARatio",
    "../Examples/Charts2D/Filters/CustomFilters",
    "../Examples/Charts2D/MultiChart/SyncMultiChart",
    "../Examples/Charts3D/Basic3DChartTypes/Bubble3DChart",
    "../Examples/Charts3D/Basic3DChartTypes/SurfaceMesh3DChart",
    "../Examples/Charts3D/Basic3DChartTypes/RealtimeSurfaceMesh3DChart",
    "../Examples/Charts3D/Basic3DChartTypes/PointLine3DChart",
    "../Examples/Charts3D/Basic3DChartTypes/Column3DChart",
    "../Examples/FeaturedApps/PerformanceDemos/Load500By500",
    "../Examples/FeaturedApps/PerformanceDemos/RealtimePerformanceDemo",
    "../Examples/FeaturedApps/MedicalCharts/VitalSignsMonitorDemo",
    "../Examples/FeaturedApps/FeatureDemos/AxisTypes",
    "../Examples/FeaturedApps/FeatureDemos/AxisLayout",
    "../Examples/FeaturedApps/FeatureDemos/ChartTitle",
    "../Examples/FeaturedApps/FeatureDemos/SubChartsAPI",
    "../Examples/FeaturedApps/ScientificCharts/LiDAR3DPointCloudDemo",
    "../Examples/FeaturedApps/ScientificCharts/AudioAnalyzer",
    "../Examples/FeaturedApps/ScientificCharts/InteractiveWaterfallChart",
    "../Examples/FeaturedApps/ScientificCharts/TenorCurves3D",
    "../Examples/FeaturedApps/ShowCases/WebsocketBigData",
    "../Examples/FeaturedApps/ShowCases/ServerTrafficDashboard",
    "../Examples/FeaturedApps/ShowCases/OilAndGasDashboard",
    "../Examples/FeaturedApps/ShowCases/HeatmapInteractions",
    "../Examples/FeaturedApps/ShowCases/DynamicLayout",
    "../Examples/FeaturedApps/ShowCases/EventMarkers",
    "../Examples/FeaturedApps/ShowCases/PopulationPyramid",
    "../Examples/BuilderApi/SimpleChart",
    "../Examples/BuilderApi/FullChart",
    "../Examples/BuilderApi/ChartFromJSON",
    "../Examples/BuilderApi/SharedData",
    "../Examples/BuilderApi/CustomTypes",
];
*/

// now update the exaples pages with dynamically loaded module as well
// and check the ids are the same
/// <reference types="webpack-env" />
declare var require: any;
// Create a webpack context for files ending with "exampleInfo.tsx" (or .js/.ts)
const examplesContext = require.context("../Examples", true, /exampleInfo(\.js|\.ts|\.tsx)?$/);

// Convert a module path to the key expected by the context.
const loadModule = (modulePath: string) => {
    const relativePath = "./" + modulePath.replace(/^(\.\.\/)+Examples\//, "");
    return examplesContext(relativePath);
};

function makeExamplesPagesNew(examples: string[]): Record<string, TExamplePage> {
    const res = examples.reduce((acc: any, path: string) => {
        const mod = loadModule(path + "/exampleInfo.tsx");
        const moduleExport = mod.default;
        moduleExport.exampleDirectory = path;
        const id = moduleExport.id;
        acc[id] = moduleExport;
        return acc;
    }, {});
    return res;
}

export const EXAMPLES_PAGES = makeExamplesPagesNew(EXAMPLE_PAGES_DATA);
