const animateInOut = async (divElementId) => {
  // #region ExampleA
  // Demonstrates how to create a text chart with SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    makeIncArray,
    XyDataSeries,
    AUTO_COLOR,
    ScaleAnimation,
    ZoomExtentsModifier,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    SplineLineRenderableSeries
  } = SciChart;

  // Create a SciChartSurface
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);

  // Create an xAxis, yAxis
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // Create a Line Series
  const xValues = makeIncArray(15);
  for (let i = 0; i < 6; i++) {
    const yValues = xValues.map(() => Math.random() * 10);
    const lineSeries = new SplineLineRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
      stroke: AUTO_COLOR,
      strokeThickness: 4
    });

    sciChartSurface.renderableSeries.add(lineSeries);

    lineSeries.animation = new ScaleAnimation({ 
      duration: 700,
      delay: i * 800,
      
      onCompleted: () => {
        lineSeries.runAnimation(
          new ScaleAnimation({
            duration: 700,
            reverse: true,
          })
        )
      }
    });
  }

  // Add some interactivity modifiers
  sciChartSurface.chartModifiers.add(
    new ZoomExtentsModifier(), 
    new ZoomPanModifier(), 
    new MouseWheelZoomModifier()
  );

  sciChartSurface.zoomExtents();
  // #endregion
};

animateInOut("scichart-root");




async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to create a band chart with SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EThemeProviderType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const xValues = [];
  const yValues = [];
  const y1Values = [];
  const POINTS = 1000;
  const STEP = (3 * Math.PI) / POINTS;
  for (let i = 0; i <= 1000; i++) {
    const k = 1 - i / 2000;
    xValues.push(i);
    yValues.push(Math.sin(i * STEP) * k * 0.7);
    y1Values.push(Math.cos(i * STEP) * k);
  }

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: [
      {
        type: ESeriesType.BandSeries,
        xyyData: {
          xValues,
          yValues,
          y1Values
        },
        options: {
          stroke: "#FF1919FF",
          strokeY1: "#279B27FF",
          fill: "#279B2733",
          fillY1: "#FF191933",
          strokeThickness: 2,
        }
      }
    ]
  });
  // #endregion
};

if (location.search.includes("builder=1"))
builderExample("scichart-root");