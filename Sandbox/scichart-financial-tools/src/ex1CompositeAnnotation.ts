import {
    SciChartSurface,
    NumericAxis,
    BoxAnnotation,
    LineAnnotation,
    SvgLineAnnotation,
    CompositeAnnotation,
    SciChartOverview,
    XyDataSeries,
    FastLineRenderableSeries,
    ZoomPanModifier,
    MouseWheelZoomModifier
} from "scichart";

export async function ex1CompositeAnnotation() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // A series so the overview has something to render (the overview clones series, not annotations)
    const xValues: number[] = [];
    const yValues: number[] = [];
    for (let i = 0; i <= 100; i++) {
        xValues.push(i / 10);
        yValues.push(5 + 3 * Math.sin(i / 8));
    }
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            stroke: "steelblue",
            strokeThickness: 2
        })
    );

    const lineAnnotation = new LineAnnotation({
        x1: 0.1,
        y1: 0.2,
        x2: 0.5,
        y2: 0.8,
        stroke: "orange",
        strokeThickness: 2,
        // isEditable: true
    });
    const boxAnnotation = new BoxAnnotation({
        x1: 0.6,
        y1: 0.2,
        x2: 0.8,
        y2: 0.9,
        stroke: "pink",
        strokeThickness: 2,
        // isEditable: true
    });

    const svgAnn = new SvgLineAnnotation({
        x1: 0.2,
        y1: 0.4,
        x2: 0.8,
        y2: 0.6,
        stroke: "red",
        strokeThickness: 2,
        // isEditable: true
    })

    // make the composite annotation with the child annotations
    const comp = new CompositeAnnotation({
        x1: 2,
        y1: 8,
        x2: 8,
        y2: 2,
        isEditable: true,
        fill: "rgba(0,0,0,0)",
        annotations: [
            lineAnnotation,
            boxAnnotation,
            svgAnn
        ]
    });
    sciChartSurface.annotations.add(comp);
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());

    // Overview control bound to the chart above. Drag the selection to scroll/zoom the main chart
    await SciChartOverview.create(sciChartSurface, "scichart-overview-root");
}
