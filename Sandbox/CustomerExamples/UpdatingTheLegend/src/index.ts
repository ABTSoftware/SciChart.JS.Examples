import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { EAxisAlignment } from 'scichart/types/AxisAlignment';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { LegendModifier } from 'scichart/Charting/ChartModifiers/LegendModifier';
import { ELegendOrientation, TLegendItem } from 'scichart/Charting/Visuals/Legend/SciChartLegendBase';

async function initSciChart() {
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
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-root');

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) });

    const yAxis1 = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        labelStyle: { color: 'white' },
        visibleRange: new NumberRange(0, 8)
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis1);

    const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
        stroke: 'white',
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5],
            yValues: [3, 4, 3, 4, 3],
            dataSeriesName: 'white'
        })
    });

    const lineSeries2 = new FastLineRenderableSeries(wasmContext, {
        stroke: 'red',
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5],
            yValues: [5, 6, 5, 5, 4],
            dataSeriesName: 'red'
        })
    });

    sciChartSurface.renderableSeries.add(lineSeries1, lineSeries2);
    // To place the Legend outside of the canvas uncomment this line
    const legendModifier = new LegendModifier({ showCheckboxes: true, placementDivId: "place-for-legend" });

    legendModifier.sciChartLegend.getLegendItemHTML = (
        orientation: ELegendOrientation,
        showCheckboxes: boolean,
        showSeriesMarkers: boolean,
        item: TLegendItem
    ): string => {
        sciChartSurface.renderableSeries.getById(item.id);
        const display = orientation === ELegendOrientation.Vertical ? "flex" : "inline-flex";
        let str = `<span class="scichart__legend-item" style="display: ${display}; align-items: center; margin-right: 4px; white-space: nowrap;">`;
        if (showCheckboxes) {
            const checked = item.checked ? "checked" : "";
            str += `<input ${checked} type="checkbox" id="${item.id}">`;
        }
        if (showSeriesMarkers) {
            if (item.gradient) {
                let gradientStr = "";
                item.gradient.gradientStops.forEach(s => {
                    gradientStr += `,${s.color}`;
                });
                str += `<label for="${item.id}" style="background-image: linear-gradient(to right${gradientStr}); margin: 4px; width: 30px; height: 13px;"></label>`;
            } else {
                str += `<label for="${item.id}" style="background-color: ${item.color}; margin: 4px; width: 40px !important; height: 2px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${item.color}" style="width: 12px; height: 12px;position: absolute;left: 50%;top: calc(50% - 9px);transform: translate(-50%, -50%);"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
                </label>`;
            }
        }
        str += `<label for="${item.id}" style="margin-left: 4px;">${item.name}</label>`;
        str += `</span>`;
        return str;
    }
    
    sciChartSurface.chartModifiers.add(legendModifier);
    // sciChartSurface.chartModifiers.add(new LegendModifier({ showCheckboxes: true }));

    setTimeout(() => {
        console.log('hide the white series');
        const checkbox1 = document.getElementById(lineSeries1.id) as HTMLInputElement;
        checkbox1.click();
        setTimeout(() => {
            console.log('show the white series back');
            checkbox1.click();
        }, 2000);
    }, 2000);
}

initSciChart();
