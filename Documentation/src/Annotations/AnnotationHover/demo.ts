import {
  EChart2DModifierType,
  EAnnotationType,
  ECoordinateMode,
  TextAnnotation,
  AnnotationHoverEventArgs,
  BoxAnnotation,
  EHoverMode,
  IAnnotation,
  IHoverCallbackArgs,
  NumericAxis,
  SciChartJsNavyTheme,
  SciChartSurface,
  chartBuilder,
  AnnotationHoverModifier,
  TTargetsSelector,
} from "scichart";

async function annotationHoverExample0(divElementId: string | HTMLDivElement) {
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    divElementId,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // #region PrimaryExample
  // Demonstrates the effect of annotationLayer when adding annotations
  const boxAnnotation = new BoxAnnotation({
    xCoordinateMode: ECoordinateMode.Relative,
    yCoordinateMode: ECoordinateMode.Relative,
    fill: "#3d34eb",
    strokeThickness: 1,
    x1: 0.1,
    x2: 0.4,
    y1: 0.4,
    y2: 0.6,
    onHover: (args: AnnotationHoverEventArgs) => {
      const { sender, mouseArgs, isHovered } = args;
      if (mouseArgs && isHovered) {
        const relativeCoordinates = args.getRelativeCoordinates();
        console.log("The annotation is hovered at", relativeCoordinates);
      }
    },
  });

  sciChartSurface.annotations.add(boxAnnotation);

  const annotationHoverModifier = new AnnotationHoverModifier({
    enableHover: true, // default. Allows toggling the modifier on and off.
    targets: [boxAnnotation], // included hoverable annotations
    hoverMode: EHoverMode.AbsoluteTopmost, // default
    notifyOutEvent: true,
    notifyPositionUpdate: true,
    onHover: (args: IHoverCallbackArgs<IAnnotation>) => {
      const {
        mouseArgs,
        includedEntities,
        hoveredEntities,
        unhoveredEntities,
      } = args;

      const hoveredAnnotations = hoveredEntities as BoxAnnotation[];
      const unhoveredAnnotations = unhoveredEntities as BoxAnnotation[];

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
  boxAnnotation.hovered.subscribe((args: AnnotationHoverEventArgs) => {
    // ...
  });
  // #endregion

  // #region ModifierEventHandler
  // subscribe via Event Handler
  annotationHoverModifier.hoverChanged.subscribe(
    (args: IHoverCallbackArgs<IAnnotation>) => {
      // ...
    }
  );
  // #endregion

  return { sciChartSurface };
}

async function annotationHoverExample1(divElementId: string | HTMLDivElement) {
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    divElementId,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
  const primaryColors = ["#4FBEE6", "#AD3D8D", "#6BBDAE", "#E76E63", "#2C4B92"];

  const secondaryColors = ["Blue", "Green", "Red", "Yellow", "Orange"];
  const hoverableAnnotations: IAnnotation[] = [];

  const annotationSize = 0.1;
  const gap = 0.01;
  for (let i = 0; i < 5; ++i) {
    const annotation = new BoxAnnotation({
      isEditable: true,
      xCoordinateMode: ECoordinateMode.Relative,
      yCoordinateMode: ECoordinateMode.Relative,
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

  const textAnnotation = new TextAnnotation({
    xCoordinateMode: ECoordinateMode.Relative,
    yCoordinateMode: ECoordinateMode.Relative,
    text: "Nonhoverable Annotation",
    textColor: "black",
    fontSize: 24,
    x1: 0.1,
    y1: 0.3,
  });

  const nonHoverableAnnotation = new BoxAnnotation({
    xCoordinateMode: ECoordinateMode.Relative,
    yCoordinateMode: ECoordinateMode.Relative,
    fill: "#eb34cc",
    strokeThickness: 1,
    x1: 0.1,
    x2: 0.6,
    y1: 0.4,
    y2: 0.2,
  });

  sciChartSurface.annotations.add(nonHoverableAnnotation, textAnnotation);

  // #region ModifierTargetsSelector
  const targetsSelector: TTargetsSelector<IAnnotation> = (modifier) =>
    hoverableAnnotations;

  const annotationHoverModifier = new AnnotationHoverModifier({
    targets: targetsSelector,
    hoverMode: EHoverMode.Multi,
  });
  // #endregion

  sciChartSurface.chartModifiers.add(annotationHoverModifier);

  annotationHoverModifier.hoverChanged.subscribe(
    (args: IHoverCallbackArgs<IAnnotation>) => {
      const { includedEntities } = args;

      // annotations returned by the targetsSelector
      const includedAnnotations = includedEntities as BoxAnnotation[];

      includedAnnotations.forEach((annotation, index) => {
        if (annotation.isHovered) {
          annotation.stroke = "#87ceeb";
          annotation.strokeThickness = 3;
        } else {
          annotation.stroke = primaryColors[index];
          annotation.strokeThickness = 1;
        }
      });
    }
  );

  return { sciChartSurface };
}

async function builderExample(divElementId: string | HTMLDivElement) {
  // #region Example1WithBuilderAPI
  // Demonstrates the effect of annotationLayer when adding annotations
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(
    divElementId,
    {
      surface: {
        theme: new SciChartJsNavyTheme(),
      },

      annotations: [
        {
          type: EAnnotationType.RenderContextBoxAnnotation,
          options: {
            id: "boxAnnotation",
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            fill: "#3d34eb",
            strokeThickness: 1,
            x1: 0.1,
            x2: 0.4,
            y1: 0.4,
            y2: 0.6,
            onHover: (args: AnnotationHoverEventArgs) => {
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
          type: EChart2DModifierType.AnnotationHover,
          options: {
            enableHover: true, // default. Allows toggling the modifier on and off.
            targets: ["boxAnnotation"], // included hoverable annotation ids
            hoverMode: EHoverMode.AbsoluteTopmost, // default
            notifyOutEvent: true,
            notifyPositionUpdate: true,
            onHover: (args: IHoverCallbackArgs<IAnnotation>) => {
              const {
                mouseArgs,
                includedEntities,
                hoveredEntities,
                unhoveredEntities,
              } = args;

              const hoveredAnnotations = hoveredEntities as BoxAnnotation[];
              const unhoveredAnnotations = unhoveredEntities as BoxAnnotation[];

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
    }
  );
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
