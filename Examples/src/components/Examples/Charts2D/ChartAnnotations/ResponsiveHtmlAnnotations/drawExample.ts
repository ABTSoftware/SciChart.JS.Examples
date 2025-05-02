import {
    CustomHtmlAnnotation,
    CategoryAxis,
    EAnnotationLayer,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    EXyDirection,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    ZoomPanModifier,
} from "scichart";

import "./styles.css";

const data1 = [
    {
        start: 1745819400,
        end: 1745823000,
        title: "Standup Meeting",
        color: "#FF6B6B",
    },
    {
        start: 1745823000,
        end: 1745827500,
        title: "Planning Session",
        color: "#4ECDC4",
    },
    {
        start: 1745827500,
        end: 1745831100,
        title: "Lunch Break",
        color: "#FFD93D",
    },
    {
        start: 1745831100,
        end: 1745836500,
        title: "Presentation Prep",
        color: "#1A535C",
    },
    {
        start: 1745836500,
        end: 1745840100,
        title: "One-on-One Meeting",
        color: "#FF9F1C",
    },
    {
        start: 1745840100,
        end: 1745843700,
        title: "Email Responses",
        color: "#6A4C93",
    },
];

const data2 = [
    {
        start: 1745819400,
        end: 1745821200,
        title: "Morning Sync",
        color: "#FFB5E8",
    },
    {
        start: 1745821200,
        end: 1745824800,
        title: "Design Review",
        color: "#B5EAD7",
    },
    {
        start: 1745824800,
        end: 1745828400,
        title: "Code Implementation",
        color: "#C7CEEA",
    },
    {
        start: 1745828400,
        end: 1745832000,
        title: "Lunch + Walk",
        color: "#FFDAC1",
    },
    {
        start: 1745832000,
        end: 1745837400,
        title: "Dev Handoff",
        color: "#E2F0CB",
    },
    {
        start: 1745837400,
        end: 1745843700,
        title: "Documentation",
        color: "#FFABAB",
    },
];

const data3 = [
    {
        start: 1745819400,
        end: 1745822100,
        title: "Daily Briefing",
        color: "#FFD6A5",
    },
    {
        start: 1745822100,
        end: 1745826600,
        title: "UX Interviews",
        color: "#9BF6FF",
    },
    {
        start: 1745826600,
        end: 1745831100,
        title: "Lunch & Networking",
        color: "#A0C4FF",
    },
    {
        start: 1745831100,
        end: 1745834700,
        title: "Sprint Planning",
        color: "#BDB2FF",
    },
    {
        start: 1745834700,
        end: 1745838300,
        title: "Code Review",
        color: "#FFC6FF",
    },
    {
        start: 1745838300,
        end: 1745843700,
        title: "Backlog Grooming",
        color: "#FFFFD1",
    },
];

const data4 = [
    {
        start: 1745819400,
        end: 1745822700,
        title: "System Check-In",
        color: "#FFADAD",
    },
    {
        start: 1745822700,
        end: 1745826300,
        title: "Architecture Planning",
        color: "#FFD6A5",
    },
    {
        start: 1745826300,
        end: 1745830800,
        title: "Lunch Break",
        color: "#FDFFB6",
    },
    {
        start: 1745830800,
        end: 1745835300,
        title: "Testing Session",
        color: "#CAFFBF",
    },
    {
        start: 1745835300,
        end: 1745839800,
        title: "QA Sync",
        color: "#9BF6FF",
    },
    {
        start: 1745839800,
        end: 1745843700,
        title: "End-of-Day Recap",
        color: "#A0C4FF",
    },
];

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);
    const xAxis = new CategoryAxis(wasmContext, {
        visibleRangeLimit: new NumberRange(data1[0].start - 50000, data1[data1.length - 1].end + 50000),
        visibleRange: new NumberRange(data1[0].start, data1[data1.length - 1].end),
    });
    const yAxis = new NumericAxis(wasmContext);

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection })
    );

    const crateTimeSlotAnnotation =
        (offset: number) =>
        ({ start, end, title, color }: any) => {
            const textAnnotation = new CustomHtmlAnnotation({
                annotationLayer: EAnnotationLayer.AboveChart,
                yCoordinateMode: ECoordinateMode.Relative,
                x1: start,
                y1: offset * 0.25,
                x2: end,
                y2: (offset + 1) * 0.25,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Center,
            });

            textAnnotation.htmlElement.innerHTML = `<div class="responsiveTextAnnotation">${title}</div>`;
            textAnnotation.htmlElement.classList.add("responsiveTextAnnotationContainer");
            textAnnotation.htmlElement.style.background = color;
            return textAnnotation;
        };

    const annotations1 = data1.map(crateTimeSlotAnnotation(0));
    const annotations2 = data2.map(crateTimeSlotAnnotation(1));
    const annotations3 = data3.map(crateTimeSlotAnnotation(2));
    const annotations4 = data4.map(crateTimeSlotAnnotation(3));

    sciChartSurface.annotations.add(...annotations1, ...annotations2, ...annotations3, ...annotations4);

    return { sciChartSurface };
};
