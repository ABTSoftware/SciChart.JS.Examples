import {multiPaneData} from "./multiPaneData";

export interface IXyValues {
    xValues: number[];
    yValues: number[];
}

export interface IOhlcvValues {
    dateValues: number[];
    openValues: number[];
    highValues: number[];
    lowValues: number[];
    closeValues: number[];
    volumeValues: number[];
}

/**
 * Helper class for the SciChart.Js JavaScript Chart examples to return datasets used throughout the examples
 */
export class ExampleDataProvider {

    /**
     * Creates a damped sinewave
     * @param pad number of points to pad with zeros
     * @param amplitude The amplitude
     * @param phase An initial phase
     * @param dampingFactor Damping factor applied to the sinewave
     * @param pointCount Total number of points
     * @param freq The frequency of the sinewave in radians
     */
    public static getDampedSinewave(pad: number,
                                    amplitude: number,
                                    phase: number,
                                    dampingFactor: number,
                                    pointCount: number,
                                    frequency: number = 10): IXyValues {
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
            const wn = 2 * Math.PI / (pointCount / frequency);

            xValues.push(time);
            yValues.push(amplitude * Math.sin(j * wn + phase));

            amplitude *= (1.0 - dampingFactor);
        }

        return {xValues, yValues};
    }

    public static getSinewave(amplitude: number, phase: number, pointCount: number, frequency: number = 10): IXyValues {
        return ExampleDataProvider.getDampedSinewave(0, amplitude, phase, 0.0, pointCount, frequency);
    }

    public static getNoisySinewave(amplitude: number, phase: number, pointCount: number, noiseAmplitude: number)
        : IXyValues {

        const {xValues, yValues} = ExampleDataProvider.getSinewave(amplitude, phase, pointCount);

        // Add some noise
        for (let i = 0; i < pointCount; i++) {
            yValues[i] += Math.random() * noiseAmplitude - noiseAmplitude * 0.5;
        }

        return { xValues, yValues };
    }

    public static getFourierSeriesZoomed(amplitude: number, phaseShift: number,
                                         xStart: number, xEnd: number, count: number = 5000): IXyValues {
        const fourierData = this.getFourierSeries(amplitude, phaseShift, count);

        let index0 = 0;
        let index1 = 0;
        for (let i = 0; i < count; i++) {
            if (fourierData.xValues[i] > xStart && index0 === 0)
                index0 = i;
            if (fourierData.xValues[i] > xEnd && index1 === 0){
                index1 = i;
                break;
            }
        }

        const xValues: number[] = fourierData.xValues.filter((_, i) => i >= index0 && i < index1);
        const yValues: number[] = fourierData.yValues.filter((_, i) => i >= index0 && i < index1);
        return { xValues, yValues };
    }

    public static getFourierSeries(amplitude: number, phaseShift: number, count: number = 5000): IXyValues {
        const xValues: number[] = [];
        const yValues: number[] = [];

        for (let i = 0; i < count; i++) {
            const time = 10 * i / count;
            const wn = 2 * Math.PI / (count / 10);

            xValues.push(time);
            yValues.push(Math.PI * amplitude *
                (Math.sin(i * wn + phaseShift) +
                 0.33 * Math.sin(i * 3 * wn + phaseShift) +
                 0.20 * Math.sin(i * 5 * wn + phaseShift) +
                 0.14 * Math.sin(i * 7 * wn + phaseShift) +
                 0.11 * Math.sin(i * 9 * wn + phaseShift) +
                 0.09 * Math.sin(i * 11 * wn + phaseShift)));
        }

        return {xValues, yValues};
    }

    public static getTradingData(startPoints?: number, maxPoints?: number): IOhlcvValues {
        const {dateValues, openValues, highValues, lowValues, closeValues, volumeValues} = multiPaneData;

        if (maxPoints !== undefined) {
            return {
                dateValues: dateValues.slice(startPoints, startPoints + maxPoints),
                openValues: openValues.slice(startPoints, startPoints + maxPoints),
                highValues: highValues.slice(startPoints, startPoints + maxPoints),
                lowValues: lowValues.slice(startPoints, startPoints + maxPoints),
                closeValues: closeValues.slice(startPoints, startPoints + maxPoints),
                volumeValues: volumeValues.slice(startPoints, startPoints + maxPoints),
            };
        }

        return {dateValues, openValues, highValues, lowValues, closeValues, volumeValues};
    }
}
