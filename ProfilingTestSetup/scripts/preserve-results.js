#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Get configuration from environment variables or use defaults
const resultsPath = process.env.RESULTS_PATH || "test-results/results.json";
const previousPath = process.env.PREVIOUS_PATH || "test-results-archive/results.previous.json";

try {
    // Ensure results directory exists
    const resultsDir = path.dirname(resultsPath);
    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
        console.log(`[preserve-results] Created directory: ${resultsDir}`);
    }

    // Ensure previous results directory exists
    const previousDir = path.dirname(previousPath);
    if (!fs.existsSync(previousDir)) {
        fs.mkdirSync(previousDir, { recursive: true });
        console.log(`[preserve-results] Created directory: ${previousDir}`);
    }

    // Check if results file exists
    if (fs.existsSync(resultsPath)) {
        // Remove previous file if it exists
        if (fs.existsSync(previousPath)) {
            fs.unlinkSync(previousPath);
            console.log(`[preserve-results] Removed old previous results: ${previousPath}`);
        }

        // Copy current results to previous
        fs.copyFileSync(resultsPath, previousPath);
        console.log(
            `[preserve-results] ✓ Previous results preserved: ${resultsPath} → ${previousPath}`
        );
    } else {
        console.log(`[preserve-results] No existing results to preserve at: ${resultsPath}`);
    }
} catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`[preserve-results] ✗ Error preserving results:`, errorMessage);
    process.exit(1);
}
