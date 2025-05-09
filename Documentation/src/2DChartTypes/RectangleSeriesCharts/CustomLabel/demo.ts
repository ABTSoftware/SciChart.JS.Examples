import {
    EColumnMode,
    EColumnYMode,
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    FastRectangleRenderableSeries,
    XyxyDataSeries,
    RectangleSeriesDataLabelProvider,
    RectangleDataLabelState,
    formatNumber,
    ENumericFormat,
} from "scichart";

export class MyRectangleSeriesDataLabelProvider extends RectangleSeriesDataLabelProvider {
    public getText(state: RectangleDataLabelState): string {
        const usefinal = !this.updateTextInAnimation && state.parentSeries.isRunningAnimation;
        const yval = usefinal ? state.yValAfterAnimation() : state.yVal();
        if (isNaN(yval)) {
            return undefined;
        } else {
            const diff = Math.abs(state.x1Val() - state.xVal());
            if (this.engineeringPrefix) {
                return formatNumber(diff, this.numericFormat, this.precision, this.engineeringPrefixProperty);
            } else {
                return formatNumber(diff, this.numericFormat ?? ENumericFormat.Decimal, this.precision);
            }
        }
    }
}


async function rectangleSeriesTexture(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [0, 6, 10, 17];
    const yValues = [0, 6, 2, 5];
    const x1Values = [5, 9, 15, 25];
    const y1Values = [5, 9, 8, 10];

    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues,
            yValues,
            x1Values,
            y1Values
        }),
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom, 
        fill: "white",
        stroke: "steelblue",
        strokeThickness: 4,
        opacity: 1,
        topCornerRadius: 10,
        bottomCornerRadius: 10,
        dataLabelProvider: new MyRectangleSeriesDataLabelProvider({
            style: {
                fontSize: 16
            },
            color: "black"
        },)
    });

    sciChartSurface.renderableSeries.add(rectangleSeries);
}

rectangleSeriesTexture("scichart-root");
