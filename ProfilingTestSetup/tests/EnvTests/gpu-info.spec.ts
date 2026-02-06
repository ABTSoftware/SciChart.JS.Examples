import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * GPU Info Test Suite
 * Collects GPU and browser information and attaches it to the test report
 * Handles different browsers (Chrome, Firefox, Safari, Edge)
 */

interface GPUInfo {
    vendor: string;
    renderer: string;
    unmaskedVendor?: string;
    unmaskedRenderer?: string;
    webglVersion: string;
    maxTextureSize: number;
    maxRenderbufferSize: number;
    maxViewportDims: [number, number];
    supportedExtensions: string[];
    browserInfo: {
        userAgent: string;
        platform: string;
        language: string;
    };
    screenInfo: {
        width: number;
        height: number;
        colorDepth: number;
        pixelDepth: number;
        devicePixelRatio: number;
    };
    timestamp: string;
}

/**
 * Extract GPU information from WebGL context
 */
async function getGPUInfo(page: any): Promise<GPUInfo> {
    const gpuInfo = await page.evaluate(() => {
        // Create canvas and WebGL context
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");

        if (!gl) {
            throw new Error("WebGL not supported");
        }

        // Get WebGL version
        const webglVersion = gl instanceof WebGL2RenderingContext ? "WebGL 2.0" : "WebGL 1.0";

        // Get debug info extension
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        const vendor = debugInfo
            ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
            : gl.getParameter(gl.VENDOR);
        const renderer = debugInfo
            ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            : gl.getParameter(gl.RENDERER);

        // Get capabilities
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
        const maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);

        // Get supported extensions
        const supportedExtensions = gl.getSupportedExtensions() || [];

        // Get browser info
        const browserInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
        };

        // Get screen info
        const screenInfo = {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth,
            devicePixelRatio: window.devicePixelRatio
        };

        return {
            vendor,
            renderer,
            unmaskedVendor: debugInfo
                ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
                : undefined,
            unmaskedRenderer: debugInfo
                ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
                : undefined,
            webglVersion,
            maxTextureSize,
            maxRenderbufferSize,
            maxViewportDims: Array.from(maxViewportDims) as [number, number],
            supportedExtensions,
            browserInfo,
            screenInfo,
            timestamp: new Date().toISOString()
        };
    });

    return gpuInfo;
}

/**
 * Generate HTML report for GPU info
 */
function generateGPUInfoHTML(gpuInfo: GPUInfo): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 20px; font-size: 16px; }
        .section { margin: 15px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #007bff; border-radius: 4px; }
        .info-row { display: flex; margin: 8px 0; }
        .label { font-weight: bold; width: 200px; color: #333; }
        .value { color: #666; word-break: break-all; }
        .gpu-vendor { color: #d9534f; font-weight: bold; }
        .gpu-renderer { color: #5cb85c; font-weight: bold; }
        .extensions { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 10px; }
        .extension-tag { background: #e7f3ff; padding: 5px 10px; border-radius: 3px; font-size: 12px; border-left: 3px solid #007bff; }
        .timestamp { text-align: right; color: #999; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🖥️ GPU & Browser Information Report</h1>
        
        <div class="section">
            <h2>GPU Information</h2>
            <div class="info-row">
                <span class="label">Vendor:</span>
                <span class="value gpu-vendor">${gpuInfo.vendor}</span>
            </div>
            <div class="info-row">
                <span class="label">Renderer:</span>
                <span class="value gpu-renderer">${gpuInfo.renderer}</span>
            </div>
            <div class="info-row">
                <span class="label">WebGL Version:</span>
                <span class="value">${gpuInfo.webglVersion}</span>
            </div>
            <div class="info-row">
                <span class="label">Max Texture Size:</span>
                <span class="value">${gpuInfo.maxTextureSize}px</span>
            </div>
            <div class="info-row">
                <span class="label">Max Renderbuffer Size:</span>
                <span class="value">${gpuInfo.maxRenderbufferSize}px</span>
            </div>
            <div class="info-row">
                <span class="label">Max Viewport Dimensions:</span>
                <span class="value">${gpuInfo.maxViewportDims[0]}x${
        gpuInfo.maxViewportDims[1]
    }px</span>
            </div>
        </div>

        <div class="section">
            <h2>Browser Information</h2>
            <div class="info-row">
                <span class="label">User Agent:</span>
                <span class="value">${gpuInfo.browserInfo.userAgent}</span>
            </div>
            <div class="info-row">
                <span class="label">Platform:</span>
                <span class="value">${gpuInfo.browserInfo.platform}</span>
            </div>
            <div class="info-row">
                <span class="label">Language:</span>
                <span class="value">${gpuInfo.browserInfo.language}</span>
            </div>
        </div>

        <div class="section">
            <h2>Screen Information</h2>
            <div class="info-row">
                <span class="label">Resolution:</span>
                <span class="value">${gpuInfo.screenInfo.width}x${
        gpuInfo.screenInfo.height
    }px</span>
            </div>
            <div class="info-row">
                <span class="label">Color Depth:</span>
                <span class="value">${gpuInfo.screenInfo.colorDepth} bits</span>
            </div>
            <div class="info-row">
                <span class="label">Pixel Depth:</span>
                <span class="value">${gpuInfo.screenInfo.pixelDepth} bits</span>
            </div>
            <div class="info-row">
                <span class="label">Device Pixel Ratio:</span>
                <span class="value">${gpuInfo.screenInfo.devicePixelRatio}</span>
            </div>
        </div>

        <div class="section">
            <h2>Supported WebGL Extensions (${gpuInfo.supportedExtensions.length})</h2>
            <div class="extensions">
                ${gpuInfo.supportedExtensions
                    .map(ext => `<div class="extension-tag">${ext}</div>`)
                    .join("")}
            </div>
        </div>

        <div class="timestamp">Generated: ${gpuInfo.timestamp}</div>
    </div>
</body>
</html>
    `;
}

test.describe("GPU Information", () => {
    test("collect GPU and browser info", async ({ page, browserName }) => {
        const testInfo = test.info();

        try {
            // Navigate to a blank page to ensure WebGL context can be created
            await page.goto("about:blank");

            // Get GPU information
            const gpuInfo = await getGPUInfo(page);

            // Attach GPU info as JSON
            await testInfo.attach("gpu-info-json", {
                body: JSON.stringify(gpuInfo, null, 2),
                contentType: "application/json"
            });

            // Generate and attach HTML report
            const htmlReport = generateGPUInfoHTML(gpuInfo);
            await testInfo.attach("gpu-info-report", {
                body: htmlReport,
                contentType: "text/html"
            });

            // Save HTML report to file system
            const outputDir = path.join(process.cwd(), "test-results", "gpu-reports");
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const reportPath = path.join(outputDir, `gpu-info-${browserName}-${timestamp}.html`);
            fs.writeFileSync(reportPath, htmlReport);
            console.log(`GPU info report saved to: ${reportPath}`);

            // Take a screenshot for visual reference
            const screenshot = await page.screenshot({ fullPage: true });
            await testInfo.attach("gpu-info-screenshot", {
                body: screenshot,
                contentType: "image/png"
            });

            // Assertions to ensure GPU info was collected
            expect(gpuInfo.vendor).toBeTruthy();
            expect(gpuInfo.renderer).toBeTruthy();
            expect(gpuInfo.webglVersion).toMatch(/WebGL/);
            expect(gpuInfo.maxTextureSize).toBeGreaterThan(0);
        } catch (error) {
            console.error("Failed to collect GPU information:", error);
            throw error;
        }
    });

    test("verify WebGL support", async ({ page }) => {
        const testInfo = test.info();

        const webglSupport = await page.evaluate(() => {
            const canvas1 = document.createElement("canvas");
            const canvas2 = document.createElement("canvas");
            const gl = canvas1.getContext("webgl") || canvas2.getContext("webgl2");
            return {
                webgl1Supported: !!canvas1.getContext("webgl"),
                webgl2Supported: !!canvas2.getContext("webgl2"),
                webglSupported: !!gl
            };
        });

        await testInfo.attach("webgl-support", {
            body: JSON.stringify(webglSupport, null, 2),
            contentType: "application/json"
        });

        expect(webglSupport.webglSupported).toBeTruthy();
    });

    test("cross-browser GPU capabilities comparison", async ({ page, browserName }) => {
        const testInfo = test.info();

        try {
            await page.goto("about:blank");

            const capabilities = await page.evaluate(() => {
                const canvas = document.createElement("canvas");
                const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");

                if (!gl) {
                    return { error: "WebGL not supported" };
                }

                const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
                const vendor = debugInfo
                    ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
                    : gl.getParameter(gl.VENDOR);
                const renderer = debugInfo
                    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
                    : gl.getParameter(gl.RENDERER);

                const maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
                return {
                    browser: navigator.userAgent,
                    vendor,
                    renderer,
                    webglVersion: gl instanceof WebGL2RenderingContext ? "WebGL 2.0" : "WebGL 1.0",
                    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                    maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
                    maxViewportDims: maxViewportDims ? Array.from(maxViewportDims) : [0, 0],
                    extensions: gl.getSupportedExtensions()?.length || 0,
                    // Browser-specific capabilities
                    platform: navigator.platform,
                    hardwareConcurrency: navigator.hardwareConcurrency,
                    deviceMemory: (navigator as any).deviceMemory,
                    maxTouchPoints: navigator.maxTouchPoints
                };
            });

            const viewportDims = (capabilities.maxViewportDims as number[])?.join("x") || "N/A";
            const comparisonReport = `
    GPU Capabilities Report - ${browserName.toUpperCase()}
    ================================================

    Browser Information:
      User Agent: ${capabilities.browser}
      Platform: ${capabilities.platform}
      Hardware Concurrency: ${capabilities.hardwareConcurrency}
      Device Memory: ${
          capabilities.deviceMemory ? capabilities.deviceMemory + " GB" : "Not available"
      }
      Max Touch Points: ${capabilities.maxTouchPoints}

    GPU Information:
      Vendor: ${capabilities.vendor}
      Renderer: ${capabilities.renderer}
      WebGL Version: ${capabilities.webglVersion}
      Max Texture Size: ${capabilities.maxTextureSize}px
      Max Renderbuffer Size: ${capabilities.maxRenderbufferSize}px
      Max Viewport Dimensions: ${viewportDims}px
      Supported Extensions: ${capabilities.extensions}

    Note:
    - Chrome/Chromium: Full GPU info available via chrome://gpu/
    - Firefox: GPU info available via about:support (about:support page)
    - Safari: Limited GPU info available, use Safari Developer Tools
    - Edge: Similar to Chrome, GPU info available via edge://gpu/
                `;

            await testInfo.attach(`gpu-capabilities-${browserName}`, {
                body: comparisonReport,
                contentType: "text/plain"
            });

            await testInfo.attach(`gpu-capabilities-${browserName}.json`, {
                body: JSON.stringify(capabilities, null, 2),
                contentType: "application/json"
            });

            // console.log(`GPU capabilities for ${browserName}:`, capabilities);
        } catch (error) {
            console.error(`Failed to collect GPU capabilities for ${browserName}:`, error);
            throw error;
        }
    });

    test("get GPU info via Chrome DevTools Protocol (Chromium only)", async ({
        page,
        browserName,
        context,
        browser
    }) => {
        test.skip(
            browserName !== "chromium",
            `Chrome DevTools Protocol is only available in Chromium, skipping for ${browserName}`
        );

        const testInfo = test.info();

        try {
            // Get CDP session from context
            const cdpSession = await browser.newBrowserCDPSession();

            // Get GPU info via CDP (cast to any to bypass TypeScript restrictions)
            const gpuInfo = await cdpSession.send("SystemInfo.getInfo");
            await cdpSession.detach();

            // Attach JSON report
            await testInfo.attach("cdp-gpu-info.json", {
                body: JSON.stringify(gpuInfo, null, 2),
                contentType: "application/json"
            });

            // Basic assertions
            expect(gpuInfo).toBeTruthy();
        } catch (error) {
            console.error("Failed to collect GPU info via CDP:", error);
            throw error;
        }
    });
});
