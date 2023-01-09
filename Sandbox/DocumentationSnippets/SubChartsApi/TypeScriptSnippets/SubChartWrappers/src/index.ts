import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { Rect } from 'scichart/Core/Rect';
import { chartBuilder } from 'scichart/Builder/chartBuilder';

export async function subChartWrapperExample(divElementId: string, subChartDivElementId: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add a sub-chart to the main surface
    const subChartSurface = sciChartSurface.addSubChart({
        position: new Rect(0, 0, 0.5, 0.5),
        isTransparent: false,
        subChartContainerId: subChartDivElementId,
    });

    // specify class names of section elements within the sub-chart container
    subChartSurface.topSectionClass = 'top-section';
    subChartSurface.leftSectionClass = 'left-section';
    subChartSurface.bottomSectionClass = 'bottom-section';
    subChartSurface.rightSectionClass = 'right-section';

    subChartSurface.xAxes.add(new NumericAxis(wasmContext));
    subChartSurface.yAxes.add(new NumericAxis(wasmContext));
}

export async function subChartWrapperWithBuilderApi(divElementId: string, subChartDivElementId: string) {
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        subCharts: [
            {
                surface: {
                    position: new Rect(0, 0, 0.5, 0.5),
                    isTransparent: false,
                    subChartContainerId: subChartDivElementId,
                },
            },
        ],
    });

    const [subChartSurface] = sciChartSurface.subCharts;

    // specify class names of section elements within the sub-chart container
    subChartSurface.topSectionClass = 'top-section';
    subChartSurface.leftSectionClass = 'left-section';
    subChartSurface.bottomSectionClass = 'bottom-section';
    subChartSurface.rightSectionClass = 'right-section';
}

export async function subChartWrapperByRefExample(divElementId: string, subChartDivElementId: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const subChartContainer = document.getElementById(subChartDivElementId) as HTMLDivElement;

    const subChartSurface = sciChartSurface.addSubChart({
        position: new Rect(0, 0, 0.5, 0.5),
        isTransparent: false,
        subChartContainerId: subChartContainer,
    });
    subChartSurface.xAxes.add(new NumericAxis(wasmContext));
    subChartSurface.yAxes.add(new NumericAxis(wasmContext));
}

export async function subChartWrapperByRefWithBuilderApi(divElementId: string, subChartDivElementId: string) {
    const subChartContainer = document.getElementById(subChartDivElementId) as HTMLDivElement;
    
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        subCharts: [
            {
                surface: {
                    position: new Rect(0, 0, 0.5, 0.5),
                    subChartContainerId: subChartContainer,
                },
            },
        ],
    });

    const [subChartSurface] = sciChartSurface.subCharts;

    // specify class names of section elements within the sub-chart container
    subChartSurface.topSectionClass = 'top-section';
    subChartSurface.leftSectionClass = 'left-section';
    subChartSurface.bottomSectionClass = 'bottom-section';
    subChartSurface.rightSectionClass = 'right-section';
}

subChartWrapperExample('scichart-root-1', 'sub-chart-container-id-1');
subChartWrapperByRefExample('scichart-root-2', 'sub-chart-container-id-2');
