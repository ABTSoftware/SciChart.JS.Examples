import * as fs from "fs";
import * as path from "path";
import { Compiler, Compilation, sources } from "webpack";

interface FileConfig {
    path: string;
    name?: string;
}

interface InlineResourcesPluginOptions {
    inlineJs?: boolean;
    inlineJson?: boolean;
    inlineWasm?: boolean;
    jsonFiles?: FileConfig[];
    wasmFiles?: FileConfig[];
}

interface InlineAssets {
    wasm: Record<string, string>;
    json: Record<string, unknown>;
}

export class InlineResourcesPlugin {
    private options: Required<InlineResourcesPluginOptions>;

    constructor(options: InlineResourcesPluginOptions = {}) {
        this.options = {
            inlineJs: options.inlineJs ?? true,
            inlineJson: options.inlineJson ?? true,
            inlineWasm: options.inlineWasm ?? true,
            jsonFiles: options.jsonFiles ?? [],
            wasmFiles: options.wasmFiles ?? [
                { path: "../../src/_wasm/scichart2d.wasm", name: "scichart2d.wasm" }
                // { path: "../../src/_wasm/scichart3d.wasm", name: "scichart3d.wasm" }
            ]
        };
    }

    apply(compiler: Compiler): void {
        compiler.hooks.emit.tapAsync(
            "InlineResourcesPlugin",
            (compilation: Compilation, callback) => {
                try {
                    this.inlineAssets(compilation, compiler.context);
                    callback();
                } catch (error) {
                    console.error("InlineResourcesPlugin error:", error);
                    callback(error as Error);
                }
            }
        );
    }

    private inlineAssets(compilation: Compilation, context: string): void {
        // Collect WASM data
        const wasmData: Record<string, string> = {};
        if (this.options.inlineWasm) {
            this.options.wasmFiles.forEach(wasmFile => {
                const wasmPath = path.resolve(context, wasmFile.path);
                const wasmName = wasmFile.name || path.basename(wasmFile.path);

                if (fs.existsSync(wasmPath)) {
                    const wasmBuffer = fs.readFileSync(wasmPath);
                    const base64 = wasmBuffer.toString("base64");
                    wasmData[wasmName] = base64;
                    console.log(
                        `✓ Encoded WASM ${wasmName}: ${(base64.length / 1024 / 1024).toFixed(
                            2
                        )} MB (base64)`
                    );
                } else {
                    console.warn(`WASM file not found: ${wasmPath}`);
                }
            });
        }

        // Find HTML and JS assets
        const htmlAssets = Object.keys(compilation.assets).filter(name => name.endsWith(".html"));
        const jsAssets = Object.keys(compilation.assets).filter(name => name === "bundle.js");

        htmlAssets.forEach(htmlFile => {
            let htmlContent = this.getAssetContent(compilation.assets[htmlFile]);

            // Create inline assets object
            const inlineAssets: InlineAssets = {
                wasm: wasmData,
                json: {}
            };

            // Inline JSON files
            if (
                this.options.inlineJson &&
                this.options.jsonFiles &&
                this.options.jsonFiles.length > 0
            ) {
                inlineAssets.json = {};
                this.options.jsonFiles.forEach(jsonFile => {
                    const jsonPath = path.join(
                        path.dirname(compilation.outputOptions.path as string),
                        jsonFile.path
                    );
                    const key =
                        jsonFile.name || path.basename(jsonFile.path, path.extname(jsonFile.path));
                    console.log(`Attempting to inline JSON from: ${jsonPath}`);
                    if (fs.existsSync(jsonPath)) {
                        const jsonContent = fs.readFileSync(jsonPath, "utf-8");
                        inlineAssets.json[key] = JSON.parse(jsonContent);
                        console.log(`✓ Inlined JSON test results: ${key}`);
                    } else {
                        console.warn(`JSON file not found at: ${jsonPath}`);
                        // Create a fallback empty results object
                    }
                });
            }

            // Create WASM decoder script (must be at beginning of head, before fetch override)
            const wasmDecoderScript = this.createWasmDecoderScript();

            // Create WASM loader script (must be at beginning of head)
            const wasmLoaderScript = this.createWasmLoaderScript();

            // Create fetch override script (must be at beginning of head, after WASM decoder)
            const fetchOverrideScript = this.createFetchOverrideScript();

            // Inject WASM decoder at beginning of head (decodes base64 to ArrayBuffer)
            htmlContent = htmlContent.replace(/<head>/, `<head>\n${wasmDecoderScript}`);

            // Inject WASM loader at beginning of head
            htmlContent = htmlContent.replace(/<head>/, `<head>\n${wasmLoaderScript}`);

            // Inject fetch override at beginning of head (after WASM decoder and loader)
            htmlContent = htmlContent.replace(/<head>/, `<head>\n${fetchOverrideScript}`);

            // Remove preload links if WASM inlining is enabled
            if (this.options.inlineWasm) {
                htmlContent = htmlContent.replace(
                    /<link\s+rel\s*=\s*["']preload["']\s+[^>]*?\bhref\s*=\s*["'][^"']*\.wasm["'][^>]*?>/gi,
                    ""
                );
                console.log("✓ Removed preload links for inlined WASM files");
            }

            // Inject inline assets data at end of head
            const inlineAssetsJson = JSON.stringify(inlineAssets);
            htmlContent = htmlContent.replace(
                /<head>/,
                `<head>\n<script>
window.__INLINE_ASSETS__ = ${inlineAssetsJson};
</script>\n`
            );

            // Inline JavaScript directly without eval
            if (this.options.inlineJs && jsAssets.length > 0) {
                const jsContent = this.getAssetContent(compilation.assets[jsAssets[0]]);

                // Remove bundle.js script tag (handles various forms: defer, async, type attributes, etc.)
                // Matches: <script src="bundle.js"></script>, <script defer src="bundle.js"></script>, etc.
                htmlContent = htmlContent.replace(
                    /<script\s+[^>]*?\bsrc\s*=\s*["']bundle\.js["'][^>]*?><\/script>/gi,
                    ""
                );

                // Insert the bundle script directly at end of head (before closing head tag)
                // Set webpack public path to "/" to avoid "Automatic publicPath is not supported" error
                const bundleInlineScript =
                    "<script>\n" +
                    'window.__webpack_public_path__ = "/";\n' +
                    "(function() {\n" +
                    jsContent +
                    "\n" +
                    "})();\n" +
                    "</script>\n" +
                    "</head>\n";

                htmlContent = htmlContent.replace(/<\/head>/, bundleInlineScript);

                // Mark JS for deletion
                delete compilation.assets[jsAssets[0]];
                console.log("✓ Inlined JavaScript bundle");
            } else {
                // If not inlining JS, just inject inline assets data at end of head
                // Keep the original bundle.js script tag to fetch from server
                const inlineAssetsJson = JSON.stringify(inlineAssets);
                htmlContent = htmlContent.replace(
                    /<\/head>/i,
                    `<script>
window.__INLINE_ASSETS__ = ${inlineAssetsJson};
</script>\n</head>`
                );
                console.log("✓ Kept external JavaScript bundle reference");
            }

            // Update the HTML asset
            compilation.assets[htmlFile] = new sources.RawSource(htmlContent);

            console.log("✓ Generated single-file production build");
        });
    }

    private createWasmLoaderScript(): string {
        return `
<script>
// WASM Loader - Initialize WASM loading before any other scripts
${this.getDecodingUtilities()}

// Prepare WASM data for loading
window.__WASM_LOADER__ = {
    decodeWasm: function(base64) {
        return decodeBase64ToArrayBuffer(base64);
    },
    loadWasm: function(wasmName) {
        if (window.__INLINE_ASSETS__ && window.__INLINE_ASSETS__.wasm && window.__INLINE_ASSETS__.wasm[wasmName]) {
            const base64 = window.__INLINE_ASSETS__.wasm[wasmName];
            return this.decodeWasm(base64);
        }
        return null;
    }
};
</script>
`;
    }

    private createWasmDecoderScript(): string {
        return `
<script>
// WASM Decoder - Pre-decode base64 WASM into ArrayBuffers before fetch override
${this.getDecodingUtilities()}

// Pre-decode WASM data when inline assets are available
(function() {
    if (window.__INLINE_ASSETS__ && window.__INLINE_ASSETS__.wasm) {
        window.__WASM_BUFFERS__ = {};
        for (const wasmName in window.__INLINE_ASSETS__.wasm) {
            const base64 = window.__INLINE_ASSETS__.wasm[wasmName];
            window.__WASM_BUFFERS__[wasmName] = decodeBase64ToArrayBuffer(base64);
            // console.log('[WasmDecoder] Pre-decoded WASM:', wasmName);
        }
    } else {
        console.warn("no assets found!")
        }
})();
</script>
`;
    }

    private createFetchOverrideScript(): string {
        return `
<script>
// Intercept fetch requests
const originalFetch = window.fetch;
window.fetch = function(resource, init) {
    const url = typeof resource === 'string' ? resource : resource.url;
    const filename = url.split('/').pop().split('?')[0];
    
    // console.log('[InlineAssets] Fetch intercepted:', url);
    
    // Check for pre-decoded WASM buffers (decoded before fetch override)
    if (window.__WASM_BUFFERS__ && window.__WASM_BUFFERS__[filename]) {
        // console.log('[InlineAssets] Returning pre-decoded WASM buffer:', filename);
        const arrayBuffer = window.__WASM_BUFFERS__[filename];
        return Promise.resolve(new Response(arrayBuffer, {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'application/wasm',
                'Content-Length': arrayBuffer.byteLength.toString()
            }
        }));
    }
    
    // Check for inlined JSON files - always return them (never attempt real fetch)
    if (window.__INLINE_ASSETS__ && window.__INLINE_ASSETS__.json) {
        // Check if this filename matches any of the inlined JSON files
        for (const key in window.__INLINE_ASSETS__.json) {
            // Match by filename or by key
            if (filename === key || filename === key + '.json' || url.endsWith(key) || url.endsWith(key + '.json')) {
                console.log('[InlineAssets] Returning inlined JSON:', key);
                return Promise.resolve(new Response(JSON.stringify(window.__INLINE_ASSETS__.json[key]), {
                    status: 200,
                    statusText: 'OK',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }));
            }
        }
    }
    
    // For other files, use original fetch
    // console.log('[InlineAssets] Passing through to original fetch:', url);
    return originalFetch.apply(this, arguments);
};
</script>
`;
    }

    private getDecodingUtilities(): string {
        return `
function decodeBase64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
`;
    }

    private getAssetContent(asset: any): string {
        const source = asset.source();
        return typeof source === "string" ? source : source.toString("utf-8");
    }
}
