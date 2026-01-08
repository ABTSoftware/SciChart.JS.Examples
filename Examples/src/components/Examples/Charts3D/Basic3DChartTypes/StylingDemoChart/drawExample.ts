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

    // Register one font
    // await sciChart3DSurface.registerFont(
    //     "braahone",
    //     "https://raw.githubusercontent.com/google/fonts/main/ofl/braahone/BraahOne-Regular.ttf"
    // );

    // Register all fonts from "fonts" array in parallel
    await Promise.all(fonts.map((font) => sciChart3DSurface.registerFont(font.name, font.url)));

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

    sciChart3DSurface.xAxis.drawMajorBands = true;
    sciChart3DSurface.xAxis.axisBandsFill = appTheme.MutedOrange + "cc";

    sciChart3DSurface.yAxis.drawMajorBands = true;
    sciChart3DSurface.yAxis.axisBandsFill = appTheme.MutedOrange + "cc";

    sciChart3DSurface.zAxis.drawMajorBands = true;
    sciChart3DSurface.zAxis.axisBandsFill = appTheme.MutedBlue + "cc";

    const setPlaneBackground = (plane: string) => {
        sciChart3DSurface.xAxis.axisBandsFill = appTheme.MutedBlue + "cc";
        sciChart3DSurface.yAxis.axisBandsFill = appTheme.MutedBlue + "cc";
        sciChart3DSurface.zAxis.axisBandsFill = appTheme.MutedBlue + "cc";

        if (plane === "xy") {
            sciChart3DSurface.xAxis.axisBandsFill = appTheme.MutedOrange + "cc";
            sciChart3DSurface.yAxis.axisBandsFill = appTheme.MutedOrange + "cc";
        }

        if (plane === "zy") {
            sciChart3DSurface.yAxis.axisBandsFill = appTheme.MutedOrange + "cc";
            sciChart3DSurface.zAxis.axisBandsFill = appTheme.MutedOrange + "cc";
        }

        if (plane === "zx") {
            sciChart3DSurface.xAxis.axisBandsFill = appTheme.MutedOrange + "cc";
            sciChart3DSurface.zAxis.axisBandsFill = appTheme.MutedOrange + "cc";
        }
    };

    const setIsVisible = (plane: string, mode: string) => {
        if (plane === "xy") {
            if (mode === "true") {
                sciChart3DSurface.xyAxisPlane.isVisible = true;
            }
            if (mode === "false") {
                sciChart3DSurface.xyAxisPlane.isVisible = false;
            }
        }

        if (plane === "zy") {
            if (mode === "true") {
                sciChart3DSurface.zyAxisPlane.isVisible = true;
            }
            if (mode === "false") {
                sciChart3DSurface.zyAxisPlane.isVisible = false;
            }
        }

        if (plane === "zx") {
            if (mode === "true") {
                sciChart3DSurface.zxAxisPlane.isVisible = true;
            }
            if (mode === "false") {
                sciChart3DSurface.zxAxisPlane.isVisible = false;
            }
        }
    };

    const setDrawLabelsMode = (plane: string, mode: string) => {
        if (plane === "xy") {
            if (mode === "both") {
                sciChart3DSurface.xyAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.Both;
            }
            if (mode === "hidden") {
                sciChart3DSurface.xyAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.Hidden;
            }
            if (mode === "localx") {
                sciChart3DSurface.xyAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.LocalX;
            }
            if (mode === "localy") {
                sciChart3DSurface.xyAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.LocalY;
            }
        }

        if (plane === "zy") {
            if (mode === "both") {
                sciChart3DSurface.zyAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.Both;
            }
            if (mode === "hidden") {
                sciChart3DSurface.zyAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.Hidden;
            }
            if (mode === "localx") {
                sciChart3DSurface.zyAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.LocalX;
            }
            if (mode === "localy") {
                sciChart3DSurface.zyAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.LocalY;
            }
        }

        if (plane === "zx") {
            if (mode === "both") {
                sciChart3DSurface.zxAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.Both;
            }
            if (mode === "hidden") {
                sciChart3DSurface.zxAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.Hidden;
            }
            if (mode === "localx") {
                sciChart3DSurface.zxAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.LocalX;
            }
            if (mode === "localy") {
                sciChart3DSurface.zxAxisPlane.drawLabelsMode = EAxisPlaneDrawLabelsMode.LocalY;
            }
        }
    };

    const setDrawTitlesMode = (plane: string, mode: string) => {
        if (plane === "xy") {
            if (mode === "both") {
                sciChart3DSurface.xyAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.Both;
            }
            if (mode === "hidden") {
                sciChart3DSurface.xyAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.Hidden;
            }
            if (mode === "localx") {
                sciChart3DSurface.xyAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.LocalX;
            }
            if (mode === "localy") {
                sciChart3DSurface.xyAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.LocalY;
            }
        }

        if (plane === "zy") {
            if (mode === "both") {
                sciChart3DSurface.zyAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.Both;
            }
            if (mode === "hidden") {
                sciChart3DSurface.zyAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.Hidden;
            }
            if (mode === "localx") {
                sciChart3DSurface.zyAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.LocalX;
            }
            if (mode === "localy") {
                sciChart3DSurface.zyAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.LocalY;
            }
        }

        if (plane === "zx") {
            if (mode === "both") {
                sciChart3DSurface.zxAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.Both;
            }
            if (mode === "hidden") {
                sciChart3DSurface.zxAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.Hidden;
            }
            if (mode === "localx") {
                sciChart3DSurface.zxAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.LocalX;
            }
            if (mode === "localy") {
                sciChart3DSurface.zxAxisPlane.drawTitlesMode = EAxisPlaneDrawLabelsMode.LocalY;
            }
        }
    };

    const setVisabilityMode = (plane: string, mode: string) => {
        if (plane === "xy") {
            if (mode === "auto") {
                sciChart3DSurface.xyAxisPlane.visibilityMode = EAxisPlaneVisibilityMode.Auto;
            }
            if (mode === "negativeSide") {
                sciChart3DSurface.xyAxisPlane.visibilityMode = EAxisPlaneVisibilityMode.NegativeSide;
            }
            if (mode === "positiveSide") {
                sciChart3DSurface.xyAxisPlane.visibilityMode = EAxisPlaneVisibilityMode.PositiveSide;
            }
        }

        if (plane === "zy") {
            if (mode === "auto") {
                sciChart3DSurface.zyAxisPlane.visibilityMode = EAxisPlaneVisibilityMode.Auto;
            }
            if (mode === "negativeSide") {
                sciChart3DSurface.zyAxisPlane.visibilityMode = EAxisPlaneVisibilityMode.NegativeSide;
            }
            if (mode === "positiveSide") {
                sciChart3DSurface.zyAxisPlane.visibilityMode = EAxisPlaneVisibilityMode.PositiveSide;
            }
        }

        if (plane === "zx") {
            if (mode === "auto") {
                sciChart3DSurface.zxAxisPlane.visibilityMode = EAxisPlaneVisibilityMode.Auto;
            }
            if (mode === "negativeSide") {
                sciChart3DSurface.zxAxisPlane.visibilityMode = EAxisPlaneVisibilityMode.NegativeSide;
            }
            if (mode === "positiveSide") {
                sciChart3DSurface.zxAxisPlane.visibilityMode = EAxisPlaneVisibilityMode.PositiveSide;
            }
        }
    };

    // Doesn't work??
    // sciChart3DSurface.xAxis.axisPlaneBackgroundFill = "red";

    sciChart3DSurface.xAxis.planeBorderColor = "red";
    sciChart3DSurface.xAxis.planeBorderThickness = 20;

    // title offset

    const setTitleOffset = (offset: number, axis?: "x" | "y" | "z") => {
        if (axis === "x" || !axis) sciChart3DSurface.xAxis.titleOffset = offset;
        if (axis === "y" || !axis) sciChart3DSurface.yAxis.titleOffset = offset;
        if (axis === "z" || !axis) sciChart3DSurface.zAxis.titleOffset = offset;
    };

    const setTickLabelsOffset = (offset: number, axis?: "x" | "y" | "z") => {
        if (axis === "x" || !axis) sciChart3DSurface.xAxis.tickLabelsOffset = offset;
        if (axis === "y" || !axis) sciChart3DSurface.yAxis.tickLabelsOffset = offset;
        if (axis === "z" || !axis) sciChart3DSurface.zAxis.tickLabelsOffset = offset;
    };

    const setAxisLabelFontSize = (value: number, axis?: "x" | "y" | "z") => {
        if (axis === "x" || !axis) sciChart3DSurface.xAxis.labelStyle.fontSize = value;
        if (axis === "y" || !axis) sciChart3DSurface.yAxis.labelStyle.fontSize = value;
        if (axis === "z" || !axis) sciChart3DSurface.zAxis.labelStyle.fontSize = value;
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

    // update axis title color based on selected axis
    const updateAxisTitleColor = (axis?: "x" | "y" | "z") => {
        sciChart3DSurface.xAxis.titleStyle.color = "white";
        sciChart3DSurface.yAxis.titleStyle.color = "white";
        sciChart3DSurface.zAxis.titleStyle.color = "white";

        if (axis === "x" || !axis) {
            sciChart3DSurface.xAxis.titleStyle.color = appTheme.VividOrange;
        }
        if (axis === "y" || !axis) {
            sciChart3DSurface.yAxis.titleStyle.color = appTheme.VividOrange;
        }
        if (axis === "z" || !axis) {
            sciChart3DSurface.zAxis.titleStyle.color = appTheme.VividOrange;
        }
    };

    const updateFont = (font: string, axis?: "x" | "y" | "z") => {
        if (axis === "x" || !axis) {
            sciChart3DSurface.xAxis.labelStyle.fontFamily = font;
            sciChart3DSurface.xAxis.titleStyle.fontFamily = font;
        }
        if (axis === "y" || !axis) {
            sciChart3DSurface.yAxis.labelStyle.fontFamily = font;
            sciChart3DSurface.yAxis.titleStyle.fontFamily = font;
        }
        if (axis === "z" || !axis) {
            sciChart3DSurface.zAxis.labelStyle.fontFamily = font;
            sciChart3DSurface.zAxis.titleStyle.fontFamily = font;
        }

        // sciChart3DSurface.yAxis.axisTitleStyle // future update
    };

    const enableGridBands = (enable: boolean, axis?: "x" | "y" | "z") => {
        if (axis === "x" || !axis) sciChart3DSurface.xAxis.drawMajorBands = enable;
        if (axis === "y" || !axis) sciChart3DSurface.yAxis.drawMajorBands = enable;
        if (axis === "z" || !axis) sciChart3DSurface.zAxis.drawMajorBands = enable;
    };

    sciChart3DSurface.xAxis.majorGridLineStyle.color = "red";
    sciChart3DSurface.yAxis.majorGridLineStyle.color = "red";
    sciChart3DSurface.zAxis.majorGridLineStyle.color = "red";

    const enableMajorGridLines = (enable: boolean, axis?: "x" | "y" | "z") => {
        if (axis === "x" || !axis) sciChart3DSurface.xAxis.drawMajorGridLines = enable;
        if (axis === "y" || !axis) sciChart3DSurface.yAxis.drawMajorGridLines = enable;
        if (axis === "z" || !axis) sciChart3DSurface.zAxis.drawMajorGridLines = enable;
    };

    const setLabelOrientationMode = (mode: E3DLabelOrientationMode, axis?: "x" | "y" | "z") => {
        if (axis === "x" || !axis) sciChart3DSurface.xAxis.labelOrientationMode = mode;
        if (axis === "y" || !axis) sciChart3DSurface.yAxis.labelOrientationMode = mode;
        if (axis === "z" || !axis) sciChart3DSurface.zAxis.labelOrientationMode = mode;
    };

    const controls = {
        setTitleOffset,
        setTickLabelsOffset,
        updateFont,
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
