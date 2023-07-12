
async function dataLabelSkipModes(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        EllipsePointMarker,
        XyDataSeries,
        NumberRange,
        SciChartJsNavyTheme,
    } = SciChart;

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        title: "Data Labels Positioning Modes",
        titleStyle: { fontSize: 20 }
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        yValues: [4.3, 5, 5, 6, 8, 6.8, 7, 7, 7.2, 6.5, 6.5, 7],
    });

    const pointMarker = new EllipsePointMarker(wasmContext, {
          width: 10,
          height: 10,
          strokeThickness: 2,
          stroke: "SteelBlue",
          fill: "LightSteelBlue"});

    // #region ExampleA
    const {
        FastLineRenderableSeries,
        ELineType,
        EDataLabelSkipMode,
        EVerticalTextPosition,
        EHorizontalTextPosition,
        Thickness
    } = SciChart;

    // or for npm: import { FastLineRenderableSeries, ... } from "scichart"

    // Shows optional positioning modes for data labels
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "SteelBlue",
        strokeThickness: 3,
        lineType: ELineType.Digital,
        pointMarker,
        dataSeries,
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
    // #endregion

    sciChartSurface.renderableSeries.add(lineSeries);
}

dataLabelSkipModes('scichart-root')
