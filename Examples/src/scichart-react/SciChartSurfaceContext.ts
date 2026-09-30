"use client";

import { createContext } from "react";
import { ISciChartSurfaceBase } from "scichart";
import { IInitResult } from "./types";

/**
 * React Context provided within {@link SciChartReact}
 * Stores the chart initialization result.
 */
export const SciChartSurfaceContext = createContext<IInitResult<ISciChartSurfaceBase> | null>(null);
