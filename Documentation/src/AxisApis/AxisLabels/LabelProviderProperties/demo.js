import * as SciChart from "scichart";

async function labelproviderProperties(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        ENumericFormat,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

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

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    addChartTitle(
        sciChartSurface,
        "LabelProvider properties example",
        "Shows how to set labelProvider properties on axis"
    );

    // #region ExampleA
    // Set LabelProvider Properties in axis constructor options
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            // Enable decision labels with 4 significant figures
            labelFormat: ENumericFormat.Decimal,
            cursorLabelFormat: ENumericFormat.Decimal,
            labelPrecision: 4,
            labelPrefix: "$",
            labelPostfix: " USD"
        })
    );

    // Alternatively, set properties on the labelProvider itself
    const yAxis = new NumericAxis(wasmContext);
    yAxis.labelProvider.numericFormat = ENumericFormat.Decimal;
    yAxis.labelProvider.cursorNumericFormat = ENumericFormat.Decimal;
    yAxis.labelProvider.precision = 4;
    yAxis.labelProvider.prefix = "$";
    yAxis.labelProvider.postfix = " USD";
    sciChartSurface.yAxes.add(yAxis);
    // #endregion
}

labelproviderProperties("scichart-root");

async function builderExample(divElementId) {
    const { chartBuilder, EThemeProviderType, ENumericFormat, EAxisType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // #region ExampleB
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            // Setting the labelProvider properties via axis options
            options: {
                labelFormat: ENumericFormat.Decimal,
                cursorLabelFormat: ENumericFormat.Decimal,
                labelPrecision: 4,
                labelPrefix: "$",
                labelPostfix: " USD"
            }
        },
        yAxes: {
            type: EAxisType.NumericAxis
        }
    });

    // Setting the labelprovider properties on the labelProvider itself
    const labelProvider = sciChartSurface.yAxes.get(0).labelProvider;
    labelProvider.numericFormat = ENumericFormat.Decimal;
    labelProvider.cursorNumericFormat = ENumericFormat.Decimal;
    labelProvider.precision = 4;
    labelProvider.prefix = "$";
    labelProvider.postfix = " USD";
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
