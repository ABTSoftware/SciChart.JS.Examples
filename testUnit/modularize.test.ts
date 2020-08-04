import { expect } from "chai";
import { sciChartInit2DTest } from "../../src";

describe("Sample Test", () => {
    it("One", done => {
        sciChartInit2DTest(webAssemblyContext => {
            const res = 0.5;
            expect(res).to.equal(0.5);
        }, done);
    });
});
