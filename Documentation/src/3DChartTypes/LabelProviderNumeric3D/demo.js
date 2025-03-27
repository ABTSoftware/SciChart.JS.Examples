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

async function labelProvider3D(divElementId) {
    const {
        SciChart3DSurface,
        NumericAxis3D,
        Vector3,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier3D,
        OrbitModifier3D,
        ResetCamera3DModifier,
        NumberRange,
        ENumericFormat,
    } = SciChart;

    // or, for npm, import { SciChart3DSurface, ... } from "scichart"

    // #region ExampleB
    // Create a SciChart3DSurface in the host <div id=".." />
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(300, 200, 300),
        cameraOptions: {
            position: new Vector3(-300, 300, -300),
            target: new Vector3(0, 50, 0),
        },
    });

    // Declare an X,Y,Z axis using custom labelProviders
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "X Axis [Commas]",
        visibleRange: new NumberRange(1000, 1000000),
        labelProvider: new CustomNumericLabelProvider({
            customFormat: "Commas",
            labelPrecision: 0,
        }),
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y Axis [Default]",
        visibleRange: new NumberRange(0, 100),
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Z Axis [KMBT]",
        visibleRange: new NumberRange(0, 10000000),
        labelPrefix: "$",
        labelPostfix: " USD",
        labelProvider: new CustomNumericLabelProvider({
            customFormat: "KMBT",
            labelPrefix: "$",
            labelPostfix: " USD",
            labelPrecision: 2,
            labelFormat: ENumericFormat.SignificantFigures,
        }),
    });
    // #endregion

    // Optional: add zooming, panning for the example
    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(), // provides camera zoom on mouse wheel
        new OrbitModifier3D(), // provides 3d rotation on left mouse drag
        new ResetCamera3DModifier()
    ); // resets camera position on double-click
}

labelProvider3D("scichart-root");
