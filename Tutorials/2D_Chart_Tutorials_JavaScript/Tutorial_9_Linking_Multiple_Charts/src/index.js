import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { SciChartVerticalGroup } from "scichart/Charting/LayoutManager/SciChartVerticalGroup";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { EAutoRange } from "scichart/types/AutoRange";

async function initSciChart() {
    let chart1XAxis, chart2XAxis;

    const verticalGroup = new SciChartVerticalGroup();

    const modifierGroupId = "group1";

    // CREATE FIRST CHART
    const createFirstChart = async () => {
        // LICENSING //
        // Set your license code here
        // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
        // Purchased license keys can be viewed at https://www.scichart.com/profile
        //
        // e.g.
        //
        // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
        //
        // Also, once activated (trial or paid license) having the licensing wizard open on your machine
        // will mean any or all applications you run locally will be fully licensed.

        // Create the SciChartSurface in the div 'scichart-root'
        // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
        // instance must be passed to other types that exist on the same surface.

        // Create the first chart
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(
            "scichart-root-1"
        );

        // Create an X Axis and add to the chart
        const xAxis = new NumericAxis(wasmContext, { axisTitle: "X Axis" });
        chart1XAxis = xAxis;
        sciChartSurface.xAxes.add(xAxis);

        // Create Y Axis and add to the chart
        const yAxis = new NumericAxis(wasmContext, {
            axisTitle: "Y Axis",
            axisAlignment: EAxisAlignment.Right,
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.2, 0.2),
        });
        sciChartSurface.yAxes.add(yAxis);

        // Create data for line series
        const dataForLineSeries = new XyDataSeries(wasmContext);
        for (let x = 0; x < 250; x++) {
            dataForLineSeries.append(x, Math.sin(x * 0.1));
        }

        // Create line series and add to the chart
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: dataForLineSeries,
        });
        lineSeries.rolloverModifierProps.tooltipColor = "green";
        lineSeries.rolloverModifierProps.tooltipLabelX = "X";
        lineSeries.rolloverModifierProps.tooltipLabelY = "Y";
        sciChartSurface.renderableSeries.add(lineSeries);

        sciChartSurface.chartModifiers.add(
            new ZoomPanModifier(),
            new MouseWheelZoomModifier(),
            new ZoomExtentsModifier()
        );
        sciChartSurface.chartModifiers.add(
            new RolloverModifier({ modifierGroup: modifierGroupId })
        );

        verticalGroup.addSurfaceToGroup(sciChartSurface);
        return { sciChartSurface, wasmContext };
    };

    // CREATE SECOND CHART
    const createSecondChart = async () => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(
            "scichart-root-2"
        );

        // Create an X Axis and add to the chart
        const xAxis = new NumericAxis(wasmContext);
        chart2XAxis = xAxis;
        sciChartSurface.xAxes.add(xAxis);

        // Create Y Axis and add to the chart
        const yAxis = new NumericAxis(wasmContext, {
            axisTitle: "Y Axis",
            axisAlignment: EAxisAlignment.Left,
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.2, 0.2),
        });
        sciChartSurface.yAxes.add(yAxis);

        // Create data for mountain series
        const dataForMountainSeries = new XyDataSeries(wasmContext);
        for (let x = 0; x < 250; x++) {
            dataForMountainSeries.append(x, Math.cos(x * 0.1));
        }

        // Create mountain series, bind to primary axis and add to the chart
        const mountainSeries = new FastMountainRenderableSeries(wasmContext, {
            dataSeries: dataForMountainSeries,
            fill: "LightSteelBlue",
        });
        mountainSeries.rolloverModifierProps.tooltipColor = "green";
        sciChartSurface.renderableSeries.add(mountainSeries);

        sciChartSurface.chartModifiers.add(
            new ZoomPanModifier(),
            new MouseWheelZoomModifier(),
            new ZoomExtentsModifier()
        );
        sciChartSurface.chartModifiers.add(
            new RolloverModifier({ modifierGroup: modifierGroupId })
        );

        verticalGroup.addSurfaceToGroup(sciChartSurface);
        return { sciChartSurface, wasmContext };
    };

    // PARALLEL CREATION OF CHARTS
    const res = await Promise.all([createFirstChart(), createSecondChart()]);
    res.forEach((el) => {
        el.sciChartSurface.zoomExtents();
    });

    // Synchronize visible ranges
    chart1XAxis.visibleRangeChanged.subscribe((data1) => {
        chart2XAxis.visibleRange = data1.visibleRange;
    });
    chart2XAxis.visibleRangeChanged.subscribe((data1) => {
        chart1XAxis.visibleRange = data1.visibleRange;
    });
}

initSciChart();
