
async function dataLabelGlobalLayout(divElementId) {
    // #region ExampleA
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        EllipsePointMarker,
        XyDataSeries,
        NumberRange,
        testIsInBounds,
        SciChartJsNavyTheme
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // Create a chart with two line series
    //
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "SteelBlue",
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 10,
            height: 10,
            strokeThickness: 2,
            stroke: "SteelBlue",
            fill: "LightSteelBlue"}),
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            yValues: [4.3, 5, 5, 6, 8, 6.8, 7, 7, 7.2, 6.5, 6.5, 7],
        }),
        // dataLabels style must be specified to show labels
        dataLabels: {
            style: {
                fontFamily: "Arial",
                fontSize: 18,
            },
            color: "SteelBlue"
        }
    });

    sciChartSurface.renderableSeries.add(lineSeries);

    const lineSeries2 = new FastLineRenderableSeries(wasmContext, {
        stroke: "Darkorange",
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 10,
            height: 10,
            strokeThickness: 2,
            stroke: "Darkorange",
            fill: "Tan"}),
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            yValues: [4.5, 4.9, 5.1, 6.2, 7, 6.5, 7, 7.5, 7.1, 6.2, 5.5, 6],
        }),
        // dataLabels style must be specified to show labels
        dataLabels: {
            style: {
                fontFamily: "Arial",
                fontSize: 18,
            },
            color: "Darkorange"
        }
    });

    sciChartSurface.renderableSeries.add(lineSeries2);

    // Override the default data label layout manager and perform custom label layout
    sciChartSurface.dataLabelLayoutManager = {
        performTextLayout(sciChartSurface, renderPassInfo) {
            const firstLabels = renderPassInfo.renderableSeriesArray[0].dataLabelProvider.dataLabels;
            const secondLabels = renderPassInfo.renderableSeriesArray[1].dataLabelProvider.dataLabels
            for (const label of secondLabels) {
                let overlap = false;
                for (const existing of firstLabels) {
                    const { top, left, bottom, right } = existing.rect;
                    if (testIsInBounds(label.rect.left, label.rect.top, left, bottom, right, top ) ||
                        testIsInBounds(label.rect.right, label.rect.top, left, bottom, right, top) ||
                        testIsInBounds(label.rect.left, label.rect.bottom, left, bottom, right, top) ||
                        testIsInBounds(label.rect.right, label.rect.bottom, left, bottom, right, top)) {
                        console.log(`Label ${label.text} overlaps ${existing.text}, skipping...`);
                        overlap = true;
                        break;
                    }
                } 
                if (overlap) {
                    // Labels overlaps another so blank it
                    label.text = "";
                }
            }
        }
    }
    // #endregion ExampleA
}

dataLabelGlobalLayout('scichart-root')
