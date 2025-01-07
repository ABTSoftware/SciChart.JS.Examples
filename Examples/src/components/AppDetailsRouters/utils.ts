/**
 * Extracts the filename from a path string, handling both Windows and Unix-style paths.
 * Examples:
 * - "C:/path/to/file.ts" -> "file.ts"
 * - "/path/to/file.ts" -> "file.ts"
 * - "src/file.ts" -> "file.ts"
 * - "file.ts" -> "file.ts"
 */
export const getFileName = (path: string): string => {
    const parts = path.split(/[\\/]/);
    return parts[parts.length - 1];
};

/**
 * Processes an array of files to:
 * 1. Extract just the filename from any path
 * 2. Sort files so that drawExample appears first, followed by index files
 */
export const processFiles = <T extends { name: string }>(files: T[]): T[] => {
    return files
        .map((file) => ({
            ...file,
            name: getFileName(file.name),
        }))
        .sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();

            // drawExample files come first
            if (aName.startsWith("drawexample") && !bName.startsWith("drawexample")) return -1;
            if (!aName.startsWith("drawexample") && bName.startsWith("drawexample")) return 1;

            // Then index files
            if (aName.startsWith("index") && !bName.startsWith("index")) return -1;
            if (!aName.startsWith("index") && bName.startsWith("index")) return 1;

            // Then alphabetically
            return aName.localeCompare(bName);
        });
};
