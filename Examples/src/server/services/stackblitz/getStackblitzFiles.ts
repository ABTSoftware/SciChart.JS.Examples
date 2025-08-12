import { Request, Response } from "express";
import path from "path";
import { EPageFramework, getFrameworkContent } from "../../../helpers/shared/Helpers/frameworkParametrization";
import { getSandboxConfig } from "../sandbox";
import { getRequestedExample } from "../../renderCodeSandboxRedirect";
import { BadRequestError, IHttpError } from "../../Errors";
import { TExamplePage } from "../../../components/AppRouter/examplePages";
import { loadStyles, SandboxConfig } from "../sandbox/sandboxDependencyUtils";
import { StackBlitzResponse } from "../../../helpers/types/types";
import { ProjectFiles } from "@stackblitz/sdk";

/**
 * Gets the files and configuration needed for StackBlitz project
 * @param req Express request object
 * @param res Express response object
 * @returns Promise that resolves when the response is sent
 */
export async function getStackblitzFiles(req: Request, res: Response): Promise<void> {
    try {
        await loadStyles();
        // Get the example information
        const exampleInfo = getRequestedExample(req, res);
        if (!exampleInfo?.currentExample) {
            res.status(404).json({ error: "Example not found" });
            return;
        }
        const currentExample = exampleInfo.currentExample;
        // Validate and get framework
        const framework = validateFramework(req.query.framework as string);

        // Get base URL for assets
        const baseUrl = `${req.protocol}://${req.get("host")}`;

        // Get sandbox configuration
        const basePath = path.join(__dirname, "Examples");
        const folderPath = path.join(basePath, currentExample.filepath);
        const sandboxConfig = await getSandboxConfig(folderPath, exampleInfo.currentExample, framework, baseUrl);
        // console.log("sandboxConfig", Object.keys(sandboxConfig.files));
        // Format response for StackBlitz
        const response = formatStackBlitzResponse(sandboxConfig, exampleInfo.currentExample);

        res.status(200).json(response);
    } catch (err) {
        handleError(err, res);
    }
}

/**
 * Validates and returns the framework, defaulting to React if invalid
 * @param framework Framework from query parameter
 * @returns Valid EPageFramework value
 */
function validateFramework(framework: string): EPageFramework {
    const isValidFramework = Object.values(EPageFramework).includes(framework as EPageFramework);
    return isValidFramework ? (framework as EPageFramework) : EPageFramework.React;
}

const handleInvalidFrameworkValue = (value: never): never => {
    throw new Error("Invalid framework value!");
};

// TODO this was copy-pasted. refactor
const getStackblitzTemplate = (framework: EPageFramework) => {
    switch (framework) {
        case EPageFramework.Angular:
            return "node";
        case EPageFramework.React:
            return "create-react-app";
        case EPageFramework.Vanilla:
            return "typescript";
        default:
            return handleInvalidFrameworkValue(framework);
    }
};

/**
 * Formats sandbox configuration into StackBlitz response format
 * @param sandboxConfig Configuration from sandbox service
 * @param example Example information
 * @param framework Selected framework
 * @returns Formatted StackBlitz response
 */
function formatStackBlitzResponse(
    sandboxConfig: SandboxConfig & { actualFramework: EPageFramework },
    example: TExamplePage
): StackBlitzResponse {
    const { files } = sandboxConfig;
    const packageJsonContent = files["package.json"]?.content as any;

    // Format files for StackBlitz
    const stackblitzFiles: ProjectFiles = {};
    Object.entries(files).forEach(([filename, file]: [string, any]) => {
        stackblitzFiles[filename] = file.content;
    });
    stackblitzFiles["package.json"] = JSON.stringify(packageJsonContent);

    // Get the title string by calling the title template function with the framework
    const title = getFrameworkContent(example.title, sandboxConfig.actualFramework) || "SciChart Example";

    const template = getStackblitzTemplate(sandboxConfig.actualFramework);

    return {
        files: stackblitzFiles,
        title,
        description: "SciChart.js Example",
        template,
        dependencies: packageJsonContent?.dependencies || {},
        devDependencies: packageJsonContent?.devDependencies || {},
        settings: {
            compile: {
                clearConsole: false,
                action: "refresh",
                trigger: "save",
            },
        },
    };
}

/**
 * Handles errors and sends appropriate response
 * @param err Error object
 * @param res Express response object
 */
function handleError(err: unknown, res: Response): void {
    console.error("Error getting StackBlitz files:", err);

    if (err instanceof BadRequestError) {
        res.status(400).json({ error: err.message });
        return;
    }

    const error = err as IHttpError;
    if (error?.status) {
        res.status(error.status).json({ error: error.message });
        return;
    }

    res.status(500).json({ error: "Internal server error" });
}
