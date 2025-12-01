import {
    SciChartSurface,
    NumericAxis,
    EAxisAlignment,
    NumberRange,
    FastLineRenderableSeries,
    XyDataSeries,
    AUTO_COLOR,
    SweepAnimation,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    ZoomPanModifier,
    RolloverModifier,
    ESubSurfacePositionCoordinateMode,
    Rect,
    NumericLabelProvider,
    IRenderableSeries,
    EPerformanceMarkType,
    buildSeries,
    ECoordinateMode,
} from "scichart";

import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";
import { GridLayoutModifier } from "./GridLayoutModifier";
import { OverviewSubSurfaceModifier } from "./OverviewSubSurfaceModifier";
import { summaryMarkTypes } from "./markTypeCategories";

export type TMarkType = EPerformanceMarkType | string;
const getIsEventMarkType = (markType: TMarkType) => !markType.endsWith("End") && !markType.endsWith("Start");

const formatUnixDateToHumanStringHHMMSSms = (timestamp: DOMHighResTimeStamp): string => {
    const date = new Date(timestamp); // notice there's no multiplication by 1000 here. The data is expected to be in ms
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const milliseconds = date.getUTCMilliseconds();
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) {
        return "";
    }
    const hoursString = hours <= 9 ? `0${hours}` : hours.toString(10);
    const minutesString = minutes <= 9 ? `0${minutes}` : minutes.toString(10);
    const secondsString = seconds <= 9 ? `0${seconds}` : seconds.toString(10);
    const millisecondsString = milliseconds <= 9 ? `0${milliseconds}` : milliseconds.toString(10);
    return `${hoursString}:${minutesString}:${secondsString}:${millisecondsString}`;
};

class CustomLabelProvider extends NumericLabelProvider {
    // protected customFormatLabelProperty: TFormatLabelFn = (dataValueInSeconds: number) =>
    //     this.formatCursorLabelProperty(dataValueInSeconds / 1000);
    // protected customFormatCursorLabelProperty: TFormatLabelFn = (dataValueInSeconds: number) =>
    //     this.formatCursorLabelProperty(dataValueInSeconds / 1000);

    public override get formatLabel() {
        return formatUnixDateToHumanStringHHMMSSms;
    }
    public override get formatCursorLabel() {
        return formatUnixDateToHumanStringHHMMSSms;
    }
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement);


  // Optional: modifiers that act on the parent and subcharts
  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier(),
    new MouseWheelZoomModifier(),
    new ZoomExtentsModifier()
  );

  // Helper to create some sample data
  const createLineData = (phase: number) => {
    const xValues: number[] = [];
    const yValues: number[] = [];
    for (let i = 0; i < 100; i++) {
      const x = i;
      const y = Math.sin((i * 0.1) + phase);
      xValues.push(x);
      yValues.push(y);
    }
    return { xValues, yValues };
  };

  // Common X range for all panes
  const xAxis = new NumericAxis(wasmContext);
  sciChartSurface.xAxes.add(xAxis);

  // Config for N vertically stacked subcharts (panes)
  const subChartCount = 3;

  for (let i = 0; i < subChartCount; i++) {
    // Define where this subchart sits in parent surface coords
    // Here: split parent viewport into equal-height rows
    const rect = new Rect(
      0,
      (i / subChartCount),
      1,
      (1 / subChartCount)
    );

    const subChart = sciChartSurface.subCharts({
      viewport: {
        xCoord: rect.x,
        yCoord: rect.y,
        width: rect.width,
        height: rect.height,
        coordinateMode: ECoordinateMode.Relative  // 0..1 relative to parent
      }
    });

    // Each subchart gets its own Y axis, but can reuse parent X axis if desired
    const subXAxis = new NumericAxis(wasmContext);
    const subYAxis = new NumericAxis(wasmContext, { axisTitle: `Pane ${i + 1}` });

    subChart.xAxes.add(subXAxis);
    subChart.yAxes.add(subYAxis);

    const data = createLineData(i * 0.7);

    const dataSeries = new XyDataSeries(wasmContext, {
      xValues: data.xValues,
      yValues: data.yValues
    });

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
      dataSeries,
      strokeThickness: 2,
    });

    subChart.renderableSeries.add(lineSeries);
  }

  // Fit everything to view
  sciChartSurface.zoomExtents();


    // // Create an XAxis and YAxis
    // sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    // sciChartSurface.yAxes.add(
    //     new NumericAxis(wasmContext, {
    //         axisAlignment: EAxisAlignment.Left,
    //         growBy: new NumberRange(0.05, 0.05),
    //     })
    // );

    // const POINTS = 1000;
    // for (let i = 0; i < 10; i++) {
    //     // Create arrays of x, y values (just arrays of numbers)
    //     const { xValues, yValues } = new RandomWalkGenerator().getRandomWalkSeries(POINTS);

    //     // Create a Series and add to the chart
    //     sciChartSurface.renderableSeries.add(
    //         new FastLineRenderableSeries(wasmContext, {
    //             dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: `Series ${i + 1}` }),
    //             stroke: AUTO_COLOR,
    //             strokeThickness: 3,
    //             animation: new SweepAnimation({ duration: 500, fadeEffect: true }),
    //         })
    //     );
    // }

    // // Optional: Add some interactivity to the chart
    // sciChartSurface.chartModifiers.add(
    //     new ZoomExtentsModifier({ modifierGroup: "chart" }),
    //     new MouseWheelZoomModifier({ modifierGroup: "chart" }),
    //     new ZoomPanModifier({ modifierGroup: "chart" }),
    //     new RolloverModifier({ modifierGroup: "chart" }),
    //     // new OverviewSubSurfaceModifier({
    //     //     id: "overviewSubSurface",
    //     //     coordinateMode: [ESubSurfacePositionCoordinateMode.Relative, ESubSurfacePositionCoordinateMode.Relative],
    //     //     position: new Rect(0, 0.9, 1, 0.1),
    //     //     isTransparent: false,
    //     //     overviewXAxisOptions: {
    //     //         id: "overviewXAxis",
    //     //         // axisTitle: "Recording Timelapse (HHMMSSms)",
    //     //         isVisible: true,
    //     //         isInnerAxis: false,
    //     //         drawMajorBands: false,
    //     //         drawMajorGridLines: false,
    //     //         drawMinorGridLines: false,
    //     //         majorTickLineStyle: {
    //     //             color: "white",
    //     //             tickSize: 8,
    //     //             strokeThickness: 1,
    //     //         },
    //     //         labelStyle: {
    //     //             color: "white",
    //     //             fontSize: 8,
    //     //         },
    //     //         labelProvider: new CustomLabelProvider(),
    //     //     },
    //     //     overviewYAxisOptions: {
    //     //         id: "overviewYAxis",
    //     //         flippedCoordinates: true,
    //     //         growBy: new NumberRange(0.1, 0.1),
    //     //     },
    //     //     transformRenderableSeries: (rendSeries: IRenderableSeries) => {
    //     //         const seriesType = rendSeries.id.split("-").shift() as EPerformanceMarkType;
    //     //         console.log("seriesType", seriesType);
    //     //         // if (
    //     //         //     !summaryMarkTypes.includes(seriesType) &&
    //     //         //     !eventMarkTypes.includes(seriesType) &&
    //     //         //     !customOperationMarkTypes.includes(seriesType) &&
    //     //         //     !customEventMarkTypes.includes(seriesType)
    //     //         // ) {
    //     //         //     // we need only top level and custom marks in overview
    //     //         //     return undefined;
    //     //         // }

    //     //         // clone the series using builder api
    //     //         const [overviewSeries] = buildSeries(wasmContext, rendSeries.toJSON(true));
    //     //         overviewSeries.dataSeries.delete();
    //     //         overviewSeries.dataSeries = rendSeries.dataSeries;
    //     //         overviewSeries.xAxisId = "overviewXAxis";
    //     //         overviewSeries.yAxisId = "overviewYAxis";
    //     //         overviewSeries.strokeThickness = 5;
    //     //         overviewSeries.opacity = 1;
    //     //         overviewSeries.pointMarker.height = 5;
    //     //         overviewSeries.pointMarker = getIsEventMarkType(seriesType) ? overviewSeries.pointMarker : undefined;
    //     //         return overviewSeries;
    //     //     },
    //     // })
    // );

    // const glm = new GridLayoutModifier();
    // sciChartSurface.chartModifiers.add(glm);
    // glm.isGrid = true;

    // sciChartSurface.zoomExtents();

    // const setIsGridLayoutMode = (value: boolean) => {
    //     glm.isGrid = value;
    // };

    return { wasmContext, sciChartSurface };
};
