"use strict";

const scichart_1 = SciChart;
async function annotationHoverExample0(divElementId) {
  const { wasmContext, sciChartSurface } =
    await scichart_1.SciChartSurface.create(divElementId, {
      theme: new scichart_1.SciChartJsNavyTheme(),
    });
  sciChartSurface.xAxes.add(new scichart_1.NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new scichart_1.NumericAxis(wasmContext));
  // #region PrimaryExample
  // Demonstrates the effect of annotationLayer when adding annotations
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
async function annotationHoverExample1(divElementId) {
  const { wasmContext, sciChartSurface } =
    await scichart_1.SciChartSurface.create(divElementId, {
      theme: new scichart_1.SciChartJsNavyTheme(),
    });
  sciChartSurface.xAxes.add(new scichart_1.NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new scichart_1.NumericAxis(wasmContext));
  const primaryColors = ["#4FBEE6", "#AD3D8D", "#6BBDAE", "#E76E63", "#2C4B92"];
  const secondaryColors = ["Blue", "Green", "Red", "Yellow", "Orange"];
  const hoverableAnnotations = [];
  const annotationSize = 0.1;
  const gap = 0.01;
  for (let i = 0; i < 5; ++i) {
    const annotation = new scichart_1.BoxAnnotation({
      isEditable: true,
      xCoordinateMode: scichart_1.ECoordinateMode.Relative,
      yCoordinateMode: scichart_1.ECoordinateMode.Relative,
      stroke: primaryColors[i],
      fill: secondaryColors[i],
      strokeThickness: 1,
      x1: 0.1 + (annotationSize + gap) * i,
      x2: 0.1 + annotationSize + (annotationSize + gap) * i,
      y1: 0.7,
      y2: 0.5,
    });
    hoverableAnnotations.push(annotation);
    sciChartSurface.annotations.add(annotation);
  }
  const textAnnotation = new scichart_1.TextAnnotation({
    xCoordinateMode: scichart_1.ECoordinateMode.Relative,
    yCoordinateMode: scichart_1.ECoordinateMode.Relative,
    text: "Nonhoverable Annotation",
    textColor: "black",
    fontSize: 24,
    x1: 0.1,
    y1: 0.3,
  });
  const nonHoverableAnnotation = new scichart_1.BoxAnnotation({
    xCoordinateMode: scichart_1.ECoordinateMode.Relative,
    yCoordinateMode: scichart_1.ECoordinateMode.Relative,
    fill: "#eb34cc",
    strokeThickness: 1,
    x1: 0.1,
    x2: 0.6,
    y1: 0.4,
    y2: 0.2,
  });
  sciChartSurface.annotations.add(nonHoverableAnnotation, textAnnotation);
  // #region ModifierTargetsSelector
  const targetsSelector = (modifier) => hoverableAnnotations;
  const annotationHoverModifier = new scichart_1.AnnotationHoverModifier({
    targets: targetsSelector,
    hoverMode: scichart_1.EHoverMode.Multi,
  });
  // #endregion
  sciChartSurface.chartModifiers.add(annotationHoverModifier);
  annotationHoverModifier.hoverChanged.subscribe((args) => {
    const { includedEntities } = args;
    // annotations returned by the targetsSelector
    const includedAnnotations = includedEntities;
    includedAnnotations.forEach((annotation, index) => {
      if (annotation.isHovered) {
        annotation.stroke = "#87ceeb";
        annotation.strokeThickness = 3;
      } else {
        annotation.stroke = primaryColors[index];
        annotation.strokeThickness = 1;
      }
    });
  });
  return { sciChartSurface };
}
async function builderExample(divElementId) {
  // #region Example1WithBuilderAPI
  // Demonstrates the effect of annotationLayer when adding annotations
  const { wasmContext, sciChartSurface } =
    await scichart_1.chartBuilder.build2DChart(divElementId, {
      surface: {
        theme: new scichart_1.SciChartJsNavyTheme(),
      },
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
if (location.search.includes("builder=1")) {
  builderExample("scichart-root-0");
  annotationHoverExample1("scichart-root-1");
} else {
  annotationHoverExample0("scichart-root-0");
  annotationHoverExample1("scichart-root-1");
}
