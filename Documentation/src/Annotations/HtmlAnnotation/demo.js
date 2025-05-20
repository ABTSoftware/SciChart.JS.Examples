import * as SciChart from "scichart";

const {
    HtmlTextAnnotation,
    CustomHtmlAnnotation,
    NumericAxis,
    SciChartSurface,
    SciChartJsNavyTheme,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    ZoomPanModifier,
    MouseWheelZoomModifier
} = SciChart;

async function drawHtmlAnnotationsExample(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // #region ExampleA
    // A CustomHtmlAnnotation which contains an HTML input element

    const customHtmlAnnotation = new CustomHtmlAnnotation({
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        x1: 2,
        y1: 7,
        xCoordShift: 0,
        yCoordShift: 0
    });
    customHtmlAnnotation.htmlElement.classList.add("styledCustomAnnotation");
    customHtmlAnnotation.htmlElement.innerHTML = `
        <label for="colorSelect">Choose a color:</label>
        <select id="colorSelect" name="colorSelect">
            <option value="red" style="background-color: red; color: white;">Red</option>
            <option value="green" style="background-color: green; color: white;">Green</option>
            <option value="blue" style="background-color: blue; color: white;">Blue</option>
            <option value="yellow" style="background-color: yellow; color: black;">Yellow</option>
            <option value="purple" style="background-color: purple; color: white;">Purple</option>
        </select>`;

    sciChartSurface.annotations.add(customHtmlAnnotation);
    // #endregion

    // #region ExampleB
    // A HtmlTextAnnotation which is resized on zoom and bound to data value coordinates
    const textAnnotation = new HtmlTextAnnotation({
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        x1: 4,
        y1: 5,
        x2: 7,
        xCoordShift: 0,
        yCoordShift: 0,
        text: "This annotation has X coordinates bound to data values. Try zooming or panning",
        // style object with CSSStyleDeclaration format. Supports camel-cased property names.
        // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration
        textContainerStyle: {
            padding: "4px",
            fontSize: "1.5em",
            color: "white",
            background: "linear-gradient(135deg, #1f1c2c, #928dab)",
            border: "1px dotted black",
            borderRadius: "15px",
            textOverflow: "ellipsis",
            overflow: "hidden"
        }
    });

    sciChartSurface.annotations.add(textAnnotation);
    // #endregion

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());
}

drawHtmlAnnotationsExample("scichart-root");
