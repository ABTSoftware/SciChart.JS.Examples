"use strict";

const scichart_1 = SciChart;
async function annotationHover(divElementId) {
  const { wasmContext, sciChartSurface } =
    await scichart_1.SciChartSurface.create(divElementId, {
      theme: new scichart_1.SciChartJsNavyTheme(),
    });
  sciChartSurface.xAxes.add(new scichart_1.NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new scichart_1.NumericAxis(wasmContext));
  // #region PrimaryExample
  // Add an annotation with hover behaviour
  const boxAnnotation = new scichart_1.BoxAnnotation({
    xCoordinateMode: scichart_1.ECoordinateMode.Relative,
    yCoordinateMode: scichart_1.ECoordinateMode.Relative,
    fill: "#3d34eb",
    strokeThickness: 1,
    x1: 0.1,
    x2: 0.4,
    y1: 0.4,
    y2: 0.6,
    onHover: (args) => {
      const { sender, mouseArgs, isHovered } = args;
      if (mouseArgs && isHovered) {
        const relativeCoordinates = args.getRelativeCoordinates();
        console.log("The annotation is hovered at", relativeCoordinates);
      }
    },
  });
  sciChartSurface.annotations.add(boxAnnotation);
  // Add AnnotationHoverModifier to enable hover behaviour
  const annotationHoverModifier = new scichart_1.AnnotationHoverModifier({
    enableHover: true,
    targets: [boxAnnotation],
    hoverMode: scichart_1.EHoverMode.AbsoluteTopmost,
    notifyOutEvent: true,
    notifyPositionUpdate: true,
    onHover: (args) => {
      const {
        mouseArgs,
        includedEntities,
        hoveredEntities,
        unhoveredEntities,
      } = args;
      const hoveredAnnotations = hoveredEntities;
      const unhoveredAnnotations = unhoveredEntities;
      hoveredAnnotations.forEach((annotation) => {
        annotation.fill = "#34eb8c";
        annotation.strokeThickness = 3;
      });
      unhoveredAnnotations.forEach((annotation) => {
        annotation.fill = "#3d34eb";
        annotation.strokeThickness = 1;
      });
    },
  });
  sciChartSurface.chartModifiers.add(annotationHoverModifier);
  // #endregion
  // #region AnnotationEventHandler
  // subscribe via Event Handler
  boxAnnotation.hovered.subscribe((args) => {
    // ...
  });
  // #endregion
  // #region ModifierEventHandler
  // subscribe via Event Handler
  annotationHoverModifier.hoverChanged.subscribe((args) => {
    // ...
  });
  // #endregion
  return { sciChartSurface };
}

annotationHover("scichart-root");

async function builderExample(divElementId) {
  // #region Example1WithBuilderAPI
  const { wasmContext, sciChartSurface } =
    await scichart_1.chartBuilder.build2DChart(divElementId, {
      surface: {
        theme: new scichart_1.SciChartJsNavyTheme(),
      },
      // Add an annotation with hover behaviour
      annotations: [
        {
          type: scichart_1.EAnnotationType.RenderContextBoxAnnotation,
          options: {
            id: "boxAnnotation",
            xCoordinateMode: scichart_1.ECoordinateMode.Relative,
            yCoordinateMode: scichart_1.ECoordinateMode.Relative,
            fill: "#3d34eb",
            strokeThickness: 1,
            x1: 0.1,
            x2: 0.4,
            y1: 0.4,
            y2: 0.6,
            onHover: (args) => {
              const { sender, mouseArgs, isHovered } = args;
              if (mouseArgs && isHovered) {
                const relativeCoordinates = args.getRelativeCoordinates();
                console.log(
                  "The annotation is hovered at",
                  relativeCoordinates
                );
              }
            },
          },
        },
      ],
      // Add AnnotationHoverModifier to enable hover behaviour
      modifiers: [
        {
          type: scichart_1.EChart2DModifierType.AnnotationHover,
          options: {
            enableHover: true,
            targets: ["boxAnnotation"],
            hoverMode: scichart_1.EHoverMode.AbsoluteTopmost,
            notifyOutEvent: true,
            notifyPositionUpdate: true,
            onHover: (args) => {
              const {
                mouseArgs,
                includedEntities,
                hoveredEntities,
                unhoveredEntities,
              } = args;
              const hoveredAnnotations = hoveredEntities;
              const unhoveredAnnotations = unhoveredEntities;
              hoveredAnnotations.forEach((annotation) => {
                annotation.fill = "#34eb8c";
                annotation.strokeThickness = 3;
              });
              unhoveredAnnotations.forEach((annotation) => {
                annotation.fill = "#3d34eb";
                annotation.strokeThickness = 1;
              });
            },
          },
        },
      ],
    });
  // #endregion

  return { sciChartSurface };
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
