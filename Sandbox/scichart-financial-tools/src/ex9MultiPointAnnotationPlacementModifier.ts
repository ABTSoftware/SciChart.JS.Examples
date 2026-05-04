import { SciChartSurface, NumericAxis, EAnnotationType, FreehandDrawingModifier } from "scichart";
import { ETradingAnnotationType, MultiPointAnnotationPlacementModifier } from "scichart-financial-tools";

export async function ex9MultiPointAnnotationPlacementModifier() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const placementModifier = new MultiPointAnnotationPlacementModifier({
        // isPlacing: true,
        keepPlacingAfterComplete: false
    });

    placementModifier.startPlacement({
        type: ETradingAnnotationType.PitchforkAnnotation, options: {
            isEditable: true
        }
    });

    sciChartSurface.chartModifiers.add(placementModifier);
    sciChartSurface.zoomExtents();
}
