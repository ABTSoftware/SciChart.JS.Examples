const {
    EChart2DModifierType,
    EAnnotationType,
    ECoordinateMode,
    TextAnnotation,
    AnnotationHoverEventArgs,
    BoxAnnotation,
    EHoverMode,
    IAnnotation,
    NumericAxis,
    SciChartJsNavyTheme,
    SciChartSurface,
    chartBuilder,
    AnnotationHoverModifier,
} = SciChart;

async function annotationHoverTargets(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    const primaryColors = ["#4FBEE6", "#AD3D8D", "#6BBDAE", "#E76E63", "#2C4B92"];

    const secondaryColors = ["Blue", "Green", "Red", "Yellow", "Orange"];
    const hoverableAnnotations = [];

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
    const targetsSelector = (modifier) => hoverableAnnotations;

    const annotationHoverModifier = new AnnotationHoverModifier({
        targets: targetsSelector,
        hoverMode: EHoverMode.Multi,
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

annotationHoverTargets("scichart-root");
