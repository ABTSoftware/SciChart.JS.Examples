import { TExampleInfo } from "../AppRouter/examplePages";
import { TFrameworkName } from "../../helpers/shared/Helpers/frameworkParametrization";
import { IExampleMetadata } from "./IExampleMetadata";
import { getExampleImage } from "./exampleImages";
import { EPageLayout } from "../../helpers/types/types";

export enum EExampleProperty {
    Title = "title",
    PageTitle = "pageTitle",
    Subtitle = "subtitle",
    MetaDescription = "metaDescription",
    MarkdownContent = "markdownContent",
}

const createFrameworkPropertyGetter = <T extends string = TFrameworkName, R = string>(
    property: EExampleProperty,
    defaultValue: R = "" as R
) => {
    return (metadata: IExampleMetadata) =>
        (frameworkName: T): R => {
            const normalizedFramework = frameworkName.toLowerCase();
            const framework = metadata.frameworks[normalizedFramework];

            if (!framework) {
                console.warn(`Framework ${frameworkName} not found in metadata`);
                return defaultValue;
            }

            const value = framework[property];
            if (property === EExampleProperty.MarkdownContent) {
                return (value ?? defaultValue) as R;
            }
            return value as R;
        };
};

export const createExampleInfo = (metadata: IExampleMetadata): TExampleInfo => ({
    exampleTitle: metadata.exampleTitle,
    id: metadata.id,
    onWebsite: metadata.onWebsite,
    title: createFrameworkPropertyGetter(EExampleProperty.Title)(metadata),
    pageTitle: createFrameworkPropertyGetter(EExampleProperty.PageTitle)(metadata),
    path: metadata.path,
    filepath: metadata.filepath,
    subtitle: createFrameworkPropertyGetter<string, React.ReactElement | string>(
        EExampleProperty.Subtitle,
        ""
    )(metadata),
    metaDescription: createFrameworkPropertyGetter(EExampleProperty.MetaDescription)(metadata),
    metaKeywords: metadata.metaKeywords,
    thumbnailImage: getExampleImage(metadata.imagePath),
    markdownContent: createFrameworkPropertyGetter(EExampleProperty.MarkdownContent)(metadata),
    documentationLinks: metadata.documentationLinks,
    sandboxConfig: normalizeValue(metadata.sandboxConfig),
    pageLayout: convertPageLayout(metadata.pageLayout),
    extraDependencies: normalizeValue(metadata.extraDependencies) as Record<string, string> | undefined,
    reactComponent: metadata.reactComponent,
    isNew: metadata?.isNew,
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
