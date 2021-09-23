import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {SciChartJSLightTheme} from "scichart/Charting/Themes/SciChartJSLightTheme";
import {SciChartJSDarkv2Theme} from "scichart/Charting/Themes/SciChartJSDarkv2Theme";
import {DefaultSciChartLoader} from "scichart/Charting/Visuals/loader";

export class CustomChartLoader  {
    addChartLoader(domChartRoot, theme) {
        const loaderContainerDiv = document.createElement("div");
        loaderContainerDiv.style.backgroundColor = theme.loadingAnimationBackground;
        loaderContainerDiv.style.height = "100%";
        loaderContainerDiv.style.width = "100%";
        loaderContainerDiv.style.display = "flex";
        loaderContainerDiv.style.justifyContent = "center";
        loaderContainerDiv.style.alignItems = "center";
        const loaderText = document.createElement("div");
        loaderText.innerHTML = this.loadingText;
        loaderText.style.color = theme.loadingAnimationForeground;
        loaderText.style.fontFamily = "Arial";
//        loaderContainerDiv.appendChild(loaderText);
        domChartRoot.appendChild(loaderContainerDiv);
        return loaderContainerDiv;
    }
    removeChartLoader(domChartRoot, loaderElement) {
        domChartRoot.removeChild(loaderElement);
    }
}

export async function waitLoaderThemeing(divId) {

    // Ensure background almost transparent to show the image through
    // const theme = {... new SciChartJSLightTheme()};
    // theme.tickTextBrush = "White";
    // theme.sciChartBackground = "Transparent"
    // theme.loadingAnimationBackground = "#FF3333";
    // theme.loadingAnimationForeground = "#33FF33";

    const loader = new DefaultSciChartLoader();
    loader.removeChartLoader = () => {};

    const theme = {... new SciChartJSDarkv2Theme()};
    theme.loadingAnimationForeground = "#ff3333";
    theme.loadingAnimationBackground = "#33ff33";

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId,{ loader, theme });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
}

