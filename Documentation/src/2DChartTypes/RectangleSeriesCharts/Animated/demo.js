import { EColumnMode, EColumnYMode, SciChartSurface, NumericAxis, SciChartJsNavyTheme, FastRectangleRenderableSeries, XyxyDataSeries, GenericAnimation, easing } from "scichart";
async function rectangleSeriesAnimated(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    const initialData = {
        xValues: [0, 6, 10, 17],
        yValues: [0, 6, 2, 5],
        x1Values: [5, 9, 15, 25],
        y1Values: [5, 9, 8, 10]
    };
    const dataSeries = new XyxyDataSeries(wasmContext, initialData);
    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries,
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom,
        fill: "white",
        stroke: "steelblue",
        strokeThickness: 1,
        opacity: 1
    });
    sciChartSurface.renderableSeries.add(rectangleSeries);
    const getData = () => {
        const xValues = [];
        const yValues = [];
        const x1Values = [];
        const y1Values = [];
        initialData.xValues.forEach((d, i) => {
            xValues.push(Math.random() * 3 + 8 * i);
            yValues.push(Math.random() * 3 * i);
            x1Values.push((Math.random() + 2) * 5);
            y1Values.push((Math.random() + 2) * 3);
        });
        return {
            xValues,
            yValues,
            x1Values,
            y1Values
        };
    };
    const interpolateNumber = (from, to, progress) => {
        if (progress < 0)
            return from;
        if (progress > 1)
            return to;
        return from + (to - from) * progress;
    };
    const dataAnimation = new GenericAnimation({
        from: initialData,
        to: getData(),
        duration: 2000,
        ease: easing.inOutSine,
        onAnimate: (from, to, progress) => {
            const newXValues = [];
            const newYValues = [];
            const newX1Values = [];
            const newY1Values = [];
            from.xValues.forEach((value, index) => {
                newXValues.push(interpolateNumber(from.xValues[index], to.xValues[index], progress));
                newYValues.push(interpolateNumber(from.yValues[index], to.yValues[index], progress));
                newX1Values.push(interpolateNumber(from.x1Values[index], to.x1Values[index], progress));
                newY1Values.push(interpolateNumber(from.y1Values[index], to.y1Values[index], progress));
            });
            dataSeries.clear();
            dataSeries.appendRange(newXValues, newYValues, newX1Values, newY1Values);
        },
        onCompleted: () => {
            dataAnimation.from = dataAnimation.to;
            dataAnimation.to = getData();
            dataAnimation.reset();
            console.log("Data Point Animation Completed");
        }
    });
    sciChartSurface.addAnimation(dataAnimation);
}
rectangleSeriesAnimated("scichart-root");
