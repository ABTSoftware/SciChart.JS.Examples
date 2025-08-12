import * as SciChart from "scichart";

async function metadataHitTest(divElementId) {
    // Demonstrates how to add PointMetadata to a DataSeries and consume it in SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        EllipsePointMarker,
        NumberRange,
        DpiHelper
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    // #region ExampleA
    // Create metadata with initial values. Metadata can be any JS object
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5],
        yValues: [4.3, 5.3, 6, 6.3, 6.4],
        metadata: [
            { stringValue: "Here's", customValue: 7 },
            { stringValue: "Some", customValue: 7 },
            { stringValue: "Metadata" },
            { stringValue: "With", customValue: 99 },
            { stringValue: "Hit-Test" }
        ]
    });

    // Add a line series with the metadata
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 11,
                height: 11,
                fill: "#364BA0",
                stroke: "#50C7E0",
                strokeThickness: 2
            })
        })
    );

    // Perform a hit-test operation using mousedown event on the SciChartSurface <div>
    sciChartSurface.domCanvas2D.addEventListener("mousedown", mouseEvent => {
        const mouseClickX = mouseEvent.offsetX;
        const mouseClickY = mouseEvent.offsetY;
        console.log("mouseClickX", mouseClickX, "mouseClickY", mouseClickY);

        // DpiHelper is a helper class in SciChart.js which allows you to adjust screen coordinates for browser zoom, retina and high-dpi screens
        const premultipliedX = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
        const premultipliedY = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;
        console.log("premultipliedX", premultipliedX, "premultipliedY", premultipliedY);

        const HIT_TEST_RADIUS = 10;

        // Perform a hit-test. Find out the members of HitTestInfo at https://www.scichart.com/documentation/js/current/typedoc/classes/hittestinfo.html
        const hitTestInfo = sciChartSurface.renderableSeries
            .get(0)
            .hitTestProvider.hitTest(premultipliedX, premultipliedY, HIT_TEST_RADIUS);
        const resultDiv = document.getElementById("debug-hittest");
        resultDiv.innerHTML =
            `<p>Hit-test at x,y = ${mouseClickX}, ${mouseClickY}</p>` + `<p>isHit = ${hitTestInfo.isHit}</p>`;
        if (hitTestInfo.isHit) {
            resultDiv.innerHTML +=
                `<p>index = ${hitTestInfo.dataSeriesIndex}</p>` +
                `<p>xValue = ${hitTestInfo.xValue}</p>` +
                `<p>yValue = ${hitTestInfo.yValue}</p>` +
                `<p>Metadata.stringValue = ${hitTestInfo.metadata?.stringValue ?? "null"}</p>` +
                `<p>Metadata.customValue = ${hitTestInfo.metadata?.customValue ?? "null"}</p>`;
        }

        console.log("hitTestInfo", hitTestInfo);
    });
    // #endregion

    const { TextAnnotation, EHorizontalAnchorPoint, ECoordinateMode, EAnnotationLayer } = SciChart;
    const options = {
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 0.5,
        y1: 0.5,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        opacity: 0.33,
        textColor: "White"
    };
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Metadata Hit-Test Example",
            fontSize: 36,
            yCoordShift: -125,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Click chart data-points to extract metadata",
            fontSize: 20,
            yCoordShift: -75,
            ...options
        })
    );
}

metadataHitTest("scichart-root");
