import { test as baseTest } from "../fixtures";

// Re-export the base test with all fixtures
// This ensures PerformanceTests use the same fixtures as other tests
export const test = baseTest;
