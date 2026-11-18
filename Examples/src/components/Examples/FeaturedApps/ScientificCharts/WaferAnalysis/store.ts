import { useStore } from "zustand";
import dataStore from "./dataStore";
export * from "./dataStore";

const useDataStore = Object.assign(() => useStore(dataStore), dataStore);
export default useDataStore;
