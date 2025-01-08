/**
 * Extracts the filename from a path string, handling both Windows and Unix-style paths.
 * Examples:
 * - "C:/path/to/file.ts" -> "file.ts"
 * - "/path/to/file.ts" -> "file.ts"
 * - "src/file.ts" -> "file.ts"
 * - "file.ts" -> "file.ts"
 */
export const getFileName = (path: string): string => {
    return path.split(/[/\\]/).pop() || "";
};

/**
 * Processes an array of files to:
 * 1. Extract just the filename from any path
 * 2. Sort files so that "drawExample" files appears first, followed by "index" files and then the rest
 */
export const processFiles = <T extends { name: string }>(files: T[]): T[] => {
    return files
        .map((file) => ({ ...file, name: getFileName(file.name) }))
        .sort((a, b) => {
            if (a.name.includes("drawExample")) {
                return -1;
            }
            if (b.name.includes("drawExample")) {
                return 1;
            }
            if (a.name.includes("index")) {
                return -1;
            }
            if (b.name.includes("index")) {
                return 1;
            }
            return a.name.localeCompare(b.name);
        });
};
