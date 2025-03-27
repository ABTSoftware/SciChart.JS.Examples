async function labelProviderFormatLabel(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        NumberRange,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
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
                textColor: "White",
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
                textColor: "White",
            })
        );
    };

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    addChartTitle(
        sciChartSurface,
        "LabelProvider.formatLabel() example",
        "Override formatLabel() and return hexadecimal"
    );
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Y Axis" }));

    // #region ExampleA
    // Format a label as hexadecimal by overriding formatLabel
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "X Axis with formatLabel",
        visibleRange: new NumberRange(0, 16),
        maxAutoTicks: 16,
    });
    xAxis.labelProvider.formatLabel = (dataValue) => {
        return "0x" + dataValue.toString(16);
    };
    sciChartSurface.xAxes.add(xAxis);
    // #endregion
}

labelProviderFormatLabel("scichart-root");

async function builderExample(divElementId) {
    const { chartBuilder, EThemeProviderType, NumberRange, EAxisType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // #region ExampleB
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "X Axis with formatLabel",
                visibleRange: new NumberRange(0, 16),
                maxAutoTicks: 16,
            },
        },
        yAxes: {
            type: EAxisType.NumericAxis,
        },
    });

    // Setting the labelprovider properties on the labelProvider itself
    const labelProvider = sciChartSurface.xAxes.get(0).labelProvider;
    labelProvider.formatLabel = (dataValue) => {
        return "0x" + dataValue.toString(16);
    };
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
