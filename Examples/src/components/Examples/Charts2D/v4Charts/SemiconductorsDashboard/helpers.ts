const isNum = (num: string) =>
    typeof num !== "object" &&
    !Number.isNaN(+String((String(num) || "").replace(/[^0-9\.\-e]/, "") !== String(num) || num === "" ? NaN : num));

//var csv is the CSV file with headers
export function csvJSON(csv: string) {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
        var obj: Record<string, string | number> = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = isNum(currentline[j].trim()) ? +currentline[j].trim() : currentline[j].trim();
            // obj[headers[j].trim()] = currentline[j].trim();
        }

        result.push(obj);
    }

    //return result; //JavaScript object
    return result; //JSON
}

export interface BoxPlotValue {
    min: number;
    max: number;
    q1: number;
    median: number;
    q3: number;
    // lowerWhisker: number;
    // upperWhisker: number;
    // outliers: number[];
}

export function calculateBoxplotValues(data: number[]): BoxPlotValue {
    if (data.length === 0) {
        throw new Error("Array cannot be empty");
    }

    // Sort the data in ascending order
    const sortedData = [...data].sort((a, b) => a - b);
    const n = sortedData.length;

    // Calculate quartiles
    const q1 = calculatePercentile(sortedData, 25);
    const median = calculatePercentile(sortedData, 50);
    const q3 = calculatePercentile(sortedData, 75);

    // Calculate interquartile range
    const iqr = q3 - q1;

    // Calculate whisker boundaries
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    // Find actual whisker values (closest data points within bounds)
    const lowerWhisker = sortedData.find((value) => value >= lowerBound) || sortedData[0];
    const upperWhisker = sortedData.reverse().find((value) => value <= upperBound) || sortedData[0];

    // Reverse back to maintain original sorted order
    sortedData.reverse();

    // Find outliers (values outside whisker bounds)
    const outliers = sortedData.filter((value) => value < lowerWhisker || value > upperWhisker);

    return {
        min: sortedData[0],
        max: sortedData[n - 1],
        q1,
        median,
        q3,
        // lowerWhisker,
        // upperWhisker,
        // outliers,
    };
}

function calculatePercentile(sortedData: number[], percentile: number): number {
    const n = sortedData.length;
    const index = (percentile / 100) * (n - 1);

    if (Number.isInteger(index)) {
        return sortedData[index];
    }

    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    return sortedData[lower] * (1 - weight) + sortedData[upper] * weight;
}

// Example usage:
// const sampleData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100];
// const boxplotValues = calculateBoxplotValues(sampleData);
// console.log(boxplotValues);
