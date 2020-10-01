import { expect } from "chai";
import {TSciChart} from "scichart/types/TSciChart";
import {sciChartInit2DTest} from "scichart3d/sciChartInit2DTest";

describe("Sample Test", () => {
    it("One", done => {
        sciChartInit2DTest((webAssemblyContext: TSciChart) => {
            const res = 0.5;
            expect(res).to.equal(0.5);
        }, done);
    });
});
