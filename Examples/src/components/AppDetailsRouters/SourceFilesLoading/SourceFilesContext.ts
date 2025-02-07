import { createContext } from "react";
import { SourceFilesVariant } from "../../../helpers/types/types";
import { EPageFramework } from "../../../helpers/shared/Helpers/frameworkParametrization";

export const defaultSourceFilesVariant: SourceFilesVariant = {
    framework: EPageFramework.React,
    files: [{ name: "drawExample.ts", content: "// Loading ... " }],
};
export const SourceFilesContext = createContext<SourceFilesVariant>(defaultSourceFilesVariant);
