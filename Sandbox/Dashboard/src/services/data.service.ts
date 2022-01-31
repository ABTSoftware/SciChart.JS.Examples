import { colors } from "../utils/colors";

export const MONTHS_LABELS: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
export const getLineChartData = () => {
    const data = [{ value: 0, point: 0 }];

    for (let i = 1; i < 12; i++) {
        const max = 90;
        const min = 70;
        data.push({ value: Math.floor(Math.random() * (max - min + 1)) + min, point: i });
    }

    return data;
};

export const getDonutChartData = () => {
    const donutData = [];
    const MIN_SEGMENTS_LENGTH = 4;
    const MAX_DONUT_VALUE = 100;
    const MIX_PIE_SEGMENT_VALUE = 8;

    const getRandom = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const segmentsLength = getRandom(MIN_SEGMENTS_LENGTH, Object.keys(colors.blueSchema).length);
    let donutValue = MAX_DONUT_VALUE;

    for (let i = 0; i < segmentsLength; i++) {
        const color: string = colors.blueSchema[Object.keys(colors.blueSchema)[i].toString()];
        let value: number = getRandom(MIX_PIE_SEGMENT_VALUE, donutValue / 2);
        if (value < MIX_PIE_SEGMENT_VALUE || donutValue < MIX_PIE_SEGMENT_VALUE) {
            break;
        }
        donutValue = donutValue - value;
        donutData.push({
            value,
            color
        });
    }
    return donutData;
};

export const getVerticalChartData = () => {
    const xValues: number[] = [];
    const yValues: number[] = [];
    const y1Values: number[] = [];

    for (let i = 0; i <= 1000; i++) {
        const x = 0.1 * i;
        xValues.push(x);
        yValues.push(Math.sin(x * 0.09));
        y1Values.push(Math.cos(x * 0.05) + 2);
    }
    return {
        xValues,
        yValues,
        y1Values
    };
};

export const getPieChartData = () => {
    return [
        {
            value: 15,
            text: "Test 1"
        },
        {
            value: 25,
            text: "Test 2"
        },
        {
            value: 30,
            text: "Test 3"
        },
        {
            value: 10,
            text: "Test 4"
        },
        {
            value: 20,
            text: "Test 5"
        }
    ];
};

let mountainCounter = 0;

export const getMountainChartData = (isUpdate: boolean) => {
    const POINTS = 1000;
    const STEP = (3 * Math.PI) / POINTS;

    const dataX = [];
    const dataY = [];
    const dataY1 = [];

    const pointsLoop = isUpdate ? POINTS / 500 : POINTS;

    for (let i = 0; i <= pointsLoop; i++) {
        if (isUpdate) {
            dataX.push(mountainCounter);
            dataY.push(mountainCounter * (Math.sin(mountainCounter * STEP) * 0.7 + 10));
            dataY1.push((mountainCounter / 2) * (Math.cos(mountainCounter * STEP) + 10));
        } else {
            dataX.push(i);
            dataY.push(i * (Math.sin(i * STEP) * 0.7 + 10));
            dataY1.push((i / 2) * (Math.cos(i * STEP) + 10));
        }
        mountainCounter++;
    }
    return { dataX, dataY, dataY1 };
};

export const getColumnChartData = () => {
    return {
        xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        yValues: [1, 2, 4, 8, 11, 15, 24, 46, 81, 117, 144, 160, 137, 101, 64, 35, 25, 14, 4, 1]
    };
};

export const getStackedColumnData = () => {
    return {
        xValues: [0, 1, 2, 3, 4],
        income: [112, 50, 88, 39, 110],
        taxes: [20, 13, 50, 35, 60]
    };
};

export const getFiltersChartData = (start: number, count: number) => {
    let xValues = [];
    let yValues = [];
    for (let i = start; i < start + count; i++) {
        xValues.push(i);
        yValues.push(Math.random());
    }
    return { xValues, yValues };
};

export const getChartBuilderData = () => {
    return [
        {
            xValues: [1, 3, 4, 7, 9],
            yValues: [10, 6, 9, 2, 16]
        },
        {
            xValues: [1, 3.5, 4.5, 7.5, 9.5],
            yValues: [4, 10, 3, 15, 2]
        }
    ];
};

const animatedChartData = [
    {
        xValues: [1, 2, 3, 4, 5],
        yValues: [1, 2, 3, 4, 5],
        fill: colors.primary
    },
    {
        xValues: [1, 2, 3, 4, 5],
        yValues: [5, 4, 3, 2, 1],
        fill: colors.secondary
    }
];

export const getAnimatedChartBuilderData = (isAnimated: boolean) => {
    if (isAnimated) {
        for (let i = 0; i < animatedChartData.length; i++) {
            animatedChartData[i].xValues = animatedChartData[i].xValues = [
                animatedChartData[i].xValues[animatedChartData[i].xValues.length - 1],
                ...animatedChartData[i].xValues.slice(0, animatedChartData[i].xValues.length - 1)
            ];
            animatedChartData[i].yValues = animatedChartData[i].yValues = [
                animatedChartData[i].yValues[animatedChartData[i].yValues.length - 1],
                ...animatedChartData[i].yValues.slice(0, animatedChartData[i].yValues.length - 1)
            ];
        }
    }

    return animatedChartData;
};
