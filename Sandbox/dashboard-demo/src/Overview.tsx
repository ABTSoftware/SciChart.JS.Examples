import { ForwardedRef, forwardRef, useContext } from 'react';
import SciChart, { IChartComponentPropsCore, IInitResult, TChartComponentPropsWithInit } from './SciChart';
import { SurfaceContext } from './SurfaceContext';
import { IOverviewOptions, SciChartOverview, SciChartSurface } from 'scichart';

const OverviewComponent = (
    props: IChartComponentPropsCore<SciChartSurface, IInitResult<SciChartSurface>> & { options?: IOverviewOptions },
    // ref: ForwardedRef<any>
) => {
    const {options, ...chartComponentProps} = props
    const parentSurface = useContext(SurfaceContext).sciChartSurface as SciChartSurface;
    const initChart = async (divElementId: string | HTMLDivElement): Promise<IInitResult<SciChartSurface>> => {
        const overview = await SciChartOverview.create(parentSurface, divElementId, options);
        // overview.applyTheme(parentSurface.themeProvider)
        return { sciChartSurface: overview.overviewSciChartSurface };
    };

    return <SciChart<SciChartSurface> {...chartComponentProps} initChart={initChart}></SciChart>;
};

// export default forwardRef(OverviewComponent);
export default OverviewComponent;
