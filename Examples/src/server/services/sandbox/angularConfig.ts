import path from "path";
import fs from "fs";

import { TExampleInfo } from "../../../components/AppRouter/examplePages";
import { NotFoundError } from "../../Errors";
import { IFiles, includeExternalModules, SandboxConfig } from "./sandboxDependencyUtils";
import { SCICHART_ANCHOR } from "./constants";
import { getExampleDependencies, jsonFile } from "./sandboxPackages";

export const getAngularSrc = async (folderPath: string) => {
    let code: string;
    const tsPath = path.join(folderPath, "angular.ts");
    try {
        code = await fs.promises.readFile(tsPath, "utf8");
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT")
            throw new NotFoundError("Angular version not found! Try using different framework.");
        throw err;
    }

    return code;
};

export const getAngularSandBoxConfig = async (
    folderPath: string,
    currentExample: TExampleInfo,
    baseUrl: string
): Promise<SandboxConfig> => {
    let code = await getAngularSrc(folderPath);

    let files: IFiles = {};

    code = await includeExternalModules(
        folderPath,
        folderPath,
        files,
        code,
        true,
        true,
        baseUrl,
        "src/app.component.ts",
        "angular.ts"
    );
    files = {
        ...files,
        "package.json": jsonFile({
            name: currentExample.path.replace(/[^a-z0-9-]/gi, "").toLowerCase(),
            version: "1.0.0",
            private: true,
            scripts: { start: "ng serve --host 0.0.0.0", build: "ng build" },
            dependencies: {
                ...getExampleDependencies(
                    { ...files, "src/app.component.ts": { content: code, isBinary: false } },
                    currentExample.extraDependencies
                ),
                "@angular/compiler": "^18.2.8",
                "@angular/common": "^18.2.8",
                "@angular/core": "^18.2.8",
                "@angular/platform-browser": "^18.2.8",
                rxjs: "~7.8.0",
                tslib: "^2.3.0",
                "zone.js": "~0.14.10",
            },
            devDependencies: {
                "@angular-devkit/build-angular": "^18.2.8",
                "@angular/cli": "^18.2.8",
                "@angular/compiler-cli": "^18.2.8",
                typescript: "5.5.2",
            },
        }),
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
      "command": "npm install"
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
            "styles": ["src/styles.css"],
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
            "production": { "optimization": { "styles": { "inlineCritical": false } } },
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
        "src/app.component.ts": {
            content: code,
            isBinary: false,
        },
        "src/app-wrapper.component.ts": {
            content: `import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AppComponent } from './app.component';
import { SciChartSurface, SciChart3DSurface } from 'scichart';

SciChartSurface.UseCommunityLicense();
SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();

@Component({
  selector: 'app-root',
  template: '<ng-container #chart></ng-container>',
  standalone: true,
})
export class AppWrapperComponent implements OnInit {
  @ViewChild('chart', { read: ViewContainerRef, static: true })
  private container!: ViewContainerRef;

  ngOnInit(): void {
    const chart = this.container.createComponent(AppComponent);
    Object.assign(chart.location.nativeElement.style, {
      display: 'block', width: '100%', height: '100%',
    });
  }
}
`,
            isBinary: false,
        },
        "src/main.ts": {
            content: `import { bootstrapApplication } from '@angular/platform-browser';
import { AppWrapperComponent } from './app-wrapper.component';
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
    <app-root style="display: block; width: 100%; height: 100vh;"></app-root>
    ${SCICHART_ANCHOR}
  </body>
</html>`,
            isBinary: false,
        },
        "readme.md": {
            content: `# Angular ${currentExample.path} Example
Run npm install, then npm run start. Run npm run build to create a production bundle.
            `,
            isBinary: false,
        },
        "sandbox.config.json": {
            isBinary: false,
            content: `{
"infiniteLoopProtection": false,
"hardReloadOnChange": false,
"view": "browser",
"template": "node"
}`,
        },
    };

    return { files };
};
