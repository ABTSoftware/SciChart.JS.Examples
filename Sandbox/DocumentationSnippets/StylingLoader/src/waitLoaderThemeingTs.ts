import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { ISciChartLoader } from 'scichart/Charting/Visuals/loader';
import { IThemeProvider } from 'scichart/Charting/Themes/IThemeProvider';
import { SciChartJSDarkv2Theme } from 'scichart/Charting/Themes/SciChartJSDarkv2Theme';

export async function waitLoaderThemeingTs(divId: string) {
    const loader = new CustomChartLoader();
    const theme = new SciChartJSDarkv2Theme();
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId, { loader, theme });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
}

export class CustomChartLoader implements ISciChartLoader {
    public type: 'Custom';
    public loadingText: string = 'Loading SciChart...';

    constructor(options?: { loadingText?: string }) {
        this.loadingText = options?.loadingText ?? this.loadingText;
    }

    public addChartLoader(domChartRoot: HTMLDivElement, theme: IThemeProvider): HTMLElement {
        const loaderContainerDiv = document.createElement('div');
        loaderContainerDiv.id = "Loader-div";
        loaderContainerDiv.style.backgroundColor = 'red';
        loaderContainerDiv.style.height = '100%';
        loaderContainerDiv.style.width = '100%';
        loaderContainerDiv.style.display = 'flex';
        loaderContainerDiv.style.justifyContent = 'center';
        loaderContainerDiv.style.alignItems = 'center';
        const loaderImage = document.createElement('object');
        loaderImage.type = 'image/svg+xml';
        loaderImage.data = 'svg_animation_ext.svg';
        loaderContainerDiv.appendChild(loaderImage);
        domChartRoot.appendChild(loaderContainerDiv);
        return loaderContainerDiv;
    }
    public removeChartLoader(domChartRoot: HTMLDivElement, loaderElement: HTMLElement): void {
        // Remove loader after 2000ms timeout
        // setTimeout(() => domChartRoot.removeChild(loaderElement), 2000);
    }
}
