import { useContext, useEffect, useRef } from 'react';
import SciChart, { IChartComponentPropsCore, IInitResult } from './SciChart';
import { SurfaceContext } from './SurfaceContext';
import { ESeriesType, FastMountainRenderableSeries, GradientParams, IOverviewOptions, IRenderableSeries, Point, SciChartOverview, SciChartSurface, Thickness } from 'scichart';
import { appTheme } from 'scichart-example-dependencies';

const OverviewComponent = (
    props: IChartComponentPropsCore<SciChartSurface, IInitResult<SciChartSurface>> & { options?: IOverviewOptions }
) => {
    const { options, ...chartComponentProps } = props;
    const parentSurface = useContext(SurfaceContext).sciChartSurface as SciChartSurface;
    const overviewRef = useRef<SciChartOverview>(null);
    const overviewCreatePromiseRef = useRef<Promise<SciChartOverview>>(null);

    const initChart = async (divElementId: string | HTMLDivElement): Promise<IInitResult<SciChartSurface>> => {
        overviewCreatePromiseRef.current = SciChartOverview.create(parentSurface, divElementId, options);
        const overview = await overviewCreatePromiseRef.current
        overviewRef.current = overview;
        return { sciChartSurface: overview.overviewSciChartSurface };
    };

    useEffect(() => { 
        const performCleanup = () => {
            overviewRef.current.delete();
            overviewRef.current = undefined; 
        }

        return () => {
            overviewRef.current ? performCleanup() : overviewCreatePromiseRef.current.then(performCleanup)
        }
    }, [])

    return <SciChart<SciChartSurface> {...chartComponentProps} initChart={initChart}></SciChart>;
};

export default OverviewComponent;

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
