import * as SciChart from "scichart";

async function drawGaugeChartColumn(divElementId) {
    // Demonstrates how to create a gauge chart using Column Series & PolarPointerAnnotation using SciChart.js
    const {
        SciChartPolarSurface,
        SciChartJsNavyTheme,
        NumberRange,
        Thickness,
        PolarNumericAxis,
        EPolarAxisMode,
        PolarColumnRenderableSeries,
        XyxyDataSeries,
        EColumnMode,
        NativeTextAnnotation,
        ECoordinateMode,
        EVerticalAnchorPoint,
        EHorizontalAnchorPoint,
        EAxisAlignment,
        EPolarLabelMode
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        padding: Thickness.fromNumber(20)
    });

    const gaugeTotalAngle = Math.PI * 1.3;
    const startValue = Math.random() * 100; // Random start value between 0 and 10
    const gaugeRange = new NumberRange(0, 100);
    const gradientColors = ["#FF1133", "#FFEE00", "#3388FF"];
    const columnYValues = [30, 50, 100];

    // Create axes
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: gaugeRange,
        flippedCoordinates: true, // go clockwise
        totalAngle: gaugeTotalAngle,
        startAngle: (Math.PI - gaugeTotalAngle) / 2, // to center the bottom gap
        isVisible: false
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 10),
        isVisible: false
    });
    sciChartSurface.yAxes.add(radialYAxis);

    // Current color calculation
    const getColorForValue = value => {
        const threshold = columnYValues.find(t => value <= t);

        return threshold ? gradientColors[columnYValues.indexOf(threshold)] : gradientColors[gradientColors.length - 1];
    };
    const currentColor = getColorForValue(startValue);

    columnYValues.forEach((val, i) => {
        const gradientColumn = new PolarColumnRenderableSeries(wasmContext, {
            dataSeries: new XyxyDataSeries(wasmContext, {
                xValues: [columnYValues[i - 1] ?? 0],
                x1Values: [val > columnYValues[i] ? columnYValues[i] : val],
                yValues: [9.7],
                y1Values: [10]
            }),
            columnXMode: EColumnMode.StartEnd,
            fill: gradientColors[i],
            strokeThickness: 0
        });
        sciChartSurface.renderableSeries.add(gradientColumn);
    });

    // Optional - add a gray column to show the potential full range of the gauge
    const grayColumn = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues: [gaugeRange.min],
            x1Values: [gaugeRange.max],
            yValues: [7],
            y1Values: [9.5]
        }),
        columnXMode: EColumnMode.StartEnd,
        fill: "#88888844",
        strokeThickness: 0
    });
    sciChartSurface.renderableSeries.add(grayColumn);

    // add the value column:
    const columnSeries = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues: [gaugeRange.min],
            x1Values: [startValue],
            yValues: [7],
            y1Values: [9.5]
        }),
        columnXMode: EColumnMode.StartEnd,
        fill: currentColor,
        strokeThickness: 0
    });
    sciChartSurface.renderableSeries.add(columnSeries);

    const centeredText = new NativeTextAnnotation({
        text: `${startValue.toFixed(2)}`,

        // place and anchor the text in the middle of the gauge - at point(0, 0)
        x1: 0,
        y1: 0,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,

        textColor: currentColor,
        fontSize: 52
    });
    sciChartSurface.annotations.add(centeredText);
}

drawGaugeChartColumn("scichart-root");
