// Register image hooks before any imports
require("./registerImageHook");

import * as path from "path";
import { findExampleDirectories } from "./findExampleDirectories";
import { TFrameworkName } from "../src/helpers/shared/Helpers/frameworkParametrization";
import * as ReactDOMServer from "react-dom/server";
import React from "react";

const frameworks: TFrameworkName[] = ["JavaScript", "React", "Angular"];

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

// Helper function to render React component to string
function renderReactComponent(component: any): string {
    try {
        // If it's a function that returns a component, call it with each framework
        if (typeof component === "function") {
            for (const framework of frameworks) {
                try {
                    const result = component(framework);
                    if (result) {
                        // Convert to proper React element and render
                        const element = createReactElement(result);
                        return ReactDOMServer.renderToString(React.createElement("span", {}, element));
                    }
                } catch (e) {
                    console.log(`Error rendering for framework ${framework}:`, e.message);
                    continue;
                }
            }
            return "";
        }

        // If it's a stringified component, parse and convert
        if (typeof component === "string" && (component.includes('"type"') || component.includes('"props"'))) {
            try {
                // Fix malformed JSON
                const fixedJson = component
                    .replace(/}"/g, '},"')
                    .replace(/""/g, '","')
                    .replace(/}({|"})/g, "},$1");

                const parsed = JSON.parse(fixedJson);
                const element = createReactElement(parsed);
                return ReactDOMServer.renderToString(React.createElement("span", {}, element));
            } catch (e) {
                console.log("Error parsing JSON:", e.message);
                return component;
            }
        }

        // If it's already a React-like object
        if (component && typeof component === "object") {
            const element = createReactElement(component);
            return ReactDOMServer.renderToString(React.createElement("span", {}, element));
        }

        return component?.toString() || "";
    } catch (e) {
        console.log("Error rendering component:", e.message);
        return "";
    }
}

// Helper function to extract text content from React component
function extractTextFromReactComponent(component: any, depth = 0, path = "root"): string {
    const indent = "  ".repeat(depth);
    console.log(`${indent}Processing component at ${path}`);
    console.log(`${indent}Type:`, typeof component);

    if (!component) {
        console.log(`${indent}Empty component`);
        return "";
    }

    // If it's a direct string/number value
    if (typeof component === "string" || typeof component === "number") {
        console.log(`${indent}Direct value:`, component);
        return component.toString();
    }

    // If it's a function that returns a component, call it with each framework
    if (typeof component === "function") {
        console.log(`${indent}Found function component`);
        // Try each framework, use the first successful result
        for (const framework of frameworks) {
            try {
                console.log(`${indent}Trying framework:`, framework);
                const result = component(framework);
                if (result) {
                    console.log(`${indent}Function returned result for ${framework}`);
                    return extractTextFromReactComponent(result, depth + 1, `${path}.${framework}`);
                }
            } catch (e) {
                console.log(`${indent}Error with framework ${framework}:`, e.message);
                continue;
            }
        }
        console.log(`${indent}No successful framework calls`);
        return "";
    }

    // Handle stringified components
    if (typeof component === "string" && (component.includes('"type"') || component.includes('"props"'))) {
        console.log(`${indent}Found stringified component`);
        try {
            // Fix malformed JSON by adding missing commas
            const fixedJson = component
                .replace(/}"/g, '},"') // Add comma after closing braces followed by quote
                .replace(/""/g, '","') // Add comma between consecutive quotes
                .replace(/}({|"})/g, "},$1"); // Add comma after closing brace followed by opening brace or quote+brace

            console.log(`${indent}Fixed JSON:`, fixedJson);
            const parsed = JSON.parse(fixedJson);
            console.log(`${indent}Successfully parsed JSON`);
            return extractTextFromReactComponent(parsed, depth + 1, `${path}.parsed`);
        } catch (e) {
            console.log(`${indent}Failed to parse JSON:`, e.message);
            console.log(`${indent}Original string:`, component);
            return component.trim();
        }
    }

    // Handle React component objects
    if (component && typeof component === "object") {
        console.log(`${indent}Found object component`);
        console.log(`${indent}Keys:`, Object.keys(component));

        // Extract props.children content
        if (component.props && component.props.children) {
            console.log(`${indent}Found props.children`);
            const children = component.props.children;
            if (Array.isArray(children)) {
                console.log(`${indent}Children is array of length:`, children.length);
                return children
                    .map((child, index) => {
                        // Handle special elements like <strong>
                        if (child && typeof child === "object" && child.type) {
                            console.log(`${indent}Processing child ${index} with type:`, child.type);
                            const content = extractTextFromReactComponent(
                                child.props?.children,
                                depth + 1,
                                `${path}.child[${index}]`
                            );
                            switch (child.type) {
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
                                default:
                                    return content;
                            }
                        }
                        return extractTextFromReactComponent(child, depth + 1, `${path}.child[${index}]`);
                    })
                    .join("");
            }
            return extractTextFromReactComponent(children, depth + 1, `${path}.children`);
        }

        // Handle direct component children
        if (component.children) {
            console.log(`${indent}Found direct children`);
            return extractTextFromReactComponent(component.children, depth + 1, `${path}.directChildren`);
        }
    }

    console.log(`${indent}No content found`);
    return "";
}

// Helper function to calculate Levenshtein distance between two strings
function levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array(m + 1)
        .fill(null)
        .map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j - 1] + 1, // substitution
                    dp[i - 1][j] + 1, // deletion
                    dp[i][j - 1] + 1 // insertion
                );
            }
        }
    }

    return dp[m][n];
}

// Helper function to calculate similarity percentage between two strings
function stringSimilarity(str1: string, str2: string): number {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1.0; // Both strings are empty

    const distance = levenshteinDistance(str1, str2);
    return 1 - distance / maxLength;
}

// Helper function to decode HTML entities
function decodeHtmlEntities(str: string): string {
    return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ");
}

// Helper function to strip links from React components
function stripLinks(component: any): any {
    if (!component) return component;

    // If it's a string, return as is
    if (typeof component === "string") return component;

    // If it's a React element object
    if (component.type && component.props) {
        // Skip anchor tags
        if (component.type === "a") {
            return component.props.title || component.props.children;
        }

        // Process children recursively
        if (component.props.children) {
            const newChildren = Array.isArray(component.props.children)
                ? component.props.children.map(stripLinks)
                : stripLinks(component.props.children);

            return {
                ...component,
                props: {
                    ...component.props,
                    children: newChildren,
                },
            };
        }
    }

    // Handle arrays
    if (Array.isArray(component)) {
        return component.map(stripLinks);
    }

    return component;
}

// Helper function to normalize subtitle content
function normalizeSubtitle(value: any): string {
    if (!value) return "";

    // First stage: Strip links if it's a React component
    const strippedValue = typeof value === "function" ? stripLinks(value("JavaScript")) : value;

    // Second stage: Get a single string representation
    let singleString;
    if (typeof strippedValue === "string" && (strippedValue.includes('"type"') || strippedValue.includes('"props"'))) {
        // If it's a stringified React component, parse and render it
        try {
            const parsed = JSON.parse(strippedValue);
            singleString = stringifyReactComponent(parsed);
        } catch (e) {
            console.log("Error parsing JSON:", e.message);
            singleString = strippedValue;
        }
    } else {
        // Otherwise render it directly
        singleString = stringifyReactComponent(strippedValue);
    }

    // Third stage: Clean up and normalize the string
    const normalized = singleString
        .replace(/<[^>]+>/g, "") // Remove HTML tags
        .replace(/\*\*/g, "") // Remove bold markers
        .replace(/\s+/g, " ") // Normalize whitespace
        .replace(/\n\s*/g, "\n") // Normalize line breaks
        .toLowerCase() // Convert to lowercase for better comparison
        .trim();

    // Fourth stage: Decode HTML entities
    return decodeHtmlEntities(normalized);
}

interface ComparisonError {
    exampleName: string;
    property: string;
    oldValue: any;
    newValue: any;
    normalizedOld?: string;
    normalizedNew?: string;
    similarity?: number;
}

// Helper function to handle nested React components
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
                allChildren.push(...component.props.children.map((child) => stringifyReactComponent(child)));
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

// Helper function to compare and collect errors
function compareAndCollectErrors(
    property: string,
    oldValue: any,
    newValue: any,
    errors: ComparisonError[],
    exampleName: string
) {
    // Skip markdownContent comparison as it's a function
    if (property === "markdownContent") {
        return;
    }

    // Special handling for subtitles
    if (property.includes("subtitle")) {
        const normalizedOld = normalizeSubtitle(oldValue);
        const normalizedNew = normalizeSubtitle(newValue);
        const similarity = stringSimilarity(normalizedOld, normalizedNew);

        if (similarity < 0.6) {
            errors.push({
                exampleName,
                property,
                oldValue,
                newValue,
                normalizedOld,
                normalizedNew,
                similarity,
            });
        }
        return;
    }

    // Special handling for metaDescription
    if (property.includes("metaDescription")) {
        const oldStr = typeof oldValue === "function" ? oldValue() : String(oldValue);
        const newStr = typeof newValue === "function" ? newValue() : String(newValue);
        const similarity = stringSimilarity(oldStr, newStr);

        if (similarity < 0.95) {
            errors.push({
                exampleName,
                property,
                oldValue: oldStr,
                newValue: newStr,
                normalizedOld: oldStr,
                normalizedNew: newStr,
                similarity,
            });
        }
        return;
    }

    // Special handling for optional fields
    if (property === "pageLayout" || property === "extraDependencies" || property === "sandboxConfig") {
        // Skip comparison if both values are undefined/null
        if (!oldValue && !newValue) return;

        // If one is defined and the other isn't, that's an error
        if (!oldValue || !newValue) {
            errors.push({
                exampleName,
                property,
                oldValue: oldValue || "undefined",
                newValue: newValue || "undefined",
            });
            return;
        }

        // For objects (extraDependencies and sandboxConfig), do a deep comparison
        if (property === "extraDependencies" || property === "sandboxConfig") {
            try {
                const oldStr = JSON.stringify(oldValue, Object.keys(oldValue).sort());
                const newStr = JSON.stringify(newValue, Object.keys(newValue).sort());
                if (oldStr !== newStr) {
                    errors.push({
                        exampleName,
                        property,
                        oldValue: oldStr,
                        newValue: newStr,
                    });
                }
            } catch (e) {
                errors.push({
                    exampleName,
                    property,
                    oldValue: String(oldValue),
                    newValue: String(newValue),
                });
            }
            return;
        }
    }

    // Regular comparison for other properties
    try {
        const oldStr = typeof oldValue === "function" ? "[Function]" : JSON.stringify(oldValue);
        const newStr = typeof newValue === "function" ? "[Function]" : JSON.stringify(newValue);
        if (oldStr !== newStr) {
            errors.push({
                exampleName,
                property,
                oldValue: oldStr,
                newValue: newStr,
            });
        }
    } catch (e) {
        // If JSON.stringify fails, compare string representations
        const oldStr = String(oldValue);
        const newStr = String(newValue);
        if (oldStr !== newStr) {
            errors.push({
                exampleName,
                property,
                oldValue: oldStr,
                newValue: newStr,
            });
        }
    }
}

// Helper function to get value, handling both direct values and framework-specific functions
function getValue(value: any, framework?: TFrameworkName) {
    // Handle function components
    if (typeof value === "function") {
        if (framework) {
            return value(framework);
        }
        return value;
    }
    return value;
}

function compareExampleInfos(currentInfo: any, oldInfo: any, errors: ComparisonError[], exampleName: string) {
    console.log(`\nComparing example info for: ${exampleName}`);
    console.log("Current info keys:", Object.keys(currentInfo));
    console.log("Old info keys:", Object.keys(oldInfo));

    // Compare static properties
    const staticProps = [
        "onWebsite",
        "filepath",
        "path",
        "metaKeywords",
        "documentationLinks",
        "thumbnailImage",
        "pageLayout",
        "extraDependencies",
        "sandboxConfig",
        "markdownContent",
    ];

    console.log("Comparing static properties...");
    staticProps.forEach((prop) => {
        console.log(`Comparing property: ${prop}`);
        try {
            compareAndCollectErrors(prop, oldInfo[prop], currentInfo[prop], errors, exampleName);
        } catch (error: any) {
            console.error(`Error comparing ${prop}:`, error.message);
            console.error("Stack:", error.stack);
        }
    });

    console.log("Comparing framework-specific properties...");
    // Compare framework-specific properties
    frameworks.forEach((framework) => {
        console.log(`\nComparing framework: ${framework}`);
        // Framework-specific properties
        const frameworkProps = ["title", "pageTitle", "subtitle", "metaDescription"];

        frameworkProps.forEach((prop) => {
            console.log(`Comparing property: ${prop}`);
            try {
                const oldValue = getValue(oldInfo[prop], framework);
                const newValue = getValue(currentInfo[prop], framework);
                compareAndCollectErrors(`${prop} (${framework})`, oldValue, newValue, errors, exampleName);
            } catch (error: any) {
                console.error(`Error comparing ${prop} for ${framework}:`, error.message);
                console.error("Stack:", error.stack);
            }
        });
    });
}

async function importExampleInfo(filePath: string) {
    try {
        console.log(`Attempting to import: ${filePath}`);
        // Delete require cache to ensure fresh import
        const resolvedPath = require.resolve(filePath);
        console.log(`Resolved path: ${resolvedPath}`);
        delete require.cache[resolvedPath];
        const result = require(filePath);
        console.log(`Successfully imported ${filePath}`);
        return result;
    } catch (error: any) {
        console.error(`Error importing ${filePath}:`);
        console.error(`Error name: ${error.name}`);
        console.error(`Error message: ${error.message}`);
        console.error(`Error stack: ${error.stack}`);
        return null;
    }
}

async function runComparison() {
    console.log("Starting comparison...");
    const baseDir = path.join("src", "components", "Examples");
    console.log("Base directory:", baseDir);

    const allExampleDirs = findExampleDirectories();
    console.log("Found example directories:", allExampleDirs.length);

    const errors: ComparisonError[] = [];
    let processedCount = 0;
    let skippedCount = 0;
    let failedImports = 0;
    let skippedExamples: string[] = [];
    let importErrors: { dir: string; error: string }[] = [];

    // Redirect console.error to suppress React warnings
    const originalConsoleError = console.error;
    console.error = function () {};

    for (const dir of allExampleDirs) {
        const fullPath = path.join(baseDir, dir);
        const exampleInfoPath = path.join(process.cwd(), fullPath, "exampleInfo");
        const oldExampleInfoPath = path.join(process.cwd(), fullPath, "OldExampleInfo");

        console.log(`\nProcessing directory: ${dir}`);
        console.log("Example info path:", exampleInfoPath);
        console.log("Old example info path:", oldExampleInfoPath);

        const exampleInfoModule = await importExampleInfo(exampleInfoPath);
        const oldExampleInfoModule = await importExampleInfo(oldExampleInfoPath);

        if (!exampleInfoModule) console.log("Failed to import example info module");
        if (!oldExampleInfoModule) console.log("Failed to import old example info module");

        if (!exampleInfoModule || !oldExampleInfoModule) {
            // Report missing OldExampleInfo as an error
            errors.push({
                exampleName: dir,
                property: "missing_file",
                oldValue: !oldExampleInfoModule ? "Missing OldExampleInfo" : "Missing ExampleInfo",
                newValue: null,
            });
            skippedExamples.push(dir);
            skippedCount++;
            continue;
        }

        // Find the ExampleInfo exports
        const currentExport = Object.entries(exampleInfoModule).find(
            ([key]) =>
                (key.toLowerCase().endsWith("exampleinfo") ||
                    key.toLowerCase().endsWith("dashboard") ||
                    key.toLowerCase().includes("explorer")) &&
                !key.toLowerCase().startsWith("old")
        );
        const oldExport = Object.entries(oldExampleInfoModule).find(
            ([key]) =>
                key.toLowerCase().endsWith("exampleinfo") ||
                key.toLowerCase().endsWith("dashboard") ||
                key.toLowerCase().includes("explorer")
        );

        if (!currentExport || !oldExport) {
            failedImports++;
            importErrors.push({
                dir,
                error: !currentExport ? "Missing current ExampleInfo export" : "Missing old ExampleInfo export",
            });
            errors.push({
                exampleName: dir,
                property: "export",
                oldValue: null,
                newValue: null,
            });
            continue;
        }

        compareExampleInfos(currentExport[1], oldExport[1], errors, dir);
        processedCount++;
    }

    // Restore console.error
    console.error = originalConsoleError;

    // Print detailed information about skipped examples and import errors
    if (skippedExamples.length > 0) {
        console.log("\n=== No OldExampleInfo Found ===");
        skippedExamples.forEach((example) => {
            console.log(`src/components/Examples/${example}`);
        });
    }

    if (importErrors.length > 0) {
        console.log("\n=== Failed Imports ===");
        importErrors.forEach(({ dir, error }) => {
            console.log(`src/components/Examples/${dir}/exampleInfo: ${error}`);
        });
    }

    // Print differences
    if (errors.length > 0) {
        console.log(`\nFAILURES: ${errors.length} issues found in processed examples:`);
        errors.forEach((error, index) => {
            console.log(`\n${index + 1}. Example: ${error.property} in ${error.exampleName}`);

            if (error.property === "import" || error.property === "export" || error.property === "missing_file") {
                console.log(`Error: ${error.oldValue}`);
                return;
            }

            if (error.normalizedOld && error.normalizedNew) {
                // For subtitle comparisons, show normalized content and similarity
                console.log("\nNormalized content:");
                console.log("Old:", error.normalizedOld);
                console.log("New:", error.normalizedNew);
                console.log(`Similarity: ${(error.similarity! * 100).toFixed(1)}%`);
            } else {
                // For other properties, show original values
                console.log("Old:", error.oldValue);
                console.log("New:", error.newValue);
            }
        });
    }

    // Print summary at the end
    console.log("\n=== Comparison Summary ===");
    console.log(`Total examples found: ${allExampleDirs.length}`);
    console.log(`Examples processed: ${processedCount}`);
    console.log(`Examples skipped (no OldExampleInfo): ${skippedCount}`);
    console.log(`Failed imports: ${failedImports}`);
}

// When run directly, execute the comparison
if (require.main === module) {
    runComparison().catch((error) => {
        console.error("Top level error:");
        console.error(`Error name: ${error.name}`);
        console.error(`Error message: ${error.message}`);
        console.error(`Error stack: ${error.stack}`);
        process.exit(1);
    });
}
