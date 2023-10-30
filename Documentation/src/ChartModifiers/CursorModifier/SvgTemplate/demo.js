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
    EllipsePointMarker,
    adjustTooltipPosition
  } = SciChart;

  // or for npm import { SciChartSurface, ... } from "scichart"


  // Create a chart surface
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    titleStyle: { fontSize: 16 }
  });

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // #region ExampleA
  const tooltipSvgTemplate = (
      seriesInfos,
    svgAnnotation
) => {
    const width = 120;
    const height = 120;
    const seriesInfo = seriesInfos[0];
    if (!seriesInfo?.isWithinDataBounds) {
      return "<svg></svg>";
    }
    const x = seriesInfo ? seriesInfo.formattedXValue : "";
    const y = seriesInfo ? seriesInfo.formattedYValue : "";

    // this calculates and sets svgAnnotation.xCoordShift and svgAnnotation.yCoordShift.  Do not set x1 or y1 at this point.
    adjustTooltipPosition(width, height, svgAnnotation);

    return `<svg width="${width}" height="${height}">
             <circle cx="50%" cy="50%" r="50%" fill="green"/>
             <svg width="100%">
                 <text y="40" font-size="13" font-family="Verdana" dy="0" fill="white">
                     <tspan x="50%" text-anchor="middle" dy="1.2em">Some Title</tspan>
                     <tspan x="50%" text-anchor="middle" dy="1.2em">x: ${x} y: ${y}</tspan>
                 </text>
             </svg>
         </svg>`;
  };

  // Add a CursorModifier to the chart
  const cursorModifier = new CursorModifier({
    showTooltip: true,
    showAxisLabels: true,
    tooltipSvgTemplate
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
    text: "CursorModifier Tooltip SVG",
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

