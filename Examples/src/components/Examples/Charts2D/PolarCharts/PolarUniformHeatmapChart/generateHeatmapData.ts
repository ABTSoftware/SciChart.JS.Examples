export function generateHeatmapData(width: number, height: number, seed: number = 1) {
    // Initialize pseudo-random number generator with seed
    const seededRandom = createSeededRandom(seed);

    const zValues = new Array(height);

    const numFeatures = 12;
    const featureInfluence = 0.8;
    const noiseLevel = 0.2;

    const features = [];
    for (let i = 0; i < numFeatures; i++) {
        features.push({
            x: Math.floor(seededRandom() * width),
            y: Math.floor(seededRandom() * height),
            strength: seededRandom() * 0.8 + 0.2,
            radius: seededRandom() * 60 + 30,
        });
    }

    const wavePeriods = [
        { xPeriod: 80, yPeriod: 100, amplitude: 0.15 },
        { xPeriod: 45, yPeriod: 55, amplitude: 0.1 },
    ];

    for (let y = 0; y < height; y++) {
        zValues[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            let value = seededRandom() * noiseLevel;

            for (const wave of wavePeriods) {
                value += Math.sin(x / wave.xPeriod) * Math.cos(y / wave.yPeriod) * wave.amplitude;
            }

            for (const feature of features) {
                const dx = x - feature.x;
                const dy = y - feature.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < feature.radius) {
                    const falloff = Math.pow(1 - distance / feature.radius, 1.5);
                    const influence = falloff * feature.strength * featureInfluence;
                    value += influence;
                }
            }

            const stripFactor = Math.sin(y / 25) * 0.12 + Math.cos(x / 30) * 0.12;
            value += stripFactor;

            zValues[y][x] = value;
        }
    }

    // Apply light smoothing
    const smoothedValues = new Array(height);
    for (let y = 0; y < height; y++) {
        smoothedValues[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            let sum = zValues[y][x] * 2;
            let count = 2;

            for (let ny = Math.max(0, y - 1); ny <= Math.min(height - 1, y + 1); ny++) {
                for (let nx = Math.max(0, x - 1); nx <= Math.min(width - 1, x + 1); nx++) {
                    if (nx !== x || ny !== y) {
                        sum += zValues[ny][nx];
                        count++;
                    }
                }
            }

            smoothedValues[y][x] = sum / count;
        }
    }

    let minVal = Number.MAX_VALUE;
    let maxVal = Number.MIN_VALUE;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            minVal = Math.min(minVal, smoothedValues[y][x]);
            maxVal = Math.max(maxVal, smoothedValues[y][x]);
        }
    }

    const polarizedValues = new Array(height);
    for (let y = 0; y < height; y++) {
        polarizedValues[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            // normalize to 0-1 range
            let normalizedValue = (smoothedValues[y][x] - minVal) / (maxVal - minVal);

            normalizedValue = normalizedValue - 0.5; // Center around zero

            const polarizationStrength = 5.0; // Higher = more extreme polarization
            normalizedValue = (Math.tanh(normalizedValue * polarizationStrength) + 1) / 2;

            polarizedValues[y][x] = normalizedValue;
        }
    }

    return polarizedValues;
}

// Simple seeded pseudo-random number generator (based on mulberry32)
function createSeededRandom(seed: number) {
    return function () {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
