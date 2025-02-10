export class RandomWalkGenerator {
  constructor(bias = 0.01) {
    this.bias = bias;
    this.reset();
  }

  Seed(seed) {
    this._seed = seed % 2147483647;
    if (this._seed <= 0) this._seed += 2147483646;
    return this;
  }

  reset() {
    this.i = 0;
    this.last = 0;
  }

  getRandomWalkSeries(count) {
    const xValues = [];
    const yValues = [];
    const random = () =>
      this._seed === undefined
        ? Math.random()
        : (this.nextSeeded() - 1) / 2147483646;

    for (let i = 0; i < count; i++) {
      const next = this.last + (random() - 0.5 + this.bias);
      xValues.push(this.i++);
      yValues.push(next);
      this.last = next;
    }

    return { xValues, yValues };
  }

  nextSeeded() {
    return (this._seed = (this._seed * 16807) % 2147483647);
  }
}
