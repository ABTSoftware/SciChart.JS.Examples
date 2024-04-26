import {
    SciChartSurface,
    EDataSeriesType,
    OhlcDataSeries,
    XyyDataSeries,
    CoordinateCalculatorBase,
    EAnnotationType,
    ISvgAnnotationBaseOptions,
    SvgAnnotationBase,
} from "scichart";

export type TFinanceLegendTemplate = (legendAnnotation: FinChartLegendAnnotation) => string;

export interface IFinChartLegendAnnotationOptions extends ISvgAnnotationBaseOptions {
    template?: TFinanceLegendTemplate;
    xIndex?: number;
    paneId?: string;
    offsetX?: number;
    offsetY?: number;
    title?: string;
}

/**
 * A Tooltip Annotation which provides an SVG tooltip over the chart. Used by the {@link RolloverModifier}
 */
export class FinChartLegendAnnotation extends SvgAnnotationBase {
    /** @inheritDoc */
    public readonly type = EAnnotationType.SVG;
    public readonly sciFinanceChart: SciChartSurface;
    private templateProperty: TFinanceLegendTemplate = defaultFinanceLegendTemplate;
    private xIndexProperty: number;
    private paneIdProperty: string;
    private offsetXProperty: number;
    private offsetYProperty: number;
    private activeSciChartSurfaceProperty: SciChartSurface;
    private titleProperty: string = "Default Title";

    /**
     * Creates an instance of the {@link FinChartLegendAnnotation}
     * @param sciFinanceChart
     * @param options
     */
    constructor(sciFinanceChart: SciChartSurface, options?: IFinChartLegendAnnotationOptions) {
        super(options);
        this.sciFinanceChart = sciFinanceChart;
        this.isHidden = true;
        this.templateProperty = options?.template ?? this.templateProperty;
        this.xIndexProperty = options?.xIndex ?? this.xIndexProperty;
        this.paneIdProperty = options?.paneId ?? this.paneIdProperty;
        this.offsetXProperty = options?.offsetX ?? this.offsetXProperty;
        this.offsetYProperty = options?.offsetY ?? this.offsetYProperty;
        this.titleProperty = options?.title ?? this.titleProperty;
    }

    public get template() {
        return this.templateProperty;
    }

    public set template(value) {
        this.templateProperty = value;
    }

    public get xIndex() {
        return this.xIndexProperty;
    }

    public set xIndex(value) {
        this.xIndexProperty = value;
    }

    public get paneId() {
        return this.paneIdProperty;
    }

    public set paneId(value) {
        this.paneIdProperty = value;
    }

    public get offsetX() {
        return this.offsetXProperty;
    }

    public set offsetX(value) {
        this.offsetXProperty = value;
    }

    public get offsetY() {
        return this.offsetYProperty;
    }

    public set offsetY(value) {
        this.offsetYProperty = value;
    }

    public get activeSciChartSurface() {
        return this.activeSciChartSurfaceProperty;
    }

    public set activeSciChartSurface(value) {
        this.activeSciChartSurfaceProperty = value;
    }

    public get title() {
        return this.titleProperty;
    }

    public set title(value) {
        this.titleProperty = value;
    }

    public update(xCalc: CoordinateCalculatorBase, yCalc: CoordinateCalculatorBase): void {
        if (this.svg) {
            this.delete();
        }
        this.create(xCalc, yCalc);
    }

    protected create(xCalc: CoordinateCalculatorBase, yCalc: CoordinateCalculatorBase) {
        if (this.template) {
            this.xIndex = this.isMouseOverSeriesArea ? Math.round(xCalc.getDataValue(this.x1)) : undefined;
            if (this.xIndex === undefined) {
                return;
            }
            const svgString = this.template(this);
            const svgNode = document.createRange().createContextualFragment(svgString);
            this.svgRoot.appendChild(svgNode);
            this.setSvg(this.svgRoot.lastChild as SVGElement);
            this.svg.setAttribute("x", this.offsetX.toString());
            this.svg.setAttribute("y", this.offsetY.toString());
        }
    }

    private get isMouseOverSeriesArea() {
        return this.activeSciChartSurface;
    }
}

/** @ignore */
const defaultFinanceLegendTemplate: TFinanceLegendTemplate = (la: FinChartLegendAnnotation): string => {
    const outputStrings: string[] = [];
    const subSurface = la.sciFinanceChart.subCharts.find((study) => study.id === la.paneId);
    let outputStr = "";
    subSurface.renderableSeries.asArray().forEach(({ dataSeries }) => {
        switch (dataSeries.type) {
            case EDataSeriesType.Ohlc: {
                const openValues = (dataSeries as OhlcDataSeries).getNativeOpenValues();
                const highValues = (dataSeries as OhlcDataSeries).getNativeHighValues();
                const lowValues = (dataSeries as OhlcDataSeries).getNativeLowValues();
                const closeValues = (dataSeries as OhlcDataSeries).getNativeCloseValues();

                const openValue = openValues.get(la.xIndex);
                const highValue = highValues.get(la.xIndex);
                const lowValue = lowValues.get(la.xIndex);
                const closeValue = closeValues.get(la.xIndex);

                outputStr += `${dataSeries.dataSeriesName} O: ${openValue} H: ${highValue} L: ${lowValue} C: ${closeValue}`;
                break;
            }

            case EDataSeriesType.Xyy: {
                const yValues = dataSeries.getNativeYValues();
                const y1Values = (dataSeries as XyyDataSeries).getNativeY1Values();
                const yValue = yValues.get(la.xIndex).toFixed(4);
                const y1Value = y1Values.get(la.xIndex).toFixed(4);
                outputStr += `${dataSeries.dataSeriesName} Y: ${yValue} Y1: ${y1Value}`;

                break;
            }

            default: {
                const yValues = dataSeries.getNativeYValues();
                const yValue = yValues.get(la.xIndex).toFixed(4);
                outputStr += `${dataSeries.dataSeriesName}: ${yValue}`;
            }
        }

        if (outputStr) {
            outputStrings.push(outputStr);
            outputStr = "";
        }
    });

    let outputSvgString = "";
    outputStrings.forEach((outputStr, index) => {
        const y = 30 + index * 20;
        outputSvgString += `<text x="8" y="${y}" font-size="13" font-family="Verdana" fill="lightblue">${outputStr}</text>`;
    });
    return `<svg width="800" height="200">
        <rect width="100%" height="100%" fill="#00000000" stroke="#00000000" stroke-width="2" />
        <svg width="100%">
            ${outputSvgString}
        </svg>
    </svg>`;
};
