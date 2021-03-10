import * as React from "react";

import { EXAMPLES_PAGES } from "../AppRouter/examplePages";
import GalleryCard from "./GalleryCard";
// Featured Apps
import load500Img from "../Examples/FeaturedApps/PerformanceDemos/Load500By500/javascript-chart-load-500-series-by-500-points.jpg";
import realtimePerformanceImg from "../Examples/FeaturedApps/PerformanceDemos/RealtimePerformanceDemo/javascript-chart-realtime-performance-demo.jpg";
import ghostedTracesImg from "../Examples/FeaturedApps/PerformanceDemos/RealtimeGhostedTraces/javascript-realtime-ghosted-traces-chart.jpg";
import millionPointsDemoImg from "../Examples/FeaturedApps/PerformanceDemos/Load1MillionPoints/javascript-chart-performance-one-million-points.jpg";
import lidarImg from "../Examples/FeaturedApps/ScientificCharts/LiDAR3DPointCloudDemo/javascript-3d-lidar-visualization.jpg";
import ecgImg from "../Examples/FeaturedApps/MedicalCharts/VitalSignsMonitorDemo/javascript-vital-signs-ecg-medical-chart-example.jpg";
import audioAnalyzerImage from "../Examples/FeaturedApps/ScientificCharts/AudioAnalyzer/javascript-realtime-audio-analyzer.jpg";
import tenorCurvesImage from "../Examples/FeaturedApps/ScientificCharts/TenorCurves3D/javascript-3d-surface-mesh-tenor-curve-example.jpg";
// 2D Chart Types
import lineChartImg from "../Examples/Charts2D/BasicChartTypes/LineChart/javascript-line-chart.jpg";
import digitalLineChartImg from "../Examples/Charts2D/BasicChartTypes/DigitalLineChart/javascript-digital-line-chart.jpg";
import bandChartImg from "../Examples/Charts2D/BasicChartTypes/BandSeriesChart/javascript-band-chart.jpg";
import digitalBandChartImg from "../Examples/Charts2D/BasicChartTypes/DigitalBandSeriesChart/javascript-digital-band-chart.jpg";
import bubbleChartImg from "../Examples/Charts2D/BasicChartTypes/BubbleChart/javascript-bubble-chart.jpg";
import candlestickImg from "../Examples/Charts2D/BasicChartTypes/CandlestickChart/javascript-candlestick-chart.jpg";
import columnChartImg from "../Examples/Charts2D/BasicChartTypes/ColumnChart/javascript-column-chart.jpg";
import fanChartImg from "../Examples/Charts2D/BasicChartTypes/FanChart/javascript-fan-chart.jpg";
import heatmapImg from "../Examples/Charts2D/BasicChartTypes/HeatmapChart/javascript-heatmap-chart.jpg";
import contourImg from "../Examples/Charts2D/BasicChartTypes/ContoursChart/javascript-contours-chart.jpg";
import mountainImg from "../Examples/Charts2D/BasicChartTypes/MountainChart/javascript-mountain-chart.jpg";
import digitalMountainImg from "../Examples/Charts2D/BasicChartTypes/DigitalMountainChart/javascript-digital-mountain-chart.jpg";
import realtimeMountainImg from "../Examples/Charts2D/BasicChartTypes/RealTimeMountainChart/javascript-animated-mountain-chart.jpg";
import ohlcImg from "../Examples/Charts2D/BasicChartTypes/OhlcChart/javascript-ohlc-chart.jpg";
import scatterImg from "../Examples/Charts2D/BasicChartTypes/ScatterChart/javascript-scatter-chart.jpg";
import stackedColumnImg from "../Examples/Charts2D/BasicChartTypes/StackedColumnChart/javascript-stacked-column-chart.png";
import stackedColumnSideBySideImg from "../Examples/Charts2D/BasicChartTypes/StackedColumnSideBySide/javascript-stacked-grouped-column-chart-side-by-side.png";
import stackedMountainImg from "../Examples/Charts2D/BasicChartTypes/StackedMountainChart/javascript-stacked-mountain-chart.jpg";
import pieImg from "../Examples/Charts2D/BasicChartTypes/PieChart/javascript-pie-chart.jpg";
import donutImg from "../Examples/Charts2D/BasicChartTypes/DonutChart/javascript-donut-chart.jpg";
// Annotations and Legands
import annotationsImg from "../Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy/javascript-chart-annotations.jpg";
import editableAnnotationsImg from "../Examples/Charts2D/ChartAnnotations/EditableAnnotations/javascript-chart-editable-annotations.jpg";
import tradeMarkersImg from "../Examples/Charts2D/ChartAnnotations/TradeMarkers/javascript-stock-chart-buy-sell-markers.jpg";
import legendImg from "../Examples/Charts2D/Legends/ChartLegendsAPI/javascript-chart-legends.jpg";
// Stock Charts
import multiPaneStockImg from "../Examples/Charts2D/CreateStockCharts/MultiPaneStockCharts/javascript-multi-pane-stock-charts.jpg";
import realtimeStockImg from "../Examples/Charts2D/CreateStockCharts/RealtimeTickingStockCharts/javascript-realtime-ticking-stock-charts.jpg";
// Chart Axis API
import multipleXAxesImg from "../Examples/Charts2D/ModifyAxisBehavior/MultipleXAxes/javascript-chart-with-multiple-x-axis.jpg";
import secondaryYAxesImg from "../Examples/Charts2D/ModifyAxisBehavior/SecondaryYAxes/javascript-chart-with-secondary-y-axis.jpg";
import verticalChartImg from "../Examples/Charts2D/ModifyAxisBehavior/VerticalCharts/javascript-vertical-charts.jpg";
// Styling and Theming
import pointMarkersImg from "../Examples/Charts2D/StylingAndTheming/UsePointMarkers/javascript-chart-custom-poinmarkers.jpg";
import themeManagerImg from "../Examples/Charts2D/StylingAndTheming/UsingThemeManager/javascript-chart-themes.png";
import stylingInCodeImg from "../Examples/Charts2D/StylingAndTheming/StylingInCode/javascript-chart-styling-theming-in-code.png";
import paletteProviderImg from "../Examples/Charts2D/StylingAndTheming/PerPointColoring/javascript-chart-color-points-individually-with-paletteprovider.jpg";
import dashedLineImg from "../Examples/Charts2D/StylingAndTheming/DashedLineStyling/javascript-chart-dashed-dotted-lines.jpg";
// Tooltips and Hit-Test
import hitTestApiImg from "../Examples/Charts2D/TooltipsAndHittest/HitTestAPI/javascript-chart-hit-test-on-click.png";
import rolloverImg from "../Examples/Charts2D/TooltipsAndHittest/UsingRolloverModifierTooltips/javascript-chart-rollovermodifier-tooltips.jpg";
// Zoom and Pan Charts
import realtimeZoomPanImg from "../Examples/Charts2D/ZoomingAndPanning/RealtimeZoomPan/zoom-and-pan-a-realtime-javascript-chart.jpg";
import dragAxisToScaleImg from "../Examples/Charts2D/ZoomingAndPanning/DragAxisToScale/drag-axis-on-javascript-charts-to-scale-or-pan.jpg";
// 3D Chart Types
import bubble3dImg from "../Examples/Charts3D/Basic3DChartTypes/Bubble3DChart/javascript-3d-bubble-chart.jpg";
import mesh3dImg from "../Examples/Charts3D/Basic3DChartTypes/SurfaceMesh3DChart/javascript-3d-surface-mesh-chart.jpg";
import GalleryList from "./GalleryList/GalleryList";
import withWidth, { WithWidth } from "@material-ui/core/withWidth";
import classes from "./Gallery.module.scss";
type TProps = {};

export type GalleryItem = {
    chartGroupTitle: string;
    items: {
        imgPath: string;
        title: string;
        seoTitle: string;
        examplePath: string;
    }[];
};

const Gallery: React.FC<TProps & WithWidth> = props => {
    const examples: GalleryItem[] = [
        {
            chartGroupTitle: "Performance Demos",
            items: [
                {
                    imgPath: load500Img,
                    title: "Load 500 Series x 500 Points",
                    seoTitle: "Load 500 Series x 500 Points JavaScript Chart Performance Demo",
                    examplePath: EXAMPLES_PAGES.featuredApps_performanceDemos_Load500By500.path
                },
                {
                    imgPath: realtimePerformanceImg,
                    title: "Realtime Performance Demo",
                    seoTitle: "Realtime JavaScript Chart Performance Demo with many millions of points",
                    examplePath: EXAMPLES_PAGES.featuredApps_performanceDemos_RealtimePerformanceDemo.path
                },
                {
                    imgPath: ghostedTracesImg,
                    title: "Realtime Ghosted Traces",
                    seoTitle: "Realtime Ghosted Traces JavaScript Chart Performance demo",
                    examplePath: EXAMPLES_PAGES.featuredApps_performanceDemos_RealtimeGhostedTraces.path
                },
                {
                    imgPath: millionPointsDemoImg,
                    title: "One Million Points Demo",
                    seoTitle: "Load One Million Points in a JavaScript Chart Performance Demo",
                    examplePath: EXAMPLES_PAGES.featuredApps_performanceDemos_LoadOneMillionPoints.path
                }
            ]
        },
        {
            chartGroupTitle: "Scientific and Medical Charts",
            items: [
                {
                    imgPath: lidarImg,
                    title: "LiDAR 3D Point Cloud",
                    seoTitle: "LiDAR 3D Point Cloud of Geospatial Data in JavaScript",
                    examplePath: EXAMPLES_PAGES.featuredApps_scientificCharts_Lidar3DPointCloudDemo.path
                },
                {
                    imgPath: ecgImg,
                    title: "ECG/EKG Medical Demo",
                    seoTitle: "JavaScript Vital Signs ECG/EKG Medical Demo",
                    examplePath: EXAMPLES_PAGES.featuredApps_medicalCharts_VitalSignsMonitorDemo.path
                },
                {
                    imgPath: audioAnalyzerImage,
                    title: "Audio Analyzer Demo",
                    seoTitle: "JavaScript Realtime Audio Analyzer Demo",
                    examplePath: EXAMPLES_PAGES.featuredApps_scientificCharts_AudioAnalyzerDemo.path
                },
                {
                    imgPath: tenorCurvesImage,
                    title: "Tenor Curves 3D Demo",
                    seoTitle: "JavaScript 3D Surface Mesh Plot Tenor Curves Demo",
                    examplePath: EXAMPLES_PAGES.featuredApps_scientificCharts_TenorCurvesDemo.path
                }
            ]
        },
        {
            chartGroupTitle: "2D Chart Types",
            items: [
                {
                    imgPath: lineChartImg,
                    title: "Line Chart",
                    seoTitle: "JavaScript Line Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_LineChart.path
                },
                {
                    imgPath: bandChartImg,
                    title: "Band Chart",
                    seoTitle: "JavaScript Band Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart.path
                },
                {
                    imgPath: mountainImg,
                    title: "Mountain Chart",
                    seoTitle: "JavaScript Mountain Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_MountainChart.path
                },
                {
                    imgPath: digitalLineChartImg,
                    title: "Digital Line Chart",
                    seoTitle: "JavaScript Digital Line Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_DigitalLineChart.path
                },
                {
                    imgPath: digitalBandChartImg,
                    title: "Digital Band Chart",
                    seoTitle: "JavaScript Digital Band Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_DigitalBandSeriesChart.path
                },
                {
                    imgPath: digitalMountainImg,
                    title: "Digital Mountain Chart",
                    seoTitle: "JavaScript Digital Band Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_DigitalMountainChart.path
                },
                {
                    imgPath: realtimeMountainImg,
                    title: "Realtime Mountain Chart",
                    seoTitle: "JavaScript Realtime Mountain Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_RealtimeMountainChart.path
                },
                {
                    imgPath: bubbleChartImg,
                    title: "Bubble Chart",
                    seoTitle: "JavaScript Bubble Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_BubbleChart.path
                },
                {
                    imgPath: candlestickImg,
                    title: "Candlestick Chart",
                    seoTitle: "JavaScript Candlestick Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_CandlestickChart.path
                },
                {
                    imgPath: columnChartImg,
                    title: "Column Chart",
                    seoTitle: "JavaScript Column Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_ColumnChart.path
                },
                {
                    imgPath: fanChartImg,
                    title: "Fan Chart",
                    seoTitle: "JavaScript Fan Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_FanChart.path
                },
                {
                    imgPath: heatmapImg,
                    title: "Heatmap Chart",
                    seoTitle: "JavaScript Heatmap Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_HeatmapChart.path
                },
                {
                    imgPath: contourImg,
                    title: "Contours Chart",
                    seoTitle: "JavaScript Contours Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_ContourChart.path
                },
                {
                    imgPath: ohlcImg,
                    title: "Ohlc Chart",
                    seoTitle: "JavaScript Ohlc Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_OhlcChart.path
                },
                {
                    imgPath: scatterImg,
                    title: "Scatter Chart",
                    seoTitle: "JavaScript Scatter Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_ScatterChart.path
                },
                {
                    imgPath: stackedColumnImg,
                    title: "Stacked Chart",
                    seoTitle: "JavaScript Stacked Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_StackedColumnChart.path
                },
                {
                    imgPath: stackedColumnSideBySideImg,
                    title: "Stacked Column Side by Side",
                    seoTitle: "JavaScript Stacked Column Side by Side Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_StackedColumnSideBySide.path
                },
                {
                    imgPath: stackedMountainImg,
                    title: "Stacked Mountain Chart",
                    seoTitle: "JavaScript Stacked Mountain Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_StackedMountainChart.path
                },
                {
                    imgPath: pieImg,
                    title: "Pie Chart",
                    seoTitle: "JavaScript Pie Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_PieChart.path
                },
                {
                    imgPath: donutImg,
                    title: "Donut Chart",
                    seoTitle: "JavaScript Donut Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_basicCharts_DonutChart.path
                }
            ]
        },
        {
            chartGroupTitle: "Annotations and Legends",
            items: [
                {
                    imgPath: annotationsImg,
                    title: "Chart Annotations",
                    seoTitle: "JavaScript Chart Annotations Example",
                    examplePath: EXAMPLES_PAGES.chart2D_chartAnnotations_AnnotationsAreEasy.path
                },
                {
                    imgPath: editableAnnotationsImg,
                    title: "Chart Editable Annotations",
                    seoTitle: "JavaScript Chart Editable Annotations Example",
                    examplePath: EXAMPLES_PAGES.chart2D_chartAnnotations_EditableAnntations.path
                },
                {
                    imgPath: tradeMarkersImg,
                    title: "Trading Buy Sell Markers",
                    seoTitle: "Trading Buy Sell Marker Annotations in JavaScript Charts",
                    examplePath: EXAMPLES_PAGES.chart2D_chartAnnotations_TradeMarkers.path
                },
                {
                    imgPath: legendImg,
                    title: "Chart Legends API",
                    seoTitle: "JavaScript Chart Legend Example",
                    examplePath: EXAMPLES_PAGES.chart2D_legends_ChartLegendsAPI.path
                }
            ]
        },
        {
            chartGroupTitle: "Candlestick & Stock Charts",
            items: [
                {
                    imgPath: multiPaneStockImg,
                    title: "Multi-Pane Stock Charts",
                    seoTitle: "JavaScript Multi-Pane Stock Charts Example",
                    examplePath: EXAMPLES_PAGES.chart2D_createStockCharts_MultiPaneStockCharts.path
                },
                {
                    imgPath: realtimeStockImg,
                    title: "Realtime Ticking Stock Charts",
                    seoTitle: "JavaScript Realtime Ticking Stock Charts Example",
                    examplePath: EXAMPLES_PAGES.chart2D_createStockCharts_RealtimeTickingStockCharts.path
                }
            ]
        },
        {
            chartGroupTitle: "Chart Axis API",
            items: [
                {
                    imgPath: multipleXAxesImg,
                    title: "Multiple X Axes",
                    seoTitle: "JavaScript Chart with Multiple X Axis Example",
                    examplePath: EXAMPLES_PAGES.chart2D_modifyAxisBehavior_MultipleXAxes.path
                },
                {
                    imgPath: secondaryYAxesImg,
                    title: "Secondary Y Axes",
                    seoTitle: "JavaScript Chart with Secondary Y Axis Example",
                    examplePath: EXAMPLES_PAGES.chart2D_modifyAxisBehavior_SecondaryYAxes.path
                },
                {
                    imgPath: verticalChartImg,
                    title: "Vertical Charts",
                    seoTitle: "JavaScript Vertical Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_modifyAxisBehavior_VerticalCharts.path
                }
            ]
        },
        {
            chartGroupTitle: "Styling and Theming",
            items: [
                {
                    imgPath: pointMarkersImg,
                    title: "Point Markers",
                    seoTitle: "JavaScript Scatter Chart Custom Point Markers Example",
                    examplePath: EXAMPLES_PAGES.chart2D_stylingAndTheming_UsePointMarkers.path
                },
                {
                    imgPath: themeManagerImg,
                    title: "Theme Manager",
                    seoTitle: "JavaScript Chart Theme Manager Example",
                    examplePath: EXAMPLES_PAGES.chart2D_stylingAndTheming_UsingThemeManager.path
                },
                {
                    imgPath: stylingInCodeImg,
                    title: "Styling Chart in Code",
                    seoTitle: "JavaScript Chart Styling or Theming in Code",
                    examplePath: EXAMPLES_PAGES.chart2D_stylingAndTheming_StylingInCode.path
                },
                {
                    imgPath: paletteProviderImg,
                    title: "Coloring Series per-point",
                    seoTitle: "Coloring JavaScript Chart Series per-point using the PaletteProvider",
                    examplePath: EXAMPLES_PAGES.chart2D_stylingAndTheming_PerPointColoring.path
                },
                {
                    imgPath: dashedLineImg,
                    title: "Dashed Line Styling",
                    seoTitle: "JavaScript Dashed and Dotted Line Chart Example",
                    examplePath: EXAMPLES_PAGES.chart2D_stylingAndTheming_DashedLineStyling.path
                }
            ]
        },
        {
            chartGroupTitle: "Tooltips and Hit-Test",
            items: [
                {
                    imgPath: hitTestApiImg,
                    title: "Hit-Test API",
                    seoTitle: "JavaScript Hit-Test API Example",
                    examplePath: EXAMPLES_PAGES.chart2D_tooltipsAndHittest_HitTestApi.path
                },
                {
                    imgPath: rolloverImg,
                    title: "Rollover Modifier Tooltips",
                    seoTitle: "JavaScript Rollover Modifier Tooltips Example",
                    examplePath: EXAMPLES_PAGES.chart2D_tooltipsAndHittest_UsingRolloverModifierTooltips.path
                }
            ]
        },
        {
            chartGroupTitle: "Zoom and Pan a Chart",
            items: [
                {
                    imgPath: dragAxisToScaleImg,
                    title: "Drag Axis to Scale or Pan",
                    seoTitle: "Drag Axis on JavaScript Charts to Scale or Pan",
                    examplePath: EXAMPLES_PAGES.chart2D_zoomAndPanAChart_DragAxisToScale.path
                },
                {
                    imgPath: realtimeZoomPanImg,
                    title: "Zoom and Pan with Realtime Charts",
                    seoTitle: "Zoom and Pan a Realtime JavaScript Chart",
                    examplePath: EXAMPLES_PAGES.chart2D_zoomAndPanAChart_RealtimeZoomPan.path
                }
            ]
        },
        {
            chartGroupTitle: "3D Chart Types",
            items: [
                {
                    imgPath: bubble3dImg,
                    title: "3D Bubble Chart",
                    seoTitle: "JavaScript 3D Bubble Chart Example",
                    examplePath: EXAMPLES_PAGES.chart3D_basic3DChartTypes_Bubble3DChart.path
                },
                {
                    imgPath: mesh3dImg,
                    title: "Surface Mesh 3D",
                    seoTitle: "JavaScript Surface Mesh 3D Chart Example",
                    examplePath: EXAMPLES_PAGES.chart3D_basic3DChartTypes_SurfaceMesh3DChart.path
                }
            ]
        }
    ];
    let slidersWidth = 3;
    if (props.width === "sm") {
        slidersWidth = 2;
    } else if (props.width === "xs") {
        slidersWidth = 1;
    }
    return (
        <div className={classes.GalleryContainer}>
            {examples.map((item, index: number) => {
                return (
                    <GalleryList
                        key={item.chartGroupTitle + index}
                        slidersNumber={slidersWidth}
                        example={item}
                        length={examples.length}
                    />
                );
            })}
        </div>
    );
};

export default withWidth()(Gallery);
