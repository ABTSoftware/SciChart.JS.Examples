import { drawMemoryStatsGraph } from "../src/MetricsVisualization/MemoryStatsGraph";
import { drawPerformanceStatsGraph } from "../src/MetricsVisualization/PerformanceStatsGraph";
import {
    drawPerformanceScalabilityGraph,
    extractScalabilityData
} from "../src/MetricsVisualization/PerformanceScalabilityGraph";
import {
    TCollectedMetrics,
    TCollectedPerformanceData,
    TCollectedInitializationPerformanceData,
    JsonReport,
    JsonSuiteResult,
    JsonTestResult
} from "../src/types";
import { parsePerformanceData, parseInitializationData } from "./PerformanceDataParser";

interface ComparisonMetrics {
    current: number;
    previous: number;
    diff: number;
    diffPercent: number;
}

function getTestFullName(...titles: string[]) {
    return titles.filter(t => t).join("_");
}

class TestReportViewer {
    private report: JsonReport | null = null;
    private previousReport: JsonReport | null = null;
    private chartIdCounter = 0;
    private comparisonMap: Map<string, Map<string, ComparisonMetrics>> = new Map();

    async init() {
        try {
            await this.loadReport();
            await this.loadPreviousReport();
            if (this.previousReport) {
                this.buildComparisonMap();
            }
            this.render();
        } catch (error) {
            this.showError(error);
        }
    }

    private async loadReport() {
        const response = await fetch("results.json");
        if (!response.ok) {
            throw new Error(`Failed to load test results: ${response.statusText}`);
        }
        this.report = await response.json();
    }

    private async loadPreviousReport() {
        try {
            console.log(
                "[TestReportViewer] Attempting to load previous report from: results.previous.json"
            );
            const response = await fetch("results.previous.json");
            console.log(
                `[TestReportViewer] Previous report fetch response status: ${response.status}`
            );

            if (response.ok) {
                this.previousReport = await response.json();
                console.log(`[TestReportViewer] ✓ Previous report loaded successfully`);
                if (this.previousReport) {
                    console.log(
                        `[TestReportViewer] Previous report has ${this.previousReport.stats.total} tests`
                    );
                }
            } else {
                console.log(
                    `[TestReportViewer] Previous report not found (status: ${response.status})`
                );
            }
        } catch (error) {
            // Previous report doesn't exist, which is fine for first run
            console.log(`[TestReportViewer] No previous report found for comparison:`, error);
        }
    }

    private buildComparisonMap() {
        if (!this.report || !this.previousReport) {
            console.log(
                "[TestReportViewer] Cannot build comparison map - missing report or previousReport"
            );
            return;
        }

        console.log(
            "[TestReportViewer] Building comparison map between current and previous reports..."
        );

        // Build a map of test title -> metrics for previous report
        const previousMetricsMap = new Map<string, any>();
        this.flattenSuites("", this.previousReport.suites, previousMetricsMap);
        console.log(
            `[TestReportViewer] Previous report metrics extracted: ${previousMetricsMap.size} tests`
        );

        // Build comparison map for current report
        const currentMetricsMap = new Map<string, any>();
        this.flattenSuites("", this.report.suites, currentMetricsMap);
        console.log(
            `[TestReportViewer] Current report metrics extracted: ${currentMetricsMap.size} tests`
        );

        // Create comparison metrics
        let comparisonCount = 0;
        currentMetricsMap.forEach((currentData, testTitle) => {
            const previousData = previousMetricsMap.get(testTitle);
            if (previousData) {
                const metricsComparison = new Map<string, ComparisonMetrics>();

                // Compare key metrics
                const metricsToCompare = [
                    "pageLoadDuration",
                    "domReadyDuration",
                    "evaluationDuration",
                    "initExampleDuration",
                    "wasmLoadDuration",
                    "bundleLoadDuration",
                    "totalInitTime",
                    "totalRenderTime",
                    "totalUpdateTime",
                    "avgEngineInit",
                    "avgSurfaceInit",
                    "avgInitDataGen",
                    "avgInitDataUpdate",
                    "avgInitRender",
                    "avgRender",
                    "minRender",
                    "maxRender",
                    "avgDataGen",
                    "avgDataUpdate",
                    "avgWebGl",
                    "avgCopyCanvas",
                    "avgFps"
                ];

                metricsToCompare.forEach(metric => {
                    const currentVal = currentData[metric] || 0;
                    const previousVal = previousData[metric] || 0;
                    if (previousVal > 0) {
                        const diff = currentVal - previousVal;
                        const diffPercent = (diff / previousVal) * 100;
                        metricsComparison.set(metric, {
                            current: currentVal,
                            previous: previousVal,
                            diff,
                            diffPercent
                        });
                    }
                });

                if (metricsComparison.size > 0) {
                    this.comparisonMap.set(testTitle, metricsComparison);
                    comparisonCount++;
                }
            }
        });

        console.log(
            `[TestReportViewer] ✓ Comparison map built with ${comparisonCount} test comparisons`
        );
    }

    private flattenSuites(
        parentSuiteTitle: string,
        suites: JsonSuiteResult[],
        metricsMap: Map<string, any>
    ) {
        suites.forEach(suite => {
            suite.tests.forEach(test => {
                test.attachments.forEach(att => {
                    if (
                        att.name === "evaluation-result" &&
                        att.contentType === "application/json" &&
                        att.body
                    ) {
                        const evaluationData = att.body as TCollectedMetrics;
                        const initExampleDuration =
                            (evaluationData.initExampleEnd || 0) -
                            (evaluationData.initExampleStart || 0);

                        // Extract basic metrics
                        const basicMetrics = {
                            pageLoadDuration: evaluationData.pageLoadDuration || 0,
                            domReadyDuration: evaluationData.domReadyDuration || 0,
                            evaluationDuration: evaluationData.evaluationDuration || 0,
                            initExampleDuration: initExampleDuration,
                            wasmLoadDuration: evaluationData.networkMetrics?.wasmLoadDuration || 0,
                            bundleLoadDuration:
                                evaluationData.networkMetrics?.bundleLoadDuration || 0
                        };

                        // Calculate derived metrics for comparison
                        const performanceData = evaluationData.performanceData || [];
                        const initData = evaluationData.initializationPerformanceData || [];

                        const metrics = parsePerformanceData(performanceData);
                        const initMetrics = parseInitializationData(initData);

                        const allMetrics = Object.values(metrics);
                        const allInitMetrics = Array.from(initMetrics.values());

                        const avgEngineInit =
                            allInitMetrics.length > 0
                                ? allInitMetrics.reduce(
                                      (sum, m) =>
                                          sum +
                                          (isNaN(m.engineInitDuration) ? 0 : m.engineInitDuration),
                                      0
                                  ) / allInitMetrics.length
                                : 0;
                        const avgSurfaceInit =
                            allInitMetrics.length > 0
                                ? allInitMetrics.reduce(
                                      (sum, m) =>
                                          sum +
                                          (isNaN(m.surfaceInitDuration)
                                              ? 0
                                              : m.surfaceInitDuration),
                                      0
                                  ) / allInitMetrics.length
                                : 0;
                        const avgInitDataGen =
                            allInitMetrics.length > 0
                                ? allInitMetrics.reduce(
                                      (sum, m) =>
                                          sum +
                                          (isNaN(m.dataGenerationDuration)
                                              ? 0
                                              : m.dataGenerationDuration),
                                      0
                                  ) / allInitMetrics.length
                                : 0;
                        const avgInitDataUpdate =
                            allInitMetrics.length > 0
                                ? allInitMetrics.reduce(
                                      (sum, m) =>
                                          sum +
                                          (isNaN(m.dataUpdateDuration) ? 0 : m.dataUpdateDuration),
                                      0
                                  ) / allInitMetrics.length
                                : 0;
                        const avgInitRender =
                            allInitMetrics.length > 0
                                ? allInitMetrics.reduce(
                                      (sum, m) =>
                                          sum + (isNaN(m.renderDuration) ? 0 : m.renderDuration),
                                      0
                                  ) / allInitMetrics.length
                                : 0;

                        const totalInitTime =
                            avgEngineInit +
                            avgSurfaceInit +
                            avgInitDataGen +
                            avgInitDataUpdate +
                            avgInitRender;

                        const avgRender =
                            allMetrics.length > 0
                                ? allMetrics.reduce(
                                      (sum, m) =>
                                          sum +
                                          (isNaN(m.averageRenderDuration)
                                              ? 0
                                              : m.averageRenderDuration),
                                      0
                                  ) / allMetrics.length
                                : 0;
                        const minRender =
                            allMetrics.length > 0
                                ? Math.min(
                                      ...allMetrics.map(m =>
                                          isNaN(m.minRenderDuration) ? 0 : m.minRenderDuration
                                      )
                                  )
                                : 0;
                        const maxRender =
                            allMetrics.length > 0
                                ? Math.max(
                                      ...allMetrics.map(m =>
                                          isNaN(m.maxRenderDuration) ? 0 : m.maxRenderDuration
                                      )
                                  )
                                : 0;
                        const avgDataGen =
                            allMetrics.length > 0
                                ? allMetrics.reduce(
                                      (sum, m) =>
                                          sum +
                                          (isNaN(m.averageDataGenerationDuration)
                                              ? 0
                                              : m.averageDataGenerationDuration),
                                      0
                                  ) / allMetrics.length
                                : 0;
                        const avgDataUpdate =
                            allMetrics.length > 0
                                ? allMetrics.reduce(
                                      (sum, m) =>
                                          sum +
                                          (isNaN(m.averageDataUpdateDuration)
                                              ? 0
                                              : m.averageDataUpdateDuration),
                                      0
                                  ) / allMetrics.length
                                : 0;
                        const avgWebGl =
                            allMetrics.length > 0
                                ? allMetrics.reduce(
                                      (sum, m) =>
                                          sum +
                                          (isNaN(m.averageRenderToWebGlDuration)
                                              ? 0
                                              : m.averageRenderToWebGlDuration),
                                      0
                                  ) / allMetrics.length
                                : 0;
                        const avgCopyCanvas =
                            allMetrics.length > 0
                                ? allMetrics.reduce(
                                      (sum, m) =>
                                          sum +
                                          (isNaN(m.averageCopyToCanvasDuration)
                                              ? 0
                                              : m.averageCopyToCanvasDuration),
                                      0
                                  ) / allMetrics.length
                                : 0;
                        const avgFps =
                            allMetrics.length > 0
                                ? allMetrics.reduce((sum, m) => {
                                      // if (isNaN(m.averageFPS)) {
                                      //     throw new Error(`FPS NaN: ${m}`)
                                      // }
                                      return sum + (isNaN(m.averageFPS) ? 0 : m.averageFPS);
                                  }, 0) / allMetrics.length
                                : 0;
                        const totalRenders = allMetrics.reduce((sum, m) => sum + m.totalRenders, 0);
                        const totalUpdates = allMetrics.reduce(
                            (sum, m) => sum + m.totalDataUpdates,
                            0
                        );

                        const totalRenderTime = totalRenders * avgRender;
                        const totalUpdateTime = totalUpdates * avgDataUpdate;

                        metricsMap.set(getTestFullName(parentSuiteTitle, suite.title, test.title), {
                            ...basicMetrics,
                            totalInitTime,
                            totalRenderTime,
                            totalUpdateTime,
                            avgEngineInit,
                            avgSurfaceInit,
                            avgInitDataGen,
                            avgInitDataUpdate,
                            avgInitRender,
                            avgRender,
                            minRender,
                            maxRender,
                            avgDataGen,
                            avgDataUpdate,
                            avgWebGl,
                            avgCopyCanvas,
                            avgFps,
                            totalRenders,
                            totalUpdates
                        });
                    }
                });
            });
            if (suite.suites.length > 0) {
                this.flattenSuites(
                    getTestFullName(parentSuiteTitle, suite.title),
                    suite.suites,
                    metricsMap
                );
            }
        });
    }

    private showError(error: any) {
        const loadingEl = document.getElementById("loading");
        const errorEl = document.getElementById("error");

        if (loadingEl) loadingEl.classList.add("hidden");
        if (errorEl) {
            errorEl.classList.remove("hidden");
            errorEl.textContent = `Error: ${error.message || error}`;
        }
    }

    private render() {
        if (!this.report) return;

        const loadingEl = document.getElementById("loading");
        if (loadingEl) loadingEl.classList.add("hidden");

        this.renderMeta();
        this.renderStats();
        this.renderTests();
    }

    private getComparisonColor(diffPercent: number, isHigherBetter: boolean = false): string {
        // For most metrics (timing): negative diff = improvement (green), positive = regression (red)
        // For FPS metrics: positive diff = improvement (green), negative = regression (red)
        const absDiff = Math.abs(diffPercent);

        // Invert the logic for metrics where higher is better (like FPS)
        const effectiveDiff = isHigherBetter ? -diffPercent : diffPercent;

        if (effectiveDiff < 0) {
            // Improvement (faster/better for timing, higher for FPS)
            if (absDiff > 20) return "#00aa00"; // Dark green
            if (absDiff > 10) return "#22cc22"; // Medium green
            return "#66ff66"; // Light green
        } else if (effectiveDiff > 0) {
            // Regression (slower/worse for timing, lower for FPS)
            if (absDiff > 20) return "#cc0000"; // Dark red
            if (absDiff > 10) return "#ff4444"; // Medium red
            return "#ffaaaa"; // Light red
        }
        return "#ffffff"; // No change
    }

    private renderMeta() {
        if (!this.report) return;

        const metaEl = document.getElementById("report-meta");
        if (!metaEl) return;

        const startTime = new Date(this.report.startTime);
        const endTime = this.report.endTime ? new Date(this.report.endTime) : null;
        const duration = this.report.stats.duration / 1000;

        let comparisonInfo = "";
        if (this.previousReport) {
            comparisonInfo = `<div style="color: #0066cc; font-weight: bold;">📊 Comparison with previous run enabled</div>`;
        }

        metaEl.innerHTML = `
            <div style="margin-top: 10px; color: #666; font-size: 14px;">
                <div>Started: ${startTime.toLocaleString()}</div>
                ${endTime ? `<div>Ended: ${endTime.toLocaleString()}</div>` : ""}
                <div>Duration: ${duration.toFixed(2)}s</div>
                <div>Workers: ${this.report.config.workers}</div>
                ${comparisonInfo}
            </div>
        `;
    }

    private renderStats() {
        if (!this.report) return;

        const statsEl = document.getElementById("stats-container");
        if (!statsEl) return;

        const { stats } = this.report;

        statsEl.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${stats.total}</div>
                    <div class="stat-label">Total Tests</div>
                </div>
                <div class="stat-card passed">
                    <div class="stat-value">${stats.passed}</div>
                    <div class="stat-label">Passed</div>
                </div>
                <div class="stat-card failed">
                    <div class="stat-value">${stats.failed}</div>
                    <div class="stat-label">Failed</div>
                </div>
                <div class="stat-card skipped">
                    <div class="stat-value">${stats.skipped}</div>
                    <div class="stat-label">Skipped</div>
                </div>
                <div class="stat-card flaky">
                    <div class="stat-value">${stats.flaky}</div>
                    <div class="stat-label">Flaky</div>
                </div>
            </div>
        `;
    }

    private renderTests() {
        if (!this.report) return;

        const testsEl = document.getElementById("tests-container");
        if (!testsEl) return;

        testsEl.innerHTML = "";

        this.report.suites.forEach(suite => {
            this.renderSuite("", suite, testsEl);
        });
    }

    private renderSuite(
        parentSuiteTitle: string,
        suite: JsonSuiteResult,
        container: HTMLElement,
        isNested: boolean = false
    ) {
        if (suite.tests.length === 0 && suite.suites.length === 0) return;

        const suiteEl = document.createElement("div");
        suiteEl.className = isNested ? "test-suite nested-suite" : "test-suite";

        // Create header with toggle
        const headerEl = document.createElement("div");
        headerEl.className = "suite-header";

        const titleEl = document.createElement("div");
        titleEl.className = "suite-header-title";
        titleEl.textContent = suite.title || "Test Suite";
        if (suite.file && !isNested) {
            titleEl.textContent += ` (${suite.file})`;
        }
        headerEl.appendChild(titleEl);

        const toggleEl = document.createElement("span");
        toggleEl.className = "suite-toggle";
        toggleEl.textContent = "▼";
        headerEl.appendChild(toggleEl);

        suiteEl.appendChild(headerEl);

        // Create content container
        const contentEl = document.createElement("div");
        contentEl.className = "suite-content";

        // Show table and chart only at the bottom-level describe blocks (those with tests)
        // This is the "Line Series" level, not the file level
        const hasDirectTests = suite.tests.length > 0;
        const hasNoNestedSuites = suite.suites.length === 0;
        const isBottomLevelDescribe = hasDirectTests && hasNoNestedSuites;

        if (isBottomLevelDescribe) {
            // Collect all performance data from tests in this suite
            const testPerformanceMap = this.collectSuitePerformanceData(parentSuiteTitle, suite);
            const testMetricsMap = this.collectSuiteMetrics(parentSuiteTitle, suite);

            // Render scalability graph if we have multiple test results
            // TODO TEMPORARILY DISABLED - Performance scaling graph hidden
            if (false && testMetricsMap.size > 1) {
                this.renderScalabilityGraph(testMetricsMap, contentEl, suite.title);
            }

            // Render combined performance metrics table if data exists and is valid
            const hasValidTableData = testPerformanceMap.size > 0 &&
                Array.from(testPerformanceMap.values()).some(data =>
                    data.performanceData && data.performanceData.length > 0 &&
                    data.performanceData.some(perfData =>
                        perfData.preRenderStart?.length > 0 ||
                        perfData.renderToWebGl?.length > 0 ||
                        perfData.renderEnd?.length > 0 ||
                        perfData.framePainted?.length > 0
                    )
                );

            if (hasValidTableData) {
                this.renderPerformanceMetricsTableByTest(
                    testPerformanceMap,
                    contentEl,
                    suite.title
                );
            } else if (testPerformanceMap.size > 0) {
                // Has data but it's empty - show a message
                const noDataEl = document.createElement("div");
                noDataEl.className = "chart-container";
                noDataEl.innerHTML = `
                    <div style="padding: 20px; text-align: center; color: #a0a0a0;">
                        <div style="font-size: 16px; margin-bottom: 10px;">📊 No Performance Metrics</div>
                        <div style="font-size: 13px;">Performance data collection is disabled or incomplete.</div>
                        <div style="font-size: 12px; margin-top: 8px; color: #666;">
                            Set <code style="background: #2d2d2d; padding: 2px 6px; border-radius: 3px;">enableRenderTracing: true</code> to collect performance metrics.
                        </div>
                    </div>
                `;
                contentEl.appendChild(noDataEl);
            }
        }

        // Add tests to content
        suite.tests.forEach(test => {
            const testEl = this.createTestElement(test);
            contentEl.appendChild(testEl);
        });

        // Add nested suites to content
        suite.suites.forEach(nestedSuite => {
            this.renderSuite(
                getTestFullName(parentSuiteTitle, suite.title),
                nestedSuite,
                contentEl,
                true
            );
        });

        suiteEl.appendChild(contentEl);
        container.appendChild(suiteEl);

        // Add click handler for collapse/expand
        headerEl.addEventListener("click", e => {
            e.stopPropagation(); // Prevent event bubbling to parent headers

            const isCollapsed = contentEl.classList.contains("collapsed");

            if (isCollapsed) {
                // Expand
                contentEl.classList.remove("collapsed");
                toggleEl.classList.remove("collapsed");
            } else {
                // Collapse
                contentEl.classList.add("collapsed");
                toggleEl.classList.add("collapsed");
            }
        });
    }

    private collectSuiteMetrics(
        parentSuiteTitle: string,
        suite: JsonSuiteResult
    ): Map<string, TCollectedMetrics> {
        const testMetricsMap = new Map<string, TCollectedMetrics>();

        // Collect from tests in this suite
        suite.tests.forEach(test => {
            test.attachments.forEach(att => {
                if (
                    att.name === "evaluation-result" &&
                    att.contentType === "application/json" &&
                    att.body
                ) {
                    const evaluationData = att.body as TCollectedMetrics;
                    testMetricsMap.set(
                        getTestFullName(parentSuiteTitle, suite.title, test.title),
                        evaluationData
                    );
                }
            });
        });

        // Recursively collect from nested suites
        suite.suites.forEach(nestedSuite => {
            const nestedMap = this.collectSuiteMetrics(parentSuiteTitle, nestedSuite);
            nestedMap.forEach((data, testTitle) => {
                testMetricsMap.set(testTitle, data);
            });
        });

        return testMetricsMap;
    }

    private collectSuitePerformanceData(
        parentSuiteTitle: string,
        suite: JsonSuiteResult
    ): Map<
        string,
        {
            performanceData: TCollectedPerformanceData[];
            initData: TCollectedInitializationPerformanceData[];
            testDuration: number;
            initExampleStart: number;
            initExampleEnd: number;
            evaluationDuration: number;
            pageLoadDuration: number;
            domReadyDuration: number;
            wasmLoadStart: number;
            wasmLoadEnd: number;
            wasmLoadDuration: number;
            bundleLoadStart: number;
            bundleLoadEnd: number;
            bundleLoadDuration: number;
        }
    > {
        const testPerformanceMap = new Map<
            string,
            {
                performanceData: TCollectedPerformanceData[];
                initData: TCollectedInitializationPerformanceData[];
                testDuration: number;
                initExampleStart: number;
                initExampleEnd: number;
                evaluationDuration: number;
                pageLoadDuration: number;
                domReadyDuration: number;
                wasmLoadStart: number;
                wasmLoadEnd: number;
                wasmLoadDuration: number;
                bundleLoadStart: number;
                bundleLoadEnd: number;
                bundleLoadDuration: number;
            }
        >();

        // Collect from tests in this suite
        suite.tests.forEach(test => {
            test.attachments.forEach(att => {
                if (
                    att.name === "evaluation-result" &&
                    att.contentType === "application/json" &&
                    att.body
                ) {
                    const evaluationData = att.body as TCollectedMetrics;
                    testPerformanceMap.set(
                        getTestFullName(parentSuiteTitle, suite.title, test.title),
                        {
                            performanceData: evaluationData.performanceData || [],
                            initData: evaluationData.initializationPerformanceData || [],
                            testDuration: test.duration,
                            initExampleStart: evaluationData.initExampleStart,
                            initExampleEnd: evaluationData.initExampleEnd,
                            evaluationDuration: evaluationData.evaluationDuration || 0,
                            pageLoadDuration: evaluationData.pageLoadDuration || 0,
                            domReadyDuration: evaluationData.domReadyDuration || 0,
                            wasmLoadStart: evaluationData.networkMetrics?.wasmLoadStart || 0,
                            wasmLoadEnd: evaluationData.networkMetrics?.wasmLoadEnd || 0,
                            wasmLoadDuration: evaluationData.networkMetrics?.wasmLoadDuration || 0,
                            bundleLoadStart: evaluationData.networkMetrics?.bundleLoadStart || 0,
                            bundleLoadEnd: evaluationData.networkMetrics?.bundleLoadEnd || 0,
                            bundleLoadDuration:
                                evaluationData.networkMetrics?.bundleLoadDuration || 0
                        }
                    );
                }
            });
        });

        // Recursively collect from nested suites
        suite.suites.forEach(nestedSuite => {
            const nestedMap = this.collectSuitePerformanceData(
                getTestFullName(parentSuiteTitle, suite.title),
                nestedSuite
            );
            nestedMap.forEach((data, testTitle) => {
                testPerformanceMap.set(testTitle, data);
            });
        });

        return testPerformanceMap;
    }

    private createTestElement(test: JsonTestResult): HTMLElement {
        const testEl = document.createElement("div");
        testEl.className = "test-item";

        const infoEl = document.createElement("div");
        infoEl.className = "test-info";

        const titleEl = document.createElement("div");
        titleEl.className = "test-title";
        titleEl.textContent = test.title;
        infoEl.appendChild(titleEl);

        const metaEl = document.createElement("div");
        metaEl.className = "test-meta";
        metaEl.textContent = `${test.file}:${test.line} • Duration: ${(
            test.duration / 1000
        ).toFixed(2)}s`;
        if (test.retries > 0) {
            metaEl.textContent += ` • Retries: ${test.retries}`;
        }
        infoEl.appendChild(metaEl);

        testEl.appendChild(infoEl);

        const statusEl = document.createElement("div");
        statusEl.className = `test-status status-${test.status}`;
        statusEl.textContent = test.status;
        testEl.appendChild(statusEl);

        // Add details section if there's an error or attachments
        if (test.error || test.attachments.length > 0) {
            const expandBtn = document.createElement("button");
            expandBtn.className = "expand-btn";
            expandBtn.textContent = "Show Details";
            testEl.appendChild(expandBtn);

            const detailsEl = document.createElement("div");
            detailsEl.className = "test-details hidden";

            if (test.error) {
                const errorEl = document.createElement("div");
                errorEl.className = "error-message";
                errorEl.textContent = test.error.message;
                if (test.error.stack) {
                    errorEl.textContent += "\n\n" + test.error.stack;
                }
                detailsEl.appendChild(errorEl);
            }

            if (test.attachments.length > 0) {
                this.renderAttachments(test.attachments, detailsEl);
            }

            infoEl.appendChild(detailsEl);

            expandBtn.addEventListener("click", e => {
                e.stopPropagation();
                detailsEl.classList.toggle("hidden");
                expandBtn.textContent = detailsEl.classList.contains("hidden")
                    ? "Show Details"
                    : "Hide Details";
            });
        }

        return testEl;
    }

    private renderAttachments(attachments: JsonTestResult["attachments"], container: HTMLElement) {
        const attachmentsEl = document.createElement("div");
        attachmentsEl.className = "attachments";
        attachmentsEl.innerHTML = "<strong>Attachments:</strong>";

        attachments.forEach(att => {
            const attEl = document.createElement("div");
            attEl.className = "attachment-item";

            let content = `📎 ${att.name} (${att.contentType})`;
            if (att.path) {
                content += ` - ${att.path}`;
            }

            attEl.textContent = content;

            // If it's the evaluation-result attachment with body, render charts
            if (
                att.name === "evaluation-result" &&
                att.contentType === "application/json" &&
                att.body
            ) {
                this.renderEvaluationCharts(att.body, attEl);
            }

            attachmentsEl.appendChild(attEl);
        });

        container.appendChild(attachmentsEl);
    }

    private renderEvaluationCharts(evaluationData: TCollectedMetrics, container: HTMLElement) {
        const { memoryData, performanceData, browserAnimationFrameData } = evaluationData;

        // Create memory chart container
        if (memoryData && memoryData.length > 0) {
            const memoryChartContainer = document.createElement("div");
            memoryChartContainer.className = "chart-container";

            const memoryHeader = document.createElement("div");
            memoryHeader.className = "chart-title";
            memoryHeader.style.cursor = "pointer";
            memoryHeader.style.userSelect = "none";
            memoryHeader.style.display = "flex";
            memoryHeader.style.justifyContent = "space-between";
            memoryHeader.style.alignItems = "center";

            const titleSpan = document.createElement("span");
            titleSpan.textContent = "📊 Memory Usage";
            memoryHeader.appendChild(titleSpan);

            const toggleIcon = document.createElement("span");
            toggleIcon.textContent = "▶";
            toggleIcon.style.fontSize = "14px";
            toggleIcon.style.transition = "transform 0.2s";
            memoryHeader.appendChild(toggleIcon);

            memoryChartContainer.appendChild(memoryHeader);

            const memoryChartId = `memory-chart-${this.chartIdCounter++}`;
            const memoryChartWrapper = document.createElement("div");
            memoryChartWrapper.className = "chart-wrapper";
            memoryChartWrapper.id = memoryChartId;
            memoryChartWrapper.style.display = "none"; // Initially collapsed
            memoryChartContainer.appendChild(memoryChartWrapper);

            // Add click handler for collapse/expand
            let chartRendered = false;
            memoryHeader.addEventListener("click", () => {
                const isCollapsed = memoryChartWrapper.style.display === "none";
                if (isCollapsed) {
                    memoryChartWrapper.style.display = "block";
                    toggleIcon.style.transform = "rotate(90deg)";

                    // Render chart only when first expanded
                    if (!chartRendered) {
                        chartRendered = true;
                        setTimeout(() => {
                            drawMemoryStatsGraph(memoryData)(memoryChartId)
                                .then(() => {
                                    console.log("Memory chart rendered successfully");
                                })
                                .catch(err => {
                                    console.error("Failed to render memory chart:", err);
                                    memoryChartWrapper.innerHTML = `<div style="color: red; padding: 20px;">Failed to render memory chart: ${err.message}</div>`;
                                });
                        }, 100);
                    }
                } else {
                    memoryChartWrapper.style.display = "none";
                    toggleIcon.style.transform = "rotate(0deg)";
                }
            });

            container.appendChild(memoryChartContainer);
        } else {
            console.log("No memory data available");
        }

        // Create performance chart container
        // Check if performance data exists and has valid data (not just empty arrays)
        const hasValidPerformanceData = performanceData && performanceData.length > 0 &&
            performanceData.some(data =>
                data.preRenderStart?.length > 0 ||
                data.renderToWebGl?.length > 0 ||
                data.renderEnd?.length > 0 ||
                data.framePainted?.length > 0
            );

        if (hasValidPerformanceData) {
            console.log("Rendering performance chart with", performanceData.length, "data entries");
            const perfChartContainer = document.createElement("div");
            perfChartContainer.className = "chart-container";

            const perfTitle = document.createElement("div");
            perfTitle.className = "chart-title";
            perfTitle.textContent = "⚡ Performance Metrics";
            perfChartContainer.appendChild(perfTitle);

            const perfChartId = `perf-chart-${this.chartIdCounter++}`;
            const perfChartWrapper = document.createElement("div");
            perfChartWrapper.className = "chart-wrapper";
            perfChartWrapper.id = perfChartId;
            // Performance charts need more height for subcharts
            perfChartWrapper.style.height = `${Math.max(400, performanceData.length * 200)}px`;
            perfChartContainer.appendChild(perfChartWrapper);

            container.appendChild(perfChartContainer);

            // Render performance chart asynchronously
            setTimeout(() => {
                console.log("Attempting to render performance chart to element:", perfChartId);
                drawPerformanceStatsGraph(
                    performanceData,
                    browserAnimationFrameData
                )(perfChartId)
                    .then(() => {
                        console.log("Performance chart rendered successfully");
                    })
                    .catch(err => {
                        console.error("Failed to render performance chart:", err);
                        console.error("Error stack:", err.stack);
                        perfChartWrapper.innerHTML = `<div style="color: red; padding: 20px;">Failed to render performance chart: ${
                            err.message
                        }<br><pre style="font-size: 11px; margin-top: 10px;">${
                            err.stack || ""
                        }</pre></div>`;
                    });
            }, 100);
        } else {
            console.log("No valid performance data available - enableRenderTracing might be disabled");
            // Show a message to the user
            const noDataContainer = document.createElement("div");
            noDataContainer.className = "chart-container";
            noDataContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #a0a0a0;">
                    <div style="font-size: 16px; margin-bottom: 10px;">⚡ No Performance Data</div>
                    <div style="font-size: 13px;">Performance tracing is disabled or no render events were captured.</div>
                    <div style="font-size: 12px; margin-top: 8px; color: #666;">
                        Set <code style="background: #2d2d2d; padding: 2px 6px; border-radius: 3px;">enableRenderTracing: true</code> in your test options.
                    </div>
                </div>
            `;
            container.appendChild(noDataContainer);
        }
    }

    private renderPerformanceMetricsTableByTest(
        testPerformanceMap: Map<
            string,
            {
                performanceData: TCollectedPerformanceData[];
                initData: TCollectedInitializationPerformanceData[];
                testDuration: number;
                initExampleStart: number;
                initExampleEnd: number;
                evaluationDuration: number;
                pageLoadDuration: number;
                domReadyDuration: number;
                wasmLoadStart: number;
                wasmLoadEnd: number;
                wasmLoadDuration: number;
                bundleLoadStart: number;
                bundleLoadEnd: number;
                bundleLoadDuration: number;
            }
        >,
        container: HTMLElement,
        seriesType?: string
    ) {
        const tableContainer = document.createElement("div");
        tableContainer.className = "chart-container";

        const tableHeader = document.createElement("div");
        tableHeader.className = "chart-title";
        tableHeader.style.cursor = "pointer";
        tableHeader.style.userSelect = "none";
        tableHeader.style.display = "flex";
        tableHeader.style.justifyContent = "space-between";
        tableHeader.style.alignItems = "center";

        const titleSpan = document.createElement("span");
        titleSpan.textContent = seriesType
            ? `📊 Performance Metrics Summary - ${seriesType}`
            : "📊 Performance Metrics Summary";
        tableHeader.appendChild(titleSpan);

        const toggleIcon = document.createElement("span");
        toggleIcon.textContent = "▶";
        toggleIcon.style.fontSize = "14px";
        toggleIcon.style.transition = "transform 0.2s";
        tableHeader.appendChild(toggleIcon);

        tableContainer.appendChild(tableHeader);

        const tableWrapper = document.createElement("div");
        tableWrapper.className = "performance-table-wrapper";
        tableWrapper.style.display = "none"; // Initially collapsed

        const table = document.createElement("table");
        table.className = "performance-table";

        // Create table body first to collect metrics for header formulas
        const tbody = document.createElement("tbody");
        const allMetricsData: any[] = [];

        testPerformanceMap.forEach((data, testTitle) => {
            const metrics = parsePerformanceData(data.performanceData);
            const initMetrics = parseInitializationData(data.initData);

            if (Object.keys(metrics).length === 0) {
                return;
            }

            // Calculate aggregated metrics across all surfaces for this test
            const surfaceIds = Object.keys(metrics);
            const allMetrics = Object.values(metrics);

            // Calculate initialization metrics
            const allInitMetrics = Array.from(initMetrics.values());

            // Get initExample duration from the collected metrics
            const initExampleDuration = data.initExampleEnd - data.initExampleStart;
            const avgEngineInit =
                allInitMetrics.length > 0
                    ? allInitMetrics.reduce(
                          (sum, m) =>
                              sum + (isNaN(m.engineInitDuration) ? 0 : m.engineInitDuration),
                          0
                      ) / allInitMetrics.length
                    : 0;
            const avgSurfaceInit =
                allInitMetrics.length > 0
                    ? allInitMetrics.reduce(
                          (sum, m) =>
                              sum + (isNaN(m.surfaceInitDuration) ? 0 : m.surfaceInitDuration),
                          0
                      ) / allInitMetrics.length
                    : 0;
            const avgInitDataGen =
                allInitMetrics.length > 0
                    ? allInitMetrics.reduce(
                          (sum, m) =>
                              sum +
                              (isNaN(m.dataGenerationDuration) ? 0 : m.dataGenerationDuration),
                          0
                      ) / allInitMetrics.length
                    : 0;
            const avgInitDataUpdate =
                allInitMetrics.length > 0
                    ? allInitMetrics.reduce(
                          (sum, m) =>
                              sum + (isNaN(m.dataUpdateDuration) ? 0 : m.dataUpdateDuration),
                          0
                      ) / allInitMetrics.length
                    : 0;
            const avgInitRender =
                allInitMetrics.length > 0
                    ? allInitMetrics.reduce(
                          (sum, m) => sum + (isNaN(m.renderDuration) ? 0 : m.renderDuration),
                          0
                      ) / allInitMetrics.length
                    : 0;

            const avgRender =
                allMetrics.reduce(
                    (sum, m) =>
                        sum + (isNaN(m.averageRenderDuration) ? 0 : m.averageRenderDuration),
                    0
                ) / allMetrics.length;
            const minRender = Math.min(
                ...allMetrics.map(m => (isNaN(m.minRenderDuration) ? 0 : m.minRenderDuration))
            );
            const maxRender = Math.max(
                ...allMetrics.map(m => (isNaN(m.maxRenderDuration) ? 0 : m.maxRenderDuration))
            );
            const avgDataGen =
                allMetrics.reduce(
                    (sum, m) =>
                        sum +
                        (isNaN(m.averageDataGenerationDuration)
                            ? 0
                            : m.averageDataGenerationDuration),
                    0
                ) / allMetrics.length;
            const avgDataUpdate =
                allMetrics.reduce(
                    (sum, m) =>
                        sum +
                        (isNaN(m.averageDataUpdateDuration) ? 0 : m.averageDataUpdateDuration),
                    0
                ) / allMetrics.length;
            const avgWebGl =
                allMetrics.reduce(
                    (sum, m) =>
                        sum +
                        (isNaN(m.averageRenderToWebGlDuration)
                            ? 0
                            : m.averageRenderToWebGlDuration),
                    0
                ) / allMetrics.length;
            const avgCopyCanvas =
                allMetrics.reduce(
                    (sum, m) =>
                        sum +
                        (isNaN(m.averageCopyToCanvasDuration) ? 0 : m.averageCopyToCanvasDuration),
                    0
                ) / allMetrics.length;
            const avgFps =
                allMetrics.reduce((sum, m) => sum + (isNaN(m.averageFPS) ? 0 : m.averageFPS), 0) /
                allMetrics.length;
            const totalRenders = allMetrics.reduce((sum, m) => sum + m.totalRenders, 0);
            const totalUpdates = allMetrics.reduce((sum, m) => sum + m.totalDataUpdates, 0);

            // Calculate initialization time: engineInit + surfaceInit + initDataGen + initDataUpdate + initRender
            const totalInitTime =
                avgEngineInit + avgSurfaceInit + avgInitDataGen + avgInitDataUpdate + avgInitRender;

            // Calculate total render time: totalRenders * avgRender
            const totalRenderTime = totalRenders * avgRender;

            // Calculate total update time: totalUpdates * avgDataUpdate
            const totalUpdateTime = totalUpdates * avgDataUpdate;

            // Use actual test duration from Playwright (in milliseconds)
            const testDurationSeconds = data.testDuration.toFixed(2);

            // Store metrics for header formulas
            allMetricsData.push({
                testTitle,
                data,
                avgEngineInit,
                avgSurfaceInit,
                avgInitDataGen,
                avgInitDataUpdate,
                avgInitRender,
                avgRender,
                minRender,
                maxRender,
                avgDataGen,
                avgDataUpdate,
                avgWebGl,
                avgCopyCanvas,
                avgFps,
                totalRenders,
                totalUpdates,
                totalInitTime,
                totalRenderTime,
                totalUpdateTime,
                initExampleDuration,
                testDurationSeconds
            });

            const row = document.createElement("tr");

            // Helper to format numbers
            const fmt = (num: number) => num.toFixed(2);

            // Helper to get time color class
            const getTimeClass = (ms: number) => {
                if (ms <= 100) return "metric-good";
                if (ms <= 500) return "metric-warning";
                return "metric-bad";
            };

            // Helper to get FPS color class
            const getFpsClass = (fps: number) => {
                if (fps >= 55) return "metric-good";
                if (fps >= 30) return "metric-warning";
                return "metric-bad";
            };

            // Helper to get render time color class
            const getRenderClass = (ms: number) => {
                if (ms <= 16.67) return "metric-good"; // 60 FPS
                if (ms <= 33.33) return "metric-warning"; // 30 FPS
                return "metric-bad";
            };

            // Get comparison data if available
            const comparison = this.comparisonMap.get(testTitle);
            const getComparisonCell = (
                metric: string,
                value: number,
                formula?: string,
                isHigherBetter: boolean = false
            ) => {
                const tooltip = formula ? ` title="${formula}"` : "";
                if (!comparison || !comparison.has(metric)) {
                    return `<td class="${getTimeClass(value)}"${tooltip}>${fmt(value)}</td>`;
                }
                const comp = comparison.get(metric)!;
                const textColor = this.getComparisonColor(comp.diffPercent, isHigherBetter);
                const diffSign = comp.diff >= 0 ? "+" : "";
                return `<td style="position: relative;"${tooltip}>
                     <div>${fmt(value)}</div>
                     <div style="font-size: 10px; color: ${textColor}; margin-top: 2px; font-weight: bold;">
                         ${diffSign}${fmt(comp.diff)} (${diffSign}${comp.diffPercent.toFixed(1)}%)
                     </div>
                 </td>`;
            };

            // Create formula for Total Init Time
            const totalInitFormula = `EI+SI+DG+DU+IR = ${fmt(avgEngineInit)}+${fmt(
                avgSurfaceInit
            )}+${fmt(avgInitDataGen)}+${fmt(avgInitDataUpdate)}+${fmt(avgInitRender)}`;

            row.innerHTML = `
                  <td>${testTitle.split("_").pop()}</td>
                  <td>${testDurationSeconds}</td>
                  ${getComparisonCell("pageLoadDuration", data.pageLoadDuration)}
                  ${getComparisonCell("domReadyDuration", data.domReadyDuration)}
                  ${getComparisonCell("evaluationDuration", data.evaluationDuration)}
                  ${getComparisonCell("initExampleDuration", initExampleDuration)}
                  ${getComparisonCell("wasmLoadDuration", data.wasmLoadDuration)}
                  ${getComparisonCell("bundleLoadDuration", data.bundleLoadDuration)}
                  ${getComparisonCell("totalInitTime", totalInitTime, totalInitFormula)}
                  ${getComparisonCell("totalRenderTime", totalRenderTime)}
                  ${getComparisonCell("totalUpdateTime", totalUpdateTime)}
                  ${getComparisonCell("avgEngineInit", avgEngineInit)}
                  ${getComparisonCell("avgSurfaceInit", avgSurfaceInit)}
                  ${getComparisonCell("avgInitDataGen", avgInitDataGen)}
                  ${getComparisonCell("avgInitDataUpdate", avgInitDataUpdate)}
                  ${getComparisonCell("avgInitRender", avgInitRender)}
                  ${getComparisonCell("avgRender", avgRender)}
                  <td>${fmt(minRender)} / ${fmt(maxRender)}</td>
                  ${getComparisonCell("avgDataGen", avgDataGen)}
                  ${getComparisonCell("avgDataUpdate", avgDataUpdate)}
                  ${getComparisonCell("avgWebGl", avgWebGl)}
                  ${getComparisonCell("avgCopyCanvas", avgCopyCanvas)}
                  ${getComparisonCell("avgFps", avgFps, undefined, true)}
                  <td>${totalRenders}</td>
                  <td>${totalUpdates}</td>
              `;

            tbody.appendChild(row);
        });

        // Create table header
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
             <th>Test Name</th>
             <th>Test Duration (ms)</th>
             <th>Page Load (ms)</th>
             <th>DOM Ready (ms)</th>
             <th>Evaluation Duration (ms)</th>
             <th>Init Example Duration (ms)</th>
             <th>WASM Load (ms)</th>
             <th>Bundle Load (ms)</th>
             <th>Total Init Time (ms)</th>
             <th>Total Render Time (ms)</th>
             <th>Total Update Time (ms)</th>
             <th>Engine Init (ms)</th>
             <th>Surface Init (ms)</th>
             <th>Init Data Gen (ms)</th>
             <th>Init Data Update (ms)</th>
             <th>Init Render (ms)</th>
             <th>Avg Render (ms)</th>
             <th>Min/Max (ms)</th>
             <th>Data Gen (ms)</th>
             <th>Data Update (ms)</th>
             <th>WebGL Render (ms)</th>
             <th>Copy to Canvas (ms)</th>
             <th>Avg FPS</th>
             <th>Renders</th>
             <th>Updates</th>
         `;
        thead.appendChild(headerRow);
        table.appendChild(thead);
        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        tableContainer.appendChild(tableWrapper);

        // Add click handler for collapse/expand
        tableHeader.addEventListener("click", () => {
            const isCollapsed = tableWrapper.style.display === "none";
            if (isCollapsed) {
                tableWrapper.style.display = "block";
                toggleIcon.style.transform = "rotate(90deg)";
            } else {
                tableWrapper.style.display = "none";
                toggleIcon.style.transform = "rotate(0deg)";
            }
        });

        container.appendChild(tableContainer);
    }

    private renderScalabilityGraph(
        testMetricsMap: Map<string, TCollectedMetrics>,
        container: HTMLElement,
        seriesType?: string
    ) {
        try {
            const scalabilityData = extractScalabilityData(testMetricsMap);

            if (scalabilityData.length < 2) {
                return; // Need at least 2 data points for a meaningful graph
            }

            const chartContainer = document.createElement("div");
            chartContainer.className = "chart-container";

            const chartHeader = document.createElement("div");
            chartHeader.className = "chart-title";
            chartHeader.style.cursor = "pointer";
            chartHeader.style.userSelect = "none";
            chartHeader.style.display = "flex";
            chartHeader.style.justifyContent = "space-between";
            chartHeader.style.alignItems = "center";

            const titleSpan = document.createElement("span");
            titleSpan.textContent = seriesType
                ? `📈 Performance Scalability Analysis - ${seriesType}`
                : "📈 Performance Scalability Analysis";
            chartHeader.appendChild(titleSpan);

            const toggleIcon = document.createElement("span");
            toggleIcon.textContent = "▶";
            toggleIcon.style.fontSize = "14px";
            toggleIcon.style.transition = "transform 0.2s";
            chartHeader.appendChild(toggleIcon);

            chartContainer.appendChild(chartHeader);

            const chartId = `scalability-chart-${this.chartIdCounter++}`;
            const chartWrapper = document.createElement("div");
            chartWrapper.className = "chart-wrapper";
            chartWrapper.id = chartId;
            chartWrapper.style.height = "700px";
            chartWrapper.style.display = "none"; // Initially collapsed
            chartContainer.appendChild(chartWrapper);

            // Add click handler for collapse/expand
            let chartRendered = false;
            chartHeader.addEventListener("click", () => {
                const isCollapsed = chartWrapper.style.display === "none";
                if (isCollapsed) {
                    chartWrapper.style.display = "block";
                    toggleIcon.style.transform = "rotate(90deg)";

                    // Render chart only when first expanded
                    if (!chartRendered) {
                        chartRendered = true;
                        setTimeout(() => {
                            drawPerformanceScalabilityGraph(scalabilityData)(chartId)
                                .then(() => {
                                    console.log("Scalability chart rendered successfully");
                                })
                                .catch(err => {
                                    console.error("Failed to render scalability chart:", err);
                                    chartWrapper.innerHTML = `<div style="color: red; padding: 20px;">Failed to render scalability chart: ${err.message}</div>`;
                                });
                        }, 100);
                    }
                } else {
                    chartWrapper.style.display = "none";
                    toggleIcon.style.transform = "rotate(0deg)";
                }
            });

            container.appendChild(chartContainer);
        } catch (error) {
            console.error("Error preparing scalability data:", error);
        }
    }
}

// Initialize the viewer when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const viewer = new TestReportViewer();
    viewer.init();
});
