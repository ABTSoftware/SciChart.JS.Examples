export type ConsoleEntry = {
    id: number;
    kind: "log" | "info" | "warn" | "error" | "compile" | "runtime";
    text: string;
    file?: string;
    line?: number;
};

export const MAX_CONSOLE_LINES = 300;

/** Appends an entry, dropping the oldest ones beyond the cap. */
export const appendEntry = (entries: ConsoleEntry[], entry: ConsoleEntry): ConsoleEntry[] => {
    const next = [...entries, entry];
    return next.length > MAX_CONSOLE_LINES ? next.slice(next.length - MAX_CONSOLE_LINES) : next;
};

export const countErrors = (entries: ConsoleEntry[]) =>
    entries.filter((entry) => entry.kind === "error" || entry.kind === "compile" || entry.kind === "runtime").length;
