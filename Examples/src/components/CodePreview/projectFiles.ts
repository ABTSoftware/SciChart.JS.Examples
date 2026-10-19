import type { ExampleSourceFile } from "../../helpers/types/types";

export const getDefaultSourceFile = (files: ExampleSourceFile[]) =>
    files.find((file) => /(^|\/)drawExample\.(ts|js)$/.test(file.name)) ??
    files.find((file) => /(^|\/)(App\.tsx|app\.component\.ts|vanilla\.(ts|js))$/.test(file.name)) ??
    files[0];

export type FileTreeNode = { name: string; path: string; children?: FileTreeNode[] };

export function buildFileTree(files: ExampleSourceFile[]): FileTreeNode[] {
    const root: FileTreeNode[] = [];
    for (const file of files) {
        let siblings = root;
        const parts = file.name.split("/");
        parts.forEach((name, index) => {
            const path = parts.slice(0, index + 1).join("/");
            let node = siblings.find((item) => item.path === path);
            if (!node) {
                node = { name, path, ...(index < parts.length - 1 ? { children: [] } : {}) };
                siblings.push(node);
            }
            siblings = node.children;
        });
    }
    const sort = (nodes: FileTreeNode[]) => {
        nodes.sort((a, b) => Number(!!b.children) - Number(!!a.children) || a.name.localeCompare(b.name));
        nodes.forEach((node) => node.children && sort(node.children));
    };
    sort(root);
    return root;
}

// Store ZIP entries without compression so downloads need no editor dependency or network request.
export function createProjectZip(files: ExampleSourceFile[]): Uint8Array {
    const encoder = new TextEncoder();
    const entries: Uint8Array[] = [];
    const directory: Uint8Array[] = [];
    const seen = new Set<string>();
    let offset = 0;
    const header = (length: number) => {
        const bytes = new Uint8Array(length);
        return { bytes, view: new DataView(bytes.buffer) };
    };
    for (const file of files) {
        if (
            !file.name ||
            file.name.includes("\\") ||
            file.name.split("/").some((part) => !part || part === "." || part === "..") ||
            seen.has(file.name)
        ) {
            throw new Error("The project contains an invalid or duplicate file path.");
        }
        seen.add(file.name);
        const name = encoder.encode(file.name);
        const content = encoder.encode(file.content);
        let checksum = 0xffffffff;
        for (const byte of content) {
            checksum ^= byte;
            for (let bit = 0; bit < 8; bit++) checksum = (checksum >>> 1) ^ (checksum & 1 ? 0xedb88320 : 0);
        }
        checksum = (checksum ^ 0xffffffff) >>> 0;
        const local = header(30);
        local.view.setUint32(0, 0x04034b50, true);
        local.view.setUint16(4, 20, true);
        local.view.setUint16(6, 0x0800, true);
        local.view.setUint16(12, 0x0021, true);
        local.view.setUint32(14, checksum, true);
        local.view.setUint32(18, content.length, true);
        local.view.setUint32(22, content.length, true);
        local.view.setUint16(26, name.length, true);
        entries.push(local.bytes, name, content);
        const central = header(46);
        central.view.setUint32(0, 0x02014b50, true);
        central.view.setUint16(4, 20, true);
        central.view.setUint16(6, 20, true);
        central.view.setUint16(8, 0x0800, true);
        central.view.setUint16(14, 0x0021, true);
        central.view.setUint32(16, checksum, true);
        central.view.setUint32(20, content.length, true);
        central.view.setUint32(24, content.length, true);
        central.view.setUint16(28, name.length, true);
        central.view.setUint32(42, offset, true);
        directory.push(central.bytes, name);
        offset += local.bytes.length + name.length + content.length;
    }
    const directoryLength = directory.reduce((length, part) => length + part.length, 0);
    const end = header(22);
    end.view.setUint32(0, 0x06054b50, true);
    end.view.setUint16(8, files.length, true);
    end.view.setUint16(10, files.length, true);
    end.view.setUint32(12, directoryLength, true);
    end.view.setUint32(16, offset, true);
    const zip = new Uint8Array(offset + directoryLength + end.bytes.length);
    let cursor = 0;
    for (const part of [...entries, ...directory, end.bytes]) {
        zip.set(part, cursor);
        cursor += part.length;
    }
    return zip;
}
