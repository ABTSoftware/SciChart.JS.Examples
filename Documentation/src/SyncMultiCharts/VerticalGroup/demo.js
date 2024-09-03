async function synchronizeTwoChartsBasicExample() {
  // #region ExampleB
  // Demonstrates how to synchronize two charts with SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    TextAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    SciChartVerticalGroup,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    RolloverModifier
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const createSciChartSurface = async (div) => {
    const isFirstChart = div === "chart0Div";

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(div, {
      theme: new SciChartJsNavyTheme(),
    });
    // Create some deliberate differences between chart 0 and chart 1
    sciChartSurface.background = isFirstChart ? "#22365B" : "#18304A";
    sciChartSurface.canvasBorder = isFirstChart ? { borderBottom: 4, color: "#55698E"} : undefined;

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
      axisTitle: isFirstChart ? "XAxis 0" : "XAxis 1",
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
      // Create some deliberate differences between chart 0 and chart 1
      labelPrecision: isFirstChart ? 2 : 4,
      axisTitle: isFirstChart ? "YAxis 0" : "YAxis 1"
    }));

    const xValues = [];
    const yValues = [];
    for(let i = 0; i < 100; i++) {
      const coef = isFirstChart ? 1 : 0.5
      xValues.push(i);
      yValues.push(0.2 * coef * Math.sin(i*0.1/coef) - Math.cos(i * 0.01));
    }

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
      // Create some deliberate differences between chart 0 and chart 1
      stroke: isFirstChart ? "#FF6600" : "#3377FF",
      strokeThickness: 5,
      dataSeries: new XyDataSeries(wasmContext, {
        xValues,
        yValues,
      })
    }));

    const watermarkOptions = {
      x1: 0.5,
      y1: 0.5,
      xCoordinateMode: ECoordinateMode.Relative,
      yCoordinateMode: ECoordinateMode.Relative,
      horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
      verticalAnchorPoint: EVerticalAnchorPoint.Center
    }
    sciChartSurface.annotations.add(new TextAnnotation({
      ...watermarkOptions,
      textColor: "#FFFFFF77",
      fontSize: 20,
      yCoordShift: -30,
      text: isFirstChart ? "SciChartSurface #0" : "SciChartSurface #1",
    }));
    sciChartSurface.annotations.add(new TextAnnotation({
      ...watermarkOptions,
      text: "Drag to zoom, or mousewheel the chart to view synchronization",
      textColor: "#FFFFFF44",
      fontSize: 16,
    }));
    return sciChartSurface;
  }

  // #endregion

  // #region ExampleA
  // Step1: Create two SciChartSurfaces with separate <div> elements in the DOM

  // Create the first chart, Expects a <div id="chart0Div"> in the DOM
  const sciChartSurface0 = await createSciChartSurface("chart0Div");
  // Create the second chart, Expects a <div id="chart1Div"> in the DOM
  const sciChartSurface1 = await createSciChartSurface("chart1Div");

  // Step2: Synchronize the two chart visibleRanges
  sciChartSurface0.xAxes.get(0).visibleRangeChanged.subscribe((data1) => {
    sciChartSurface1.xAxes.get(0).visibleRange = data1.visibleRange;
  });
  sciChartSurface1.xAxes.get(0).visibleRangeChanged.subscribe((data1) => {
    sciChartSurface0.xAxes.get(0).visibleRange = data1.visibleRange;
  });

  // Step 3: Synchronize the two chart axis sizes using SciChartVerticalGroup
  // this is useful in case the Y-axis have different ranges or number of decimal points
  const verticalGroup = new SciChartVerticalGroup();
  verticalGroup.addSurfaceToGroup(sciChartSurface0);
  verticalGroup.addSurfaceToGroup(sciChartSurface1);

  // Step 4: Add some cursors, zooming behaviours and link them with a modifier group
  // This ensures mouse events on one chart are sent to the other chart
  const group0 = "modifierGroup0";
  sciChartSurface0.chartModifiers.add(
    new ZoomPanModifier({ modifierGroup: group0 }),
    new MouseWheelZoomModifier({ modifierGroup: group0 }),
    new RolloverModifier({ modifierGroup: group0 }),
  );
  const group1 = "modifierGroup0";
  sciChartSurface1.chartModifiers.add(
    new ZoomPanModifier({ modifierGroup: group1 }),
    new MouseWheelZoomModifier({ modifierGroup: group1 }),
    new RolloverModifier({ modifierGroup: group1 }),
  );
  // #endregion
};

synchronizeTwoChartsBasicExample("chart0", "chart1");


async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to create a line chart with SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EThemeProviderType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: [
      {
        type: ESeriesType.LineSeries,
        xyData: {
          xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          yValues: [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0]
        },
        options: {
          stroke: "#0066FF",
          strokeThickness: 5,
        }
      }
    ]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
builderExample("scichart-root");
