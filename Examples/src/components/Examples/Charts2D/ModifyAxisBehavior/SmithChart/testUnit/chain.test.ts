import { assert } from "chai";
import { computeChainStep } from "../smithChartChain";

const EPS = 1e-4;
const approx = (a: number, b: number) => Math.abs(a - b) < EPS;
const Z0 = 50;

describe("computeChainStep", () => {
    it("series L at Z=1+j0 (Γ=0) moves up constant-R=1 circle", () => {
        const step = computeChainStep({ re: 0, im: 0 }, "seriesL", 50 / (2 * Math.PI * 1e9), 1e9, Z0);
        const zr_new = 1,
            zx_new = 1;
        const denom = (1 + zr_new) ** 2 + zx_new ** 2;
        const expected_re = (zr_new ** 2 + zx_new ** 2 - 1) / denom;
        const expected_im = (2 * zx_new) / denom;
        assert.ok(approx(step.toGamma.re, expected_re), `re: ${step.toGamma.re} vs ${expected_re}`);
        assert.ok(approx(step.toGamma.im, expected_im), `im: ${step.toGamma.im} vs ${expected_im}`);
        assert.ok(step.arcPoints.length >= 10, "should have arc points");
    });

    it("TL section: |Γ| is preserved, angle decreases by π for 0.25λ", () => {
        const gamma0 = { re: 0.5, im: 0 };
        const step = computeChainStep(gamma0, "TL", 0.25, 1e9, Z0);
        const mag0 = Math.sqrt(gamma0.re ** 2 + gamma0.im ** 2);
        const mag1 = Math.sqrt(step.toGamma.re ** 2 + step.toGamma.im ** 2);
        assert.ok(approx(mag0, mag1), `|Γ| should be preserved: ${mag0} vs ${mag1}`);
        assert.ok(approx(step.toGamma.re, -0.5), `re should be -0.5, got ${step.toGamma.re}`);
        assert.ok(approx(step.toGamma.im, 0), `im should be 0, got ${step.toGamma.im}`);
    });

    it("series C at Z=1+j0 moves to negative imaginary", () => {
        const step = computeChainStep({ re: 0, im: 0 }, "seriesC", 1 / (2 * Math.PI * 1e9 * 50), 1e9, Z0);
        assert.ok(step.toGamma.im < 0, "series C should move to negative imaginary");
    });
});
