import {
  ENumericFormat,
  MouseWheelZoomModifier,
  NumericAxis,
  SciChartSurface,
  StackedColumnCollection,
  StackedColumnRenderableSeries,
  WaveAnimation,
  XyDataSeries,
  ZoomExtentsModifier,
  ZoomPanModifier,
  NumberRange,
  EPieType,
  ELegendOrientation,
  ELegendPlacement,
  PieSegment,
  SciChartPieSurface,
  PolarColumnRenderableSeries,
  PolarMouseWheelZoomModifier,
  PolarZoomExtentsModifier,
  PolarPanModifier,
  PolarNumericAxis,
  SciChartPolarSurface,
  EPolarAxisMode,
  EAxisAlignment,
  EPolarLabelMode,
  PolarCategoryAxis,
  DefaultPaletteProvider,
  parseColorToUIntArgb,
  EStrokePaletteMode,
  PolarLineRenderableSeries,
  SweepAnimation,
  RadianLabelProvider,
} from "scichart";
import { CustomLightTheme } from "./CustomLightTheme";
import { colorPalette } from "./colorPalette";

export const divElementId1 = "chart1";
export const divElementId2 = "chart2";
export const divElementId3 = "chart3";
export const divElementId4 = "chart4";

const drawChart1 = async (rootElement: string | HTMLDivElement) => {
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    rootElement,
    {
      theme: new CustomLightTheme(),
      title: "Sales $USD (Billion)",
      titleStyle: { fontSize: 22 },
    }
  );

  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
      labelFormat: ENumericFormat.Decimal,
      labelPrecision: 0,
      autoTicks: false,
      majorDelta: 1,
      minorDelta: 1,
      drawMajorGridLines: false,
      drawMinorGridLines: false,
      drawMajorBands: false,
    })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      labelPrecision: 0,
      growBy: new NumberRange(0, 0.15),
      drawMinorGridLines: false,
    })
  );

  const xValues = [
    1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003,
  ];
  const yValues1 = [10, 13, 7, 16, 4, 6, 20, 14, 16, 10, 24, 11];
  const yValues2 = [12, 17, 21, 15, 19, 18, 13, 21, 22, 20, 5, 10];
  const yValues3 = [7, 30, 27, 24, 21, 15, 17, 26, 22, 28, 21, 22];

  const rendSeries1 = new StackedColumnRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues: yValues1,
      dataSeriesName: "EU",
    }),
    fill: colorPalette.color1,
    opacity: 0.8,
    stackedGroupId: "StackedGroupId",
  });
  const rendSeries2 = new StackedColumnRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues: yValues2,
      dataSeriesName: "Asia",
    }),
    fill: colorPalette.color2,
    opacity: 0.8,
    stackedGroupId: "StackedGroupId",
  });
  const rendSeries3 = new StackedColumnRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues: yValues3,
      dataSeriesName: "USA",
    }),
    fill: colorPalette.color3,
    opacity: 0.8,
    stackedGroupId: "StackedGroupId",
  });

  const stackedColumnCollection = new StackedColumnCollection(wasmContext, {
    dataPointWidth: 0.6,
  });
  stackedColumnCollection.add(rendSeries1, rendSeries2, rendSeries3);
  stackedColumnCollection.animation = new WaveAnimation({
    duration: 1000,
    fadeEffect: true,
  });

  sciChartSurface.renderableSeries.add(stackedColumnCollection);

  sciChartSurface.chartModifiers.add(
    new ZoomExtentsModifier(),
    new ZoomPanModifier({ enableZoom: true }),
    new MouseWheelZoomModifier()
  );

  sciChartSurface.zoomExtents();

  return { wasmContext, sciChartSurface, stackedColumnCollection };
};

const drawPieChart = async (rootElement: string | HTMLDivElement) => {
  const sciChartPieSurface = await SciChartPieSurface.create(rootElement, {
    theme: new CustomLightTheme(),
    pieType: EPieType.Pie,
    animate: true,
    seriesSpacing: 5,
    showLegend: true,
    showLegendSeriesMarkers: true,
    animateLegend: true,
  });
  sciChartPieSurface.legend.orientation = ELegendOrientation.Vertical;
  sciChartPieSurface.legend.placement = ELegendPlacement.TopLeft;

  const dataset = [
    { name: "Samsung", percent: 29.21 },
    { name: "Apple", percent: 28.41 },
    { name: "Xiaomi", percent: 12.73 },
    { name: "Huawei", percent: 5.27 },
  ];

  const pieColors = [
    colorPalette.color1,
    colorPalette.color2,
    colorPalette.color3,
    colorPalette.color4,
  ];

  const radiusSize = [
    0.8, 0.8, 0.8, 0.8, 0.85, 0.85, 0.85, 0.9, 0.9, 0.9, 0.95, 0.95, 0.95, 0.95,
    0.95,
  ];

  const pieSegments = dataset.map(
    (row, index) =>
      new PieSegment({
        value: row.percent,
        text: row.name,
        labelStyle: { color: "#333333" },
        radiusAdjustment: radiusSize[index],
        showLabel: false,
        color: pieColors[index],
      })
  );

  sciChartPieSurface.pieSegments.add(...pieSegments);

  return { sciChartSurface: sciChartPieSurface };
};

class ColumnPaletteProvider extends DefaultPaletteProvider {
  private threshold: number;
  private positiveFillColor: number;
  private positiveStroke: number;
  private negativeFillColor: number;
  private negativeStroke: number;

  constructor(threshold: number) {
    super();
    this.strokePaletteMode = EStrokePaletteMode.SOLID;
    this.threshold = threshold;
    this.positiveStroke = parseColorToUIntArgb(colorPalette.color1);
    this.positiveFillColor = parseColorToUIntArgb(colorPalette.color1, 127);
    this.negativeStroke = parseColorToUIntArgb(colorPalette.color4);
    this.negativeFillColor = parseColorToUIntArgb(colorPalette.color4, 127);
  }

  overrideStrokeArgb(
    xValue: number,
    yValue: number,
    index: number,
    opacity: number,
    metadata: any
  ) {
    return yValue < this.threshold ? this.positiveStroke : this.negativeStroke;
  }

  overrideFillArgb(
    xValue: number,
    yValue: number,
    index: number,
    opacity: number,
    metadata: any
  ) {
    return yValue < this.threshold
      ? this.positiveFillColor
      : this.negativeFillColor;
  }
}

const DATA_UK = {
  labels: [
    "Poultry",
    "Fruit",
    "Milk",
    "Cheese",
    "Pizza",
    "Meat",
    "Cereals",
    "Eggs",
    "Oats",
    "Lamb",
    "Butter",
    "Chocolate",
    "Sheep",
    "OliveOil",
  ],
  data: [
    -18.5, -12.5, -11.7, -9.2, -7.2, -6.8, -5.9, 7.8, 9.1, 10.2, 10.2, 11.7,
    17.6, 22.1,
  ],
};

const drawPolarChart = async (rootElement: string | HTMLDivElement) => {
  const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(
    rootElement,
    {
      theme: new CustomLightTheme(),
      title: "Consumer prices relative to past year in UK, 2024",
      titleStyle: { fontSize: 22 },
    }
  );

  sciChartSurface.yAxes.add(
    new PolarNumericAxis(wasmContext, {
      polarAxisMode: EPolarAxisMode.Radial,
      axisAlignment: EAxisAlignment.Right,
      visibleRange: new NumberRange(
        Math.min(...DATA_UK.data),
        Math.max(...DATA_UK.data) + 4
      ),
      drawMinorTickLines: false,
      drawMajorTickLines: false,
      useNativeText: true,
      drawMinorGridLines: false,
      zoomExtentsToInitialRange: true,
      labelPostfix: "",
      labelPrecision: 0,
      innerRadius: 0.15,
      startAngle: Math.PI / 2,
      drawLabels: true,
    })
  );

  sciChartSurface.xAxes.add(
    new PolarCategoryAxis(wasmContext, {
      polarAxisMode: EPolarAxisMode.Angular,
      axisAlignment: EAxisAlignment.Top,
      polarLabelMode: EPolarLabelMode.Parallel,
      visibleRange: new NumberRange(-1, DATA_UK.data.length),
      drawMajorGridLines: false,
      drawMinorGridLines: false,
      drawMinorTickLines: false,
      useNativeText: true,
      zoomExtentsToInitialRange: true,
      flippedCoordinates: true,
      labelPrecision: 0,
      totalAngle: Math.PI * 2,
      startAngle: Math.PI / 2,
      autoTicks: false,
      majorDelta: 1,
      labels: DATA_UK.labels,
      drawMajorTickLines: false,
    })
  );

  sciChartSurface.renderableSeries.add(
    new PolarColumnRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, {
        xValues: Array.from({ length: DATA_UK.data.length }, (_, i) => i),
        yValues: DATA_UK.data,
      }),
      dataPointWidth: 0.6,
      strokeThickness: 2,
      paletteProvider: new ColumnPaletteProvider(0),
      animation: new WaveAnimation({
        duration: 800,
        zeroLine: 0,
        fadeEffect: true,
      }),
    })
  );

  sciChartSurface.chartModifiers.add(
    new PolarPanModifier(),
    new PolarZoomExtentsModifier(),
    new PolarMouseWheelZoomModifier()
  );

  return { sciChartSurface, wasmContext };
};

const drawPolarLineChart = async (rootElement: string | HTMLDivElement) => {
  const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(
    rootElement,
    {
      theme: new CustomLightTheme(),
      title: "Line Function Traces",
      titleStyle: { fontSize: 22 },
    }
  );

  sciChartSurface.yAxes.add(
    new PolarNumericAxis(wasmContext, {
      polarAxisMode: EPolarAxisMode.Radial,
      axisAlignment: EAxisAlignment.Right,
      visibleRange: new NumberRange(0, 1),
      zoomExtentsToInitialRange: true,
      drawLabels: false,
      drawMinorGridLines: false,
      drawMinorTickLines: false,
      drawMajorTickLines: false,
      innerRadius: 0.05,
      startAngle: 0,
    })
  );

  sciChartSurface.xAxes.add(
    new PolarNumericAxis(wasmContext, {
      polarAxisMode: EPolarAxisMode.Angular,
      axisAlignment: EAxisAlignment.Top,
      visibleRange: new NumberRange(0, Math.PI * 2),
      zoomExtentsToInitialRange: true,
      drawMajorGridLines: true,
      drawMinorGridLines: false,
      labelProvider: new RadianLabelProvider({ maxDenominator: 6 }),
      autoTicks: false,
      majorDelta: Math.PI / 6,
      totalAngle: Math.PI * 2,
      startAngle: 0,
    })
  );

  function generatePolarTraces(numPoints = 300) {
    const theta = Array.from(
      { length: numPoints },
      (_, i) => (i / (numPoints - 1)) * 2 * Math.PI
    );
    const normalize = (data: number[]) => {
      const min = Math.min(...data);
      const max = Math.max(...data);
      return data.map((d) => (d - min) / (max - min));
    };
    return {
      xValues: theta,
      data: [
        {
          name: "Rose",
          yValues: normalize(theta.map((t) => Math.cos(12 * t))),
          color: colorPalette.color1,
        },
        {
          name: "Butterfly",
          yValues: normalize(
            theta.map(
              (t) =>
                Math.exp(Math.cos(t)) -
                2 * Math.cos(4 * t) +
                Math.pow(Math.sin(t / 12), 5)
            )
          ),
          color: colorPalette.color2,
        },
      ],
    };
  }

  const traces = generatePolarTraces();
  traces.data.forEach((dataset) => {
    sciChartSurface.renderableSeries.add(
      new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
          xValues: traces.xValues,
          yValues: dataset.yValues,
          dataSeriesName: dataset.name,
        }),
        stroke: dataset.color,
        strokeThickness: 4,
        animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
      })
    );
  });

  sciChartSurface.chartModifiers.add(
    new PolarPanModifier(),
    new PolarZoomExtentsModifier(),
    new PolarMouseWheelZoomModifier()
  );

  return { sciChartSurface, wasmContext };
};

export const drawExample = async () => {
  const chart1 = await drawChart1(divElementId1);
  const chart2 = await drawPieChart(divElementId2);
  const chart3 = await drawPolarChart(divElementId3);
  const chart4 = await drawPolarLineChart(divElementId4);

  return {
    wasmContext: chart1.wasmContext,
    sciChartSurface: chart1.sciChartSurface,
    surfaces: [
      chart1.sciChartSurface,
      chart2.sciChartSurface,
      chart3.sciChartSurface,
      chart4.sciChartSurface,
    ],
  };
};
