import {
    AxisRenderer,
    WebGlRenderContext2D,
    EAxisAlignment,
    TTextStyle,
    LabelProviderBase2D,
    DebugForDpi,
    getIsHorizontal,
    getIsVertical,
    Rect,
    parseColorToUIntArgb,
    getTextBounds,
    convertMultiLineAlignment,
    DpiHelper,
    Logger,
    TTickLineStyle,
    getVectorColorVertex,
    getVertex,
    ELineDrawMode,
} from "scichart";
import { SCRTPen } from "scichart/types/TSciChart";

export default class CustomAxisRenderer extends AxisRenderer {
    public drawLabels(
        renderContext: WebGlRenderContext2D,
        axisAlignment: EAxisAlignment,
        isInnerAxis: boolean,
        tickLabels: string[],
        tickCoords: number[],
        axisOffset: number,
        labelStyle: TTextStyle,
        isVerticalChart: boolean,
        isFlippedCoordinates: boolean,
        labelProvider: LabelProviderBase2D
    ) {
        if (DebugForDpi) {
            console.log(`AxisRenderer.drawLabels. fontSize: ${labelStyle.fontSize}`);
        }
        const { viewRect, textureManager } = this;
        const nativeContext = renderContext.getNativeContext();

        const isAxisFlipped = isVerticalChart ? getIsHorizontal(axisAlignment) : getIsVertical(axisAlignment);

        const width = Math.floor(viewRect.width);
        const height = Math.floor(viewRect.height);
        const tickSize = this.desiredTicksSize;

        let ctx: CanvasRenderingContext2D;
        const { padding, alignment, multilineAlignment } = labelStyle;

        if (isAxisFlipped) {
            tickCoords = tickCoords.reverse();
            tickLabels = tickLabels.reverse();
        }
        // for debug
        const labelRects: Rect[] = [];
        const textColor = parseColorToUIntArgb(labelStyle.color);
        const nativeFont = labelProvider.useNativeText
            ? renderContext.getFont(labelStyle, labelProvider.rotation !== 0)
            : null;
        const textBounds = labelProvider.useNativeText ? getTextBounds(this.webAssemblyContext) : null;

        if (!nativeFont) {
            // The clearRect in here is slow.
            ctx = textureManager.getTextureContext(width, height);
        }
        let adjRotation = labelProvider.rotation;
        if (adjRotation > 90) adjRotation -= 180;
        else if (adjRotation < -90) adjRotation += 180;
        const rotationRad = -(adjRotation * Math.PI) / 180;

        tickCoords = tickCoords.map((t) => t - axisOffset);
        const mlaNative = convertMultiLineAlignment(multilineAlignment, this.webAssemblyContext);
        const nativeLineSpacing = labelProvider.lineSpacing;
        let lineHeight = 0;
        if (nativeFont) {
            nativeFont.CalculateStringBounds("Ag", textBounds, 0);
            lineHeight = textBounds.GetLineBounds(0).m_fHeight;
        }
        const clipRect = this.getClipRect();

        if (getIsHorizontal(axisAlignment)) {
            document.querySelectorAll(".x-axis-label").forEach((el) => el.remove());

            let labelHeights: number[] = [];
            let labelWidths: number[] = [];
            if (!labelProvider.useCache && labelProvider.useNativeText) {
                for (const label of tickLabels) {
                    nativeFont.CalculateStringBounds(label ?? "", textBounds, 2);
                    labelHeights.push(textBounds.m_fHeight + labelStyle.padding.top + labelStyle.padding.bottom);
                    labelWidths.push(textBounds.m_fWidth + labelStyle.padding.left + labelStyle.padding.right);
                }
            } else {
                labelHeights = tickLabels.map((label) => labelProvider.getLabelHeight(ctx, label, labelStyle));
                labelWidths = tickLabels.map((label) => labelProvider.getLabelWidth(ctx, label, labelStyle));
            }
            const { labelCoords, labelIndexes } = this.layoutLabels(
                width,
                tickCoords,
                labelWidths,
                isFlippedCoordinates,
                padding?.top,
                padding?.bottom
            );

            for (let index = 0; index < labelIndexes.length; index++) {
                const xCoord = labelCoords[index];
                let labelText = tickLabels[labelIndexes[index]];
                const labelHeight = labelHeights[labelIndexes[index]];
                const labelWidth = labelWidths[labelIndexes[index]];
                let yCoord = 0;
                // Always align to the axis for horizontal
                if (
                    (axisAlignment === EAxisAlignment.Bottom && !isInnerAxis) ||
                    (axisAlignment === EAxisAlignment.Top && isInnerAxis)
                ) {
                    yCoord += tickSize;
                } else {
                    yCoord += height - labelHeight - tickSize;
                }
                if (this.drawDebug) {
                    labelRects.push(Rect.create(xCoord, yCoord, labelWidth, labelHeight));
                }
                try {
                    const tx = xCoord + viewRect.left + padding.left;
                    const ty = yCoord + viewRect.top + lineHeight + padding.top;
                    const rxc = tx;
                    const ryc = ty - lineHeight;

                    let { text, x, y, rx, ry, rotationRadians, color } = labelProvider.adjustLabel(
                        index,
                        labelText,
                        labelWidth,
                        labelHeight,
                        tx,
                        ty,
                        rxc,
                        ryc,
                        rotationRad
                    );

                    const svgContrainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svgContrainer.setAttribute("class", "x-axis-label");
                    svgContrainer.setAttribute("x", Math.round((x - padding.left) / DpiHelper.PIXEL_RATIO).toString());
                    svgContrainer.setAttribute(
                        "y",
                        Math.round((y - lineHeight - padding.top) / DpiHelper.PIXEL_RATIO).toString()
                    );
                    svgContrainer.setAttribute("width", (labelWidth / DpiHelper.PIXEL_RATIO).toString());
                    svgContrainer.setAttribute("height", (labelHeight / DpiHelper.PIXEL_RATIO).toString());

                    // add rect
                    const svgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    svgRect.setAttribute("x", "0");
                    svgRect.setAttribute("y", "0");
                    svgRect.setAttribute("width", (labelWidth / DpiHelper.PIXEL_RATIO).toString());
                    svgRect.setAttribute("height", (labelHeight / DpiHelper.PIXEL_RATIO).toString());
                    svgRect.setAttribute("fill", "#ffffff");
                    svgRect.setAttribute("rx", "5");
                    svgRect.setAttribute("ry", "5");

                    const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    textEl.textContent = text;
                    textEl.setAttribute("x", (labelWidth / DpiHelper.PIXEL_RATIO / 2).toString());
                    textEl.setAttribute("y", (labelHeight / DpiHelper.PIXEL_RATIO / 2 + 1).toString());
                    textEl.setAttribute("font-size", "12"); // labelStyle.fontSize.toString());
                    textEl.setAttribute("font-family", "Arial"); // labelStyle.fontFamily);
                    textEl.setAttribute("fill", "#222222"); // color.toString());
                    textEl.setAttribute("text-anchor", "middle");
                    textEl.setAttribute("dominant-baseline", "middle");
                    textEl.setAttribute("pointer-events", "none");

                    if (rotationRadians) {
                        const degrees = (rotationRadians * 180) / Math.PI;
                        textEl.setAttribute("transform", `rotate(${degrees} ${Math.round(rx)} ${Math.round(ry)})`);
                    }

                    svgContrainer.appendChild(svgRect);
                    svgContrainer.appendChild(textEl);
                    this.parentAxis.parentSurface.domSvgAdornerLayer.appendChild(svgContrainer);
                } catch (err) {
                    Logger.debug(err);
                    // webgl context probably lost.  Clear the label cache
                    labelProvider.delete();
                }
            }
        } else {
            document.querySelectorAll(".y-axis-label").forEach((el) => el.remove());

            let labelHeights: number[] = [];
            let labelWidths: number[] = [];
            if (!labelProvider.useCache && labelProvider.useNativeText) {
                for (const label of tickLabels) {
                    nativeFont.CalculateStringBounds(label ?? "", textBounds, 2);
                    labelHeights.push(textBounds.m_fHeight + labelStyle.padding.top + labelStyle.padding.bottom);
                    labelWidths.push(textBounds.m_fWidth + labelStyle.padding.left + labelStyle.padding.right);
                }
            } else {
                labelHeights = tickLabels.map((label) => labelProvider.getLabelHeight(ctx, label, labelStyle));
                labelWidths = tickLabels.map((label) => labelProvider.getLabelWidth(ctx, label, labelStyle));
            }
            const { labelCoords, labelIndexes } = this.layoutLabels(
                height,
                tickCoords,
                labelHeights,
                isFlippedCoordinates,
                padding?.left,
                padding?.right
            );
            for (let index = 0; index < labelIndexes.length; index++) {
                let xCoord = 0;
                const labelText = tickLabels[labelIndexes[index]];
                const labelWidth = labelWidths[labelIndexes[index]];
                const labelHeight = labelHeights[labelIndexes[index]];
                xCoord = this.adjustForLabelAlignment(
                    xCoord,
                    labelWidth,
                    alignment,
                    axisAlignment,
                    isInnerAxis,
                    width,
                    tickSize
                );
                const yCoord = labelCoords[index];
                if (this.drawDebug) {
                    labelRects.push(Rect.create(xCoord, yCoord, labelWidth, labelHeight));
                }
                try {
                    const tx = xCoord + viewRect.left + padding.left;
                    const ty = yCoord + viewRect.top + lineHeight + padding.top;
                    const rxc = tx;
                    const ryc = ty - lineHeight;

                    let { text, x, y, rx, ry, rotationRadians, color } = labelProvider.adjustLabel(
                        index,
                        labelText,
                        labelWidth,
                        labelHeight,
                        tx,
                        ty,
                        rxc,
                        ryc,
                        rotationRad
                    );
                    const svgContrainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svgContrainer.setAttribute("class", "y-axis-label");
                    svgContrainer.setAttribute("x", Math.round((x - padding.left) / DpiHelper.PIXEL_RATIO).toString());
                    svgContrainer.setAttribute(
                        "y",
                        Math.round((y - lineHeight - padding.top) / DpiHelper.PIXEL_RATIO).toString()
                    );
                    svgContrainer.setAttribute("width", (labelWidth / DpiHelper.PIXEL_RATIO).toString());
                    svgContrainer.setAttribute("height", (labelHeight / DpiHelper.PIXEL_RATIO).toString());

                    // add rect
                    const svgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    svgRect.setAttribute("x", "0");
                    svgRect.setAttribute("y", "0");
                    svgRect.setAttribute("width", (labelWidth / DpiHelper.PIXEL_RATIO).toString());
                    svgRect.setAttribute("height", (labelHeight / DpiHelper.PIXEL_RATIO).toString());
                    svgRect.setAttribute("fill", "#ffffff");
                    svgRect.setAttribute("rx", "5");
                    svgRect.setAttribute("ry", "5");

                    const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    textEl.textContent = text;
                    textEl.setAttribute("x", (labelWidth / DpiHelper.PIXEL_RATIO / 2).toString());
                    textEl.setAttribute("y", (labelHeight / DpiHelper.PIXEL_RATIO / 2 + 1).toString());
                    textEl.setAttribute("font-size", "12"); // labelStyle.fontSize.toString());
                    textEl.setAttribute("font-family", "Arial"); // labelStyle.fontFamily);
                    textEl.setAttribute("fill", "#222222"); // color.toString());
                    textEl.setAttribute("text-anchor", "middle");
                    textEl.setAttribute("dominant-baseline", "middle");
                    textEl.setAttribute("pointer-events", "none");

                    if (rotationRadians) {
                        const degrees = (rotationRadians * 180) / Math.PI;
                        textEl.setAttribute("transform", `rotate(${degrees} ${Math.round(rx)} ${Math.round(ry)})`);
                    }

                    svgContrainer.appendChild(svgRect);
                    svgContrainer.appendChild(textEl);
                    this.parentAxis.parentSurface.domSvgAdornerLayer.appendChild(svgContrainer);
                } catch (err) {
                    Logger.debug(err);
                    // webgl context probably lost.  Clear the label cache
                    labelProvider.delete();
                }
            }
        }

        if (this.drawDebug) {
            this.drawLabelViewRects(renderContext, viewRect, labelRects);
        }
    }

    public drawTicks(
        renderContext: WebGlRenderContext2D,
        axisAlignment: EAxisAlignment,
        isInnerAxis: boolean,
        tickCoords: number[],
        axisOffset: number,
        pen: SCRTPen,
        tickStyle: TTickLineStyle
    ) {
        if (!tickCoords || tickCoords.length === 0) return;
        const { viewRect } = this;
        const { tickSize } = tickStyle;
        const vertices = getVectorColorVertex(this.webAssemblyContext);
        const isHorizontal = getIsHorizontal(axisAlignment);
        const vertex = getVertex(this.webAssemblyContext, 0, 0);
        if (isHorizontal === undefined) {
            return;
        }
        tickCoords.forEach((tc) => {
            let x1, x2, y1, y2;
            if (isInnerAxis) {
                if (isHorizontal) {
                    x1 = tc;
                    x2 = tc;
                    y1 = axisAlignment === EAxisAlignment.Top ? 0 : viewRect.height;
                    y2 = axisAlignment === EAxisAlignment.Top ? tickSize : viewRect.height - tickSize;
                } else {
                    x1 = axisAlignment === EAxisAlignment.Left ? 0 : viewRect.width;
                    x2 = axisAlignment === EAxisAlignment.Left ? tickSize : viewRect.width - tickSize;
                    y1 = tc;
                    y2 = tc;
                }
            } else {
                if (isHorizontal) {
                    x1 = tc;
                    x2 = tc;
                    y1 = axisAlignment === EAxisAlignment.Bottom ? 0 : viewRect.height;
                    y2 = axisAlignment === EAxisAlignment.Bottom ? tickSize : viewRect.height - tickSize;

                    const svgContrainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svgContrainer.setAttribute("class", "y-axis-label");
                    svgContrainer.setAttribute("x", Math.round(x1 / DpiHelper.PIXEL_RATIO).toString());
                    svgContrainer.setAttribute("y", Math.round(y1 / DpiHelper.PIXEL_RATIO).toString());

                    const svgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    svgCircle.setAttribute("cx", Math.round(x1 / DpiHelper.PIXEL_RATIO).toString());
                    svgCircle.setAttribute("cy", Math.round(y1 / DpiHelper.PIXEL_RATIO).toString());
                    svgCircle.setAttribute("r", "30");
                    svgCircle.setAttribute("fill", "#ffffff");
                    // svgContrainer.setAttribute("width", (labelWidth / DpiHelper.PIXEL_RATIO).toString());
                    // svgContrainer.setAttribute("height", (labelHeight / DpiHelper.PIXEL_RATIO).toString());
                } else {
                    x1 = axisAlignment === EAxisAlignment.Right ? 0 : viewRect.width;
                    x2 = axisAlignment === EAxisAlignment.Right ? tickSize : viewRect.width - tickSize;
                    y1 = tc;
                    y2 = tc;
                }
            }

            vertex.SetPosition(x1, y1);
            vertices.push_back(vertex);
            vertex.SetPosition(x2, y2);
            vertices.push_back(vertex);
        });
        const leftOffset = viewRect.left - (isHorizontal ? axisOffset : 0);
        const topOffset = viewRect.top - (isHorizontal ? 0 : axisOffset);
        renderContext.drawLinesNative(
            vertices,
            pen,
            ELineDrawMode.DiscontinuousLine,
            this.getClipRect(),
            leftOffset,
            topOffset
        );
    }
}
