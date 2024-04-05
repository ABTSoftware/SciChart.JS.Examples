import { TFrameworkName } from "../../helpers/shared/Helpers/frameworkParametrization";

export const ExampleStrings = {
    // Site title, description for meta
    //
    siteHomeTitle: (frameworkName: TFrameworkName) =>
        `${frameworkName} Chart Examples | SciChart.js - Realtime JavaScript Charts`,
    siteKeywords: `performance, demo, chart, javascript, webgl, canvas`,
    siteHomeDescription: `Examples for SciChart.js: High Performance JavaScript Charts. Featuring 2D & 3D JavaScript Chart types, performance demos, JavaScript stock charts, Heatmaps, Bubble charts`,
    siteHomeMetaImage: `https://www.scichart.com/wp-content/uploads/2022/12/javascript-chart-collage-2022.jpg`,
    exampleGenericTitleSuffix: ` | SciChart.js Demo`,

    // Documentation links and link tooltips
    //
    urlDocumentationHome: `https://www.scichart.com/documentation/js/current/webframe.html#SciChart_JS_User_Manual.html`,
    titleDocumentationHome: `The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts`,
    urlTutorialsHome: `https://www.scichart.com/documentation/js/current/webframe.html#Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html`,
    titleTutorialsHome: `Start here with the SciChart.js Tutorials if you haven't already`,
    urlTutorials3DHome: `#`,
    titleTutorials3DHome: `Start here with the SciChart3D.js Tutorials if you haven't already`,
    urlRenderSeriesPropertiesDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Common%20RenderableSeries%20Features.html`,
    urlTitleRenderSeriesProperties: `Learn about common RenderableSeries properties in SciChart.js`,
    urlPerformanceTipsDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Common%20RenderableSeries%20Features.html`,
    urlTitlePerformanceTipsDocumentation: `Go to the Performance Tips and Tricks page in the SciChart.js Documentation`,
    urlJavascriptChartFeatures: `https://www.scichart.com/javascript-charts`,

    // Urls, example titles
    //
    // Data Animation
    urlDataAnimation: `data-animation`,
    titleDataAnimation: (frameworkName: TFrameworkName) => `${frameworkName} Chart Data Animation`,
    urlTitleDataAnimation: (frameworkName: TFrameworkName) => `${frameworkName} Chart Data Animation`,
    urlDataAnimationDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Dataset%20Animations.html`,
    urlTitleDataAnimationDocumentation: `The specific page for the JavaScript Dataset Animation documentation will help you to get started`,

    // Style Animation
    urlStyleAnimation: `style-animation`,
    titleStyleAnimation: (frameworkName: TFrameworkName) => `${frameworkName} Style Animation`,
    urlTitleStyleAnimation: (frameworkName: TFrameworkName) => `${frameworkName} Chart Style Animation`,
    urlStyleAnimationDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Series%20Style%20Animations.html`,
    urlTitleStyleAnimationDocumentation: `The specific page for the JavaScript Style Transition Animation documentation will help you to get started`,

    // OnStart Animation
    urlStartupAnimation: `startup-animation`,
    titleStartupAnimation: (frameworkName: TFrameworkName) => `${frameworkName} Startup Animation`,
    urlTitleStartupAnimation: (frameworkName: TFrameworkName) => `${frameworkName} Startup Animation`,
    urlStartupAnimationDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Series%20Startup%20Animations.html`,
    urlTitleStartupAnimationDocumentation: `The specific page for the JavaScript Startup Animation documentation will help you to get started`,

    // Generic Animations
    urlGenericAnimation: `generic-animation`,
    titleGenericAnimation: (frameworkName: TFrameworkName) => `${frameworkName} Generic Animation`,
    urlTitleGenericAnimation: (frameworkName: TFrameworkName) => `${frameworkName} Generic Animation`,
    urlGenericAnimationDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Generic%20Animations.html`,
    urlTitleGenericAnimationDocumentation: `The specific page for the JavaScript Generic Animation documentation will help you to get started`,

    // Scatter chart
    urlScatterChart: `scatter-chart`,
    titleScatterChart: (frameworkName: TFrameworkName) => `${frameworkName} Scatter Chart`,
    pageTitleScatterChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Scatter Chart | JavaScript Charts | SciChart.js`,
    urlTitleScatterChart: `The JavaScript Scatter Chart example demonstrates how to create a Scatter Chart with SciChart.js`,
    urlScatterChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Scatter%20Series%20Type.html`,
    urlTitleScatterChartDocumentation: `This specific page in the JavaScript Scatter Chart documentation will help you to get started`,

    // Band chart
    urlBandChart: `band-chart`,
    urlTitleBandChart: (frameworkName: TFrameworkName) => `${frameworkName} Band Chart example`,
    titleBandChart: (frameworkName: TFrameworkName) => `${frameworkName} Band Chart`,
    pageTitleBandChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Band Chart | JavaScript Charts | View Examples`,
    urlBandChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Band%20Series%20type.html`,
    urlTitleBandChartDocumentation: `This specific page in the JavaScript Band Chart documentation will help you to get started`,

    // Spline band chart
    titleSplineBandChart: (frameworkName: TFrameworkName) => `${frameworkName} Spline Band Chart`,
    pageTitleSplineBandChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Spline Band Chart | JavaScript Charts | SciChart`,
    urlSplineBandChart: `spline-band-chart`,
    urlSplineBandChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Spline%20(Smoothed)%20Band%20Series%20Type.html`,
    urlTitleSplineBandChartDocumentation: `This specific page in the JavaScript Spline Band Chart documentation will help you to get started`,

    // Digital Band chart
    urlDigitalBandChart: `digital-band-chart`,
    urlTitleDigitalBandChart: `Digital Band Chart example`,
    titleDigitalBandChart: (frameworkName: TFrameworkName) => `${frameworkName} Digital Band Chart`,
    pageTitleDigitalBandChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Digital Band Chart | JavaScript Chart Library`,
    urlDigitalBandChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#DigitalBandSeriesType.html`,
    urlTitleDigitalBandChartDocumentation: `This specific page in the JavaScript Digital Band Chart documentation will help you to get started`,

    // Bubble Chart
    urlBubbleChart: `bubble-chart`,
    titleBubbleChart: (frameworkName: TFrameworkName) => `${frameworkName} Bubble Chart`,
    pageTitleBubbleChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Bubble Chart | Online JavaScript Chart Examples`,
    urlBubbleChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Bubble%20Series%20Type.html`,
    urlTitleBubbleChartDocumentation: `This specific page in the JavaScript Bubble Chart documentation will help you to get started`,
    urlTitleBubbleChart: `The JavaScript Bubble Chart example demonstrates how to create a Bubble Chart with SciChart.js`,

    // Column Chart
    urlColumnChart: `column-chart`,
    titleColumnChart: (frameworkName: TFrameworkName) => `${frameworkName} Column Chart`,
    pageTitleColumnChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Column Chart | JavaScript Charts | SciChart.js`,
    urlColumnChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html`,
    urlTitleColumnChartDocumentation: `This specific page in the JavaScript Column Chart documentation will help you to get started`,
    urlTitleColumnChart: `The JavaScript Column Chart example demonstrates how to create a Column Chart with SciChart.js`,

    // Error Bars Chart
    urlErrorBarsChart: `error-bars-chart`,
    titleErrorBarsChart: (frameworkName: TFrameworkName) => `${frameworkName} Error Bars Chart`,
    pageTitleErrorBarsChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Error Bars Chart |  Online Examples | SciChart.js`,
    urlErrorBarsChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Error%20Bars%20Chart%20Type.html`,
    urlTitleErrorBarsChartDocumentation: `This specific page in the JavaScript Error Bars Chart documentation will help you to get started`,
    urlTitleErrorBarsChart: `The JavaScript Error Bars Chart example demonstrates how to create a Error Bars Chart with SciChart.js`,

    // Impulse Chart
    urlImpulseChart: `impulse-chart`,
    titleImpulseChart: (frameworkName: TFrameworkName) => `${frameworkName} Impulse Chart`,
    pageTitleImpulseChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Impulse Chart | JavaScript Charts | View Online`,
    urlImpulseChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Lollipop%20(Impulse%20or%20Stem)%20Chart%20Type.html`,
    urlTitleImpulseChartDocumentation: `This specific page in the JavaScript Impulse Chart documentation will help you to get started`,
    urlTitleImpulseChart: `The JavaScript Impulse Chart example demonstrates how to create a Impulse Chart with SciChart.js`,

    // Mountain Chart
    urlMountainChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Mountain%20(Area)%20Series%20Type.html`,
    urlTitleMountainChartDocumentation: `This specific page in the JavaScript Mountain Chart documentation will help you to get started`,
    urlMountainChart: `mountain-chart`,
    titleMountainChart: (frameworkName: TFrameworkName) => `${frameworkName} Mountain Chart`,
    pageTitleMountainChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Mountain Chart | View Examples Now | SciChart.js`,
    urlTitleMountainChart: `The JavaScript Mountain Chart example demonstrates how to create a Mountain Chart with SciChart.js`,

    // Realtime Mountain Chart
    urlRealtimeMountainChart: `realtime-mountain-chart`,
    titleRealtimeMountainChart: (frameworkName: TFrameworkName) => `${frameworkName} Realtime Mountain Chart`,
    pageTitleRealtimeMountainChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Realtime Mountain Chart | View Online At SciChart`,

    // Spline mountain chart
    urlSplineMountainChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Spline%20(Smoothed)%20Mountain%20Series%20Type.html`,
    urlTitleSplineMountainChartDocumentation: `This specific page in the JavaScript Spline Mountain Chart documentation will help you to get started`,
    urlSplineMountainChart: `spline-mountain-chart`,
    titleSplineMountainChart: (frameworkName: TFrameworkName) => `${frameworkName} Spline Mountain Chart`,
    pageTitleSplineMountainChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Spline Mountain Chart | JavaScript Chart Library`,

    // Digital Mountain Chart
    urlDigitalMountainChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Digital%20(Step)%20Mountain%20Series%20Type.html`,
    urlTitleDigitalMountainChartDocumentation: `This specific page in the JavaScript Digital Mountain Chart documentation will help you to get started`,
    urlDigitalMountainChart: `digital-mountain-chart`,
    titleDigitalMountainChart: `Digital Mountain Chart`,
    pageTitleDigitalMountainChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Digital Mountain Chart | JavaScript Chart Example`,
    urlTitleDigitalMountainChart: `The JavaScript Digital Mountain Chart example demonstrates how to create a Digital Mountain Chart with SciChart.js`,

    // Candlestick Chart
    urlCandlestickChart: `candlestick-chart`,
    titleCandlestickChart: (frameworkName: TFrameworkName) => `${frameworkName} Candlestick Chart`,
    pageTitleCandlestickChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Candlestick Chart | Chart Examples | SciChart.js`,
    urlTitleCandlestickChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Candlestick Chart example demonstrates how to create a Candlestick Chart with SciChart.js`,
    urlTitleCandlestickChartDocumentation: `This specific page in the JavaScript Candlestick Chart documentation will help you to get started`,
    urlCandlestickChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Candlestick%20Series%20type.html`,

    // Ohlc Chart
    urlOhlcChart: `ohlc-chart`,
    urlTitleOhlcChart: `The OHLC Chart example shows how to create a JavaScript OHLC Chart rendering financial stock data with SciChart.js`,
    titleOhlcChart: (frameworkName: TFrameworkName) => `${frameworkName} OHLC Chart`,
    pageTitleOhlcChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} OHLC Chart | JavaScript Chart Examples | SciChart`,
    urlTitleOhlcChartDocumentation: `This specific page in the JavaScript OHLC Chart documentation will help you to get started`,
    urlOhlcChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20OHLC%20Series%20Type.html`,

    // Fan Chart
    urlFanChart: `fan-chart`,
    urlTitleFanChart: (frameworkName: TFrameworkName) => `${frameworkName} Fan Chart example`,
    titleFanChart: (frameworkName: TFrameworkName) => `${frameworkName} Fan Chart`,
    pageTitleFanChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Fan Chart | JavaScript Chart Library | View Now`,
    urlFanChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Fan%20Charts%20Type.html`,
    urlTitleFanChartDocumentation: `The specific page for the JavaScript Fan Chart documentation will help you to get started`,

    // Line Chart
    urlLineChart: `line-chart`,
    titleLineChart: (frameworkName: TFrameworkName) => `${frameworkName} Line Chart`,
    pageTitleLineChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Line Chart | JavaScript Chart Examples | SciChart`,
    urlLineChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Line%20Series%20Type.html`,
    urlTitleLineChartDocumentation: `The specific page for the JavaScript Line Chart documentation will help you to get started`,

    // Spline line series
    urlSplineLineChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Spline%20(Smoothed)%20Line%20Series%20Type.html`,
    urlTitleSplineLineChartDocumentation: `The specific page for the JavaScript Spline Line Chart documentation will help you to get started`,
    titleSplineLineChart: `Spline Line Chart`,
    pageTitleSplineLineChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Spline Line Chart | JavaScript Chart Library`,
    urlSplineLineChart: `spline-line-chart`,

    // Digital Line Chart
    urlDigitalLineChart: `digital-line-chart`,
    titleDigitalLineChart: (frameworkName: TFrameworkName) => `${frameworkName} Digital Line Chart`,
    pageTitleDigitalLineChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Digital Line Chart | JavaScript Charts | View Now`,
    urlDigitalLineChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Digital%20(Step)%20Line%20Series.html`,
    urlTitleDigitalLineChartDocumentation: `The specific page for the JavaScript Digital Line Chart documentation will help you to get started`,

    // Pie Chart
    urlPieChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Pie%20Chart%20Type.html`,
    urlTitlePieChartDocumentation: `The specific page for the JavaScript Pie Chart documentation will help you to get started`,
    urlPieChart: `pie-chart`,
    urlTitlePieChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Pie Chart example demonstrates how to create an animated Pie Chart with SciChart.js`,
    titlePieChart: (frameworkName: TFrameworkName) => `${frameworkName} Pie Chart`,
    pageTitlePieChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Pie Chart | JavaScript Chart Examples | SciChart`,

    // Donut Chart
    urlDonutChart: `donut-chart`,
    titleDonutChart: `Donut Chart`,
    pageTitleDonutChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Donut Chart | JavaScript Charts | SciChart.js`,
    urlDonutChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Donut%20Chart%20Type.html`,
    urlTitleDonutChartDocumentation: `The specific page for the JavaScript Donut Chart documentation will help you to get started`,

    // Stacked Column Chart
    urlStackedColumnChart: `stacked-column-chart`,
    titleStackedColumnChart: (frameworkName: TFrameworkName) => `${frameworkName} Stacked Column Chart`,
    pageTitleStackedColumnChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Stacked Column Chart | Online JavaScript Charts`,
    urlTitleStackedColumnChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Stacked Column Chart example demonstrates how to create a Stacked Column Chart with SciChart.js`,
    urlStackedColumnChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Stacked%20Column%20Series%20Type.html`,
    urlTitleStackedColumnChartDocumentation: `The specific page for the JavaScript Stacked Column Chart documentation will help you to get started`,

    // Stacked (Grouped) Column Chart
    urlGroupedColumnChart: `stacked-grouped-column-chart-side-by-side`,
    titleGroupedColumnChart: (frameworkName: TFrameworkName) => `${frameworkName} Stacked Column Side by Side`,
    pageTitleGroupedColumnChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Stacked Group Column Chart | View Examples Now`,
    urlTitleGroupedColumnChart: `The JavaScript Stacked Column Chart side-by-side example demonstrates how to create a Grouped Column Chart with SciChart.js`,

    // Stacked Mountain Chart
    urlStackedMountainChart: `stacked-mountain-chart`,
    urlTitleStackedMountainChart: `The Stacked Mountain Chart and 100% Stacked Mountain Chart example in SciChart.js`,
    titleStackedMountainChart: (frameworkName: TFrameworkName) => `${frameworkName} Stacked Mountain Chart`,
    pageTitleStackedMountainChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Stacked Mountain Chart | JavaScript Chart Library`,
    urlStackedMountainChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Stacked%20Mountain%20Series%20Type.html`,
    urlTitleStackedMountainChartDocumentation: `The specific page for the JavaScript Stacked Mountain Chart documentation will help you to get started`,

    // Heatmap Chart
    urlHeatmapChart: `heatmap-chart`,
    urlTitleHeatmapChart: (frameworkName: TFrameworkName) => `${frameworkName} Heatmap Chart example in SciChart.js`,
    titleHeatmapChart: (frameworkName: TFrameworkName) => `${frameworkName} Heatmap Chart`,
    pageTitleHeatmapChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Heatmap Chart | JavaScript Chart Library Examples`,
    urlHeatmapChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The-Uniform-Heatmap-Chart-Type.html`,
    urlTitleHeatmapChartDocumentation: `The specific page for the JavaScript Heatmap Chart documentation will help you to get started`,

    // NonUniform Heatmap Chart
    urlNonUniformHeatmapChart: `non-uniform-heatmap-chart`,
    urlTitleNonUniformHeatmapChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Non Uniform Heatmap Chart example in SciChart.js`,
    titleNonUniformHeatmapChart: (frameworkName: TFrameworkName) => `${frameworkName} Non Uniform Heatmap Chart`,
    pageTitleNonUniformHeatmapChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Non Uniform Heatmap Chart | JavaScript Chart Library Examples`,
    urlNonUniformHeatmapChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The-Non-Uniform-Heatmap-Chart-Type.html`,
    urlTitleNonUniformHeatmapChartDocumentation: `The specific page for the JavaScript Non Uniform Heatmap Chart documentation will help you to get started`,

    // Contours chart
    urlTitleContourChartDocumentation: `The specific page for the JavaScript Contours Chart documentation will help you to get started`,
    urlContourChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Contours%20Series%20Type.html`,
    titleContourChart: (frameworkName: TFrameworkName) => `${frameworkName} Heatmap Chart With Contours`,
    pageTitleContourChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Heatmap Chart With Contours Example | SciChart.js`,
    urlContourChart: `heatmap-chart-with-contours`,

    // Annotations are easy
    urlAnnotationsAreEasy: `chart-annotations`,
    titleAnnotationsAreEasy: (frameworkName: TFrameworkName) => `${frameworkName} Chart Annotations`,
    urlAnnotationsDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Annotations%20API%20Overview.html`,
    urlTitleAnnotationsDocumentation: `The specific page for the SciChart.js Annotations documentation will help you to get started`,

    // Editable annotations
    urlEditableAnnotations: `editable-annotations`,
    titleEditableAnnotations: (frameworkName: TFrameworkName) => `${frameworkName} Chart Editable Annotations`,
    urlEditableAnnotationsDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#EditableAnnotations.html`,
    urlTitleEditableAnnotations: `The specific page for the SciChart.js Annotations documentation will help you to get started`,

    // Trademarkers
    urlTradeMarkers: `stock-chart-buy-sell-markers`,
    titleTradeMarkers: (frameworkName: TFrameworkName) => `${frameworkName} Chart Trading Buy Sell Marker Annotations`,
    urlTitleTradeMarkers: (frameworkName: TFrameworkName) =>
        `${frameworkName} Chart Trade Markers example demonstrates how to add buy/sell arrows and markers to a trading application`,

    // Drag horizontal threshold
    titleDragHorizontalThreshold: (frameworkName: TFrameworkName) => `${frameworkName} Chart Drag Horizontal Threshold`,
    urlDragHorizontalThreshold: `chart-drag-horizontal-threshold`,
    urlTitleDragHorizontalThreshold: `This Javascript chart example shows you how to add a draggable threshold and change the chart colour depending on threshold value`,

    // Background Annotations
    urlBackgroundAnnotations: `chart-background-annotations`,
    titleBackgroundAnnotations: (frameworkName: TFrameworkName) =>
        `${frameworkName} Quadrant Chart using Background Annotations`,

    // Use Pointmarkers
    urlPointMarkers: `chart-custom-pointmarkers`,
    titlePointMarkers: (frameworkName: TFrameworkName) => `${frameworkName} Point-Markers Chart`,
    urlTitlePointMarkers: (frameworkName: TFrameworkName) =>
        `${frameworkName} Chart Point-Markers example shows how to create different types of point-marker on Bubble and Scatter Series`,
    urlPointMarkersDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#DrawingPointMarkersOnSeries.html`,
    urlTitlePointMarkersDocumentation: `SciChart.js PointMarkers Documentation`,

    // Multi Pane Stock Charts
    urlMultiPaneStockChart: `multi-pane-stock-charts-sync-technique`,
    urlTitleMultiPaneStockChart: `The Multi-Pane stock chart example demonstrates multiple-series types in a realistic stock chart application`,
    titleMultiPaneStockChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Multi-Pane Stock Charts using Sync Multi-Chart`,
    pageTitleMultiPaneStockChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Multi-Pane Stock Chart | View JavaScript Charts`,

    // SubChart Stock Charts
    urluSubChartStockChart: `multi-pane-stock-charts`,
    urlTitleSubChartStockChart: `The Subchart stock chart example demonstrates multiple-series types in a realistic stock chart application using the new subcharts api`,
    titleSubChartStockChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Multi-Pane Stock Charts using Subcharts`,
    pageTitleSubChartStockChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Multi-Pane Stock Chart using Subcharts | View JavaScript Charts`,

    // Subcharts Grid
    urlSubChartsGrid: `subcharts-grid`,
    urlTitleSubChartsGridChart: `The Subcharts grid chart example demonstrates different series types placed in a grid of small charts using the new Subcharts API`,
    titleSubChartsGridChart: (frameworkName: TFrameworkName) => `${frameworkName} Charts Grid using Subcharts`,
    pageTitleSubChartsGridChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} Charts Grid using Subcharts | View JavaScript Charts`,

    // Realtime Ticking Stock Charts
    urlRealtimeTickingStockCharts: `realtime-ticking-stock-charts`,
    titleRealtimeTickingStockCharts: (frameworkName: TFrameworkName) =>
        `${frameworkName} Realtime Ticking Stock Charts`,
    pageTitleRealtimeTickingStockCharts: (frameworkName: TFrameworkName) =>
        `${frameworkName} Realtime Ticking Stock Chart | SciChart.js`,
    urlTitleRealtimeTickingStockCharts: (frameworkName: TFrameworkName) =>
        `${frameworkName} Realtime Ticking Stock Chart example shows how to pipe realtime financial data into SciChart.js Candlestick and Ohlc Chart types`,

    // Depth chart
    urlDepthChart: `depth-chart`,
    titleDepthChart: (frameworkName: TFrameworkName) => `${frameworkName} Market Depth Chart`,

    // Chart Legends
    urlChartLegends: `chart-legends`,
    titleChartLegends: `Chart Legends API`,
    urlLegendDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#LegendModifier.html`,
    urlTitleLegendDocumentation: `The specific page for the SciChart.js Legends documentation will help you to get started`,

    // Multiple XAxis
    urlMultipleXAxis: `chart-with-multiple-x-axis`,
    titleMultipleXAxis: (frameworkName: TFrameworkName) => `${frameworkName} Chart with Multiple X Axes`,
    urlTitleMultipleXAxis: (frameworkName: TFrameworkName) =>
        `The Multiple XAxes example shows how to add series with several X and Y axis to a ${frameworkName} Chart.`,
    urlMultipleXAxisDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Axis%20Alignment%20-%20Setting%20Axis%20Alignment.html`,
    urlTitleMultipleXAxisDocumentation: `SciChart.js Multiple XAxis Documentation`,

    // Secondary YAxis
    urlSecondaryYAxis: `chart-with-secondary-y-axis`,
    titleSecondaryYAxis: (frameworkName: TFrameworkName) => `${frameworkName} Chart with Secondary Y Axes`,
    urlTitleSecondaryYAxis: (frameworkName: TFrameworkName) =>
        `The Secondary YAxis example shows how to add series with multiple Y axis to a ${frameworkName} Chart.`,

    // Logarithmic Axis
    urlLogarithmicAxis: `chart-logarithmic-axis`,
    titleLogarithmicAxis: (frameworkName: TFrameworkName) => `${frameworkName} Chart with Logarithmic Axis Example`,
    urlLogarithmicAxisDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Logarithmic%20Axis.html`,
    urlTitleLogarithmicAxisDocumentation: `SciChart.js Logarithmic Axis Documentation`,

    // Vertical charts
    titleVerticalCharts: (frameworkName: TFrameworkName) => `${frameworkName} Vertical Charts`,
    urlVerticalCharts: `vertical-charts`,
    urlVerticalChartsDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Axis%20Alignment%20-%20Create%20a%20Vertical%20Chart.html`,
    urlTitleVerticalChartsDocumentation: `The specific page for the SciChart.js API documentation for Vertical Charts will help you to get started`,
    urlTitleVerticalCharts: (frameworkName: TFrameworkName) =>
        `The Vertical Charts example shows how to use Axis Alignment to rotate a ${frameworkName} Chart.`,

    // Central axes
    titleCentralAxes: (frameworkName: TFrameworkName) => `${frameworkName} Chart with Central Axes`,
    urlCentralAxes: `central-axes`,
    urlTitleCentralAxes: (frameworkName: TFrameworkName) =>
        `The Central Axes example shows how to use inner axes and layout strategies to customize layout of a ${frameworkName} Chart.`,
    urlCentralAxesDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#CentralAxisLayout.html`,
    urlTitleCentralAxesDocumentation: `SciChart.js Central Axis Documentation page`,

    // Vertically Stacked axes
    titleVerticallyStackedAxes: (frameworkName: TFrameworkName) =>
        `${frameworkName} Chart with Vertically Stacked Axes`,
    urlVerticallyStackedAxes: `vertically-stacked-axes`,
    urlTitleVerticallyStackedAxes: (frameworkName: TFrameworkName) =>
        `The Vertically Stacked Axes example shows how to use Axis Layout Strategies to customize axis placement on a ${frameworkName} Chart.`,
    imgVerticallyStackedAxes: `images/javascript-vertically-stacked-axes.png`,
    urlVerticallyStackedAxesDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Axis%20Layout%20-%20Vertically%20Stacked%20Axis.html`,
    urlTitleVerticallyStackedAxesDocumentation: `The specific page for the SciChart.js documentation for the Vertically Stacked Axes to help you to get started`,

    // Drag Axis to Scale
    titleDragAxisToScale: (frameworkName: TFrameworkName) => `Drag ${frameworkName} Chart Axis to Scale or Pan`,
    urlDragAxisToScale: `chart-drag-axis-to-scale-pan`,
    urlDragAxisToScaleDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#YAxisDragModifier.html`,
    urlTitleDragAxisToScaleDocumentation: `SciChart.js Drag Axis to Scale Documentation page`,

    // Draw Behind Axes
    titleDrawBehindAxes: (frameworkName: TFrameworkName) => `Draw ${frameworkName} Chart Behind Axis`,
    urlDrawBehindAxes: `draw-behind-axes`,
    urlTitleDrawBehindAxes: `The DrawBehindAxes example shows how to use Draw series for all SciChartSurface area of a JavaScript Chart.`,
    urlDrawBehindAxesDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Axis%20Layout%20-%20Inside%20and%20Central%20Axis.html`,
    urlTitleDrawBehindAxesDocumentation: `SciChart.js Draw Behind Axes Documentation page`,

    urlTitleInnerAxes: (frameworkName: TFrameworkName) => `${frameworkName} Inner Axes`,
    urlInnerAxes: `https://www.scichart.com/documentation/js/current/webframe.html#webframe.html#Axis%20Layout%20-%20Inside%20and%20Central%20Axis.html`,

    // Axis Layout
    titleAxisLayout: (frameworkName: TFrameworkName) => `${frameworkName} Chart Axis Layout Options`,
    urlAxisLayout: `chart-axis-layout-options`,
    urlAxisDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#StartHere-AxisOverview.html`,
    urlTitleAxisDocumentation: `SciChart.js Axis Documentation`,

    // Chart Title
    titleChartTitle: (frameworkName: TFrameworkName) => `${frameworkName} Chart Title`,
    urlChartTitle: `chart-title`,

    // Realtime Zoom Pan
    titleRealtimeZoomPan: (frameworkName: TFrameworkName) => `Zoom and Pan a Realtime ${frameworkName} Chart`,
    urlRealtimeZoomPan: `zoom-pan-realtime-javascript-chart`,

    // Multiple Zoom Pan Modifiers
    titleZoomPanWithMultipleChartModifiers: (frameworkName: TFrameworkName) =>
        `Zoom and Pan with ${frameworkName} Chart multiple Modifiers`,
    urlZoomPanWithMultipleChartModifiers: `zoom-pan-multiple-modifiers`,
    urlZoomPanModifierDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#ZoomPanModifier.html`,
    urlTitleZoomPanModifierDocumentation: `Zoom and Pan Modifier Documentation`,

    // PaletteProvider
    titlePaletteProvider: `Coloring Series per-point using the PaletteProvider`,
    urlPaletteProvider: `chart-color-points-individually-with-paletteprovider`,
    urlPaletteProviderDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20PaletteProvider%20API.html`,
    urlTitlePaletteProviderDocumentation: `The PaletteProvider API documentation`,

    // Dashed line styling
    titleDashedLineStyling: `Dashed Line Styling`,
    urlDashedLineStyling: `dashed-line-chart`,
    urlDashedLineStylingDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Series%20Styling%20-%20Dash%20Line%20Patterns.html`,
    urlTitleDashedLineStylingDocumentation: `SciChart.js Dash Line Styling Documentation page`,

    // Styling in code
    urlStylingInCode: `chart-styling-theming-in-code`,
    titleStylingInCode: (frameworkName: TFrameworkName) => `Styling a ${frameworkName} Chart in Code`,
    urlTitleStylingInCode: `The Styling in Code example shows how to use style chart parts such as Axis, Gridlines, Background.`,
    urlStylingInCodeDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Chart%20Styling%20-%20Style%20Chart%20Parts%20in%20Code.html`,
    urlTitleStylingInCodeDocumentation: `How to style chart parts in code documentation`,

    urlAxisStylingDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Axis%20Styling%20-%20Title,%20Labels,%20Gridlines%20and%20Axis%20Bands.html`,
    urlTitleAxisStylingDocumentation: `The specific page for the SciChart.js API documentation for Styling Axis and Gridlines will help you to get started`,
    imgStylingInCode: `images/javascript-chart-styling-theming-in-code.png`,

    // Transparent Background
    titleTransparentBackground: `Background Image with Transparency`,
    urlTransparentBackground: `chart-transparent-background`,
    urlTransparentBackgroundDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Chart%20Styling%20-%20Images%20in%20Background.html`,
    urlTitleTransparentBackgroundDocumentation: `How to add a background image with transparency documentation`,

    // ThemeManager
    urlThemeManager: `chart-themes`,
    titleThemeManager: (frameworkName: TFrameworkName) => `Using Theme Manager in ${frameworkName} Chart`,
    urlTitleThemeManager: (frameworkName: TFrameworkName) =>
        `The Theme Manager example shows how to use switch theme from light to dark in SciChart.js`,
    urlThemeManagerDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Chart%20Styling%20-%20ThemeManager%20API.html`,
    urlTitleThemeManagerDocumentation: `SciChart.js ThemeManager Documentation`,
    imgThemeManagerChart: `images/javascript-chart-themes.png`,

    // Create Custom Theme
    titleCustomTheme: (frameworkName: TFrameworkName) => `Create a Custom Theme for ${frameworkName} Chart`,
    urlCustomTheme: `chart-custom-themes`,
    urlCustomThemeDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html`,
    urlTitleCustomThemeDocumentation: `SciChart.js Custom Theme Documentation`,

    // Hit-Test API
    titleHitTestApi: (frameworkName: TFrameworkName) => `${frameworkName} Chart Hit-Test API`,
    urlHitTestApi: `chart-hit-test-on-click`,
    urlHitTestDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Hit-Test%20API.html`,
    urlTitleHitTestDocumentation: `SciChart.js Hit-Test API documentation`,
    imgHitTestApiChart: `images/javascript-chart-hit-test-on-click.png`,

    // DataPointSelection
    titleDataPointSelection: (frameworkName: TFrameworkName) => `${frameworkName} Chart Data Point Selection`,
    urlDataPointSelection: `datapoint-selection`,
    urlDataPointSelectionDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#DataPointSelection.html`,
    urlTitleDataPointSelectionDocumentation: `SciChart.js DataPointSelectionModifier Documentation`,
    imgDataPointSelection: `images/javascript-datapoint-selection.png`,

    // RolloverModifier
    urlRolloverModifierDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#RolloverModifier.html`,
    urlTitleRolloverModifierDocumentation: `SciChart.js RolloverModifier Documentation`,
    titleRolloverModifier: `Using Rollover Modifier Tooltips`,
    urlRolloverModifier: `chart-rollovermodifier-tooltips`,

    // VerticalSliceModifier
    urlVerticalSliceModifierDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#VerticalSliceModifier.html`,
    urlTitleVerticalSliceModifierDocumentation: `SciChart.js VerticalSliceModifier Documentation`,
    titleVerticalSliceModifier: `Using VerticalSliceModifier`,
    urlVerticalSliceModifier: `chart-vertical-slice-modifier`,

    // SeriesSelection
    urlSeriesSelectionDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#SeriesSelection.html`,
    urlTitleSeriesSelectionDocumentation: `SciChart.js Series Selection Documentation`,
    titleSeriesSelection: `Using Series Selection`,
    urlSeriesSelection: `chart-series-selection`,

    // CursorModifier
    urlCursorModifier: `chart-cursormodifier-crosshairs`,
    titleCursorModifier: `Using CursorModifier Crosshairs`,
    urlTitleCursorModifierDocumentation: `The specific page for the SciChart.js API documentation for the CursorModifier to help you to get started`,
    urlCursorModifierDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#CursorModifier.html`,

    // MetaData
    titleMetaData: (frameworkName: TFrameworkName) => `Datapoint Metadata Tooltips on ${frameworkName} Chart`,
    urlMetaData: `chart-metadata`,
    urlMetaDataDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#DataSeries%20PointMetaData%20Api.html`,
    urlTitleMetaDataDocumentation: `The specific page for the SciChart.js documentation for the MetaData API to help you to get started`,

    // 3D Bubble Chart
    urlBubble3DChart: `3d-bubble-chart`,
    titleBubble3DChart: (frameworkName: TFrameworkName) => `${frameworkName} 3D Bubble Chart`,
    pageTitleBubble3DChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} 3D Bubble Chart | 3D JavaScript Charts | View Now`,
    urlBubble3DChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Bubble%203D%20Chart%20Type.html`,
    urlTitleBubble3DChartDocumentation: `SciChart.js 3D Bubble Chart Documentation`,

    // 3D Surface Mesh
    urlSurfaceMesh3DChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20SurfaceMesh%203D%20Chart%20Type.html`,
    urlTitleSurfaceMesh3DChartDocumentation: `SciChart.js 3D Surface Mesh Documentation`,
    titleSurfaceMesh3D: (frameworkName: TFrameworkName) => `${frameworkName} Surface Mesh 3D Chart`,
    pageTitleSurfaceMesh3D: (frameworkName: TFrameworkName) =>
        `${frameworkName} 3D Surface Mesh Chart | View 3D JavaScript Charts`,
    urlSurfaceMesh3D: `3d-surface-mesh-chart`,
    urlTitleSurfaceMesh3D: `The Surface Mesh 3D Chart example shows how to create this 3D Chart type in SciChart.js`,

    // Realtime 3D Surface Mesh
    titleRealtimeSurfaceMesh3D: (frameworkName: TFrameworkName) => `${frameworkName} Realtime Surface Mesh 3D Chart`,
    pageTitleRealtimeSurfaceMesh3D: (frameworkName: TFrameworkName) =>
        `${frameworkName} Realtime 3D Surface Mesh Chart | View 3D JavaScript Charts`,
    urlRealtimeSurfaceMesh3D: `realtime-3d-surface-mesh-chart`,

    // 3D Point Line
    titlePointLine3DChart: (frameworkName: TFrameworkName) => `${frameworkName} Point Line 3D Chart`,
    pageTitlePointLine3DChart: (frameworkName: TFrameworkName) =>
        `${frameworkName} 3D Point Line Chart | View 3D JavaScript Charts`,
    urlPointLine3DChart: `3d-point-line-chart`,
    urlPointLine3DChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#ThePointLine3DChartType.html`,
    urlTitlePointLine3DChartDocumentation: `SciChart.js 3D Point Line Chart Documentation`,

    // Featured Apps Lidar Example
    urlLidarFeaturedApp: `3d-lidar-visualization`,
    urlTitleLidarFeaturedApp: `LiDAR 3D Point Cloud of Geospatial Data`,
    titleLidarFeaturedApp: `LiDAR 3D Point Cloud of Geospatial Data`,
    urlLidar3DDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Scatter%203D%20Chart%20Type.html`,
    urlTitleLidar3DDocumentation: `SciChart.js 3D Chart Documentation`,

    // Featured Apps Load 500x500
    titleLoad500By500: `Load 500 Series x 500 Points Performance Demo`,
    urlLoad500By500: `load-500-series-x-500-points-performance-demo`,
    urlTitleLoad500By500: `This example demonstrates the performance of loading 500 series with 500 points on a JavaScript Chart`,

    // Featured Apps Load 1 Million Points
    titleLoadOneMillionPoints: `Load 1 Million Points Performance Demo`,
    urlLoadOneMillionPoints: `chart-performance-load-one-million-points`,

    // Featured Apps Performance Demo
    urlRealtimeJavaScriptChartDemo: `chart-realtime-performance-demo`,
    urlTitleRealtimeJavaScriptChartDemo: (frameworkName: TFrameworkName) =>
        `${frameworkName} Chart Realtime Performance Demo`,
    titleRealtimeJavaScriptChartDemo: (frameworkName: TFrameworkName) =>
        `Realtime ${frameworkName} Chart Performance Demo`,

    // Featured Apps Ghosted Traces
    urlRealtimeGhostedTracesDemo: ``,
    urlTitleRealtimeGhostedTracesDemo: ``,
    titleRealtimeGhostedTraces: `Realtime Ghosted Traces`,
    urlRealtimeGhostedTraces: `realtime-ghosted-traces-chart`,
    urlTitleRealtimeGhostedTraces: `This example demonstrates the performance of SciChart.js with Oscilloscope-style ghosted traces`,

    // Featured Apps Vital Signs
    titleVitalSigns: (frameworkName: TFrameworkName) => `${frameworkName} Vital Signs ECG/EKG Medical Demo`,
    urlVitalSigns: `vital-signs-ecg-medical-chart-example`,

    // Featured Apps Audio Analyzer
    titleAudioAnalyzerFeaturedApp: `Realtime Audio Analyzer Demo`,
    urlAudioAnalyzerFeaturedApp: `audio-analyzer-fft-example`,

    // Featured Apps Tenor Curves
    titleTenorCurvesFeaturedApp: `Tenor Curves Demo`,
    urlTenorCurvesFeaturedApp: `2d-3d-chart-tenor-curves-example`,

    // Showcases RealtimeBigData Demo
    urlRealtimeBigDataJavaScriptChartDemo: `chart-websocket-bigdata-demo`,
    titleRealtimeBigDataJavaScriptChartDemo: `Client/Server Websocket Data Streaming`,

    // ServerTrafficDashboards Demo
    urlServerTrafficDashboard: `server-traffic-dashboard`,
    titleServerTrafficDashboard: `Server Traffic Dashboard`,

    // BuilderApi, Simple Chart
    urlBuilderSimpleChart: `builder-simple`,
    titleBuilderSimpleChart: `Simple Chart using Builder API`,

    // BuilderApi, Full Chart
    urlBuilderFullChart: `builder-full`,
    titleBuilderFullChart: `Full Chart using Builder API`,

    // BuilderApi, Chart From JSON
    urlChartFromJSON: `chart-from-json`,
    titleChartFromJSON: `Chart from JSON`,
    urlBuilderApiDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Intro%20to%20the%20Builder%20API.html`,
    urlTitleBuilderApiDocumentation: `This specific page in the JavaScript Builder API documentation will help you to get started`,
    urlDefinitionDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#typedoc/interfaces/iscichart2ddefinition.html`,
    urlTitleDefinitionDocumentation: `Full details of the definition object`,

    // BuilderApi, Custom Types
    urlCustomTypes: `custom-types`,
    titleCustomTypes: `Custom Types with Builder API`,

    // BuilderApi, Shared Data
    urlSharedData: `reusable-templates-using-shared-data`,
    titleSharedData: (frameworkName: TFrameworkName) =>
        `${frameworkName} Chart with Reusable Templates using Shared Data`,

    urlTextLabelProviderDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#TextStringAxis.html`,
    urlTitleTextLabelProviderDocumentation: `This specific page in the JavaScript TextLabelProvider documentation will help you to get started`,

    // TODO add proper URLs
    // SubCharts API
    urlSubchartApiDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#WhatIsTheSubChartsAPI.html`,
    urlTitleSubCharstApiDocumentation: `This specifics page in the JavaScript SubCharts API documentation will help you to get started`,

    // Multi Line labels
    urlMultiLineLabels: `multiline-labels`,
    titleMultiLineLabels: `Multi-line and Rotated Text labels`,

    urlAxisLabelFormattingDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Axis%20Label%20Formatting%20-%20LabelProvider%20API.html`,
    urlTitleAxisLabelFormattingDocumentation: `This specific page in the JavaScript Axis Label Formatting documentation will help you to get started`,

    // Image labels
    urlImageLabels: `image-labels`,
    titleImageLabels: `Image labels`,
    urlImageLabelsDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#ImageLabels.html`,
    urlTitleImageLabelsDocumentation: `This specific page about JavaScript Chart Image Labels documentation will help you to get started`,

    urlCustomLabelProviderDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Axis%20Label%20Formatting%20-%20Custom%20LabelProviders.html`,
    urlTitleCustomLabelProviderDocumentation: `This specific page in the JavaScript Custom LabelProviders documentation will help you to get started`,

    // Rotated labels
    urlRotatedLabels: `rotated-labels`,
    titleRotatedLabels: `Rotated Labels and Alignment`,
    urlRotatingLabelsDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#RotatingAxisLabels.html`,
    urlTitleRotatingLabelsDocumentation: `The SciChart.js rotated labels documentation page`,

    // Filters, Percentage Change
    urlPercentageChange: `percentage-change`,
    titlePercentageChange: `Realtime Percentage Change using Filter`,
    urlScaleOffsetDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Scale%20Offset%20Filters.html`,
    urlTitleFiltersApiDocumentation: `This specific page in the JavaScript Filters API documentation will help you to get started`,

    // Filters, Trend, MA, Ratio
    urlTrendMARatio: `trend-ma-ratio`,
    titleTrendMARatio: `Trendline, Moving Average and Ratio Filters`,
    urlFiltersDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#What%20is%20the%20Filters%20API.html`,

    // Filters, Custom Filters
    urlCustomFilters: `custom-filters`,
    titleCustomFilters: `Custom Filters`,
    urlCustomFiltersDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#Creating%20a%20Custom%20Filter.html`,

    // Overview
    urlOverview: `overview`,
    titleOverview: `Zoom and Pan with Overview Chart`,
    urlOverviewDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#SciChartOverview.html`,
    urlTitleOverviewDocumentation: `This specific page in the JavaScript SciChartOverview Api documentation will help you to get started`,

    // SyncMultiChart
    urlSyncMultiChart: `sync-multi-chart`,
    titleSyncMultiChart: `Synchronise Multiple Charts`,
    urlSyncDocs: `https://www.scichart.com/documentation/js/current/webframe.html#Tutorial%2009%20-%20Linking%20Multiple%20Charts.html`,

    // Oil & Gas Demo
    titleOilAndGasExplorerDashboard: (frameworkName: TFrameworkName) => `Oil & Gas Explorer ${frameworkName} Dashboard`,
    urlOilAndGasExplorerDashboard: `oil-and-gas-dashboard-showcase`,

    // 64-Chart Dashboard
    titleChartGrid: (frameworkName: TFrameworkName) => `${frameworkName} 64-Chart Dashboard Performance Demo`,
    urlChartGrid: `multiple-chart-dashboard-performance-demo`,

    // Datalabels
    urlDatalabels: `datalabels`,
    titleDatalabels: (frameworkName: TFrameworkName) => `Data Labels`,
    urlDatalabelsDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#AddingDataLabels.html`,
    urlTitleDatalabelsDocumentation: `SciChart.js DataLabels API Documentation`,

    urlVirtualizedData: `chart-with-virtualized-data`,
    titleVirtualizedData: (frameworkName: TFrameworkName) =>
        `Virtualized ${frameworkName} Charts: Load Data on Zoom/Pan`,

    urlHeatmapInteractionsData: `heatmap-interactions`,
    titleHeatmapInteractionsData: (frameworkName: TFrameworkName) => `Rich Interactions Showcase`,

    urlDynamicLayout: `dynamic-layout`,
    titleDynamicLayout: (frameworkName: TFrameworkName) => `Dynamic Layout Showcase`,

    urlEventMarkers: `dragabble-event-markers`,
    titleEventMarkers: (frameworkName: TFrameworkName) => `Dragabble Event Markers`,

    urlTextChart: `text-chart`,
    titleTextChart: (frameworkName: TFrameworkName) => `${frameworkName} Text Chart`,
    urlTextSeriesDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#TheTextSeriesType.html`,
    urlTitleTextSeriesDocumentation: `The documentation page for the TextSeries in SciChart.js`,
};
