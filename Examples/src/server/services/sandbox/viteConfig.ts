import { IFiles } from "./sandboxDependencyUtils";
import { getExampleDependencies, jsonFile } from "./sandboxPackages";

const versions = require("../../../../package.json");

export const viteProjectFiles = (
    name: string,
    files: IFiles,
    react: boolean,
    extraDependencies?: Record<string, string>
): IFiles => ({
    ...files,
    "package.json": jsonFile({
        name: name.replace(/[^a-z0-9-]/gi, "").toLowerCase(),
        version: "1.0.0",
        private: true,
        type: "module",
        scripts: {
            start: "vite --host 0.0.0.0",
            dev: "vite --host 0.0.0.0",
            build: "vite build",
            preview: "vite preview",
        },
        dependencies: {
            ...getExampleDependencies(files, extraDependencies),
            ...(react ? { react: versions.dependencies.react, "react-dom": versions.dependencies["react-dom"] } : {}),
        },
        devDependencies: {
            vite: "^6.4.4",
            typescript: versions.dependencies.typescript,
            ...(react
                ? {
                      "@types/react": versions.dependencies["@types/react"],
                      "@types/react-dom": versions.devDependencies["@types/react-dom"],
                  }
                : {}),
        },
    }),
    "tsconfig.json": jsonFile({
        compilerOptions: {
            target: "ES2022",
            lib: ["ES2022", "DOM"],
            module: "ESNext",
            moduleResolution: "Bundler",
            jsx: "react-jsx",
            esModuleInterop: true,
            skipLibCheck: true,
            noEmit: true,
            resolveJsonModule: true,
        },
        include: ["src"],
    }),
    "src/vite-env.d.ts": { content: '/// <reference types="vite/client" />\n', isBinary: false },
    "sandbox.config.json": jsonFile({ infiniteLoopProtection: false, view: "browser", template: "node" }),
    ".codesandbox/tasks.json": jsonFile({
        setupTasks: [{ name: "Install dependencies", command: "npm install" }],
        tasks: { start: { name: "Start", command: "npm run start", runAtStart: true, preview: { port: 5173 } } },
    }),
});

export const chartBootstrap = `import { SciChartSurface, SciChart3DSurface } from "scichart";

SciChartSurface.UseCommunityLicense();
SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();
`;
