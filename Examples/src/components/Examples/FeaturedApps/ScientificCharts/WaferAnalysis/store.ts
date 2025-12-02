import { create } from "zustand";
import crossfilter from "crossfilter2";

export type WaferData = {
    MAP_ROW: number;
    MAP_COL: number;
    DEFECT: string;
    MR: number;
    HR: number;
    HDI: number;
    MR2: number;
};

export type Filters = {
    [key: string]: string | number | undefined;
};

export interface DataStoreState {
    data: WaferData[];
    filters: Filters;
    dies: crossfilter.Crossfilter<WaferData> | null;
    Row: crossfilter.Dimension<WaferData, number> | null;
    Col: crossfilter.Dimension<WaferData, number> | null;
    MR: crossfilter.Dimension<WaferData, number> | null;
    MRs: crossfilter.Group<WaferData, number, unknown> | null;
    HR: crossfilter.Dimension<WaferData, number> | null;
    HRs: crossfilter.Group<WaferData, number, unknown> | null;
    HDI: crossfilter.Dimension<WaferData, number> | null;
    HDIs: crossfilter.Group<WaferData, number, unknown> | null;
    MR2: crossfilter.Dimension<WaferData, number> | null;
    MR2s: crossfilter.Group<WaferData, number, unknown> | null;
    setData: (data: WaferData[]) => void;
    setFilter: (dim: string, value: string | number) => void;
    clearFilters: () => void;
}

const useDataStore = create<DataStoreState>((set) => ({
    data: [],
    filters: {},
    dies: null,
    Row: null,
    Col: null,
    MR: null,
    MRs: null,
    HR: null,
    HRs: null,
    HDI: null,
    HDIs: null,
    MR2: null,
    MR2s: null,
    setData: (data) => {
        const dies = crossfilter(data);

        const Row = dies.dimension(function (d) {
            return d.MAP_ROW;
        });

        const Col = dies.dimension(function (d) {
            return d.MAP_COL;
        });

        const MR = dies.dimension(function (d) {
            return d.MR;
        });

        const MRs = MR.group(Math.floor);

        const HR = dies.dimension(function (d) {
            return d.HR;
        });

        const HRs = HR.group(function (d) {
            return Math.floor(d);
        });

        const HDI = dies.dimension(function (d) {
            return d.HDI;
        });

        const HDIs = HDI.group(function (d) {
            return Math.floor(d);
        });

        const MR2 = dies.dimension(function (d) {
            return d.MR2;
        });

        const MR2s = MR2.group(function (d) {
            return Math.floor(d);
        });

        set({
            data,
            dies,
            Row,
            Col,
            MR,
            MRs,
            HR,
            HRs,
            HDI,
            HDIs,
            MR2,
            MR2s,
        });
    },
    setFilter: (dim, value) =>
        set((state) => ({
            filters: { ...state.filters, [dim]: value },
        })),
    clearFilters: () => set({ filters: {} }),
}));

export default useDataStore;
