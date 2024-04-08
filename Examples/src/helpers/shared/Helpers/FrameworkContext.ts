import { createContext } from "react";
import { EPageFramework } from "./frameworkParametrization";

export const FrameworkContext = createContext<EPageFramework>(EPageFramework.React);
