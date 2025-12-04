// const getStatsAnnotations = (value: any, surfaceIndex: number) => {
//     const surfaceMarker = new AxisMarkerAnnotation({
//         color: '#efefef',
//         backgroundColor: 'steelblue',
//         y1: surfaceIndex * 10,
//         isEditable: true,
//         formattedValue: `Surface ${surfaceIndex}`,
//     });
//     const seriesMarker = new AxisMarkerAnnotation({
//         color: '#efefef',
//         backgroundColor: 'steelblue',
//         y1: surfaceIndex * 10 + 12,
//         isEditable: true,
//         formattedValue: `Series Rendering ${surfaceIndex}`,
//     });

//     const axisMarker = new AxisMarkerAnnotation({
//         color: '#efefef',
//         backgroundColor: 'steelblue',
//         y1: surfaceIndex * 10 + 10,
//         isEditable: true,
//         formattedValue: `Axis Rendering ${surfaceIndex}`,
//     });

//     const annotationMarker = new AxisMarkerAnnotation({
//         color: '#efefef',
//         backgroundColor: 'steelblue',
//         y1: surfaceIndex * 10 + 11,
//         isEditable: true,
//         formattedValue: `Annotation Rendering ${surfaceIndex}`,
//     });
//     return [surfaceMarker, seriesMarker, axisMarker, annotationMarker];
// };
// sciChartSurface.annotations.add(...allData.flatMap(getStatsAnnotations));

// const dataLabels: IDataLabelProviderOptions = {
//     style: {
//         fontFamily: "Arial",
//         fontSize: 18,
//         multiLineAlignment: EMultiLineAlignment.Center
//     },
//     color: "red",
//     verticalTextPosition: EVerticalTextPosition.Below,
//     horizontalTextPosition: EHorizontalTextPosition.Right,
//     skipNumber: 1
//     // metaDataSelector: (metadata: any) => (metadata?.duration ? `${metadata?.duration?.toFixed(2)}` : undefined)
// };

// sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
//     new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();

// let lastSelectedDataPointIndex = -1;
// const onHoverChanged = (args: HoveredChangedArgs) => {
//     if (args.hoveredSeries.length === 0 && lastSelectedDataPointIndex >= 0) {
//         const yValue = dataSeries.getNativeYValues().get(lastSelectedDataPointIndex);
//         const metadata = dataSeries.getMetadataAt(lastSelectedDataPointIndex) as TCustomMetadata;
//         metadata.isHovered = false;
//         dataSeries.update(lastSelectedDataPointIndex, yValue, metadata);
//         lastSelectedDataPointIndex = -1;
//     } else if (args.hoveredSeries.length > 0 && args.hitTestInfo) {
//         const yValue = dataSeries.getNativeYValues().get(args.hitTestInfo.point2dataSeriesIndex);
//         const metadata = dataSeries.getMetadataAt(args.hitTestInfo.point2dataSeriesIndex) as TCustomMetadata;
//         metadata.isHovered = true;
//         dataSeries.update(args.hitTestInfo.point2dataSeriesIndex, yValue, metadata);
//         lastSelectedDataPointIndex = args.hitTestInfo.point2dataSeriesIndex;
//     }
// };
