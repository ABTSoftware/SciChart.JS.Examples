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
  private xBuffer: Float64Array;
  private yBuffer: Float64Array;
  protected dataUpdateRate: number;

  private constructor(dataUpdateRate: number) {
    // Start the update loop
    this.intervalId = window.setInterval(() => this.update(), 1000 / 60);
    this.dataUpdateRate = dataUpdateRate ?? 1;
    this.xBuffer = new Float64Array(this.dataUpdateRate);
    this.yBuffer = new Float64Array(this.dataUpdateRate);
  }

  public static getInstance(dataUpdateRate: number): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager(dataUpdateRate);
    }
    DataManager.instance.setDataUpdateRate(dataUpdateRate);
    return DataManager.instance;
  }

  private update() {
    // Create new data points
    for (let i = 0; i < this.dataUpdateRate; i++) {
      this.xBuffer[i] = this.currentX + i;
      this.yBuffer[i] = Math.random();
    }

    this.currentX += this.dataUpdateRate;

    // Notify subscribers
    const timestamp = Date.now();
    this.subscribers.forEach((callback) =>
      callback(timestamp, this.xBuffer, this.yBuffer)
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

  private setDataUpdateRate(dataUpdateRate: number) {
    this.dataUpdateRate = dataUpdateRate;
    this.xBuffer = new Float64Array(dataUpdateRate);
    this.yBuffer = new Float64Array(dataUpdateRate);
  }
}
