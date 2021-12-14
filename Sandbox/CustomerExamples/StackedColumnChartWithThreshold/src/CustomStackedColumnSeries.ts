import {
    IStackedColumnRenderableSeriesOptions,
    StackedColumnRenderableSeries
} from 'scichart/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries';
import { TSciChart } from 'scichart/types/TSciChart';

export class CustomStackedColumnSeries extends StackedColumnRenderableSeries {
    private dependentSeries: StackedColumnRenderableSeries;
    constructor(
        webAssemblyContext: TSciChart,
        dependentSeries?: StackedColumnRenderableSeries,
        options?: IStackedColumnRenderableSeriesOptions
    ) {
        super(webAssemblyContext, options);
        this.dependentSeries = dependentSeries;
    }

    public set isVisible(value: boolean) {
        super.isVisible = value;
        this.dependentSeries.isVisible = value;
    }

    public get isVisible() {
        return super.isVisible;
    }
}
