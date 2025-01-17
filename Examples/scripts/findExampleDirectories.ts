import * as fs from "fs";
import * as path from "path";

/**
 * Recursively finds all directories containing exampleInfo.ts or exampleInfo.tsx files
 * under the Examples/src/components/Examples directory
 */
export function findExampleDirectories(startPath: string = path.join("src", "components", "Examples")): string[] {
    const results: string[] = [];

    function isExampleDirectory(dirPath: string): boolean {
        return (
            fs.existsSync(path.join(dirPath, "exampleInfo.ts")) || fs.existsSync(path.join(dirPath, "exampleInfo.tsx"))
        );
    }

    function searchDirectory(currentPath: string) {
        if (isExampleDirectory(currentPath)) {
            // Store path relative to src/components/Examples
            const relativePath = path.relative(startPath, currentPath);
            results.push(relativePath);
            return;
        }

        const items = fs.readdirSync(currentPath);
        for (const item of items) {
            const itemPath = path.join(currentPath, item);
            if (fs.statSync(itemPath).isDirectory()) {
                searchDirectory(itemPath);
            }
        }
    }

    searchDirectory(startPath);
    return results;
}

// When run directly, output the directories
if (require.main === module) {
    const directories = findExampleDirectories();
    console.log(JSON.stringify(directories, null, 2));
}
