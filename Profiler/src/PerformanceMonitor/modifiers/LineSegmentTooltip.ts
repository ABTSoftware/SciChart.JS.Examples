import { ECoordinateMode, EHorizontalAnchorPoint, EVerticalAnchorPoint, SelectionChangedArgs } from "scichart";
import { NativeTextAnnotation } from "scichart";
import { FastLineSegmentRenderableSeries } from "scichart";
import { IAnnotation } from "scichart";
import { ISeriesSelectionModifierOptions } from "scichart";
import { CustomChartModifier2D, SeriesSelectionModifier } from "scichart";
import { getIsOperationEndMarkType } from "../data/MarksParsing";

export class LineSegmentTooltipModifier extends SeriesSelectionModifier {
    protected tooltipAnnotation: IAnnotation;

    constructor(options?: ISeriesSelectionModifierOptions) {
        super(options);

        this.selectionSegmentChangedCallback = this.selectionSegmentChangedCallback.bind(this);
    }

    public override onAttach() {
        super.onAttach();

        this.tooltipAnnotation = this.createTooltipAnnotation();
        this.parentSurface.modifierAnnotations.add(this.tooltipAnnotation);

        this.selectionChanged.subscribe(this.selectionSegmentChangedCallback);
    }

    public override onDetach() {
        super.onDetach();

        this.parentSurface.modifierAnnotations.remove(this.tooltipAnnotation);

        this.selectionChanged.unsubscribe(this.selectionSegmentChangedCallback);
    }

    protected selectionSegmentChangedCallback(args: SelectionChangedArgs) {
        const [firstSelectedSeries] = args.selectedSeries;

        if (!firstSelectedSeries) {
            this.tooltipAnnotation.isVisible = false;
            return;
        }

        const [seriesMarkType] = firstSelectedSeries.id.split("-");
        const isOperation = getIsOperationEndMarkType(seriesMarkType);
        if (!isOperation) {
            return;
        }

        const xCalc = this.xAxis.getCurrentCoordinateCalculator();

        this.tooltipAnnotation.x1 = xCalc.getDataValue(args.hitTestInfo.hitTestPoint.x);
        this.tooltipAnnotation.y1 = args.hitTestInfo.yValue;

        const isSegmentStart = args.hitTestInfo.dataSeriesIndex % 2 === 0;
        const secondSegmentPointIndex = isSegmentStart
            ? args.hitTestInfo.dataSeriesIndex + 1
            : args.hitTestInfo.dataSeriesIndex - 1;
        const secondSegmentPointXValue = firstSelectedSeries.dataSeries.getNativeXValues().get(secondSegmentPointIndex);

        (this.tooltipAnnotation as NativeTextAnnotation).text = `${seriesMarkType.replace("End", "")}: ${Math.abs(
            args.hitTestInfo.xValue - secondSegmentPointXValue
        )}`;

        this.tooltipAnnotation.isVisible = true;
    }

    protected createTooltipAnnotation() {
        return new NativeTextAnnotation({
            text: "",
            textColor: "black",
            fontSize: 16,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            // horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            // verticalAnchorPoint: EVerticalAnchorPoint.Center,
            background: "yellow",
            isHidden: true
        });
    }
}
