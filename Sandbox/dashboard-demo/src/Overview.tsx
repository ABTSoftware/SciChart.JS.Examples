import { useContext } from 'react';
import SciChart, { IChartComponentPropsCore, IInitResult } from './SciChart';
import { SurfaceContext } from './SurfaceContext';
import { ESeriesType, FastMountainRenderableSeries, GradientParams, IOverviewOptions, IRenderableSeries, Point, SciChartOverview, SciChartSurface, Thickness } from 'scichart';
import { appTheme } from 'scichart-example-dependencies';

const OverviewComponent = (
    props: IChartComponentPropsCore<SciChartSurface, IInitResult<SciChartSurface>> & { options?: IOverviewOptions }
) => {
    const { options, ...chartComponentProps } = props;
    const parentSurface = useContext(SurfaceContext).sciChartSurface as SciChartSurface;
    const initChart = async (divElementId: string | HTMLDivElement): Promise<IInitResult<SciChartSurface>> => {
        const overview = await SciChartOverview.create(parentSurface, divElementId, options);
        return { sciChartSurface: overview.overviewSciChartSurface };
    };

    return <SciChart<SciChartSurface> {...chartComponentProps} initChart={initChart}></SciChart>;
};

export default OverviewComponent;

// options used for current example
export const overviewOptions: IOverviewOptions = {
    theme: appTheme.SciChartJsTheme,
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
