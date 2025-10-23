import { IPointMetadata } from "scichart";

// Define quality categories as a union type for type safety
export type WaferQuality = "Good" | "Marginal" | "Fail";

// Constants for measurement parameters
const MEASUREMENT_PARAMS = {
    INPUT1: { mean: 1100, stdDev: 20 }, // temperature (°C)
    INPUT2: { mean: 500, stdDev: 150 }, // flow rate (units)
    MEASURE1: { mean: 100, stdDev: 5 }, // thickness (nm)
    MEASURE2: { mean: 50, stdDev: 3 }, // width (nm)
    MEASURE3: { mean: 10, stdDev: 1 }, // resistance (Ω/□)
};

// Time constants in milliseconds
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface WaferLotData {
    Date: string; // Timestamp of the run/lot/batch (ISO format)
    Batch: number; // Processing group (1-10)
    Quality: WaferQuality; // Categorical: 'Good', 'Marginal', or 'Fail'
    Input1: number; // Process input variable (e.g., furnace temperature setpoint)
    Input2: number; // Another process input (e.g., gas flow rate)
    Measure1: number; // Output measurement (e.g., film thickness in nm)
    Measure2: number; // Output measurement (e.g., line width in nm)
    Measure3: number; // Output measurement (e.g., sheet resistance in Ω/sq)
}

export interface WaferDayData {
    Date: string; // Timestamp of the run/lot/batch (ISO format)
    Mean1: number;
    Mean2: number;
    Batches: WaferLotData[];
}

export interface IBatchMetadata extends IPointMetadata {
    Date: string;
    Batch: number;
    Input: number;
}

/**
 * Generates a value from an approximate normal distribution
 * Uses Box-Muller transform for better statistical properties
 * @param mean Mean value of the distribution
 * @param stdDev Standard deviation of the distribution
 * @returns Random value from the normal distribution
 */
function randomNormal(mean: number, stdDev: number): number {
    // Box-Muller transform for better normal distribution approximation
    const u1 = Math.random();
    const u2 = Math.random();

    // Guard against u1 being zero
    if (u1 === 0) return randomNormal(mean, stdDev);

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
}

/**
 * Determines wafer quality based on predefined distribution
 * 70% Good, 20% Marginal, 10% Fail
 * @returns Quality category as a string
 */
function getQuality(input: number): WaferQuality {
    if (input > 500) return "Good";
    if (input > 350) return "Marginal";
    return "Fail";
}

/**
 * Formats a number to a specified precision without string conversion overhead
 * @param value Number to format
 * @param precision Decimal places to keep
 * @returns Formatted number
 */
function formatNumber(value: number, precision: number = 2): number {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
}

/**
 * Generates an array of mock wafer data entries based on the specified structure.
 * Includes improved error handling, performance optimizations, and better type safety.
 *
 * @param numDays Number of data entries to generate
 * @param startDate Optional starting date (defaults to current date)
 * @returns Array of WaferLotData objects
 * @throws Error if numEntries is invalid
 */
export function generateWaferLotData(
    numDays: number,
    numBatches: number = 15,
    startDate: Date = new Date()
): WaferDayData[] {
    // Validate inputs
    if (!Number.isInteger(numDays) || numDays <= 0) {
        throw new Error("numEntries must be a positive integer");
    }

    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
        throw new Error("startDate must be a valid Date object");
    }

    const data: WaferDayData[] = [];
    const startTime = startDate.getTime();

    for (let i = 0; i < numDays; i++) {
        // Generate date: increment by days for temporal trends
        const date = new Date(startTime + i * MS_PER_DAY);
        const isoDate = date.toISOString().split("T")[0]; // YYYY-MM-DD format
        const Batches: WaferLotData[] = [];
        let total1 = 0;
        let total2 = 0;
        for (let b = 1; b <= numBatches; b++) {
            const input2 = Math.round(randomNormal(MEASUREMENT_PARAMS.INPUT2.mean, MEASUREMENT_PARAMS.INPUT2.stdDev));
            // Generate measurements using our helper functions
            const batch = {
                Date: isoDate,
                Batch: b,
                Quality: getQuality(input2),
                Input1: Math.round(randomNormal(MEASUREMENT_PARAMS.INPUT1.mean, MEASUREMENT_PARAMS.INPUT1.stdDev)),
                Input2: input2,
                Measure1: formatNumber(randomNormal(input2, MEASUREMENT_PARAMS.MEASURE1.stdDev)),
                Measure2: formatNumber(randomNormal(input2, MEASUREMENT_PARAMS.MEASURE2.stdDev)),
                Measure3: formatNumber(randomNormal(input2, MEASUREMENT_PARAMS.MEASURE3.stdDev)),
            };
            Batches.push(batch);
            total1 += batch.Input1;
            total2 += batch.Input2;
        }
        data.push({
            Date: isoDate,
            Mean1: total1 / numBatches,
            Mean2: total2 / numBatches,
            Batches,
        } as WaferDayData);
    }

    return data;
}

// Simple seeded random generator (LCG)
function seededRandom(seed: number) {
    let value = seed % 2147483647;
    return () => {
        value = (value * 48271) % 2147483647;
        return (value - 1) / 2147483646;
    };
}

// Simple hashCode for string/number seed generation
function hashCode(obj: any, subChartIndex: number) {
    const str = typeof obj === "string" ? obj : JSON.stringify(obj);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
    }

    let result = Math.abs(hash) + subChartIndex;

    return result;
}

export const generateGridOfPoints = (selectedPoint: IBatchMetadata, subChartIndex = 0) => {
    const waferSize = 41;
    const seed = hashCode(selectedPoint, subChartIndex); // Make seed depend on selectedPoint
    const random = seededRandom(seed);

    const dataJSON = [];

    for (let row = 0; row < waferSize; row++) {
        for (let col = 0; col < waferSize; col++) {
            const centerX = waferSize / 2;
            const centerY = waferSize / 2;
            const distance = Math.sqrt(Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2));

            if (distance <= waferSize / 2) {
                let defectType = "OK";

                // Calculate defect probability inversely related to Input2
                // Lower Input2 values result in higher defect probability
                // Normalize Input2 to a 0-1 range based on expected range (200-800)
                const normalizedInput2 = Math.max(0, Math.min(1, (selectedPoint.Input - 200) / 600));

                // Invert the relationship: lower Input2 -> higher defect probability
                const defectProbabilityMultiplier = 1 - normalizedInput2;

                // Use seeded random with inverse relationship to Input2
                const randomValue = random();

                // Adjust thresholds based on Input2 - lower Input2 increases defect likelihood
                const baseThreshold = defectProbabilityMultiplier * 1.5; // Scale factor for defect probability

                if (distance > waferSize / 5) {
                    if (randomValue < 0.04 * baseThreshold) defectType = "S48"; // red
                    else if (randomValue < 0.05 * baseThreshold) defectType = "S36"; // orange
                } else if (distance < waferSize / 5) {
                    if (randomValue < 0.03 * baseThreshold) defectType = "S28"; // blue
                }

                dataJSON.push({
                    MAP_ROW: row,
                    MAP_COL: col,
                    DEFECT: defectType,
                    MR: (random() - 0.5) * 20,
                    HR: (random() - 0.5) * 10,
                    HDI: (random() - 0.5) * 5,
                    MR2: (random() - 0.5) * 30,
                });
            }
        }
    }

    return dataJSON;
};
