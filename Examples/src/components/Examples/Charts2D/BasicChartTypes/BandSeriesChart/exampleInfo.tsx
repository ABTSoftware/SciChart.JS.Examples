import { IExampleMetadata } from "../../../IExampleMetadata";
import { metaData } from "./BandSeriesChartMetadata";
import { createExampleInfo } from "../../../exampleInfoUtils";

// const previewDescription = `Band Charts fill a polygon between two high and low lines. The colour of the polygon changes depending on which line Y1 or Y2 is higher.`;
// const description = `This JavaScript chart type can be used to draw thresholds, a fill between two lines or areas of interest on a chart.`;
// const tips = [
//     `If you have data where Y1 is greater than Y2 always, you'll get an envelope effect. Great for rendering
//     confidence intervals, error margins or Bollinger Bands!`,
// ];

// Original implementation commented out for reference
/*
export const bandSeriesChartExampleInfo = {
    onWebsite: metaData.onWebsite,
    title: (frameworkName: TFrameworkName) => metaData.frameworks[frameworkName.toLowerCase()].title,
    pageTitle: (frameworkName: TFrameworkName) => metaData.frameworks[frameworkName.toLowerCase()].pageTitle,
    path: metaData.path,
    filepath: metaData.filepath,
    subtitle: (frameworkName: string) => metaData.frameworks[frameworkName.toLowerCase()].subtitle,
    metaDescription: (frameworkName: TFrameworkName) => metaData.frameworks[frameworkName.toLowerCase()].metaDescription,
    metaKeywords: metaData.metaKeywords,
    thumbnailImage: getExampleImage(metaData.imagePath),
    markdownContent: metaData.markdownContent,
    documentationLinks: metaData.documentationLinks
};
*/

// New implementation using centralized utility
export const bandSeriesChartExampleInfo = createExampleInfo(metaData as IExampleMetadata);
