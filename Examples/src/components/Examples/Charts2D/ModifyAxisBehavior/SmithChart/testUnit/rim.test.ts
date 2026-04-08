import { assert } from "chai";
import { getRimLabelOffset } from "../smithChartRim";

describe("getRimLabelOffset", () => {
    it("0° (right): dx >= 0, dy ≈ -h/2 (centred vertically)", () => {
        const o = getRimLabelOffset(0, 40, 16);
        assert.ok(o.dx >= 0);
        assert.ok(Math.abs(o.dy + 8) < 3, `dy should be ~-8, got ${o.dy}`);
    });
    it("90° (top): dx ≈ -w/2, dy < 0 (above)", () => {
        const o = getRimLabelOffset(90, 40, 16);
        assert.ok(Math.abs(o.dx + 20) < 4, `dx should be ~-20, got ${o.dx}`);
        assert.ok(o.dy < 0);
    });
    it("180° (left): dx < 0, dy ≈ -h/2", () => {
        const o = getRimLabelOffset(180, 40, 16);
        assert.ok(o.dx < 0);
        assert.ok(Math.abs(o.dy + 8) < 3);
    });
    it("270° (bottom): dx ≈ -w/2, dy >= 0 (below)", () => {
        const o = getRimLabelOffset(270, 40, 16);
        assert.ok(Math.abs(o.dx + 20) < 4);
        assert.ok(o.dy >= 0);
    });
    it("45°: dx >= 0, dy < 0 (upper right quadrant)", () => {
        const o = getRimLabelOffset(45, 40, 16);
        assert.ok(o.dx >= 0);
        assert.ok(o.dy < 0);
    });
});
