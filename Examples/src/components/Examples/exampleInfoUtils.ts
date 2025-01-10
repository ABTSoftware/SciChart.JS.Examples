import { TExampleInfo } from "../AppRouter/examplePages";
import { TFrameworkName } from "../../helpers/shared/Helpers/frameworkParametrization";
import { IExampleMetadata } from "./IExampleMetadata";
import { getExampleImage } from "./exampleImages";

export const createExampleInfo = (metadata: IExampleMetadata): TExampleInfo => ({
    onWebsite: metadata.onWebsite,
    title: (frameworkName: TFrameworkName) => metadata.frameworks[frameworkName.toLowerCase()].title,
    pageTitle: (frameworkName: TFrameworkName) => metadata.frameworks[frameworkName.toLowerCase()].pageTitle,
    path: metadata.path,
    filepath: metadata.filepath,
    subtitle: (frameworkName: string) => metadata.frameworks[frameworkName.toLowerCase()].subtitle,
    metaDescription: (frameworkName: TFrameworkName) =>
        metadata.frameworks[frameworkName.toLowerCase()].metaDescription,
    metaKeywords: metadata.metaKeywords,
    thumbnailImage: getExampleImage(metadata.imagePath),
    markdownContent: metadata.markdownContent,
    documentationLinks: metadata.documentationLinks,
});
