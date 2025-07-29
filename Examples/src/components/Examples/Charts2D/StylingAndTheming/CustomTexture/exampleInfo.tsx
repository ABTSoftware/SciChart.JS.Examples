import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "CustomTexture",
        id: "chart2D_stylingAndTheming_CustomTexture",
        imagePath: "javascript-custom-texture.jpg",
        description:
            "Creates a **Custom Texture** example with multiple renderableSeries, all allowing for **customTextureOptions** images.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **Custom Texture** example with multiple renderableSeries, all allowing for **customTextureOptions** images.",
                title: "JavaScript Custom Texture",
                pageTitle: "JavaScript Custom Texture | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Custom Texture Example - JavaScript\n\n## Overview\nThis example demonstrates how to apply custom textures to various series types in SciChart.js using JavaScript. It showcases texture mapping on **FastTriangleRenderableSeries**, **FastRectangleRenderableSeries**, **FastBandRenderableSeries**, and **SplineMountainRenderableSeries** with different image sources.\n\n## Technical Implementation\nThe implementation uses the [ImageTextureOptions](https://www.scichart.com/documentation/js/current/interfaces/icustomtextureoptions.html) interface to define custom textures for each series. Images are loaded asynchronously using **createImageAsync** and applied via the **customTextureOptions** property. The example utilizes [XyxyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyxydataseries.html) for triangle series and [XyyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyydataseries.html) for band series.\n\n## Features and Capabilities\nThe example highlights texture mapping capabilities with different draw modes ([ETriangleSeriesDrawMode](https://www.scichart.com/documentation/js/current/enums/etriangleseriesdrawmode.html)) and series types. It demonstrates texture repetition control and opacity adjustments for layered visual effects.\n\n## Integration and Best Practices\nThe chart surface is initialized asynchronously with proper cleanup handling. Developers can extend this pattern for dynamic texture updates and performance optimization in data-intensive applications.",
            },
            react: {
                subtitle:
                    "Creates a **Custom Texture** example with multiple renderableSeries, all allowing for **customTextureOptions** images.",
                title: "React Custom Texture",
                pageTitle: "React Custom Texture | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Custom Texture Example - React\n\n## Overview\nThis React example demonstrates texture mapping in SciChart.js using the **SciChartReact** component. It applies custom image textures to multiple series types while maintaining React's component lifecycle.\n\n## Technical Implementation\nThe implementation uses React's component pattern with an **initChart** prop that initializes the chart surface. Custom textures are defined through [ImageTextureOptions](https://www.scichart.com/documentation/js/current/interfaces/icustomtextureoptions.html) and applied to series like [FastTriangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fasttrianglerenderableseries.html).\n\n## Features and Capabilities\nThe example showcases texture mapping with different coordinate systems (XY and XYXY) and demonstrates texture control properties like **textureWidth** and **textureHeight**. It combines multiple textured series with interactive modifiers for a rich visualization experience.\n\n## Integration and Best Practices\nThe **SciChartReact** component handles WASM context lifecycle automatically. Developers can extend this pattern by adding React state management for dynamic texture updates while following [React integration guidelines](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).",
            },
            angular: {
                subtitle:
                    "Creates a **Custom Texture** example with multiple renderableSeries, all allowing for **customTextureOptions** images.",
                title: "Angular Custom Texture",
                pageTitle: "Angular Custom Texture | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Custom Texture Example - Angular\n\n## Overview\nThis Angular example demonstrates texture mapping in SciChart.js using standalone components. It applies custom image textures to various series types through the **ScichartAngularComponent**.\n\n## Technical Implementation\nThe implementation uses Angular's standalone component architecture with the **drawExample** function passed to [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular). Textures are configured via [ICustomTextureOptions](https://www.scichart.com/documentation/js/current/interfaces/icustomtextureoptions.html) interface.\n\n## Features and Capabilities\nThe example combines multiple textured series types with different [draw modes](https://www.scichart.com/documentation/js/current/enums/etriangleseriesdrawmode.html) and coordinate systems. It demonstrates texture positioning and scaling techniques for precise visualization control.\n\n## Integration and Best Practices\nThe example follows Angular best practices for async initialization and component architecture. Developers can extend it with Angular services for texture management while referencing [Angular integration docs](https://www.scichart.com/documentation/js/current/AngularComponent.html).",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Custom Texture documentation will help you to get started",
                linkTitle: "JavaScript Custom Texture Documentation",
            },
        ],
        path: "custom-texture",
        metaKeywords: "custom, texture, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/StylingAndTheming/CustomTexture",
        thumbnailImage: "javascript-custom-texture.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true
    };
//// End of computer generated metadata

const CustomTextureExampleInfo = createExampleInfo(metaData);
export default CustomTextureExampleInfo;
