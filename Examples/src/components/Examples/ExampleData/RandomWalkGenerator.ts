import {IXyValues} from "./ExampleDataProvider";

export class RandomWalkGenerator {
    private readonly bias: number;
    private last: number;
    private i: number;
    private _seed: number;
    constructor(bias: number = 0.01) {
        this.bias = bias;
        this.reset();
    }

    public Seed(seed: number){
        this._seed = seed % 2147483647;
        if (this._seed <= 0) this._seed += 2147483646;
        return this;
    }

    public reset(){
        this.i = 0;
        this.last = 0;
    }

    public getRandomWalkSeries(count: number): IXyValues {
        const xValues: number[] = [];
        const yValues: number[] = [];
        const random = () => this._seed === undefined ? Math.random() : (this.nextSeeded() - 1) / 2147483646;
        for (let i = 0; i < count; i++) {
            const next: number = this.last + (random() - 0.5 + this.bias);
            xValues.push(this.i++);
            yValues.push(next);
            this.last = next;
        }

        return {xValues, yValues};
    }

    private nextSeeded() {
        return this._seed = this._seed * 16807 % 2147483647;
    }
}
