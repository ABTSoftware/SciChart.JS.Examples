import {
    ESeriesType,
    FastMountainRenderableSeries,
    GradientParams,
    IOverviewOptions,
    IRenderableSeries,
    Point,
    Thickness,
} from 'scichart';
import { appTheme } from 'scichart-example-dependencies';

// options used for current example
export const overviewOptions: IOverviewOptions = {
    theme: appTheme.SciChartJsTheme,
    disableAspect: true,
    padding: Thickness.fromString('0 10 10 10'),
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
                { color: appTheme.MutedPurple, offset: 0 },
                { color: appTheme.MutedBlue, offset: 0.5 },
                { color: appTheme.MutedOrange, offset: 1 },
            ]),
        });

        return copiedSeries;
    },
};
