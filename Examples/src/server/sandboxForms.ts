import * as path from "path";
import * as fs from "fs";
import { getParameters } from "codesandbox/lib/api/define";
import { IFiles, csStyles } from "./sandboxDependencyUtils";
import { type TExampleInfo } from "../components/AppRouter/examplePages";
import { NotFoundError } from "./Errors";
import { EPageFramework } from "../helpers/shared/Helpers/frameworkParametrization";
const pj = require("../../package.json");

const includeImportedModules = async (folderPath: string, files: IFiles, code: string) => {
    const localImports = Array.from(code.matchAll(/import.*from ["']\.\/(.*)["'];/g));

    for (const localImport of localImports) {
        if (localImport.length > 1) {
            let content: string = "";
            try {
                const filepath = path.join(folderPath, localImport[1] + ".ts");
                const csPath = "src/" + localImport[1] + ".ts";
                content = await fs.promises.readFile(filepath, "utf8");
                files[csPath] = { content, isBinary: false };
            } catch (e) {
                const filepath = path.join(folderPath, localImport[1] + ".tsx");
                const csPath = "src/" + localImport[1] + ".tsx";
                content = await fs.promises.readFile(filepath, "utf8");
                files[csPath] = { content, isBinary: false };
            }
            const nestedImports = Array.from(content.matchAll(/import.*from "\.\/(.*)";/g));
            if (nestedImports.length > 0) {
                localImports.push(...nestedImports);
            }
        }
    }
};

const getCodeSandBoxForm = async (folderPath: string, currentExample: TExampleInfo) => {
    const tsPath = path.join(folderPath, "index.tsx");
    let code = await fs.promises.readFile(tsPath, "utf8");
    let files: IFiles = {};
    await includeImportedModules(folderPath, files, code);

    code = code.replace(/\.\.\/.*styles\/Examples\.module\.scss/, `./styles/Examples.module.scss`);
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
                    "@material-ui/core": "4.12.4",
                    "@material-ui/lab": "4.0.0-alpha.61",
                    sass: "^1.49.9",
                    "loader-utils": "3.2.1",
                    react: "^17.0.2",
                    "react-dom": "^17.0.2",
                    "react-scripts": "5.0.1",
                    scichart: pj.dependencies.scichart,
                    "scichart-react": pj.dependencies["scichart-react"],
                    "scichart-example-dependencies": pj.dependencies["scichart-example-dependencies"],
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
    files = { ...files, ...csStyles };

    const parameters = getParameters({ files });
    return `<form name="codesandbox" id="codesandbox" action="https://codesandbox.io/api/v1/sandboxes/define" method="POST">
        <input type="hidden" name="parameters" value="${parameters}" />
    </form>`;
};

const getAngularCodeSandBoxForm = async (folderPath: string, currentExample: TExampleInfo) => {
    const tsPath = path.join(folderPath, "angular.ts");
    let code: string;
    try {
        code = await fs.promises.readFile(tsPath, "utf8");
    } catch (err) {
        throw new NotFoundError("Angular version not found! Try using different framework.");
    }
    let files: IFiles = {};
    await includeImportedModules(folderPath, files, code);

    code = code.replace(/\.\.\/.*styles\/Examples\.module\.scss/, `./styles/Examples.module.scss`);
    code = code.replace("./drawExample", "../drawExample");
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
                    build: "ng build --prod",
                    test: "ng test",
                    lint: "ng lint",
                    e2e: "ng e2e",
                },
                private: true,
                dependencies: {
                    "@angular/animations": "15.0.3",
                    "@angular/common": "15.0.3",
                    "@angular/compiler": "15.0.3",
                    "@angular/core": "15.0.3",
                    "@angular/forms": "15.0.3",
                    "@angular/platform-browser": "15.0.3",
                    "@angular/platform-browser-dynamic": "15.0.3",
                    "@angular/router": "15.0.3",
                    "core-js": "3.26.1",
                    rxjs: "7.6.0",
                    "zone.js": "0.12.0",
                    scichart: pj.dependencies.scichart,
                    "scichart-angular": pj.dependencies["scichart-angular"],
                    "scichart-example-dependencies": pj.dependencies["scichart-example-dependencies"],
                    ...currentExample.extraDependencies,
                },
                devDependencies: {
                    "@angular/cli": "1.6.6",
                    "@angular/compiler-cli": "^5.2.0",
                    "@angular/language-service": "^5.2.0",
                    "@types/core-js": "0.9.46",
                    "@types/jasmine": "~2.8.3",
                    "@types/jasminewd2": "~2.0.2",
                    "@types/node": "~6.0.60",
                    codelyzer: "^4.0.1",
                    "jasmine-core": "~2.8.0",
                    "jasmine-spec-reporter": "~4.2.1",
                    karma: "~2.0.0",
                    "karma-chrome-launcher": "~2.2.0",
                    "karma-coverage-istanbul-reporter": "^1.2.1",
                    "karma-jasmine": "~1.1.0",
                    "karma-jasmine-html-reporter": "^0.2.2",
                    protractor: "~5.1.2",
                    "ts-node": "~4.1.0",
                    tslint: "~5.9.1",
                    typescript: "~2.5.3",
                },
            },
        },
        ".angular-cli.json": {
            content: `{
  "apps": [
    {
      "root": "src",
      "outDir": "dist",
      "assets": [],
      "index": "index.html",
      "main": "main.ts",
      "polyfills": "polyfills.ts",
      "prefix": "app",
      "styles": [],
      "scripts": [],
      "environmentSource": "environments/environment.ts",
      "environments": {
        "dev": "environments/environment.ts",
        "prod": "environments/environment.prod.ts"
      }
    }
  ]
}
`,
            isBinary: false,
        },
        "src/typings.d.ts": {
            content: `declare var module: NodeModule;
interface NodeModule {
  id: string;
}`,
            isBinary: false,
        },
        "src/polyfills.ts": {
            content: `import "core-js/proposals/reflect-metadata";
import "zone.js/dist/zone";`,
            isBinary: false,
        },
        "src/environments/environment.prod.ts": {
            content: `export const environment = {
  production: true
};`,
            isBinary: false,
        },
        "src/environments/environment.ts": {
            content: `export const environment = {
  production: false
};`,
            isBinary: false,
        },
        "src/app/app.component.ts": {
            content: code,
            isBinary: false,
        },
        "src/app/app.component.html": {
            content: `<scichart-angular [initChart]="drawExample"></scichart-angular>`,
            isBinary: false,
        },
        "src/app/app.module.ts": {
            content: `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { ScichartAngularComponent } from 'scichart-angular';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    ScichartAngularComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }`,
            isBinary: false,
        },
        "src/main.ts": {
            content: `import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { environment } from "./environments/environment";

import { AppModule } from "./app/app.module";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);`,
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
    files = { ...files, ...csStyles };

    const parameters = getParameters({ files });
    return `<form name="codesandbox" id="codesandbox" action="https://codesandbox.io/api/v1/sandboxes/define" method="POST">
        <input type="hidden" name="parameters" value="${parameters}" />
        <input type="hidden" name="query" value="file=readme.md" />
    </form>`;
};

const vanillaIndexCode = `import "./common";
import "./app";
`;

const vanillaCommonCode = `import { SciChart3DSurface, SciChartSurface } from "scichart";

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();
`;

const getVanillaTsCodeSandBoxForm = async (folderPath: string, currentExample: TExampleInfo) => {
    const tsPath = path.join(folderPath, "vanilla.ts");
    let code: string;
    try {
        code = await fs.promises.readFile(tsPath, "utf8");
    } catch (err) {
        throw new NotFoundError("Vanilla version not found! Try using different framework.");
    }
    code = code.replace(/\.\.\/.*styles\/Examples\.module\.scss/, `./styles/Examples.module.scss`);
    const template = "parcel";

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
                    "scichart-example-dependencies": pj.dependencies["scichart-example-dependencies"],
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
            content: `<!DOCTYPE html>
        <html lang="en">
          <head>
          <title>SciChart Example</title>
          <script async type="text/javascript" src="src/index.ts"></script>
          </head>
          <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="chart"></div>
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
    files = { ...files, ...csStyles };

    await includeImportedModules(folderPath, files, code);
    const parameters = getParameters({ files, template });
    return `<form name="codesandbox" id="codesandbox" action="https://codesandbox.io/api/v1/sandboxes/define" method="POST">
        <input type="hidden" name="parameters" value="${parameters}" />
    </form>`;
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

export const getSandboxWithTemplate = (folderPath: string, currentExample: TExampleInfo, framework: EPageFramework) => {
    switch (framework) {
        case EPageFramework.Angular:
            return getAngularCodeSandBoxForm(folderPath, currentExample);
        case EPageFramework.Vue:
            throw new Error("Not Implemented");
        case EPageFramework.React:
            return getCodeSandBoxForm(folderPath, currentExample);
        case EPageFramework.Vanilla:
            return getVanillaTsCodeSandBoxForm(folderPath, currentExample);
        default:
            return handleInvalidFrameworkValue(framework);
    }
};

const handleInvalidFrameworkValue = (value: never): never => {
    throw new Error("Invalid framework value!");
};
