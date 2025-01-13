import { ExampleImagePath } from "./exampleImages";

export interface IExampleMetadata {
    exampleId: string; // Unique identifier for the example
    imagePath: string; // Path to the example's thumbnail image
    title: string; // Title of the example
    description: string; // General description of the example
    tips: string[]; // Array of tips related to the example
    frameworks: Record<string, IFrameworkData>; // Framework-specific data keyed by framework name (e.g., "react", "angular", "javascript")
    documentationLinks: IDocumentationLink[]; // Links to related documentation
    path: string; // URL path for the example
    metaKeywords: string; // Meta keywords for SEO
    onWebsite: boolean; // Whether the example is shown on the website
    filepath: string; // File path for the example
}

export interface IDocumentationLink {
    href: string; // URL for the documentation link
    title: string; // Title of the documentation link
    linkTitle: string; // Link title for the documentation link
}

export interface IFrameworkData {
    component: string; // Name of the framework-specific component
    subtitle: string; // Markdown formatted subtitle for the framework
    title: string; // Framework-specific title
    pageTitle: string; // Framework-specific page title
    metaDescription: string; // Framework-specific meta description
    markdownContent: string | null; // Framework-specific markdown content
}
