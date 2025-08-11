async function createScatterChartWithManyPointMarkers(divElementId) {
  // Demonstrates how to create a line chart with pointmarkers using SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    XyDataSeries,
    XyScatterRenderableSeries,
    EllipsePointMarker,
    SquarePointMarker,
    CrossPointMarker,
    SpritePointMarker,
    TrianglePointMarker,
    SciChartJsNavyTheme,
    createImageAsync,
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const createData = (wasmContext) => {
    // Create some dataseries
    const xValues = [];
    const yValues1 = [];
    const yValues2 = [];
    const yValues3 = [];
    const yValues4 = [];
    const yValues5 = [];

    // Append values
    const dataSize = 30;
    for (let i = 0; i < dataSize; i++) {
      xValues.push(i);
      yValues1.push(Math.random() + 0.5);
      yValues2.push(Math.random() + 2);
      yValues3.push(Math.random() + 4);
      yValues4.push(Math.random() + 6);
      yValues5.push(Math.random() + 8);
    }

    return { xValues, yValues1, yValues2, yValues3, yValues4, yValues5 };
  };

  // #region ExampleA
  // Create a chart with X,Y axis
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    divElementId,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, { growBy: new NumberRange(0.0, 0.4) })
  );

  // Create some data
  const { xValues, yValues1, yValues2, yValues3, yValues4, yValues5 } =
    createData();

  const commonOptions = { width: 11, height: 11, strokeThickness: 2 };

  // Add a line series with EllipsePointMarker
  sciChartSurface.renderableSeries.add(
    new XyScatterRenderableSeries(wasmContext, {
      pointMarker: new EllipsePointMarker(wasmContext, {
        ...commonOptions,
        fill: "#0077FF99",
        stroke: "LightSteelBlue",
      }),
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues1 }),
    })
  );

  // Add a scatter series with SquarePointMarker
  sciChartSurface.renderableSeries.add(
    new XyScatterRenderableSeries(wasmContext, {
      pointMarker: new SquarePointMarker(wasmContext, {
        ...commonOptions,
        fill: "#FF000099",
        stroke: "Red",
      }),
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues2 }),
    })
  );

  // Add a scatter series with TrianglePointMarker
  sciChartSurface.renderableSeries.add(
    new XyScatterRenderableSeries(wasmContext, {
      pointMarker: new TrianglePointMarker(wasmContext, {
        ...commonOptions,
        fill: "#FFDD00",
        stroke: "#FF6600",
      }),
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues3 }),
    })
  );

  // Add a scatter series with CrossPointMarker
  sciChartSurface.renderableSeries.add(
    new XyScatterRenderableSeries(wasmContext, {
      pointMarker: new CrossPointMarker(wasmContext, {
        ...commonOptions,
        stroke: "#FF00FF",
      }),
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues4 }),
    })
  );

  // Add a scatter series with Custom Image using SpritePointMarker
  const imageBitmap = await createImageAsync(
    "https://scichart.com/demo/images/CustomMarkerImage.png"
  );

  sciChartSurface.renderableSeries.add(
    new XyScatterRenderableSeries(wasmContext, {
      pointMarker: new SpritePointMarker(wasmContext, {
        image: imageBitmap,
      }),
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues5 }),
    })
  );
  // #endregion
}

createScatterChartWithManyPointMarkers("scichart-root");

// Demonstrates the alternative Builder-API to create a line chart with gaps
async function builderExample(divElementId) {
  const {
    chartBuilder,
    NumberRange,
    EAxisType,
    ESeriesType,
    EPointMarkerType,
    EThemeProviderType,
    createImageAsync,
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const createData = (wasmContext) => {
    // Create some dataseries
    const xValues = [];
    const yValues1 = [];
    const yValues2 = [];
    const yValues3 = [];
    const yValues4 = [];
    const yValues5 = [];

    // Append values
    const dataSize = 30;
    for (let i = 0; i < dataSize; i++) {
      xValues.push(i);
      yValues1.push(Math.random() + 0.5);
      yValues2.push(Math.random() + 2);
      yValues3.push(Math.random() + 4);
      yValues4.push(Math.random() + 6);
      yValues5.push(Math.random() + 8);
    }

    return { xValues, yValues1, yValues2, yValues3, yValues4, yValues5 };
  };

  const { xValues, yValues1, yValues2, yValues3, yValues4, yValues5 } =
    createData();

  // #region ExampleB
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(
    divElementId,
    {
      surface: { theme: { type: EThemeProviderType.Dark } },
      xAxes: { type: EAxisType.NumericAxis },
      yAxes: {
        type: EAxisType.NumericAxis,
        options: { growBy: new NumberRange(0, 0.15) },
      },
      series: [
        {
          type: ESeriesType.ScatterSeries,
          xyData: {
            xValues,
            yValues: yValues1,
          },
          options: {
            pointMarker: {
              type: EPointMarkerType.Ellipse,
              options: {
                width: 11,
                height: 11,
                strokeThickness: 2,
                fill: "#0077FF99",
                stroke: "LightSteelBlue",
              },
            },
          },
        },
        {
          type: ESeriesType.ScatterSeries,
          xyData: {
            xValues,
            yValues: yValues2,
          },
          options: {
            pointMarker: {
              type: EPointMarkerType.Square,
              options: {
                width: 11,
                height: 11,
                strokeThickness: 2,
                fill: "#FF000099",
                stroke: "Red",
              },
            },
          },
        },
        {
          type: ESeriesType.ScatterSeries,
          xyData: {
            xValues,
            yValues: yValues3,
          },
          options: {
            pointMarker: {
              type: EPointMarkerType.Triangle,
              options: {
                width: 11,
                height: 11,
                strokeThickness: 2,
                fill: "#FFDD00",
                stroke: "#FF6600",
              },
            },
          },
        },
        {
          type: ESeriesType.ScatterSeries,
          xyData: {
            xValues,
            yValues: yValues4,
          },
          options: {
            pointMarker: {
              type: EPointMarkerType.Cross,
              options: {
                width: 11,
                height: 11,
                strokeThickness: 2,
                stroke: "#FF00FF",
              },
            },
          },
        },
        {
          type: ESeriesType.ScatterSeries,
          xyData: {
            xValues,
            yValues: yValues5,
          },
          options: {
            pointMarker: {
              type: EPointMarkerType.Sprite,
              options: {
                image: await createImageAsync(
                  "https://scichart.com/demo/images/CustomMarkerImage.png"
                ),
              },
            },
          },
        },
      ],
    }
  );
  // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
