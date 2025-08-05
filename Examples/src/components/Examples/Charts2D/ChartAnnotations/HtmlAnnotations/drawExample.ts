import {
    HtmlCustomAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    ZoomPanModifier,
    HtmlTextAnnotation,
    SplineMountainRenderableSeries,
    XyDataSeries,
    Thickness,
    SciChartJSDarkTheme,
    ZoomExtentsModifier,
    EAutoRange,
    easing,
} from "scichart";

import "./styles.css";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

    const xAxis = new NumericAxis(wasmContext, {
        zoomExtentsRange: new NumberRange(0, 100),
        visibleRange: new NumberRange(40, 60),
        visibleRangeLimit: new NumberRange(-1000, 1000),
        autoRange: EAutoRange.Never,
    });
    const yAxis = new NumericAxis(wasmContext, {
        drawLabels: false,
        zoomExtentsRange: new NumberRange(0, 10),
        visibleRange: new NumberRange(4, 6),
        visibleRangeLimit: new NumberRange(-1000, 1000),
        autoRange: EAutoRange.Never,
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier(), new ZoomExtentsModifier());

    const textContent1 =
        "HTML-based annotations let you leverage the native HTML API to create and style elements, while SciChart handles their positioning within the chart.";

    const textContent2 = "For example, you can add text annotations that are stylable using CSS.";

    const textContent3 = "Or insert any arbitrary HTML content — like the interactive control shown below.";

    const textContent4 = "This feature also allows you to render annotation content using your preferred UI framework.";

    const textContent5 = "You can even embed a separate chart at specific data coordinates.";

    // the annotation styled via CSS-in-JS
    const textAnnotation1 = new HtmlTextAnnotation({
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 0,
        y1: 0,
        x2: 1,
        xCoordShift: 0,
        yCoordShift: 0,
        text: textContent1,
        // style object with CSSStyleDeclaration format. Supports camel-cased property names.
        // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration
        textContainerStyle: {
            padding: "4px",
            fontSize: "1em",
            color: "white",
            background: "radial-gradient(ellipse at center, #C52E60 0%, #264B93 100%)",
            border: "1px dotted black",
            borderRadius: "15px",
        },
    });

    sciChartSurface.annotations.add(textAnnotation1);

    // the annotation styled via the stylesheet
    const textAnnotation2 = new HtmlTextAnnotation({
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        x1: 10,
        y1: 8,
        xCoordShift: 0,
        yCoordShift: 0,
        text: textContent2,
    });
    textAnnotation2.htmlElement.classList.add("styledTextAnnotation");

    sciChartSurface.annotations.add(textAnnotation2);

    // the annotations with specified size and a default HTML tooltip
    const textAnnotation3 = new HtmlTextAnnotation({
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 0,
        x2: 300,
        y1: 1,
        xCoordShift: 0,
        yCoordShift: -250,
        text: textContent3,
        // style object with CSSStyleDeclaration format. Supports camel-cased property names.
        // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration
        textContainerStyle: {
            pointerEvents: "all", // allows the native tooltip to be displayed
            padding: "4px",
            fontSize: "1em",
            fontWeight: "500",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: appTheme.VividOrange,
            maxWidth: "300px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordWrap: "normal",
            background: "radial-gradient(circle at center,rgb(45, 140, 116), #14233C)",
        },
    });
    textAnnotation3.htmlElement.title = "Some Tooltip";
    sciChartSurface.annotations.add(textAnnotation3);

    const textAnnotation4 = new HtmlTextAnnotation({
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        x1: 60,
        y1: 7,
        y2: 5,
        xCoordShift: 0,
        yCoordShift: 0,
        text: textContent4,
        // style object with CSSStyleDeclaration format. Supports camel-cased property names.
        // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration
        textContainerStyle: {
            fontSize: "0.8em",
            color: "white",
            maxWidth: "200px",
        },
    });

    sciChartSurface.annotations.add(textAnnotation4);

    const textAnnotation5 = new HtmlTextAnnotation({
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        x1: 70,
        y1: 3.5,
        xCoordShift: 0,
        yCoordShift: 0,
        text: textContent5,
        // style object with CSSStyleDeclaration format. Supports camel-cased property names.
        // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration
        textContainerStyle: {
            fontSize: "0.8em",
            color: "white",
            width: "200px",
            whiteSpace: "no-wrap",
        },
    });

    sciChartSurface.annotations.add(textAnnotation5);

    // the annotation that serves as a root node for the element generated with a framework (e.g. via `React.createPortal`)
    const containerAnnotation = new HtmlCustomAnnotation({
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
        x1: 80,
        y1: 5,
        isEditable: true,
    });
    sciChartSurface.annotations.add(containerAnnotation);

    const formAnnotation = new HtmlCustomAnnotation({
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 0,
        y1: 1,
        yCoordShift: -150,
    });
    sciChartSurface.annotations.add(formAnnotation);

    // the annotation that serves as a root element for the nested chart
    const nestedChartRootAnnotation = new HtmlCustomAnnotation({
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        x1: 70,
        y1: 2,
        x2: 100,
        y2: 0,
        isEditable: true,
    });
    sciChartSurface.annotations.add(nestedChartRootAnnotation);

    const selector = new NumberRangeSelector(formAnnotation.htmlElement, xAxis.visibleRange, (min, max) => {
        xAxis.visibleRange = new NumberRange(min, max);
    });

    xAxis.visibleRangeChanged.subscribe((args) => {
        selector.setRange(args.visibleRange.min, args.visibleRange.max);
    });

    // this creates a separate charts which could be positioned within the main one.
    // If you need some kind of this functionality, consider checking out SubCharts API as well
    const nestedChart = await drawNestedChart(nestedChartRootAnnotation.htmlElement as HTMLDivElement);

    // bind cleanup call
    sciChartSurface.addDeletable(nestedChart.sciChartSurface);

    sciChartSurface.zoomExtents(600, easing.inOutCirc);

    return { sciChartSurface, containerAnnotation };
};

const drawNestedChart = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: new SciChartJSDarkTheme(),
        padding: Thickness.fromNumber(2),
    });

    const xAxis = new NumericAxis(wasmContext, { drawLabels: false });
    const yAxis = new NumericAxis(wasmContext, { drawLabels: false });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.renderableSeries.add(
        new SplineMountainRenderableSeries(wasmContext, {
            strokeThickness: 3,
            stroke: appTheme.VividOrange,
            fill: appTheme.PalePink,
            opacity: 0.5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [0, 2, 3, 8, 11, 29],
                yValues: [44, 77, 2, 56, 9, 5],
            }),
        })
    );

    return { sciChartSurface };
};
class NumberRangeSelector {
    private minInput: HTMLInputElement;
    private maxInput: HTMLInputElement;
    private slider: HTMLInputElement;
    private container: HTMLElement;
    private onChange: (min: number, max: number) => void;

    constructor(rootElement: HTMLElement, initialRange: NumberRange, onChange: (min: number, max: number) => void) {
        this.container = rootElement;
        this.onChange = onChange;

        // Style the root container
        this.container.style.pointerEvents = "all";
        this.container.style.padding = "0.8em";
        this.container.style.borderRadius = "12px";
        this.container.style.background = "linear-gradient(135deg, #EC0F6C, #F48420)";
        this.container.style.color = "white";
        this.container.style.fontFamily = "sans-serif";
        this.container.style.width = "fit-content";

        // Title
        const title = document.createElement("h3");
        title.textContent = "Visible Range Selector";
        title.style.marginBottom = "0.8em";
        title.style.whiteSpace = "nowrap";

        // Inputs
        this.minInput = document.createElement("input");
        this.maxInput = document.createElement("input");
        this.minInput.type = "number";
        this.maxInput.type = "number";
        this.minInput.value = `${initialRange.min}`;
        this.maxInput.value = `${initialRange.max}`;
        this.minInput.style.width = "50px";
        this.maxInput.style.width = "50px";

        // Labels
        const minLabel = document.createElement("label");
        minLabel.textContent = "Min: ";
        minLabel.appendChild(this.minInput);

        const maxLabel = document.createElement("label");
        maxLabel.textContent = "Max: ";
        maxLabel.appendChild(this.maxInput);

        // Wrapper for inputs
        const inputWrapper = document.createElement("div");
        inputWrapper.className = "inputWrapper";
        inputWrapper.style.display = "flex";
        inputWrapper.style.gap = "0.8em";
        inputWrapper.style.alignItems = "center";
        inputWrapper.appendChild(minLabel);
        inputWrapper.appendChild(maxLabel);

        // Slider (range input)
        this.slider = document.createElement("input");
        this.slider.type = "range";
        this.slider.min = "-1000";
        this.slider.max = "1000";
        this.slider.value = "50";
        this.slider.step = "1";
        this.slider.style.width = "100%";
        this.slider.style.marginTop = "0.5em";

        // Slider container (with label)
        const sliderWrapper = document.createElement("div");
        sliderWrapper.style.marginTop = "0.5em";
        sliderWrapper.appendChild(this.slider);

        // Event listeners
        this.minInput.addEventListener("input", () => this.handleInput());
        this.maxInput.addEventListener("input", () => this.handleInput());

        this.slider.addEventListener("input", () => {
            const center = parseFloat(this.slider.value);
            const range = 100; // Adjustable spread
            this.minInput.value = (center - range / 2).toString();
            this.maxInput.value = (center + range / 2).toString();
            this.handleInput();
        });

        // Add elements to container
        this.container.appendChild(title);
        this.container.appendChild(inputWrapper);
        this.container.appendChild(sliderWrapper);

        // Initial trigger
        this.handleInput();
    }

    private handleInput() {
        const min = parseFloat(this.minInput.value);
        const max = parseFloat(this.maxInput.value);

        if (!isNaN(min) && !isNaN(max) && min <= max) {
            this.minInput.setCustomValidity("");
            this.maxInput.setCustomValidity("");
            this.onChange(min, max);
        } else {
            this.minInput.setCustomValidity("Invalid range");
            this.maxInput.setCustomValidity("Invalid range");
        }
    }

    public setRange(min: number, max: number): void {
        if (!isNaN(min) && !isNaN(max) && min <= max) {
            this.minInput.value = min.toString();
            this.maxInput.value = max.toString();

            // Update slider to reflect the new range center
            const center = (min + max) / 2;
            this.slider.value = center.toString();

            this.handleInput();
        } else {
            console.warn("Invalid range provided to setRange:", { min, max });
        }
    }
}
