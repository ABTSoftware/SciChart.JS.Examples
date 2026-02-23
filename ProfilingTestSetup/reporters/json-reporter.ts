import {
    Reporter,
    FullConfig,
    Suite,
    TestCase,
    TestResult,
    FullResult
} from "@playwright/test/reporter";
import * as fs from "fs";
import * as path from "path";
import { JsonReport, JsonSuiteResult, JsonTestResult } from "../src/types";

interface EnvTestResult {
    title: string;
    project: string;
    file: string;
    line: number;
    column: number;
    status: string;
    duration: number;
    error?: {
        message: string;
        stack?: string;
    };
    retries: number;
    startTime: string;
    attachments: Array<{
        name: string;
        path?: string;
        contentType: string;
        body?: any;
    }>;
}

interface EnvTestReport {
    config: {
        rootDir: string;
        workers: number;
        retries: number;
    };
    stats: {
        total: number;
        passed: number;
        failed: number;
        skipped: number;
        flaky: number;
        duration: number;
    };
    tests: EnvTestResult[];
    startTime: string;
    endTime: string;
}

class JsonReporter implements Reporter {
    private config!: FullConfig;
    private suite!: Suite;
    private results: Map<string, TestResult[]> = new Map();
    private startTime!: Date;
    private outputFile: string;
    private envTestOutputFile: string;

    constructor(options: { outputFile?: string; envTestOutputFile?: string } = {}) {
        this.outputFile = options.outputFile || "test-results.json";
        this.envTestOutputFile = options.envTestOutputFile || "envTestResults.json";
    }

    onBegin(config: FullConfig, suite: Suite) {
        this.config = config;
        this.suite = suite;
        this.startTime = new Date();

        // Filter to only include PerformanceTests
        const performanceTests = suite
            .allTests()
            .filter(
                test =>
                    test.location.file.includes("PerformanceTests") ||
                    test.location.file.includes("LongRunningTests")
            );

        const envTests = suite.allTests().filter(test => test.location.file.includes("EnvTests"));

        console.log(
            `Starting test run with ${performanceTests.length} performance tests and ${envTests.length} environment tests`
        );
    }

    onTestEnd(test: TestCase, result: TestResult) {
        const testId = test.id;
        if (!this.results.has(testId)) {
            this.results.set(testId, []);
        }
        this.results.get(testId)!.push(result);
    }

    async onEnd(result: FullResult) {
        const endTime = new Date();
        const report = this.generateReport(endTime);

        // Ensure the directory exists
        const dir = path.dirname(this.outputFile);
        console.log(`\n[JsonReporter] Output directory: ${dir}`);
        console.log(`[JsonReporter] Output file: ${this.outputFile}`);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`[JsonReporter] Created directory: ${dir}`);
        }

        // Write the JSON report
        try {
            fs.writeFileSync(this.outputFile, JSON.stringify(report, null, 2), "utf-8");
            console.log(`[JsonReporter] ✓ JSON report written to: ${this.outputFile}`);
        } catch (err) {
            console.error(`[JsonReporter] ✗ Failed to write report:`, err);
        }

        // Generate and write environment test report
        const envReport = this.generateEnvTestReport(endTime);
        const envDir = path.dirname(this.envTestOutputFile);

        if (!fs.existsSync(envDir)) {
            fs.mkdirSync(envDir, { recursive: true });
        }

        try {
            fs.writeFileSync(this.envTestOutputFile, JSON.stringify(envReport, null, 2), "utf-8");
            console.log(
                `[JsonReporter] ✓ Environment test report written to: ${this.envTestOutputFile}`
            );
        } catch (err) {
            console.error(`[JsonReporter] ✗ Failed to write environment test report:`, err);
        }

        // Generate and inline environment test data into HTML report
        try {
            this.generateAndInlineEnvTestHtml(envReport, envDir);
        } catch (err) {
            console.error(`[JsonReporter] ✗ Failed to generate/inline environment test HTML:`, err);
        }

        console.log(`\n[JsonReporter] Test Summary:`);
        console.log(`[JsonReporter] Total tests: ${report.stats.total}`);
        console.log(`[JsonReporter] Passed: ${report.stats.passed}`);
        console.log(`[JsonReporter] Failed: ${report.stats.failed}`);
        console.log(`[JsonReporter] Skipped: ${report.stats.skipped}`);
        console.log(`[JsonReporter] Flaky: ${report.stats.flaky}`);
        console.log(`[JsonReporter] Duration: ${(report.stats.duration / 1000).toFixed(2)}s`);

        if (envReport.stats.total > 0) {
            console.log(`\n[JsonReporter] Environment Test Summary:`);
            console.log(`[JsonReporter] Total env tests: ${envReport.stats.total}`);
            console.log(`[JsonReporter] Passed: ${envReport.stats.passed}`);
            console.log(`[JsonReporter] Failed: ${envReport.stats.failed}`);
            console.log(`[JsonReporter] Skipped: ${envReport.stats.skipped}`);
        }
    }

    private generateReport(endTime: Date): JsonReport {
        const stats = {
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0,
            flaky: 0,
            duration: endTime.getTime() - this.startTime.getTime()
        };

        const suites = this.processSuite(this.suite, stats);

        return {
            config: {
                rootDir: this.config.rootDir,
                workers: this.config.workers,
                retries: this.config.projects[0]?.retries || 0
            },
            stats,
            suites,
            startTime: this.startTime.toISOString(),
            endTime: endTime.toISOString()
        };
    }

    private generateEnvTestReport(endTime: Date): EnvTestReport {
        const stats = {
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0,
            flaky: 0,
            duration: endTime.getTime() - this.startTime.getTime()
        };

        const tests: EnvTestResult[] = [];

        // Process all tests from EnvTests folder
        for (const test of this.suite.allTests()) {
            if (!test.location.file.includes("EnvTests")) {
                continue;
            }

            const testResults = this.results.get(test.id) || [];
            const lastResult = testResults[testResults.length - 1];

            if (lastResult) {
                stats.total++;

                const isFlaky =
                    testResults.length > 1 &&
                    testResults.some(r => r.status === "failed") &&
                    lastResult.status === "passed";

                if (isFlaky) {
                    stats.flaky++;
                } else if (lastResult.status === "passed") {
                    stats.passed++;
                } else if (lastResult.status === "failed") {
                    stats.failed++;
                } else if (lastResult.status === "skipped") {
                    stats.skipped++;
                }

                // Skip adding skipped tests to the report
                if (lastResult.status === "skipped") {
                    continue;
                }

                const envTest: EnvTestResult = {
                    title: test.title,
                    project: test.parent.project()?.name || "unknown",
                    file: test.location.file,
                    line: test.location.line,
                    column: test.location.column,
                    status: isFlaky ? "flaky" : lastResult.status,
                    duration: lastResult.duration,
                    retries: testResults.length - 1,
                    startTime: lastResult.startTime.toISOString(),
                    attachments: lastResult.attachments.map(att => {
                        const attachment: any = {
                            name: att.name,
                            path: att.path,
                            contentType: att.contentType
                        };

                        // Include body content for JSON attachments
                        if (att.contentType === "application/json" && att.body) {
                            try {
                                attachment.body = JSON.parse(att.body.toString());
                            } catch (e) {
                                attachment.body = att.body.toString();
                            }
                        }

                        return attachment;
                    })
                };

                if (lastResult.error) {
                    envTest.error = {
                        message: lastResult.error.message || "",
                        stack: lastResult.error.stack
                    };
                }

                tests.push(envTest);
            }
        }

        return {
            config: {
                rootDir: this.config.rootDir,
                workers: this.config.workers,
                retries: this.config.projects[0]?.retries || 0
            },
            stats,
            tests,
            startTime: this.startTime.toISOString(),
            endTime: endTime.toISOString()
        };
    }

    private generateAndInlineEnvTestHtml(envReport: EnvTestReport, envDir: string): void {
        const htmlReportPath = path.join(envDir, "envTestReport.html");

        try {
            let htmlContent: string;

            // If HTML file doesn't exist, create it from template
            if (!fs.existsSync(htmlReportPath)) {
                htmlContent = this.getHtmlTemplate();
                console.log(`[JsonReporter] Creating HTML report template at: ${htmlReportPath}`);
            } else {
                // Read existing HTML file
                htmlContent = fs.readFileSync(htmlReportPath, "utf-8");
            }

            // Create the JSON data string with proper formatting
            const jsonData = JSON.stringify(envReport, null, 4);

            // Replace the placeholder with actual data
            const placeholder = "<!-- INLINE_ENV_TEST_DATA_PLACEHOLDER -->";
            if (htmlContent.includes(placeholder)) {
                htmlContent = htmlContent.replace(placeholder, jsonData);
            } else {
                console.log(`[JsonReporter] Placeholder not found in HTML report`);
            }

            // Write the HTML file with inlined data
            fs.writeFileSync(htmlReportPath, htmlContent, "utf-8");
            console.log(
                `[JsonReporter] ✓ Environment test report generated with inlined data: ${htmlReportPath}`
            );
        } catch (err) {
            console.error(`[JsonReporter] ✗ Failed to generate/inline HTML report:`, err);
        }
    }

    private getHtmlTemplate(): string {
        return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Environment Test Report</title>

        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            html,
            body {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
                    Cantarell, sans-serif;
                background: #1e1e1e;
                color: #e0e0e0;
                line-height: 1.6;
                display: flex;
                flex-direction: column;
            }

            .container {
                flex: 1;
                overflow: auto;
                padding: 10px;
                display: flex;
                flex-direction: column;
            }

            header {
                background: #2d2d2d;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                margin-bottom: 15px;
            }

            h1 {
                font-size: 32px;
                margin-bottom: 10px;
                color: #e0e0e0;
            }

            .report-meta {
                font-size: 13px;
                color: #a0a0a0;
                margin-top: 10px;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 10px;
                margin-bottom: 15px;
            }

            .stat-card {
                background: #2d2d2d;
                padding: 12px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                text-align: center;
            }

            .stat-value {
                font-size: 36px;
                font-weight: bold;
                margin-bottom: 5px;
            }

            .stat-label {
                font-size: 14px;
                color: #a0a0a0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .stat-card.passed .stat-value { color: #27ae60; }
            .stat-card.failed .stat-value { color: #e74c3c; }
            .stat-card.skipped .stat-value { color: #95a5a6; }
            .stat-card.flaky .stat-value { color: #f39c12; }

            .test-suite {
                background: #2d2d2d;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                margin-bottom: 10px;
                overflow: hidden;
                border: 2px solid #404040;
            }

            .suite-header {
                background: #1a1a1a;
                color: #e0e0e0;
                padding: 10px 15px;
                font-weight: 600;
                font-size: 18px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: background 0.2s;
                user-select: none;
            }

            .suite-header:hover { background: #252525; }

            .suite-header-title {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .browser-badge {
                background: #3498db;
                color: #ffffff;
                padding: 4px 10px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .project-group {
                background: #2d2d2d;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                margin-bottom: 15px;
                overflow: hidden;
                border: 2px solid #404040;
            }

            .project-header {
                background: #252525;
                color: #e0e0e0;
                padding: 12px 15px;
                font-weight: 700;
                font-size: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: background 0.2s;
                user-select: none;
                border-bottom: 2px solid #404040;
            }

            .project-header:hover { background: #2a2a2a; }

            .project-header-title {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .project-icon {
                font-size: 24px;
            }

            .project-stats {
                display: flex;
                gap: 15px;
                font-size: 14px;
                font-weight: 500;
            }

            .project-stat {
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .project-content {
                overflow: visible;
            }

            .project-content.collapsed { display: none; }

            .collapse-icon {
                transition: transform 0.2s;
                font-size: 14px;
            }

            .collapsed .collapse-icon {
                transform: rotate(-90deg);
            }

            .test-status {
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .status-passed { background: #d4edda; color: #155724; }
            .status-failed { background: #f8d7da; color: #721c24; }
            .status-skipped { background: #e2e3e5; color: #383d41; }
            .status-flaky { background: #fff3cd; color: #856404; }

            .suite-content { overflow: visible; }
            .suite-content.collapsed { display: none; }

            .test-item {
                padding: 15px;
                border-bottom: 1px solid #404040;
                display: flex;
                flex-direction: column;
                transition: background 0.2s;
            }

            .test-item:hover { background: #353535; }
            .test-item:last-child { border-bottom: none; }

            .test-info { flex: 1; }

            .test-details {
                margin-top: 8px;
                padding: 10px;
                background: #353535;
                border-radius: 4px;
                font-size: 14px;
                color: #e0e0e0;
            }

            .detail-row {
                display: flex;
                margin: 5px 0;
            }

            .detail-label {
                font-weight: 600;
                width: 120px;
                color: #a0a0a0;
                flex-shrink: 0;
            }

            .detail-value {
                flex: 1;
                color: #e0e0e0;
                word-break: break-all;
            }

            .attachments {
                margin-top: 15px;
                border-top: 1px solid #404040;
                padding-top: 10px;
            }

            .attachments-title {
                font-weight: 600;
                color: #e0e0e0;
                margin-bottom: 10px;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .attachment-item {
                margin: 8px 0;
                padding: 10px;
                background: #2d2d2d;
                border-radius: 4px;
                font-size: 13px;
                color: #e0e0e0;
                border-left: 3px solid #3498db;
            }

            .attachment-name {
                font-weight: 600;
                margin-bottom: 5px;
                color: #3498db;
            }

            .attachment-type {
                font-size: 11px;
                color: #a0a0a0;
                background: #353535;
                padding: 3px 8px;
                border-radius: 3px;
                display: inline-block;
                margin-bottom: 8px;
            }

            .attachment-data {
                background: #1a1a1a;
                padding: 10px;
                border-radius: 4px;
                font-family: "Courier New", monospace;
                font-size: 12px;
                color: #a0a0a0;
                max-height: 300px;
                overflow-y: auto;
                white-space: pre-wrap;
                word-break: break-word;
            }

            .json-viewer {
                background: #1a1a1a;
                padding: 10px;
                border-radius: 4px;
                font-family: "Courier New", monospace;
                font-size: 12px;
                color: #a0a0a0;
                max-height: 400px;
                overflow-y: auto;
            }

            .json-key { color: #9cdcfe; }
            .json-string { color: #ce9178; }
            .json-number { color: #b5cea8; }
            .json-boolean { color: #569cd6; }
            .json-null { color: #569cd6; }

            .error-message {
                color: #ff6b6b;
                font-family: "Courier New", monospace;
                white-space: pre-wrap;
                margin-top: 10px;
                padding: 10px;
                background: #3a2a2a;
                border-left: 3px solid #ff6b6b;
            }

            .filter-section {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
                flex-wrap: wrap;
            }

            .filter-btn {
                background: #2d2d2d;
                border: 2px solid #404040;
                color: #e0e0e0;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
                font-size: 13px;
                transition: all 0.2s;
            }

            .filter-btn:hover { border-color: #3498db; color: #3498db; }
            .filter-btn.active { background: #3498db; border-color: #3498db; color: #ffffff; }

            .no-tests {
                text-align: center;
                padding: 40px;
                color: #a0a0a0;
                font-size: 16px;
            }

            .loading {
                text-align: center;
                padding: 50px;
                font-size: 18px;
                color: #a0a0a0;
            }

            .error {
                background: #3a2a2a;
                color: #ff6b6b;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }

            .hidden { display: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>🖥️ Environment Test Report</h1>
                <div id="report-meta" class="report-meta"></div>
            </header>

            <div id="filter-section" class="filter-section"></div>
            <div id="stats-container"></div>
            <div id="tests-container"></div>
            <div id="loading" class="loading">Loading test results...</div>
            <div id="error" class="error hidden"></div>
        </div>
    </body>

    <script id="env-test-data" type="application/json">
    <!-- INLINE_ENV_TEST_DATA_PLACEHOLDER -->
    </script>

    <script>
        let allTests = [];
        let currentFilter = 'all';
        let projectGroups = {};

        async function loadReport() {
            try {
                let data;
                
                // Check if data is inlined in the page
                const dataScript = document.getElementById('env-test-data');
                if (dataScript && dataScript.textContent.trim() && !dataScript.textContent.includes('INLINE_ENV_TEST_DATA_PLACEHOLDER')) {
                    try {
                        data = JSON.parse(dataScript.textContent);
                    } catch (e) {
                        console.warn('Failed to parse inlined data:', e);
                        data = await loadExternalData();
                    }
                } else {
                    data = await loadExternalData();
                }
                
                renderReport(data);
            } catch (error) {
                console.error('Error loading report:', error);
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('error').classList.remove('hidden');
                document.getElementById('error').innerHTML = \`
                    <strong>Failed to load test results:</strong><br>
                    \${error.message}
                \`;
            }
        }

        async function loadExternalData() {
            const response = await fetch('envTestResults.json');
            if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
            return await response.json();
        }

        function renderReport(data) {
            allTests = data.tests || [];
            groupTestsByProject();
            renderMeta(data);
            renderStats(data.stats);
            renderFilters();
            renderTestsByProject(allTests);
            document.getElementById('loading').classList.add('hidden');
        }

        function groupTestsByProject() {
            projectGroups = {};
            allTests.forEach(test => {
                const project = test.project || 'unknown';
                if (!projectGroups[project]) {
                    projectGroups[project] = [];
                }
                projectGroups[project].push(test);
            });
        }

        function getBrowserIcon(projectName) {
            const name = projectName.toLowerCase();
            if (name.includes('chromium') || name.includes('chrome')) return '🌐';
            if (name.includes('firefox')) return '🦊';
            if (name.includes('safari') || name.includes('webkit')) return '🧭';
            return '🖥️';
        }

        function getBrowserName(projectName) {
            const name = projectName.toLowerCase();
            if (name.includes('chromium')) return 'Chromium';
            if (name.includes('chrome')) return 'Chrome';
            if (name.includes('firefox')) return 'Firefox';
            if (name.includes('safari')) return 'Safari';
            if (name.includes('webkit')) return 'WebKit';
            return projectName;
        }

        function renderMeta(data) {
            const meta = document.getElementById('report-meta');
            const passRate = data.stats.total > 0 ? ((data.stats.passed / data.stats.total) * 100).toFixed(1) : 0;
            meta.innerHTML = \`
                <div>Start: \${new Date(data.startTime).toLocaleString()} | End: \${new Date(data.endTime).toLocaleString()}</div>
                <div>Pass Rate: \${passRate}% | Workers: \${data.config.workers} | Retries: \${data.config.retries}</div>
            \`;
        }

        function renderStats(stats) {
            const statsContainer = document.getElementById('stats-container');
            const statCards = [
                { label: 'Total', value: stats.total, class: '' },
                { label: 'Passed', value: stats.passed, class: 'passed' },
                { label: 'Failed', value: stats.failed, class: 'failed' },
                { label: 'Skipped', value: stats.skipped, class: 'skipped' },
                { label: 'Flaky', value: stats.flaky, class: 'flaky' },
                { label: 'Duration', value: \`\${(stats.duration / 1000).toFixed(2)}s\`, class: '' }
            ];
            statsContainer.innerHTML = '<div class="stats-grid">' +
                statCards.map(card => \`
                    <div class="stat-card \${card.class}">
                        <div class="stat-value">\${card.value}</div>
                        <div class="stat-label">\${card.label}</div>
                    </div>
                \`).join('') +
            '</div>';
        }

        function renderFilters() {
            const filterSection = document.getElementById('filter-section');
            const statuses = ['all', 'passed', 'failed', 'skipped', 'flaky'];
            filterSection.innerHTML = statuses.map(status => \`
                <button class="filter-btn \${status === 'all' ? 'active' : ''}" onclick="filterTests('\${status}')">
                    \${status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
            \`).join('');
        }

        function filterTests(status) {
            currentFilter = status;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            const filtered = status === 'all' ? allTests : allTests.filter(test => test.status === status);
            renderTestsByProject(filtered);
        }

        function toggleProject(projectName) {
            const content = document.getElementById(\`project-\${projectName}\`);
            const header = content.previousElementSibling;
            if (content.classList.contains('collapsed')) {
                content.classList.remove('collapsed');
                header.classList.remove('collapsed');
            } else {
                content.classList.add('collapsed');
                header.classList.add('collapsed');
            }
        }

        function formatJsonForDisplay(obj, indent = 0) {
            if (obj === null) return '<span class="json-null">null</span>';
            if (typeof obj === 'boolean') return \`<span class="json-boolean">\${obj}</span>\`;
            if (typeof obj === 'number') return \`<span class="json-number">\${obj}</span>\`;
            if (typeof obj === 'string') return \`<span class="json-string">"\${escapeHtml(obj)}"</span>\`;
            
            if (Array.isArray(obj)) {
                if (obj.length === 0) return '[]';
                const items = obj.map(item => {
                    const formatted = formatJsonForDisplay(item, indent + 1);
                    return formatted;
                }).join(', ');
                return \`[\${items}]\`;
            }
            
            if (typeof obj === 'object') {
                const keys = Object.keys(obj);
                if (keys.length === 0) return '{}';
                const items = keys.map(key => {
                    const value = formatJsonForDisplay(obj[key], indent + 1);
                    return \`<span class="json-key">"\${key}"</span>: \${value}\`;
                }).join(', ');
                return \`{ \${items} }\`;
            }
            
            return String(obj);
        }

        function renderTestsByProject(tests) {
            const testsContainer = document.getElementById('tests-container');
            if (tests.length === 0) {
                testsContainer.innerHTML = '<div class="no-tests">No tests found</div>';
                return;
            }

            // Group filtered tests by project
            const filteredGroups = {};
            tests.forEach(test => {
                const project = test.project || 'unknown';
                if (!filteredGroups[project]) {
                    filteredGroups[project] = [];
                }
                filteredGroups[project].push(test);
            });

            testsContainer.innerHTML = Object.keys(filteredGroups).sort().map(projectName => {
                const projectTests = filteredGroups[projectName];
                const passed = projectTests.filter(t => t.status === 'passed').length;
                const failed = projectTests.filter(t => t.status === 'failed').length;
                const flaky = projectTests.filter(t => t.status === 'flaky').length;
                
                return \`
                    <div class="project-group">
                        <div class="project-header" onclick="toggleProject('\${projectName}')">
                            <div class="project-header-title">
                                <span class="project-icon">\${getBrowserIcon(projectName)}</span>
                                <span>\${getBrowserName(projectName)}</span>
                            </div>
                            <div class="project-stats">
                                <div class="project-stat">
                                    <span style="color: #27ae60;">✓ \${passed}</span>
                                </div>
                                \${failed > 0 ? \`<div class="project-stat"><span style="color: #e74c3c;">✗ \${failed}</span></div>\` : ''}
                                \${flaky > 0 ? \`<div class="project-stat"><span style="color: #f39c12;">⚠ \${flaky}</span></div>\` : ''}
                                <span class="collapse-icon">▼</span>
                            </div>
                        </div>
                        <div id="project-\${projectName}" class="project-content">
                            \${projectTests.map(test => \`
                                <div class="test-suite">
                                    <div class="suite-header">
                                        <div class="suite-header-title">
                                            <span>\${escapeHtml(test.title)}</span>
                                            <span class="browser-badge">\${getBrowserName(test.project)}</span>
                                        </div>
                                        <span class="test-status status-\${test.status}">\${test.status.toUpperCase()}</span>
                                    </div>
                                    <div class="suite-content">
                                        <div class="test-item">
                                            <div class="test-info">
                                                <div class="test-details">
                                                    <div class="detail-row">
                                                        <span class="detail-label">File:</span>
                                                        <span class="detail-value">\${escapeHtml(test.file)}</span>
                                                    </div>
                                                    <div class="detail-row">
                                                        <span class="detail-label">Location:</span>
                                                        <span class="detail-value">Line \${test.line}, Column \${test.column}</span>
                                                    </div>
                                                    <div class="detail-row">
                                                        <span class="detail-label">Duration:</span>
                                                        <span class="detail-value">\${test.duration}ms</span>
                                                    </div>
                                                    <div class="detail-row">
                                                        <span class="detail-label">Retries:</span>
                                                        <span class="detail-value">\${test.retries}</span>
                                                    </div>
                                                    <div class="detail-row">
                                                        <span class="detail-label">Start Time:</span>
                                                        <span class="detail-value">\${new Date(test.startTime).toLocaleString()}</span>
                                                    </div>
                                                    \${test.attachments && test.attachments.length > 0 ? \`
                                                        <div class="attachments">
                                                            <div class="attachments-title">📎 Attachments (\${test.attachments.length})</div>
                                                            \${test.attachments.map(att => \`
                                                                <div class="attachment-item">
                                                                    <div class="attachment-name">\${escapeHtml(att.name)}</div>
                                                                    <div class="attachment-type">\${att.contentType}</div>
                                                                    \${att.body ? \`
                                                                        <div class="json-viewer">
                                                                            \${typeof att.body === 'string' ? escapeHtml(att.body) : JSON.stringify(att.body, null, 2).split('\\n').map(line => escapeHtml(line)).join('<br>')}
                                                                        </div>
                                                                    \` : ''}
                                                                </div>
                                                            \`).join('')}
                                                        </div>
                                                    \` : ''}
                                                    \${test.error ? \`
                                                        <div class="error-message">
                                                            <strong>Error:</strong> \${escapeHtml(test.error.message)}
                                                            \${test.error.stack ? \`<br><br>\${escapeHtml(test.error.stack)}\` : ''}
                                                        </div>
                                                    \` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            \`).join('')}
                        </div>
                    </div>
                \`;
            }).join('');
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        document.addEventListener('DOMContentLoaded', loadReport);
    </script>
</html>`;
    }

    private processSuite(suite: Suite, stats: JsonReport["stats"]): JsonSuiteResult[] {
        const results: JsonSuiteResult[] = [];

        for (const child of suite.suites) {
            const suiteResult: JsonSuiteResult = {
                title: child.title,
                file: child.location?.file,
                tests: [],
                suites: this.processSuite(child, stats)
            };

            for (const test of child.tests) {
                // Only include tests from PerformanceTests folder
                if (
                    !test.location.file.includes("PerformanceTests") &&
                    !test.location.file.includes("LongRunningTests")
                ) {
                    continue;
                }

                const testResults = this.results.get(test.id) || [];
                const lastResult = testResults[testResults.length - 1];

                if (lastResult) {
                    stats.total++;

                    const isFlaky =
                        testResults.length > 1 &&
                        testResults.some(r => r.status === "failed") &&
                        lastResult.status === "passed";

                    if (isFlaky) {
                        stats.flaky++;
                    } else if (lastResult.status === "passed") {
                        stats.passed++;
                    } else if (lastResult.status === "failed") {
                        stats.failed++;
                    } else if (lastResult.status === "skipped") {
                        stats.skipped++;
                    }

                    const jsonTest: JsonTestResult = {
                        title: test.title,
                        file: test.location.file,
                        line: test.location.line,
                        column: test.location.column,
                        status: isFlaky ? "flaky" : lastResult.status,
                        duration: lastResult.duration,
                        retries: testResults.length - 1,
                        startTime: lastResult.startTime.toISOString(),
                        attachments: lastResult.attachments.map(att => {
                            const attachment: any = {
                                name: att.name,
                                path: att.path,
                                contentType: att.contentType
                            };

                            // Include body content for JSON attachments
                            if (att.contentType === "application/json" && att.body) {
                                try {
                                    attachment.body = JSON.parse(att.body.toString());
                                } catch (e) {
                                    attachment.body = att.body.toString();
                                }
                            }

                            return attachment;
                        })
                    };

                    if (lastResult.error) {
                        jsonTest.error = {
                            message: lastResult.error.message || "",
                            stack: lastResult.error.stack
                        };
                    }

                    suiteResult.tests.push(jsonTest);
                }
            }

            // Only include suite if it has tests or nested suites with tests
            if (suiteResult.tests.length > 0 || suiteResult.suites.length > 0) {
                results.push(suiteResult);
            }
        }

        return results;
    }
}

export default JsonReporter;
