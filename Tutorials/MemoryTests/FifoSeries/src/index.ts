import {
  EAutoRange,
  EPerformanceMarkType,
  FastLineRenderableSeries,
  MemoryUsageHelper,
  NumberRange,
  NumericAxis,
  PerformanceDebugHelper,
  SciChart3DSurface,
  SciChartDefaults,
  SciChartJsNavyTheme,
  SciChartSurface,
  SciChartSurfaceBase,
  XyDataSeries,
} from "scichart";

console.log("window.gc support =", !!window.gc);

SciChartSurfaceBase.DEFAULT_THEME = new SciChartJsNavyTheme();

if (process.env.NODE_ENV !== "production") {
  MemoryUsageHelper.isMemoryUsageDebugEnabled = true;
}
PerformanceDebugHelper.enableDebug = true;
SciChartSurface.autoDisposeWasmContext = true;
SciChart3DSurface.autoDisposeWasmContext = true;
SciChartDefaults.useNativeText = true;

let shouldUseCreateSingle = true;
let updateInterval = 8;
let dataSeriesCapacity = 200_000;
let dataChunkSize = 100_000;

const logMemory = () => {
  window.gc && window.gc();

  MemoryUsageHelper.objectRegistry?.log();
};

const logPerformance = () => {
  const allPerformanceMarks = performance.getEntriesByType(
    "mark"
  ) as PerformanceMark[];

  const getMeasures = () => {
    const endMarks = allPerformanceMarks.filter((mark) =>
      mark.name.includes("End")
    );

    const startMarks = allPerformanceMarks.filter((mark) =>
      mark.name.includes("Start")
    );
    const startMarksMap = new Map(
      startMarks.map((mark) => [mark.detail.relatedId, mark])
    );

    const measures = endMarks.reduce((acc, endMark) => {
      const startMark = startMarksMap.get(endMark.detail.relatedId);
      if (!startMark) {
        return acc;
      }
      acc.push(
        performance.measure(
          `${endMark.name.split("End")[0]}_${endMark.detail.relatedId}`,
          startMark.name,
          endMark.name
        )
      );

      return acc;
    }, []);

    return measures.sort((a, b) => a.startTime - b.startTime);
  };

  const allMeasures = getMeasures();
  console.table(allMeasures);

  // Another example
  // const getPerformanceInfo = () => {
  //   const engineLoadStartMark = allPerformanceMarks.find((mark) =>
  //     mark.name.startsWith(EPerformanceMarkType.EngineInitStart)
  //   );
  //   const engineLoadEndMark = allPerformanceMarks.find((mark) =>
  //     mark.name.startsWith(EPerformanceMarkType.EngineInitEnd)
  //   );
  //   const wasmFetchAndCompileMeasure = performance.measure(
  //     "EngineInit",
  //     engineLoadStartMark.name,
  //     engineLoadEndMark.name
  //   );

  //   console.table(wasmFetchAndCompileMeasure);

  //   const getUpdateMeasures = () => {
  //     const updateStartMarks = allPerformanceMarks.filter((mark) =>
  //       mark.name.startsWith(EPerformanceMarkType.DataUpdateStart)
  //     );
  //     const updateEndMarks = allPerformanceMarks.filter((mark) =>
  //       mark.name.startsWith(EPerformanceMarkType.DataUpdateEnd)
  //     );
  //     const updateStartMarksMap = new Map(
  //       updateStartMarks.map((mark) => [mark.detail.relatedId, mark])
  //     );
  //     const measures = updateEndMarks.map((mark) =>
  //       performance.measure(
  //         `DataUpdate_${mark.detail.relatedId}`,
  //         updateStartMarksMap.get(mark.detail.relatedId).name,
  //         mark.name
  //       )
  //     );
  //     return measures;
  //   };

  //   const updateMeasures = getUpdateMeasures();

  //   const getRenderMeasures = () => {
  //     const updateStartMarks = allPerformanceMarks.filter((mark) =>
  //       mark.name.startsWith(EPerformanceMarkType.RenderStart)
  //     );
  //     const updateEndMarks = allPerformanceMarks.filter((mark) =>
  //       mark.name.startsWith(EPerformanceMarkType.RenderEnd)
  //     );
  //     const updateStartMarksMap = new Map(
  //       updateStartMarks.map((mark) => [mark.detail.relatedId, mark])
  //     );
  //     const measures = updateEndMarks.map((mark) =>
  //       performance.measure(
  //         `Render_${mark.detail.relatedId}`,
  //         updateStartMarksMap.get(mark.detail.relatedId).name,
  //         mark.name
  //       )
  //     );
  //     return measures;
  //   };

  //   const renderMeasures = getRenderMeasures();

  //   const allMeasures = [...updateMeasures, ...renderMeasures].sort(
  //     (a, b) => a.startTime - b.startTime
  //   );

  //   console.table(allMeasures);
  // };
};

const surfaces: SciChartSurface[] = [];

let controls: any = undefined;

const createRootElement = (index: number) => {
  const divElement = document.createElement("div");
  divElement.id = `chart-${index}`;
  const parentNode = document.getElementById("containerId");
  parentNode.appendChild(divElement);

  return divElement;
};

let lastPromise: Promise<any> = Promise.resolve();

const createChart = async (index: number) => {
  console.log("createChart", index);

  const rootElement = createRootElement(index);
  const initResult = await init2dChart(rootElement);
  controls = initResult.controls;

  surfaces.push(initResult.sciChartSurface);
};

const init2dChart = async (rootElement: HTMLDivElement) => {
  const createFunction = shouldUseCreateSingle
    ? SciChartSurface.createSingle
    : SciChartSurface.create;
  const { sciChartSurface, wasmContext } = await createFunction(rootElement, {
    id: rootElement.id,
    title: [
      `2D Surface with ${
        shouldUseCreateSingle ? "Individual" : "Shared"
      } WASM Context.`,
      `ID: ${rootElement.id}`,
    ],
    titleStyle: {
      fontSize: 14,
    },
  });

  const xAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Always });
  xAxis.labelProvider.useCache = false;
  sciChartSurface.xAxes.add(xAxis);
  const yAxis = new NumericAxis(wasmContext, {
    autoRange: EAutoRange.Always,
    growBy: new NumberRange(0.3, 0.3),
  });
  yAxis.labelProvider.useCache = false;
  sciChartSurface.yAxes.add(yAxis);

  // Create a DataSeries
  const xyDataSeries = new XyDataSeries(wasmContext, {
    fifoStartIndex: 0,
    fifoCapacity: dataSeriesCapacity,
  });

  // Create a renderableSeries and assign the dataSeries
  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      dataSeries: xyDataSeries,
      strokeThickness: 3,
      stroke: "#50C7E0",
    })
  );

  let dataPointCount = 0;

  // For more efficiency these are created only once
  const xValues = new Float64Array(dataChunkSize);
  const yValues = new Float64Array(dataChunkSize);
  const appendData = () => {
    const startMark = PerformanceDebugHelper.mark("DataPrepareStart", {
      contextId: sciChartSurface.id,
    });

    // ideally, data preparations should be done on the server;
    // in this example generating data on the fly may add some overhead
    for (let i = 0; i < dataChunkSize; i++) {
      xValues[i] = dataPointCount++;
      yValues[i] = 0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01);
    }

    PerformanceDebugHelper.mark("DataPrepareEnd", {
      relatedId: startMark?.detail?.relatedId,
      contextId: sciChartSurface.id,
    });
    xyDataSeries.appendRange(xValues, yValues);
  };

  const removeData = () => {
    // Remove all points from the data series
    xyDataSeries.clear();
  };

  appendData();

  let interval: NodeJS.Timeout;

  sciChartSurface.addDeletable({
    delete: () => {
      clearInterval(interval);
      interval = undefined;
    },
  });

  const toggleAnimate = () => {
    if (interval) {
      clearInterval(interval);
      interval = undefined;
    } else {
      // trying to update data each 10ms
      interval = setInterval(() => {
        // console.log("updateData");
        appendData();
      }, updateInterval);
    }
  };

  return {
    sciChartSurface,
    controls: { appendData, removeData, toggleAnimate },
  };
};

let counter = 0;

const removeChart = (surface: SciChartSurfaceBase) => {
  console.log("Delete", surface.id);
  const rootElement = surface.domChartRoot;
  surface.delete(true);
  const parentNode = document.getElementById("containerId");
  parentNode.removeChild(rootElement);
};

const cleanUp = () => {
  console.log("Clear all");

  controls = undefined;

  surfaces.forEach((scs) => removeChart(scs));
  surfaces.length = 0;

  const parentNode = document.getElementById("containerId");
  parentNode.innerHTML = "";

  performance.clearMeasures();
  performance.clearMarks();
  window.gc && window.gc();
};

const wrapCreation = async (createFunc: () => Promise<void>) => {
  // await lastPromise;
  lastPromise = createFunc();
};

(document.querySelector("#create1") as HTMLInputElement).onclick = () =>
  wrapCreation(() => createChart(counter++));

(document.querySelector("#append") as HTMLInputElement).onclick = () => {
  controls.appendData();
};

(document.querySelector("#remove") as HTMLInputElement).onclick = () => {
  controls.removeData();
};
(document.querySelector("#animate") as HTMLInputElement).onclick = () => {
  controls.toggleAnimate();
};

(document.querySelector("#logMemoryDebug") as HTMLInputElement).onclick = () =>
  logMemory();
(document.querySelector("#logPerformanceDebug") as HTMLInputElement).onclick =
  () => logPerformance();

(document.querySelector("#deleteSurfaces") as HTMLInputElement).onclick = () =>
  cleanUp();
(document.querySelector("#deleteWasm") as HTMLInputElement).onclick = () => {
  SciChartSurface.disposeSharedWasmContext();
  SciChart3DSurface.disposeSharedWasmContext();
};

document.querySelector<HTMLInputElement>("#memoryDebug").onclick = function (
  ev: MouseEvent
) {
  MemoryUsageHelper.isMemoryUsageDebugEnabled = (
    ev.target as HTMLInputElement
  ).checked;
  console.log(
    "isMemoryUsageDebugEnabled =",
    MemoryUsageHelper.isMemoryUsageDebugEnabled
  );
};
(document.querySelector("#autoDispose") as HTMLInputElement).onclick =
  function (ev: MouseEvent) {
    SciChartSurface.autoDisposeWasmContext = (
      ev.target as HTMLInputElement
    ).checked;
    SciChart3DSurface.autoDisposeWasmContext = (
      ev.target as HTMLInputElement
    ).checked;
    console.log(
      "autoDisposeWasmContext =",
      SciChartSurface.autoDisposeWasmContext
    );
  };
(document.querySelector("#performanceDebug") as HTMLInputElement).onclick =
  function (ev: MouseEvent) {
    PerformanceDebugHelper.enableDebug = (
      ev.target as HTMLInputElement
    ).checked;
    console.log(
      "PerformanceDebugHelper.enableDebug =",
      PerformanceDebugHelper.enableDebug
    );
  };
(document.querySelector("#nativeText") as HTMLInputElement).onclick = function (
  ev: MouseEvent
) {
  SciChartDefaults.useNativeText = (ev.target as HTMLInputElement).checked;
  console.log("useNativeText =", SciChartDefaults.useNativeText);
};
(document.querySelector("#individualContext") as HTMLInputElement).onclick =
  function (ev: MouseEvent) {
    shouldUseCreateSingle = (ev.target as HTMLInputElement).checked;
    console.log("createSingle =", shouldUseCreateSingle);
  };

const intervalSelector = document.getElementById(
  "intervalSelector"
) as HTMLInputElement;
intervalSelector.value = `${updateInterval}`;
const intervalLabel = document.getElementById("intervalLabel");
intervalLabel.innerHTML = `${updateInterval}`;

intervalSelector.onchange = function (ev: Event) {
  updateInterval = Number.parseInt((ev.target as HTMLInputElement).value, 10);
  intervalLabel.innerHTML = `${updateInterval}`;
  console.log("updateInterval =", updateInterval);
};

const capacitySelector = document.getElementById(
  "capacitySelector"
) as HTMLInputElement;
capacitySelector.value = `${dataSeriesCapacity}`;
const capacityLabel = document.getElementById("capacityLabel");
capacityLabel.innerHTML = `${dataSeriesCapacity}`;

capacitySelector.onchange = function (ev: Event) {
  dataSeriesCapacity = Number.parseInt(
    (ev.target as HTMLInputElement).value,
    10
  );
  capacityLabel.innerHTML = `${dataSeriesCapacity}`;
  console.log("Capacity =", dataSeriesCapacity);
};

const chunkSizeSelector = document.getElementById(
  "chunkSizeSelector"
) as HTMLInputElement;
chunkSizeSelector.value = `${dataChunkSize}`;
const chunkSizeLabel = document.getElementById("chunkSizeLabel");
chunkSizeLabel.innerHTML = `${dataChunkSize}`;

document.querySelector<HTMLInputElement>("#chunkSizeSelector").onchange =
  function (ev: Event) {
    dataChunkSize = Number.parseInt((ev.target as HTMLInputElement).value, 10);
    chunkSizeLabel.innerHTML = `${dataChunkSize}`;
    console.log("dataChunkSize =", dataChunkSize);
  };
