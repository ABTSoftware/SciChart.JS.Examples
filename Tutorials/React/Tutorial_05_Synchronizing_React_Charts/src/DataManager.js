import { RandomWalkGenerator } from "./RandomWalkGenerator";

export class DataManager {
  constructor() {
    this.generators = new Map();
    this.data = new Map();
  }

  async fetchData(id, count = 100) {
    // Create new generator if doesn't exist
    if (!this.generators.has(id)) {
      const generator = new RandomWalkGenerator();
      this.generators.set(id, generator);
    }

    // Get or create data
    if (!this.data.has(id)) {
      const generator = this.generators.get(id);
      const data = generator.getRandomWalkSeries(count);
      this.data.set(id, data);
    }

    // Simulate async operation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.data.get(id));
      }, 100);
    });
  }

  reset(id) {
    if (this.generators.has(id)) {
      const generator = this.generators.get(id);
      generator.reset();
      this.data.delete(id);
    }
  }

  resetAll() {
    this.generators.forEach((generator) => generator.reset());
    this.data.clear();
  }
}
