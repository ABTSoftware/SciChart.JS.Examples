/**
 * Progress estimation for the 3D model download.
 *
 * The model arrives inside an asset package that the native engine fetches itself
 * (`SCRTCADModelSceneEntity` takes a package name, and exposes no progress or completion
 * callback), so the real byte count is not observable from JavaScript. This estimates
 * progress from elapsed time instead, purely to give the wait a shape.
 *
 * The curve is `1 - e^(-t/TIME_CONSTANT_MS)`: quick at first, then flattening. It is
 * capped below 1 by {@link MAX_ESTIMATED} and only the real load event completes it.
 * That matters — a synthetic bar that reaches 100% while the user is still waiting is
 * worse than no bar at all. Fast connections finish early and snap; slow ones drift
 * toward the cap and hold there.
 */

/** Sets how fast the curve flattens. At t = this, progress is ~63%. */
const TIME_CONSTANT_MS = 7_000;

/** Ceiling for the estimate. The remaining 10% belongs to the actual load event. */
const MAX_ESTIMATED = 0.9;

/**
 * Estimated download progress as a fraction in [0, {@link MAX_ESTIMATED}].
 *
 * @param elapsedMs — time since the download started. Negative values are treated as 0.
 */
export function estimateModelProgress(elapsedMs: number): number {
    if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) {
        return 0;
    }

    return MAX_ESTIMATED * (1 - Math.exp(-elapsedMs / TIME_CONSTANT_MS));
}

/** Formats a fraction in [0, 1] as a whole-number percentage for display. */
export function formatProgressPercent(progress: number): string {
    return `${Math.round(Math.min(Math.max(progress, 0), 1) * 100)}%`;
}
