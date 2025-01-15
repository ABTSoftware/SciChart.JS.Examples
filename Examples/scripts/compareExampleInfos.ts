// Register image hooks before any imports
require("./registerImageHook");

import * as path from "path";
import { findExampleDirectories } from "./findExampleDirectories";
import { TFrameworkName } from "../src/helpers/shared/Helpers/frameworkParametrization";

const frameworks: TFrameworkName[] = ["JavaScript", "React", "Angular"];

// Helper function to log comparison only if values are different
function logComparison(property: string, oldValue: any, newValue: any) {
    const oldStr = JSON.stringify(oldValue);
    const newStr = JSON.stringify(newValue);
    if (oldStr !== newStr) {
        console.log(`\n=== Difference found in ${property} ===`);
        console.log("Old:", oldValue);
        console.log("New:", newValue);
    }
}

// Helper function to get value, handling both direct values and framework-specific functions
function getValue(value: any, framework?: TFrameworkName) {
    // Handle React components or direct values
    if (typeof value === "function") {
        if (framework) {
            const result = value(framework);
            // If result is a React component or has a $$typeof property, stringify it
            return result && typeof result === "object" && "$$typeof" in result ? JSON.stringify(result) : result;
        }
        return value;
    }
    // If value is a React component or has a $$typeof property, stringify it
    if (value && typeof value === "object" && "$$typeof" in value) {
        return JSON.stringify(value);
    }
    return value;
}

function compareExampleInfos(currentInfo: any, oldInfo: any) {
    // Compare static properties
    const staticProps = [
        "onWebsite",
        "filepath",
        "path",
        "metaKeywords",
        "markdownContent",
        "documentationLinks",
        "thumbnailImage",
    ];

    staticProps.forEach((prop) => {
        logComparison(prop, oldInfo[prop], currentInfo[prop]);
    });

    // Compare framework-specific properties
    frameworks.forEach((framework) => {
        // Framework-specific properties
        const frameworkProps = ["title", "pageTitle", "subtitle", "metaDescription"];

        let hasDifferences = false;
        const differences: string[] = [];

        frameworkProps.forEach((prop) => {
            const oldValue = getValue(oldInfo[prop], framework);
            const newValue = getValue(currentInfo[prop], framework);
            const oldStr = JSON.stringify(oldValue);
            const newStr = JSON.stringify(newValue);

            if (oldStr !== newStr) {
                hasDifferences = true;
                differences.push(
                    `\n=== Difference found in ${prop} (${framework}) ===\nOld: ${oldValue}\nNew: ${newValue}`
                );
            }
        });

        if (hasDifferences) {
            differences.forEach((diff) => console.log(diff));
        }
    });
}

async function importExampleInfo(filePath: string) {
    try {
        // Delete require cache to ensure fresh import
        delete require.cache[require.resolve(filePath)];
        return require(filePath);
    } catch (error) {
        console.error(`Error importing ${filePath}:`, error);
        return null;
    }
}

async function runComparison() {
    const baseDir = path.join("src", "components", "Examples");
    const allExampleDirs = findExampleDirectories();
    const exampleDirs = [allExampleDirs[0]];
    for (const dir of exampleDirs) {
        const fullPath = path.join(baseDir, dir);
        console.log(`\nComparing example: ${dir}`);

        const exampleInfoPath = path.join(process.cwd(), fullPath, "exampleInfo");
        const oldExampleInfoPath = path.join(process.cwd(), fullPath, "OldExampleInfo");

        const exampleInfoModule = await importExampleInfo(exampleInfoPath);
        const oldExampleInfoModule = await importExampleInfo(oldExampleInfoPath);

        if (!exampleInfoModule || !oldExampleInfoModule) {
            console.error("Failed to import one or both example info files");
            continue;
        }

        // Find the ExampleInfo exports
        const currentExport = Object.entries(exampleInfoModule).find(
            ([key]) => key.toLowerCase().endsWith("exampleinfo") && !key.toLowerCase().startsWith("old")
        );
        const oldExport = Object.entries(oldExampleInfoModule).find(([key]) =>
            key.toLowerCase().endsWith("exampleinfo")
        );

        if (!currentExport || !oldExport) {
            console.error("Could not find ExampleInfo exports");
            continue;
        }

        compareExampleInfos(currentExport[1], oldExport[1]);
    }
}

// When run directly, execute the comparison
if (require.main === module) {
    runComparison().catch(console.error);
}
