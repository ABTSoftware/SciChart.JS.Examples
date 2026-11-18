import type { ExampleSourceFile } from "../../helpers/types/types";

/** Only the project's own sources can be edited; configuration files stay read-only. */
export const isEditableFile = (name: string) => /^src\/.+\.(?:tsx?|jsx?|css)$/.test(name) && !name.endsWith(".d.ts");

/** True when the draft differs from the example project in any file or in the set of files. */
export const hasDraft = (draft: ExampleSourceFile[], baseline: ExampleSourceFile[]) =>
    draft.length !== baseline.length ||
    draft.some((file) => baseline.find((original) => original.name === file.name)?.content !== file.content);

export type LiveEditAvailability = {
    status: "available" | "angular" | "readonly-example" | "narrow";
};

export const LIVE_EDIT_MESSAGES = {
    angular: "Live editing works in React and JavaScript. Switch framework to edit this example.",
    "readonly-example":
        "This example is too complex to run in the in-page sandbox. Clone the repository or download the project to edit it.",
    narrow: "Live editing is available on wider screens.",
} as const;

export const getLiveEditAvailability = (options: {
    framework: string;
    liveEdit: boolean | undefined;
    narrow: boolean;
}): LiveEditAvailability => {
    if (options.liveEdit === false) return { status: "readonly-example" };
    if (options.framework === "angular") return { status: "angular" };
    if (options.narrow) return { status: "narrow" };
    return { status: "available" };
};

/** Only the project's editable sources go to the CodeSandbox draft endpoint; it rejects everything else. */
export const editableFiles = (files: ExampleSourceFile[]) => files.filter((file) => isEditableFile(file.name));

/** The router adds its own basename, so a link's pathname must lose it before it is passed to `navigate`. */
export const toRouterPath = (href: string, basePath: string) => {
    if (!basePath || !href.startsWith(basePath)) return href;
    const rest = href.slice(basePath.length);
    if (rest === "") return "/";
    if (rest.startsWith("/")) return rest;
    return rest.startsWith("?") || rest.startsWith("#") ? "/" + rest : href;
};
