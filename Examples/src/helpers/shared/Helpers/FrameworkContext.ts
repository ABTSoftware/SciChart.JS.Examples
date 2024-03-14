import { createContext } from "react";
import { EPageFramework } from "../../../components/AppRouter/pages";

export const FrameworkContext = createContext<EPageFramework>(EPageFramework.React);
