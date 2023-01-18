import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {NumberRange} from "scichart/Core/NumberRange";
import { chartBuilder } from "scichart/Builder/chartBuilder";
import { EWrapTo, NativeTextAnnotation } from "scichart/Charting/Visuals/Annotations/NativeTextAnnotation";
import { GenericAnimation } from "scichart/Core/Animations/GenericAnimation";
import { EAnnotationType } from "scichart/Charting/Visuals/Annotations/IAnnotation";

export async function nativeTextAnnotationExample(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 10) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 10) }));

    const nativeTextHostedFont = new NativeTextAnnotation({
        x1: 1,
        y1: 1,
        fontFamily: "jokerman",
        text: "This text uses a hosted font",
        fontSize: 18
     });
     sciChartSurface.annotations.add(nativeTextHostedFont);
    
    const nativeText1 = new NativeTextAnnotation({
        x1: 1,
        y1: 9,
        text: "The default font is Arial, which does not need to be hosted or registered",
        fontSize: 18
     });
     sciChartSurface.annotations.add(nativeText1);

     await sciChartSurface.registerFont(
        "notoserif",
        "https://raw.githubusercontent.com/google/fonts/main/ofl/notoserif/NotoSerif-Regular.ttf"
    );
    await sciChartSurface.registerFont(
        "notosansarabic",
        "https://raw.githubusercontent.com/google/fonts/main/ofl/notosansarabic/NotoSansArabic%5Bwdth%2Cwght%5D.ttf"
    );
     const nativeText2 = new NativeTextAnnotation({
        x1: 3,
        y1: 7,
        text: "له هغه ځايه",
        fontFamily: "notosansarabic",
        fontSize: 24
     });
     sciChartSurface.annotations.add(nativeText2);

     const nativeText3 = new NativeTextAnnotation({
        x1: 1,
        y1: 5,
        text: "Native text supports\nmultiline and rotation",
        fontFamily: "arial",
        fontSize: 24,
        rotation: 30,
        textColor: "orange"
     });
     sciChartSurface.annotations.add(nativeText3);

     const nativeText4 = new NativeTextAnnotation({
        x1: 5,
        y1: 5,
        text: "Native text can automatically wrap to the chart area or the annotation width.  ",
        fontFamily: "arial",
        fontSize: 24,
        isEditable: true,
        wrapTo: EWrapTo.ViewRect
     });
     sciChartSurface.annotations.add(nativeText4);

     const nativeText5 = new NativeTextAnnotation({
        x1: 5,
        y1: 3,
        text: "Native text can be scaled\nwithout changing the font size",
        fontFamily: "arial",
        fontSize: 16,
     });
     sciChartSurface.annotations.add(nativeText5);
     const scaleAnimation = new GenericAnimation({
        from: 0,
        to: 1,
        duration: 2000,
        onAnimate: (from, to, progress) => {
            if (progress < 0.5) {
                nativeText5.scale = 1 + progress;
            } else {
                nativeText5.scale = 1 + (1 - progress);
            }
        },
        onCompleted: () => { scaleAnimation.reset() }
     });
     sciChartSurface.addAnimation(scaleAnimation);

}

export async function nativeTextAnnotationBuilderAPIExample(divElementId) {
    const { sciChartSurface, wasmContext } = await chartBuilder.buildChart(divElementId, {
        annotations: [
            { type: EAnnotationType.RenderContextNativeTextAnnotation, options: {
                x1: 1,
                y1: 9,
                text: "The default font is Arial, which does not need to be hosted or registered",
                fontSize: 16
            }},
            { type: EAnnotationType.RenderContextNativeTextAnnotation, options: {
                x1: 3,
                y1: 7,
                text: "This text uses a font from the internet",
                fontFamily: "notoserif",
                fontSize: 24
            }},
            { type: EAnnotationType.RenderContextNativeTextAnnotation, options: {
                x1: 1,
                y1: 5,
                text: "Native text supports\nmultiline and rotation",
                fontFamily: "arial",
                fontSize: 24,
                rotation: 30,
                textColor: "orange"
             }},
             { type: EAnnotationType.RenderContextNativeTextAnnotation, options: {
                x1: 5,
                y1: 5,
                text: "Native text can automatically wrap to the chart area or the annotation width.  ",
                fontFamily: "arial",
                fontSize: 24,
                isEditable: true,
                wrapTo: EWrapTo.ViewRect
             }},
             { type: EAnnotationType.RenderContextNativeTextAnnotation, options: {
                id: "scaleAnnotation",
                x1: 5,
                y1: 3,
                text: "Native text can be scaled\nwithout changing the font size",
                fontFamily: "arial",
                fontSize: 16,
             }}
        ]
    });
    // This only needs to be done once in the application.  The font is cached locally.
    // It does not even need to be done before the font is used.  SciChart will redraw until the font is available.
    await sciChartSurface.registerFont(
        "notoserif",
        "https://raw.githubusercontent.com/google/fonts/main/ofl/notoserif/NotoSerif-Regular.ttf"
    );

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
        onCompleted: () => { scaleAnimation.reset() }
     });
     sciChartSurface.addAnimation(scaleAnimation);
}