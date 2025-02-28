# Adding a New Example

This guide outlines the steps for adding a new example to the SciChart examples repository. The examples are designed to work across multiple frameworks (React, vanilla JavaScript/TypeScript, and Angular) and are dynamically loaded via Webpack contexts. All example-related files reside in the same folder to simplify sharing common data, libraries, and drawing logic.

---

## Overview

Each example consists of several components:

-   **exampleInfo File:**  
    Each example includes an `exampleInfo` file (typically `exampleInfo.tsx`) containing metadata and configuration. For example:

    -   In `BuilderApi/ChartFromJSON/exampleInfo.tsx`, metadata is set using the function `createExampleInfo` and includes fields such as:
        -   `reactComponent`: Specifies the React component name (e.g. "ChartFromJSON").
        -   `id` and `exampleId`: Unique identifiers for the example.
        -   `imagePath`: Filename for the example thumbnail.
        -   `description`: A detailed description with embedded markdown for emphasis.
        -   Framework-specific data under the `frameworks` object, where each framework (React, JavaScript, Angular) has its own title, pageTitle, metaDescription, subtitle, and optionally markdownContent.
    -   Note that even though comments (e.g., "//// This metadata is computer generated - do not edit!") suggest that some fields are generated, developers must supply initial values when creating a new example.

-   **Framework Implementations:**  
    Each example typically provides implementations for three fronts:

    -   **React:**  
        A main file (usually `index.tsx`) exports a React component that initializes the chart using SciChart. For instance, in `BuilderApi/CustomTypes/index.tsx`, the React component renders `<SciChartReact>` with an initialization function (`drawExample`).
    -   **Vanilla JavaScript/TypeScript:**  
        Files such as `vanilla.js` and `vanilla.ts` demonstrate how to run the example without React. They import the same `drawExample` function and handle chart creation/disposal manually.
    -   **Angular:**  
        An Angular component (e.g. `angular.ts` from the CustomTypes folder) shows how to integrate the drawing functionality into an Angular application by using components like `ScichartAngularComponent`.

-   **Shared Drawing Logic:**  
    The actual chart creation is encapsulated in shared files (e.g., `drawExample.js` and `drawExample.ts`). These files:

    -   Define the steps to build a SciChart surface.
    -   Register custom types, such as PaletteProviders (as seen in the CustomTypes examples).
    -   Include logic to generate data series and configure annotations.
        This allows all three implementations (React, vanilla, Angular) to use the same underlying drawing code.

-   **Dynamic Loading Mechanism:**  
    The repository employs a dynamic loading strategy:
    -   In [examplePages.ts](src/components/AppRouter/examplePages.ts), a Webpack context (`require.context`) scans recursively for files matching the pattern `exampleInfo(.js|.ts|.tsx)` in the `Examples` directory. The metadata from these files constructs the collection of available examples.
    -   In [getExampleComponent.ts](src/components/AppRouter/getExampleComponent.ts), the system dynamically loads the corresponding framework component by using:
        -   The `exampleDirectory` property (embedded in the metadata) to determine the folder.
        -   The `reactComponent` field to locate the correct exported component in the corresponding `index.tsx` file.
            This design ensures that new examples are automatically integrated without manual registration.

---

## Steps to Create a New Example

1. **Copy an Existing Example Folder**  
   Begin by duplicating an existing folder from the repository (for example, one from `BuilderApi/ChartFromJSON` or `BuilderApi/CustomTypes`). This gives you a working template with correctly structured files:

    - An `exampleInfo.tsx` file with metadata.
    - Implementation files such as `index.tsx`, `vanilla.js`/`vanilla.ts`, and `angular.ts`.
    - Shared drawing logic files (e.g. `drawExample.js`/`drawExample.ts`).

2. **Create/Modify the `exampleInfo` File**

    - **Duplicate the Template:**  
      Copy the existing `exampleInfo.tsx` file into your new example folder.
    - **Update Metadata:**  
      Edit the metadata fields to reflect your new example:
        - Set `reactComponent` to the name of your React component.
        - Choose unique values for `id` and `exampleId`.
        - Update `imagePath` with the new thumbnail image filename.
        - Revise the `description` to accurately describe your example.
        - Modify all framework-specific properties in the `frameworks` object (titles, pageTitles, metaDescriptions, and subtitles).
        - Ensure fields such as `path`, `filepath`, and any extra dependencies are updated as necessary.

    **Important:** Although metadata comments (e.g., "This metadata is computer generated") might suggest not to modify it, initial values must be provided by the developer. These values will feed into the dynamic example loading during the build. **IT IS ABSOLUTELY IMPERATIVE THAT THE COMMENTS ARE MAINTAINED IN THE CORRECT PLACE** as this file will be the target for generated content.

3. **Implement the Example Code**

    - **React Implementation:**  
      Create or update the main React entry file (typically `index.tsx`). This file should export a React component that calls the shared drawing function (e.g., `drawExample`) wrapped in a SciChart React component.
    - **Vanilla JavaScript/TypeScript Implementation:**  
      Provide `vanilla.js` and/or `vanilla.ts` files that import and execute the `drawExample` function to set up the chart on a given HTML element. They should also include a cleanup mechanism.
    - **Angular Implementation:**  
      Develop an Angular component (such as `angular.ts`) that imports the drawing function and integrates it using SciChart’s Angular component (`ScichartAngularComponent`). The example should demonstrate the Angular-specific way of handling components and data binding.

4. **Share Data and Libraries**  
   By keeping all example files in one folder, you guarantee:

    - Consistent access to shared resources like themes (e.g., `appTheme`) and utility functions.
    - Simplified dependency management since all implementations refer to the same drawing logic.

5. **Dynamic Loading of Examples**  
   The system automatically incorporates new examples using the following approach:

    - **Webpack Context:**  
      As described in [examplePages.ts](src/components/AppRouter/examplePages.ts), the repository creates a Webpack context that looks for `exampleInfo` files across the examples. This gathers all metadata into a single collection.
    - **Component Importer:**  
      [getExampleComponent.ts](src/components/AppRouter/getExampleComponent.ts) uses the metadata (including `exampleDirectory` and `reactComponent`) to dynamically import the correct component for rendering.

    Reviewing these two files will provide further insight into how your new example will be integrated during runtime.

6. **Final Notes and Recommendations**
    - Always start by copying a fully working `exampleInfo` file from an existing example.
    - Ensure that all three framework implementations (React, vanilla JavaScript/TypeScript, and Angular) are updated consistently and correctly point to shared drawing logic.
    - Verify that your metadata fields are updated accurately—even though some parts might be regenerated during the build, the initial configuration must be correct.
    - Familiarize yourself with the dynamic example loading process by examining [examplePages.ts](src/components/AppRouter/examplePages.ts) and [getExampleComponent.ts](src/components/AppRouter/getExampleComponent.ts).

By following these detailed steps and referring to the provided examples in your repository (such as those in the BuilderApi directories), developers can add new examples that seamlessly integrate into the dynamically loaded system across all supported frameworks.

---

Happy coding!
