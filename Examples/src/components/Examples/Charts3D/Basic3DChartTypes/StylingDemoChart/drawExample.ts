import {
    CameraController,
    CubePointMarker3D,
    CylinderPointMarker3D,
    MouseWheelZoomModifier3D,
    NumberRange,
    NumericAxis3D,
    OrbitModifier3D,
    parseColorToUIntArgb,
    PyramidPointMarker3D,
    ResetCamera3DModifier,
    ScatterRenderableSeries3D,
    SciChart3DSurface,
    SpherePointMarker3D,
    TGradientStop,
    Vector3,
    XyzDataSeries3D,
} from "scichart";
import { appTheme } from "../../../theme";

type TMetadata = {
    vertexColor: number;
    pointScale: number;
};

import {
    fetchPopulationDataData,
    TMappedPopulationData,
    TPopulationMetadata,
} from "../../../ExampleData/ExampleDataProvider";

export const fonts = [
    { name: "arial", url: "" },
    {
        name: "braahone",
        url: "https://raw.githubusercontent.com/google/fonts/main/ofl/braahone/BraahOne-Regular.ttf",
    },
    {
        name: "iceland",
        url: "https://raw.githubusercontent.com/google/fonts/main/ofl/iceland/Iceland-Regular.ttf",
    },
    { name: "antic", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/antic/Antic-Regular.ttf" },
    { name: "coda", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/coda/Coda-Regular.ttf" },
    { name: "forum", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/forum/Forum-Regular.ttf" },
    { name: "freeman", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/freeman/Freeman-Regular.ttf" },
    { name: "geo", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/geo/Geo-Regular.ttf" },
];

// SCICHART CODE
export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Register one font
    // await sciChart3DSurface.registerFont(
    //     "braahone",
    //     "https://raw.githubusercontent.com/google/fonts/main/ofl/braahone/BraahOne-Regular.ttf"
    // );

    // Register all fonts from "fonts" array in parallel
    await Promise.all(fonts.map((font) => sciChart3DSurface.registerFont(font.name, font.url)));

    sciChart3DSurface.worldDimensions = new Vector3(300, 100, 300);

    sciChart3DSurface.camera = new CameraController(wasmContext, {
        target: new Vector3(0, 50, 0),
    });

    const setCamera = (positionX: number) => {
        sciChart3DSurface.camera = new CameraController(wasmContext, {
            position: new Vector3(positionX, 310.29, 393.32),
        });
    };

    setCamera(-141.6);

    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());
    sciChart3DSurface.chartModifiers.add(new ResetCamera3DModifier());

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Life Expectancy",
        visibleRange: new NumberRange(30, 85),
        labelPrecision: 0,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        tickLabelsOffset: 20,
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Gdp Per Capita",
        visibleRange: new NumberRange(0, 50000),
        labelPrecision: 0,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        tickLabelsOffset: 20,
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Year",
        visibleRange: new NumberRange(1950, 2010),
        labelPrecision: 0,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        tickLabelsOffset: 20,
    });

    sciChart3DSurface.xAxis.backgroundColor = "red";
    // sciChart3DSurface.xAxis.planeBorderColor = "red";
    // sciChart3DSurface.xAxis.planeBorderThickness = 20;

    // title offset

    const setTitleOffset = (offset: number) => {
        sciChart3DSurface.xAxis.titleOffset = offset;
        sciChart3DSurface.yAxis.titleOffset = offset;
        sciChart3DSurface.zAxis.titleOffset = offset;
    };

    const setAxisLabelFontSize = (value: number) => {
        sciChart3DSurface.xAxis.labelStyle.fontSize = value;
        sciChart3DSurface.yAxis.labelStyle.fontSize = value;
        sciChart3DSurface.zAxis.labelStyle.fontSize = value;
    };

    const renderableSeries = new ScatterRenderableSeries3D(wasmContext, {
        // pointMarker: new CylinderPointMarker3D(wasmContext, { size: 10 }),
        opacity: 0.9,
        dataSeries: new XyzDataSeries3D(wasmContext),
    });

    const setPointMarker = (pointMarker: string) => {
        if (pointMarker === "CylinderPointMarker3D") {
            renderableSeries.pointMarker = new CylinderPointMarker3D(wasmContext, { size: 10 });
        } else if (pointMarker === "CubePointMarker3D") {
            renderableSeries.pointMarker = new CubePointMarker3D(wasmContext, { size: 10 });
        } else if (pointMarker === "PyramidPointMarker3D") {
            renderableSeries.pointMarker = new PyramidPointMarker3D(wasmContext, { size: 10 });
        } else if (pointMarker === "SpherePointMarker3D") {
            renderableSeries.pointMarker = new SpherePointMarker3D(wasmContext, { size: 10 });
        }
    };

    setPointMarker("SpherePointMarker3D");

    sciChart3DSurface.renderableSeries.add(renderableSeries);

    const { lifeExpectancy, gdpPerCapita, year, metadata } = await fetchPopulationDataData();

    (renderableSeries.dataSeries as XyzDataSeries3D).appendRange(lifeExpectancy, gdpPerCapita, year, metadata);

    const updateFont = (font: string) => {
        sciChart3DSurface.xAxis.labelStyle.fontFamily = font;
        sciChart3DSurface.yAxis.labelStyle.fontFamily = font;
        sciChart3DSurface.zAxis.labelStyle.fontFamily = font;
        // sciChart3DSurface.xAxis.axisTitleStyle.fontFamily = font;
        sciChart3DSurface.xAxis.titleStyle.fontFamily = font;
        sciChart3DSurface.yAxis.titleStyle.fontFamily = font;
        sciChart3DSurface.zAxis.titleStyle.fontFamily = font;

        // sciChart3DSurface.yAxis.axisTitleStyle // future update
    };

    sciChart3DSurface.xAxis.drawMajorBands = true;
    sciChart3DSurface.xAxis.axisBandsFill = "blue";

    sciChart3DSurface.yAxis.drawMajorBands = true;
    sciChart3DSurface.yAxis.axisBandsFill = "blue";

    const enableGridBands = (enable: boolean) => {
        sciChart3DSurface.xAxis.drawMajorBands = enable;
        sciChart3DSurface.yAxis.drawMajorBands = enable;
        sciChart3DSurface.zAxis.drawMajorBands = enable;
    };

    sciChart3DSurface.xAxis.majorGridLineStyle.color = "red";
    sciChart3DSurface.yAxis.majorGridLineStyle.color = "red";
    sciChart3DSurface.zAxis.majorGridLineStyle.color = "red";

    const enableMajorGridLines = (enable: boolean) => {
        sciChart3DSurface.xAxis.drawMajorGridLines = enable;
        sciChart3DSurface.yAxis.drawMajorGridLines = enable;
        sciChart3DSurface.zAxis.drawMajorGridLines = enable;
    };

    const controls = {
        setTitleOffset,
        setCamera,
        updateFont,
        enableGridBands,
        setAxisLabelFontSize,
        enableMajorGridLines,
        setPointMarker,
    };

    return { sciChartSurface: sciChart3DSurface, wasmContext, controls };
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
