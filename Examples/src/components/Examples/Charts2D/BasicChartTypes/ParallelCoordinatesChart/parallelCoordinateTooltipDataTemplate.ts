import type { CursorTooltipSvgAnnotation } from "scichart";
import type { TCursorTooltipDataTemplate, TCursorTooltipSvgTemplate } from "scichart";
import { defaultCursorTooltipSvgTemplate } from "scichart";
import type { SeriesInfo } from "scichart";
import type { ParallelCoordinateDataSource, TParallelPointMetadata } from "./ParallelCoordinateDataSource";

const isParallelCoordinateHit = (seriesInfo: SeriesInfo): boolean => {
    const metadata = seriesInfo.pointMetadata as TParallelPointMetadata;
    // A PCP hit has category metadata; recordIndex < 0 marks a NaN gap point (single-series mode), which is
    // not a real record. Note: isWithinDataBounds is intentionally NOT required - the nearest-point hit-test
    // used in single-series mode can report a valid hit with isWithinDataBounds false.
    return metadata?.category !== undefined && metadata.recordIndex >= 0;
};

/**
 * Returns the {@link SeriesInfo} whose line passes closest to the cursor, out of a Parallel Coordinate Plot's
 * per-record series, or undefined if none were hit.
 * @remarks
 * Uses {@link SeriesInfo.distance}, the distance from the cursor to the series' point on the hovered category.
 * Because every record shares the same category X positions, this is effectively the vertical distance, so the
 * closest series is the record passing nearest the pointer.
 */
export const getClosestParallelCoordinateSeriesInfo = (seriesInfos: SeriesInfo[]): SeriesInfo | undefined => {
    let closest: SeriesInfo | undefined;
    seriesInfos.forEach((seriesInfo) => {
        if (!isParallelCoordinateHit(seriesInfo)) {
            return;
        }
        if (!closest || seriesInfo.distance < closest.distance) {
            closest = seriesInfo;
        }
    });
    return closest;
};

/**
 * A {@link TCursorTooltipDataTemplate} for Parallel Coordinate Plots created with
 * {@link ParallelCoordinateDataSource}, which displays the hovered point's category and the index of the
 * record (line) it belongs to, read from the point {@link TParallelPointMetadata}.
 *
 * ```ts
 * sciChartSurface.chartModifiers.add(new CursorModifier({
 *     showTooltip: true,
 *     tooltipDataTemplate: parallelCoordinateTooltipDataTemplate
 * }));
 * ```
 */
export const parallelCoordinateTooltipDataTemplate: TCursorTooltipDataTemplate = (
    seriesInfos: SeriesInfo[],
    tooltipTitle: string
): string[] => {
    const valuesWithLabels: string[] = [];
    seriesInfos.forEach((seriesInfo) => {
        if (!isParallelCoordinateHit(seriesInfo)) {
            return;
        }
        const metadata = seriesInfo.pointMetadata as TParallelPointMetadata;
        valuesWithLabels.push(`Category: ${metadata.category}`, `Record Index: ${metadata.recordIndex}`);
    });
    return valuesWithLabels;
};

/**
 * A {@link TCursorTooltipSvgTemplate} for Parallel Coordinate Plots created with {@link ParallelCoordinateDataSource},
 * which renders a tooltip for only the single record whose line passes closest to the cursor, instead of one entry
 * per record. Because a PCP draws every record as a separate series, the default cursor tooltip would otherwise list
 * every record.
 * @remarks
 * Combine with {@link parallelCoordinateTooltipDataTemplate}, which formats the content:
 * ```ts
 * sciChartSurface.chartModifiers.add(new CursorModifier({
 *     showTooltip: true,
 *     tooltipDataTemplate: parallelCoordinateTooltipDataTemplate,
 *     tooltipSvgTemplate: parallelCoordinateTooltipSvgTemplate
 * }));
 * ```
 */
export const parallelCoordinateTooltipSvgTemplate: TCursorTooltipSvgTemplate = (
    seriesInfos: SeriesInfo[],
    svgAnnotation: CursorTooltipSvgAnnotation
): string => {
    const closest = getClosestParallelCoordinateSeriesInfo(seriesInfos);
    return defaultCursorTooltipSvgTemplate(closest ? [closest] : [], svgAnnotation);
};

/**
 * Creates a {@link TCursorTooltipDataTemplate} for a Parallel Coordinate Plot built in single-series mode
 * ({@link ParallelCoordinateDataSource.useSingleSeries}). Because all records share one renderable series, the
 * cursor hit-test returns the single nearest data point; this template maps that point back to its record and
 * shows the hovered category, the record index, and every category's value for that record.
 * @remarks
 * Use with a {@link CursorModifier} configured for nearest-point hit-testing (i.e. a non-zero
 * {@link ICursorModifierOptions.hitTestRadius}) so the hovered vertex is found in coordinate space:
 * ```ts
 * sciChartSurface.chartModifiers.add(new CursorModifier({
 *     showTooltip: true,
 *     hitTestRadius: 10,
 *     tooltipDataTemplate: createParallelCoordinateTooltipDataTemplate(data),
 *     tooltipSvgTemplate: parallelCoordinateTooltipSvgTemplate
 * }));
 * ```
 */
export const createParallelCoordinateTooltipDataTemplate = (
    dataSource: ParallelCoordinateDataSource
): TCursorTooltipDataTemplate => {
    return (seriesInfos: SeriesInfo[], tooltipTitle: string): string[] => {
        const hit = getClosestParallelCoordinateSeriesInfo(seriesInfos);
        if (!hit) {
            return [];
        }
        // Prefer the record index carried on the hovered point's metadata; fall back to deriving it from the index
        const hitMetadata = hit.pointMetadata as TParallelPointMetadata;
        const recordIndex = hitMetadata?.recordIndex ?? dataSource.getRecordIndexForPoint(hit.dataSeriesIndex);
        if (recordIndex < 0) {
            return [];
        }
        const lines: string[] = [];
        if (hitMetadata?.category !== undefined) {
            lines.push(`Category: ${hitMetadata.category}`);
        }
        lines.push(`Record Index: ${recordIndex}`);
        // Then every category's actual value for the hovered record
        dataSource.categories.forEach((category) => {
            lines.push(`${category.name} = ${category.values[recordIndex]}`);
        });
        return lines;
    };
};
