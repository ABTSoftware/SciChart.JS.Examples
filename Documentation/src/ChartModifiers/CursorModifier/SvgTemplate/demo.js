async function tooltipSvgCursorModifier(divElementId) {

  const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    CursorModifier,
    TextAnnotation,
    EHorizontalAnchorPoint,
    ECoordinateMode,
    EllipsePointMarker
  } = SciChart;

  // or for npm import { SciChartSurface, ... } from "scichart"

  // #region ExampleA
  // Create a chart surface
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    titleStyle: { fontSize: 16 }
  });

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // Add a CursorModifier to the chart
  const cursorModifier = new CursorModifier({
    showTooltip: true,
    showAxisLabels: true,
    hitTestRadius: 10,
    tooltipSvgTemplate:
  });
  sciChartSurface.chartModifiers.add(cursorModifier);
  // #endregion

  // Add some series to inspect
  const xValues = [];
  const yValues = [];
  const yValues2 = [];
  for(let i = 0; i < 50; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i*0.25) - Math.cos(i * 0.02));
    yValues2.push(0.5 * Math.cos(i*0.18) - Math.sin(i * 0.025));
  }

  const pointMarker = new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "white", strokeThickness: 0 } );

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "#FF6600",
    strokeThickness: 5,
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues,
      dataSeriesName: "Sinewave 1",
    }),
    pointMarker
  }));

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "#50C7E0",
    strokeThickness: 5,
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues: yValues2,
      dataSeriesName: "Sinewave 2",
    }),
    pointMarker
  }));

  // Add some instructions to the user
  const options = {
    xCoordinateMode: ECoordinateMode.Relative,
    yCoordinateMode: ECoordinateMode.Relative,
    x1: 0.5,
    y1: 0.0,
    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
    opacity: 0.33,
    textColor: "White",
  };
  sciChartSurface.annotations.add(new TextAnnotation({
    text: "CursorModifier Formatting",
    fontSize: 36,
    yCoordShift: 25,
    ... options,
  }));
  sciChartSurface.annotations.add(new TextAnnotation({
    text: "Move the mouse over the chart to see cursor & tooltip",
    fontSize: 20,
    yCoordShift: 75,
    ... options,
  }));
}

tooltipSvgCursorModifier("scichart-root");




async function builderExample(divElementId) {
  // Demonstrates how to configure the PinchZoomModifier in SciChart.js using the Builder API
  const {
    chartBuilder,
    EThemeProviderType,
    EAxisType,
    EChart2DModifierType,
    ENumericFormat
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // #region ExampleB
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: {
      type: EAxisType.NumericAxis,
      options: {
        // label format options applied to the X-Axis
        labelPrecision: 2,
        labelFormat: ENumericFormat.Decimal,
        // label format options applied to cursors & tooltips
        cursorLabelPrecision: 4,
        cursorLabelFormat: ENumericFormat.Decimal
      }
    },
    yAxes: {
      type: EAxisType.NumericAxis,
      options: {
        // label format options applied to the X-Axis
        labelPrecision: 2,
        labelFormat: ENumericFormat.Decimal,
        // label format options applied to cursors & tooltips
        cursorLabelPrecision: 4,
        cursorLabelFormat: ENumericFormat.Decimal
      }
    },
    modifiers: [{
      type: EChart2DModifierType.Cursor,
      options: {
        showTooltip: true,
        showAxisLabels: true,
        hitTestRadius: 10,
      }
    }]
  });
  // #endregion

  const xValues = [];
  const yValues = [];
  const yValues2 = [];
  for(let i = 0; i < 50; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i*0.25) - Math.cos(i * 0.02));
    yValues2.push(0.5 * Math.cos(i*0.18) - Math.sin(i * 0.025));
  }

  const { EllipsePointMarker, FastLineRenderableSeries, XyDataSeries } = SciChart;
  const pointMarker = new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "white", strokeThickness: 0 } );

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "#FF6600",
    strokeThickness: 5,
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues,
    }),
    pointMarker
  }));

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "#50C7E0",
    strokeThickness: 5,
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues: yValues2,
    }),
    pointMarker
  }));
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");




