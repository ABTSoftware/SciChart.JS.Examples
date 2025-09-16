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


