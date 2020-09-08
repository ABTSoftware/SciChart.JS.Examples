import {IXyValues} from "./ExampleDataProvider";

export class RandomWalkGenerator {
    private readonly bias: number;
    private last: number = 0;
    private i: number = 0;
    constructor(bias: number = 0.01) {
        this.bias = bias;
    }

    public reset(){
        this.i = 0;
        this.last = 0;
    }

    public getRandomWalkSeries(count: number): IXyValues {
        const xValues: number[] = [];
        const yValues: number[] = [];
        for (let i = 0; i < count; i++) {
            const next: number = this.last + (Math.random() - 0.5 + this.bias);
            xValues.push(this.i++);
            yValues.push(next);
        }

        return {xValues, yValues};
    }
}
