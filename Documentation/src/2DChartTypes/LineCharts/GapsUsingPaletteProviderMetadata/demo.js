const { DefaultPaletteProvider, EStrokePaletteMode, parseColorToUIntArgb } = SciChart;

// or, for npm, import { DefaultPaletteProvider, ... } from "scichart"

// Custom PaletteProvider for line series which colours datapoints a different colour based on a metadata field
class GapsPaletteProvider extends DefaultPaletteProvider {
    constructor(stroke, isNullRule) {
        super();
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.isNullRule = isNullRule;
        this.stroke = parseColorToUIntArgb(stroke);
    }

    // Capture the parent dataseries on attach
    onAttached(parentSeries) {
        this.parentDataSeries = parentSeries.dataSeries;
    }

    // This function is called for every data-point.
    // Return undefined to use the default color for the line,
    // else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
    overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
        const isPointNull = this.isNullRule(metadata);
        const lastPointNull = index !== 0 && this.isNullRule(this.parentDataSeries.getMetadataAt(index - 1));
        // // Note: This is a BAD idea for performance but put here to show how the paletteprovider works
        // console.log(`index ${index}, isNull ${isPointNull}`);
        return isPointNull || lastPointNull ? this.stroke : undefined;
    }
}
// #endregion

async function drawLineChartWithPalette(divElementId) {
    // Demonstrates how to create a line chart with PaletteProvider using SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        NumberRange,
        LegendModifier,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const xValues = [];
    const yValues = [];
    const yValuesNaN = [];
    const metadataValues = [];
    for (let i = 0; i < 30; i++) {
        const y = 0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01);
        xValues.push(i);
        yValues.push(y);

        // Every 5th point is null
        const isNull = i % 5 === 0;

        // Metadata lets you push objects into datapoints
        metadataValues.push({ isNull });

        // Comparison between Y=NAN method
        yValuesNaN.push(isNull ? NaN : y + 0.1);
    }

    const xyDataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        metadata: metadataValues,
        dataSeriesName: "Gaps with Metadata",
    });

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "#F48420",
        strokeThickness: 5,
        dataSeries: xyDataSeries,
        // Using the PaletteProvider to colour points which are null to transparent
        paletteProvider: new GapsPaletteProvider("#F4842022", (metadata) => metadata.isNull === true),
        // Data-labels included to debug which datapoints are 'null'
        dataLabels: {
            style: {
                fontFamily: "Arial",
                fontSize: 16,
            },
            color: "#EEE",
        },
    });

    lineSeries.dataLabelProvider.getText = (dataLabelState) => {
        return `${dataLabelState.xVal()}`;
    };

    sciChartSurface.renderableSeries.add(lineSeries);

    // Comparison with nan
    const nanLineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "#50C7E0",
        strokeThickness: 5,
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValuesNaN, dataSeriesName: "Gaps with NaNs" }),
        // Data-labels included to debug which datapoints are 'null'
        dataLabels: {
            style: {
                fontFamily: "Arial",
                fontSize: 16,
            },
            color: "#EEE",
        },
    });

    nanLineSeries.dataLabelProvider.getText = (dataLabelState) => {
        return `${dataLabelState.xVal()}`;
    };

    sciChartSurface.renderableSeries.add(nanLineSeries);

    sciChartSurface.chartModifiers.add(new LegendModifier());
}

drawLineChartWithPalette("scichart-root");
