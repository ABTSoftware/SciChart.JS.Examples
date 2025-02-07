import { SandboxPlatform } from "../CodeSandbox/SandboxPlatform";
import { EPageFramework } from "../../helpers/shared/Helpers/frameworkParametrization";
import type { StackBlitzResponse } from "../../helpers/types/types";

// Types for the API responses
interface SandboxUrlResponse {
    id: string;
    actualFramework: EPageFramework;
}

interface SandboxErrorResponse {
    error: string;
    alternativeUrl: string;
}

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

// Function to get make sandbox
const GET_SANDBOX_URL = "/api/sandboxurl/";
export async function getSandboxUrl(
    examplePath: string,
    framework: EPageFramework = EPageFramework.React,
    platform = "codeSandbox"
): Promise<{ id: string; actualFramework: EPageFramework }> {
    try {
        const response = await fetch(`${GET_SANDBOX_URL}${examplePath}?framework=${framework}&platform=${platform}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(response);
        const data = (await response.json()) as SandboxUrlResponse | SandboxErrorResponse;
        console.log(data);

        if ("error" in data) {
            throw new Error(`API error: ${data.error}. Alternative URL: ${data.alternativeUrl}`);
        }

        console.log(data);
        return { id: data.id, actualFramework: data.actualFramework };
    } catch (error) {
        console.error("Failed to get CodeSandbox URL:", error);
        throw error;
    }
}

// Function to get StackBlitz files
export async function getStackBlitzFiles(
    examplePath: string,
    framework: EPageFramework = EPageFramework.React
): Promise<StackBlitzResponse> {
    try {
        const response = await fetch(`/api/stackblitz/files/${examplePath}?framework=${framework}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if ("error" in data) {
            throw new Error(`API error: ${data.error}`);
        }

        return data as StackBlitzResponse;
    } catch (error) {
        console.error("Failed to get StackBlitz files:", error);
        throw error;
    }
}
