# Portfolio Dossier: Vital Signs / Biofeedback Monitor (SciChart.js + ESP32 + Firebase)

Source: git history, code and docs in this repo, plus the maintenance work done in a Claude Code session on 2026-10-26.
Every number below is tagged **[verified]** (reproducible from git or the files), **[claimed in repo docs]** (stated in `paper.md` or a README, with no raw evidence here), or **[session]** (done with Claude Code on 2026-10-26).
Section 11 lists what to check before putting any of this on a résumé.

---

## 1. One-paragraph summary

Built an end-to-end, research-oriented biofeedback platform: wearable ESP32 firmware (ECG via AD8232, galvanic skin response, MPU6050 IMU respiration) that streams JSON over WebSockets to a React/TypeScript dashboard.
The dashboard renders high-rate multi-axis charts with SciChart.js and runs real-time signal processing in the browser: HRV (time, frequency and non-linear), respiration state machine, GSR trend analysis and ECG quality scoring.
It logs enriched telemetry to Firebase Realtime Database and records 20-minute tri-phase sessions with automated artifact rejection and per-phase statistical reports.
The work lives as a "Featured App" inside a fork of SciChart's public demo gallery (`ABTSoftware/SciChart.JS.Examples`). A research manuscript (`paper.md`) documents the methodology and a validation study.

## 2. Ownership and attribution (what is yours)

| Item | Evidence | Status |
|---|---|---|
| Git identity | `buddywhitman <pulkitindia5@gmail.com>` | [verified] |
| 4 hand-written commits on `feature/vital-signs-monitor` | `0b8a4e518` (2025-08-23, "Complete Vital Signs Monitor System with ESP32 Integration"), `2b2b36c69` (08-28), `88f713918` (08-29), `5e8a1f1a5` (08-30) | [verified] |
| 309 Cursor IDE auto-checkpoint commits, all on 2025-07-24 | Roughly 13:10 to 19:31 IST, authored under your identity by Cursor | [verified]. These are **AI-assisted** (Cursor); describe the workflow honestly. |
| Feature commit size | `0b8a4e518`: 24 files, +11,988 / −300 lines | [verified] |
| Everything under `Examples/` outside the Vital Signs folder, `esp32/` and the docs | Authored by SciChart staff and others (Andy Burnett-Thompson, Jim Risen, William Pearson, Igor Cuckovic, Michael Klishevich, "SciChart DevTeam", and more) | **Not yours.** Do not claim the gallery shell. |
| `esp32/srividya-summer-research.ino` | An untracked copy of `main.ino` (same size) named after another person | Indicates a collaborator or advisor ("Srividya"). Confirm their role before listing it. |

Do not claim the repo-wide `git diff origin/master` figure (about 999 files, 93k deletions). It is dominated by merge and cleanup of upstream content, not by you.

## 3. Timeline

- **2025-07-24**: Intensive prototyping session in Cursor. 309 checkpoints touching mostly `drawExample.ts`, `index.tsx` and `signalProcessor.ts`. Webpack dev config (`webpack.client.no_server.config.ts`), `start-dev.ps1` / `.bat` and `AppRouter/examples.ts` registration also changed.
- **2025-08-23**: Consolidated "Complete Vital Signs Monitor System with ESP32 Integration" (+11,988 lines).
- **2025-08-28 to 08-30**: Fixes for logging values, unused files and the respiratory-rate calculation.
- **2026-10-26** [session]: Dependency repair, ESP32 discovery repair, security audit, `CLAUDE.md`, this dossier.

## 4. System architecture

```
 SENSORS (edge)                    FIRMWARE (ESP32, C++)                 BROWSER (React + TS)                       CLOUD
 AD8232 ECG  ── GPIO36 ─┐          main.ino                              ESP32WebSocketHandler (signalProcessor.ts)  Firebase Realtime DB
 GSR 2-electrode GPIO39 ├─ ADC ──► 250 Hz ECG (Pan-Tompkins.h)  ─ JSON ─► ├─ ECGSignalProcessor  (ecgProcessor.ts)   ──► processed_sensor_logs
 MPU6050 IMU I2C ───────┘          10 Hz GSR                    over WS   ├─ RespirationSignalProcessor               logs_summary
                                   50-100 Hz IMU, breath FSM     port 81   ├─ GSRTrendAnalyzer                         events / errors
                                   15-breath rolling RR                    ├─ SessionRecorder (20-min, 3 phases)
                                                                           ├─ FirebaseLogger (30 s interval)
                                                                           └─ drawExample.ts → SciChart.js surfaces
```

**Tiers (as documented in the paper):** an edge tier that acquires and runs lightweight DSP, a middleware tier in the browser that does heavy HRV/respiration analytics and visualization, and a cloud tier for persistence.
The ESP32 is deliberately kept off the cloud path. It only serves a WebSocket, so the constrained device is decoupled from Firebase auth, TLS and retries.

### Code map (line counts [verified])

| File | Lines | Role |
|---|---|---|
| `index.tsx` | 4,163 | React dashboard UI, state, metric panels, session controls |
| `sessionRecorder.ts` | 1,039 | 20-min session capture, outlier filtering, per-phase stats, report generation (`VitalSignsData`, `PhaseStatistics`, `SessionReport`) |
| `signalProcessor.ts` | 969 | Respiration processor and `ESP32WebSocketHandler` (WS lifecycle, message routing, reconnect) |
| `ecgProcessor.ts` | 883 | HRV suite, ECG quality scoring, age/gender health ranges |
| `drawExample.ts` | 657 | SciChartSurface config: multiple Y axes, FIFO sweeping series, connection-status events |
| `firebaseLogger.ts` | 422 | Typed `ProcessedSensorData`, connection test, error classification |
| `debugLogger.ts` | 385 | Singleton leveled logger with timers (`startTimer`/`endTimer`) |
| `gsrTrendAnalyzer.ts` | 312 | Smoothing plus sliding-window derivative trend detection |
| TS/TSX subtotal | **8,830** | |
| `esp32/main.ino` | 866 | Production firmware: WS server :81, sampling, breath FSM |
| `esp32/PanTompkins.h` | 172 | Real-time QRS detector |
| `esp32/mpu6050.ino`, `test_websocket.ino` | 130 / 538 | Sensor bring-up and WS test harness |
| `src/config/environment.ts` | 140 | Env loader/validator for Firebase config |
| Docs (`paper.md`, READMEs, guides) | about 2,400 lines | Methodology paper, Firebase setup/troubleshooting, data dictionary, integration guide |

## 5. Technical decisions and rationale

1. **WebSocket from device to browser, not device to cloud.** Gives low-latency live charts, no cloud credentials on the MCU, and a thin firmware. Trade-off: the browser must be on the same LAN, which caused the IP-discovery problem (see Problems, #3).
2. **Heavy analytics in the browser (TypeScript), light DSP on the MCU.**
   - On-device: Pan-Tompkins QRS detection and breath FSM.
   - In-browser: HRV with 30+ metrics, respiratory dynamics, quality scoring.
   - Raw GSR is passed through unfiltered to preserve data for offline analysis.
3. **SciChart.js for rendering.** WebGL/WASM charting for streaming ECG with multiple Y axes and FIFO series. Fits the 250 Hz stream better than DOM or SVG charting.
4. **Firebase Realtime Database.** Real-time sync, schema-on-read JSON (new metrics need no migration), offline cache. A 30 s logging interval balances temporal resolution against storage cost. Provenance fields (`dataSource`, `logSequence`, `connectionStatus`) make real-sensor data separable from fallback data.
5. **"No fallback values" policy.** UI shows zeros when the ESP32 is disconnected, so simulated data can never contaminate recordings (documented in `index.tsx` header). The connection state is derived from actual data receipt (10 s data-timeout), not merely socket-open.
6. **Respiration via a gyro-Y finite state machine.** Idle / Inhaling / Exhaling with thresholds of ±0.05 rad/s (and 0.01 rad/s for the tail). Breaths are validated at 0.5 to 15 s. RR comes from a 15-breath circular buffer. [claimed in paper, consistent with `BREATH_HISTORY_SIZE 15` in `main.ino`]
7. **Tri-phase 20-minute protocol.** Baseline 25%, intervention 50%, recovery 25%. This gives within-subject controls and per-phase min/max/mean/SD.

## 6. Problems and solutions

| # | Problem | Root cause | Solution | Status |
|---|---|---|---|---|
| 1 | `npm i` failed with ERESOLVE | `@angular/*` at `^16.2.12` conflicted with `@angular/material@^18` peers. The only consumer, `angular.ts`, was dead code. | Deleted `angular.ts` and removed six unused packages (`@angular/{animations,common,core,forms,material}`, `scichart-angular`). | [session] |
| 2 | Second ERESOLVE | `@mui/lab@^6.0.0-beta.22` resolved to a stale `6.0.0-dev.2404…` prerelease (semver sorts `dev` above `beta`) with React 17/18-only peers, conflicting with React 19. | Pinned `^6.0.1-beta.36` (peers `^17 \|\| ^18 \|\| ^19`). | [session] |
| 3 | ESP32 never found on a new network | `detectESP32IP()` had been reduced over many iterations to one hardcoded IP (`10.56.157.144:81`). `tryNextIP()` was dead code, so it retried the dead host forever. The firmware uses DHCP. | Restored a candidate list (`10.56.157.144`, `192.168.{1,0,84,43}.171`, port 81). Added rotate-on-no-data and remembered last-good IP in `localStorage`. Connect timeout cut from 10 s to 4 s. Mirrored in the compiled `.js`. | [session] |
| 4 | Simulated data could pollute research recordings | Fallback generators mixed with live streams | Removed fallbacks, added `dataSource` provenance tagging, and gated Firebase logging on actual ESP32 data. | [verified in code] |
| 5 | Wrong or unstable respiratory rate | Instantaneous rate noisy | Moved to a rolling 15-breath window computed on the ESP32 and passed through (commit "fix: respiratory rate"). | [verified commit] |
| 6 | "Connected" shown when socket opened but no data flowed | `onopen` is not data | `trackDataReception()` with a 10 s timeout drives connected/disconnected. | [verified in code] |
| 7 | Stale logging values | commit "fix: logging values" | Fixed values written to Firebase logs. | [verified commit] |
| 8 | Credentials committed to a public fork | `.env` files tracked, no `.gitignore` rule | Added `**/.env`, `**/.env.*` and ran `git rm --cached` on both `.env` files (uncommitted). | [session] |

## 7. Frameworks, tools and integrations

- **Languages:** TypeScript/TSX, JavaScript, C++ (Arduino/ESP32), Python (analysis, Firebase setup, calibration scripts), PowerShell/Batch (dev launch), Markdown.
- **Frontend:** React 19, MUI 6, SciChart.js 3.5 + `scichart-react`, Webpack 5, ts-loader, Sass.
- **Backend/infra:** Express (gallery server), Firebase Realtime Database (`firebase@10`), WebSocket (ESP32 `WebSocketsServer`, browser `WebSocket`).
- **Hardware:** ESP32, AD8232 ECG front-end (Ag/AgCl electrodes), GSR electrode pair, MPU6050 IMU (I2C, DLPF 21 Hz, ±250°/s).
- **Signal processing:** Pan-Tompkins (bandpass, derivative, squaring, moving-window integration, adaptive dual threshold). HRV SDNN/RMSSD/pNN50/NN50, LF/HF/VLF, ApEn/SampEn/DFA, Poincaré SD1/SD2. 40 to 200 BPM plausibility gating.
- **Tooling:** Cursor IDE (AI pair-programming), Claude Code, Git (fork workflow, `origin`=ABTSoftware, `fork`=buddywhitman), Husky, Prettier, ts-node, Mocha (configured, no tests present).
- **Data/analysis:** pandas/matplotlib/seaborn (`scripts/analyze_data.py`), calibration analyzer (`esp32/calibration_analyzer.py`), sensor calibration sketch.

## 8. Quality, performance and metrics

Verified:
- 8,830 lines of TS/TSX and about 1,700 lines of device C++/Arduino in the feature.
- Sampling architecture: ECG 250 Hz (4 ms), GSR 10 Hz, respiration 50 to 100 Hz (see inconsistency in §11). Firebase logging every 30 s. Data-timeout 10 s. Reconnect cap of 20 attempts with up to 5 s backoff. `millis()` overflow handling in firmware.
- 12-bit ADC (0-4095) range handling. ECG plotted in raw ADC (800 to 3500) and converted to ±2.5 mV for peak detection.
- Observability: leveled logger (debug to critical) with timers around WS connect and message processing. Firebase error classification (`PERMISSION_DENIED`, `UNAVAILABLE`, `QUOTA_EXCEEDED`).
- Documentation: Firebase frontend guide, troubleshooting guides, environment setup, integration guide, data dictionary, and a 319-line manuscript.

Claimed in `paper.md` (provenance not in repo, do not cite as your results until confirmed, see §11):

| Signal | Reference | Result |
|---|---|---|
| Respiration rate | piezoelectric belt via PowerLab, 100 Hz | bias −0.15 BPM, LoA −1.78 to +1.48, MAE 0.62, RMSE 0.83 |
| I/E ratio | same | bias +0.04, LoA −0.21 to +0.29, MAE 0.09, RMSE 0.12 |
| QRS detection | CardioSim ECG simulator (60-150 BPM, 5 min each) | Se 99.4%, +P 99.1%, F1 99.2% |
| Heart rate | CardioSim | ρc 0.996, bias +0.18 BPM, LoA −1.45 to +1.81, MAE 0.52, MAPE < 0.6%, ICC 0.99 |
| HRV | CardioSim | SDNN ρc 0.98, RMSSD 0.95, LF/HF 0.91 |
| SDNN | Apple Watch Series 9 | ρc 0.93 |
| GSR | BIOPAC MP160 / EDA100C, 3×5 min protocol | Pearson 0.94, ρc 0.92 (CI 0.89 to 0.95), ICC 0.91 (CI 0.87 to 0.94) |

## 9. Security and operational findings (issues you owned and should be able to discuss)

- **Firebase web config committed.** `Examples/.env` and the Vital Signs `.env` were tracked and pushed to `fork/feature/vital-signs-monitor` (project `biofeedback-a3a9d`). This is a public GitHub fork. The paper states that development rules are open.
- **WiFi SSID and password in plaintext** in a previously tracked `esp32/.env` (still in git history; the working-tree deletion is staged). Treat as compromised.
- **Containment done:** `.gitignore` updated and both `.env` files untracked locally (uncommitted). The exposed values remain in git history.
- **Build health:** `index.tsx` currently has TS parse errors (around lines 3196-3198, 3314, 4158-4161), `exampleInfo.ts` is empty, and stray `index.tsx.backup`/`.temp` files exist. `npm audit` reports 90 advisories (5 critical).
- This is good interview material if framed as lessons learned: secrets hygiene, least-privilege DB rules, and semver prerelease traps.

## 10. Résumé-ready material

### Project entry (safe, verifiable phrasing)

**Vital Signs & Biofeedback Monitor** | TypeScript, React, SciChart.js, ESP32 (C++), WebSockets, Firebase | Aug 2025
- Built a full-stack IoT biofeedback system: ESP32 firmware (ECG/AD8232, GSR, MPU6050) streaming 250 Hz ECG and multi-sensor JSON over WebSockets to a React/TypeScript dashboard (~8.8k LOC) with real-time SciChart.js multi-axis charts.
- Implemented real-time signal processing: Pan-Tompkins QRS detection, 30+ HRV metrics (time/frequency/non-linear), gyro-based respiration state machine with rolling 15-breath rate, GSR trend analysis and ECG quality scoring.
- Designed a 20-minute tri-phase session recorder with artifact rejection and per-phase statistical reporting, and a Firebase Realtime Database logging pipeline with data-provenance tagging and connection diagnostics.
- Enforced a data-integrity policy (no simulated fallbacks in recordings, data-receipt-based connection state) and built resilient device discovery (candidate-IP rotation, last-known-good persistence, 4 s probe timeout).
- Diagnosed and fixed npm peer-dependency failures (removed dead Angular tree; corrected a semver prerelease trap on `@mui/lab`) and audited the repo for secret exposure.
- Authored methodology documentation and a manuscript draft covering sensing, signal processing, cloud architecture and a validation design.

Use "co-developed with AI pair-programming tools (Cursor, Claude Code)" in interviews. Hiding it reads worse than owning it.

### Claims in the repo's docs that need independent confirmation before use (see §11)
- "Validated against laboratory references (CardioSim, BIOPAC MP160, piezoelectric belt): HR ρc 0.996, QRS F1 99.2%, RR MAE 0.62 BPM."
- "Ran a 30-participant study."
- "Co-authored a manuscript." (State the real venue/status and authorship.)

### Skills and ATS keywords
TypeScript, React, WebSockets, real-time data visualization, SciChart.js, WebGL charting, ESP32, Arduino/C++, embedded systems, IoT, DSP, Pan-Tompkins, ECG, HRV, biosignal processing, GSR/EDA, IMU, Firebase Realtime Database, Webpack, REST/telemetry pipelines, Python (pandas, matplotlib), technical writing, Bland-Altman/agreement analysis, dependency management, security hygiene, Git fork workflow, AI-assisted development.

### STAR stories (interview-ready)
1. **Silent single point of failure.** Situation: the dashboard could never find the ESP32 on a new network. Task: restore discovery. Action: traced that rotation logic had been dead code and the IP hardcoded, restored a bounded candidate list, added last-known-good persistence and a 4 s timeout. Result: automatic reconnection across the common home/hotspot subnets. Chose not to sweep /24 from the browser (cost/latency), noting mDNS as the upgrade path.
2. **Data integrity over convenience.** Removed fallback/simulated values and derived connection status from data receipt, so research logs can't be contaminated.
3. **Build rescue.** Two independent ERESOLVE causes, found by reading peer metadata rather than `--legacy-peer-deps`.
4. **Security self-audit.** Found tracked credentials and a plaintext WiFi password in a public fork. Contained going forward, and defined rotation plus history-scrub steps.

## 11. Verify before publishing any claim (honest limits)

1. **The datasets look synthetic.** `data/*.csv` and `vital_signs_*.csv` are described as "generated", "simulated" and "realistic and medically plausible" in `VITAL_SIGNS_DATA_DOCUMENTATION.md` and the demo README. The README cites **ClinicalTrials.gov NCT00000000, a placeholder ID**, yet frames the data as "de-identified clinical datasets derived from the trial". Do not present them as real participant or trial data unless a real protocol, ethics approval and raw recordings exist.
2. **Validation results in `paper.md` have no supporting raw data or code in the repo** (no LabVIEW logs, BIOPAC exports or Bland-Altman scripts). Participant counts are not stated in the paper text. Confirm these studies were really run, and by whom, before quoting numbers.
3. **Internal inconsistencies to fix:** respiration sampling is 50 Hz in the paper but 100 Hz in `INTEGRATION_GUIDE.md` and `trial_protocol_metadata.csv`. Figure 5 is captioned as cortisol-measured stress, but the GSR protocol never mentions cortisol. The paper says "proprietary algorithm" while the README presents the stack as open example code.
4. **Cursor checkpoints are not 309 meaningful commits.** Count them as one prototyping session on 2025-07-24, not as commit volume.
5. **The `README_*`/guide docs were largely AI-generated** (style and emoji headers). Quote them as documentation produced, not as research contributions.
6. **No automated tests exist** (`testUnit/` missing). Don't claim test coverage.
7. **Medical disclaimer:** this is a research/educational prototype, not a validated medical device.
8. **Unmeasured things I could not find in the repo:** user counts, latency benchmarks, FPS, or deployment URLs. Don't invent them. If you want real performance numbers, run Chrome DevTools profiling of the dashboard at 250 Hz and record frame time and WS message rate.

## 12. Tailoring guide: which parts of the existing work to emphasize per role

Each lens below uses only work that exists in the repo. Pick the lens, lift the matching bullets, drop the rest.

| Target role / industry | Lead with | Supporting evidence (existing) | Keywords |
|---|---|---|---|
| Frontend / data-visualization engineer | Real-time multi-axis SciChart.js dashboard handling a 250 Hz stream; React 19 + TypeScript UI of ~4.2k lines | `index.tsx`, `drawExample.ts`, FIFO sweeping series, connection-status events | React, TypeScript, WebGL charting, real-time UI, MUI |
| Full-stack / IoT platform engineer | Device → WebSocket → browser → Firebase pipeline with typed schema, provenance tagging, connection diagnostics | `signalProcessor.ts`, `firebaseLogger.ts`, `environment.ts`, ESP32 `WebSocketsServer` | WebSocket, Firebase RTDB, telemetry, schema design |
| Embedded / firmware engineer | ESP32 firmware: 250 Hz ADC sampling, I2C IMU (DLPF 21 Hz, ±250°/s), on-device Pan-Tompkins, breath FSM, `millis()` overflow handling | `main.ino` (866 lines), `PanTompkins.h`, `mpu6050.ino`, `test_websocket.ino` | C++, Arduino/ESP32, ADC, I2C, real-time sampling |
| DSP / biomedical signal processing | QRS detection, 30+ HRV metrics (time, frequency, non-linear), respiratory state machine, GSR trend analysis, ECG quality scoring | `PanTompkins.h`, `ecgProcessor.ts`, `signalProcessor.ts`, `gsrTrendAnalyzer.ts` | Pan-Tompkins, HRV, EDA, filtering, artifact rejection |
| Health-tech / digital health / wellness | Multi-sensor physiological monitoring with a 3-phase 20-minute biofeedback session design and per-phase reporting | `sessionRecorder.ts`, `trial_protocol_metadata.csv`, `paper.md` | biofeedback, vital signs, remote monitoring, HRV |
| Data / analytics engineer | Structured physiological time-series schema, Python analysis and visualization scripts, data dictionary | `firebaseLogger.ts` (`ProcessedSensorData`), `scripts/analyze_data.py`, `VITAL_SIGNS_DATA_DOCUMENTATION.md` | pandas, time-series, data modeling |
| Research / lab / academic | Methodology write-up with sensing, DSP and cloud architecture; agreement-statistics design (Bland-Altman, ρc, ICC) | `paper.md` (read §11 caveats first) | method comparison, biosignals, technical writing |
| DevOps / build & tooling | Diagnosed two independent npm peer-dependency failures; dev launch scripts; env-config loader | `package.json`, `start-dev.ps1`, `environment.ts` | Webpack, npm, dependency resolution |
| Security-aware engineering | Found and contained committed credentials; `.gitignore` hardening | §9 | secrets management, repo hygiene |
| AI-assisted development | Built with Cursor and Claude Code, with documented workflow | §2 | AI pair-programming, LLM tooling |

### Phrasing notes for different markets and formats
- **One-page résumé (US/Canada):** use the 5 to 6 bullets in §10, past tense, verb-first, include the stack in the header line, and drop the dates' day.
- **CV (UK/EU/India/academic):** use the same content with a short project description paragraph, add the supervisor or collaborator line only if true, and include the repo link.
- **Date convention:** Jul to Aug 2025 for the build, with a follow-up maintenance pass on 2026-10-26.
- **Units and terms:** write "BPM" and "µS" as in the repo; "GSR" and "EDA" are interchangeable, use whichever the target posting uses.
- **Employer-type framing:** startups, emphasize end-to-end ownership and shipping speed; large companies, emphasize architecture, data integrity and documentation; hardware/medical firms, emphasize the sensing chain and signal quality handling; research groups, emphasize methodology and §11 honesty.

## 13. Proof points available per claim (existing artifacts only)

| Claim | Where it lives | Strength |
|---|---|---|
| Multi-sensor firmware | `esp32/main.ino`, `PanTompkins.h`, `mpu6050.ino` | Code |
| Real-time dashboard | `index.tsx`, `drawExample.ts` | Code |
| HRV and respiration algorithms | `ecgProcessor.ts`, `signalProcessor.ts`, `gsrTrendAnalyzer.ts` | Code |
| Cloud logging design | `firebaseLogger.ts`, Firebase READMEs, paper cloud section | Code + docs |
| Session protocol and reporting | `sessionRecorder.ts`, `trial_protocol_metadata.csv` | Code + data file |
| Validation accuracy figures | `paper.md` tables | Documentation only, no raw data in repo |
| Participant dataset | `data/*.csv` | Synthetic data, see §11 |
| Authorship and timeline | git log (4 commits plus 309 Cursor checkpoints) | Git history |

## 14. Skills demonstrated

| Skill | Evidence |
|---|---|
| Embedded firmware (ESP32, I2C, ADC, timing) | `main.ino`, `mpu6050.ino` |
| Biosignal DSP (QRS detection, HRV, EDA) | `PanTompkins.h`, `ecgProcessor.ts` |
| Real-time visualization | SciChart.js dashboard |
| Experimental protocol design | Tri-phase protocol, `paper.md` |
| Method-comparison statistics (described) | Bland-Altman, ρc, ICC in `paper.md` |
| Data modeling and cloud logging | Firebase schema, provenance fields |
| Dependency and build troubleshooting | §6 rows 1 and 2 |
| Security auditing | §9 |
| Technical writing | `paper.md` (319 lines), READMEs, integration and data guides |

## 15. Authorship and AI-assistance statement (accurate as of this repo)

Firmware, signal-processing and dashboard code were developed with AI-assisted tooling (Cursor, Claude Code) for generation, refactoring and documentation. Git records 4 hand-written commits plus 309 Cursor auto-checkpoint commits under the author's identity. Add any collaborator or advisor name only if their role is confirmed.
