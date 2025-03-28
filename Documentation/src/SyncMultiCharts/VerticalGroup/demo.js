import * as SciChart from "scichart";

async function synchronizeTwoChartsBasicExample() {
    // #region ExampleA
    // Create two charts for Synchronization
    const { SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries, SciChartJsNavyTheme } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const createSciChartSurface = async (divId, isFirstChart) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(divId, {
            theme: new SciChartJsNavyTheme()
        });
        // Create some deliberate differences between chart 0 and chart 1
        sciChartSurface.background = isFirstChart ? "#22365B" : "#18304A";
        sciChartSurface.canvasBorder = isFirstChart ? { borderBottom: 4, color: "#55698E" } : undefined;

        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                axisTitle: isFirstChart ? "XAxis 0" : "XAxis 1"
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                // Create some deliberate differences between chart 0 and chart 1
                labelPrecision: isFirstChart ? 2 : 4,
                axisTitle: isFirstChart ? "YAxis 0" : "YAxis 1"
            })
        );

        const xValues = [];
        const yValues = [];
        for (let i = 0; i < 100; i++) {
            const coef = isFirstChart ? 1 : 0.5;
            xValues.push(i);
            yValues.push(0.2 * coef * Math.sin((i * 0.1) / coef) - Math.cos(i * 0.01));
        }

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                // Create some deliberate differences between chart 0 and chart 1
                stroke: isFirstChart ? "#FF6600" : "#3377FF",
                strokeThickness: 5,
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues,
                    yValues
                })
            })
        );

        return sciChartSurface;
    };

    // Create two SciChartSurfaces with separate <div> elements in the DOM

    // Create the first chart, Expects a <div id="chart0Div"> in the DOM
    const sciChartSurface0 = await createSciChartSurface("chart0Div", true);
    // Create the second chart, Expects a <div id="chart1Div"> in the DOM
    const sciChartSurface1 = await createSciChartSurface("chart1Div", false);
    // #endregion

    // #region ExampleB
    const { SciChartVerticalGroup, ZoomPanModifier, MouseWheelZoomModifier, RolloverModifier } = SciChart;

    // Step1: Synchronize the two chart visibleRanges
    sciChartSurface0.xAxes.get(0).visibleRangeChanged.subscribe(data1 => {
        sciChartSurface1.xAxes.get(0).visibleRange = data1.visibleRange;
    });
    sciChartSurface1.xAxes.get(0).visibleRangeChanged.subscribe(data1 => {
        sciChartSurface0.xAxes.get(0).visibleRange = data1.visibleRange;
    });

    // Step 2: Synchronize the two chart axis sizes using SciChartVerticalGroup
    // this is useful in case the Y-axis have different sizes due to differing visibleRange
    // text formatting or size
    const verticalGroup = new SciChartVerticalGroup();
    verticalGroup.addSurfaceToGroup(sciChartSurface0);
    verticalGroup.addSurfaceToGroup(sciChartSurface1);

    // Step 3: Add some cursors, zooming behaviours and link them with a modifier group
    // This ensures mouse events on one chart are sent to the other chart
    const group0 = "modifierGroup0";
    sciChartSurface0.chartModifiers.add(
        new ZoomPanModifier({ modifierGroup: group0 }),
        new MouseWheelZoomModifier({ modifierGroup: group0 }),
        new RolloverModifier({ modifierGroup: group0 })
    );
    const group1 = "modifierGroup1";
    sciChartSurface1.chartModifiers.add(
        new ZoomPanModifier({ modifierGroup: group1 }),
        new MouseWheelZoomModifier({ modifierGroup: group1 }),
        new RolloverModifier({ modifierGroup: group1 })
    );
    // #endregion

    const { TextAnnotation, ECoordinateMode, EHorizontalAnchorPoint, EVerticalAnchorPoint } = SciChart;

    // or, for npm, import { TextAnnotation, ... } from "scichart";

    // This part we want to keep out of the documentation - enrich the charts with watermark instructions
    const enrichChart = (scs, isFirstChart) => {
        const watermarkOptions = {
            x1: 0.5,
            y1: 0.5,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center
        };
        scs.annotations.add(
            new TextAnnotation({
                ...watermarkOptions,
                textColor: "#FFFFFF77",
                fontSize: 20,
                yCoordShift: -30,
                text: isFirstChart ? "SciChartSurface #0" : "SciChartSurface #1"
            })
        );
        scs.annotations.add(
            new TextAnnotation({
                ...watermarkOptions,
                text: "Drag to zoom, or mousewheel the chart to view synchronization",
                textColor: "#FFFFFF44",
                fontSize: 16
            })
        );
    };

    enrichChart(sciChartSurface0, true);
    enrichChart(sciChartSurface1, false);
}

synchronizeTwoChartsBasicExample("chart0", "chart1");
