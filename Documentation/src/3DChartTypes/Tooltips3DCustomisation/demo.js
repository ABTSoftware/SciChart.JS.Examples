import * as SciChart from "scichart";

const generateData = index => {
    const gaussianRandom = (mean, stdev) => {
        const u = 1 - Math.random(); // Converting [0,1) to (0,1]
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        // Transform to the desired mean and standard deviation:
        return z * stdev + mean;
    };

    const xValues = [];
    const yValues = [];
    const zValues = [];

    for (let i = 0; i < 30; i++) {
        xValues.push(i * 0.1);
        yValues.push(gaussianRandom(0, 1));
        zValues.push(index);
    }
    return { xValues, yValues, zValues };
};

async function tooltips3DCustomisation(divElementId) {
    const {
        SciChart3DSurface,
        NumericAxis3D,
        Vector3,
        SciChartJsNavyTheme,
        NumberRange,
        XyzDataSeries3D,
        PointLineRenderableSeries3D,
        TooltipModifier3D,
        EllipsePointMarker3D,
        uintArgbColorLerp,
        parseColorToUIntArgb,
        parseArgbToHtmlColor
    } = SciChart;

    // or, for npm, import { SciChart3DSurface, ... } from "scichart"

    // Create a SciChart3DSurface in the host <div id=".." />
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(300, 200, 300),
        cameraOptions: {
            position: new Vector3(-300, 300, 300),
            target: new Vector3(0, 50, 0)
        }
    });

    const growBy = new NumberRange(0.2, 0.2);
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "Frequency (Hz)", growBy });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Power (dB)" });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Time (s)", growBy });

    // returns data in arrays of numbers e.g. xValues = [0,1,2,3,4], yValues = [0,1,2,3,4], zValues = [0,1,2,3,4]
    const { xValues, yValues, zValues } = generateData(1);

    // Add a PointLineRenderableSeries3D
    sciChart3DSurface.renderableSeries.add(
        new PointLineRenderableSeries3D(wasmContext, {
            dataSeries: new XyzDataSeries3D(wasmContext, { xValues, yValues, zValues, dataSeriesName: "Series A" }),
            opacity: 0.9,
            stroke: "#EC0F6C",
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker3D(wasmContext, { size: 3 })
        })
    );

    // Repeat 2x
    const dataset1 = generateData(2);
    const colorHigh = parseColorToUIntArgb("#EC0F6C");
    const colorLow = parseColorToUIntArgb("#30BC9A");
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const metadata = dataset1.yValues.map((y, i) => {
        // interpolate y between colorLow and colorHigh using the helper function uintArgbColorLerp
        const t = (y - yMin) / (yMax - yMin);
        const color = uintArgbColorLerp(colorLow, colorHigh, t);
        return { vertexColor: color, customString: `Custom string ${i}` };
    });
    sciChart3DSurface.renderableSeries.add(
        new PointLineRenderableSeries3D(wasmContext, {
            dataSeries: new XyzDataSeries3D(wasmContext, {
                xValues: dataset1.xValues,
                yValues: dataset1.yValues,
                zValues: dataset1.zValues,
                metadata,
                dataSeriesName: "Series B"
            }),
            opacity: 0.9,
            stroke: "#50C7E0",
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker3D(wasmContext, { size: 3 })
        })
    );

    const dataset2 = generateData(3);
    sciChart3DSurface.renderableSeries.add(
        new PointLineRenderableSeries3D(wasmContext, {
            dataSeries: new XyzDataSeries3D(wasmContext, {
                xValues: dataset2.xValues,
                yValues: dataset2.yValues,
                zValues: dataset2.zValues,
                dataSeriesName: "Series C"
            }),
            opacity: 0.9,
            stroke: "#F48420",
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker3D(wasmContext, { size: 3 })
        })
    );

    // #region ExampleA
    // Declare a tooltip and add to the chart
    const tooltipModifier = new TooltipModifier3D({
        crosshairStroke: "#83D2F5",
        crosshairStrokeThickness: 3,
        tooltipContainerBackground: "#537ABD",
        tooltipTextStroke: "White",
        tooltipLegendOffsetX: 10,
        tooltipLegendOffsetY: 10
    });

    sciChart3DSurface.chartModifiers.add(tooltipModifier);

    // Customize the tooltip content
    tooltipModifier.tooltipDataTemplate = (seriesInfo, svgAnnotation) => {
        // Create an array to hold strings (lines) to show in the tooltip
        const valuesWithLabels = [];
        if (seriesInfo && seriesInfo.isHit) {
            // You can access the renderableSeries which was hit via the seriesInfo
            const renderableSeries = seriesInfo.renderableSeries;
            // And the parent Chart from that
            const parentSurface = renderableSeries.parentSurface;

            // Push lines to the array to display in the tooltip
            valuesWithLabels.push(`dataSeriesName: "${seriesInfo.dataSeriesName}"`);
            valuesWithLabels.push(` ${parentSurface.xAxis.axisTitle}: ${seriesInfo.xValue.toFixed(2)}`);
            valuesWithLabels.push(` ${parentSurface.yAxis.axisTitle}: ${seriesInfo.yValue.toFixed(2)}`);
            valuesWithLabels.push(` ${parentSurface.zAxis.axisTitle}: ${seriesInfo.zValue.toFixed(2)}`);

            // access the metadata (if exists)". Any JS object on the data-points can be accessed
            // in tooltips
            const md = seriesInfo.pointMetadata;
            if (md) {
                valuesWithLabels.push(` Metadata: "${md.customString}"`);
            }
        }
        return valuesWithLabels;
    };

    // #endregion
}

tooltips3DCustomisation("scichart-root");
