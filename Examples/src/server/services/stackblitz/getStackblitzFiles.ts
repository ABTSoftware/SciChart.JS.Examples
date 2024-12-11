import { Request, Response } from "express";
import path from "path";
import { EPageFramework, TFrameworkName } from "../../../helpers/shared/Helpers/frameworkParametrization";
import { getSandboxConfig } from "../sandbox";
import { getRequestedExample } from "../../renderCodeSandboxRedirect";
import { BadRequestError, IHttpError } from "../../Errors";
import { TExamplePage } from "../../../components/AppRouter/examplePages";

interface StackBlitzResponse {
    files: { [key: string]: { content: string } };
    title: string;
    description: string;
    template: string;
    dependencies: { [key: string]: string };
    devDependencies: { [key: string]: string };
    settings: {
        compile: {
            clearConsole: boolean;
            action: string;
            trigger: string;
        };
    };
}

/**
 * Gets the files and configuration needed for StackBlitz project
 * @param req Express request object
 * @param res Express response object
 * @returns Promise that resolves when the response is sent
 */
export async function getStackblitzFiles(req: Request, res: Response): Promise<void> {
    try {
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

        // Format response for StackBlitz
        const response = formatStackBlitzResponse(sandboxConfig, exampleInfo.currentExample, framework);

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

/**
 * Formats sandbox configuration into StackBlitz response format
 * @param sandboxConfig Configuration from sandbox service
 * @param example Example information
 * @param framework Selected framework
 * @returns Formatted StackBlitz response
 */
function formatStackBlitzResponse(
    sandboxConfig: any,
    example: TExamplePage,
    framework: EPageFramework
): StackBlitzResponse {
    const { files } = sandboxConfig;
    const packageJsonContent = files["package.json"]?.content;
    let packageJsonData;

    try {
        packageJsonData = packageJsonContent ? JSON.parse(packageJsonContent) : null;
    } catch (err) {
        console.error("Error parsing package.json:", err);
        packageJsonData = null;
    }

    // Format files for StackBlitz
    const stackblitzFiles: { [key: string]: { content: string } } = {};
    Object.entries(files).forEach(([filename, file]: [string, any]) => {
        if (filename !== "package.json") {
            stackblitzFiles[filename] = {
                content: file.content,
            };
        }
    });

    // Get the title string by calling the title template function with the framework
    const title =
        typeof example.title === "function"
            ? example.title(framework.toLowerCase() as TFrameworkName)
            : example.title || "SciChart Example";

    return {
        files: stackblitzFiles,
        title,
        description: "SciChart.js Example",
        template: "typescript",
        dependencies: packageJsonData?.dependencies || {},
        devDependencies: packageJsonData?.devDependencies || {},
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
