export interface IExampleMetadata {
    /** Not used anywhere. Use the `frameworks.<frameworkName>.title` instead */
    exampleTitle?: string;
    id: string; // another different unique id!!
    /** Path to the example's thumbnail image */
    imagePath: string; 
    /** General description of the example */
    description: string; 
    /** Array of tips related to the example */
    tips: string[]; 
    /** Framework-specific data keyed by framework name (e.g., "react", "angular", "javascript") */
    frameworks: Record<string, IFrameworkData>; 
    /** Links to related documentation */
    documentationLinks?: IDocumentationLink[]; 
    /** URL path for the example */
    path: string; 
    /** Meta keywords for SEO */
    metaKeywords: string; 
    /** Whether the example is shown on the website */
    onWebsite: boolean; 
    /** File path for the example */
    filepath: string; 
    /** The image that will appear in the example grid */
    thumbnailImage: string;
    /** Optional layout type for the example page 
     * @options "default" | "max-width"  
     * @note choose "max-width" for a big dashboard example
     */
    pageLayout?: string;
    extraDependencies?: Record<string, string>;
    sandboxConfig?: Record<string, any>;
    /** The optional .md formatted string that provides any additional info */
    markdownContent?: string | null;
    reactComponent?: string | null;
    /** Flag to indicate if the example is new (if new it will have a banner across the thumbnail) */
    isNew?: boolean; 
    /**
     * Optional alternative names for the chart type that will be displayed on the example page, under the description
     * 
     * @example "This type of plot is also known as a Spider Chart, Web Chart, Cobweb Chart, or Kiviat Chart"
     *
     * @example "This chart type is also known as a Scatter Plot, Dot Plot, or XY-Plot"
     * 
     * !! Markdown formatting supported
     */
    alsoKnownAs?: string;
}

export interface IDocumentationLink {
    href: string; // URL for the documentation link
    title: string; // Title of the documentation link
    linkTitle: string; // Link title for the documentation link
}

export interface IFrameworkData {
    /** 
     * The subtitle `<h2>` that shows under the title  
     * @note Markdown formatted string
     */
    subtitle: string; 
    /** 
     * The title that will show on the example page as the `<h1>` 
     * @note Markdown formatted string
     */
    title: string; 
    /** 
     * The page title (what shows in the browser tab)
     */
    pageTitle: string; 
    /** 
     * Meta description (what shows in search engine results under the page title) 
     * @note Plain text string (not MD)
     */
    metaDescription: string; 
    markdownContent: string | null; 
}
