import { assert } from "chai";
import { initialSmithState, smithReducer } from "../useSmithChart";

describe("smithReducer", () => {
    it("initial state has no markers", () => {
        const s = initialSmithState();
        assert.deepEqual(s.markers, []);
    });

    it("ADD_MARKER creates a labelled marker", () => {
        const s0 = initialSmithState();
        const s1 = smithReducer(s0, {
            type: "ADD_MARKER",
            gamma: { re: 0.3, im: 0.4 },
        });
        assert.equal(s1.markers.length, 1);
        assert.equal(s1.markers[0].label, "M1");
        assert.deepEqual(s1.markers[0].gamma, { re: 0.3, im: 0.4 });
        assert.equal(s1.activeMarkerId, s1.markers[0].id);
    });

    it("ADD_MARKER auto-increments label (M1, M2, M3)", () => {
        let s = initialSmithState();
        s = smithReducer(s, { type: "ADD_MARKER", gamma: { re: 0, im: 0 } });
        s = smithReducer(s, { type: "ADD_MARKER", gamma: { re: 0.5, im: 0 } });
        s = smithReducer(s, { type: "ADD_MARKER", gamma: { re: 0, im: 0.5 } });
        assert.equal(s.markers.map((m) => m.label).join(","), "M1,M2,M3");
    });

    it("MOVE_MARKER updates gamma and keeps id", () => {
        let s = initialSmithState();
        s = smithReducer(s, { type: "ADD_MARKER", gamma: { re: 0.3, im: 0 } });
        const id = s.markers[0].id;
        s = smithReducer(s, {
            type: "MOVE_MARKER",
            id,
            gamma: { re: 0.5, im: 0.2 },
        });
        assert.deepEqual(s.markers[0].gamma, { re: 0.5, im: 0.2 });
        assert.equal(s.markers[0].id, id);
    });

    it("REMOVE_MARKER removes by id", () => {
        let s = initialSmithState();
        s = smithReducer(s, { type: "ADD_MARKER", gamma: { re: 0.3, im: 0 } });
        const id = s.markers[0].id;
        s = smithReducer(s, { type: "REMOVE_MARKER", id });
        assert.equal(s.markers.length, 0);
    });

    it("SET_VSWR updates vswr value", () => {
        let s = initialSmithState();
        s = smithReducer(s, { type: "SET_VSWR", vswr: 2.5 });
        assert.equal(s.vswr, 2.5);
    });
});
