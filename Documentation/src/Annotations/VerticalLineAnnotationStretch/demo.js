// #region ExampleA
const {
  VerticalLineAnnotation,
  NumericAxis,
  SciChartSurface,
  ELabelPlacement,
  SciChartJsNavyTheme,
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function addAnnotationToChart(divElementId) {
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    divElementId,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // Add a selection of annotations to the chart
  sciChartSurface.annotations.add(
    // Vertically line stretched across the viewport, showing label value = X (9)
    new VerticalLineAnnotation({
      labelPlacement: ELabelPlacement.Axis,
      showLabel: true,
      stroke: "SteelBlue",
      strokeThickness: 2,
      x1: 9,
      axisLabelFill: "SteelBlue",
      axisFontSize: 20,
    }),
    // Vertically line with a custom label value
    new VerticalLineAnnotation({
      showLabel: true,
      stroke: "Orange",
      strokeThickness: 2,
      x1: 6,
      y1: 4,
      axisLabelFill: "Orange",
      axisFontSize: 20,
    })
  );
}

addAnnotationToChart("scichart-root");
// #endregion

async function builderExample(divElementId) {
  // #region ExampleB
  const { chartBuilder, EAnnotationType } = SciChart;

  // or for npm import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(
    divElementId,
    {
      annotations: [
        {
          type: EAnnotationType.RenderContextVerticalLineAnnotation,
          options: {
            labelPlacement: ELabelPlacement.Axis,
            showLabel: true,
            stroke: "SteelBlue",
            strokeThickness: 2,
            x1: 9,
            axisLabelFill: "SteelBlue",
            axisFontSize: 20,
          },
        },
        {
          type: EAnnotationType.RenderContextVerticalLineAnnotation,
          options: {
            showLabel: true,
            stroke: "Orange",
            strokeThickness: 2,
            x1: 6,
            y1: 4,
            axisLabelFill: "Orange",
            axisFontSize: 20,
          },
        },
      ],
    }
  );
  // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
