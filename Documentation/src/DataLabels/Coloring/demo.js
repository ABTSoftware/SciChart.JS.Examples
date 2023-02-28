const {
  SciChartSurface,
  NumericAxis,
  FastColumnRenderableSeries,
  EllipsePointMarker,
  XyDataSeries,
  NumberRange,
  EColumnDataLabelPosition,
  parseColorToUIntArgb,
  Thickness
} = SciChart;

async function dataLabelColoring(divElementId) {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    divElementId
  );

  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) })
  );

  const columnSeries = new FastColumnRenderableSeries(wasmContext, {
    stroke: "SteelBlue",
    fill: "LightSteelBlue",
    strokeThickness: 1,
    dataSeries: new XyDataSeries(wasmContext, {
      xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      yValues: [-3, -4, 0, 2, 6.3, 3, 4, 8, 7, 5, 6, 8],
    }),
    dataLabels: {
      positionMode: EColumnDataLabelPosition.Outside,
      style: {
        fontFamily: "Arial",
        fontSize: 18,
        padding: new Thickness(3, 0, 3, 0),
      },
      color: "#EEE",
    },
  });
  sciChartSurface.renderableSeries.add(columnSeries);

  const red = parseColorToUIntArgb("red");
  const yellow = parseColorToUIntArgb("yellow");
  const green = parseColorToUIntArgb("green");
  columnSeries.dataLabelProvider.getColor = (dataLabelState, text) => {
    const y = dataLabelState.yVal();
    if (y <= 0) return red;
    if (y <= 5) return yellow;
    return green;
  };
}

dataLabelColoring("scichart-root");
