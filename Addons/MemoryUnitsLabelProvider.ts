import { NumericLabelProvider, TFormatLabelFn } from "scichart";

export class MemoryUnitsLabelProvider extends NumericLabelProvider {
    public override get formatLabel(): TFormatLabelFn {
        return formatBytes;
    }
    public override get formatCursorLabel() {
        return formatBytes;
    }
}

const units = ["B", "KB", "MB", "GB", "TB", "PB"] as const;
const base = 1024;

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";

    let i = 0;
    let value = bytes;

    while (value >= base && i < units.length - 1) {
        value /= base;
        i++;
    }

    const formatted = Number(value.toPrecision(4)).toString();
    return `${formatted} ${units[i]}`;
}
