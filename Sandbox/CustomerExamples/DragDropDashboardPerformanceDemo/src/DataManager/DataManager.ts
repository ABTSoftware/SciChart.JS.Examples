// A class to simulate data updates for the chart
export class DataManager {
  private static instance: DataManager;
  private subscribers: ((
    timestamp: number,
    xValues: Float64Array,
    yValues: Float64Array
  ) => void)[] = [];
  private currentX: number = 0;
  private readonly intervalId?: number;
  protected readonly dataUpdateRate: number;

  private constructor(dataUpdateRate: number) {
    // Start the update loop
    this.intervalId = window.setInterval(() => this.update(), 1000 / 60);
    this.dataUpdateRate = dataUpdateRate ?? 1;
  }

  public static getInstance(dataUpdateRate: number): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager(dataUpdateRate);
    }
    return DataManager.instance;
  }

  private update() {
    // Create new data points
    const xValues = new Float64Array(this.dataUpdateRate);
    const yValues = new Float64Array(this.dataUpdateRate);

    for (let i = 0; i < this.dataUpdateRate; i++) {
      xValues[i] = this.currentX + i;
      yValues[i] = Math.random();
    }

    this.currentX += this.dataUpdateRate;

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
      console.log(`Unsubscribed from data updates`);
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
