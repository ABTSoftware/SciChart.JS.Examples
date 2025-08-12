import { IPointMetadata, parseColorToUIntArgb } from "scichart";

export class SunburstMetadata implements IPointMetadata {
    public static create(title: string, start: number, end: number, level: number, id: number[], colorHtml: string) {
        const md = new SunburstMetadata();
        md.title = title;
        md.start = start;
        md.end = end;
        md.colorArgb = parseColorToUIntArgb(colorHtml);
        md.colorArgbWithOpacity = parseColorToUIntArgb(colorHtml, 180);
        md.level = level;
        md.id = id;
        return md;
    }

    public id: number[];
    public isSelected: boolean = false;
    public title: string;
    public start: number;
    public end: number;
    public colorArgb: number;
    public colorArgbWithOpacity: number;
    public level: number;

    public get value(): number {
        return this.end - this.start;
    }

    private constructor() {}
}
