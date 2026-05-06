import { SciChartSurface, NumericAxis, EVerticalTextPosition, ETextAlignment, Thickness, EHorizontalTextPosition } from "scichart";
import {
    EFibonacciLabelColorMode, EFibonacciLabelPlacement,
    FibonacciRetracementAnnotation, TFibonacciLevelLabelFormatParams,
    EMultiPointLabelAnchorMode, IMultiPointLabelFormatParams
} from "scichart-financial-tools";

const compactFibonacciLabel = (params: TFibonacciLevelLabelFormatParams): string => {
    return `${(params.threshold * 100).toFixed(1)}% (${params.valueLabel})`;
};

export async function ex6FibonacciRetracementAnnotation() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const standardFib = new FibonacciRetracementAnnotation({
        isEditable: true,
        isSelected: true,
        strokeThickness: 2,
        fillOpacity: 0.25,
        showConnectorLine: false,
        connectorLineStroke: "#F8FAFCAA",
        fibonacciLabelFontSize: 10,
        points: [
            { x: 1, y: 1 },
            { x: 4, y: 1 },
            { x: 4, y: 3 },
        ],
    });

    const customFib = new FibonacciRetracementAnnotation({
        isEditable: true,
        strokeThickness: 2,
        thresholds: [
            0,
            0.382,
            0.5,
            0.618,
            1,
            1.618,
            2.618
        ],
        regionColors: [
            "#0d9cde",
            "#064a6a"
        ],
        fillOpacity: 0.2,
        verticalOnly: false,
        showConnectorLine: true,
        connectorLineStrokeDashArray: [10, 0],

        fibonacciLabelColor: "#E2E8F099",
        fibonacciLabelPlacement: EFibonacciLabelPlacement.Top,
        fibonacciLabelColorMode: EFibonacciLabelColorMode.SingleColor,
        fibonacciLabelFontSize: 13,
        fibonacciLabelLinePadding: 2,
        formatFibonacciLabel: compactFibonacciLabel,

        points: [
            { x: 6, y: 1 },
            { x: 9, y: 1 },
            { x: 9.2, y: 3 },
        ],
        labels: [
            {
                id: "hardcoded-0",
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex: 0,
                text: "STATIC TEXT",
                verticalTextPosition: EVerticalTextPosition.Center,
                alignment: ETextAlignment.Right,
                padding: new Thickness(0, 14)
            },
            {
                id: "hardcoded-1",
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex: 1,
                verticalTextPosition: EVerticalTextPosition.Center,
                alignment: ETextAlignment.Left,
                padding: new Thickness(0, 14)
            },
            {
                id: "hardcoded-2",
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex: 2,
                verticalTextPosition: EVerticalTextPosition.Center,
                horizontalTextPosition: EHorizontalTextPosition.Center,
            },
        ],
        formatLabel: (params: IMultiPointLabelFormatParams) => {
            return params.label.text // if hardcoded text exists, use it
                ?? "PL-" + params.anchorValuePoint.y.toFixed(2);
        }
    });

    sciChartSurface.annotations.add(standardFib, customFib);
    sciChartSurface.zoomExtents();
}
