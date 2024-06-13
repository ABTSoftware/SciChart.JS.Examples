import {
    EAxisAlignment,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
    SciChartSurface,
    ENumericFormat,
    EColumnDataLabelPosition,
    StackedColumnRenderableSeries,
    Thickness,
    LegendModifier,
    StackedColumnCollection,
    RenderPassInfo,
    IRenderableSeries,
    IStackedColumnSeriesDataLabelProviderOptions,
    BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy,
} from "scichart";

// custom label manager to avoid overlapping labels
class CustomDataLabelManager extends IDataLabelLayoutManager {
    performTextLayout(sciChartSurface, renderPassInfo) {
        const renderableSeries = sciChartSurface.renderableSeries.asArray();

        for (let i = 0; i < renderableSeries.length; i++) {
            // loop through all series (i.e. 2 stacked series - Male and Female)

            const currentSeries = renderableSeries[i];
            if (currentSeries instanceof StackedColumnCollection) {
                const stackedSeries = currentSeries.asArray();

                const outerSeries = stackedSeries[1]; // the outer Series (i.e. Africa),
                const innerSeries = stackedSeries[0]; // the inner Series (i.e. Europe)

                if (!innerSeries.isVisible) {
                    continue; // to NOT use accumulated value to outer series if inner series is hidden
                }

                const outerLabels = outerSeries.dataLabelProvider?.dataLabels || [];
                const innerLabels = innerSeries.dataLabelProvider?.dataLabels || [];

                let outerIndex = 0; // used to sync the outer labels with the inner labels

                for (let k = 0; k < innerLabels.length; k++) {
                    const outerLabel = outerLabels[outerIndex];
                    const innerLabel = innerLabels[k];

                    if (outerLabel && innerLabel) {
                        const outerLabelPosition = outerLabel.position;
                        const innerLabelPosition = innerLabel.position;

                        if (outerLabelPosition.y !== innerLabelPosition.y) {
                            continue; // do not align labels if they are not on the same level
                        }

                        outerIndex++;

                        // calculate threshold for overlapping
                        const limitWidth = i == 0 ? outerLabel.rect.width : innerLabel.rect.width;

                        // minimum margin between 2 labels, feel free to experiment with different values
                        const marginBetweenLabels = 12;

                        if (Math.abs(outerLabelPosition.x - innerLabelPosition.x) < limitWidth) {
                            let newX;
                            if (i == 0) {
                                // if we are in Male (left) chart, draw left
                                newX = innerLabel.position.x - outerLabel.rect.width - marginBetweenLabels;
                            } else {
                                // if we are in Female (right) chart, draw right
                                newX = innerLabel.rect.right + marginBetweenLabels;
                            }

                            outerLabel.position = {
                                x: newX,
                                y: outerLabel.position.y,
                            };
                        }
                    }
                }
            }
        }
    }
}

// Population Pyramid Data
const PopulationData = {
    xValues: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
    yValues: {
        Africa: {
            male: [
                35754890, 31813896, 28672207, 24967595, 20935790, 17178324, 14422055, 12271907, 10608417, 8608183,
                6579937, 5035598, 3832420, 2738448, 1769284, 1013988, 470834, 144795, 26494, 2652, 140,
            ],
            female: [
                34834623, 31000760, 27861135, 24206021, 20338468, 16815440, 14207659, 12167437, 10585531, 8658614,
                6721555, 5291815, 4176910, 3076943, 2039952, 1199203, 591092, 203922, 45501, 5961, 425,
            ],
        },
        Europe: {
            male: [
                4869936, 5186991, 5275063, 5286053, 5449038, 5752398, 6168124, 6375035, 6265554, 5900833, 6465830,
                7108184, 6769524, 5676968, 4828153, 3734266, 2732054, 1633630, 587324, 128003, 12023,
            ],
            female: [
                4641147, 4940521, 5010242, 5010526, 5160160, 5501673, 6022599, 6329356, 6299693, 5930345, 6509757,
                7178487, 7011569, 6157651, 5547296, 4519433, 3704145, 2671974, 1276597, 399148, 60035,
            ],
        },
    },
};

export const drawExample = async (rootElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

    const xAxis = new NumericAxis(wasmContext, {
        labelPrecision: 0,
        autoTicks: false,
        majorDelta: 5,
        flippedCoordinates: true,
        axisAlignment: EAxisAlignment.Left,
    });

    xAxis.visibleRangeChanged.subscribe(() => {
        xAxis.visibleRange = new NumberRange(-3, 103); // extend the vertical range a bit over 0-100
    });

    // 2 Y Axes (left and right)
    const yAxisRight = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Bottom,
        flippedCoordinates: true,
        axisTitle: "Female",
        labelStyle: {
            fontSize: 12,
        },
        growBy: new NumberRange(0, 0.1), // to have the furthest right labels visible
        labelFormat: ENumericFormat.Engineering,
    });

    yAxisRight.visibleRangeChanged.subscribe((args) => {
        if (args.visibleRange.min > 0) {
            yAxisRight.visibleRange = new NumberRange(0, args.visibleRange.max);
        }
        yAxisLeft.visibleRange = new NumberRange(0, args.visibleRange.max);
    });

    const yAxisLeft = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Bottom,
        axisTitle: "Male",
        labelStyle: {
            fontSize: 12,
        },
        growBy: new NumberRange(0, 0.1), // to have the furthest left labels visible
        labelFormat: ENumericFormat.Engineering,
        id: "femaleAxis",
    });

    yAxisLeft.visibleRangeChanged.subscribe((args) => {
        if (args.visibleRange.min > 0) {
            yAxisLeft.visibleRange = new NumberRange(0, args.visibleRange.max);
        }
        yAxisRight.visibleRange = new NumberRange(0, args.visibleRange.max);
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxisLeft, yAxisRight);

    const dataLabels = {
        positionMode: EColumnDataLabelPosition.Outside,
        style: { fontFamily: "Arial", fontSize: 12, padding: new Thickness(0, 3, 0, 3) },
        color: "#EEEEEE",
        numericFormat: ENumericFormat.Engineering,
        engineeringPrefix: {
            large: ["K", "M", "B"] // this is the same as the default large prefixes
            // this particular example does not need "small" array since don't have subunitary values
        }
    };

    // Create some RenderableSeries or each part of the stacked column
    const maleChartEurope = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: PopulationData.xValues,
            yValues: PopulationData.yValues.Europe.male,
            dataSeriesName: "Male Europe",
        }),
        fill: "#255080",
        stackedGroupId: "MaleSeries",
        dataLabels
    });

    const maleChartAfrica = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: PopulationData.xValues,
            yValues: PopulationData.yValues.Africa.male,
            dataSeriesName: "Male Africa",
        }),
        fill: "#4570b0",
        stackedGroupId: "MaleSeries",
        dataLabels
    });

    // female charts
    const femaleChartEurope = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: PopulationData.xValues,
            yValues: PopulationData.yValues.Europe.female,
            dataSeriesName: "Female Europe",
        }),
        fill: "#af4f5a",
        stackedGroupId: "FemaleSeries",
        dataLabels
    });

    const femaleChartAfrica = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: PopulationData.xValues,
            yValues: PopulationData.yValues.Africa.female,
            dataSeriesName: "Female Africa",
        }),
        fill: "#df7f8a",
        stackedGroupId: "FemaleSeries",
        dataLabels
    });

    const stackedColumnCollectionMale = new StackedColumnCollection(wasmContext, {
        dataPointWidth: 0.9,
        yAxisId: "femaleAxis",
    });
    const stackedColumnCollectionFemale = new StackedColumnCollection(wasmContext, {
        dataPointWidth: 0.9,
    });

    stackedColumnCollectionMale.add(maleChartEurope, maleChartAfrica);
    stackedColumnCollectionFemale.add(femaleChartEurope, femaleChartAfrica);

    // manage data labels overlapping with custom layout manager
    sciChartSurface.dataLabelLayoutManager = new CustomDataLabelManager();

    // Add the Stacked Column collection to the chart
    sciChartSurface.renderableSeries.add(stackedColumnCollectionMale, stackedColumnCollectionFemale);

    sciChartSurface.layoutManager.bottomOuterAxesLayoutStrategy =
        new BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy(); // stack and sync the 2 Y axes

    // Add zooming and panning behaviour
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier(),
        new LegendModifier({
            showCheckboxes: true,
            showSeriesMarkers: true,
            showLegend: true,
            backgroundColor: "#222",
        })
    );

    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
};
