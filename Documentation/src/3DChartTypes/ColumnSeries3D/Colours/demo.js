async function columnRenderableSeries3D(divElementId) {
    const {
        SciChart3DSurface,
        NumericAxis3D,
        Vector3,
        SciChartJsNavyTheme,
        ColumnRenderableSeries3D,
        CylinderPointMarker3D,
        MouseWheelZoomModifier3D,
        OrbitModifier3D,
        ResetCamera3DModifier,
        XyzDataSeries3D,
        parseColorToUIntArgb,
    } = SciChart;

    // or, for npm, import { SciChart3DSurface, ... } from "scichart"

    // #region ExampleA
    // Create a SciChart3DSurface in the host <div id=".." />
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(300, 200, 300),
        cameraOptions: {
            position: new Vector3(-270, 230, -160),
            target: new Vector3(0, 50, 0),
        },
    });

    // Declare your axis like this
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "X Axis",
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y Axis",
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Z Axis",
    });

    // Metadata colours are in ARGB format, e.g. 0xFFFF0000 is red, 0xFF00FF00 is green
    // The helper function parseColorToUIntArgb can be used to convert HTML colors to ARGB
    const htmlColors = [
        "#EC0F6C",
        "orange",
        "#67BDAF",
        "SteelBlue",
        "#14233C",
        "#67BDAF",
        "orange",
        "#F48420",
        "SteelBlue",
        "#EC0F6C",
        "#EC0F6C",
        "#67BDAF",
        "#67BDAF",
        "SteelBlue",
        "DarkBlue",
        "#F48420",
        "orange",
        "#67BDAF",
        "SteelBlue",
        "#67BDAF",
    ];

    // Declare a dataSeries with xValues, yValues (heights), zValues
    // Metadata can be any javascript object
    // metadata.vertexColor is the UINT ARGB color of the column
    const dataSeries = new XyzDataSeries3D(wasmContext, {
        xValues: [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4],
        yValues: [0, 1, 2, 3, 4, 3, 2, 4, 5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 4, 5],
        zValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        metadata: htmlColors.map((c) => ({ vertexColor: parseColorToUIntArgb(c) })),
    });

    sciChart3DSurface.renderableSeries.add(
        new ColumnRenderableSeries3D(wasmContext, {
            dataSeries,
            dataPointWidthX: 0.7,
            dataPointWidthZ: 0.7,
            // Per column coloring using metadata
            useMetadataColors: true,
            pointMarker: new CylinderPointMarker3D(wasmContext),
        })
    );
    // #endregion

    // Optional: add zooming, panning for the example
    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(), // provides camera zoom on mouse wheel
        new OrbitModifier3D(), // provides 3d rotation on left mouse drag
        new ResetCamera3DModifier() // resets camera position on double-click
    );
}

columnRenderableSeries3D("scichart-root");
