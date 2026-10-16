import { ETradingAnnotationType as A } from "scichart-financial-tools";
import type { TStartToolOptions } from "./drawExample";

export type DrawingTool = {
    label: string;
    icon: string;
    annotationType?: A;
    options?: TStartToolOptions;
    gesture?: "drag" | "erase";
};

export const toolGroups: { label: string; tools: DrawingTool[] }[] = [
    {
        label: "Lines",
        tools: [
            { label: "Polyline", icon: "Free PolyLine", annotationType: A.PolyLineAnnotation },
            {
                label: "Snapped polyline",
                icon: "Snapped PolyLine",
                annotationType: A.PolyLineAnnotation,
                options: { snapToCandle: true },
            },
            { label: "Extended line", icon: "Extended Line", annotationType: A.ExtendedLineAnnotation },
            { label: "Ray", icon: "Ray", annotationType: A.ExtendedLineAnnotation, options: { extendStart: false } },
            {
                label: "Reverse ray",
                icon: "Reverse Ray",
                annotationType: A.ExtendedLineAnnotation,
                options: { extendEnd: false },
            },
            {
                label: "Horizontal trend line",
                icon: "Horizontal Trend Line",
                annotationType: A.HorizontalTrendLineAnnotation,
            },
            {
                label: "Vertical trend line",
                icon: "Vertical Trend Line",
                annotationType: A.VerticalTrendLineAnnotation,
            },
            { label: "Cross line", icon: "Cross Line", annotationType: A.CrossLineAnnotation },
            { label: "Angle line", icon: "Angle Line", annotationType: A.AngleLineAnnotation },
        ],
    },
    {
        label: "Channels & pitchforks",
        tools: [
            { label: "Parallel channel", icon: "Parallel Channel", annotationType: A.ChannelAnnotation },
            {
                label: "Flat top / bottom channel",
                icon: "Flat Top/Bottom",
                annotationType: A.FlatBottomChannelAnnotation,
            },
            { label: "Disjoint channel", icon: "Disjoint Channel", annotationType: A.DisjointChannelAnnotation },
            { label: "Pitchfork", icon: "Pitchfork", annotationType: A.PitchforkAnnotation },
            {
                label: "Basic pitchfork",
                icon: "Basic Pitchfork",
                annotationType: A.PitchforkAnnotation,
                options: { basicPitchfork: true },
            },
            { label: "Schiff pitchfork", icon: "Schiff Pitchfork", annotationType: A.SchiffPitchforkAnnotation },
            {
                label: "Modified Schiff pitchfork",
                icon: "Modified Schiff Pitchfork",
                annotationType: A.ModifiedSchiffPitchforkAnnotation,
            },
            { label: "Inside pitchfork", icon: "Inside Pitchfork", annotationType: A.InsidePitchforkAnnotation },
            { label: "Pitchfan", icon: "Pitchfan", annotationType: A.PitchfanAnnotation },
        ],
    },
    {
        label: "Fibonacci & cycles",
        tools: [
            {
                label: "Fibonacci retracement",
                icon: "Fib Retracement",
                annotationType: A.FibonacciRetracementAnnotation,
                options: { verticalOnly: true },
            },
            {
                label: "Skewed Fibonacci retracement",
                icon: "Fib Retracement",
                annotationType: A.FibonacciRetracementAnnotation,
                options: { verticalOnly: false },
            },
            { label: "Fibonacci extension", icon: "Fib Extension", annotationType: A.FibonacciExtensionAnnotation },
            { label: "Fibonacci arcs", icon: "Fib Arcs", annotationType: A.FibonacciSpeedResistanceArcsAnnotation },
            { label: "Fibonacci circles", icon: "Fib Circles", annotationType: A.FibonacciCirclesAnnotation },
            { label: "Fibonacci wedge", icon: "Fib Wedge", annotationType: A.FibonacciWedgeAnnotation },
            {
                label: "Fibonacci time zones",
                icon: "Cyclic Fibonacci Line",
                annotationType: A.FibonacciTimeZoneAnnotation,
            },
            { label: "Cyclic lines", icon: "Cyclic Line", annotationType: A.CyclicLineAnnotation },
            { label: "Cyclic arcs", icon: "Cyclic Arc", annotationType: A.CyclicArcAnnotation },
            { label: "Sector", icon: "Sector", annotationType: A.SectorAnnotation },
        ],
    },
    {
        label: "Patterns",
        tools: [
            {
                label: "XABCD pattern",
                icon: "XABCD pattern",
                annotationType: A.PolyLineAnnotation,
                options: { labels: ["X", "A", "B", "C", "D"] },
            },
            {
                label: "Elliott impulse",
                icon: "Elliott (1·2·3·4·5)",
                annotationType: A.PolyLineAnnotation,
                options: { labels: ["0", "1", "2", "3", "4", "5"] },
            },
            {
                label: "Elliott ABC",
                icon: "Elliott ABC (0·A·B·C)",
                annotationType: A.PolyLineAnnotation,
                options: { labels: ["0", "A", "B", "C"] },
            },
            {
                label: "Elliott ABCDE",
                icon: "Elliott ABCDE (0·A·B·C·D·E)",
                annotationType: A.PolyLineAnnotation,
                options: { labels: ["0", "A", "B", "C", "D", "E"] },
            },
            {
                label: "Elliott WXY",
                icon: "Elliott WXY (0·W·X·Y)",
                annotationType: A.PolyLineAnnotation,
                options: { labels: ["0", "W", "X", "Y"] },
            },
            {
                label: "Elliott WXYXZ",
                icon: "Elliott WXYXZ (0·W·X·Y·X·Z)",
                annotationType: A.PolyLineAnnotation,
                options: { labels: ["0", "W", "X", "Y", "X", "Z"] },
            },
        ],
    },
    {
        label: "Measure & risk",
        tools: [
            { label: "Measure", icon: "Measure", annotationType: A.MeasureAnnotation },
            {
                label: "Snapped measure",
                icon: "Measure Snap to DP",
                annotationType: A.MeasureAnnotation,
                options: { snapToCandle: true },
            },
            { label: "Stop loss / take profit", icon: "SL/TP", annotationType: A.StopLossTakeProfitAnnotation },
        ],
    },
    {
        label: "Freehand",
        tools: [
            { label: "Pen", icon: "Pen", annotationType: A.FreehandDrawingAnnotation, gesture: "drag" },
            {
                label: "Pen (non-editable)",
                icon: "Pen Non-Editable",
                annotationType: A.FreehandDrawingAnnotation,
                options: { isEditable: false },
                gesture: "drag",
            },
            {
                label: "Pen (1:1 aspect)",
                icon: "Pen",
                annotationType: A.FreehandDrawingAnnotation,
                options: { lockedAspect: true },
                gesture: "drag",
            },
            {
                label: "Highlighter",
                icon: "Highlighter",
                annotationType: A.FreehandDrawingAnnotation,
                options: { highlighter: true },
                gesture: "drag",
            },
            {
                label: "Highlighter (non-editable)",
                icon: "Highlighter Non-Editable",
                annotationType: A.FreehandDrawingAnnotation,
                options: { highlighter: true, isEditable: false },
                gesture: "drag",
            },
            { label: "Eraser", icon: "Eraser", gesture: "erase" },
        ],
    },
];
