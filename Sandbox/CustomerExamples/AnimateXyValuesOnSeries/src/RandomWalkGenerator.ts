export interface IXyValues {
    xValues: number[];
    yValues: number[];
}

// A helper class used only to generate data for this example
export class RandomWalkGenerator {
    private readonly bias: number;
    private last: number;
    private i: number;
    constructor(bias: number = 0.01) {
        this.bias = bias;
        this.reset();
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
            this.last = next;
        }

        return {xValues, yValues};
    }
}
