import {
    CameraController,
    CubePointMarker3D,
    CylinderPointMarker3D,
    EAxisPlaneDrawLabelsMode,
    EAxisPlaneVisibilityMode,
    EllipsePointMarker3D,
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
    SeriesInfo3D,
    SpherePointMarker3D,
    TooltipModifier3D,
    TooltipSvgAnnotation3D,
    TrianglePointMarker3D,
    Vector3,
    XyzDataSeries3D,
    XyzSeriesInfo3D,
} from "scichart";

import { appTheme } from "../../../theme";
import { E3DLabelOrientationMode } from "scichart/types/TextStyle3D";

type TMarkerMetadata = {
    markerType: string;
    color: string;
    vertexColor: number;
    pointScale: number;
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    sciChart3DSurface.worldDimensions = new Vector3(300, 200, 300);

    const camera = sciChart3DSurface.camera;
    camera.position = new Vector3(-190.48, 272.08, -529.63);
    camera.target = new Vector3(0, 60, 0);

    // propertyChanged is raised each time any property changes on the camera
    // camera.propertyChanged.subscribe(args => {
    //     // Log current properties to console. debugOutput returns array of strings
    //     const cameraDebug = camera.debugOutput();

    //     // Output the same information to a div on the page
    //     // @ts-ignore
    //     console.log(cameraDebug.map(line => `<p>${line}</p>`).join(""));
    // });

    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());
    sciChart3DSurface.chartModifiers.add(new ResetCamera3DModifier());

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "X Axis",
        visibleRange: new NumberRange(25, 110),
        labelPrecision: 0,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        tickLabelsOffset: 10,
        labelOrientationMode: E3DLabelOrientationMode.Auto,
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y Axis",
        visibleRange: new NumberRange(0, 50000),
        labelPrecision: 0,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        tickLabelsOffset: 10,
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Z Axis",
        visibleRange: new NumberRange(1965, 2010),
        labelPrecision: 0,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        tickLabelsOffset: 10,
    });

    // sciChart3DSurface.xyAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.LocalX;
    // sciChart3DSurface.zyAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.Hidden;
    // sciChart3DSurface.zxAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.Both;

    // sciChart3DSurface.xyAxisPlane.visibilityMode = EAxisPlaneVisibilityMode.PositiveSide;
    // sciChart3DSurface.xyAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.LocalX;
    // sciChart3DSurface.xyAxisPlane.isVisible = false;
    // sciChart3DSurface.xyAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.Both

    const selectedPlaneColor = appTheme.MutedOrange + "cc";
    const unselectedPlaneColor = appTheme.DarkIndigo + "22";

    const getplane = (plane: string) => {
        if (plane === "xy") {
            return sciChart3DSurface.xyAxisPlane;
        }
        if (plane === "zy") {
            return sciChart3DSurface.zyAxisPlane;
        }
        return sciChart3DSurface.zxAxisPlane;
    };

    const setPlaneBackground = (plane: string) => {
        if (plane === "xy") {
            sciChart3DSurface.xAxis.axisBandsFill = selectedPlaneColor;
            sciChart3DSurface.yAxis.axisBandsFill = selectedPlaneColor;

            sciChart3DSurface.zAxis.axisBandsFill = unselectedPlaneColor;
        }

        if (plane === "zy") {
            sciChart3DSurface.yAxis.axisBandsFill = selectedPlaneColor;
            sciChart3DSurface.zAxis.axisBandsFill = selectedPlaneColor;

            sciChart3DSurface.xAxis.axisBandsFill = unselectedPlaneColor;
        }

        if (plane === "zx") {
            sciChart3DSurface.xAxis.axisBandsFill = selectedPlaneColor;
            sciChart3DSurface.zAxis.axisBandsFill = selectedPlaneColor;

            sciChart3DSurface.yAxis.axisBandsFill = unselectedPlaneColor;
        }
    };

    setPlaneBackground("zx");

    const setIsVisible = (plane: string, mode: string) => {
        getplane(plane).isVisible = mode === "true";
    };

    const setDrawLabelsMode = (plane: string, mode: EAxisPlaneDrawLabelsMode) => {
        getplane(plane).drawLabelsMode = mode;
    };

    const setDrawTitlesMode = (plane: string, mode: EAxisPlaneDrawLabelsMode) => {
        getplane(plane).drawTitlesMode = mode;
    };

    const setVisabilityMode = (plane: string, mode: string) => {
        if (mode === "auto") {
            getplane(plane).visibilityMode = EAxisPlaneVisibilityMode.Auto;
        }
        if (mode === "negativeSide") {
            getplane(plane).visibilityMode = EAxisPlaneVisibilityMode.NegativeSide;
        }
        if (mode === "positiveSide") {
            getplane(plane).visibilityMode = EAxisPlaneVisibilityMode.PositiveSide;
        }
    };

    const getAxis = (axis: "x" | "y" | "z") => {
        if (axis === "x") return sciChart3DSurface.xAxis;
        if (axis === "y") return sciChart3DSurface.yAxis;
        return sciChart3DSurface.zAxis;
    };

    const setTitleOffset = (offset: number, axis: "x" | "y" | "z") => {
        getAxis(axis).titleOffset = offset;
    };

    const setTickLabelsOffset = (offset: number, axis: "x" | "y" | "z") => {
        getAxis(axis).tickLabelsOffset = offset;
    };

    const setAxisLabelFontSize = (value: number, axis: "x" | "y" | "z") => {
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

    const renderableSeriesList: ScatterRenderableSeries3D[] = [];

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
            dataSeries: new XyzDataSeries3D(wasmContext),
            pointMarker: pointMarkers[i % pointMarkers.length],
        });

        // Add single data point to each series
        (renderableSeries.dataSeries as XyzDataSeries3D).append(
            lifeExpectancy[i],
            gdpPerCapita[i],
            year[i],
            metadata[i]
        );

        renderableSeriesList.push(renderableSeries);
        sciChart3DSurface.renderableSeries.add(renderableSeries);
    }

    // set orage color to selected (at start) x axis
    sciChart3DSurface.xAxis.titleStyle.color = appTheme.VividOrange;
    sciChart3DSurface.xAxis.labelStyle.color = appTheme.VividOrange;

    // update axis title color based on selected axis
    const updateAxisTitleColor = (axis?: "x" | "y" | "z") => {
        if (axis === "x" || !axis) {
            sciChart3DSurface.xAxis.titleStyle.color = appTheme.VividOrange;
            sciChart3DSurface.xAxis.labelStyle.color = appTheme.VividOrange;

            sciChart3DSurface.yAxis.titleStyle.color = "white";
            sciChart3DSurface.zAxis.titleStyle.color = "white";
            sciChart3DSurface.yAxis.labelStyle.color = "white";
            sciChart3DSurface.zAxis.labelStyle.color = "white";
        }
        if (axis === "y" || !axis) {
            sciChart3DSurface.yAxis.titleStyle.color = appTheme.VividOrange;
            sciChart3DSurface.yAxis.labelStyle.color = appTheme.VividOrange;

            sciChart3DSurface.xAxis.titleStyle.color = "white";
            sciChart3DSurface.zAxis.titleStyle.color = "white";
            sciChart3DSurface.xAxis.labelStyle.color = "white";
            sciChart3DSurface.zAxis.labelStyle.color = "white";
        }
        if (axis === "z" || !axis) {
            sciChart3DSurface.zAxis.titleStyle.color = appTheme.VividOrange;
            sciChart3DSurface.zAxis.labelStyle.color = appTheme.VividOrange;

            sciChart3DSurface.xAxis.titleStyle.color = "white";
            sciChart3DSurface.yAxis.titleStyle.color = "white";
            sciChart3DSurface.xAxis.labelStyle.color = "white";
            sciChart3DSurface.yAxis.labelStyle.color = "white";
        }
    };

    const enableGridBands = (enable: boolean, axis: "x" | "y" | "z") => {
        getAxis(axis).drawMajorBands = enable;
    };

    sciChart3DSurface.xAxis.majorGridLineStyle.color = "red";
    sciChart3DSurface.yAxis.majorGridLineStyle.color = "red";
    sciChart3DSurface.zAxis.majorGridLineStyle.color = "red";

    const enableMajorGridLines = (enable: boolean, axis: "x" | "y" | "z") => {
        getAxis(axis).drawMajorGridLines = enable;
    };

    const setLabelOrientationMode = (mode: E3DLabelOrientationMode, axis: "x" | "y" | "z") => {
        getAxis(axis).labelOrientationMode = mode;
    };

    const controls = {
        setTitleOffset,
        setTickLabelsOffset,
        enableGridBands,
        setAxisLabelFontSize,
        enableMajorGridLines,
        setLabelOrientationMode,
        updateAxisTitleColor,
        setVisabilityMode,
        setDrawTitlesMode,
        setDrawLabelsMode,
        setIsVisible,
        setPlaneBackground,
    };

    return { sciChartSurface: sciChart3DSurface, wasmContext, controls };
};
