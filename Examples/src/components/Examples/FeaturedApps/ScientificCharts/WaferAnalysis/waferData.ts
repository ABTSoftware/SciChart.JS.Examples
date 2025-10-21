// --- 1. Define the structure for a single sensor's profile ---
type SensorProfile = { mean: number; dev: number };

// --- 2. Define the main profiles object and derive the DefectCode type from its keys ---
const defectProfiles = {
    OK: {
        MR: { mean: 114, dev: 10 },
        HR: { mean: 79, dev: 2.5 },
        HDI: { mean: 21, dev: 1 },
        MR2: { mean: 120, dev: 15 },
    },
    D1: {
        // High MR & MR2
        MR: { mean: 160, dev: 20 },
        HR: { mean: 81, dev: 3 },
        HDI: { mean: 22, dev: 1.5 },
        MR2: { mean: 170, dev: 25 },
    },
    D2: {
        // Low HR
        MR: { mean: 115, dev: 12 },
        HR: { mean: 65, dev: 5 },
        HDI: { mean: 20, dev: 1.2 },
        MR2: { mean: 125, dev: 18 },
    },
    D3: {
        // Low HDI
        MR: { mean: 110, dev: 15 },
        HR: { mean: 78, dev: 3 },
        HDI: { mean: 15, dev: 2 },
        MR2: { mean: 115, dev: 20 },
    },
    D4: {
        // High HR
        MR: { mean: 120, dev: 10 },
        HR: { mean: 95, dev: 4 },
        HDI: { mean: 23, dev: 1 },
        MR2: { mean: 130, dev: 15 },
    },
    D5: {
        // Low MR & MR2
        MR: { mean: 80, dev: 15 },
        HR: { mean: 75, dev: 2.5 },
        HDI: { mean: 19, dev: 1.5 },
        MR2: { mean: 90, dev: 20 },
    },
};

// This creates a type that is a union of all the keys from defectProfiles
type DefectCode = keyof typeof defectProfiles;

// --- 3. Update the data structures to use the new, specific type ---
type WaferData = {
    MAP_ROW: number;
    MAP_COL: number;
    DEFECT: DefectCode; // Use the specific DefectCode type
    MR: number;
    HR: number;
    HDI: number;
    MR2: number;
};

type IntermediateWaferPoint = {
    MAP_ROW: number;
    MAP_COL: number;
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
    const defectCodeKeys = (Object.keys(defectProfiles) as DefectCode[]).filter((k) => k !== "OK");

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

    const finalData: WaferData[] = intermediateData.map((point) => {
        const profile = defectProfiles[point.DEFECT];

        const generateValue = (paramProfile: SensorProfile) => {
            const { mean, dev } = paramProfile;
            return parseFloat((mean + (Math.random() - 0.5) * dev * 2).toFixed(2));
        };

        return {
            MAP_ROW: point.MAP_ROW,
            MAP_COL: point.MAP_COL,
            DEFECT: point.DEFECT,
            MR: generateValue(profile.MR),
            HR: generateValue(profile.HR),
            HDI: generateValue(profile.HDI),
            MR2: generateValue(profile.MR2),
        };
    });

    return finalData;
}

// --- 4. Define classification thresholds for the new approach ---
type VariableThresholds = {
    MR: { min: number; max: number };
    HR: { min: number; max: number };
    HDI: { min: number; max: number };
    MR2: { min: number; max: number };
};

const defectThresholds: Record<DefectCode, VariableThresholds> = {
    OK: {
        MR: { min: 95, max: 135 },
        HR: { min: 72, max: 86 },
        HDI: { min: 18, max: 24 },
        MR2: { min: 100, max: 140 },
    },
    D1: {
        // High MR & MR2
        MR: { min: 140, max: Infinity },
        HR: { min: -Infinity, max: Infinity },
        HDI: { min: -Infinity, max: Infinity },
        MR2: { min: 150, max: Infinity },
    },
    D2: {
        // Low HR
        MR: { min: -Infinity, max: Infinity },
        HR: { min: -Infinity, max: 75 },
        HDI: { min: -Infinity, max: Infinity },
        MR2: { min: -Infinity, max: Infinity },
    },
    D3: {
        // Low HDI
        MR: { min: -Infinity, max: Infinity },
        HR: { min: -Infinity, max: Infinity },
        HDI: { min: -Infinity, max: 17 },
        MR2: { min: -Infinity, max: Infinity },
    },
    D4: {
        // High HR
        MR: { min: -Infinity, max: Infinity },
        HR: { min: 93, max: Infinity },
        HDI: { min: -Infinity, max: Infinity },
        MR2: { min: -Infinity, max: Infinity },
    },
    D5: {
        // Low MR & MR2
        MR: { min: -Infinity, max: 95 },
        HR: { min: -Infinity, max: Infinity },
        HDI: { min: -Infinity, max: Infinity },
        MR2: { min: -Infinity, max: 100 },
    },
};

// --- 5. Spatial distribution functions ---

// Normal distribution random number generator (Box-Muller transform)
function normalRandom(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z0 * stdDev;
}

// Uniform random distribution with normal values
function uniformRandomDistribution(x: number, y: number, radius: number, baseProfile: SensorProfile): number {
    return normalRandom(baseProfile.mean, baseProfile.dev);
}

// Sparse random points with smooth radial reversion to mean
function sparseRandomPointsDistribution(
    x: number,
    y: number,
    radius: number,
    baseProfile: SensorProfile,
    hotspots: Array<{ x: number; y: number; intensity: number; type: "max" | "min" }>
): number {
    let influence = 0;
    let totalWeight = 0;

    for (const hotspot of hotspots) {
        const distance = Math.sqrt((x - hotspot.x) ** 2 + (y - hotspot.y) ** 2);
        const weight = Math.exp(-distance / (radius * 0.2)); // Exponential falloff
        influence += weight * hotspot.intensity * (hotspot.type === "max" ? 1 : -1);
        totalWeight += weight;
    }

    // Blend between hotspot influence and base distribution
    const influenceFactor = Math.min(totalWeight, 1);
    const baseValue = normalRandom(baseProfile.mean, baseProfile.dev);
    const hotspotValue = baseProfile.mean + influence;

    return baseValue * (1 - influenceFactor) + hotspotValue * influenceFactor;
}

// Distance from edge distribution
function distanceFromEdgeDistribution(
    x: number,
    y: number,
    radius: number,
    baseProfile: SensorProfile,
    edgeEffect: number
): number {
    const distanceFromCenter = Math.sqrt(x * x + y * y);
    const distanceFromEdge = radius - distanceFromCenter;
    const normalizedDistance = distanceFromEdge / radius; // 0 at edge, 1 at center

    // Apply edge effect - values change as you approach the edge
    const edgeInfluence = edgeEffect * (1 - normalizedDistance);
    const adjustedMean = baseProfile.mean + edgeInfluence;

    return normalRandom(adjustedMean, baseProfile.dev);
}

// --- 6. Defect classification function ---
function classifyDefect(MR: number, HR: number, HDI: number, MR2: number): DefectCode {
    // Check each defect type in priority order
    const defectTypes: DefectCode[] = ["D1", "D2", "D3", "D4", "D5"];

    for (const defectType of defectTypes) {
        const thresholds = defectThresholds[defectType];
        const withinMR = MR >= thresholds.MR.min && MR <= thresholds.MR.max;
        const withinHR = HR >= thresholds.HR.min && HR <= thresholds.HR.max;
        const withinHDI = HDI >= thresholds.HDI.min && HDI <= thresholds.HDI.max;
        const withinMR2 = MR2 >= thresholds.MR2.min && MR2 <= thresholds.MR2.max;

        if (withinMR && withinHR && withinHDI && withinMR2) {
            return defectType;
        }
    }

    return "OK"; // Default to OK if no defect conditions are met
}

// --- 7. New data generation function ---
export function generateWaferDataByValues(
    waferRadius = 80,
    numSparsePoints = 10,
    sparseIntensity = 40,
    edgeEffect = 10,
    baseProfile = {
        MR: { mean: 114, dev: 10 },
        HR: { mean: 79, dev: 2.5 },
        HDI: { mean: 50, dev: 1 },
        MR2: { mean: 120, dev: 15 },
    },
    variableDistributions: {
        MR: "uniform" | "sparse" | "edge";
        HR: "uniform" | "sparse" | "edge";
        HDI: "uniform" | "sparse" | "edge";
        MR2: "uniform" | "sparse" | "edge";
    } = {
        MR: "sparse",
        HR: "edge",
        HDI: "sparse",
        MR2: "sparse",
    }
): WaferData[] {
    // Generate sparse random hotspots for variables that use sparse distribution
    const generateHotspots = (variable: "MR" | "HR" | "HDI" | "MR2") => {
        const hotspots = [];
        for (let i = 0; i < numSparsePoints; i++) {
            let x, y;
            do {
                x = (Math.random() - 0.5) * 2 * waferRadius * 0.8; // Keep hotspots away from edge
                y = (Math.random() - 0.5) * 2 * waferRadius * 0.8;
            } while (x * x + y * y > (waferRadius * 0.8) ** 2);

            hotspots.push({
                x,
                y,
                intensity: sparseIntensity * (0.5 + Math.random() * 0.5),
                type: Math.random() > 0.5 ? "max" : ("min" as "max" | "min"),
            });
        }
        return hotspots;
    };

    const mrHotspots = variableDistributions.MR === "sparse" ? generateHotspots("MR") : [];
    const hrHotspots = variableDistributions.HR === "sparse" ? generateHotspots("HR") : [];
    const hdiHotspots = variableDistributions.HDI === "sparse" ? generateHotspots("HDI") : [];
    const mr2Hotspots = variableDistributions.MR2 === "sparse" ? generateHotspots("MR2") : [];

    const waferData: WaferData[] = [];

    // Generate data for each point in the wafer grid
    for (let x = -waferRadius; x <= waferRadius; x++) {
        for (let y = -waferRadius; y <= waferRadius; y++) {
            if (x * x + y * y > waferRadius * waferRadius) continue;

            // Generate values based on specified distributions
            let MR: number, HR: number, HDI: number, MR2: number;

            // MR generation
            switch (variableDistributions.MR) {
                case "uniform":
                    MR = uniformRandomDistribution(x, y, waferRadius, baseProfile.MR);
                    break;
                case "sparse":
                    MR = sparseRandomPointsDistribution(x, y, waferRadius, baseProfile.MR, mrHotspots);
                    break;
                case "edge":
                    MR = distanceFromEdgeDistribution(x, y, waferRadius, baseProfile.MR, edgeEffect);
                    break;
            }

            // HR generation
            switch (variableDistributions.HR) {
                case "uniform":
                    HR = uniformRandomDistribution(x, y, waferRadius, baseProfile.HR);
                    break;
                case "sparse":
                    HR = sparseRandomPointsDistribution(x, y, waferRadius, baseProfile.HR, hrHotspots);
                    break;
                case "edge":
                    HR = distanceFromEdgeDistribution(x, y, waferRadius, baseProfile.HR, edgeEffect);
                    break;
            }

            // HDI generation
            switch (variableDistributions.HDI) {
                case "uniform":
                    HDI = uniformRandomDistribution(x, y, waferRadius, baseProfile.HDI);
                    break;
                case "sparse":
                    HDI = sparseRandomPointsDistribution(x, y, waferRadius, baseProfile.HDI, hdiHotspots);
                    break;
                case "edge":
                    HDI = distanceFromEdgeDistribution(x, y, waferRadius, baseProfile.HDI, edgeEffect);
                    break;
            }

            // MR2 generation
            switch (variableDistributions.MR2) {
                case "uniform":
                    MR2 = uniformRandomDistribution(x, y, waferRadius, baseProfile.MR2);
                    break;
                case "sparse":
                    MR2 = sparseRandomPointsDistribution(x, y, waferRadius, baseProfile.MR2, mr2Hotspots);
                    break;
                case "edge":
                    MR2 = distanceFromEdgeDistribution(x, y, waferRadius, baseProfile.MR2, edgeEffect);
                    break;
            }

            // Round values to 2 decimal places
            MR = parseFloat(MR.toFixed(2));
            HR = parseFloat(HR.toFixed(2));
            HDI = parseFloat(HDI.toFixed(2));
            MR2 = parseFloat(MR2.toFixed(2));

            // Classify the defect based on the generated values
            const defect = classifyDefect(MR, HR, HDI, MR2);

            waferData.push({
                MAP_ROW: y + waferRadius,
                MAP_COL: x + waferRadius,
                DEFECT: defect,
                MR,
                HR,
                HDI,
                MR2,
            });
        }
    }

    return waferData;
}
