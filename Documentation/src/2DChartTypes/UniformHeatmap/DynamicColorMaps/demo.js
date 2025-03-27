// This function generates data for the heatmap series example
function generateExampleData(width, height, cpMax, index, maxIndex) {
    const { zeroArray2D } = SciChart;
    // or, import { zeroArray2D } from "SciChart";

    // Returns a 2-dimensional javascript array [height (y)] [width (x)] size
    const zValues = zeroArray2D([height, width]);

    const angle = (Math.PI * 2 * index) / maxIndex;

    // When appending data to a 2D Array for the heatmap, the order of appending (X,Y) does not matter
    // but when accessing the zValues[][] array, we set data [y] then [x]
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const v =
                (1 + Math.sin(x * 0.02 + angle)) * 50 +
                (1 + Math.sin(y * 0.05 + angle)) * 50 * (1 + Math.sin(angle * 2));
            const cx = width / 2;
            const cy = height / 2;
            const r = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
            const exp = Math.max(0, 1 - r * 0.008);
            const zValue = v * exp + Math.random() * 10;
            zValues[y][x] = zValue > cpMax ? cpMax : zValue;
        }
    }
    return zValues;
}

async function dynamicColorMaps(divElementIdChart, divElementIdLegend) {
    // Demonstrates how to create a uniform heatmap chart with dynamic colormap using SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        HeatmapColorMap,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        SciChartJsNavyTheme,
        NumberRange,
        HeatmapLegend,
        AxisMarkerAnnotation,
        TextAnnotation,
        BoxAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const addChartTitle = (sciChartSurface, titleText, subTitleText) => {
        sciChartSurface.annotations.add(
            new BoxAnnotation({
                x1: 0,
                x2: 1,
                y1: 0,
                y2: 0.18,
                fill: "#14233C77",
                strokeThickness: 0,
                xCoordinateMode: ECoordinateMode.Relative,
                yCoordinateMode: ECoordinateMode.Relative,
            })
        );
        // Note: we will be improving titles shortly in scichart.js v3.1
        sciChartSurface.annotations.add(
            new TextAnnotation({
                text: titleText,
                x1: 0.5,
                y1: 0,
                yCoordShift: 10,
                xCoordinateMode: ECoordinateMode.Relative,
                yCoordinateMode: ECoordinateMode.Relative,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Top,
                opacity: 0.77,
                fontSize: 28,
                fontWeight: "Bold",
                textColor: "White",
            })
        );
        sciChartSurface.annotations.add(
            new TextAnnotation({
                text: subTitleText,
                x1: 0.5,
                y1: 0,
                yCoordShift: 50,
                xCoordinateMode: ECoordinateMode.Relative,
                yCoordinateMode: ECoordinateMode.Relative,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Top,
                opacity: 0.77,
                fontSize: 14,
                textColor: "White",
            })
        );
    };

    // Create a SciChartSurface with X & Y Axis
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementIdChart, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(150, 350) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(80, 200) }));

    addChartTitle(
        sciChartSurface,
        "Dynamic ColorMaps",
        "Drag the Axis Marker on the legend to update the HeatmapColorMap"
    );

    const WIDTH = 500;
    const HEIGHT = 300;
    const MAX_SERIES = 200;
    let index = 20;

    // Create a Heatmap Data-series. Pass heatValues as a number[][] to the UniformHeatmapDataSeries
    const initialZValues = generateExampleData(WIDTH, HEIGHT, 200, index, MAX_SERIES);
    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1,
        zValues: initialZValues,
    });

    // #region ExampleA
    // .. Assuming SciChartSurface, UniformHeatmapDataSeries already created
    //

    // Create a colormap
    const colorMap = new HeatmapColorMap({
        minimum: 0,
        maximum: 200,
        gradientStops: [
            { offset: 1, color: "#EC0F6C" },
            { offset: 0.9, color: "#F48420" },
            { offset: 0.7, color: "#DC7969" },
            { offset: 0.5, color: "#67BDAF" },
            { offset: 0.3, color: "#50C7E0" },
            { offset: 0.2, color: "#264B9377" },
            { offset: 0, color: "Transparent" },
        ],
    });

    // Create a Heatmap RenderableSeries with the color map
    sciChartSurface.renderableSeries.add(
        new UniformHeatmapRenderableSeries(wasmContext, {
            dataSeries: heatmapDataSeries,
            useLinearTextureFiltering: false,
            fillValuesOutOfRange: true,
            colorMap,
        })
    );

    // Create the heatmapLegend with the same colorMap
    const { heatmapLegend, wasmContext2 } = await HeatmapLegend.create(divElementIdLegend, {
        theme: {
            ...new SciChartJsNavyTheme(),
            sciChartBackground: "#14233CBB",
            loadingAnimationBackground: "#14233CBB",
        },
        colorMap,
    });

    // The HeatmapLegend is implemented using a SciChartSurface, You can access the inner chart
    const legendSciChartSurface = heatmapLegend.innerSciChartSurface.sciChartSurface;

    // Create an AxisMarkerAnnotation and subscribe to onDrag
    const axisAnnotation = new AxisMarkerAnnotation({
        y1: colorMap.maximum * 0.9,
        isEditable: true,
        onDrag: (args) => {
            // First step: prevent dragging outside the min/max
            if (axisAnnotation.y1 > 200) axisAnnotation.y1 = 200;
            if (axisAnnotation.y1 < 0) axisAnnotation.y1 = 0;

            // On-drag, update the gradient stops and re-assign. The Chart automatically redraws
            const gradientStops = [
                { offset: 1, color: "#EC0F6C" },
                { offset: axisAnnotation.y1 / 200, color: "#F48420" },
                { offset: 0.7, color: "#DC7969" },
                { offset: 0.5, color: "#67BDAF" },
                { offset: 0.3, color: "#50C7E0" },
                { offset: 0.2, color: "#264B9377" },
                { offset: 0, color: "Transparent" },
            ];
            colorMap.gradientStops = gradientStops;
        },
    });

    // Add it to the legend's SciChartSurface
    legendSciChartSurface.annotations.add(axisAnnotation);
    // #endregion
}

dynamicColorMaps("scichart-root", "legend-root");
