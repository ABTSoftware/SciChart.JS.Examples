// Function which creates some dummy data as a 2D array for the Tenor Curves example
export function getTenorCurveData(xSize: number, zSize: number): number[][] {
    const data: number[][] = new Array<number[]>(xSize);

    let step: number;
    for (let x = 0; x < xSize; x++) {
        data[x] = new Array<number>(zSize);

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

            data[x][z] = y;
        }
    }

    return data;
}
