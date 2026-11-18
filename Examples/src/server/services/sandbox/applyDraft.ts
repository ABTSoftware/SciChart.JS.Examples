/** A sandbox project as produced by getSandboxConfig. */
export type SandboxFiles = Record<string, { content: string; isBinary: boolean }>;

export const MAX_DRAFT_BYTES = 2_000_000;

export class DraftError extends Error {
    status = 400;
}

const isEditable = (name: string) => /^src\/.+\.(?:tsx?|jsx?|css)$/.test(name) && !name.includes("..");

/**
 * Applies a visitor's draft to the example project. Only files that already exist in the project and are
 * editable sources are accepted, so a draft can change code but never the project's shape, and the total size is capped.
 */
export const applyDraft = (base: SandboxFiles, draft: unknown): SandboxFiles => {
    if (!Array.isArray(draft)) throw new DraftError("files must be a list of { name, content }");
    const merged: SandboxFiles = { ...base };
    const seen = new Set<string>();
    let bytes = 0;
    for (const file of draft) {
        const { name, content } = (file ?? {}) as { name?: unknown; content?: unknown };
        if (typeof name !== "string") throw new DraftError("every file needs a name");
        if (typeof content !== "string") throw new DraftError(`${name} needs string content`);
        if (!Object.prototype.hasOwnProperty.call(base, name) || !isEditable(name))
            throw new DraftError(`${name} is not an editable file of this example`);
        if (seen.has(name)) throw new DraftError(`${name} was sent twice`);
        seen.add(name);
        bytes += Buffer.byteLength(content);
        if (bytes > MAX_DRAFT_BYTES) throw new DraftError("The draft is too large");
        merged[name] = { ...base[name], content };
    }
    return merged;
};
