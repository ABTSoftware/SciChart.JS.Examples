import { SandboxPlatform } from "../CodeSandbox/SandboxPlatform";

// Types for the API responses
interface SandboxUrlResponse {
    url: string;
}

interface SandboxErrorResponse {
    error: string;
    alternativeUrl: string;
}

type Framework = "react" | "angular" | "vanilla";

// Function to extract sandbox ID from URL
export function extractSandboxId(url: string, platform: SandboxPlatform): string {
    try {
        if (platform === SandboxPlatform.CodeSandbox) {
            // Extract ID from CodeSandbox URL format
            const match = url.match(/\/s\/([^/?]+)/);
            return match ? match[1] : "";
        } else {
            // Extract ID from StackBlitz URL format
            const match = url.match(/\/run\?project\[id\]=([^&]+)/);
            return match ? match[1] : "";
        }
    } catch (e) {
        console.error("Failed to parse sandbox URL:", e);
        return "";
    }
}

// Function to get CodeSandbox URL
export async function getCodeSandboxUrl(examplePath: string, framework: Framework = "react"): Promise<string> {
    try {
        const response = await fetch(`/api/codesandbox/url/${examplePath}?framework=${framework}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = (await response.json()) as SandboxUrlResponse | SandboxErrorResponse;

        if ("error" in data) {
            throw new Error(`API error: ${data.error}. Alternative URL: ${data.alternativeUrl}`);
        }

        return data.url;
    } catch (error) {
        console.error("Failed to get CodeSandbox URL:", error);
        throw error;
    }
}

// Function to get Stackblitz URL
export async function getStackblitzUrl(examplePath: string, framework: Framework = "react"): Promise<string> {
    try {
        const response = await fetch(`/api/stackblitz/url/${examplePath}?framework=${framework}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = (await response.json()) as SandboxUrlResponse | SandboxErrorResponse;

        if ("error" in data) {
            throw new Error(`API error: ${data.error}. Alternative URL: ${data.alternativeUrl}`);
        }

        return data.url;
    } catch (error) {
        console.error("Failed to get Stackblitz URL:", error);
        throw error;
    }
}
