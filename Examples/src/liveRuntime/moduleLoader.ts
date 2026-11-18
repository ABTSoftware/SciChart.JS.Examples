/** A file of an example project, as served by `GET /source/:example`. */
export interface ProjectFile {
    name: string;
    content: string;
}

/** An error that knows which project file it came from. */
export class ProjectError extends Error {
    constructor(message: string, public file?: string) {
        super(message);
    }
}

export interface ModuleLoaderOptions {
    files: ProjectFile[];
    /** Turns a project file into CommonJS source. */
    compile: (file: ProjectFile) => string;
    /** Packages available by import name. */
    externals: Record<string, unknown>;
    /** Deep `scichart/...` paths that are not covered by the root exports. */
    deepModules?: Record<string, unknown>;
    onStyle: (file: ProjectFile) => void;
    /** Prepended to each file's script name, so errors raised later can be traced to the run that made them. */
    sourceUrlPrefix?: string;
}

const EXTENSIONS = ["", ".ts", ".tsx", ".js", ".jsx", ".css", "/index.ts", "/index.tsx", "/index.js"];

const resolveRelative = (from: string, spec: string, names: Set<string>) => {
    const parts = from.split("/").slice(0, -1);
    for (const part of spec.split("/")) {
        if (part === "." || part === "") continue;
        if (part === "..") parts.pop();
        else parts.push(part);
    }
    const base = parts.join("/");
    return EXTENSIONS.map((extension) => base + extension).find((candidate) => names.has(candidate));
};

/** Wraps a compile function so unchanged files reuse their previous output. */
export const createCompiler = (compile: (file: ProjectFile) => string) => {
    const cache = new Map<string, { content: string; code: string }>();
    return (file: ProjectFile) => {
        const hit = cache.get(file.name);
        if (hit && hit.content === file.content) return hit.code;
        const code = compile(file);
        cache.set(file.name, { content: file.content, code });
        return code;
    };
};

/** A small CommonJS loader for the files of one run. A new loader per run gives every module fresh state. */
export const createModuleLoader = (options: ModuleLoaderOptions) => {
    const byName = new Map(options.files.map((file) => [file.name, file]));
    const names = new Set(byName.keys());
    const cache = new Map<string, { exports: any }>();

    const requireExternal = (from: string, spec: string) => {
        if (spec in options.externals) return options.externals[spec];
        if (options.deepModules && spec in options.deepModules) return options.deepModules[spec];
        if (spec.startsWith("scichart/")) return options.externals.scichart;
        throw new ProjectError(
            `Package "${spec}" is not available in the in-page sandbox. Download the project to run it.`,
            from
        );
    };

    const load = (name: string): any => {
        const cached = cache.get(name);
        if (cached) return cached.exports;
        const file = byName.get(name)!;
        const module = { exports: {} as any };
        cache.set(name, module);
        if (name.endsWith(".css")) {
            options.onStyle(file);
            return module.exports;
        }
        const run = (spec: string) => {
            if (!spec.startsWith(".")) return requireExternal(name, spec);
            const resolved = resolveRelative(name, spec, names);
            if (!resolved) throw new ProjectError(`Cannot find module "${spec}" imported from ${name}`, name);
            return load(resolved);
        };
        try {
            new Function(
                "require",
                "module",
                "exports",
                options.compile(file) + `\n//# sourceURL=${options.sourceUrlPrefix ?? ""}${name}`
            )(run, module, module.exports);
        } catch (error) {
            if (error instanceof ProjectError) throw error;
            const wrapped = new ProjectError(error instanceof Error ? error.message : String(error), name);
            if (error instanceof Error) wrapped.stack = error.stack;
            throw wrapped;
        }
        return module.exports;
    };

    return {
        require(name: string): any {
            if (!names.has(name)) throw new ProjectError(`Cannot find file ${name}`);
            return load(name);
        },
    };
};
