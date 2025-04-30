import { EXAMPLES_PAGES, TExamplePage } from "./examplePages";

export type TMenuItem = {
    id: string;
    title: string;
    submenu: TExamplePage[];
};

export const MENU_ITEMS_FEATURED_APPS_ID = "MENU_ITEMS_FEATURED_APPS_ID";
export const MENU_ITEMS_FEATURED_APPS: TMenuItem[] = [
    {
        id: "featuredApps_performanceDemos",
        title: "Performance Demos & Showcases",
        submenu: [
            EXAMPLES_PAGES.featuredApps_performanceDemos_RealtimePerformanceDemo,
            EXAMPLES_PAGES.featuredApps_performanceDemos_Load500By500,
            EXAMPLES_PAGES.featuredApps_performanceDemos_LoadOneMillionPoints,
            EXAMPLES_PAGES.featuredApps_performanceDemos_RealtimeGhostedTraces,
            EXAMPLES_PAGES.featuredApps_scientificCharts_AudioAnalyzerDemo,
            EXAMPLES_PAGES.featuredApps_showcases_oilandgasdashboard,
            EXAMPLES_PAGES.featuredApps_showcases_realtimebigdata,
            EXAMPLES_PAGES.featuredApps_showcases_servertrafficdashboard,
            EXAMPLES_PAGES.featuredApps_showcases_richInteractions,
            EXAMPLES_PAGES.featuredApps_showcases_dynamicLayout,
            EXAMPLES_PAGES.featuredApps_showcases_eventMarkers,
            EXAMPLES_PAGES.featuredApps_showcases_populationPyramid,
        ],
    },
    {
        id: "featuredApps_scientificCharts",
        title: "Scientific & Medical Charts",
        submenu: [
            EXAMPLES_PAGES.featuredApps_medicalCharts_VitalSignsMonitorDemo,
            EXAMPLES_PAGES.chart2D_modifyAxisBehavior_LogarithmicAxis,
            EXAMPLES_PAGES.featuredApps_scientificCharts_Lidar3DPointCloudDemo,
            EXAMPLES_PAGES.chart2D_modifyAxisBehavior_VerticallyStackedAxes,
            EXAMPLES_PAGES.featuredApps_scientificCharts_AudioAnalyzerDemo,
            EXAMPLES_PAGES.featuredApps_scientificCharts_WaterfallChartDemo,
        ],
    },
    {
        id: "featuredApps_financialCharts",
        title: "Financial Charts",
        submenu: [
            EXAMPLES_PAGES.chart2D_basicCharts_CandlestickChart,
            EXAMPLES_PAGES.chart2D_basicCharts_OhlcChart,
            EXAMPLES_PAGES.chart2D_createStockCharts_RealtimeTickingStockCharts,
            EXAMPLES_PAGES.chart2D_createStockCharts_SubchartStockCharts,
            EXAMPLES_PAGES.featuredApps_scientificCharts_TenorCurvesDemo,
            EXAMPLES_PAGES.chart2D_createStockCharts_MultiPaneStockCharts,
            EXAMPLES_PAGES.chart2D_createStockCharts_DepthChart,
            EXAMPLES_PAGES.chart2D_chartAnnotations_TradeMarkers,
            EXAMPLES_PAGES.chart2D_createStockCharts_SharedChart,
        ],
    },
];

export const MENU_ITEMS_2D_ID = "MENU_ITEMS_2D_ID";
export const MENU_ITEMS_2D: TMenuItem[] = [
    {
        id: "chart2D_basicCharts",
        title: "JavaScript Chart Types",
        submenu: [
            EXAMPLES_PAGES.chart2D_basicCharts_LineChart,
            EXAMPLES_PAGES.chart2D_basicCharts_SplineLineChart,
            EXAMPLES_PAGES.chart2D_basicCharts_DigitalLineChart,
            EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart,
            EXAMPLES_PAGES.chart2D_basicCharts_SplineBandChart,
            EXAMPLES_PAGES.chart2D_basicCharts_DigitalBandSeriesChart,
            EXAMPLES_PAGES.chart2D_basicCharts_BubbleChart,
            EXAMPLES_PAGES.chart2D_basicCharts_CandlestickChart,
            EXAMPLES_PAGES.chart2D_basicCharts_ColumnChart,
            EXAMPLES_PAGES.featuredApps_showcases_populationPyramid,
            EXAMPLES_PAGES.chart2D_basicCharts_HistogramChart,
            // EXAMPLES_PAGES.chart2D_basicCharts_GanttChart, // uncomment when ready
            EXAMPLES_PAGES.chart2D_basicCharts_ErrorBarsChart,
            EXAMPLES_PAGES.chart2D_basicCharts_BoxPlotChart,
            EXAMPLES_PAGES.chart2D_basicCharts_TriangleSeriesChart,
            EXAMPLES_PAGES.chart2D_basicCharts_TreemapChart,
            EXAMPLES_PAGES.chart2D_basicCharts_ImpulseChart,
            EXAMPLES_PAGES.chart2D_basicCharts_TextChart,
            EXAMPLES_PAGES.chart2D_basicCharts_FanChart,
            EXAMPLES_PAGES.chart2D_basicCharts_HeatmapChart,
            EXAMPLES_PAGES.chart2D_basicCharts_NonUniformHeatmapChart,
            EXAMPLES_PAGES.chart2D_basicCharts_ContourChart,
            EXAMPLES_PAGES.chart2D_basicCharts_MountainChart,
            EXAMPLES_PAGES.chart2D_basicCharts_SplineMountainChart,
            EXAMPLES_PAGES.chart2D_basicCharts_DigitalMountainChart,
            EXAMPLES_PAGES.chart2D_basicCharts_RealtimeMountainChart,
            EXAMPLES_PAGES.chart2D_basicCharts_ScatterChart,
            EXAMPLES_PAGES.chart2D_basicCharts_StackedColumnChart,
            EXAMPLES_PAGES.chart2D_basicCharts_StackedColumnSideBySide,
            EXAMPLES_PAGES.chart2D_basicCharts_StackedMountainChart,
            EXAMPLES_PAGES.chart2D_basicCharts_SmoothStackedMountainChart,
            EXAMPLES_PAGES.chart2D_basicCharts_PieChart,
            EXAMPLES_PAGES.chart2D_basicCharts_DonutChart,
            EXAMPLES_PAGES.chart2D_chartAnnotations_BackgroundAnnotations,
        ],
    },
    {
        id: "chart2D_polarCharts",
        title: "Polar Charts",
        submenu: [
            EXAMPLES_PAGES.chart2D_polarCharts_PolarLineChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarSplineLineChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarLineTemperatureAverage,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarColumnChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarColumnCategoryChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarRangeColumnChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarWindroseColumnChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarSunburstChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarRadialColumnChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarStackedRadialColumnChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarMountainChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarStackedMountainChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarBandChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarScatterChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarRadarChart,
            // EXAMPLES_PAGES.chart2D_polarCharts_PolarPieChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarGaugesChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarGaugeFifoDashboard,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarUniformHeatmapChart,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarUniformHeatmapUltrasound,
            // EXAMPLES_PAGES.chart2D_polarCharts_PolarSignalsIntelligenceDashboard,

            EXAMPLES_PAGES.chart2D_polarCharts_PolarPartialArc,
            EXAMPLES_PAGES.chart2D_polarCharts_PolarLabelMode,
        ],
    },
    {
        id: "chart2D_chartAnnotations",
        title: "Chart Annotations",
        submenu: [
            EXAMPLES_PAGES.chart2D_chartAnnotations_AnnotationsAreEasy,
            EXAMPLES_PAGES.chart2D_stylingAndTheming_PerPointColoring,
            EXAMPLES_PAGES.chart2D_chartAnnotations_TradeMarkers,
            EXAMPLES_PAGES.chart2D_chartAnnotations_DragHorizontalThreshold,
            EXAMPLES_PAGES.chart2D_chartAnnotations_EditableAnntations,
            EXAMPLES_PAGES.chart2D_chartAnnotations_BackgroundAnnotations,
            EXAMPLES_PAGES.chart2D_chartAnnotations_AnnotationLayers,
        ],
    },
    {
        id: "chart2D_legends",
        title: "Chart Legends",
        submenu: [EXAMPLES_PAGES.chart2D_legends_ChartLegendsAPI],
    },
    {
        id: "chart2D_modifyAxisBehavior",
        title: "Chart Axis APIs",
        submenu: [
            EXAMPLES_PAGES.chart2D_modifyAxisBehavior_MultipleXAxes,
            EXAMPLES_PAGES.chart2D_modifyAxisBehavior_SecondaryYAxes,
            EXAMPLES_PAGES.chart2D_modifyAxisBehavior_VerticalCharts,
            EXAMPLES_PAGES.chart2D_modifyAxisBehavior_CentralAxes,
            EXAMPLES_PAGES.chart2D_modifyAxisBehavior_StaticAxis,
            EXAMPLES_PAGES.chart2D_modifyAxisBehavior_VerticallyStackedAxes,
            EXAMPLES_PAGES.chart2D_modifyAxisBehavior_LogarithmicAxis,
            EXAMPLES_PAGES.chart2D_modifyAxisBehavior_DrawBehindAxes,
            EXAMPLES_PAGES.featuredApps_featureDemos_axisTypes,
            EXAMPLES_PAGES.featuredApps_featureDemos_axisLayout,
        ],
    },
    {
        id: "chart2D_axisLabelCustomization",
        title: "Axis Label Customization",
        submenu: [
            EXAMPLES_PAGES.chart2D_axisLabelCustomization_MultiLineLabels,
            EXAMPLES_PAGES.chart2D_axisLabelCustomization_ImageLabels,
            EXAMPLES_PAGES.chart2D_axisLabelCustomization_RotatedLabels,
        ],
    },
    {
        id: "chart2D_stylingAndTheming",
        title: "Styling and Theming",
        submenu: [
            EXAMPLES_PAGES.chart2D_stylingAndTheming_TransparentBackground,
            EXAMPLES_PAGES.chart2D_stylingAndTheming_StylingInCode,
            EXAMPLES_PAGES.chart2D_stylingAndTheming_UsingThemeManager,
            EXAMPLES_PAGES.chart2D_stylingAndTheming_CustomTheme,
            EXAMPLES_PAGES.chart2D_stylingAndTheming_PerPointColoring,
            EXAMPLES_PAGES.chart2D_stylingAndTheming_UsePointMarkers,
            EXAMPLES_PAGES.chart2D_stylingAndTheming_DashedLineStyling,
            EXAMPLES_PAGES.chart2D_stylingAndTheming_DataLabels,
            EXAMPLES_PAGES.chart2D_stylingAndTheming_MultiplePointMarkers,
            EXAMPLES_PAGES.chart2D_stylingAndTheming_LineSplittingThresholds,
            EXAMPLES_PAGES.featuredApps_featureDemos_chartTitle,
        ],
    },
    {
        id: "chart2D_tooltipsAndHittest",
        title: "Tooltips and Hit-Test",
        submenu: [
            EXAMPLES_PAGES.chart2D_tooltipsAndHittest_HitTestApi,
            EXAMPLES_PAGES.chart2D_tooltipsAndHittest_UsingRolloverModifierTooltips,
            EXAMPLES_PAGES.chart2D_tooltipsAndHittest_UsingCursorModifierTooltips,
            EXAMPLES_PAGES.chart2D_tooltipsAndHittest_VerticalSliceModifier,
            EXAMPLES_PAGES.chart2D_tooltipsAndHittest_MetaData,
            EXAMPLES_PAGES.chart2D_tooltipsAndHittest_SeriesSelection,
            EXAMPLES_PAGES.chart2D_tooltipsAndHittest_DataPointSelection,
        ],
    },
    {
        id: "chart2D_zoomingAndPanning",
        title: "Zoom and Pan a Chart",
        submenu: [
            EXAMPLES_PAGES.chart2D_modifyAxisBehavior_MultipleXAxes,
            EXAMPLES_PAGES.chart2D_modifyAxisBehavior_SecondaryYAxes,
            EXAMPLES_PAGES.chart2D_zoomAndPanAChart_DragAxisToScale,
            EXAMPLES_PAGES.chart2D_zoomAndPanAChart_RealtimeZoomPan,
            EXAMPLES_PAGES.chart2D_zoomAndPanAChart_MultipleChartModifiers,
            EXAMPLES_PAGES.chart2D_zoomAndPanAChart_Overview,
            EXAMPLES_PAGES.chart2D_zoomAndPanAChart_VirtualizedDataOverview,
            //EXAMPLES_PAGES.chart2D_zoomAndPanAChart_ZoomHighPrecision,
        ],
    },
    {
        id: "chart2D_filters",
        title: "Transforming Data with Filters",
        submenu: [
            EXAMPLES_PAGES.chart2D_filters_TrendMARatio,
            EXAMPLES_PAGES.chart2D_filters_CustomFilters,
            EXAMPLES_PAGES.chart2D_filters_PercentageChange,
            EXAMPLES_PAGES.chart2D_chartAnnotations_DragHorizontalThreshold,
        ],
    },
    {
        id: "animationApi",
        title: "Animation API",
        submenu: [
            EXAMPLES_PAGES.chart2D_Animations_DataAnimation,
            EXAMPLES_PAGES.chart2D_Animations_StyleAnimation,
            EXAMPLES_PAGES.chart2D_Animations_StartupAnimation,
            EXAMPLES_PAGES.chart2D_Animations_GenericAnimation,
        ],
    },
    {
        id: "builderApi",
        title: "Builder (JSON / JS Objects) API",
        submenu: [
            EXAMPLES_PAGES.builderApi_simplechart,
            EXAMPLES_PAGES.builderApi_fullchart,
            EXAMPLES_PAGES.builderApi_chartFromJSON,
            EXAMPLES_PAGES.builderApi_SharedData,
            EXAMPLES_PAGES.builderApi_CustomTypes,
        ],
    },
    {
        id: "subchartsApi",
        title: "Subcharts API",
        submenu: [
            EXAMPLES_PAGES.featuredApps_featureDemos_subchartsGrid,
            EXAMPLES_PAGES.featuredApps_showcases_dynamicLayout,
        ],
    },
    {
        id: "multichart",
        title: "Multiple Charts",
        submenu: [
            EXAMPLES_PAGES.chart2D_multiChart_syncMultiChart,
            EXAMPLES_PAGES.chart2D_createStockCharts_MultiPaneStockCharts,
            EXAMPLES_PAGES.featuredApps_showcases_servertrafficdashboard,
        ],
    },
];

export const MENU_ITEMS_3D_ID = "MENU_ITEMS_3D_ID";
export const MENU_ITEMS_3D: TMenuItem[] = [
    {
        id: "chart3D_Basic3DChartTypes",
        title: "JavaScript 3D Chart Types",
        submenu: [
            EXAMPLES_PAGES.chart3D_basic3DChartTypes_Bubble3DChart,
            EXAMPLES_PAGES.chart3D_basic3DChartTypes_SurfaceMesh3DChart,
            EXAMPLES_PAGES.chart3D_basic3DChartTypes_PointLine3DChart,
            EXAMPLES_PAGES.featuredApps_scientificCharts_Lidar3DPointCloudDemo,
            EXAMPLES_PAGES.featuredApps_scientificCharts_TenorCurvesDemo,
            EXAMPLES_PAGES.chart3D_basic3DChartTypes_RealtimeSurfaceMesh3DChart,
            EXAMPLES_PAGES.chart3D_basic3DChartTypes_Column3DChart,
        ],
    },
];

export const ALL_MENU_ITEMS = [...MENU_ITEMS_FEATURED_APPS, ...MENU_ITEMS_2D, ...MENU_ITEMS_3D];

export type TMultilevelMenuItem =
    | TExamplePage
    | TMenuItem
    | {
          id: string;
          title: string;
          submenu: TMenuItem[];
      }
    | {
          id: string;
          title: string;
          submenu: TMultilevelMenuItem[];
      };

export const MENU_ITEMS_HIERARCHY: TMultilevelMenuItem[] = [
    {
        id: "home",
        title: "Home",
        submenu: [
            {
                id: MENU_ITEMS_FEATURED_APPS_ID,
                title: "Featured Apps",
                submenu: MENU_ITEMS_FEATURED_APPS,
            },
            {
                id: MENU_ITEMS_2D_ID,
                title: "2D Charts",
                submenu: MENU_ITEMS_2D,
            },
            {
                id: MENU_ITEMS_3D_ID,
                title: "3D Charts",
                submenu: MENU_ITEMS_3D,
            },
        ],
    },
];

// TODO refactor. Get path state as array of category IDs
export const getExampleCategoryPath = (page: TExamplePage) => {
    const fullPath: string[] = [];
    const searchInItems = (items: TMultilevelMenuItem[]) => {
        let found = false;
        items.forEach((item) => {
            if (found) {
                return;
            }
            if ("submenu" in item) {
                const res = searchInItems(item.submenu);
                if (res) {
                    fullPath.unshift(item.id);
                    found = true;
                    return;
                }
            } else if (item.id === page.id) {
                fullPath.unshift(item.id);
                found = true;
                return;
            }
        });

        return found;
    };

    searchInItems(MENU_ITEMS_HIERARCHY);

    return fullPath;
};

export const getParentMenuIds = (exampleId: string): string[] => {
    const getSubmenuLevelIds = (menuItemsArr: TMenuItem[], id: string): string[] => {
        const res: string[] = [];
        menuItemsArr.forEach((item) => {
            item.submenu.forEach((subItem) => {
                if (subItem.id === id) {
                    res.push(item.id);
                }
            });
        });
        return res;
    };

    const resMenuLevel: string[] = [];

    const resSubmenuLevel2D = getSubmenuLevelIds(MENU_ITEMS_2D, exampleId);
    if (resSubmenuLevel2D.length > 0) {
        resMenuLevel.push(MENU_ITEMS_2D_ID);
    }

    const resSubmenuLevel3D = getSubmenuLevelIds(MENU_ITEMS_3D, exampleId);
    if (resSubmenuLevel3D.length > 0) {
        resMenuLevel.push(MENU_ITEMS_3D_ID);
    }

    const resSubmenuLevelFeaturedApps = getSubmenuLevelIds(MENU_ITEMS_FEATURED_APPS, exampleId);
    if (resSubmenuLevelFeaturedApps.length > 0) {
        resMenuLevel.push(MENU_ITEMS_FEATURED_APPS_ID);
    }

    return [...resMenuLevel, ...resSubmenuLevel2D, ...resSubmenuLevel3D, ...resSubmenuLevelFeaturedApps];
};
