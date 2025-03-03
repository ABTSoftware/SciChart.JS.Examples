import React from "react";
import { EPageLayout, GalleryItem } from "../../helpers/types/types";
import { TPage } from "./pages";
import { TFrameworkTemplate } from "../../helpers/shared/Helpers/frameworkParametrization";
import { TDocumentationLink } from "../../helpers/types/ExampleDescriptionTypes";
import EXAMPLE_PAGES_DATA from "./examplePaths";

export type TExampleInfo = {
    exampleTitle: string;
    id: string;
    /**
     * Example title
     */
    title: TFrameworkTemplate;
    /**
     * Meta title
     */
    pageTitle: TFrameworkTemplate;
    path: string;

    /**
     * Content shown below title on example page
     */
    subtitle: (frameworkName: string) => React.ReactElement | string;
    /**
     * Page meta description
     */
    metaDescription: TFrameworkTemplate;

    /**
     * The first link is used in the docs button in the header
     */
    documentationLinks: TDocumentationLink[];

    // If this example has been created on scichart.com
    onWebsite?: boolean;
    /**
     * OPTIONAL: If provided, use these items as a See Also. If not, they will be auto-generated from similar items
     * in the top level menu. See {@link getSeeAlsoGalleryItems}
     */
    seeAlso?: GalleryItem[];

    /**
     * Page meta keywords
     */
    metaKeywords: string;
    thumbnailImage?: string;
    // path to actual folder for CodeSandbox
    filepath: string;
    // additional module dependencies
    extraDependencies?: Record<string, string>;
    codeSandBoxNotWorking?: boolean;
    sandboxConfig?: Record<string, any>;
    /**
     * Markdown content for the page, will help with SEO and editing
     */
    markdownContent?: TFrameworkTemplate;
    pageLayout?: EPageLayout;
    reactComponent?: string;
    exampleDirectory?: string;
};

export type TExamplePage = TPage & TExampleInfo;

// now update the exaples pages with dynamically loaded module as well
// and check the ids are the same
/// <reference types="webpack-env" />
declare var require: any;
// Create a webpack context for files ending with "exampleInfo.tsx" (or .js/.ts)
const examplesContext = require.context("../Examples", true, /exampleInfo(\.js|\.ts|\.tsx)?$/);

// Convert a module path to the key expected by the context.
const loadModule = (modulePath: string) => {
    const relativePath = "./" + modulePath.replace(/^(\.\.\/)+Examples\//, "");
    return examplesContext(relativePath);
};

function makeExamplesPagesNew(examples: string[]): Record<string, TExamplePage> {
    const res = examples.reduce((acc: any, path: string) => {
        const mod = loadModule(path + "/exampleInfo.tsx");
        const moduleExport = mod.default;
        moduleExport.exampleDirectory = path;
        const id = moduleExport.id;
        acc[id] = moduleExport;
        return acc;
    }, {});
    return res;
}

export const EXAMPLES_PAGES = makeExamplesPagesNew(EXAMPLE_PAGES_DATA);
