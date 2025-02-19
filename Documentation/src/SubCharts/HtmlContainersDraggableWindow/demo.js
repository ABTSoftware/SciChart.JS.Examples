const xValues = [];
const yValues = [];
for (let i = 0; i < 100; i++) {
  xValues.push(i);
  yValues.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
}

const {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  SciChartJsNavyTheme,
  Rect,
  ECoordinateMode,
  ZoomPanModifier,
  ZoomExtentsModifier,
  MouseWheelZoomModifier,
  BoxAnnotation,
  NumberRange,
  generateGuid,
} = SciChart;

// or, for npm, import { SciChartSurface, ... } from "scichart"

function createSubChartContainer(sciChartSurface, subChartOptions) {
  // Create the subChartContainer HTML and add to the DOM
  const container = document.createElement("div");
  container.id = generateGuid(); // generateGuid imported from SciChart
  container.style.position = "absolute";
  container.style.border = "1px solid SteelBlue";
  document.body.appendChild(container);

  // Create a top bar header HTML element for the subchart
  const div = document.createElement("div");
  div.style.pointerEvents = "all";
  div.style.position = "absolute";
  div.style.top = "0";
  div.style.width = "100%";
  div.style.height = "30px";
  div.style.backgroundColor = "#4682b477";
  // className is required to specify that this is a top-section bar, to be positioned outside the chart
  // even if this class isn't used or specified in the DOM.
  // Default available options are "top-section", "bottom-section", "left-section", "right-section"
  div.className = "top-section";
  container.appendChild(div);

  // Add a Sub-Charts to the main surface. This will display a rectangle showing the current zoomed in area on the parent chart
  return sciChartSurface.addSubChart({
    ...subChartOptions,
    // Specify the subChartContainer
    subChartContainerId: container.id,
  });
}

async function simpleSubChart(divElementId) {
  // Create a parent (regular) SciChartSurface which will contain the sub-chart
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    divElementId,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );

  // Create X,Y axis on the parent chart and programmatically zoom into part of the data
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const subChart1 = createSubChartContainer(sciChartSurface, {
    position: new Rect(0.1, 0.1, 0.6, 0.4),
    isTransparent: false,
    isVisible: true,
    coordinateMode: ECoordinateMode.Relative,
    title: "SubChart with HTML Elements",
    titleStyle: { fontSize: 16, color: "#eeeeee77" },
  });

  // Add x,y axis to the subchart
  subChart1.xAxes.add(new NumericAxis(wasmContext));
  subChart1.yAxes.add(new NumericAxis(wasmContext));

  // Add a series to the subchart
  subChart1.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      stroke: "#47bde6",
      strokeThickness: 5,
      dataSeries: new XyDataSeries(wasmContext, {
        xValues,
        yValues,
      }),
    })
  );
}

simpleSubChart("scichart-root");

async function builderExample(divElementId) {
  // Demonstrates how to create a line chart with SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EAxisType,
    EThemeProviderType,
    Rect,
    ECoordinateMode,
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // #region ExampleB
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(
    divElementId,
    {
      surface: { theme: { type: EThemeProviderType.Dark } },
      // Main chart definition is here
      xAxes: { type: EAxisType.NumericAxis },
      yAxes: { type: EAxisType.NumericAxis },
      // Subchart definition is here
      subCharts: [
        {
          surface: {
            position: new Rect(0.1, 0.1, 0.6, 0.4),
            isTransparent: false,
            isVisible: true,
            coordinateMode: ECoordinateMode.Relative,
            title: "SubChart with HTML Elements",
            titleStyle: { fontSize: 16, color: "#eeeeee77" },
            // Specify the subChartContainer for extra HTML elements
            // These will be positioned by SciChartSubSurface
            // This property accepts a string or an HTMLDivElement
            subChartContainerId: "sub-chart-container-id-1",
          },
          // Define the x,y axis on Subchart
          xAxes: { type: EAxisType.NumericAxis },
          yAxes: { type: EAxisType.NumericAxis },
          // Define the series on Subchart
          series: [
            {
              type: ESeriesType.LineSeries,
              xyData: {
                xValues,
                yValues: yValues1,
              },
              options: {
                stroke: "#0066FF",
                strokeThickness: 5,
              },
            },
          ],
        },
      ],
    }
  );
  // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
