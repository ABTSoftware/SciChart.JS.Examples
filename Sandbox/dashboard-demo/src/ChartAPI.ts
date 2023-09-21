import { IInitResult, SciChartComponentAPIBase, TInitFunction } from './SciChart';

import type { ISciChartSurfaceBase, SciChartPieSurface, SciChartSurface } from 'scichart';
import type { TDataEntry } from './data-generation';

export type TUpdateDataFunc = (newData: TDataEntry[]) => void;

export interface TChartConfigResult<TSurface extends ISciChartSurfaceBase> extends IInitResult<TSurface> {
    updateData: TUpdateDataFunc;
}

export type TChartConfigFunc<TSurface extends ISciChartSurfaceBase = SciChartSurface> =
 TInitFunction<ISciChartSurfaceBase, TChartConfigResult<TSurface>>;

export class ChartAPI<
    TSurface extends ISciChartSurfaceBase = SciChartSurface
> extends SciChartComponentAPIBase<TChartConfigResult<TSurface>> {
    public updateData(newData: TDataEntry[]) {
        return this.initResult.updateData(newData);
    }

    public get sciChartSurface(): TSurface {
        return this.initResult.sciChartSurface as TSurface;
    }
}
