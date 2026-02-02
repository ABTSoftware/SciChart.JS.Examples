export type TDatasetId = "secondPrecision" | "millisecondPrecision" | "microsecondPrecision" | "nanosecondPrecision";

export interface DatasetDefinition {
    id: TDatasetId;
    xValues: Float64Array;
    yValues: Float64Array;
    minY: number;
    maxY: number;
}

const SECOND = 1;
const DAY = 86400;
const YEAR = DAY * 365;

const NS_IN_SEC = 1e9;
const MICRO_IN_SEC = 1e6;
const MS_IN_SEC = 1e3;

const base = 0; // 1 Jan 1970

export const createDatasets = (): DatasetDefinition[] => {
    // Dataset #1 - 1 Billion years with second precision clusters
    const CLUSTERS_1 = 200;
    const POINTS_PER_CLUSTER = 10;
    const TOTAL_SPAN_1000Y = 1_000_000_000 * YEAR;
    const CLUSTER_SPACING_1 = TOTAL_SPAN_1000Y / CLUSTERS_1;

    const count1 = CLUSTERS_1 * POINTS_PER_CLUSTER;
    const x1 = new Float64Array(count1);
    const y1 = new Float64Array(count1);

    let idx = 0;

    for (let c = 0; c < CLUSTERS_1; c++) {
        const clusterStart = base + c * CLUSTER_SPACING_1;

        for (let j = 0; j < POINTS_PER_CLUSTER; j++) {
            x1[idx] = clusterStart + j * SECOND;
            y1[idx] = 0.5 * Math.sin(c) - Math.cos(c * 0.3) + Math.random() / 100;
            idx++;
        }
    }

    // Dataset #2 - millisecond precision -> 70000 years
    const CLUSTERS_2 = 100;
    const RANGE_2 = YEAR * 70_000; // 70000 years
    const CLUSTER_SPACING_2 = RANGE_2 / CLUSTERS_2;

    const count2 = CLUSTERS_2 * POINTS_PER_CLUSTER;
    const x2 = new Float64Array(count2);
    const y2 = new Float64Array(count2);

    idx = 0;

    for (let c = 0; c < CLUSTERS_2; c++) {
        const clusterStart = base + c * CLUSTER_SPACING_2 * MS_IN_SEC;

        for (let j = 0; j < POINTS_PER_CLUSTER; j++) {
            x2[idx] = clusterStart + j;
            y2[idx] = Math.random() * 250 - 50;
            idx++;
        }
    }

    // Dataset 3. Microseconds. -> 40 years
    const CLUSTERS_3 = 20;
    const RANGE_3 = YEAR * 40; // 40 years
    const CLUSTER_SPACING_3 = RANGE_3 / CLUSTERS_3;

    const count3 = CLUSTERS_3 * POINTS_PER_CLUSTER;
    const x3 = new Float64Array(count3);
    const y3 = new Float64Array(count3);

    idx = 0;
    y3;

    for (let c = 0; c < CLUSTERS_3; c++) {
        const clusterStart = base + c * CLUSTER_SPACING_3 * MICRO_IN_SEC;

        for (let j = 0; j < POINTS_PER_CLUSTER; j++) {
            x3[idx] = clusterStart + j;
            y3[idx] = Math.random() * 200 - 100;
            idx++;
        }
    }

    // Dataset #4 - nanosecond precision -> 50 days range
    const CLUSTERS_4 = 150;
    const DAYS_50 = DAY * 50; // 50 days
    const CLUSTER_SPACING_4 = DAYS_50 / CLUSTERS_4;

    const count4 = CLUSTERS_4 * POINTS_PER_CLUSTER;
    const x4 = new Float64Array(count4);
    const y4 = new Float64Array(count4);

    idx = 0;
    for (let c = 0; c < CLUSTERS_4; c++) {
        const clusterStart = base + c * CLUSTER_SPACING_4 * NS_IN_SEC;

        for (let j = 0; j < POINTS_PER_CLUSTER; j++) {
            x4[idx] = clusterStart + j;
            y4[idx] = Math.random() * 100 - 50;
            idx++;
        }
    }

    return [
        {
            id: "secondPrecision",
            xValues: x1,
            yValues: y1,
            minY: -500,
            maxY: 500,
        },
        {
            id: "millisecondPrecision",
            xValues: x2,
            yValues: y2,
            minY: -50,
            maxY: 200,
        },
        {
            id: "microsecondPrecision",
            xValues: x3,
            yValues: y3,
            minY: -100,
            maxY: 100,
        },
        {
            id: "nanosecondPrecision",
            xValues: x4,
            yValues: y4,
            minY: -50,
            maxY: 50,
        },
    ];
};
