async function simpleScatterChart(divElementId) {
  // #region ExampleA
  // Demonstrates how to create a scatter chart with SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    XyDataSeries,
    XyScatterRenderableSeries,
    EllipsePointMarker,
    SciChartJsNavyTheme
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const xValues = [];
  const yValues = [];
  for(let i = 0; i < 100; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i*0.1) - Math.cos(i * 0.01));
  }

  const xyDataSeries = new XyDataSeries(wasmContext, {
    xValues,
    yValues,
  });

  const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
    dataSeries: xyDataSeries,
    pointMarker: new EllipsePointMarker(wasmContext, {
      width: 7,
      height: 7,
      strokeThickness: 2,
      fill: "steelblue",
      stroke: "LightSteelBlue",
    }),
  });

  sciChartSurface.renderableSeries.add(scatterSeries);

  // #endregion
};

simpleScatterChart("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to create a scatter with SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EPointMarkerType,
    EThemeProviderType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const xValues = [];
  const yValues = [];
  for( let i = 0; i < 100; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i*0.1) - Math.cos(i * 0.01));
  }

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: [
      {
        type: ESeriesType.ScatterSeries,
        xyData: {
          xValues,
          yValues
        },
        options: {
          pointMarker: {
            type: EPointMarkerType.Ellipse,
            options: {
              width: 7,
              height: 7,
              strokeThickness: 1,
              fill: "steelblue",
              stroke: "LightSteelBlue",
            }
          },
        }
      }
    ]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
