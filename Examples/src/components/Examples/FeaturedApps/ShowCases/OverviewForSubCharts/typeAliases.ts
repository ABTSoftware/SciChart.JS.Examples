import { EPerformanceMarkType, TSerializableMark } from "scichart";

// TODO allow custom mark types
export type TMarkType = EPerformanceMarkType | string;

type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

export type TMark = TSerializableMark;

export type TWasmContextId = string;
export type TCanvasId = string;
export type TSurfaceId = string;
export type TSubSurfaceId = string;
export type TRenderableSeriesId = string;
export type TDataSeriesId = string;
