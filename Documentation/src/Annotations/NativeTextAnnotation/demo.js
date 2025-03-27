// #region ExampleA
const {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    EWrapTo,
    NativeTextAnnotation,
    GenericAnimation,
    SciChartJsNavyTheme,
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function addAnnotationToChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add a selection of NativeTextAnnotations to the chart
    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            x1: 1,
            y1: 9,
            text: "The default font is Arial, which does not need to be hosted or registered",
            fontSize: 18,
        })
    );

    // Loading a NativeTextAnnotation with a custom font
    const result = await sciChartSurface.registerFont(
        "MyCustomFont",
        "https://fonts.gstatic.com/s/opensans/v29/mem8YaGs126MiZpBA-U1UpcaXcl0Aw.ttf"
    );

    console.log("Native font was loaded? " + result);

    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            x1: 3,
            y1: 7,
            text: "This text uses a custom font",
            fontFamily: "MyCustomFont",
            fontSize: 24,
        })
    );

    // Rotating a NativeTextAnnotation with multline text
    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            x1: 1,
            y1: 5,
            text: "Native text supports\nmultiline and rotation",
            fontFamily: "arial",
            fontSize: 24,
            rotation: 30,
            textColor: "orange",
        })
    );

    // Word Wrapping a NativeTextAnnotation
    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            x1: 5,
            y1: 5,
            text: "Native text can automatically wrap to the chart area or the annotation width.  ",
            fontFamily: "arial",
            fontSize: 24,
            isEditable: true,
            wrapTo: EWrapTo.ViewRect,
        })
    );

    // Scaling a native text annotation
    const scaledText = new NativeTextAnnotation({
        x1: 5,
        y1: 3,
        text: "Native text can be scaled\nwithout changing the font size",
        fontFamily: "arial",
        fontSize: 16,
        scale: 1,
    });
    sciChartSurface.annotations.add(scaledText);
    const scaleAnimation = new GenericAnimation({
        from: 0,
        to: 1,
        duration: 2000,
        onAnimate: (from, to, progress) => {
            if (progress < 0.5) {
                scaledText.scale = 1 + progress;
            } else {
                scaledText.scale = 1 + (1 - progress);
            }
        },
        onCompleted: () => {
            scaleAnimation.reset();
        },
    });
    sciChartSurface.addAnimation(scaleAnimation);
}

addAnnotationToChart("scichart-root");
// #endregion

async function builderExample(divElementId) {
    const { chartBuilder, EAnnotationType } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // #region ExampleB
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        annotations: [
            {
                type: EAnnotationType.RenderContextNativeTextAnnotation,
                options: {
                    x1: 1,
                    y1: 9,
                    text: "The default font is Arial, which does not need to be hosted or registered",
                    fontSize: 18,
                },
            },
            {
                type: EAnnotationType.RenderContextNativeTextAnnotation,
                options: {
                    x1: 1,
                    y1: 5,
                    text: "Native text supports\nmultiline and rotation",
                    fontFamily: "arial",
                    fontSize: 24,
                    rotation: 30,
                    textColor: "orange",
                },
            },
            {
                type: EAnnotationType.RenderContextNativeTextAnnotation,
                options: {
                    x1: 3,
                    y1: 7,
                    text: "This text uses a font from the internet",
                    fontFamily: "MyCustomFont",
                    fontSize: 24,
                },
            },
            {
                type: EAnnotationType.RenderContextNativeTextAnnotation,
                options: {
                    x1: 5,
                    y1: 5,
                    text: "Native text can automatically wrap to the chart area or the annotation width.  ",
                    fontFamily: "arial",
                    fontSize: 24,
                    isEditable: true,
                    wrapTo: EWrapTo.ViewRect,
                },
            },
            {
                type: EAnnotationType.RenderContextNativeTextAnnotation,
                options: {
                    id: "scaleAnnotation",
                    x1: 5,
                    y1: 3,
                    text: "Native text can be scaled\nwithout changing the font size",
                    fontFamily: "arial",
                    fontSize: 16,
                },
            },
        ],
    });

    // Registering the custom font
    const result = await sciChartSurface.registerFont(
        "MyCustomFont",
        "https://fonts.gstatic.com/s/opensans/v29/mem8YaGs126MiZpBA-U1UpcaXcl0Aw.ttf"
    );

    console.log("Native font was loaded? " + result);

    // Scaling the last NativeTextAnnotation
    const scaleAnnotation = sciChartSurface.annotations.getById("scaleAnnotation");
    const scaleAnimation = new GenericAnimation({
        from: 0,
        to: 1,
        duration: 2000,
        onAnimate: (from, to, progress) => {
            if (progress < 0.5) {
                scaleAnnotation.scale = 1 + progress;
            } else {
                scaleAnnotation.scale = 1 + (1 - progress);
            }
        },
        onCompleted: () => {
            scaleAnimation.reset();
        },
    });
    sciChartSurface.addAnimation(scaleAnimation);
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
