import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ChartGroupTitle from "./ChartGroupTitle";
import Grid from "@material-ui/core/Grid";
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
import classes from "./Gallery.module.scss";

type TProps = {};

const Gallery: React.FC<TProps> = props => {
    return (
        <div >
            <ChartGroupTitle title="Performance Demos" />
            <ul className={classes.Gallery}>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={load500Img}
                        title="Load 500 Series x 500 Points"
                        seoTitle="Load 500 Series x 500 Points JavaScript Chart Performance Demo"
                        examplePath={EXAMPLES_PAGES.featuredApps_performanceDemos_Load500By500.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={realtimePerformanceImg}
                        title="Realtime Performance Demo"
                        seoTitle="Realtime JavaScript Chart Performance Demo with many millions of points"
                        examplePath={EXAMPLES_PAGES.featuredApps_performanceDemos_RealtimePerformanceDemo.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={ghostedTracesImg}
                        title="Realtime Ghosted Traces"
                        seoTitle="Realtime Ghosted Traces JavaScript Chart Performance demo"
                        examplePath={EXAMPLES_PAGES.featuredApps_performanceDemos_RealtimeGhostedTraces.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={millionPointsDemoImg}
                        title="One Million Points Demo"
                        seoTitle="Load One Million Points in a JavaScript Chart Performance Demo"
                        examplePath={EXAMPLES_PAGES.featuredApps_performanceDemos_LoadOneMillionPoints.path}
                    />
                </li>
            </ul>

            <ChartGroupTitle title="Scientific and Medical Charts" />
            <ul className={classes.Gallery}>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={lidarImg}
                        title="LiDAR 3D Point Cloud"
                        seoTitle="LiDAR 3D Point Cloud of Geospatial Data in JavaScript"
                        examplePath={EXAMPLES_PAGES.featuredApps_scientificCharts_Lidar3DPointCloudDemo.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={ecgImg}
                        title="ECG/EKG Medical Demo"
                        seoTitle="JavaScript Vital Signs ECG/EKG Medical Demo"
                        examplePath={EXAMPLES_PAGES.featuredApps_medicalCharts_VitalSignsMonitorDemo.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={audioAnalyzerImage}
                        title="Audio Analyzer Demo"
                        seoTitle="JavaScript Realtime Audio Analyzer Demo"
                        examplePath={EXAMPLES_PAGES.featuredApps_scientificCharts_AudioAnalyzerDemo.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={tenorCurvesImage}
                        title="Tenor Curves 3D Demo"
                        seoTitle="JavaScript 3D Surface Mesh Plot Tenor Curves Demo"
                        examplePath={EXAMPLES_PAGES.featuredApps_scientificCharts_TenorCurvesDemo.path}
                    />
                </li>
            </ul>
            <ChartGroupTitle title="2D Chart Types" />
            <ul className={classes.Gallery}>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={lineChartImg}
                        title="Line Chart"
                        seoTitle="JavaScript Line Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_LineChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={bandChartImg}
                        title="Band Chart"
                        seoTitle="JavaScript Band Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={mountainImg}
                        title="Mountain Chart"
                        seoTitle="JavaScript Mountain Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_MountainChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={digitalLineChartImg}
                        title="Digital Line Chart"
                        seoTitle="JavaScript Digital Line Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_DigitalLineChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={digitalBandChartImg}
                        title="Digital Band Chart"
                        seoTitle="JavaScript Digital Band Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_DigitalBandSeriesChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={digitalMountainImg}
                        title="Digital Mountain Chart"
                        seoTitle="JavaScript Digital Mountain Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_DigitalMountainChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={realtimeMountainImg}
                        title="Realtime Mountain Chart"
                        seoTitle="JavaScript Realtime Mountain Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_RealtimeMountainChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={bubbleChartImg}
                        title="Bubble Chart"
                        seoTitle="JavaScript Bubble Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_BubbleChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={candlestickImg}
                        title="Candlestick Chart"
                        seoTitle="JavaScript Candlestick Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_CandlestickChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={columnChartImg}
                        title="Column Chart"
                        seoTitle="JavaScript Column Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_ColumnChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={fanChartImg}
                        title="Fan Chart"
                        seoTitle="JavaScript Fan Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_FanChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={heatmapImg}
                        title="Heatmap Chart"
                        seoTitle="JavaScript Heatmap Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_HeatmapChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={contourImg}
                        title="Contours Chart"
                        seoTitle="JavaScript Contours Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_ContourChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={ohlcImg}
                        title="Ohlc Chart"
                        seoTitle="JavaScript Ohlc Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_OhlcChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={scatterImg}
                        title="Scatter Chart"
                        seoTitle="JavaScript Scatter Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_ScatterChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={stackedColumnImg}
                        title="Stacked Column Chart"
                        seoTitle="JavaScript Stacked Column Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_StackedColumnChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={stackedColumnSideBySideImg}
                        title="Stacked Column Side by Side"
                        seoTitle="JavaScript Stacked Column Side by Side Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_StackedColumnSideBySide.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={stackedMountainImg}
                        title="Stacked Mountain Chart"
                        seoTitle="JavaScript Stacked Mountain Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_StackedMountainChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={pieImg}
                        title="Pie Chart"
                        seoTitle="JavaScript Pie Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_PieChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={donutImg}
                        title="Donut Chart"
                        seoTitle="JavaScript Donut Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_basicCharts_DonutChart.path}
                    />
                </li>
            </ul>
            <ChartGroupTitle title="Annotations and Legends" />
            <ul className={classes.Gallery}>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={annotationsImg}
                        title="Chart Annotations"
                        seoTitle="JavaScript Chart Annotations Example"
                        examplePath={EXAMPLES_PAGES.chart2D_chartAnnotations_AnnotationsAreEasy.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={editableAnnotationsImg}
                        title="Chart Editable Annotations"
                        seoTitle="JavaScript Chart Editable Annotations Example"
                        examplePath={EXAMPLES_PAGES.chart2D_chartAnnotations_EditableAnntations.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={tradeMarkersImg}
                        title="Trading Buy Sell Markers"
                        seoTitle="Trading Buy Sell Marker Annotations in JavaScript Charts"
                        examplePath={EXAMPLES_PAGES.chart2D_chartAnnotations_TradeMarkers.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={legendImg}
                        title="Chart Legends API"
                        seoTitle="JavaScript Chart Legend Example"
                        examplePath={EXAMPLES_PAGES.chart2D_legends_ChartLegendsAPI.path}
                    />
                </li>
            </ul>
            <ChartGroupTitle title="Candlestick &amp; Stock Charts" />
            <ul className={classes.Gallery}>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={multiPaneStockImg}
                        title="Multi-Pane Stock Charts"
                        seoTitle="JavaScript Multi-Pane Stock Charts Example"
                        examplePath={EXAMPLES_PAGES.chart2D_createStockCharts_MultiPaneStockCharts.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={realtimeStockImg}
                        title="Realtime Ticking Stock Charts"
                        seoTitle="JavaScript Realtime Ticking Stock Charts Example"
                        examplePath={EXAMPLES_PAGES.chart2D_createStockCharts_RealtimeTickingStockCharts.path}
                    />
                </li>
            </ul>
            <ChartGroupTitle title="Chart Axis API" />
            <ul className={classes.Gallery}>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={multipleXAxesImg}
                        title="Multiple X Axes"
                        seoTitle="JavaScript Chart with Multiple X Axis Example"
                        examplePath={EXAMPLES_PAGES.chart2D_modifyAxisBehavior_MultipleXAxes.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={secondaryYAxesImg}
                        title="Secondary Y Axes"
                        seoTitle="JavaScript Chart with Secondary Y Axis Example"
                        examplePath={EXAMPLES_PAGES.chart2D_modifyAxisBehavior_SecondaryYAxes.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={verticalChartImg}
                        title="Vertical Charts"
                        seoTitle="JavaScript Vertical Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_modifyAxisBehavior_VerticalCharts.path}
                    />
                </li>
            </ul>
            <ChartGroupTitle title="Styling and Theming" />
            <ul className={classes.Gallery}>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={pointMarkersImg}
                        title="Point Markers"
                        seoTitle="JavaScript Scatter Chart Custom Point Markers Example"
                        examplePath={EXAMPLES_PAGES.chart2D_stylingAndTheming_UsePointMarkers.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={themeManagerImg}
                        title="Theme Manager"
                        seoTitle="JavaScript Chart Theme Manager Example"
                        examplePath={EXAMPLES_PAGES.chart2D_stylingAndTheming_UsingThemeManager.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={stylingInCodeImg}
                        title="Styling Chart in Code"
                        seoTitle="JavaScript Chart Styling or Theming in Code"
                        examplePath={EXAMPLES_PAGES.chart2D_stylingAndTheming_StylingInCode.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={paletteProviderImg}
                        title="Coloring Series per-point"
                        seoTitle="Coloring JavaScript Chart Series per-point using the PaletteProvider"
                        examplePath={EXAMPLES_PAGES.chart2D_stylingAndTheming_PerPointColoring.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={dashedLineImg}
                        title="Dashed Line Styling"
                        seoTitle="JavaScript Dashed and Dotted Line Chart Example"
                        examplePath={EXAMPLES_PAGES.chart2D_stylingAndTheming_DashedLineStyling.path}
                    />
                </li>
            </ul>
            <ChartGroupTitle title="Tooltips and Hit-Test" />
            <ul className={classes.Gallery}>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={hitTestApiImg}
                        title="Hit-Test API"
                        seoTitle="JavaScript Hit-Test API Example"
                        examplePath={EXAMPLES_PAGES.chart2D_tooltipsAndHittest_HitTestApi.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={rolloverImg}
                        title="Rollover Modifier Tooltips"
                        seoTitle="JavaScript Rollover Modifier Tooltips Example"
                        examplePath={EXAMPLES_PAGES.chart2D_tooltipsAndHittest_UsingRolloverModifierTooltips.path}
                    />
                </li>
            </ul>
            <ChartGroupTitle title="Zoom and Pan a Chart" />
            <ul className={classes.Gallery}>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={dragAxisToScaleImg}
                        title="Drag Axis to Scale or Pan"
                        seoTitle="Drag Axis on JavaScript Charts to Scale or Pan"
                        examplePath={EXAMPLES_PAGES.chart2D_zoomAndPanAChart_DragAxisToScale.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={realtimeZoomPanImg}
                        title="Zoom and Pan with Realtime Charts"
                        seoTitle="Zoom and Pan a Realtime JavaScript Chart"
                        examplePath={EXAMPLES_PAGES.chart2D_zoomAndPanAChart_RealtimeZoomPan.path}
                    />
                </li>
            </ul>
            <ChartGroupTitle title="3D Chart Types" />
            <ul className={classes.Gallery}>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={bubble3dImg}
                        title="3D Bubble Chart"
                        seoTitle="JavaScript 3D Bubble Chart Example"
                        examplePath={EXAMPLES_PAGES.chart3D_basic3DChartTypes_Bubble3DChart.path}
                    />
                </li>
                <li className={classes.GalleryItem}>
                    <GalleryCard
                        imgPath={mesh3dImg}
                        title="Surface Mesh 3D"
                        seoTitle="JavaScript Surface Mesh 3D Chart Example"
                        examplePath={EXAMPLES_PAGES.chart3D_basic3DChartTypes_SurfaceMesh3DChart.path}
                    />
                </li>
            </ul>
        </div>
    );
};

export default Gallery;
