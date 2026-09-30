import { TExampleInfo } from "../../../components/AppRouter/examplePages";
import { EPageFramework } from "../../../helpers/shared/Helpers/frameworkParametrization";
import { getAngularSandBoxConfig } from "./angularConfig";
import { getVanillaTsSandBoxConfig } from "./vanillaTsConfig";
import { csStyles, handleInvalidFrameworkValue, SandboxConfig } from "./sandboxDependencyUtils";
import { getReactSandBoxConfig } from "./reactConfig";
import { NotFoundError } from "../../Errors";
import { useSingleExampleStylesheet } from "./sandboxStyles";

const getFrameworkSandboxConfig = async (
    folderPath: string,
    currentExample: TExampleInfo,
    framework: EPageFramework,
    baseUrl: string
): Promise<SandboxConfig & { actualFramework: EPageFramework }> => {
    try {
        switch (framework) {
            case EPageFramework.Angular:
                return {
                    ...(await getAngularSandBoxConfig(folderPath, currentExample, baseUrl)),
                    actualFramework: EPageFramework.Angular,
                };
            // case EPageFramework.Vue:
            //     throw new Error("Not Implemented");
            case EPageFramework.React:
                return {
                    ...(await getReactSandBoxConfig(folderPath, currentExample, baseUrl)),
                    actualFramework: EPageFramework.React,
                };
            case EPageFramework.Vanilla:
                try {
                    return {
                        ...(await getVanillaTsSandBoxConfig(folderPath, currentExample, baseUrl)),
                        actualFramework: EPageFramework.Vanilla,
                    };
                } catch (err) {
                    // If vanilla files not found, fallback to React
                    if (err instanceof NotFoundError || (err as any).status === 404) {
                        console.log("Vanilla version not found, falling back to React");
                        return {
                            ...(await getReactSandBoxConfig(folderPath, currentExample, baseUrl)),
                            actualFramework: EPageFramework.React,
                        };
                    }
                    throw err;
                }
            default:
                return handleInvalidFrameworkValue(framework);
        }
    } catch (err) {
        // If any framework fails and it's not React, try React as fallback
        if (framework !== EPageFramework.React) {
            console.log(`${framework} version failed, falling back to React`);
            return {
                ...(await getReactSandBoxConfig(folderPath, currentExample, baseUrl)),
                actualFramework: EPageFramework.React,
            };
        }
        throw err;
    }
};

export const getSandboxConfig = async (
    folderPath: string,
    currentExample: TExampleInfo,
    framework: EPageFramework,
    baseUrl: string
): Promise<SandboxConfig & { actualFramework: EPageFramework }> => {
    const config = await getFrameworkSandboxConfig(folderPath, currentExample, framework, baseUrl);
    const uiCss = csStyles?.["src/index.css"]?.content;

    if (uiCss === undefined) {
        throw new Error("Sandbox styles have not been loaded");
    }

    const entryFiles = {
        [EPageFramework.React]: "src/App.tsx",
        [EPageFramework.Vanilla]: "src/app.ts",
        [EPageFramework.Angular]: "src/app/app.component.ts",
    };
    const entryFilePath = entryFiles[config.actualFramework];
    const stylesheetImportPath = config.actualFramework === EPageFramework.Angular ? undefined : "./index.css";

    return {
        ...config,
        files: useSingleExampleStylesheet(config.files, uiCss, entryFilePath, stylesheetImportPath),
    };
};
