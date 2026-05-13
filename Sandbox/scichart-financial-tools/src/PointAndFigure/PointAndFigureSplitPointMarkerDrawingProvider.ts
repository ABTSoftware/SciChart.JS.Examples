
import { EPointAndFigureSymbolType, IPointAndFigurePointMetadata } from "scichart-financial-tools";
import { PointAndFigurePointMarker } from "./PointAndFigurePointMarker";
import { BaseDataSeries, BaseSeriesDrawingProvider, deleteSafe, IPointMarker, IPointSeries, IRenderableSeries, RenderPassData, TSciChart, vectorToArrayViewF64, WebGlRenderContext2D } from "scichart";
import { CoordinateCalculator, SCRTDoubleVector, SCRTPointDrawingParams, SCRTRenderContext, SCRTScatterSeriesDrawingProvider, UIntVector } from "scichart/types/TSciChart";

const isPointAndFigureMetadata = (metadata: unknown): metadata is IPointAndFigurePointMetadata => {
    return metadata !== undefined && (metadata as IPointAndFigurePointMetadata).symbolType !== undefined;
}
const MIN_MARKER_SIZE_PX = 4;
const MAX_MARKER_SIZE_PX = 52;
const MARKER_SIZE_QUANTUM_PX = 2;
const BASE_LINEAR_SIZE_PX = 28;
const INNER_PADDING_PX = 4;

export class PointAndFigureSplitPointMarkerDrawingProvider extends BaseSeriesDrawingProvider<IRenderableSeries> {
    private nativeDrawingProvider: SCRTScatterSeriesDrawingProvider;
    private args: SCRTPointDrawingParams;
    private emptyPalettedColors: UIntVector;

    private readonly xValuesSubset: SCRTDoubleVector;
    private readonly yValuesSubset: SCRTDoubleVector;
    private readonly oValuesSubsetX: SCRTDoubleVector;
    private readonly oValuesSubsetY: SCRTDoubleVector;

    private readonly xMarker: PointAndFigurePointMarker;
    private readonly oMarker: PointAndFigurePointMarker;
    private lastDynamicMarkerSize = -1;

    constructor(webAssemblyContext: TSciChart, parentSeries: IRenderableSeries) {
        super(webAssemblyContext, parentSeries);

        this.nativeDrawingProvider = new this.webAssemblyContext.SCRTScatterSeriesDrawingProvider();
        this.args = new this.webAssemblyContext.SCRTPointDrawingParams();
        this.emptyPalettedColors = new this.webAssemblyContext.UIntVector();

        this.xValuesSubset = new this.webAssemblyContext.SCRTDoubleVector();
        this.yValuesSubset = new this.webAssemblyContext.SCRTDoubleVector();
        this.oValuesSubsetX = new this.webAssemblyContext.SCRTDoubleVector();
        this.oValuesSubsetY = new this.webAssemblyContext.SCRTDoubleVector();

        this.xMarker = new PointAndFigurePointMarker(webAssemblyContext, {
            width: 12,
            height: 12,
            stroke: "#1C7C54",
            strokeThickness: 2,
            fill: "transparent"
        });
        this.oMarker = new PointAndFigurePointMarker(webAssemblyContext, {
            width: 12,
            height: 12,
            stroke: "transparent",
            strokeThickness: 2,
            fill: "#C0392B"
        });
    }

    public onSeriesPropertyChange(_propertyName: string): void {
        // Deliberately empty
    }

    public draw(renderContext: WebGlRenderContext2D, renderPassData: RenderPassData): void {
        const dataSeries = this.parentSeries.dataSeries as BaseDataSeries;
        if (!dataSeries || dataSeries.count() === 0) {
            return;
        }

        const pointMarker = this.parentSeries.pointMarker;
        if (!pointMarker) {
            return;
        }

        const pointSeries = renderPassData.pointSeries;
        if (!pointSeries) {
            return;
        }

        if (!this.isPointAndFigureSeries(dataSeries)) {
            this.drawSingleMarker(renderContext, renderPassData, pointSeries, pointMarker);
            return;
        }

        this.syncMarkersFrom(pointMarker, renderPassData);
        this.partitionValuesBySymbol(renderPassData, pointSeries, dataSeries);

        const nativeContext = renderContext.getNativeContext();
        this.drawSubset(nativeContext, this.xValuesSubset, this.yValuesSubset, renderPassData, this.xMarker);
        this.drawSubset(nativeContext, this.oValuesSubsetX, this.oValuesSubsetY, renderPassData, this.oMarker);
    }

    public delete(): void {
        this.nativeDrawingProvider = deleteSafe(this.nativeDrawingProvider);
        this.args = deleteSafe(this.args);
        this.emptyPalettedColors = deleteSafe(this.emptyPalettedColors);
        deleteSafe(this.xValuesSubset);
        deleteSafe(this.yValuesSubset);
        deleteSafe(this.oValuesSubsetX);
        deleteSafe(this.oValuesSubsetY);
        deleteSafe(this.xMarker);
        deleteSafe(this.oMarker);
        super.delete();
    }

    private isPointAndFigureSeries(dataSeries: BaseDataSeries): boolean {
        const sampleCount = Math.min(5, dataSeries.count());
        for (let i = 0; i < sampleCount; i++) {
            if (isPointAndFigureMetadata(dataSeries.getMetadataAt(i))) {
                return true;
            }
        }
        return false;
    }

    private syncMarkersFrom(source: IPointMarker, renderPassData: RenderPassData) {
        const dynamicSize = this.calculateDynamicMarkerSize(renderPassData);
        const targetMarkerSize = dynamicSize > 0 ? dynamicSize : source.width;
        this.lastDynamicMarkerSize = targetMarkerSize;

        this.applyMarkerIfChanged(this.xMarker, {
            width: targetMarkerSize,
            height: targetMarkerSize,
            strokeThickness: source.strokeThickness,
            antiAlias: source.antiAlias,
            opacity: this.parentSeries.opacity,
            stroke: source.stroke,
            fill: "transparent"
        });

        this.applyMarkerIfChanged(this.oMarker, {
            width: targetMarkerSize,
            height: targetMarkerSize,
            strokeThickness: source.strokeThickness,
            antiAlias: source.antiAlias,
            opacity: this.parentSeries.opacity,
            stroke: "transparent",
            fill: source.fill
        });
    }

    private calculateDynamicMarkerSize(renderPassData: RenderPassData): number {
        const xAxis = this.parentSeries.xAxis as unknown as { majorDelta?: number; minorsPerMajor?: number };
        const yAxis = this.parentSeries.yAxis as unknown as { majorDelta?: number; minorsPerMajor?: number };
        if (!xAxis || !yAxis) {
            return -1;
        }

        const xMinorDelta = this.getMinorDelta(xAxis);
        const yMinorDelta = this.getMinorDelta(yAxis);
        if (xMinorDelta <= 0 || yMinorDelta <= 0) {
            return -1;
        }

        const xSpacingPx = Math.abs(
            renderPassData.xCoordinateCalculator.getCoordinate(xMinorDelta) -
                renderPassData.xCoordinateCalculator.getCoordinate(0)
        );
        const ySpacingPx = Math.abs(
            renderPassData.yCoordinateCalculator.getCoordinate(yMinorDelta) -
                renderPassData.yCoordinateCalculator.getCoordinate(0)
        );
        if (!Number.isFinite(xSpacingPx) || !Number.isFinite(ySpacingPx)) {
            return -1;
        }

        const rawSquareSize = Math.max(0, Math.min(xSpacingPx, ySpacingPx) - INNER_PADDING_PX);
        if (rawSquareSize <= 0) {
            return MIN_MARKER_SIZE_PX;
        }

        // Use linear sizing at normal zoom, then logarithmic growth for deep zoom to avoid huge sprite textures.
        const compressedSize =
            rawSquareSize <= BASE_LINEAR_SIZE_PX
                ? rawSquareSize
                : BASE_LINEAR_SIZE_PX + Math.log2(rawSquareSize - BASE_LINEAR_SIZE_PX + 1) * 6;

        const quantizedSize = Math.round(compressedSize / MARKER_SIZE_QUANTUM_PX) * MARKER_SIZE_QUANTUM_PX;
        return Math.max(MIN_MARKER_SIZE_PX, Math.min(MAX_MARKER_SIZE_PX, quantizedSize));
    }

    private getMinorDelta(axis: { majorDelta?: number; minorsPerMajor?: number }): number {
        const majorDelta = axis.majorDelta;
        if (!Number.isFinite(majorDelta) || majorDelta <= 0) {
            return -1;
        }

        const minorsPerMajor = axis.minorsPerMajor;
        if (!Number.isFinite(minorsPerMajor) || minorsPerMajor <= 0) {
            return majorDelta;
        }

        return majorDelta / minorsPerMajor;
    }

    private applyMarkerIfChanged(
        marker: PointAndFigurePointMarker,
        props: {
            width: number;
            height: number;
            strokeThickness: number;
            antiAlias: boolean;
            opacity: number;
            stroke: string;
            fill: string;
        }
    ) {
        const changed =
            marker.width !== props.width ||
            marker.height !== props.height ||
            marker.strokeThickness !== props.strokeThickness ||
            marker.antiAlias !== props.antiAlias ||
            marker.opacity !== props.opacity ||
            marker.stroke !== props.stroke ||
            marker.fill !== props.fill;

        if (!changed) {
            return;
        }

        marker.suspendUpdates();
        marker.width = props.width;
        marker.height = props.height;
        marker.strokeThickness = props.strokeThickness;
        marker.antiAlias = props.antiAlias;
        marker.opacity = props.opacity;
        marker.stroke = props.stroke;
        marker.fill = props.fill;
        marker.resumeUpdates();
    }

    private partitionValuesBySymbol(
        renderPassData: RenderPassData,
        pointSeries: IPointSeries,
        dataSeries: BaseDataSeries
    ) {
        this.xValuesSubset.clear();
        this.yValuesSubset.clear();
        this.oValuesSubsetX.clear();
        this.oValuesSubsetY.clear();

        const xValues = this.xSelector(pointSeries);
        const yValues = this.ySelector(pointSeries);
        const { startIndex, count } = this.getStartAndCount(renderPassData, xValues);
        if (count <= 0) {
            return;
        }

        const hasPSIndexes = pointSeries.indexes && pointSeries.indexes.size() > 0;
        const indexView = vectorToArrayViewF64(pointSeries.indexes, this.webAssemblyContext);
        const xView = vectorToArrayViewF64(xValues, this.webAssemblyContext);
        const yView = vectorToArrayViewF64(yValues, this.webAssemblyContext);
        const isCategoryAxis = renderPassData.xCoordinateCalculator.isCategoryCoordinateCalculator;
        const dsCount = dataSeries.count();

        for (let i = startIndex; i < startIndex + count; i++) {
            let originalDataIndex = hasPSIndexes ? indexView[i] : i;
            if (originalDataIndex < 0) {
                originalDataIndex = 0;
            } else if (originalDataIndex >= dsCount) {
                originalDataIndex = dsCount - 1;
            }

            const xCoordValue = isCategoryAxis ? originalDataIndex : xView[i];
            const yCoordValue = yView[i];
            const metadata = dataSeries.getMetadataAt(originalDataIndex) as IPointAndFigurePointMetadata;

            if (metadata?.symbolType === EPointAndFigureSymbolType.O) {
                this.oValuesSubsetX.push_back(xCoordValue);
                this.oValuesSubsetY.push_back(yCoordValue);
            } else {
                this.xValuesSubset.push_back(xCoordValue);
                this.yValuesSubset.push_back(yCoordValue);
            }
        }
    }

    private drawSingleMarker(
        renderContext: WebGlRenderContext2D,
        renderPassData: RenderPassData,
        pointSeries: IPointSeries,
        pointMarker: IPointMarker
    ) {
        this.xValuesSubset.clear();
        this.yValuesSubset.clear();

        const xValues = this.xSelector(pointSeries);
        const yValues = this.ySelector(pointSeries);
        const { startIndex, count } = this.getStartAndCount(renderPassData, xValues);
        if (count <= 0) {
            return;
        }

        const xView = vectorToArrayViewF64(xValues, this.webAssemblyContext);
        const yView = vectorToArrayViewF64(yValues, this.webAssemblyContext);
        for (let i = startIndex; i < startIndex + count; i++) {
            this.xValuesSubset.push_back(xView[i]);
            this.yValuesSubset.push_back(yView[i]);
        }

        this.drawSubset(
            renderContext.getNativeContext(),
            this.xValuesSubset,
            this.yValuesSubset,
            renderPassData,
            pointMarker
        );
    }

    private drawSubset(
        nativeContext: SCRTRenderContext,
        xValues: SCRTDoubleVector,
        yValues: SCRTDoubleVector,
        renderPassData: RenderPassData,
        pointMarker: IPointMarker
    ) {
        if (!xValues || !yValues || xValues.size() === 0 || yValues.size() === 0) {
            return;
        }

        this.args.Reset();
        this.args.verticalChart = renderPassData.isVerticalChart;
        this.args.forceShaderMethod = true;
        this.args.usePointSampling = !pointMarker.antiAlias;
        this.args.SetSpriteTexture(pointMarker.getSprite().getTexture());
        this.args.SetPalettedColors(this.emptyPalettedColors);
        this.args.paletteStart = 0;
        this.args.startIndex = 0;
        this.args.count = Math.min(xValues.size(), yValues.size());

        this.drawPoints(
            nativeContext,
            xValues,
            yValues,
            renderPassData.xCoordinateCalculator.nativeCalculator,
            renderPassData.yCoordinateCalculator.nativeCalculator,
            this.args
        );
    }

    private drawPoints(
        nativeContext: SCRTRenderContext,
        xValues: SCRTDoubleVector,
        yValues: SCRTDoubleVector,
        xCoordCalc: CoordinateCalculator,
        yCoordCalc: CoordinateCalculator,
        args: SCRTPointDrawingParams
    ) {
        args.SetNativeContext(nativeContext);
        args.SetXValues(xValues);
        args.SetYValues(yValues);
        args.SetXCoordinateCalculator(xCoordCalc);
        args.SetYCoordinateCalculator(yCoordCalc);
        this.nativeDrawingProvider.DrawPointsVec(args);
    }
}
