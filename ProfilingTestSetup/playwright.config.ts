import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

const isProduction = process.env.NODE_ENV === "production" || process.env.TEST_MODE === "file";

// hint the headless chrome browser to use GPU acceleration
const launchOptions = {
    args: ["--no-sandbox", "--ignore-gpu-blocklist", "--use-gl=angle", "--use-angle=gl-egl"]
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: "./tests",
    /* Run tests in files in parallel */
    fullyParallel: false,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Disable retries */
    retries: 0,
    /* Opt out of parallel tests on CI. */
    workers: 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ["list"],
        // ['html'],
        [
            "./reporters/json-reporter.ts",
            {
                outputFile: "test-results/results.json",
                envTestOutputFile: "test-results/envTestResults.json"
            }
        ]
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('')`. */
        // baseURL: 'http://localhost:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",
        deviceScaleFactor: 2,
        viewport: { width: 1280, height: 720 } // in pixels
    },
    /* Configure projects for major browsers */
    projects: [
        {
            name: "gpu-chromium",
            testDir: "tests/EnvTests",
            use: {
                launchOptions,
                ...devices["Desktop Chrome"]
            }
        },
        {
            name: "gpu-firefox",
            testDir: "tests/EnvTests",
            use: {
                ...devices["Desktop Firefox"]
            }
        },
        {
            name: "gpu-safari",
            testDir: "tests/EnvTests",
            use: {
                // launchOptions,
                ...devices["Desktop Safari"]
            }
        },
        {
            name: "chromium",
            testDir: "tests/PerformanceTests",
            use: {
                launchOptions,
                ...devices["Desktop Chrome"]
            }
        },
        {
            name: "firefox",
            testDir: "tests/PerformanceTests",
            use: {
                ...devices["Desktop Firefox"]
            }
        },

        {
            name: "webkit",
            testDir: "tests/PerformanceTests",
            use: {
                ...devices["Desktop Safari"]
            }
        },

        {
            name: "long",
            testDir: "tests/LongRunningTests",
            use: {
                launchOptions,
                ...devices["Desktop Chrome"]
            }
        }

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],

    /* Run your local dev server before starting the tests */
    ...(isProduction
        ? {}
        : {
              webServer: {
                  command: "npm run dev:test",
                  url: "http://localhost:8080",
                  reuseExistingServer: !process.env.CI
              }
          })
});
