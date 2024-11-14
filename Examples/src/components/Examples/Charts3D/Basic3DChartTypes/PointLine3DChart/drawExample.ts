import { Radix2FFT } from "../../../FeaturedApps/ScientificCharts/AudioAnalyzer/Radix2FFT";
import {
    CameraController,
    HeatmapLegend,
    MouseWheelZoomModifier3D,
    NumericAxis3D,
    OrbitModifier3D,
    parseColorToUIntArgb,
    PointLineRenderableSeries3D,
    ResetCamera3DModifier,
    SciChart3DSurface,
    TGradientStop,
    Vector3,
    XyzDataSeries3D,
} from "scichart";
import { appTheme } from "../../../theme";

type TMetadata = {
    vertexColor: number;
    pointScale: number;
};

// This function generates some spectral data for the waterfall chart
const createSpectralData = (n: number) => {
    const spectraSize = 1024;
    const timeData = new Array(spectraSize);

    // Generate some random data with spectral components
    for (let i = 0; i < spectraSize; i++) {
        timeData[i] =
            4.0 * Math.sin((2 * Math.PI * i) / (20 + n * 0.2)) +
            10 * Math.sin((2 * Math.PI * i) / (10 + n * 0.01)) +
            20 * Math.sin((2 * Math.PI * i) / (5 + n * -0.002)) +
            3.0 * Math.random();
    }

    // Do a fourier-transform on the data to get the frequency domain
    const transform = new Radix2FFT(spectraSize);
    const yValues = transform.run(timeData);
    // .slice(0, 300); // We only want the first N points just to make the example cleaner

    // This is just setting a floor to make the data cleaner for the example
    for (let i = 0; i < yValues.length; i++) {
        yValues[i] =
            yValues[i] < -30 || yValues[i] > -5 ? (yValues[i] < -30 ? -30 : Math.random() * 9 - 6) : yValues[i];
    }
    yValues[0] = -30;

    // we need x-values (sequential numbers) for the frequency data
    const xValues = yValues.map((value, index) => index);

    return { xValues, yValues };
};

// SCICHART CODE
export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    sciChart3DSurface.worldDimensions = new Vector3(300, 100, 300);
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-141.6, 310.29, 393.32),
        target: new Vector3(0, 50, 0),
    });

    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());
    sciChart3DSurface.chartModifiers.add(new ResetCamera3DModifier());

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Frequency (Hz)",
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        tickLabelsOffset: 20,
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Power (dB)",
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        tickLabelsOffset: 20,
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Time (s)",
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        tickLabelsOffset: 20,
    });

    for (let i = 0; i < 50; i++) {
        // Create some data for the example
        // xValues are frequency values (Hz)
        // yValues are heights or magnitude
        const { xValues, yValues } = createSpectralData(i);
        // zValues are the 3rd dimension where we will spread out our series in time
        const zValues = Array.from({ length: xValues.length }).map((_) => i * 2);

        // Metadata in scichart.js 3D controls color 3D line series. It can also hold additional optional properties
        // Below we format the data for yValues into metadata colour coded and scaled depending on the value
        const metadata = formatMetadata(yValues, [
            { offset: 1, color: appTheme.VividPink },
            { offset: 0.9, color: appTheme.VividOrange },
            { offset: 0.7, color: appTheme.MutedRed },
            { offset: 0.5, color: appTheme.VividGreen },
            { offset: 0.3, color: appTheme.VividSkyBlue },
            { offset: 0.2, color: appTheme.Indigo },
            { offset: 0, color: appTheme.DarkIndigo },
        ]);

        // Add a 3D Point-Line chart
        sciChart3DSurface.renderableSeries.add(
            new PointLineRenderableSeries3D(wasmContext, {
                dataSeries: new XyzDataSeries3D(wasmContext, {
                    xValues,
                    yValues,
                    zValues,
                    metadata,
                }),
                strokeThickness: 3,
                opacity: 0.5,
            })
        );
    }

    return { sciChartSurface: sciChart3DSurface, wasmContext };
};

function formatMetadata(valuesArray: number[], gradientStops: TGradientStop[]): TMetadata[] {
    const low = Math.min(...valuesArray);
    const high = Math.max(...valuesArray);

    const sGradientStops = gradientStops.sort((a, b) => (a.offset > b.offset ? 1 : -1));
    // Compute a scaling factor from 0...1 where values in valuesArray at the lower end correspond to 0 and
    // values at the higher end correspond to 1
    return valuesArray.map((x) => {
        // scale from 0..1 for the values
        const valueScale = (x - low) / (high - low);
        // Find the nearest gradient stop index
        const index = sGradientStops.findIndex((gs) => gs.offset >= valueScale);
        // const nextIndex = Math.min(index + 1, sGradientStops.length - 1);
        // work out the colour of this point
        const color1 = parseColorToUIntArgb(sGradientStops[index].color);
        // const color2 = parseColorToUIntArgb(sGradientStops[nextIndex].color);
        // const ratio = (valueScale - sGradientStops[index].offset) / (sGradientStops[nextIndex].offset - sGradientStops[index].offset)
        // const colorScale = uintArgbColorLerp(color1, color2, ratio)
        // console.log(`valueScale ${valueScale} low ${sGradientStops[index].offset} high ${sGradientStops[nextIndex].offset} ratio ${ratio}`);
        return { pointScale: 0.1 + valueScale, vertexColor: color1 };
    });
}

export const drawHeatmapLegend = async (rootElement: string | HTMLDivElement) => {
    const { heatmapLegend, wasmContext } = await HeatmapLegend.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            sciChartBackground: appTheme.DarkIndigo + "BB",
            loadingAnimationBackground: appTheme.DarkIndigo + "BB",
        },
        yAxisOptions: {
            isInnerAxis: true,
            labelStyle: {
                fontSize: 12,
                color: appTheme.ForegroundColor,
            },
            axisBorder: {
                borderRight: 1,
                color: appTheme.ForegroundColor + "77",
            },
            majorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 6,
                strokeThickness: 1,
            },
            minorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 3,
                strokeThickness: 1,
            },
        },
        colorMap: {
            minimum: -30,
            maximum: 0,
            gradientStops: [
                { offset: 1, color: appTheme.VividPink },
                { offset: 0.9, color: appTheme.VividOrange },
                { offset: 0.7, color: appTheme.MutedRed },
                { offset: 0.5, color: appTheme.VividGreen },
                { offset: 0.3, color: appTheme.VividSkyBlue },
                { offset: 0.15, color: appTheme.Indigo },
                { offset: 0, color: appTheme.DarkIndigo },
            ],
        },
    });

    heatmapLegend.innerSciChartSurface.sciChartSurface.title = "Power (dB)";
    heatmapLegend.innerSciChartSurface.sciChartSurface.padding.top = 0;
    heatmapLegend.innerSciChartSurface.sciChartSurface.titleStyle = { fontSize: 12, color: appTheme.ForegroundColor };

    return { sciChartSurface: heatmapLegend.innerSciChartSurface.sciChartSurface };
};
