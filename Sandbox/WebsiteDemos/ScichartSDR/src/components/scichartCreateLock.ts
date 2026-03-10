let createLock: Promise<void> = Promise.resolve();

export async function withSciChartCreateLock<T>(factory: () => Promise<T>): Promise<T> {
  const previous = createLock;
  let release!: () => void;
  createLock = new Promise<void>((resolve) => {
    release = resolve;
  });

  await previous;
  try {
    return await factory();
  } finally {
    release();
  }
}
