import { TExampleInfo } from "../AppRouter/examplePages";
import { TFrameworkName } from "../../helpers/shared/Helpers/frameworkParametrization";
import { IExampleMetadata } from "./IExampleMetadata";
import { getExampleImage } from "./exampleImages";
import { EPageLayout } from "../../helpers/types/types";

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
    markdownContent: (frameworkName: TFrameworkName) => {
        const res = metadata.frameworks[frameworkName.toLowerCase()].markdownContent;
        return res ?? "";
    },
    documentationLinks: metadata.documentationLinks,
    sandboxConfig: normalizeValue(metadata.sandboxConfig),
    pageLayout: convertPageLayout(metadata.pageLayout),
    extraDependencies: normalizeValue(metadata.extraDependencies) as Record<string, string> | undefined,
});

function normalizeValue(value: unknown): unknown {
    if (
        value === null ||
        value === undefined ||
        value === "" ||
        (typeof value === "object" && value !== null && Object.keys(value).length === 0)
    ) {
        return undefined;
    }
    return value;
}

function convertPageLayout(value?: string): EPageLayout | undefined {
    if (!value) return undefined;
    if (value === "default") return undefined;
    return value as EPageLayout;
}
