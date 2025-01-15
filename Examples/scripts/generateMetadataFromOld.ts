// Register image hooks before any imports
require("./registerImageHook");

import * as path from "path";
import * as fs from "fs";
import { findExampleDirectories } from "./findExampleDirectories";

// Helper function to get just filename from path
function getFilenameFromPath(filepath: string | undefined): string {
    return filepath ? path.basename(filepath) : "";
}

import { TFrameworkName } from "../src/helpers/shared/Helpers/frameworkParametrization";
import * as ReactDOMServer from "react-dom/server";
import React from "react";

interface ExampleInfo {
    subtitle?: string | ((framework: string) => any);
    title?: string | ((framework: string) => string);
    pageTitle?: string | ((framework: string) => string);
    metaDescription?: string | ((framework: string) => string);
    thumbnailImage?: string;
    documentationLinks?: string[];
    path?: string;
    metaKeywords?: string;
    onWebsite?: boolean;
    filepath?: string;
    sandboxConfig?: Record<string, any>;
    markdownContent?: TFrameworkTemplate;
    pageLayout?: EPageLayout;
    [key: string]: any; // Add index signature
}

enum EPageLayout {
    Default = "default",
    Embedded = "embedded",
    NoHeader = "noHeader",
    NoHeaderNoFooter = "noHeaderNoFooter",
}

type TFrameworkTemplate = string | ((framework: string) => string);

// Helper function to convert React-like object to React element
function createReactElement(obj: any): React.ReactNode {
    if (!obj) return null;

    // If it's a string/number, return directly
    if (typeof obj === "string" || typeof obj === "number") {
        return obj;
    }

    // If it's a React-like object with type and props
    if (obj.type && obj.props) {
        const children = obj.props.children;
        const processedChildren = Array.isArray(children)
            ? children.map((child) => createReactElement(child))
            : createReactElement(children);

        return React.createElement(obj.type, { ...obj.props, children: undefined }, processedChildren);
    }

    // If it's an array, process each element
    if (Array.isArray(obj)) {
        return obj.map((item) => createReactElement(item));
    }

    return null;
}

// Helper function to convert React components to markdown strings
function stringifyReactComponent(component: any): string {
    if (!component) return "";

    if (typeof component === "string") return component;
    if (typeof component === "number") return component.toString();

    // Handle React elements
    if (component.type && component.props) {
        // Skip anchor tags completely
        if (component.type === "a") {
            // Only use the visible text content, ignore href and other attributes
            return stringifyReactComponent(component.props.children);
        }

        // Get all children content first
        const allChildren: string[] = [];

        // Handle props.children
        if (component.props.children) {
            if (Array.isArray(component.props.children)) {
                allChildren.push(...component.props.children.map((child: any) => stringifyReactComponent(child)));
            } else {
                allChildren.push(stringifyReactComponent(component.props.children));
            }
        }

        // Handle any other props that might contain content
        Object.entries(component.props).forEach(([key, value]) => {
            if (key !== "children" && value) {
                allChildren.push(stringifyReactComponent(value));
            }
        });

        // Join all content
        const content = allChildren.filter(Boolean).join("");

        // Add markdown formatting based on element type
        switch (component.type) {
            case "strong":
            case "b":
                return `**${content}**`;
            case "em":
            case "i":
                return `*${content}*`;
            case "code":
                return `\`${content}\``;
            case "br":
                return "\n";
            case "p":
                return content;
            default:
                return content || "";
        }
    }

    // Handle arrays
    if (Array.isArray(component)) {
        return component.map((item) => stringifyReactComponent(item)).join("");
    }

    // Handle objects that might be nested components
    if (component && typeof component === "object") {
        if ("children" in component) {
            return stringifyReactComponent(component.children);
        }
        if ("props" in component) {
            return stringifyReactComponent(component.props);
        }
    }

    return String(component);
}

const frameworks: TFrameworkName[] = ["JavaScript", "React", "Angular"];

async function importExampleInfo(filePath: string) {
    try {
        delete require.cache[require.resolve(filePath)];
        return require(filePath);
    } catch (error: any) {
        console.error(`Error importing ${filePath}:`, error?.message || "Unknown error");
        return null;
    }
}

async function generateMetadata() {
    const baseDir = path.join("src", "components", "Examples");
    const allExampleDirs = findExampleDirectories();
    const metadata: any[] = [];

    for (const dir of allExampleDirs) {
        const fullPath = path.join(baseDir, dir);
        const oldExampleInfoPath = path.join(process.cwd(), fullPath, "OldExampleInfo");

        const oldExampleInfoModule = await importExampleInfo(oldExampleInfoPath);

        if (!oldExampleInfoModule) {
            console.log(`Skipping ${dir}: No OldExampleInfo found`);
            continue;
        }

        // Find the ExampleInfo export
        const oldExport = Object.entries(oldExampleInfoModule).find(
            ([key]) =>
                key.toLowerCase().endsWith("exampleinfo") ||
                key.toLowerCase().endsWith("dashboard") ||
                key.toLowerCase().includes("explorer")
        );

        if (!oldExport) {
            console.log(`Skipping ${dir}: No ExampleInfo export found`);
            continue;
        }

        const oldInfo = oldExport[1] as ExampleInfo;
        const frameworks: Record<string, any> = {};

        // Convert for each framework, maintaining proper capitalization
        const frameworkMappings = {
            JavaScript: "javascript",
            React: "react",
            Angular: "angular",
        };

        Object.entries(frameworkMappings).forEach(([properCase, lowerCase]) => {
            const getFrameworkValue = (prop: string) => {
                const value = oldInfo[prop];
                if (typeof value === "function") {
                    try {
                        return value(properCase) || "";
                    } catch (e) {
                        return "";
                    }
                }
                return value || "";
            };

            try {
                const subtitle = getFrameworkValue("subtitle");
                const subtitleString =
                    typeof subtitle === "function"
                        ? stringifyReactComponent(subtitle(properCase))
                        : stringifyReactComponent(subtitle);

                frameworks[lowerCase] = {
                    subtitle: subtitleString,
                    title: getFrameworkValue("title"),
                    pageTitle: getFrameworkValue("pageTitle"),
                    metaDescription: getFrameworkValue("metaDescription"),
                    markdownContent: oldInfo.markdownContent || null,
                };
            } catch (e) {
                console.log(`Error processing framework ${properCase} for ${dir}:`, e);
                frameworks[lowerCase] = {
                    subtitle: "",
                    title: "",
                    pageTitle: "",
                    metaDescription: "",
                    markdownContent: null,
                };
            }
        });

        metadata.push({
            exampleId: dir,
            imagePath: getFilenameFromPath(oldInfo.thumbnailImage),
            description: (() => {
                try {
                    return typeof oldInfo.subtitle === "function"
                        ? stringifyReactComponent(oldInfo.subtitle("JavaScript"))
                        : stringifyReactComponent(oldInfo.subtitle) || "";
                } catch (e) {
                    console.log(`Error processing description for ${dir}:`, e);
                    return "";
                }
            })(),
            tips: [], // Old format doesn't have tips
            frameworks,
            documentationLinks: oldInfo.documentationLinks || [],
            path: oldInfo.path || "",
            metaKeywords: oldInfo.metaKeywords || "",
            onWebsite: oldInfo.onWebsite ?? true,
            filepath: oldInfo.filepath || "",
            thumbnailImage: getFilenameFromPath(oldInfo.thumbnailImage),
            sandboxConfig: oldInfo.sandboxConfig || {},
            markdownContent: oldInfo.markdownContent || null,
            pageLayout: oldInfo.pageLayout || EPageLayout.Default,
            extraDependencies: oldInfo.extraDependencies || {},
        });
    }

    // Write the metadata array to a JSON file
    const outputPath = path.join(process.cwd(), "examples-metadata.json");
    fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
    console.log(`Metadata written to ${outputPath}`);
    console.log(`Processed ${metadata.length} examples`);
}

// When run directly, execute the generation
if (require.main === module) {
    generateMetadata().catch(console.error);
}
