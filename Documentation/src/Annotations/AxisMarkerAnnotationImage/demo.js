// #region ExampleA
const {
  AxisMarkerAnnotation,
  NumericAxis,
  SciChartSurface,
  ELabelPlacement,
  SciChartJsNavyTheme,
  createImageAsync,
  TextAnnotation,
  EHorizontalAnchorPoint,
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

  const imageUrl = "https://demo.scichart.com/images/CustomMarkerImage.png";
  const htmlImageElement = await createImageAsync(imageUrl);

  // An AxisMarkerAnnotation at Y=5.2 showing an image
  sciChartSurface.annotations.add(
    new AxisMarkerAnnotation({
      y1: 5.1,
      isEditable: true,
      image: htmlImageElement,
      // Optional: Set imageWidth and imageHeight, else it will default to image size
      imageWidth: 48,
      imageHeight: 48,
    })
  );

  // Add a text annotation to explain
  sciChartSurface.annotations.add(
    new TextAnnotation({
      x1: 9.5,
      y1: 5.2,
      horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
      fontSize: 16,
      text: "Draggable Axis Marker with a custom image -->",
    })
  );
}

addAnnotationToChart("scichart-root");
// #endregion

async function builderExample(divElementId) {
  // #region ExampleB
  const { chartBuilder, EAnnotationType } = SciChart;

  // or for npm import { SciChartSurface, ... } from "scichart"

  const imageUrl = "https://demo.scichart.com/images/CustomMarkerImage.png";
  const htmlImageElement = await createImageAsync(imageUrl);

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(
    divElementId,
    {
      annotations: [
        {
          type: EAnnotationType.RenderContextAxisMarkerAnnotation,
          options: {
            y1: 5.1,
            isEditable: true,
            image: htmlImageElement,
            // Optional: Set imageWidth and imageHeight, else it will default to image size
            imageWidth: 48,
            imageHeight: 48,
          },
        },
      ],
    }
  );
  // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
