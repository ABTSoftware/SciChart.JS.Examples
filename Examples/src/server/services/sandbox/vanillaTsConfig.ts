import * as path from "path";
import * as fs from "fs";
import { NotFoundError } from "../../Errors";
import { TExampleInfo } from "../../../components/AppRouter/examplePages";
import { IFiles, csStyles, includeImportedModules } from "./sandboxDependencyUtils";

const pj = require("../../../../package.json");

const vanillaIndexCode = `import "./src/common";
import "./src/app";
`;

const vanillaCommonCode = `import { SciChart3DSurface, SciChartSurface } from "scichart";

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();
`;

export const indexHtmlTemplate = (customChartSetup?: string) => `<!DOCTYPE html>
<html lang="en">
    <head>
    <title>SciChart Example</title>
    <script async type="text/javascript" src="index.ts"></script>
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        ${customChartSetup ?? `<div id="chart"></div>`}
    </body>
</html>`;

export const getVanillaSrc = async (folderPath: string) => {
    const tsPath = path.join(folderPath, "vanilla.ts");
    let code: string;
    try {
        code = await fs.promises.readFile(tsPath, "utf8");
    } catch (err) {
        throw new NotFoundError("Vanilla version not found! Try using different framework.");
    }

    return code;
};

export const getVanillaTsSandBoxConfig = async (folderPath: string, currentExample: TExampleInfo, baseUrl: string) => {
    let code = await getVanillaSrc(folderPath);

    code = code.replace(/\.\.\/.*styles\/Examples\.module\.scss/, `./styles/Examples.module.scss`);

    let htmlCode = indexHtmlTemplate();

    try {
        const indexHtmlPath = path.join(folderPath, "index.html");
        const charHtmlSetup = await fs.promises.readFile(indexHtmlPath, "utf8");
        htmlCode = indexHtmlTemplate(charHtmlSetup);
    } catch (err) {}

    let files: IFiles = {
        "package.json": {
            // @ts-ignore
            content: {
                name: currentExample.path.replace("/", ""),
                version: "1.0.0",
                main: "index.ts",
                scripts: {
                    start: "parcel index.html",
                    build: "parcel build index.html",
                },
                dependencies: {
                    scichart: pj.dependencies.scichart,
                    "parcel-bundler": "1.6.1",
                    ...currentExample.extraDependencies,
                },
                devDependencies: {
                    typescript: "4.9.5",
                },
                browserslist: [">0.2%", "not ie <= 11", "not op_mini all"],
                resolutions: {
                    "@babel/preset-env": "7.13.8",
                },
                keywords: ["typescript", "javascript", "chart", "scichart"],
            },
        },
        "index.ts": {
            content: vanillaIndexCode,
            isBinary: false,
        },
        "src/common.ts": {
            content: vanillaCommonCode,
            isBinary: false,
        },

        "src/app.ts": {
            content: code,
            isBinary: false,
        },
        "tsconfig.json": {
            content: `{
  "include": [
      "./src/**/*"
  ],
  "compilerOptions": {
      "strict": false,
      "esModuleInterop": true,
      "target": "es5",
      "downlevelIteration": true,
      "lib": [
          "dom",
          "es2015"
      ],
      "typeRoots": ["./src/types", "./node_modules/@types"],
      "jsx": "react-jsx"
  }
}`,
            isBinary: false,
        },
        "sandbox.config.json": {
            content: `{
    "infiniteLoopProtection": false,
    "hardReloadOnChange": false,
    "view": "browser"
}`,
            isBinary: false,
        },
        "src/types/declaration.d.ts": {
            content: `declare module "*.scss" {
            const content: Record<string, string>;
            export default content;
        }`,
            isBinary: false,
        },
        "src/types/jpg.d.ts": {
            content: `declare module "*.jpg" {
            const value: any;
            export default value;
        }`,
            isBinary: false,
        },
        "src/types/png.d.ts": {
            content: `declare module "*.png" {
            const value: any;
            export default value;
        } `,
            isBinary: false,
        },
        "src/types/svg.d.ts": {
            content: `declare module "*.svg" {
            const value: any;
            export default value;
        }`,
            isBinary: false,
        },
        "index.html": {
            content: htmlCode,
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
    files = { ...files, ...csStyles };

    await includeImportedModules(folderPath, files, code, true, true, baseUrl);
    return { files };
};
