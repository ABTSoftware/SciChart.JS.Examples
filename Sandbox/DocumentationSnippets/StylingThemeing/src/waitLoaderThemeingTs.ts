import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {ISciChartLoader} from "scichart/Charting/Visuals/loader";
import {IThemeProvider} from "scichart/Charting/Themes/IThemeProvider";
import {SciChartJSDarkv2Theme} from "scichart/Charting/Themes/SciChartJSDarkv2Theme";

export async function waitLoaderThemeingTs(divId: string) {

    const loader = new CustomChartLoader();
    const theme = new SciChartJSDarkv2Theme();
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId,{ loader, theme });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
}

export class CustomChartLoader implements ISciChartLoader {
    public type: "Custom";
    public loadingText: string = "Initializing the Awesomeness...";

    constructor(options?: { loadingText?: string }) {
        this.loadingText = options?.loadingText ?? this.loadingText;
    }

    public addChartLoader(domChartRoot: HTMLDivElement, theme: IThemeProvider): HTMLElement {
        const loaderContainerDiv = document.createElement("div");
        loaderContainerDiv.style.backgroundColor = "#0F151C";
        loaderContainerDiv.style.height = "100%";
        loaderContainerDiv.style.width = "100%";
        loaderContainerDiv.style.display = "flex";
        loaderContainerDiv.style.justifyContent = "center";
        loaderContainerDiv.style.alignItems = "center";
        const loaderImage = document.createElement("img") as HTMLImageElement;
        loaderImage.src = "https://i.giphy.com/media/2WjpfxAI5MvC9Nl8U7/giphy.webp";
        loaderContainerDiv.appendChild(loaderImage);

        const loaderText = document.createElement("div");
        loaderText.style.marginLeft = "auto";
        loaderText.style.marginRight = "auto";
        loaderText.style.float = "left";
        loaderText.style.bottom = "150px";
        loaderText.style.textAlign = "center";
        loaderText.style.position = "absolute";
        loaderText.innerHTML = this.loadingText;
        loaderText.style.color = "#FF6600";
        loaderText.style.fontFamily = "Arial";
        loaderContainerDiv.appendChild(loaderText);

        domChartRoot.appendChild(loaderContainerDiv);
        return loaderContainerDiv;
    }
    public removeChartLoader(domChartRoot: HTMLDivElement, loaderElement: HTMLElement): void {

        // Remove loader after 2000ms timeout
        setTimeout(() => domChartRoot.removeChild(loaderElement), 2000);

        // For instant removal once scichart has loaded, just call domChartRoot.removeChild(loaderElement) without the setTimeout
        // e.g.
        // domChartRoot.removeChild(loaderElement);
    }
}
