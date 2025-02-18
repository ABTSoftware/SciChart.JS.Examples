// #region helperFunctions
const subChartsNumber = 100;
let columnsNumber = 10;
let rowsNumber = 10;

let colorIndex = 0;
function getRandomColor() {
  return ["#274b92", "#47bde6", "#ae418d", "#e97064", "#68bcae", "#634e96"][
    colorIndex++ % 6
  ];
}

let dataCount = 10;
const xValuesBuffer = new Float64Array(dataCount);
const yValuesBuffer = new Float64Array(dataCount);
function generateRandomData(xStart = 0) {
  for (let i = 0; i < dataCount; i++) {
    xValuesBuffer[i] = i + xStart;
    yValuesBuffer[i] = Math.random();
  }
  return { xValues: xValuesBuffer, yValues: yValuesBuffer };
}

function getSubChartPositionIndexes(chartIndex, columnNumber) {
  const rowIndex = Math.floor(chartIndex / columnNumber);
  const columnIndex = chartIndex % columnNumber;
  return { rowIndex, columnIndex };
}
// #endregion

// #region ExampleA
const {
  SciChartSurface,
  NumericAxis,
  SciChartJsNavyTheme,
  Rect,
  XyDataSeries,
  FastLineRenderableSeries,
  Thickness,
  EAutoRange,
  TextAnnotation,
  EHorizontalAnchorPoint,
  EVerticalAnchorPoint,
  ECoordinateMode,
} = SciChart;
// or, for npm, import { SciChartSurface, ... } from "scichart"

// demonstrates how to create a massive 10x10 panel of charts using SubCharts API
async function create10x10PanelChart(divElementId) {
  // Create a parent (regular) SciChartSurface which will contain the sub-chart
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    divElementId,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );

  // Add a Sub-Charts to the main surface. This will display a rectangle showing the current zoomed in area on the parent chart
  for (
    let subChartIndex = 0;
    subChartIndex < subChartsNumber;
    ++subChartIndex
  ) {
    const { rowIndex, columnIndex } = getSubChartPositionIndexes(
      subChartIndex,
      columnsNumber
    );
    const width = 1 / columnsNumber;
    const height = 1 / rowsNumber;

    const position = new Rect(
      columnIndex * width,
      rowIndex * height,
      width,
      height
    );

    const subChartOptions = {
      subChartPadding: Thickness.fromNumber(5),
      id: `subChart-${subChartIndex}`,
      position,
    };

    const subSurface = sciChartSurface.addSubChart(subChartOptions);

    subSurface.xAxes.add(
      new NumericAxis(wasmContext, {
        isVisible: false,
        autoRange: EAutoRange.Always,
      })
    );
    subSurface.yAxes.add(new NumericAxis(wasmContext, { isVisible: false }));

    // Add random data series
    subSurface.renderableSeries.add(
      new FastLineRenderableSeries(wasmContext, {
        stroke: getRandomColor(),
        strokeThickness: 2,
        dataSeries: new XyDataSeries(wasmContext, {
          fifoCapacity: dataCount * 20,
        }),
      })
    );

    // Add an annotation to the sub-chart showing the index
    subSurface.annotations.add(
      new TextAnnotation({
        x1: 0,
        y1: 0,
        text: `${subChartIndex + 1}`,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        fontSize: 16,
        fontWeight: "bold",
        textColor: "#FFFFFF",
        background: "#00000077",
      })
    );
  }

  // If you return the parent chart to the caller
  // you can access sciChartSurface.subCharts to configure the child chars (add series, data)
  return {
    sciChartSurface,
  };
}
// #endregion

// #region dataUpdates
create10x10PanelChart("scichart-root").then((result) => {
  // After chart creation, simulate data updates at 60Hz with new data applied
  // to each sub-chart in the panel
  let pointsAppended = 0;
  setInterval(() => {
    for (let i = 0; i < subChartsNumber; i++) {
      const subChart = result.sciChartSurface.subCharts[i];
      const dataSeries = subChart.renderableSeries.get(0).dataSeries;

      const { xValues, yValues } = generateRandomData(pointsAppended);
      dataSeries.appendRange(xValues, yValues);
    }
    pointsAppended += dataCount;
  }, 100);
});
// #endregion

// #region ExampleC
// Demonstrates how to create a 1x2 panel of charts using SubCharts and the Builder API
async function builderExample(divElementId) {
  // Demonstrates how to create a line chart with SciChart.js using the Builder API
  const { chartBuilder, EAxisType, Rect, ESeriesType, Thickness } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const subCharts = [];
  for (
    let subChartIndex = 0;
    subChartIndex < subChartsNumber;
    ++subChartIndex
  ) {
    const { rowIndex, columnIndex } = getSubChartPositionIndexes(
      subChartIndex,
      columnsNumber
    );
    const width = 1 / columnsNumber;
    const height = 1 / rowsNumber;
    const position = new Rect(
      columnIndex * width,
      rowIndex * height,
      width,
      height
    );
    subCharts.push({
      surface: {
        id: `subChart-${subChartIndex}`,
        subChartPadding: Thickness.fromNumber(5),
        position,
      },
      xAxes: {
        type: EAxisType.NumericAxis,
        options: { isVisible: false },
      },
      yAxes: {
        type: EAxisType.NumericAxis,
        options: { isVisible: false },
      },
      series: {
        type: ESeriesType.LineSeries,
        xyData: {
          fifoCapacity: dataCount,
          xValues: generateRandomData(0).xValues,
          yValues: generateRandomData(0).yValues,
        },
        options: { stroke: "#44C8F1", strokeThickness: 3 },
      },
    });
  }

  const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(
    divElementId,
    {
      surface: { padding: Thickness.fromNumber(0) },
      subCharts,
    }
  );

  return {
    sciChartSurface,
  };
}
// #endregion

if (location.search.includes("builder=1")) builderExample("scichart-root");
