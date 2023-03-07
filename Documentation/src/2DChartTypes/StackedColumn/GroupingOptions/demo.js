async function stackedColumnOptions() {
  // Demonstrates how to create a Column chart with SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    StackedColumnRenderableSeries,
    StackedColumnCollection,
    XyDataSeries,
    SciChartJsNavyTheme,
    MouseWheelZoomModifier,
    ZoomPanModifier,
    ZoomExtentsModifier,
    TextAnnotation,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    ECoordinateMode,
    NumberRange
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  // Data for the example
  const xValues = [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003];
  const yValues1 = [10, 13, 7, 16, 4, 6, 20, 14, 16, 10, 24, 11];
  const yValues2 = [12, 17, 21, 15, 19, 18, 13, 21, 22, 20, 5, 10];
  const yValues3 = [7, 30, 27, 24, 21, 15, 17, 26, 22, 28, 21, 22];

  // Helper to add a chart title via annotations. Yes we are working on improving chart titles!
  const addChartTitle = (sciChartSurface, title) => {
    sciChartSurface.annotations.add(new TextAnnotation({
      x1: 0.5,
      y1: 0,
      xCoordinateMode: ECoordinateMode.Relative,
      yCoordinateMode: ECoordinateMode.Relative,
      horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
      verticalAnchorPoint: EVerticalAnchorPoint.Top,
      text: title,
      fontFamily: "Arial",
      fontSize: 16,
      textColor: "#EEE"
    }));
  };

  const createStackedExample = async (divElementId, title) => {
    // #region ExampleA
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
      theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.1 )}));

    const stackedCollection = new StackedColumnCollection(wasmContext);

    // Using the same stackedGroupId causes stacking (one above another)
    stackedCollection.add(new StackedColumnRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues1, dataSeriesName: "EU" }),
      fill: "#882B91",
      stroke:"#E4F5FC",
      strokeThickness: 1,
      opacity: 0.8,
      stackedGroupId: "StackedGroupId"
    }));

    stackedCollection.add(new StackedColumnRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues2, dataSeriesName: "Asia" }),
      fill: "#EC0F6C",
      stroke: "#E4F5FC",
      strokeThickness: 1,
      opacity: 0.8,
      stackedGroupId: "StackedGroupId"
    }));

    stackedCollection.add(new StackedColumnRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues3, dataSeriesName: "USA" }),
      fill: "#F48420",
      stroke: "#E4F5FC",
      strokeThickness: 1,
      opacity: 0.8,
      stackedGroupId: "StackedGroupId"
    }));

    sciChartSurface.renderableSeries.add(stackedCollection);
    // #endregion

    // Optional: add zooming, panning for the example
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier, new ZoomExtentsModifier());
    addChartTitle(sciChartSurface, title);
  };

  const createGroupedExample = async (divElementId, title) => {
    // #region ExampleB
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
      theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.1 )}));

    const stackedCollection = new StackedColumnCollection(wasmContext);

    // Using a different stackedGroupId causes grouping (side-by-side)
    stackedCollection.add(new StackedColumnRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues1, dataSeriesName: "EU" }),
      fill: "#882B91",
      stroke:"#E4F5FC",
      strokeThickness: 1,
      opacity: 0.8,
      stackedGroupId: "StackedGroupId-First"
    }));

    stackedCollection.add(new StackedColumnRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues2, dataSeriesName: "Asia" }),
      fill: "#EC0F6C",
      stroke: "#E4F5FC",
      strokeThickness: 1,
      opacity: 0.8,
      stackedGroupId: "StackedGroupId-Second"
    }));

    stackedCollection.add(new StackedColumnRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues3, dataSeriesName: "USA" }),
      fill: "#F48420",
      stroke: "#E4F5FC",
      strokeThickness: 1,
      opacity: 0.8,
      stackedGroupId: "StackedGroupId-Third"
    }));

    sciChartSurface.renderableSeries.add(stackedCollection);
    // #endregion

    // Optional: add zooming, panning for the example
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier, new ZoomExtentsModifier());
    addChartTitle(sciChartSurface, title);
  };

  const createMixedExample = async (divElementId, title) => {
    // #region ExampleC
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
      theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.1 )}));

    const stackedCollection = new StackedColumnCollection(wasmContext);

    // Using a mixture of stackedGroupId allows mixed stacked/grouped behaviour
    stackedCollection.add(new StackedColumnRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues1, dataSeriesName: "EU" }),
      fill: "#882B91",
      stroke:"#E4F5FC",
      strokeThickness: 1,
      opacity: 0.8,
      stackedGroupId: "StackedGroupId-First"
    }));

    stackedCollection.add(new StackedColumnRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues2, dataSeriesName: "Asia" }),
      fill: "#EC0F6C",
      stroke: "#E4F5FC",
      strokeThickness: 1,
      opacity: 0.8,
      stackedGroupId: "StackedGroupId-First"
    }));

    stackedCollection.add(new StackedColumnRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues3, dataSeriesName: "USA" }),
      fill: "#F48420",
      stroke: "#E4F5FC",
      strokeThickness: 1,
      opacity: 0.8,
      stackedGroupId: "StackedGroupId-Second"
    }));

    sciChartSurface.renderableSeries.add(stackedCollection);
    // #endregion

    // Optional: add zooming, panning for the example
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier, new ZoomExtentsModifier());
    addChartTitle(sciChartSurface, title);
  };

  const create100PercentExample = async (divElementId, title) => {
    // #region ExampleD
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
      theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.1 )}));

    const stackedCollection = new StackedColumnCollection(wasmContext, {
      // Simply set isOneHundredPercent to enable 100% stacking
      isOneHundredPercent: true
    });

    // Using the same stackedGroupId causes stacking (one above another)
    stackedCollection.add(new StackedColumnRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues1, dataSeriesName: "EU" }),
      fill: "#882B91",
      stroke:"#E4F5FC",
      strokeThickness: 1,
      opacity: 0.8,
      stackedGroupId: "StackedGroupId"
    }));

    stackedCollection.add(new StackedColumnRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues2, dataSeriesName: "Asia" }),
      fill: "#EC0F6C",
      stroke: "#E4F5FC",
      strokeThickness: 1,
      opacity: 0.8,
      stackedGroupId: "StackedGroupId"
    }));

    stackedCollection.add(new StackedColumnRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues3, dataSeriesName: "USA" }),
      fill: "#F48420",
      stroke: "#E4F5FC",
      strokeThickness: 1,
      opacity: 0.8,
      stackedGroupId: "StackedGroupId"
    }));

    sciChartSurface.renderableSeries.add(stackedCollection);
    // #endregion

    // Optional: add zooming, panning for the example
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier, new ZoomExtentsModifier());
    addChartTitle(sciChartSurface, title);
  };


  createStackedExample("scichart0", "A: Stacked Column Mode");
  createGroupedExample("scichart1", "B: Grouped Column Mode");
  createMixedExample("scichart2", "C: Mixed Mode");
  create100PercentExample("scichart3", "D: 100% Stacked Mode");
};

stackedColumnOptions();



