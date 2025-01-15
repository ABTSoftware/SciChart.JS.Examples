// Register image hooks before any imports
require("./registerImageHook");

import * as path from "path";
import * as fs from "fs";
import { findExampleDirectories } from "./findExampleDirectories";
import { TFrameworkName } from "../src/helpers/shared/Helpers/frameworkParametrization";

const frameworks: TFrameworkName[] = ["JavaScript", "React", "Angular"];

function convertToMetadata(oldInfo: any, exampleName: string) {
    // Get the base name from the example name
    const baseName = exampleName.toLowerCase();

    // Create framework-specific sections
    const frameworkSections = frameworks.reduce((acc, framework) => {
        const lowercaseFramework = framework.toLowerCase();
        const componentName = `${framework}ChartComponent`;

        // Get framework-specific values from old info
        const oldTitle = typeof oldInfo.title === "function" ? oldInfo.title(framework) : oldInfo.title;
        const oldPageTitle = typeof oldInfo.pageTitle === "function" ? oldInfo.pageTitle(framework) : oldInfo.pageTitle;

        // Keep original titles if possible
        const title = oldTitle || `${framework} ${baseName}`;
        const pageTitle = oldPageTitle || `${title} | JavaScript Charts | View Examples`;

        // Handle subtitle conversion from React component to markdown
        let subtitle = "";
        if (typeof oldInfo.subtitle === "function") {
            const subtitleComponent = oldInfo.subtitle(framework);
            if (subtitleComponent && subtitleComponent.props && subtitleComponent.props.children) {
                const children = subtitleComponent.props.children;
                if (Array.isArray(children)) {
                    subtitle = children
                        .map((child) => {
                            if (typeof child === "string") return child;
                            if (child.props && child.props.children) {
                                // Handle strong/bold text
                                if (child.type === "strong") {
                                    return `**${child.props.children}**`;
                                }
                                return child.props.children;
                            }
                            return "";
                        })
                        .join("");
                } else {
                    subtitle = children.toString();
                }
            }
        }

        // If no subtitle was extracted, use the original if available
        if (!subtitle && oldInfo.subtitle) {
            subtitle =
                typeof oldInfo.subtitle === "string"
                    ? oldInfo.subtitle
                    : `Demonstrates how to create a **${framework} ${baseName}** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)`;
        }

        // Get framework-specific meta description
        const metaDescription =
            typeof oldInfo.metaDescription === "function"
                ? oldInfo.metaDescription(framework)
                : oldInfo.metaDescription ||
                  `Easily create ${
                      framework === "Angular" ? "an" : "a"
                  } ${framework} ${baseName} with SciChart - high performance JavaScript Chart Library. Get your free trial now.`;

        acc[lowercaseFramework] = {
            component: componentName,
            subtitle,
            title,
            pageTitle,
            metaDescription,
            markdownContent: oldInfo.markdownContent || "",
        };
        return acc;
    }, {});

    // Construct the metadata object preserving original values where possible
    return {
        exampleId: baseName,
        imagePath: oldInfo.thumbnailImage ? `./${path.basename(oldInfo.thumbnailImage)}` : "",
        title: oldInfo.title || baseName,
        description: oldInfo.description || "",
        path: oldInfo.path ? oldInfo.path.toLowerCase() : baseName,
        metaKeywords: oldInfo.metaKeywords || "",
        onWebsite: oldInfo.onWebsite !== false,
        filepath: oldInfo.filepath,
        tips: oldInfo.tips || ['""'],
        thumbnailImage: oldInfo.thumbnailImage ? path.basename(oldInfo.thumbnailImage) : "",
        frameworks: frameworkSections,
        documentationLinks: oldInfo.documentationLinks || [],
    };
}

function updateExampleInfoFile(example: string) {
    try {
        console.log(`\nProcessing example: ${example}`);

        const baseDir = path.join("src", "components", "Examples");
        const fullPath = path.join(baseDir, example);
        const oldExampleInfoPath = path.join(process.cwd(), fullPath, "OldExampleInfo");
        const exampleInfoPath = path.join(process.cwd(), fullPath, "exampleInfo.tsx");

        // Import the old example info
        delete require.cache[require.resolve(oldExampleInfoPath)];
        const oldModule = require(oldExampleInfoPath);

        // Find the ExampleInfo export
        const oldExport = Object.entries(oldModule).find(([key]) => key.toLowerCase().endsWith("exampleinfo"));

        if (!oldExport) {
            console.error("Could not find ExampleInfo export");
            return;
        }

        // Convert to metadata format
        const newMetadata = convertToMetadata(oldExport[1], example.split("/").pop() || "");

        // Read existing file content
        const currentContent = fs.readFileSync(exampleInfoPath, "utf8");

        // Find the section between computer generated comments
        const startMarker = "//// This metadata is computer generated - do not edit!";
        const endMarker = "//// End of computer generated metadata";

        const startIndex = currentContent.indexOf(startMarker);
        const endIndex = currentContent.indexOf(endMarker);

        if (startIndex === -1 || endIndex === -1) {
            console.error("Could not find metadata section markers");
            return;
        }

        // Create new content with updated metadata
        const newContent =
            currentContent.substring(0, startIndex) +
            startMarker +
            "\n" +
            "    " +
            JSON.stringify(newMetadata, null, 8).replace(/\n/g, "\n    ") +
            ";\n" +
            endMarker +
            currentContent.substring(endIndex + endMarker.length);

        // Write the updated content
        fs.writeFileSync(exampleInfoPath, newContent);
        console.log(`Updated metadata in ${exampleInfoPath}`);
    } catch (error) {
        console.error("\nError processing example:");
        console.error("Example:", example);
        console.error("Error details:", error);
    }
}

async function runUpdate() {
    const exampleDirs = findExampleDirectories();
    console.log("Processing all examples...");
    for (const dir of exampleDirs) {
        updateExampleInfoFile(dir);
    }
}

// When run directly, execute the update
if (require.main === module) {
    runUpdate().catch(console.error);
}
