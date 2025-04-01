import * as SciChart from "scichart";

async function rolloverTooltipTemplate(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        EAutoRange,
        NumberRange,
        RolloverModifier
    } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // Create some data which we will use below
    const xValues = [];
    const yValues = [];
    const yValues2 = [];
    for (let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
        yValues2.push(0.5 * Math.cos(i * 0.11) - Math.sin(i * 0.015));
    }

    // #region ExampleA
    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        title: "Rollover Tooltip Templates",
        titleStyle: { fontSize: 16 }
    });

    // For the example to work, axis must have EAutoRange.Always
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            axisTitle: "X Axis"
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-2, 0.5),
            axisTitle: "Y Axis"
        })
    );

    const rollover = new RolloverModifier();
    sciChartSurface.chartModifiers.add(rollover);

    const lineSeries0 = new FastLineRenderableSeries(wasmContext, {
        stroke: "#FF6600",
        strokeThickness: 5,
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
            dataSeriesName: "Series 0"
        })
    });
    const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
        stroke: "#50C7E0",
        strokeThickness: 5,
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: yValues2,
            dataSeriesName: "Series 1"
        })
    });
    sciChartSurface.renderableSeries.add(lineSeries0);
    sciChartSurface.renderableSeries.add(lineSeries1);

    const tooltipTemplate = (id, seriesInfo, rolloverTooltip) => {
        rolloverTooltip.updateSize(120, 16);
        return `<svg width="120" height="16">
      <rect x="0" y="0" width="100%" height="100%" fill="${seriesInfo.stroke}"/>
      <svg width="100%">
          <text y="0" x="0" font-size="12" font-family="Verdana" dy="0" fill="white">
              <tspan x="4" dy="1em">${seriesInfo.seriesName}: ${seriesInfo.formattedYValue}</tspan>
          </text>
      </svg>
    </svg>`;
    };

    // Add a tooltipTemplate to this series to override the tooltip
    lineSeries0.rolloverModifierProps.tooltipTemplate = tooltipTemplate;
    lineSeries1.rolloverModifierProps.tooltipTemplate = tooltipTemplate;
    // #endregion
}

rolloverTooltipTemplate("scichart-root");
