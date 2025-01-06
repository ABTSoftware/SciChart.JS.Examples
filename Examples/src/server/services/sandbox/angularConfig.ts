import path from "path";
import fs from "fs";

import { TExampleInfo } from "../../../components/AppRouter/examplePages";
import { NotFoundError } from "../../Errors";
import { IFiles, includeImportedModules, includeExternalModules, commonFiles } from "./sandboxDependencyUtils";
import { SCICHART_ANCHOR, SCICHART_VERSION } from "./constants";

const pj = require("../../../../package.json");

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

export const getAngularSandBoxConfig = async (folderPath: string, currentExample: TExampleInfo, baseUrl: string) => {
    let code = await getAngularSrc(folderPath);

    let files: IFiles = {};
    await includeImportedModules(folderPath, files, code, true, true, baseUrl);

    code = code.replace(/\.\.\/.*styles\/Examples\.module\.scss/, `./styles/Examples.module.scss`);
    code = await includeExternalModules(folderPath, folderPath, files, code, true, true);
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
                    // scichart: pj.dependencies.scichart,
                    scichart: SCICHART_VERSION,
                    "scichart-angular": pj.dependencies["scichart-angular"],
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
                    typescript: "5.5.2",
                },
            },
        },
        ".devcontainer/devcontainer.json": {
            isBinary: false,
            content: `{
  "name": "Devcontainer",
  "image": "ghcr.io/codesandbox/devcontainers/typescript-node:latest",
  "customizations": {
    "vscode": {
      "extensions": [
        "Angular.ng-template"
      ]
    }
  }
}`,
        },
        ".codesandbox/tasks.json": {
            isBinary: false,
            content: `{
  // These tasks will run in order when initializing your CodeSandbox project.
  "setupTasks": [
    {
      "name": "Install Dependencies",
      "command": "npm install --legacy-peer-deps"
    }
  ],

  // These tasks can be run from CodeSandbox. Running one will open a log in the app.
  "tasks": {
    "start": {
      "name": "start",
      "command": "npm run start",
      "runAtStart": true,
      "preview": {
        "port": 4200
      }
    }
  }
}`,
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
            "strict": false,
            "noImplicitOverride": true,
            "strictPropertyInitialization": false,
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

SciChartSurface.UseCommunityLicense();
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
    ${SCICHART_ANCHOR}
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
