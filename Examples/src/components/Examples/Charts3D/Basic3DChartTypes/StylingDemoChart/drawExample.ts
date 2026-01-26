import {
    CubePointMarker3D,
    CylinderPointMarker3D,
    EAxisPlaneDrawLabelsMode,
    EAxisPlaneVisibilityMode,
    EllipsePointMarker3D,
    EThemeProviderType,
    MouseWheelZoomModifier3D,
    NumberRange,
    NumericAxis3D,
    OrbitModifier3D,
    PixelPointMarker3D,
    PyramidPointMarker3D,
    QuadPointMarker,
    ResetCamera3DModifier,
    ScatterRenderableSeries3D,
    SciChart3DSurface,
    SciChartJSDarkTheme,
    SciChartJSDarkv2Theme,
    SciChartJSLightTheme,
    SciChartJsNavyTheme,
    SpherePointMarker3D,
    TrianglePointMarker3D,
    Vector3,
    XyzDataSeries3D,
} from "scichart";

import { appTheme } from "../../../theme";
import { E3DLabelOrientationMode } from "scichart/types/TextStyle3D";

export type TAxis = "x" | "y" | "z";
export type TSelectedAxisPlane = "xy" | "zy" | "zx" | "none";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        worldDimensions: new Vector3(300, 200, 300),
    });
    sciChart3DSurface.camera.position = new Vector3(-190.48, 272.08, -429.63);
    sciChart3DSurface.camera.target = new Vector3(0, 60, 0);

    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(),
        new OrbitModifier3D(),
        new ResetCamera3DModifier()
    );

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "X Axis",
        visibleRange: new NumberRange(25, 110),
        labelPrecision: 0,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        axisBandsFill: appTheme.DarkIndigo + "44",
        tickLabelsOffset: 10,
        majorGridLineStyle: { color: "#5588AA" },
        minorGridLineStyle: { color: "#225588" },
        labelOrientationMode: E3DLabelOrientationMode.Auto,
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y Axis",
        visibleRange: new NumberRange(0, 50000),
        labelPrecision: 0,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        axisBandsFill: appTheme.DarkIndigo + "44",
        tickLabelsOffset: 10,
        majorGridLineStyle: { color: "#5588AA" },
        minorGridLineStyle: { color: "#225588" },
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Z Axis",
        visibleRange: new NumberRange(1965, 2010),
        labelPrecision: 0,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        axisBandsFill: appTheme.DarkIndigo + "44",
        tickLabelsOffset: 10,
        majorGridLineStyle: { color: "#5588AA" },
        minorGridLineStyle: { color: "#225588" },
    });

    // Utils to get/set axis settings
    const getPlane = (plane: TSelectedAxisPlane) => {
        switch (plane) {
            case "xy": return sciChart3DSurface.xyAxisPlane;
            case "zy": return sciChart3DSurface.zyAxisPlane;
            case "zx": return sciChart3DSurface.zxAxisPlane;
            default: return null; 
        }
    };
    
    const setPlaneBackground = (plane: TSelectedAxisPlane) => {
        sciChart3DSurface.xAxis.axisPlaneBackgroundFill = "transparent";
        sciChart3DSurface.yAxis.axisPlaneBackgroundFill = "transparent";
        sciChart3DSurface.zAxis.axisPlaneBackgroundFill = "transparent";
        const unselectedPlaneColor = "#44444466";
        if (plane === "xy") {
            sciChart3DSurface.zAxis.axisPlaneBackgroundFill = unselectedPlaneColor;
        }
        else if (plane === "zy") {
            sciChart3DSurface.xAxis.axisPlaneBackgroundFill = unselectedPlaneColor;
        }
        else if (plane === "zx") {
            sciChart3DSurface.yAxis.axisPlaneBackgroundFill = unselectedPlaneColor;
        }
    };
    setPlaneBackground("none"); // init - does nothing with "none" but it's kept for clarity

    const setIsPlaneVisible = (plane: TSelectedAxisPlane, mode: string) => {
        getPlane(plane).isVisible = mode === "true";
    };

    const setDrawLabelsMode = (plane: TSelectedAxisPlane, mode: EAxisPlaneDrawLabelsMode) => {
        getPlane(plane).drawLabelsMode = mode;
    };

    const setDrawTitlesMode = (plane: TSelectedAxisPlane, mode: EAxisPlaneDrawLabelsMode) => {
        getPlane(plane).drawTitlesMode = mode;
    };

    const setVisibilityMode = (plane: TSelectedAxisPlane, mode: string) => {
        if (mode === "auto") {
            getPlane(plane).visibilityMode = EAxisPlaneVisibilityMode.Auto;
        }
        if (mode === "negativeSide") {
            getPlane(plane).visibilityMode = EAxisPlaneVisibilityMode.NegativeSide;
        }
        if (mode === "positiveSide") {
            getPlane(plane).visibilityMode = EAxisPlaneVisibilityMode.PositiveSide;
        }
    };

    const getAxis = (axis: TAxis) => {
        if (axis === "x") return sciChart3DSurface.xAxis;
        if (axis === "y") return sciChart3DSurface.yAxis;
        return sciChart3DSurface.zAxis;
    };

    const setTitleOffset = (offset: number, axis: TAxis) => {
        getAxis(axis).titleOffset = offset;
    };

    const setTickLabelsOffset = (offset: number, axis: TAxis) => {
        getAxis(axis).tickLabelsOffset = offset;
    };

    const setAxisLabelFontSize = (value: number, axis: TAxis) => {
        getAxis(axis).labelStyle.fontSize = value;
    };

    // Create different point markers for each data point
    const pointMarkers = [
        new EllipsePointMarker3D(wasmContext, { size: 10 }),
        new TrianglePointMarker3D(wasmContext, { size: 10 }),
        new PixelPointMarker3D(wasmContext, { size: 10 }),
        new QuadPointMarker(wasmContext, { size: 10 }),
        new SpherePointMarker3D(wasmContext, { size: 10 }),
        new CubePointMarker3D(wasmContext, { size: 10 }),
        new CylinderPointMarker3D(wasmContext, { size: 10 }),
        new PyramidPointMarker3D(wasmContext, { size: 10 }),
    ];

    const lifeExpectancy = [30, 40, 50, 60, 70, 80, 90, 100];
    const gdpPerCapita = [5000, 10_000, 15_000, 20_000, 25_000, 30_000, 35_000, 40_000];
    const year = [1972, 1977, 1982, 1987, 1992, 1997, 2002, 2007];

    const metadata = [
        { markerType: "EllipsePointMarker3D", pointScale: 1, vertexColor: 4284988847, color: "#67BDAF" },
        { markerType: "TrianglePointMarker3D", pointScale: 1, vertexColor: 4292639081, color: "#DC7969" },
        { markerType: "PixelPointMarker3D", pointScale: 1, vertexColor: 4278255615, color: "#FF6B35" },
        { markerType: "QuadPointMarker", pointScale: 1, vertexColor: 4294934352, color: "#F7931E" },
        { markerType: "SpherePointMarker3D", pointScale: 2, vertexColor: 4294967040, color: "#FFD23F" },
        { markerType: "CubePointMarker3D", pointScale: 2, vertexColor: 4278255360, color: "#6BCF7F" },
        { markerType: "CylinderPointMarker3D", pointScale: 2, vertexColor: 4278190335, color: "#4D96FF" },
        { markerType: "PyramidPointMarker3D", pointScale: 2, vertexColor: 4286578816, color: "#9B59B6" },
    ];

    // Create individual series for each data point with different markers
    for (let i = 0; i < lifeExpectancy.length; i++) {
        const renderableSeries = new ScatterRenderableSeries3D(wasmContext, {
            opacity: 0.9,
            dataSeries: new XyzDataSeries3D(wasmContext, {
                xValues: [lifeExpectancy[i]],
                yValues: [gdpPerCapita[i]],
                zValues: [year[i]],
                metadata: [metadata[i]],
            }),
            pointMarker: pointMarkers[i % pointMarkers.length],
        });

        sciChart3DSurface.renderableSeries.add(renderableSeries);
    }

    // update axis title color based on selected axis
    const updateAxisTitleColor = (axis?: TAxis) => {
        const SELECTED_AXIS_COLOR = (currentTheme === EThemeProviderType.Light) ? "#000000" : "#FFFFFF";        
        const UNSELECTED_AXIS_COLOR = "#777777"
        if (axis === "x" || !axis) {
            sciChart3DSurface.xAxis.titleStyle.color = SELECTED_AXIS_COLOR;
            sciChart3DSurface.xAxis.labelStyle.color = SELECTED_AXIS_COLOR;

            sciChart3DSurface.yAxis.titleStyle.color = UNSELECTED_AXIS_COLOR
            sciChart3DSurface.zAxis.titleStyle.color = UNSELECTED_AXIS_COLOR
            sciChart3DSurface.yAxis.labelStyle.color = UNSELECTED_AXIS_COLOR
            sciChart3DSurface.zAxis.labelStyle.color = UNSELECTED_AXIS_COLOR
        }
        if (axis === "y" || !axis) {
            sciChart3DSurface.yAxis.titleStyle.color = SELECTED_AXIS_COLOR;
            sciChart3DSurface.yAxis.labelStyle.color = SELECTED_AXIS_COLOR;

            sciChart3DSurface.xAxis.titleStyle.color = UNSELECTED_AXIS_COLOR;
            sciChart3DSurface.zAxis.titleStyle.color = UNSELECTED_AXIS_COLOR;
            sciChart3DSurface.xAxis.labelStyle.color = UNSELECTED_AXIS_COLOR;
            sciChart3DSurface.zAxis.labelStyle.color = UNSELECTED_AXIS_COLOR;
        }
        if (axis === "z" || !axis) {
            sciChart3DSurface.zAxis.titleStyle.color = SELECTED_AXIS_COLOR;
            sciChart3DSurface.zAxis.labelStyle.color = SELECTED_AXIS_COLOR;

            sciChart3DSurface.xAxis.titleStyle.color = UNSELECTED_AXIS_COLOR;
            sciChart3DSurface.yAxis.titleStyle.color = UNSELECTED_AXIS_COLOR;
            sciChart3DSurface.xAxis.labelStyle.color = UNSELECTED_AXIS_COLOR;
            sciChart3DSurface.yAxis.labelStyle.color = UNSELECTED_AXIS_COLOR;
        }
    };
    updateAxisTitleColor("x");

    const enableGridBands = (enable: boolean, axis: TAxis) => {
        getAxis(axis).drawMajorBands = enable;
    };

    const enableMajorGridLines = (enable: boolean, axis: TAxis) => {
        getAxis(axis).drawMajorGridLines = enable;
    };
    const enableMinorGridLines = (enable: boolean, axis: TAxis) => {
        getAxis(axis).drawMinorGridLines = enable;
    };

    const setLabelOrientationMode = (mode: E3DLabelOrientationMode, axis: TAxis) => {
        getAxis(axis).labelOrientationMode = mode;
    };

    let currentTheme: EThemeProviderType = EThemeProviderType.Navy;
    const lightTheme = new SciChartJSLightTheme();
    const darkTheme = new SciChartJSDarkTheme();
    const darkThemeV2 = new SciChartJSDarkv2Theme();
    const navyTheme = new SciChartJsNavyTheme();

    const setTheme = (themeName: EThemeProviderType) => {
        switch (themeName) {
            case EThemeProviderType.Light:
                sciChart3DSurface.applyTheme(lightTheme);
                currentTheme = EThemeProviderType.Light;
                break;
            case EThemeProviderType.Dark:
                sciChart3DSurface.applyTheme(darkTheme);
                currentTheme = EThemeProviderType.Dark;
                break;
            case EThemeProviderType.DarkV2:
                sciChart3DSurface.applyTheme(darkThemeV2);
                currentTheme = EThemeProviderType.DarkV2;
                break;
            case EThemeProviderType.Navy:
            default:
                sciChart3DSurface.applyTheme(navyTheme);
                currentTheme = EThemeProviderType.Navy;
                break;
        }
        updateAxisTitleColor();
    }

    const setAxisBandsFill = (color: string, axis: TAxis) => {
        getAxis(axis).axisBandsFill = color;
    };

    const setMajorGridLineColor = (color: string, axis: TAxis) => {
        getAxis(axis).majorGridLineStyle = { color };
    };

    const setMinorGridLineColor = (color: string, axis: TAxis) => {
        getAxis(axis).minorGridLineStyle = { color };
    };

    const controls = {
        setTheme,
        setTitleOffset,
        setTickLabelsOffset,
        enableGridBands,
        setAxisLabelFontSize,
        enableMajorGridLines,
        enableMinorGridLines,
        setLabelOrientationMode,
        updateAxisTitleColor,
        setVisibilityMode,
        setDrawTitlesMode,
        setDrawLabelsMode,
        setIsPlaneVisible,
        setPlaneBackground,
        setAxisBandsFill,
        setMajorGridLineColor,
        setMinorGridLineColor,
    };

    return { sciChartSurface: sciChart3DSurface, wasmContext, controls };
};
