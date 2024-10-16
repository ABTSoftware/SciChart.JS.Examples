import * as path from "path";
import * as fs from "fs";
import { IFiles, csStyles } from "./sandboxDependencyUtils";
import { type TExampleInfo } from "../components/AppRouter/examplePages";
import { NotFoundError } from "./Errors";
import { EPageFramework } from "../helpers/shared/Helpers/frameworkParametrization";
const pj = require("../../package.json");

const includeExternalModules = async (
    folderPath: string,
    files: IFiles,
    content: string,
    includeImages: boolean,
    updateImports: boolean
) => {
    // Pull files outside the local folder into it and rewrite the import
    const externalImports = Array.from(content.matchAll(/from "\.\.\/(.*)";/g));
    if (externalImports.length > 0) {
        for (const externalImport of externalImports) {
            if (externalImport.length > 1) {
                if (externalImport[1].endsWith(".png") || externalImport[1].endsWith(".jpg")) {
                    if (includeImages) {
                        // handle images
                        const csPath = "src/" + externalImport[1];
                        const filename = externalImport[1].substring(externalImport[1].lastIndexOf("/") + 1);
                        files[csPath] = { content: "https://demo.scichart.com/images/" + filename, isBinary: true };
                    }
                } else {
                    const filepath = path.join(folderPath, "../" + externalImport[1] + ".ts");
                    const filename = externalImport[1].substring(externalImport[1].lastIndexOf("/") + 1);
                    const csPath = "src/" + filename + ".ts";
                    if (updateImports) {
                        content = content.replace("../" + externalImport[1], "./" + filename);
                    }
                    if (!files[csPath]) {
                        const externalContent = await fs.promises.readFile(filepath, "utf8");
                        files[csPath] = { content: externalContent, isBinary: false };
                    }
                }
            }
        }
    }
    return content;
};

const includeImportedModules = async (
    folderPath: string,
    files: IFiles,
    code: string,
    includeImages: boolean,
    updateImports: boolean,
    baseUrl: string
) => {
    const localImports = Array.from(code.matchAll(/from ["']\.\/(.*)["'];/g));
    for (const localImport of localImports) {
        if (localImport.length > 1) {
            let content: string = "";
            let csPath: string = "";
            if (localImport[1].endsWith(".png") || localImport[1].endsWith(".jpg")) {
                if (includeImages) {
                    // handle images
                    csPath = "src/" + localImport[1];
                    const filename = localImport[1].substring(localImport[1].lastIndexOf("/") + 1);
                    console.log(baseUrl + filename);
                    files[csPath] = { content: baseUrl + filename, isBinary: true };
                }
            } else {
                try {
                    const filepath = path.join(folderPath, localImport[1] + ".ts");
                    csPath = "src/" + localImport[1] + ".ts";
                    content = await fs.promises.readFile(filepath, "utf8");
                } catch (e) {
                    const filepath = path.join(folderPath, localImport[1] + ".tsx");
                    csPath = "src/" + localImport[1] + ".tsx";
                    content = await fs.promises.readFile(filepath, "utf8");
                }
                const nestedImports = Array.from(content.matchAll(/from "\.\/(.*)";/g));
                if (nestedImports.length > 0) {
                    localImports.push(...nestedImports);
                }
                content = await includeExternalModules(folderPath, files, content, includeImages, updateImports);
                files[csPath] = { content, isBinary: false };
            }
        }
    }
};

export const getSourceFilesForPath = async (folderPath: string, startFile: string, baseUrl: string) => {
    const tsPath = path.join(folderPath, startFile);
    let code = await fs.promises.readFile(tsPath, "utf8");
    let files: IFiles = {};
    await includeImportedModules(folderPath, files, code, false, false, baseUrl);
    code = code.replace(/\.\.\/.*styles\/Examples\.module\.scss/, `./styles/Examples.module.scss`);
    await includeExternalModules(folderPath, files, code, false, false);
    files[tsPath] = { content: code, isBinary: false };
    return files;
};

export type SandboxConfig = { files: IFiles };

const getReactSandBoxConfig = async (
    folderPath: string,
    currentExample: TExampleInfo,
    baseUrl: string
): Promise<SandboxConfig> => {
    const tsPath = path.join(folderPath, "index.tsx");
    let code = await fs.promises.readFile(tsPath, "utf8");
    let files: IFiles = {};
    await includeImportedModules(folderPath, files, code, true, true, baseUrl);
    code = code.replace(/\.\.\/.*styles\/Examples\.module\.scss/, `./styles/Examples.module.scss`);
    code = await includeExternalModules(folderPath, files, code, true, true);

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
                    "@emotion/styled": "^11.13.0",
                    "@mui/material": "^5.15.20", // Change to MUI v5
                    "@mui/lab": "^5.0.0-alpha.170",
                    "@mui/styles": "^5.15.21",
                    sass: "^1.49.9",
                    "loader-utils": "3.2.1",
                    react: "^17.0.2",
                    "react-dom": "^17.0.2",
                    "react-scripts": "5.0.1",
                    scichart: pj.dependencies.scichart,
                    "scichart-react": pj.dependencies["scichart-react"],
                    ...currentExample.extraDependencies,
                },
                devDependencies: {
                    "@types/react": "^17.0.52",
                    "@types/react-dom": "18.0.9",
                    "@babel/runtime": "7.13.8",
                    typescript: "4.9.5",
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
import { hydrate } from "react-dom";
import { SciChartSurface, SciChart3DSurface } from "scichart";

import App from "./App";

const rootElement = document.getElementById("root");
SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();
hydrate( <App />, rootElement);
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

export const getAngularSrc = async (folderPath: string) => {
    let code: string;
    const tsPath = path.join(folderPath, "angular.ts");
    try {
        code = await fs.promises.readFile(tsPath, "utf8");
    } catch (err) {
        throw new NotFoundError("Angular version not found! Try using different framework.");
    }

    return code;
};

const getAngularSandBoxConfig = async (folderPath: string, currentExample: TExampleInfo, baseUrl: string) => {
    let code = await getAngularSrc(folderPath);

    let files: IFiles = {};
    await includeImportedModules(folderPath, files, code, true, true, baseUrl);

    code = code.replace(/\.\.\/.*styles\/Examples\.module\.scss/, `./styles/Examples.module.scss`);
    code = await includeExternalModules(folderPath, files, code, true, true);
    code = code.replace(/(\.\/)/g, "../");
    files = {
        ...commonFiles,
        ...files,
        "package.json": {
            // @ts-ignore
            content: {
                name: currentExample.path,
                version: "1.0.0",
                scripts: {
                    ng: "ng",
                    start: "ng serve",
                    build: "ng build",
                    watch: "ng build --watch --configuration development",
                    test: "ng test",
                },
                private: true,
                dependencies: {
                    "@angular/animations": "^18.2.0",
                    "@angular/common": "^18.2.0",
                    "@angular/compiler": "^18.2.0",
                    "@angular/core": "^18.2.0",
                    "@angular/forms": "^18.2.0",
                    "@angular/platform-browser": "^18.2.0",
                    "@angular/platform-browser-dynamic": "^18.2.0",
                    "@angular/router": "^18.2.0",
                    "@angular/material": "^18.2.8",
                    "@angular/cdk": "^18.1.0",
                    rxjs: "~7.8.0",
                    scichart: "^3.4.672",
                    "scichart-angular": "^0.0.2",
                    tslib: "^2.3.0",
                    "zone.js": "~0.14.10",

                    "@angular-devkit/build-angular": "^18.2.8",
                    "@angular/cli": "^18.2.8",
                    "@angular/compiler-cli": "^18.2.0",
                    "@types/jasmine": "~5.1.0",
                    "jasmine-core": "~5.2.0",
                    karma: "~6.4.0",
                    "karma-chrome-launcher": "~3.2.0",
                    "karma-coverage": "~2.2.0",
                    "karma-jasmine": "~5.1.0",
                    "karma-jasmine-html-reporter": "~2.1.0",
                    typescript: "~5.5.2",
                },
            },
        },
        "angular.json": {
            content: `{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "cli": {
    "analytics": false
  },
  "newProjectRoot": "projects",
  "projects": {
    "template": {
      "projectType": "application",
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/template",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.json",
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              }
            ],
            "scripts": []
          },
          "configurations": {
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "template:build:production"
            },
            "development": {
              "buildTarget": "template:build:development"
            }
          },
          "defaultConfiguration": "development"
        }
      }
    }
  }
}
`,
            isBinary: false,
        },
        "tsconfig.json": {
            content: `/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
        /* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
        {
          "compileOnSave": false,
          "compilerOptions": {
            "outDir": "./dist/out-tsc",
            "strict": true,
            "noImplicitOverride": true,
            "noPropertyAccessFromIndexSignature": true,
            "noImplicitReturns": true,
            "noFallthroughCasesInSwitch": true,
            "skipLibCheck": true,
            "isolatedModules": true,
            "esModuleInterop": true,
            "sourceMap": true,
            "declaration": false,
            "experimentalDecorators": true,
            "moduleResolution": "bundler",
            "importHelpers": true,
            "target": "ES2022",
            "module": "ES2022",
            "lib": [
              "ES2022",
              "dom"
            ]
          },
          "angularCompilerOptions": {
            "enableI18nLegacyMessageIdFormat": false,
            "strictInjectionParameters": true,
            "strictInputAccessModifiers": true,
            "strictTemplates": true
          }
        }
        `,
            isBinary: false,
        },
        "src/app/app.component.ts": {
            content: code,
            isBinary: false,
        },
        "src/app/app-wrapper.component.ts": {
            content: `import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AppComponent } from './app.component';
import { SciChartSurface, SciChart3DSurface } from 'scichart';

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();

@Component({
  selector: 'app-root',
  template: '',
  standalone: true,
})
export class AppWrapperComponent implements OnInit {
  constructor(private container: ViewContainerRef) {}
  ngOnInit(): void {
    this.container.createComponent(AppComponent);
  }
}
`,
            isBinary: false,
        },
        "src/main.ts": {
            content: `import { bootstrapApplication } from '@angular/platform-browser';
import { AppWrapperComponent } from './app/app-wrapper.component';
import 'zone.js';

bootstrapApplication(AppWrapperComponent).catch((err) => console.error(err));`,
            isBinary: false,
        },
        "src/index.html": {
            content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Angular Scichart App</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>`,
            isBinary: false,
        },
        "readme.md": {
            content: `# Angular ${currentExample.path} Example
    This sandbox uses Angular 15 to be compatible with the codesandbox.io,
    but you can use it with the latest Angular version.
            `,
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
    return { files: { ...files }, template: "node" };
};

const vanillaIndexCode = `import "./common";
import "./app";
`;

const vanillaCommonCode = `import { SciChart3DSurface, SciChartSurface } from "scichart";

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();
`;

export const indexHtmlTemplate = (customChartSetup?: string) => `<!DOCTYPE html>
<html lang="en">
    <head>
    <title>SciChart Example</title>
    <script async type="text/javascript" src="src/index.ts"></script>
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

const getVanillaTsSandBoxConfig = async (folderPath: string, currentExample: TExampleInfo, baseUrl: string) => {
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
                main: "src/index.ts",
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
        "src/index.ts": {
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

const commonFiles: IFiles = {
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
};

export const getSandboxConfig = (
    folderPath: string,
    currentExample: TExampleInfo,
    framework: EPageFramework,
    baseUrl: string
) => {
    switch (framework) {
        case EPageFramework.Angular:
            return getAngularSandBoxConfig(folderPath, currentExample, baseUrl);
        case EPageFramework.Vue:
            throw new Error("Not Implemented");
        case EPageFramework.React:
            return getReactSandBoxConfig(folderPath, currentExample, baseUrl);
        case EPageFramework.Vanilla:
            return getVanillaTsSandBoxConfig(folderPath, currentExample, baseUrl);
        default:
            return handleInvalidFrameworkValue(framework);
    }
};

const handleInvalidFrameworkValue = (value: never): never => {
    throw new Error("Invalid framework value!");
};
