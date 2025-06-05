import {
    HtmlCustomAnnotation,
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
    SmartDateLabelProvider,
    AnnotationHoverModifier,
    HtmlTextAnnotation,
    AnnotationBase,
    easing,
    EHoverMode,
    GenericAnimation,
    translateFromCanvasToSeriesViewRect,
    translateToNotScaled,
    IHoverable,
    IAnnotation,
    Thickness,
} from "scichart";

import "./styles.css";
import { appTheme } from "../../../theme";

const data1 = [
    {
        start: 1745830800,
        end: 1745834400,
        title: "Standup Meeting",
        color: "#FF6B6B",
    },
    {
        start: 1745834400,
        end: 1745838900,
        title: "Planning Session",
        color: "#4ECDC4",
    },
    {
        start: 1745838900,
        end: 1745842500,
        title: "Lunch Break",
        color: "#FFD93D",
    },
    {
        start: 1745842500,
        end: 1745847900,
        title: "Presentation Prep",
        color: "#1A535C",
    },
    {
        start: 1745847900,
        end: 1745851500,
        title: "One-on-One Meeting",
        color: "#FF9F1C",
    },
    {
        start: 1745851500,
        end: 1745855100,
        title: "Email Responses",
        color: "#6A4C93",
    },
];

const data2 = [
    {
        start: 1745830800,
        end: 1745832600,
        title: "Morning Sync",
        color: "#FFB5E8",
    },
    {
        start: 1745832600,
        end: 1745836200,
        title: "Design Review",
        color: "#B5EAD7",
    },
    {
        start: 1745836200,
        end: 1745839800,
        title: "Code Implementation",
        color: "#C7CEEA",
    },
    {
        start: 1745839800,
        end: 1745843400,
        title: "Lunch + Walk",
        color: "#FFDAC1",
    },
    {
        start: 1745843400,
        end: 1745848800,
        title: "Dev Handoff",
        color: "#E2F0CB",
    },
    {
        start: 1745848800,
        end: 1745855100,
        title: "Documentation",
        color: "#FFABAB",
    },
];

const data3 = [
    {
        start: 1745830800,
        end: 1745833500,
        title: "Daily Briefing",
        color: "#FFD6A5",
    },
    {
        start: 1745833500,
        end: 1745838000,
        title: "UX Interviews",
        color: "#9BF6FF",
    },
    {
        start: 1745838000,
        end: 1745842500,
        title: "Lunch & Networking",
        color: "#A0C4FF",
    },
    {
        start: 1745842500,
        end: 1745846100,
        title: "Sprint Planning",
        color: "#BDB2FF",
    },
    {
        start: 1745846100,
        end: 1745849700,
        title: "Code Review",
        color: "#FFC6FF",
    },
    {
        start: 1745849700,
        end: 1745855100,
        title: "Backlog Grooming",
        color: "#FFFFD1",
    },
];

const data4 = [
    {
        start: 1745830800,
        end: 1745834100,
        title: "System Check-In",
        color: "#FFADAD",
    },
    {
        start: 1745834100,
        end: 1745837700,
        title: "Architecture Planning",
        color: "#FFD6A5",
    },
    {
        start: 1745837700,
        end: 1745842200,
        title: "Lunch Break",
        color: "#FDFFB6",
    },
    {
        start: 1745842200,
        end: 1745846700,
        title: "Testing Session",
        color: "#CAFFBF",
    },
    {
        start: 1745846700,
        end: 1745851200,
        title: "QA Sync",
        color: "#9BF6FF",
    },
    {
        start: 1745851200,
        end: 1745855100,
        title: "End-of-Day Recap",
        color: "#A0C4FF",
    },
];

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);
    const xAxis = new CategoryAxis(wasmContext, {
        isInnerAxis: true,
        labelStyle: {
            color: "black",
            fontSize: 12,
        },
        majorGridLineStyle: {
            color: "gray",
            strokeDashArray: [2, 2],
        },
        drawMinorGridLines: false,
        drawMajorBands: false,
        labelProvider: new SmartDateLabelProvider({ rotation: -90 }),
        visibleRangeLimit: new NumberRange(data1[0].start - 4 * 24 * 60, data1[data1.length - 1].end + 4 * 24 * 60),
        visibleRange: new NumberRange(data1[0].start, data1[data1.length - 1].end),
    });
    const yAxis = new NumericAxis(wasmContext, { isVisible: false });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection })
    );

    const crateTimeSlotAnnotation =
        (offset: number) =>
        ({ start, end, title, color }: any) => {
            const textAnnotation = new HtmlCustomAnnotation({
                // move to the background to allow drawing grid lines and labels above the annotations
                annotationLayer: EAnnotationLayer.Background,
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

    const titleAnnotation1 = addLaneTitleAnnotation("Employee1", "#FFB6C1", 0);
    const titleAnnotation2 = addLaneTitleAnnotation("Employee2", "#40E0D0", 0.25);
    const titleAnnotation3 = addLaneTitleAnnotation("Employee3", "#6A5ACD", 0.5);
    const titleAnnotation4 = addLaneTitleAnnotation("Employee4", "#ADFF2F", 0.75);

    sciChartSurface.annotations.add(
        ...annotations1,
        ...annotations2,
        ...annotations3,
        ...annotations4,
        titleAnnotation1,
        titleAnnotation2,
        titleAnnotation3,
        titleAnnotation4
    );

    addTooltipForAnnotations(sciChartSurface, [...annotations1, ...annotations2, ...annotations3, ...annotations4]);

    return { sciChartSurface };
};

function addLaneTitleAnnotation(text: string, background: string, yOffset: number) {
    return new HtmlTextAnnotation({
        x1: 0,
        y1: yOffset,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        textContainerStyle: {
            fontSize: "10px",
            color: "black",
            opacity: "0.7",
            background,
        },
        text,
    });
}

function addTooltipForAnnotations(sciChartSurface: SciChartSurface, targets: IAnnotation[]) {
    const tooltipAnnotation = new HtmlTextAnnotation({
        x1: 0,
        y1: 0,
        xCoordShift: 20,
        yCoordShift: 20,
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        textContainerStyle: {
            fontSize: "12px",
            color: appTheme.ForegroundColor,
            padding: "4px",
            background: "rgba(0, 0, 139, 0.4)",
            backdropFilter: "blur(10px)",
            borderRadius: "0px 15px 15px 15px",
        },
        text: "",
        isHidden: true,
    });

    sciChartSurface.modifierAnnotations.add(tooltipAnnotation);

    let currentTooltipAnimation: GenericAnimation<number>;
    const animateTooltip = () => {
        currentTooltipAnimation?.cancel();
        tooltipAnnotation.isHidden = true;
        currentTooltipAnimation = new GenericAnimation<number>({
            from: 0,
            to: 1,
            duration: 0,
            delay: 500,
            ease: easing.linear,
            onAnimate: (from: number, to: number, progress) => {},
            onCompleted: () => {
                tooltipAnnotation.isHidden = false;
            },
        });
        sciChartSurface.addAnimation(currentTooltipAnimation);
    };

    const annotationHoverModifier = new AnnotationHoverModifier({
        // check hover on provided annotations
        targets,
        // ignore tooltip annotation if it is overlapping with other
        hoverMode: EHoverMode.TopmostIncluded,
        // needed to update tooltip position when moving the cursor within an annotation
        notifyPositionUpdate: true,
        // manage tooltip visibility and position
        onHover: (args) => {
            const [hoveredAnnotation] = args.hoveredEntities as AnnotationBase[];
            if (hoveredAnnotation) {
                if (hoveredAnnotation.isEditable) {
                    sciChartSurface.domChartRoot.style.cursor = "grab";
                }
                if (hoveredAnnotation.isDraggingStarted) {
                    tooltipAnnotation.isHidden = true;
                    return;
                }

                const borders = tooltipAnnotation.getAnnotationBorders(true);
                tooltipAnnotation.text = `${formatTime(hoveredAnnotation.x1)} - ${formatTime(hoveredAnnotation.x2)}`;

                const handleAnnotationsOutsideSeriesViewRect = true;
                const translatedMousePoint = translateFromCanvasToSeriesViewRect(
                    args.mouseArgs.mousePoint,
                    sciChartSurface.seriesViewRect,
                    handleAnnotationsOutsideSeriesViewRect
                );
                tooltipAnnotation.x1 = translateToNotScaled(translatedMousePoint.x);
                tooltipAnnotation.y1 = translateToNotScaled(translatedMousePoint.y);

                // initial default offset from pointer
                tooltipAnnotation.xCoordShift = 20;
                const width = Math.abs(borders.x2 - borders.x1);
                const expectedX2Coordinate = tooltipAnnotation.x1 + tooltipAnnotation.xCoordShift + width;
                const unscaledViewWidth = translateToNotScaled(sciChartSurface.seriesViewRect.width);
                if (expectedX2Coordinate > unscaledViewWidth) {
                    tooltipAnnotation.xCoordShift = unscaledViewWidth - width - tooltipAnnotation.x1;
                }

                animateTooltip();
            } else {
                sciChartSurface.domChartRoot.style.cursor = "auto";
                tooltipAnnotation.isHidden = true;
                currentTooltipAnimation?.cancel();
            }
        },
    });

    sciChartSurface.chartModifiers.add(annotationHoverModifier);
}

function formatTime(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}
