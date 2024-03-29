// Function which creates some dummy data as a 2D array for the Tenor Curves example

import { zeroArray2D } from "scichart";

export function getTenorCurveData(xSize: number, zSize: number): number[][] {
    // Creates a 2 dimnsational array of size [zSize][xSize]
    const data: number[][] = zeroArray2D([xSize, zSize]);

    let step: number;
    for (let x = 0; x < xSize; x++) {
        switch (x) {
            case 5:
            case 10:
                step = 0.309;
                break;

            case 4:
            case 9:
                step = 0.303;
                break;

            case 6:
            case 11:
                step = 0.303;
                break;

            case 23:
                step = 0.291;
                break;

            case 22:
                step = 0.294;
                break;

            case 24:
                step = 0.295;
                break;

            default:
                step = 0.3;
                break;
        }

        for (let z = 0; z < zSize; z++) {
            const y = z !== 0 ? Math.pow(z + Math.random(), step) : Math.pow(z + 1, 0.3);

            // Compute 3d parabola function
            const nX = x - xSize / 2;
            const nZ = z - zSize / 2;
            const parabola = nX * nX + nZ * nZ;

            // Set the data
            data[z][x] = y * (parabola + 50) * 0.1;
        }
    }

    return data;
}
