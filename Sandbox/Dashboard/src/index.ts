import { DataPointInfo } from "scichart/Charting/ChartModifiers/DataPointInfo";
import { DataPointSelectionChangedArgs } from "scichart/Charting/ChartModifiers/DataPointSelectionChangedArgs";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { SciChartPieSurface } from "scichart/Charting/Visuals/SciChartPieSurface/SciChartPieSurface";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { drawAnimatedChartBuilderExample } from "./charts/drawAnimatedChartBuilderExample";
import { drawChartBuilderExample } from "./charts/drawChartBuilderExample";
import { drawColumnChartExample } from "./charts/drawColumnChartExample";
import { drawCustomFiltersChartExample } from "./charts/drawCustomFiltersChartExample";
import { drawDonutChartExample } from "./charts/drawDonutChartExample";
import { CategoryMetadata, drawLineChartExample } from "./charts/drawLineChartExample";
import { drawMountainChartExample } from "./charts/drawMountainChartExample";
import { drawPieChartExample } from "./charts/drawPieChartExample";
import { drawStackedColumnChartExample } from "./charts/drawStackedColumnChartExample";
import { drawVerticalChartExample } from "./charts/drawVerticalChartExample";
import { getLineChartData } from "./services/data.service";
import { ICONS } from "./utils/icons";


declare global {
    interface Window { SciChartDashboard: any; }
}
class SciChartDashboard {
    constructor() { }
    init(): void {
        const promises: any = [];
        promises.push(
            drawLineChartExample(sciChartDashboard.handleSelection).then(({ dataSeries }) => {
                dataSeries.removeAt(0);
                dataSeries.appendRange(
                    getLineChartData().map((item: any) => item.point),
                    getLineChartData().map((item: any) => item.value),
                    getLineChartData().map(_ =>
                        CategoryMetadata.create(ICONS[Math.floor(Math.random() * ICONS.length)].title)
                    )
                );
            })
        );
        promises.push(drawPieChartExample());
        promises.push(drawMountainChartExample());
        promises.push(drawDonutChartExample());
        promises.push(drawVerticalChartExample());
        promises.push(drawStackedColumnChartExample());
        promises.push(drawColumnChartExample());
        promises.push(drawChartBuilderExample());
        promises.push(drawAnimatedChartBuilderExample());
        promises.push(drawCustomFiltersChartExample());

        Promise.all(promises).then(() => {
            document.getElementById('sci-loader').setAttribute('loaded', 'true')
        }).catch(e => {
            console.log(e);
        });
    }
    handleSelection(args: DataPointSelectionChangedArgs): void {
        args.selectedDataPoints.forEach(function (selectedDataPoint: DataPointInfo) {
            document.getElementById('sci-modal').setAttribute('opened', 'true');
            document.getElementById('sci-modal').setAttribute('title', (selectedDataPoint.metadata as CategoryMetadata).title);
            document.getElementById('sci-modal').setAttribute('content', `X: <b>${selectedDataPoint.xValue}</b>, Y: <b>${selectedDataPoint.yValue}</b>`);
        });
    }
    hideModal(): void {
        document.getElementById('sci-modal').setAttribute('opened', 'false')
    }
    onPopupClick(): void {
        this.hideModal();
    }
}

const sciChartDashboard = new SciChartDashboard();
sciChartDashboard.init();
window.SciChartDashboard = sciChartDashboard;
