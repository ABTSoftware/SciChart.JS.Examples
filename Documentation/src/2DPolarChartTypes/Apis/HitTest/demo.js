import * as SciChart from "scichart";

async function testIsVisibleOnChart(divElementId) {
    // Demonstrates how to listen to isVisible changes in SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        XyScatterRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        SciChartJsNavyTheme,
        LegendModifier,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add instructions
    const textAnnotation = new TextAnnotation({
        x1: 0.5,
        y1: 0.5,
        text: "Click on the legend to show/hide the series",
        textColor: "White",
        fontSize: 20,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center
    });
    sciChartSurface.annotations.add(textAnnotation);

    // Create some data
    const xValues = [];
    const yValues = [];
    for (let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
    }

    // #region ExampleA
    // Create and add a series with onIsVisibleChanged handler
    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
            dataSeriesName: "Scatter Series"
        }),
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            strokeThickness: 2,
            fill: "steelblue",
            stroke: "LightSteelBlue"
        }),
        onIsVisibleChanged: (sourceSeries, isVisible) => {
            console.log(`Series ${sourceSeries.type} was set to isVisible=${isVisible}`);
        }
    });

    // You can also subscribe to isVisibleChanged like this
    scatterSeries.isVisibleChanged.subscribe(seriesVisibleChangedArgs => {
        // See SeriesVisibleChangedArgs in typedoc
        const renderableSeries = seriesVisibleChangedArgs.sourceSeries;
        const isVisible = seriesVisibleChangedArgs.isVisible;

        console.log(`isVisibleChanged handler: Series ${renderableSeries.type} was set to isVisible=${isVisible}`);
        textAnnotation.text = `${renderableSeries.dataSeries.dataSeriesName} is ${isVisible ? "visible" : "hidden"}`;
    });

    // Explicitly set visibility like this
    scatterSeries.isVisible = true;

    sciChartSurface.renderableSeries.add(scatterSeries);
    // #endregion

    // add a legend which allows showing/hiding series
    sciChartSurface.chartModifiers.add(new LegendModifier({ showCheckboxes: true, showLegend: true }));
}

testIsVisibleOnChart("scichart-root");
