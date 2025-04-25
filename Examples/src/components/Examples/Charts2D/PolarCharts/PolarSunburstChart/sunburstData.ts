import { appTheme } from "../../../theme";
import { SunburstMetadata } from "./SunburstMetadata";

type TElement = {
    name: string;
    value: number;
    colorHtml: string;
    children: TElement[];
};

export const sunburstData: TElement = {
    name: "Eve",
    value: 65,
    colorHtml: appTheme.VividPink,
    children: [
        {
            name: "Cain",
            value: 14,
            colorHtml: appTheme.MutedRed,
            children: []
        },
        {
            name: "Seth",
            value: 14,
            colorHtml: appTheme.MutedSkyBlue,
            children: [
                {
                    name: "Enos",
                    value: 10,
                    children: [],
                    colorHtml: appTheme.PaleSkyBlue
                },
                {
                    name: "Noam",
                    value: 4,
                    children: [],
                    colorHtml: appTheme.MutedBlue
                }
            ]
        },
        {
            name: "Abel",
            value: 6,
            colorHtml: appTheme.VividTeal,
            children: []
        },
        {
            name: "Awan",
            value: 6,
            colorHtml: appTheme.VividOrange,
            children: [
                {
                    name: "Enoch",
                    value: 4,
                    colorHtml: appTheme.MutedOrange,
                    children: [
                        {
                            name: "Michael",
                            value: 3,
                            colorHtml: appTheme.PaleOrange,
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            name: "Azura",
            value: 8,
            colorHtml: appTheme.MutedPurple,
            children: []
        }
    ]
};

type TLevelDataEntry = {
    id: number[];
    start: number;
    end: number;
    name: string;
    colorHtml: string;
};

export type TLevelDataForChart = {
    data: number[][];
    metadata: SunburstMetadata[];
};

const getDataByLevelInternal = (
    curId: number[],
    curLevel: number,
    curElement: TElement,
    startX: number,
    res: TLevelDataEntry[][]
): TLevelDataEntry[][] => {
    if (!res[curLevel]) {
        res.push([]);
    }
    res[curLevel].push({
        id: [...curId],
        start: startX,
        end: startX + curElement.value,
        name: curElement.name,
        colorHtml: curElement.colorHtml
    });
    let startChild = startX;
    for (let i = 0; i < curElement.children.length; i++) {
        const childElement = curElement.children[i];
        getDataByLevelInternal([...curId, i], curLevel + 1, childElement, startChild, res);
        startChild += childElement.value;
    }
    return res;
};

export const getElementById = (id: number[]): TElement | undefined => {
    let el: TElement = {
        name: "root",
        value: -1,
        colorHtml: "#000000",
        children: [sunburstData]
    };
    for (let i = 0; i < id.length; i++) {
        const levelIndex = id[i];
        el = el.children[levelIndex];
        if (!el) return undefined;
    }
    return el;
};

export const getDataById = (id: number[]): TLevelDataForChart[] => {
    const element = getElementById(id);
    if (!element) {
        return [];
    }
    const levelDataListList = getDataByLevelInternal(id, 0, element, 0, []);
    const res: TLevelDataForChart[] = [];
    for (let i = 0; i < levelDataListList.length; i++) {
        const levelDataList = levelDataListList[i];
        const xValues: number[] = [];
        const x1Values: number[] = [];
        const yValues: number[] = [];
        const metadata: SunburstMetadata[] = [];
        levelDataList.forEach(v => {
            xValues.push(v.start);
            x1Values.push(v.end);
            yValues.push(i + 1);
            metadata.push(SunburstMetadata.create(v.name, v.start, v.end, i, v.id, v.colorHtml));
        });
        res.push({
            data: [xValues, yValues, x1Values],
            metadata
        });
    }

    return res;
};
