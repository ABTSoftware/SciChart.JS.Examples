import * as SciChart from "scichart";

// #region ExampleA
const { NumericLabelProvider } = SciChart;

// A custom class which inherits NumericLabelProvider for advanced numeric formatting
// You can also inherit DateLabelProvider for date formatting
class CustomNumericLabelProvider extends NumericLabelProvider {
    customFormat = "Commas"; // Options are "Default", "Commas" and "KMBT"

    // Options accepts values from ILabel2DOptions or 'customFormat' e.g.
    // { customFormat: "Commas", labelPrefix: "$", labelPrecision: 2 } or { customFormat: "KMBT" }
    constructor(options) {
        super(options);
        this.customFormat = options?.customFormat ?? "Commas";
    }

    // Called for each label
    formatLabel(dataValue) {
        if (this.customFormat === "Default") {
            return super.formatLabel(dataValue);
        } else if (this.customFormat === "Commas") {
            // Format numbers using the default format, but with commas e.g. 1,000,000
            return this.formatNumberWithCommas(dataValue);
        } else if (this.customFormat === "KMBT") {
            // Format large numbers with K, M, B abbreviations e.g. 1.5M
            return this.formatNumberKMBT(dataValue);
        }
    }

    // Called for each tooltip/cursor label
    formatCursorLabel(dataValue) {
        return this.formatLabel(dataValue);
    }

    // Formats a label with commas e.g. 1000000 becomes 1,000,000
    formatNumberWithCommas(dataValue) {
        const labelValue = super.formatLabel(dataValue);
        const commasRegex = /\B(?=(\d{3})+(?!\d))/g;
        const output = labelValue.replace(commasRegex, ",");

        // Log what happened for educational purposes
        console.log(`formatNumberWithCommas: ${dataValue} => ${labelValue} => ${output}`);
        return output;
    }

    // Returns a number formatted as K, M, B, T for thousands, millions, billions, trillions
    formatNumberKMBT(dataValue) {
        // formatLabel applies decimal, significant figure formatting and adds prefix, postfix
        let originalLabel = super.formatLabel(dataValue);
        let result = originalLabel;
        // Now we need to inject K, M, B, T into the label before the postfix

        // e.g. formatLabel(1000000) with prefix="$", postfix="USD" = "$1000000 USD" => "$1M USD"
        if (dataValue >= 1_000_000_000_000) {
            result = super.formatLabel(dataValue / 1_000_000_000_000).replace(this.postfix, "T" + this.postfix);
        } else if (dataValue >= 1_000_000_000) {
            result = super.formatLabel(dataValue / 1_000_000_000).replace(this.postfix, "B" + this.postfix);
        } else if (dataValue >= 1_000_000) {
            result = super.formatLabel(dataValue / 1_000_000).replace(this.postfix, "M" + this.postfix);
        } else if (dataValue >= 1_000) {
            result = super.formatLabel(dataValue / 1_000).replace(this.postfix, "K" + this.postfix);
        }

        // Log what happened for educational purposes
        console.log(`formatNumberKMBT: ${dataValue} => ${originalLabel} => ${result}`);

        return result;
    }
}
// #endregion

async function labelProviderClass(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        LogarithmicAxis,
        SciChartJsNavyTheme,
        NumberRange,
        TextAnnotation,
        ENumericFormat,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        ZoomPanModifier,
        MouseWheelZoomModifier
    } = SciChart;

    const addChartTitle = (sciChartSurface, titleText, subTitleText) => {
        // Note: we will be improving this shortly in scichart.js v3.1
        sciChartSurface.annotations.add(
            new TextAnnotation({
                text: titleText,
                x1: 0.5,
                y1: 0.5,
                yCoordShift: -50,
                xCoordinateMode: ECoordinateMode.Relative,
                yCoordinateMode: ECoordinateMode.Relative,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                opacity: 0.5,
                fontSize: 32,
                fontWeight: "Bold",
                textColor: "White"
            })
        );
        sciChartSurface.annotations.add(
            new TextAnnotation({
                text: subTitleText,
                x1: 0.5,
                y1: 0.5,
                xCoordinateMode: ECoordinateMode.Relative,
                yCoordinateMode: ECoordinateMode.Relative,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                opacity: 0.4,
                fontSize: 17,
                textColor: "White"
            })
        );
    };

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    addChartTitle(
        sciChartSurface,
        "Custom LabelProvider Class Example",
        "Shows how to custom format numeric labels using SciChart.js"
    );

    // #region ExampleB

    // Apply the custom labelprovider we created before to different axis

    sciChartSurface.yAxes.add(
        new LogarithmicAxis(wasmContext, {
            axisTitle: "Y Axis with K,M,B,T abbreviations",
            // Enable K,M,B,T abbreviations for large labels
            labelProvider: new CustomNumericLabelProvider({
                customFormat: "KMBT",
                labelPrefix: "$",
                labelPostfix: " USD",
                labelPrecision: 2,
                labelFormat: ENumericFormat.SignificantFigures
            }),
            visibleRange: new NumberRange(1, 1e12)
        })
    );

    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "X Axis with comma separators",
            // Enable comma formatting for large labels
            labelProvider: new CustomNumericLabelProvider({ customFormat: "Commas", labelPrecision: 1 }),
            visibleRange: new NumberRange(0, 1e10)
        })
    );
    // #endregion

    // For the example, we add zooming, panning and an annotation so you can see how dates react on zoom.
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());
}

labelProviderClass("scichart-root");

async function builderExample(divElementId) {
    const { chartBuilder, ENumericFormat, EThemeProviderType, NumberRange, EAxisType, EChart2DModifierType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // #region ExampleC
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        yAxes: {
            type: EAxisType.LogarithmicAxis,
            options: {
                axisTitle: "Y Axis with K,M,B,T abbreviations",
                // Enable K,M,B,T abbreviations for large labels
                labelProvider: new CustomNumericLabelProvider({
                    customFormat: "KMBT",
                    labelPrefix: "$",
                    labelPostfix: " USD",
                    labelPrecision: 2,
                    labelFormat: ENumericFormat.SignificantFigures
                }),
                visibleRange: new NumberRange(1, 1e12)
            }
        },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "X Axis with comma separators",
                // Enable comma formatting for large labels
                labelProvider: new CustomNumericLabelProvider({ customFormat: "Commas", labelPrecision: 1 }),
                visibleRange: new NumberRange(0, 1e10)
            }
        },
        modifiers: [{ type: EChart2DModifierType.MouseWheelZoom }, { type: EChart2DModifierType.ZoomPan }]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
