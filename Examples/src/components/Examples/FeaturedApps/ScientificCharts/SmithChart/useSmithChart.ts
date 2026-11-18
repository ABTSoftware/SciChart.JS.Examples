import { useReducer } from "react";
import { smithReducer, initialSmithState } from "./smithState";
export * from "./smithState";

export function useSmithChart() {
    return useReducer(smithReducer, undefined, initialSmithState);
}
