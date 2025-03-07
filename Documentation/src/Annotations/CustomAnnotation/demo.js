// #region ExampleA
const {
  BoxAnnotation,
  CustomAnnotation,
  LineAnnotation,
  TextAnnotation,
  NumericAxis,
  SciChartSurface,
  NumberRange,
  EHorizontalAnchorPoint,
  EVerticalAnchorPoint,
  ECoordinateMode,
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

  const rocketSvg = `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>
    <svg height="64.013px" id="Layer_1" style="enable-background:new 0 0 64.02 64.013;" version="1.1" viewBox="0 0 64.02 64.013" width="64.02px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Legs"><g><path d="M38,36.013l-6,6l-4,4v6l-6,10l4,2l14-14L38,36.013z     M28,26.013l-14-2l-14,14l2,4l10-6h6l4-4L28,26.013z" style="fill-rule:evenodd;clip-rule:evenodd;fill:#CCCCCC;"/></g></g>
      <g id="Flames"><g><path d="M10,44.013c-3.939,5.748-9.974,12.835-10,16c-0.021,2.403,1.576,4.021,4,4    c3.217-0.027,10.011-6.031,16-10L10,44.013z" style="fill:#FFCC66;"/></g></g><g id="Flames_1_"><g><path d="M16,42.013c-3.939,5.748-12,12.835-12,16c0,2.091,0.201,2,2,2c3.217,0,10.011-8.031,16-12    L16,42.013z" style="fill:#ED7161;"/></g></g>
      <g id="Body_2_"><g><path d="M60,0.013c-6.286,0.389-17.138,1.137-30,14C20.539,23.474,12.239,37.231,8.348,46.36l9.367,9.367    C26.793,51.874,40.459,43.553,50,34.013c12.779-12.779,13.507-23.669,14-30C64.22,1.187,62.614-0.149,60,0.013z" style="fill:#387AA7;"/></g></g>
      <g id="Body_3_"><g><path d="M60,0.013c-6.286,0.389-17.138,1.137-30,14c-7.724,7.723-14.664,18.307-19.078,26.905    l12.235,12.235C31.703,48.751,42.222,41.791,50,34.013c12.779-12.779,13.507-23.669,14-30C64.22,1.187,62.614-0.149,60,0.013z" style="fill:#48A0DC;"/></g></g>
      <g id="Glass"><g><circle cx="48" cy="16.013" r="8" style="fill:#4D4D4D;"/></g></g>
      <g id="Glass_1_"><g><circle cx="48" cy="16.013" r="4" style="fill:#FFFFFF;"/></g></g></svg>`;

  // Add a selection of annotations to the chart
  sciChartSurface.annotations.add(
    new CustomAnnotation({
      x1: 4,
      y1: 5,
      svgString: rocketSvg,
    })
  );
}

addAnnotationToChart("scichart-root");
// #endregion

async function builderExample(divElementId) {
  // #region ExampleB
  const { chartBuilder, EAnnotationType } = SciChart;

  // or for npm import { SciChartSurface, ... } from "scichart"

  const rocketSvg = `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>
    <svg height="64.013px" id="Layer_1" style="enable-background:new 0 0 64.02 64.013;" version="1.1" viewBox="0 0 64.02 64.013" width="64.02px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Legs"><g><path d="M38,36.013l-6,6l-4,4v6l-6,10l4,2l14-14L38,36.013z     M28,26.013l-14-2l-14,14l2,4l10-6h6l4-4L28,26.013z" style="fill-rule:evenodd;clip-rule:evenodd;fill:#CCCCCC;"/></g></g>
      <g id="Flames"><g><path d="M10,44.013c-3.939,5.748-9.974,12.835-10,16c-0.021,2.403,1.576,4.021,4,4    c3.217-0.027,10.011-6.031,16-10L10,44.013z" style="fill:#FFCC66;"/></g></g><g id="Flames_1_"><g><path d="M16,42.013c-3.939,5.748-12,12.835-12,16c0,2.091,0.201,2,2,2c3.217,0,10.011-8.031,16-12    L16,42.013z" style="fill:#ED7161;"/></g></g>
      <g id="Body_2_"><g><path d="M60,0.013c-6.286,0.389-17.138,1.137-30,14C20.539,23.474,12.239,37.231,8.348,46.36l9.367,9.367    C26.793,51.874,40.459,43.553,50,34.013c12.779-12.779,13.507-23.669,14-30C64.22,1.187,62.614-0.149,60,0.013z" style="fill:#387AA7;"/></g></g>
      <g id="Body_3_"><g><path d="M60,0.013c-6.286,0.389-17.138,1.137-30,14c-7.724,7.723-14.664,18.307-19.078,26.905    l12.235,12.235C31.703,48.751,42.222,41.791,50,34.013c12.779-12.779,13.507-23.669,14-30C64.22,1.187,62.614-0.149,60,0.013z" style="fill:#48A0DC;"/></g></g>
      <g id="Glass"><g><circle cx="48" cy="16.013" r="8" style="fill:#4D4D4D;"/></g></g>
      <g id="Glass_1_"><g><circle cx="48" cy="16.013" r="4" style="fill:#FFFFFF;"/></g></g></svg>`;

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(
    divElementId,
    {
      annotations: [
        {
          type: EAnnotationType.SVGCustomAnnotation,
          options: {
            x1: 5,
            y1: 5,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            svgString: rocketSvg,
          },
        },
      ],
    }
  );
  // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
