export interface IXyValues {
    xValues: number[];
    yValues: number[];
}

/**
 * Helper class for the SciChart.Js JavaScript Chart examples to return datasets used throughout the examples
 */
export class ExampleDataProvider {
    public static getDampedSinewave(pad: number,
                                    amplitude: number,
                                    phase: number,
                                    dampingFactor: number,
                                    pointCount: number,
                                    freq: number): IXyValues {
        const xValues: number[] = [];
        const yValues: number[] = [];

        for (let i = 0; i < pad; i++) {
            const time = 10* i / pointCount;
            xValues.push(time);
            yValues.push(NaN);
        }

        for (let i = pad, j = 0; i < pointCount; i++, j++)
        {
            const time = 10 * i / pointCount;
            const wn = 2 * Math.PI / (pointCount / freq);

            xValues.push(time);
            yValues.push(amplitude * Math.sin(j * wn + phase));

            amplitude *= (1.0 - dampingFactor);
        }

        return {xValues, yValues};
    }
}
