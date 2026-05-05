export type Keytype = "population" | "population_density" | "area_km2";

export function getMinMax(property: Keytype, data: any[]) {
    let min = Math.min(...data.map((d) => d[property] as number));
    let max = Math.max(...data.map((d) => d[property] as number));

    return [min, max];
}

export function interpolateColor(min: number, max: number, value: number) {
    // Clamp value between min and max
    value = Math.max(min, Math.min(max, value));
    // Normalize to [0,1]
    let t = (value - min) / (max - min);

    // Parse hex colors to RGB
    function hexToRgb(hex: string) {
        hex = hex.replace(/^#/, "");
        if (hex.length === 3)
            hex = hex
                .split("")
                .map((x) => x + x)
                .join("");
        const num = parseInt(hex, 16);
        return [num >> 16, (num >> 8) & 255, num & 255];
    }

    // Interpolate between two RGB colors
    function lerp(a: number, b: number, t: number) {
        return Math.round(a + (b - a) * t);
    }

    const colorA = hexToRgb("#5dc0c0");
    const colorB = hexToRgb("#1e3489");
    const r = lerp(colorA[0], colorB[0], t);
    const g = lerp(colorA[1], colorB[1], t);
    const b = lerp(colorA[2], colorB[2], t);

    // Convert back to hex
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export const australiaData = [
    {
        state: "New South Wales",
        population: 8511151,
        area_km2: 800150,
        population_density: 10.49,
    },
    {
        state: "Victoria",
        population: 7012962,
        area_km2: 227416,
        population_density: 30.18,
    },
    {
        state: "Queensland",
        population: 5608666,
        area_km2: 1729742,
        population_density: 3.18,
    },
    {
        state: "Western Australia",
        population: 2981752,
        area_km2: 2527013,
        population_density: 1.15,
    },
    {
        state: "South Australia",
        population: 1882722,
        area_km2: 984321,
        population_density: 1.89,
    },
    {
        state: "Tasmania",
        population: 575959,
        area_km2: 68401,
        population_density: 8.89,
    },
    {
        state: "Australian Capital Territory",
        population: 475644,
        area_km2: 2358,
        population_density: 198.97,
    },
    {
        state: "Northern Territory",
        population: 255559,
        area_km2: 1347791,
        population_density: 0.19,
    },
];

export const keyData: { [state: string]: { population: number; area_km2: number; population_density: number } } = {};

australiaData.forEach((d) => {
    keyData[d.state] = {
        population: d.population,
        area_km2: d.area_km2,
        population_density: d.population_density,
    };
});

export function calculatePolygonCenter(polygon: number[][]) {
    // Remove the closing point if it's the same as the first point
    const points =
        polygon[0][0] === polygon[polygon.length - 1][0] && polygon[0][1] === polygon[polygon.length - 1][1]
            ? polygon.slice(0, -1)
            : polygon;

    let area = 0;
    let centerX = 0;
    let centerY = 0;

    // Calculate area and centroid using the shoelace formula
    for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        const xi = points[i][0];
        const yi = points[i][1];
        const xj = points[j][0];
        const yj = points[j][1];

        const crossProduct = xi * yj - xj * yi;
        area += crossProduct;
        centerX += (xi + xj) * crossProduct;
        centerY += (yi + yj) * crossProduct;
    }

    area = area / 2;
    centerX = centerX / (6 * area);
    centerY = centerY / (6 * area);

    return [centerX, centerY];
}

// function that preserves aspect ratio of drawn object by adapting visible min and max of xAxis and yAxis to aspect ratio change
export function preserveAspectRatio(
    width: number,
    height: number,
    minVisibleX: number,
    maxVisibleX: number,
    minVisibleY: number,
    maxVisibleY: number
) {
    // Calculate current visible dimensions
    const visibleWidth = maxVisibleX - minVisibleX;
    const visibleHeight = maxVisibleY - minVisibleY;

    // Calculate aspect ratios
    const containerAspectRatio = width / height;
    const visibleAspectRatio = visibleWidth / visibleHeight;

    // Calculate center points for maintaining position
    // const centerX = (minVisibleX + maxVisibleX) / 2;
    // const centerY = (minVisibleY + maxVisibleY) / 2;

    let newMinX, newMaxX, newMinY, newMaxY;

    if (containerAspectRatio > visibleAspectRatio) {
        // Container is wider - expand visible X range
        const newVisibleWidth = visibleHeight * containerAspectRatio;
        const widthDiff = newVisibleWidth - visibleWidth;

        newMinX = minVisibleX - widthDiff / 2;
        newMaxX = maxVisibleX + widthDiff / 2;
        newMinY = minVisibleY;
        newMaxY = maxVisibleY;
    } else {
        // Container is taller - expand visible Y range
        const newVisibleHeight = visibleWidth / containerAspectRatio;
        const heightDiff = newVisibleHeight - visibleHeight;

        newMinX = minVisibleX;
        newMaxX = maxVisibleX;
        newMinY = minVisibleY - heightDiff / 2;
        newMaxY = maxVisibleY + heightDiff / 2;
    }

    return {
        minVisibleX: newMinX,
        maxVisibleX: newMaxX,
        minVisibleY: newMinY,
        maxVisibleY: newMaxY,
    };
}
