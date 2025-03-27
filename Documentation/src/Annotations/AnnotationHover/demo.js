const {
    SciChartSurface,
    SciChartJsNavyTheme,
    NumericAxis,
    BoxAnnotation,
    ECoordinateMode,
    AnnotationHoverModifier,
    EHoverMode,
} = SciChart;

async function annotationHover(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // #region PrimaryExample
    // Add an annotation with hover behaviour
    const boxAnnotation = new BoxAnnotation({
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
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
    const annotationHoverModifier = new AnnotationHoverModifier({
        enableHover: true,
        targets: [boxAnnotation],
        hoverMode: EHoverMode.AbsoluteTopmost,
        notifyOutEvent: true,
        notifyPositionUpdate: true,
        onHover: (args) => {
            const { mouseArgs, includedEntities, hoveredEntities, unhoveredEntities } = args;
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

const { chartBuilder, EChart2DModifierType } = SciChart;

async function builderExample(divElementId) {
    // #region Example1WithBuilderAPI
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: {
            theme: new SciChartJsNavyTheme(),
        },
        // Add an annotation with hover behaviour
        annotations: [
            {
                type: scichart_1.EAnnotationType.RenderContextBoxAnnotation,
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
                    onHover: (args) => {
                        const { sender, mouseArgs, isHovered } = args;
                        if (mouseArgs && isHovered) {
                            const relativeCoordinates = args.getRelativeCoordinates();
                            console.log("The annotation is hovered at", relativeCoordinates);
                        }
                    },
                },
            },
        ],
        // Add AnnotationHoverModifier to enable hover behaviour
        modifiers: [
            {
                type: EChart2DModifierType.AnnotationHover,
                options: {
                    enableHover: true,
                    targets: ["boxAnnotation"],
                    hoverMode: EHoverMode.AbsoluteTopmost,
                    notifyOutEvent: true,
                    notifyPositionUpdate: true,
                    onHover: (args) => {
                        const { mouseArgs, includedEntities, hoveredEntities, unhoveredEntities } = args;
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
