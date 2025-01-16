import path from "path";
import fs from "fs";
import { TExampleInfo } from "../../../components/AppRouter/examplePages";
import {
    SandboxConfig,
    IFiles,
    includeImportedModules,
    includeExternalModules,
    commonFiles,
    csStyles,
} from "./sandboxDependencyUtils";
import { SCICHART_ANCHOR, SCICHART_VERSION } from "./constants";

const pj = require("../../../../package.json");

export const getReactSandBoxConfig = async (
    folderPath: string,
    currentExample: TExampleInfo,
    baseUrl: string
): Promise<SandboxConfig> => {
    const tsPath = path.join(folderPath, "index.tsx");
    let code = await fs.promises.readFile(tsPath, "utf8");
    let files: IFiles = {};
    await includeImportedModules(folderPath, files, code, true, true, baseUrl);
    code = code.replace(/\.\.\/.*styles\/Examples\.module\.scss/, `./styles/Examples.module.scss`);
    code = await includeExternalModules(folderPath, folderPath, files, code, true, true);
    // console.log("creating sandbox", currentExample.title, currentExample.path.replace("/", ""));
    // for (const f in files) {
    //    console.log(f);
    // }
    files = {
        ...commonFiles,
        ...files,
        "package.json": {
            // @ts-ignore
            content: {
                name: currentExample.path.replace("/", ""),
                version: "1.0.0",
                main: "src/index.tsx",
                scripts: {
                    start: "react-scripts start",
                    build: "react-scripts build",
                    test: "react-scripts test --env=jsdom",
                    eject: "react-scripts eject",
                },
                dependencies: {
                    "@emotion/react": "^11.13.3",
                    "@emotion/styled": "^11.13.0", // peer dependency of @mui/material
                    "@mui/material": "^5.15.20", // Change to MUI v5
                    "@mui/lab": "^5.0.0-alpha.170",
                    "@mui/icons-material": "^5.15.20",
                    "tss-react": "^4.9.13",
                    sass: "^1.49.9",
                    "loader-utils": "3.2.1",
                    react: "^18.3.1",
                    "react-dom": "^18.3.1",
                    "react-scripts": "5.0.1",
                    // scichart: pj.dependencies.scichart,
                    scichart: SCICHART_VERSION,
                    "scichart-react": pj.dependencies["scichart-react"],
                    typescript: pj.devDependencies.typescript,
                    ...currentExample.extraDependencies,
                    "@types/react": "^18.3.11",
                    "@types/react-dom": "^18.3.1",
                    "@babel/runtime": "7.13.8",
                },
                browserslist: [">0.2%", "not dead", "not ie <= 11", "not op_mini all"],
            },
            isBinary: false,
        },
        "src/App.tsx": {
            content: code,
            isBinary: false,
        },
        "src/index.tsx": {
            content: `
import { createRoot, hydrateRoot } from "react-dom/client";

import { SciChartSurface, SciChart3DSurface } from "scichart";

import App from "./App";

const rootElement = document.getElementById("root");

SciChartSurface.UseCommunityLicense();
SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();

const root = createRoot(rootElement)
root.render(<><App />${SCICHART_ANCHOR}</>);
`,
            isBinary: false,
        },
        "public/index.html": {
            content: `<!DOCTYPE html>
        <html lang="en">
          <head>
          <title>React App</title>
          </head>
          <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root"></div>
          </body>
        </html>`,
            isBinary: false,
        },
    };

    if (currentExample.sandboxConfig) {
        files["sandbox.config.json"] = {
            // @ts-ignore
            content: currentExample.sandboxConfig,
            isBinary: false,
        };
    }
    return { files: { ...files, ...csStyles } };
};
