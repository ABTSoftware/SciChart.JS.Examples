import {
    ESeriesType,
    FastMountainRenderableSeries,
    GradientParams,
    IOverviewOptions,
    IRenderableSeries,
    Point,
    Thickness,
} from "scichart";
import { appTheme } from "../../../theme";

// options used for current example
export const overviewOptions: IOverviewOptions = {
    theme: appTheme.SciChartJsTheme,
    disableAspect: true,
    padding: Thickness.fromString("0 10 10 10"),
    viewportBorder: {
        color: appTheme.DarkIndigo,
        border: 2,
    },
    transformRenderableSeries: (renderableSeries: IRenderableSeries) => {
        if (renderableSeries.type !== ESeriesType.MountainSeries) {
            return undefined;
        }

        const copiedSeries = new FastMountainRenderableSeries(renderableSeries.parentSurface.webAssemblyContext2D, {
            dataSeries: renderableSeries.dataSeries,
            stroke: appTheme.MutedPink,
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(1, 1), [
                { color: "#47bde6", offset: 0 },
                { color: "#8166a2", offset: 0.2 },
                { color: "#21a0d8", offset: 0.4 },
                { color: "#68bcae", offset: 0.6 },
                { color: "#ae418d", offset: 0.8 },
                { color: "#e97064", offset: 1 },
            ]),
        });

        return copiedSeries;
    },
};
