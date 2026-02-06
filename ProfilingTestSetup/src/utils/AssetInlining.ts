/**
 * Utility module for encoding and decoding inlined assets (WASM, JSON, etc.)
 * Used in both production builds (inlining) and runtime (decoding)
 */

/**
 * Decode base64 string to ArrayBuffer
 * Used for WASM files and other binary data
 */
export function decodeBase64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Encode ArrayBuffer to base64 string
 * Used during build time to encode WASM files
 */
export function encodeArrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Create a Response object from base64-encoded data
 * Useful for intercepting fetch calls
 */
export function createResponseFromBase64(
    base64: string,
    contentType: string = "application/octet-stream"
): Response {
    const arrayBuffer = decodeBase64ToArrayBuffer(base64);
    return new Response(arrayBuffer, {
        status: 200,
        statusText: "OK",
        headers: {
            "Content-Type": contentType,
            "Content-Length": arrayBuffer.byteLength.toString()
        }
    });
}

/**
 * Global interface for inlined assets
 */
declare global {
    interface Window {
        __INLINE_ASSETS__?: {
            wasm?: Record<string, string>;
            json?: Record<string, any>;
            js?: string;
        };
    }
}

export {};
