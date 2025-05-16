import { SciChartSurface, SciChartJsNavyTheme, NumericAxis, ChartTitleRenderer, ETextAlignment, Rect } from "scichart";
async function customChartTitleRenderer(divElementId) {
    // Demonstrates how to add a basic chart title in SciChart.js
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    class SubTitleRenderer extends ChartTitleRenderer {
        subTitle;
        subTitleStyleProperty;
        subRenderer;
        constructor(webAssemblyContext, subtitle, subTitleStyle) {
            super(webAssemblyContext);
            this.subRenderer = new ChartTitleRenderer(webAssemblyContext);
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
            this.subRenderer.viewRectProperty = Rect.create(this.subRenderer.viewRect.x, this.subRenderer.viewRect.y + ydiff / 2, this.subRenderer.viewRect.width, this.subRenderer.viewRect.height);
        }
        draw(renderContext, clipRect) {
            super.draw(renderContext, clipRect);
            this.subRenderer.draw(renderContext, clipRect);
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
        alignment: ETextAlignment.Right
    });
}
customChartTitleRenderer("scichart-root");
