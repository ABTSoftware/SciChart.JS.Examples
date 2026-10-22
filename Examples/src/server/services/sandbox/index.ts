import type { TExampleInfo } from "../../../components/AppRouter/examplePages";
import { EPageFramework } from "../../../helpers/shared/Helpers/frameworkTypes";
import { getAngularSandBoxConfig } from "./angularConfig";
import { getVanillaTsSandBoxConfig } from "./vanillaTsConfig";
import { csStyles, loadStyles, handleInvalidFrameworkValue, SandboxConfig } from "./sandboxDependencyUtils";
import { getReactSandBoxConfig } from "./reactConfig";
import * as fs from "fs";
import * as path from "path";
import { jsonFile } from "./sandboxPackages";
import { loadExampleStylesheet, useSingleExampleStylesheet } from "./sandboxStyles";

const getFrameworkSandboxConfig = async (
    folderPath: string,
    currentExample: TExampleInfo,
    framework: EPageFramework,
    baseUrl: string
): Promise<SandboxConfig & { actualFramework: EPageFramework }> => {
    const entryFiles = { react: "index.tsx", javascript: "vanilla.ts", angular: "angular.ts" };
    if (!(framework in entryFiles)) return handleInvalidFrameworkValue(framework as never);
    let actualFramework = framework;
    if (framework !== EPageFramework.React) {
        try {
            await fs.promises.access(path.join(folderPath, entryFiles[framework]));
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
            actualFramework = EPageFramework.React;
        }
    }
    const generators = {
        react: getReactSandBoxConfig,
        javascript: getVanillaTsSandBoxConfig,
        angular: getAngularSandBoxConfig,
    };
    return { ...(await generators[actualFramework](folderPath, currentExample, baseUrl)), actualFramework };
};

export const getSandboxConfig = async (
    folderPath: string,
    currentExample: TExampleInfo,
    framework: EPageFramework,
    baseUrl: string,
    stylesPath?: string
): Promise<SandboxConfig & { actualFramework: EPageFramework }> => {
    await loadStyles(stylesPath);
    const config = await getFrameworkSandboxConfig(folderPath, currentExample, framework, baseUrl);
    if (currentExample.sandboxConfig) {
        config.files["sandbox.config.json"] = jsonFile({
            ...JSON.parse(config.files["sandbox.config.json"].content),
            ...currentExample.sandboxConfig,
            template: "node",
        });
    }
    const uiCss = csStyles?.["src/index.css"]?.content;

    if (uiCss === undefined) {
        throw new Error("Sandbox styles have not been loaded");
    }

    const entryFiles = {
        [EPageFramework.React]: "src/App.tsx",
        [EPageFramework.Vanilla]: "src/app.ts",
        [EPageFramework.Angular]: "src/app.component.ts",
    };
    const entryFilePath = entryFiles[config.actualFramework];
    const css = await loadExampleStylesheet(folderPath, config.actualFramework, uiCss, config.files);

    return {
        ...config,
        files: useSingleExampleStylesheet(config.files, css, entryFilePath),
    };
};
