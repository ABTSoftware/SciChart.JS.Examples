import * as React from 'react'
import { createContext } from 'react';
import { ISciChartSurfaceBase } from 'scichart';
import { IInitResult } from './SciChart';

export const SurfaceContext = createContext<IInitResult<ISciChartSurfaceBase>>(null);
