// A helper class used only to generate data for this example
export class RandomWalkGenerator {
  bias;
  last;
  i;
  constructor(bias = 0.01) {
    this.bias = bias;
    this.reset();
  }
  reset() {
    this.i = 0;
    this.last = 0;
  }
  getRandomWalkSeries(count) {
    const xValues = [];
    const yValues = [];
    for (let i = 0; i < count; i++) {
      const next = this.last + (Math.random() - 0.5 + this.bias);
      xValues.push(this.i++);
      yValues.push(next);
      this.last = next;
    }
    return { xValues, yValues };
  }
}
