import { assert } from "chai";
import { computeReadouts } from "../smithChartMarkers";

const EPS = 1e-4;
const approx = (a: number, b: number) => Math.abs(a - b) < EPS;

describe("computeReadouts", () => {
    it("Γ=0 gives Z=1, VSWR=1, RL=Infinity, Q=0", () => {
        const r = computeReadouts({ re: 0, im: 0 });
        assert.ok(approx(r.gammaMag, 0));
        assert.ok(approx(r.zr, 1));
        assert.ok(approx(r.zx, 0));
        assert.ok(approx(r.vswr, 1));
        assert.equal(r.returnLoss, Infinity);
        assert.ok(approx(r.q, 0));
    });

    it("Γ=1∠180° (short circuit at left) gives Z=0", () => {
        const r = computeReadouts({ re: -1, im: 0 });
        assert.ok(approx(r.gammaMag, 1));
        assert.ok(approx(r.zr, 0));
        assert.ok(r.vswr > 1000 || !isFinite(r.vswr));
    });

    it("Γ=j gives Z=j (pure inductor)", () => {
        // Γ = (0+j1): Z = (1+j)/(1-j) = j
        const r = computeReadouts({ re: 0, im: 1 });
        assert.ok(approx(r.zr, 0), `zr should be 0, got ${r.zr}`);
        assert.ok(approx(r.zx, 1), `zx should be 1, got ${r.zx}`);
    });

    it("Γ=0.5∠0° gives VSWR=3", () => {
        const r = computeReadouts({ re: 0.5, im: 0 });
        assert.ok(approx(r.vswr, 3));
    });

    it("WTG + WTL = 0.5 always", () => {
        const points = [
            { re: 0.3, im: 0.4 },
            { re: -0.5, im: 0.3 },
            { re: 0, im: -0.7 },
        ];
        for (const p of points) {
            const r = computeReadouts(p);
            assert.ok(approx(r.wtg + r.wtl, 0.5), `WTG+WTL should be 0.5 for Γ=(${p.re},${p.im})`);
        }
    });
});
