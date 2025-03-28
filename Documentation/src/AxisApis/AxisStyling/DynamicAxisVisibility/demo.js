import * as SciChart from "scichart";

async function axisVisibility(divElementId) {
    // Demonstrates how to maximise a specific series using hidden axis in SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        FastLineRenderableSeries,
        XyDataSeries,
        EAutoRange,
        NumberRange
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // Create some data for series
    const xValues = [];
    const yValues = [];
    const yValues1 = [];
    const yValues2 = [];
    for (let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
        yValues1.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01) * 0.5);
        yValues2.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01) * -0.6);
    }

    // #region ExampleA
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Add some Series to the chart
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "Series A" }),
            stroke: "#50C7E0",
            strokeThickness: 3
        })
    );
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues1, dataSeriesName: "Series B" }),
            stroke: "#F48420",
            strokeThickness: 3
        })
    );
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues2, dataSeriesName: "Series C" }),
            stroke: "#EC0F6C",
            strokeThickness: 3
        })
    );

    // Default X-Axis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "X Axis"
        })
    );

    // Default YAxis
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Y Axis",
            growBy: new NumberRange(0.1, 0.1)
        })
    );

    // Hidden YAxis with ID=HiddenYAxis
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            id: "HiddenYAxis",
            isVisible: false,
            autoRange: EAutoRange.Always
        })
    );

    // Get the checboxes in the DOM (see index.html)
    const checkboxes = Array.from(document.getElementsByClassName("checkbox"));

    // Function invoked when a checkbox is checked/unchecked
    const onCheckedChanged = e => {
        // find a renderableSeries by dataSeriesName matching checkbox id
        const series = sciChartSurface.renderableSeries
            .asArray()
            .find(rs => rs.dataSeries.dataSeriesName === e.target.id);
        if (e.target.checked) {
            // If the series is checked, show it on the hidden YAxis with AutoRange.Always
            console.log("Maximising " + series.dataSeries.dataSeriesName);
            series.yAxisId = "HiddenYAxis";
        } else {
            // Else, put it back on the default axis / default scaling
            series.yAxisId = NumericAxis.DEFAULT_AXIS_ID;
            console.log("Setting " + series.dataSeries.dataSeriesName + " to default axis");
        }
    };

    // get checkboxes by class name and add event listener to change event
    checkboxes.forEach(element => {
        element.addEventListener("change", e => {
            onCheckedChanged(e);
            if (e.target.checked) {
                // uncheck other checkboxes
                checkboxes
                    .filter(cb => cb.id !== e.target.id)
                    .forEach(cb => {
                        cb.checked = false;
                        onCheckedChanged({ target: cb });
                    });
            }
        });
    });
    // #endregion

    const textAnnotation = new TextAnnotation({
        x1: 0.5,
        y1: 0.5,
        text: "Click the legend: Maximise Series with Hidden Axis",
        textColor: "#FFFFFF55",
        fontSize: 26,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center
    });
    sciChartSurface.annotations.add(textAnnotation);
}

axisVisibility("scichart-root");
