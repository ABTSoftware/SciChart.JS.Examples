// --- 1. Define the structure for a single sensor's profile ---
type SensorProfile = { mean: number; dev: number };

// --- 2. Define the main profiles object and derive the DefectCode type from its keys ---
const defectProfiles = {
  OK: {
    MR:  { mean: 114, dev: 10 },
    HR:  { mean: 79,  dev: 2.5 },
    HDI: { mean: 21,  dev: 1 },
    MR2: { mean: 120, dev: 15 },
  },
  S28: { // High MR & MR2
    MR:  { mean: 160, dev: 20 },
    HR:  { mean: 81,  dev: 3 },
    HDI: { mean: 22,  dev: 1.5 },
    MR2: { mean: 170, dev: 25 },
  },
  S36: { // Low HR
    MR:  { mean: 115, dev: 12 },
    HR:  { mean: 65,  dev: 5 },
    HDI: { mean: 20,  dev: 1.2 },
    MR2: { mean: 125, dev: 18 },
  },
  S42: { // Low HDI
    MR:  { mean: 110, dev: 15 },
    HR:  { mean: 78,  dev: 3 },
    HDI: { mean: 15,  dev: 2 },
    MR2: { mean: 115, dev: 20 },
  },
  S48: { // High HR
    MR:  { mean: 120, dev: 10 },
    HR:  { mean: 95,  dev: 4 },
    HDI: { mean: 23,  dev: 1 },
    MR2: { mean: 130, dev: 15 },
  },
  S49: { // Low MR & MR2
    MR:  { mean: 80,  dev: 15 },
    HR:  { mean: 75,  dev: 2.5 },
    HDI: { mean: 19,  dev: 1.5 },
    MR2: { mean: 90,  dev: 20 },
  },
};

// This creates a type that is a union of all the keys from defectProfiles
// e.g., "OK" | "S28" | "S36" | ...
type DefectCode = keyof typeof defectProfiles;

// --- 3. Update the data structures to use the new, specific type ---
type WaferData = {
  MAP_ROW: number;
  MAP_COL: number;
  FF_ROW: number;
  FF_COL: number;
  WIF_COL: number;
  WIF_ROW: number;
  DEFECT: DefectCode; // Use the specific DefectCode type
  MR: number;
  HR: number;
  HDI: number;
  MR2: number;
  NORM_X: number;
  NORM_Y: number;
};

type IntermediateWaferPoint = {
  MAP_ROW: number;
  MAP_COL: number;
  NORM_X: number;
  NORM_Y: number;
  DEFECT: DefectCode; // Use the specific DefectCode type
  defectProbability: number;
  potentialDefect: DefectCode; // Use the specific DefectCode type
};

export function generateWaferData(
  waferRadius = 80,
  defectRate = 0.15,
  numClusters = 100,
  clusterSpread = 5
): WaferData[] {

  // This array now correctly infers the type DefectCode[]
  const defectCodeKeys = (Object.keys(defectProfiles) as DefectCode[]).filter(k => k !== 'OK');

  function pickRandomDefect(): DefectCode {
    return defectCodeKeys[Math.floor(Math.random() * defectCodeKeys.length)];
  }

  const clusters = [];
  for (let i = 0; i < numClusters; i++) {
    let centerX, centerY;
    do {
      centerX = (Math.random() - 0.5) * 2 * waferRadius;
      centerY = (Math.random() - 0.5) * 2 * waferRadius;
    } while (centerX * centerX + centerY * centerY > waferRadius * waferRadius);

    clusters.push({
      centerX,
      centerY,
      spreadX: clusterSpread * (0.75 + Math.random() * 0.5),
      spreadY: clusterSpread * (0.75 + Math.random() * 0.5),
      defectCode: pickRandomDefect(),
    });
  }

  const intermediateData: IntermediateWaferPoint[] = [];
  for (let x = -waferRadius; x <= waferRadius; x++) {
    for (let y = -waferRadius; y <= waferRadius; y++) {
      if (x * x + y * y > waferRadius * waferRadius) continue;

      let maxProbability = 0;
      let potentialDefect: DefectCode = "OK"; // Initialize with a valid DefectCode

      for (const cluster of clusters) {
        const dx = (x - cluster.centerX) / cluster.spreadX;
        const dy = (y - cluster.centerY) / cluster.spreadY;
        const probability = Math.exp(-(dx * dx + dy * dy) / 2);

        if (probability > maxProbability) {
          maxProbability = probability;
          potentialDefect = cluster.defectCode;
        }
      }

      intermediateData.push({
        MAP_ROW: y + waferRadius,
        MAP_COL: x + waferRadius,
        NORM_X: (x + waferRadius) / (2 * waferRadius),
        NORM_Y: (y + waferRadius) / (2 * waferRadius),
        DEFECT: "OK",
        defectProbability: maxProbability,
        potentialDefect: potentialDefect,
      });
    }
  }

  const totalPoints = intermediateData.length;
  const targetDefectCount = Math.floor(totalPoints * defectRate);

  intermediateData.sort((a, b) => b.defectProbability - a.defectProbability);

  for (let i = 0; i < targetDefectCount; i++) {
    if (intermediateData[i]) {
      intermediateData[i].DEFECT = intermediateData[i].potentialDefect;
    }
  }

  const finalData: WaferData[] = intermediateData.map(point => {
    // NO ERROR HERE: TypeScript now knows point.DEFECT is a valid key for defectProfiles
    const profile = defectProfiles[point.DEFECT];

    const generateValue = (paramProfile: SensorProfile) => {
      const { mean, dev } = paramProfile;
      return parseFloat((mean + (Math.random() - 0.5) * dev * 2).toFixed(2));
    };

    return {
      MAP_ROW: point.MAP_ROW,
      MAP_COL: point.MAP_COL,
      NORM_X: point.NORM_X,
      NORM_Y: point.NORM_Y,
      DEFECT: point.DEFECT,
      MR: generateValue(profile.MR),
      HR: generateValue(profile.HR),
      HDI: generateValue(profile.HDI),
      MR2: generateValue(profile.MR2),
      FF_ROW: Math.floor(Math.random() * 10) + 1,
      FF_COL: Math.floor(Math.random() * 10) + 1,
      WIF_COL: Math.floor(Math.random() * 50) + 1,
      WIF_ROW: Math.floor(Math.random() * 50) + 1,
    };
  });
  
  return finalData;
}


// Define quality categories as a union type for type safety
export type WaferQuality = 'Good' | 'Marginal' | 'Fail';

// Constants for quality distribution
const QUALITY_DISTRIBUTION = {
  GOOD_THRESHOLD: 0.7,
  MARGINAL_THRESHOLD: 0.9
};

// Constants for measurement parameters
const MEASUREMENT_PARAMS = {
  INPUT1: { mean: 1100, stdDev: 20 },  // temperature (°C)
  INPUT2: { mean: 500, stdDev: 150 },   // flow rate (units)
  MEASURE1: { mean: 100, stdDev: 5 },  // thickness (nm)
  MEASURE2: { mean: 50, stdDev: 3 },   // width (nm)
  MEASURE3: { mean: 10, stdDev: 1 }    // resistance (Ω/□)
};

// Time constants in milliseconds
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface WaferLotData {
  Date: string;      // Timestamp of the run/lot/batch (ISO format)
  Batch: number;     // Processing group (1-10)
  Quality: WaferQuality; // Categorical: 'Good', 'Marginal', or 'Fail'
  Input1: number;    // Process input variable (e.g., furnace temperature setpoint)
  Input2: number;    // Another process input (e.g., gas flow rate)
  Measure1: number;  // Output measurement (e.g., film thickness in nm)
  Measure2: number;  // Output measurement (e.g., line width in nm)
  Measure3: number;  // Output measurement (e.g., sheet resistance in Ω/sq)
}

/**
 * Generates an array of mock wafer data entries based on the specified structure.
 * @param numEntries Number of data entries to generate.
 * @param startDate Optional starting date (defaults to current date).
 * @returns Array of WaferData objects.
 */
/**
 * Generates a random integer in range [min, max] (inclusive)
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Random integer
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
function getQuality(): WaferQuality {
  const rand = Math.random();
  if (rand < QUALITY_DISTRIBUTION.GOOD_THRESHOLD) return 'Good';
  if (rand < QUALITY_DISTRIBUTION.MARGINAL_THRESHOLD) return 'Marginal';
  return 'Fail';
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
 * @param numEntries Number of data entries to generate
 * @param startDate Optional starting date (defaults to current date)
 * @returns Array of WaferLotData objects
 * @throws Error if numEntries is invalid
 */
export function generateWaferLotData(numEntries: number, startDate: Date = new Date()): WaferLotData[] {
  // Validate inputs
  if (!Number.isInteger(numEntries) || numEntries <= 0) {
    throw new Error('numEntries must be a positive integer');
  }
  
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    throw new Error('startDate must be a valid Date object');
  }

  // Pre-allocate array for better performance
  const data: WaferLotData[] = new Array(numEntries);
  const startTime = startDate.getTime();

  for (let i = 0; i < numEntries; i++) {
    // Generate date: increment by days for temporal trends
    const date = new Date(startTime + i * MS_PER_DAY);
    const isoDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Batch: cycle through 1-10
    const batch = (i % 10) + 1;

    // Generate measurements using our helper functions
    data[i] = {
      Date: isoDate,
      Batch: batch,
      Quality: getQuality(),
      Input1: Math.round(randomNormal(MEASUREMENT_PARAMS.INPUT1.mean, MEASUREMENT_PARAMS.INPUT1.stdDev)),
      Input2: Math.round(randomNormal(MEASUREMENT_PARAMS.INPUT2.mean, MEASUREMENT_PARAMS.INPUT2.stdDev)),
      Measure1: formatNumber(randomNormal(MEASUREMENT_PARAMS.MEASURE1.mean, MEASUREMENT_PARAMS.MEASURE1.stdDev)),
      Measure2: formatNumber(randomNormal(MEASUREMENT_PARAMS.MEASURE2.mean, MEASUREMENT_PARAMS.MEASURE2.stdDev)),
      Measure3: formatNumber(randomNormal(MEASUREMENT_PARAMS.MEASURE3.mean, MEASUREMENT_PARAMS.MEASURE3.stdDev))
    };
  }

  return data;
}