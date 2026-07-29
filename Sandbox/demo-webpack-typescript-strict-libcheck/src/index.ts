import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  BoxAnnotation,
  CompositeAnnotation,
  TextAnnotation
} from "scichart";

const generateData = (limit: number, step: number) => {
  const xValues = [];
  const yValues = [];

  for (let i = 0; i <= limit; i += step) {
    xValues.push(i);
    yValues.push(Math.random() * 20);
  }

  return { xValues, yValues };
};

const initSciChart = async () => {
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    "chart"
  );

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const { xValues, yValues } = generateData(50, 1);

  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
    })
  );

  // The annotations involved in the reported TS2416. Note the error is NOT caused
  // by this code — it is raised while type-checking
  // node_modules/scichart/Charting/Visuals/Annotations/CompositeAnnotation.d.ts,
  // which only happens when tsconfig sets "skipLibCheck": false.
  const box = new BoxAnnotation({ x1: 5, x2: 15, y1: 5, y2: 15, fill: "#FF000033", stroke: "#FF0000" });
  const composite = new CompositeAnnotation({ x1: 20, x2: 30, y1: 5, y2: 15 });
  const text = new TextAnnotation({ x1: 35, y1: 15, text: "strict libCheck repro" });

  sciChartSurface.annotations.add(box, composite, text);
};

initSciChart();
