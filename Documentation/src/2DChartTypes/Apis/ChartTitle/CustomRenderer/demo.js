import * as SciChart from "scichart";

("use strict");

const scichart_1 = SciChart;
async function customChartTitleRenderer(divElementId) {
    // Demonstrates how to add a basic chart title in SciChart.js
    const { wasmContext, sciChartSurface } = await scichart_1.SciChartSurface.create(divElementId, {
        theme: new scichart_1.SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new scichart_1.NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new scichart_1.NumericAxis(wasmContext));
    class SubTitleRenderer extends scichart_1.ChartTitleRenderer {
        constructor(webAssemblyContext, subtitle, subTitleStyle) {
            super(webAssemblyContext);
            this.subRenderer = new scichart_1.ChartTitleRenderer(webAssemblyContext);
            this.subTitle = subtitle;
            this.subTitleStyleProperty = subTitleStyle;
        }
        measure(title, originalTextStyle, renderContext) {
            super.measure(title, originalTextStyle, renderContext);
            this.subRenderer.measure(this.subTitle, this.subTitleStyleProperty, renderContext);
        }
        layout(chartViewRect) {
            super.layout(chartViewRect);
            this.subRenderer.layout(chartViewRect);
            const ydiff = this.viewRect.height - this.subRenderer.viewRect.height;
            // @ts-ignore since accessing a protected property
            this.subRenderer.viewRectProperty = scichart_1.Rect.create(
                this.subRenderer.viewRect.x,
                this.subRenderer.viewRect.y + ydiff / 2,
                this.subRenderer.viewRect.width,
                this.subRenderer.viewRect.height
            );
        }
        draw(renderContext) {
            super.draw(renderContext);
            this.subRenderer.draw(renderContext);
        }
        delete() {
            super.delete();
            this.subRenderer.delete();
        }
    }
    // Main title
    sciChartSurface.title = "Chart Title";
    // Add a subtitle
    sciChartSurface.chartTitleRenderer = new SubTitleRenderer(wasmContext, "A Subtitle", {
        ...sciChartSurface.titleStyle,
        fontSize: 30,
        alignment: scichart_1.ETextAlignment.Right
    });
}
customChartTitleRenderer("scichart-root");
