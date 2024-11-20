import { TExampleInfo } from "../../../components/AppRouter/examplePages";
import { EPageFramework } from "../../../helpers/shared/Helpers/frameworkParametrization";
import { getAngularSandBoxConfig } from "./angularConfig";
import { getVanillaTsSandBoxConfig } from "./vanillaTsConfig";
import { handleInvalidFrameworkValue } from "./sandboxDependencyUtils";
import { getReactSandBoxConfig } from "./reactConfig";

export const getSandboxConfig = (
    folderPath: string,
    currentExample: TExampleInfo,
    framework: EPageFramework,
    baseUrl: string
) => {
    switch (framework) {
        case EPageFramework.Angular:
            return getAngularSandBoxConfig(folderPath, currentExample, baseUrl);
        // case EPageFramework.Vue:
        //     throw new Error("Not Implemented");
        case EPageFramework.React:
            return getReactSandBoxConfig(folderPath, currentExample, baseUrl);
        case EPageFramework.Vanilla:
            return getVanillaTsSandBoxConfig(folderPath, currentExample, baseUrl);
        default:
            return handleInvalidFrameworkValue(framework);
    }
};
