import { useContext, useEffect, useRef } from "react";
import { SciChartReact, SciChartSurfaceContext, IInitResult } from "scichart-react";
import {
    ESeriesType,
    FastMountainRenderableSeries,
    GradientParams,
    IOverviewOptions,
    IRenderableSeries,
    Point,
    SciChartOverview,
    SciChartSurface,
    Thickness,
} from "scichart";
import { appTheme } from "scichart-example-dependencies";
import { IChartComponentPropsCore } from "scichart-react/types";

const OverviewComponent = (
    props: IChartComponentPropsCore<SciChartSurface, IInitResult<SciChartSurface>> & { options?: IOverviewOptions }
) => {
    const { options, ...chartComponentProps } = props;
    const parentSurface = useContext(SciChartSurfaceContext).sciChartSurface as SciChartSurface;
    const overviewRef = useRef<SciChartOverview>(null);
    const overviewCreatePromiseRef = useRef<Promise<SciChartOverview>>(null);

    const initChart = async (divElementId: string | HTMLDivElement): Promise<IInitResult<SciChartSurface>> => {
        overviewCreatePromiseRef.current = SciChartOverview.create(parentSurface, divElementId, options);
        const overview = await overviewCreatePromiseRef.current;
        overviewRef.current = overview;
        return { sciChartSurface: overview.overviewSciChartSurface };
    };

    useEffect(() => {
        const performCleanup = () => {
            overviewRef.current.delete();
            overviewRef.current = undefined;
        };

        return () => {
            overviewRef.current ? performCleanup() : overviewCreatePromiseRef.current.then(performCleanup);
        };
    }, []);

    return <SciChartReact<SciChartSurface> {...chartComponentProps} initChart={initChart} />;
};

export default OverviewComponent;

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
