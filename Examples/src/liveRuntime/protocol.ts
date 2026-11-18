import type { ProjectFile } from "./moduleLoader";

export type LiveFramework = "react" | "javascript";

export type PageMessage =
    | {
          type: "run";
          runId: number;
          framework: LiveFramework;
          files: ProjectFile[];
          themeName: string;
          /** CSS variables that `appTheme` reads from the document root. */
          themeVars: Record<string, string>;
      }
    | { type: "dispose" };

export type FrameMessage =
    | { type: "ready" }
    | { type: "run-ok"; runId: number; duration: number }
    | {
          type: "error";
          runId: number;
          phase: "compile" | "runtime" | "teardown";
          message: string;
          file?: string;
          line?: number;
      }
    | { type: "console"; runId: number; level: "log" | "info" | "warn" | "error"; text: string };

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

export const parsePageMessage = (data: unknown): PageMessage | null => {
    if (!isObject(data)) return null;
    if (data.type === "dispose") return { type: "dispose" };
    if (data.type !== "run") return null;
    const { runId, framework, files, themeName, themeVars } = data;
    if (!isNumber(runId) || (framework !== "react" && framework !== "javascript") || !isString(themeName)) return null;
    if (!Array.isArray(files) || !files.every((f) => isObject(f) && isString(f.name) && isString(f.content)))
        return null;
    if (!isObject(themeVars) || !Object.values(themeVars).every(isString)) return null;
    return data as PageMessage;
};

export const parseFrameMessage = (data: unknown): FrameMessage | null => {
    if (!isObject(data)) return null;
    switch (data.type) {
        case "ready":
            return { type: "ready" };
        case "run-ok":
            return isNumber(data.runId) && isNumber(data.duration) ? (data as FrameMessage) : null;
        case "console":
            return isNumber(data.runId) &&
                ["log", "info", "warn", "error"].includes(data.level as string) &&
                isString(data.text)
                ? (data as FrameMessage)
                : null;
        case "error":
            return isNumber(data.runId) &&
                (data.phase === "compile" || data.phase === "runtime" || data.phase === "teardown") &&
                isString(data.message) &&
                (data.file === undefined || isString(data.file)) &&
                (data.line === undefined || isNumber(data.line))
                ? (data as FrameMessage)
                : null;
        default:
            return null;
    }
};

/** Both sides accept a message only from the window they expect and the origin they expect. */
export const isTrustedEvent = (
    event: { source: unknown; origin: string },
    expectedSource: unknown,
    expectedOrigin: string
) => expectedSource != null && event.source === expectedSource && event.origin === expectedOrigin;
