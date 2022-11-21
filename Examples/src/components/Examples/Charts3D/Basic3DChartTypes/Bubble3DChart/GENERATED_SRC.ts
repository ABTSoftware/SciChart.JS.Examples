export const code = `import * as React from "react";
import { CameraController } from "scichart/Charting3D/CameraController";
import { MouseWheelZoomModifier3D } from "scichart/Charting3D/ChartModifiers/MouseWheelZoomModifier3D";
import { OrbitModifier3D } from "scichart/Charting3D/ChartModifiers/OrbitModifier3D";
import { XyzDataSeries3D } from "scichart/Charting3D/Model/DataSeries/XyzDataSeries3D";
import { Vector3 } from "scichart/Charting3D/Vector3";
import { NumericAxis3D } from "scichart/Charting3D/Visuals/Axis/NumericAxis3D";
import { SpherePointMarker3D } from "scichart/Charting3D/Visuals/PointMarkers/DefaultPointMarkers";
import { ScatterRenderableSeries3D } from "scichart/Charting3D/Visuals/RenderableSeries/ScatterRenderableSeries3D";
import { SciChart3DSurface } from "scichart/Charting3D/Visuals/SciChart3DSurface";
import classes from "../../../../Examples/Examples.module.scss";
import {appTheme} from "../../../theme";
import {ResetCamera3DModifier} from "scichart/Charting3D/ChartModifiers/ResetCamera3DModifier";
import {populationData} from "./data/PopulationData";
import {TGradientStop} from "scichart/types/TGradientStop";
import {NumberRange} from "scichart/Core/NumberRange";
import {parseColorToUIntArgb} from "scichart/utils/parseColor";

const divElementId = "chart";

type TMetadata = {
    vertexColorAbgr: number;
    pointScale: number;
};

// SCICHART CODE
const drawExample = async () => {

    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(divElementId, { theme: appTheme.SciChartJsTheme });
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-141.60, 310.29, 393.32),
        target: new Vector3(0, 50, 0),
    });

    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());
    sciChart3DSurface.chartModifiers.add(new ResetCamera3DModifier());

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "Life Expectancy", visibleRange: new NumberRange(40, 85) });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Gdp Per Capita", visibleRange: new NumberRange(0, 50000) });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Year",
        visibleRange: new NumberRange(1950, 2010)
    });

    // Population dataset from gapminderdata
    // data format example = [
    //    { country: "Afghanistan", year: 1952, population: 8425333, continent: "Asia", lifeExpectancy: 28.801, gdpPerCapita: 779.4453145 },
    // ]
    const year = populationData.map(item => item.year);
    const population = populationData.map(item => item.population);
    const lifeExpectancy = populationData.map(item => item.lifeExpectancy);
    const gdpPerCapita = populationData.map(item => item.gdpPerCapita);

    // Metadata in scichart.js 3D controls color and scale of a bubble. It can also hold additional optional properties
    // Below we format the data for lifeExpectancy into metadata colour coded and scaled depending on the value
    const metadata = formatMetadata(lifeExpectancy,  [
        {offset: 1, color: appTheme.VividPink},
        {offset: 0.9, color: appTheme.VividOrange},
        {offset: 0.7, color: appTheme.MutedRed},
        {offset: 0.5, color: appTheme.VividGreen},
        {offset: 0.3, color: appTheme.VividSkyBlue},
        {offset: 0.2, color: appTheme.Indigo},
        {offset: 0, color: appTheme.DarkIndigo}
    ]);

    sciChart3DSurface.renderableSeries.add(new ScatterRenderableSeries3D(wasmContext, {
        dataSeries: new XyzDataSeries3D(wasmContext, { xValues: lifeExpectancy, yValues: gdpPerCapita, zValues: year, metadata }),
        pointMarker: new SpherePointMarker3D(wasmContext, { size: 10 }),
        opacity: 0.9
    }));

    return { sciChart3DSurface, wasmContext };
};

function formatMetadata(valuesArray: number[], gradientStops: TGradientStop[]): TMetadata[] {
    const low = Math.min(...valuesArray);
    const high = Math.max(...valuesArray);

    const sGradientStops = gradientStops.sort((a, b) => a.offset > b.offset ? 1 : -1);
    // Compute a scaling factor from 0...1 where values in valuesArray at the lower end correspond to 0 and
    // values at the higher end correspond to 1
    return valuesArray.map(x => {
        // scale from 0..1 for the values
        const valueScale = (x - low)/(high-low);
        // Find the nearest gradient stop index
        const index = sGradientStops.findIndex(gs => gs.offset >= valueScale);
        // const nextIndex = Math.min(index + 1, sGradientStops.length - 1);
        // work out the colour of this point
        const color1 = parseColorToUIntArgb(sGradientStops[index].color);
        // const color2 = parseColorToUIntArgb(sGradientStops[nextIndex].color);
        // const ratio = (valueScale - sGradientStops[index].offset) / (sGradientStops[nextIndex].offset - sGradientStops[index].offset)
        // const colorScale = uintArgbColorLerp(color1, color2, ratio)
        // console.log(\`valueScale \${valueScale} low \${sGradientStops[index].offset} high \${sGradientStops[nextIndex].offset} ratio \${ratio}\`);
        return { pointScale: 0.1 + valueScale, vertexColorAbgr: color1 };
    });
}

// REACT COMPONENT
export default function Bubble3DChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChart3DSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChart3DSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
`;