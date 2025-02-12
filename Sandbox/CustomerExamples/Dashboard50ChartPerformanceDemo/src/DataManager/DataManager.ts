// A class to simulate data updates for the chart
export class DataManager {
  private static instance: DataManager;
  private subscribers: ((
    timestamp: number,
    xValues: Float64Array,
    yValues: Float64Array
  ) => void)[] = [];
  private currentX: number = 0;
  private intervalId?: number;

  private constructor() {
    // Start the update loop
    this.intervalId = window.setInterval(() => this.update(), 1000 / 16);
  }

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  private update() {
    // Create new data points
    const pointCount = 1;
    const xValues = new Float64Array(pointCount);
    const yValues = new Float64Array(pointCount);

    for (let i = 0; i < pointCount; i++) {
      xValues[i] = this.currentX + i;
      yValues[i] = Math.random();
    }

    this.currentX += pointCount;

    // Notify subscribers
    const timestamp = Date.now();
    this.subscribers.forEach((callback) =>
      callback(timestamp, xValues, yValues)
    );
  }

  public subscribeDataUpdate(
    callback: (
      timestamp: number,
      xValues: Float64Array,
      yValues: Float64Array
    ) => void
  ) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  public dispose() {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
    }
    this.subscribers = [];
  }
}
