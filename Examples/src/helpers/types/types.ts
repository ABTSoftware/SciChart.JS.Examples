import type { ProjectTemplate, ProjectDependencies, ProjectSettings, ProjectFiles } from "@stackblitz/sdk";
import type { EPageFramework } from "../shared/Helpers/frameworkParametrization";

export type GalleryItem = {
    chartGroupTitle: string;
    id: string;
    items: {
        imgPath: string;
        title: string;
        seoTitle: string;
        examplePath: string;
        subtitle?: string;
        metaDescription?: string;
        isNew?: boolean;
    }[];
};

/**
 * Describes the layout of the page where the chart is displayed relative to the source code component
 */
export enum EPageLayout {
    /**
     * Where the chart needs to be displayed in the full width of the page (e.g. oil-gas dashboard)
     */
    MaxWidth = "max-width",
    /**
     * Where the chart can sit beside the code when the content container has enough space
     */
    Default = "default",
}

export enum ETheme {
    navy = "navy",
    dark = "dark",
    light = "light",
}

export type ExampleSourceFile = { name: string; content: string };
export type SourceFilesVariant = { files: ExampleSourceFile[]; framework: EPageFramework };

export interface StackBlitzResponse {
    files: ProjectFiles;
    title: string;
    description: string;
    template: ProjectTemplate;
    dependencies: ProjectDependencies;
    devDependencies: ProjectDependencies;
    settings: ProjectSettings;
}
