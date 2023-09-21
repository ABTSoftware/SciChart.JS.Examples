import { createContext } from 'react';
import { ISciChartSurfaceBase, SciChartSurface } from 'scichart';

export const SurfaceContext = createContext<ISciChartSurfaceBase>(null);