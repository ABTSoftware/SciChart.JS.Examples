import * as fs from "fs";
import * as path from "path";

// Helper function to convert JSON to TypeScript object string with proper formatting
function formatTsObject(obj: any, indent: number = 4): string {
    const spaces = " ".repeat(indent);

    if (Array.isArray(obj)) {
        if (obj.length === 0) return "[]";
        return `[\n${spaces}${obj.map((item) => formatTsObject(item, indent + 4)).join(",\n" + spaces)}\n${" ".repeat(
            indent - 4
        )}]`;
    }

    if (typeof obj === "object" && obj !== null) {
        const entries = Object.entries(obj);
        if (entries.length === 0) return "{}";

        return `{\n${spaces}${entries
            .map(([key, value]) => {
                return `${key}: ${formatTsValue(value, indent + 4)}`;
            })
            .join(",\n" + spaces)}\n${" ".repeat(indent - 4)}}`;
    }

    return formatTsValue(obj, indent);
}

// Helper function to format TypeScript values
function formatTsValue(value: any, indent: number): string {
    if (typeof value === "string") {
        // Escape quotes and newlines
        const escaped = value.replace(/"/g, '\\"').replace(/\n/g, "\\n");
        return `"${escaped}"`;
    }
    if (typeof value === "number" || typeof value === "boolean") {
        return value.toString();
    }
    if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
        return formatTsObject(value, indent + 4);
    }
    if (value === null) {
        return "null";
    }
    return "undefined";
}

// Process each example
function processExamples() {
    // Read the metadata file
    const metadataPath = path.join(process.cwd(), "examples-metadata.json");
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

    // Process each example
    for (const example of metadata) {
        if (example.frameworks) {
            const oldFrameworks = example.frameworks;
            const newFrameworks: any = {};

            // Convert each framework key to lowercase
            for (const [key, value] of Object.entries(oldFrameworks)) {
                newFrameworks[key.toLowerCase()] = value;
            }

            // Replace the frameworks object
            example.frameworks = newFrameworks;
        }

        // Find the example info file
        const relativePath = example.filepath.replace(/\\/g, "/");
        const exampleInfoPath = path.join(process.cwd(), "src/components/Examples", relativePath, "exampleInfo.tsx");

        if (!fs.existsSync(exampleInfoPath)) {
            console.log(`Warning: ${exampleInfoPath} does not exist`);
            continue;
        }

        let content = fs.readFileSync(exampleInfoPath, "utf8");

        // Find the section between the comments
        const startComment = "//// This metadata is computer generated - do not edit!";
        const endComment = "//// End of computer generated metadata";

        const startIndex = content.indexOf(startComment);
        const endIndex = content.indexOf(endComment);

        if (startIndex === -1 || endIndex === -1) {
            console.log(`Warning: Could not find comment markers in ${exampleInfoPath}`);
            continue;
        }

        // Format the metadata as TypeScript
        const formattedMetadata = formatTsObject(example);

        // Replace the content between the comments
        const newContent =
            content.substring(0, startIndex + startComment.length) +
            "\n    " +
            formattedMetadata +
            "\n" +
            content.substring(endIndex);

        // Write the updated content back to the file
        fs.writeFileSync(exampleInfoPath, newContent);
        console.log(`Updated ${exampleInfoPath}`);
    }

    // Log the unique framework names found for verification
    const uniqueFrameworks = new Set<string>();
    metadata.forEach((example: any) => {
        if (example.frameworks) {
            Object.keys(example.frameworks).forEach((framework) => uniqueFrameworks.add(framework));
        }
    });
    console.log("Framework names found:", Array.from(uniqueFrameworks).sort());
}

// Run the script
processExamples();
console.log("Done converting framework names to lowercase");
