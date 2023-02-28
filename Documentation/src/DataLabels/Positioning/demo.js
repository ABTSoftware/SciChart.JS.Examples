const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    EllipsePointMarker,
    XyDataSeries,
    ELineType,
    NumberRange,
    EDataLabelSkipMode,
    EVerticalTextPosition,
    EHorizontalTextPosition,
    Thickness
  } = SciChart;


async function dataLabelSkipModes(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "SteelBlue",
        strokeThickness: 3,
        lineType: ELineType.Digital,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 10,
            height: 10,
            strokeThickness: 2,
            stroke: "SteelBlue",
            fill: "LightSteelBlue"}),
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            yValues: [4.3, 5, 5, 6, 8, 6.8, 7, 7, 7.2, 6.5, 6.5, 7],
        }),
        // dataLabels style must be specified to show labels
        dataLabels: {
            skipMode: EDataLabelSkipMode.SkipIfSame,
            aboveBelow: false,
            verticalTextPosition: EVerticalTextPosition.Above,
            horizontalTextPosition: EHorizontalTextPosition.Left,
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                padding: new Thickness(0,5,5,0)
            },
            color: "#EEE"
        }
    });

    sciChartSurface.renderableSeries.add(lineSeries);
}

dataLabelSkipModes('scichart-root')