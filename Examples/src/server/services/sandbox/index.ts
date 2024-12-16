import { TExampleInfo } from "../../../components/AppRouter/examplePages";
import { EPageFramework } from "../../../helpers/shared/Helpers/frameworkParametrization";
import { getAngularSandBoxConfig } from "./angularConfig";
import { getVanillaTsSandBoxConfig } from "./vanillaTsConfig";
import { handleInvalidFrameworkValue } from "./sandboxDependencyUtils";
import { getReactSandBoxConfig } from "./reactConfig";
import { NotFoundError } from "../../Errors";

export const getSandboxConfig = async (
    folderPath: string,
    currentExample: TExampleInfo,
    framework: EPageFramework,
    baseUrl: string
): Promise<{ files: any; actualFramework: EPageFramework }> => {
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
