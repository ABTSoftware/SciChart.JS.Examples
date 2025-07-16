import {
    SciChartPolarSurface,
    SciChartJsNavyTheme,
    PolarNumericAxis,
    NumberRange,
    PolarCategoryAxis,
    PolarMountainRenderableSeries,
    EPolarAxisMode,
    EPolarGridlineMode,
    XyDataSeries,
} from "scichart";

async function initSciChartPolar2D() {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create("scichart-polar-root", {
        theme: new SciChartJsNavyTheme()
    });

    const angularXAxis = new PolarCategoryAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        labels: [ "Offense", "Shooting", "Defense", "Rebounds", "Passing", "Bench" ], // categories
        startAngle: Math.PI / 2, // start at 12 o'clock
        flippedCoordinates: true, // go clockwise

        majorGridLineStyle: { color: "#88888844" },
        drawMinorGridLines: false,
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        gridlineMode: EPolarGridlineMode.Polygons, // this creates the radar chart look
        visibleRange: new NumberRange(0, 10), 
        startAngle: Math.PI / 2, // start at 12 o'clock
        
        labelPrecision: 0,
        majorGridLineStyle: { color: "#88888844" },
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const xValues = [0, 1, 2, 3, 4, 5];
    const yValues = [9, 10, 7, 5, 8, 6]; // values for: "Offense", "Shooting", "Defense", "Rebounds", "Passing", "Bench"
    
    // Radar / Spider Charts may also work with `PolarLineRenderableSeries`
    const polarMountain = new PolarMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [...xValues, xValues[xValues.length] + 1], // + 1 to close the loop
            yValues: [...yValues, yValues[0]], // re-plot first point to close the loop
            dataSeriesName: "Golden State Warriors",
        }),
        stroke: "#FFC72C", // Golden State Warriors gold
        fill: "#1D428A80", // Golden State Warriors blue with 50% opacity
        strokeThickness: 4,
    });
    sciChartSurface.renderableSeries.add(polarMountain);
};

// Note: When using SciChart.js in React, Angular, Vue use component lifecycle to delete the chart on unmount
// for examples see the Vue/React/Angular boilerplates at https://www.scichart.com/getting-started/scichart-javascript/
initSciChartPolar2D();