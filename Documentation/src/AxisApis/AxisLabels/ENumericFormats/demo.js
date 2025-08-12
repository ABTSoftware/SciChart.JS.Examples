import * as SciChart from "scichart";

async function labelproviderProperties(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        ENumericFormat,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EAxisAlignment,
        NumberRange,
        LogarithmicAxis,
        ZoomPanModifier,
        MouseWheelZoomModifier,
        Thickness
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const addChartTitle = (sciChartSurface, titleText, subTitleText) => {
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

    addChartTitle(sciChartSurface, "ENumericFormats example", "Shows some different ENumericFormat values on axis");

    // #region ExampleA

    // Bottom XAxis has Date formatting to convert unix timestamps
    // See also DateTimeAxis and SmartDateLabelProvider
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            labelFormat: ENumericFormat.Date_DDMMYYYY,
            axisTitle: "ENumericFormat.Date_DDMMYYYY",
            visibleRange: new NumberRange(1577833200, 1640991600),
            axisTitleStyle: { fontSize: 16, padding: new Thickness(20, 10, 10, 10) }
        })
    );

    sciChartSurface.xAxes.add(
        new LogarithmicAxis(wasmContext, {
            labelFormat: ENumericFormat.Scientific,
            axisTitle: "ENumericFormat.Scientific",
            visibleRange: new NumberRange(1, 1000000000000),
            axisAlignment: EAxisAlignment.Top,
            axisTitleStyle: { fontSize: 16, padding: new Thickness(10, 10, 20, 10) }
        })
    );

    // Right YAxis has Decimal formatting with 2 decimal points
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            labelFormat: ENumericFormat.Decimal,
            cursorLabelFormat: ENumericFormat.Decimal,
            labelPrecision: 2,
            labelPrefix: "$",
            labelPostfix: " USD",
            axisTitle: "ENumericFormat.Decimal",
            axisTitleStyle: { fontSize: 16 }
        })
    );

    // Left YAxis has Engineering formatting (1k, 1M, 1B, 1T)
    sciChartSurface.yAxes.add(
        new LogarithmicAxis(wasmContext, {
            labelFormat: ENumericFormat.Engineering,
            axisTitle: "ENumericFormat.Engineering",
            visibleRange: new NumberRange(1, 1000000000000),
            labelPrecision: 0,
            axisAlignment: EAxisAlignment.Left,
            axisTitleStyle: { fontSize: 16 }
        })
    );
    // #endregion

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());
}

labelproviderProperties("scichart-root");

async function builderExample(divElementId) {
    const { chartBuilder, EThemeProviderType, ENumericFormat, EAxisType, EAxisAlignment, Thickness, NumberRange } =
        SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // #region ExampleB
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: [
            {
                type: EAxisType.NumericAxis,
                options: {
                    labelFormat: ENumericFormat.Date_DDMMYYYY,
                    axisTitle: "ENumericFormat.Date_DDMMYYYY",
                    visibleRange: new NumberRange(1577833200, 1640991600),
                    axisTitleStyle: {
                        fontSize: 16,
                        padding: new Thickness(20, 10, 10, 10)
                    }
                }
            },
            {
                type: EAxisType.LogarithmicAxis,
                options: {
                    labelFormat: ENumericFormat.Scientific,
                    axisTitle: "ENumericFormat.Scientific",
                    visibleRange: new NumberRange(1, 1000000000000),
                    axisAlignment: EAxisAlignment.Top,
                    axisTitleStyle: {
                        fontSize: 16,
                        padding: new Thickness(10, 10, 20, 10)
                    }
                }
            }
        ],
        yAxes: [
            {
                type: EAxisType.NumericAxis,
                options: {
                    labelFormat: ENumericFormat.Decimal,
                    cursorLabelFormat: ENumericFormat.Decimal,
                    labelPrecision: 2,
                    labelPrefix: "$",
                    labelPostfix: " USD",
                    axisTitle: "ENumericFormat.Decimal",
                    axisTitleStyle: { fontSize: 16 }
                }
            },
            {
                type: EAxisType.NumericAxis,
                options: {
                    labelFormat: ENumericFormat.Engineering,
                    axisTitle: "ENumericFormat.Engineering",
                    visibleRange: new NumberRange(1, 1000000000000),
                    labelPrecision: 0,
                    axisAlignment: EAxisAlignment.Left,
                    axisTitleStyle: { fontSize: 16 }
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
