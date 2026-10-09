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

/** Preserve relative paths so helper files with matching basenames remain distinct. */
export const processFiles = <T extends { name: string }>(files: T[]): T[] => {
    const rank = (name: string) => (name.startsWith("drawExample") ? 0 : name.startsWith("index.") ? 1 : 2);
    return [...files].sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
};
