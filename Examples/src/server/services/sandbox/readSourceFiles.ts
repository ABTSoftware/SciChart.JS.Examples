import { EPageFramework } from "../../../helpers/shared/Helpers/frameworkTypes";
import type { SourceFilesVariant } from "../../../helpers/types/types";
import type { TExampleInfo } from "../../../components/AppRouter/examplePages";
import { getSandboxConfig } from "./index";

/** Preview, local editing and hosted sandboxes share exactly the same runnable project. */
export const readSourceFiles = async (
    framework: EPageFramework,
    folderPath: string,
    baseUrl: string,
    stylesPath?: string,
    example: Pick<TExampleInfo, "path" | "extraDependencies" | "sandboxConfig"> = { path: "scichart-example" }
): Promise<SourceFilesVariant> => {
    const config = await getSandboxConfig(folderPath, example as TExampleInfo, framework, baseUrl, stylesPath);
    return {
        framework: config.actualFramework,
        files: Object.entries(config.files).map(([name, file]) => ({ name, content: file.content })),
    };
};
