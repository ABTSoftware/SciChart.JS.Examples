import { appTheme } from "scichart-example-dependencies";
import {
    EAutoRange,
    EAxisAlignment,
    EInnerAxisPlacementCoordinateMode,
    ELabelAlignment,
    FastLineRenderableSeries,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    XAxisDragModifier,
    XyDataSeries,
    YAxisDragModifier,
    ZoomPanModifier,
    RightAlignedOuterVerticallyStackedAxisLayoutStrategy,
} from "scichart";
export const drawExample = async (rootElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    const commonAxisOptions = {
        drawMajorBands: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMajorTickLines: true,
        autoRange: EAutoRange.Never,
        axisTitleStyle: {
            fontSize: 18,
        },
        majorTickLineStyle: {
            tickSize: 6,
            strokeThickness: 2,
            color: "white",
        },
        axisBorder: {
            border: 2,
            color: "white",
        },
        labelStyle: {
            fontSize: 14,
        },
    };
    const horizontalAxisPosition = 60;
    const verticalAxisPosition = 30;
    const primaryColors = ["#4FBEE6", "#AD3D8D", "#6BBDAE", "#E76E63", "#2C4B92"];
    const xAxis1 = new NumericAxis(wasmContext, { ...commonAxisOptions, id: "xAxis1", axisTitle: "X Axis" });
    const xAxis2 = new NumericAxis(wasmContext, {
        ...commonAxisOptions,
        id: "xAxis2",
        axisTitle: "Flipped X Axis",
        flippedCoordinates: true,
    });
    const xAxis3 = new NumericAxis(wasmContext, {
        ...commonAxisOptions,
        id: "xAxis3",
        axisTitle: "Stacked X Axis",
        axisAlignment: EAxisAlignment.Right,
        flippedCoordinates: false,
    });
    const xAxis4 = new NumericAxis(wasmContext, {
        ...commonAxisOptions,
        id: "xAxis4",
        // axisTitle: "TopInnerXAxis",
        axisAlignment: EAxisAlignment.Top,
        isInnerAxis: true,
    });
    const yAxis2 = new NumericAxis(wasmContext, { ...commonAxisOptions, id: "yAxis1", axisTitle: "Stacked Y Axis" });
    const yAxis1 = new NumericAxis(wasmContext, {
        ...commonAxisOptions,
        id: "yAxis2",
        axisTitle: "Flipped Y Axis - Left Aligned",
        axisAlignment: EAxisAlignment.Left,
        flippedCoordinates: true,
    });
    const yAxis3 = new NumericAxis(wasmContext, {
        ...commonAxisOptions,
        id: "yAxis3",
        axisTitle: "Y Axis - Top Aligned",
        axisAlignment: EAxisAlignment.Top,
        flippedCoordinates: false,
    });
    const yAxis4 = new NumericAxis(wasmContext, {
        ...commonAxisOptions,
        id: "yAxis4",
        // axisTitle: "InnerYAxis",
        flippedCoordinates: false,
        isInnerAxis: true,
    });
    sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
        new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();
    // use axes with custom ids for positioning the central axes
    sciChartSurface.layoutManager.rightInnerAxesLayoutStrategy.orthogonalAxisId = xAxis1.id;
    sciChartSurface.layoutManager.bottomInnerAxesLayoutStrategy.orthogonalAxisId = yAxis1.id;
    sciChartSurface.layoutManager.leftInnerAxesLayoutStrategy.orthogonalAxisId = xAxis1.id;
    sciChartSurface.layoutManager.topInnerAxesLayoutStrategy.orthogonalAxisId = yAxis1.id;
    sciChartSurface.layoutManager.rightInnerAxesLayoutStrategy.coordinateMode =
        EInnerAxisPlacementCoordinateMode.DataValue;
    sciChartSurface.layoutManager.rightInnerAxesLayoutStrategy.axisPosition = verticalAxisPosition;
    sciChartSurface.layoutManager.topInnerAxesLayoutStrategy.coordinateMode =
        EInnerAxisPlacementCoordinateMode.DataValue;
    sciChartSurface.layoutManager.topInnerAxesLayoutStrategy.axisPosition = horizontalAxisPosition;
    xAxis1.drawMajorGridLines = true;
    yAxis1.drawMajorGridLines = true;
    sciChartSurface.xAxes.add(xAxis2, xAxis3, xAxis1, xAxis4);
    sciChartSurface.yAxes.add(yAxis2, yAxis3, yAxis1, yAxis4);
    xAxis1.isPrimaryAxis = true;
    yAxis1.isPrimaryAxis = true;
    sciChartSurface.xAxes.asArray().forEach((xAxis, index) => {
        const yAxis = sciChartSurface.yAxes.get(index);
        xAxis.axisTitleStyle.color = primaryColors[index];
        yAxis.axisTitleStyle.color = primaryColors[index];
        xAxis.majorTickLineStyle = { color: primaryColors[index] };
        yAxis.majorTickLineStyle = { color: primaryColors[index] };
        xAxis.labelStyle.color = primaryColors[index];
        yAxis.labelStyle.color = primaryColors[index];
        xAxis.axisBorder.borderTop = 2;
        xAxis.axisBorder.borderBottom = 2;
        xAxis.axisBorder.borderRight = 2;
        xAxis.axisBorder.borderLeft = 2;
        xAxis.axisBorder.color = primaryColors[index];
        yAxis.axisBorder.borderTop = 2;
        yAxis.axisBorder.borderBottom = 2;
        yAxis.axisBorder.borderRight = 2;
        yAxis.axisBorder.borderLeft = 2;
        yAxis.axisBorder.color = primaryColors[index];
        xAxis.labelStyle.alignment = ELabelAlignment.Center;
        yAxis.labelStyle.alignment = ELabelAlignment.Center;
        xAxis.axisRenderer.keepLabelsWithinAxis = true;
        yAxis.axisRenderer.keepLabelsWithinAxis = true;
        xAxis.visibleRange = new NumberRange(-10, 110);
        yAxis.visibleRange = new NumberRange(-10, 140);
        const dataSeries = new XyDataSeries(wasmContext, { containsNaN: false, isSorted: true });
        for (let i = 0; i < 100; i++) {
            const y = Math.sin(i * 0.1) * i + 50;
            dataSeries.append(i, y);
        }
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            xAxisId: xAxis.id,
            yAxisId: yAxis.id,
            strokeThickness: 3,
            stroke: primaryColors[index],
        });
        sciChartSurface.renderableSeries.add(lineSeries);
    });
    // leave only one border for Inner Axes
    xAxis4.axisBorder.borderRight = 0;
    xAxis4.axisBorder.borderBottom = 0;
    xAxis4.axisBorder.borderLeft = 0;
    yAxis4.axisBorder.borderTop = 0;
    yAxis4.axisBorder.borderBottom = 0;
    yAxis4.axisBorder.borderLeft = 0;
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({
            includedXAxisIds: [xAxis1.id, xAxis4.id],
            includedYAxisIds: [yAxis1.id, yAxis4.id],
        }),
        new XAxisDragModifier(),
        new YAxisDragModifier()
    );
    const series4ScaleFactor = 3;
    console.log(" xAxis1.visibleRange", xAxis1.visibleRange);
    console.log(" yAxis1.visibleRange", yAxis1.visibleRange);
    xAxis4.visibleRange = new NumberRange(
        (xAxis1.visibleRange.min - verticalAxisPosition) * series4ScaleFactor,
        (xAxis1.visibleRange.max - verticalAxisPosition) * series4ScaleFactor
    );
    yAxis4.visibleRange = new NumberRange(
        (horizontalAxisPosition - yAxis1.visibleRange.max) * series4ScaleFactor,
        (horizontalAxisPosition - yAxis1.visibleRange.min) * series4ScaleFactor
    );
    xAxis2.visibleRangeChanged.subscribe((data) => {
        xAxis3.visibleRange = data.visibleRange;
    });
    yAxis2.visibleRangeChanged.subscribe((data) => {
        yAxis3.visibleRange = data.visibleRange;
    });
    xAxis3.visibleRangeChanged.subscribe((data) => {
        xAxis2.visibleRange = data.visibleRange;
    });
    yAxis3.visibleRangeChanged.subscribe((data) => {
        yAxis2.visibleRange = data.visibleRange;
    });
    return { sciChartSurface, wasmContext };
};
