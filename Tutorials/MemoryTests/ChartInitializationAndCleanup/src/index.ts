import {
  BoxAnnotation,
  CameraController,
  MemoryUsageHelper,
  MouseWheelZoomModifier3D,
  NumericAxis,
  NumericAxis3D,
  OrbitModifier3D,
  PerformanceDebugHelper,
  SciChart3DSurface,
  SciChartDefaults,
  SciChartJsNavyTheme,
  SciChartSurface,
  SciChartSurfaceBase,
  SeriesInfo3D,
  TTooltip3DSvgTemplate,
  TooltipSvgAnnotation3D,
  Vector3,
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

const logMemory = () => {
  window.gc && window.gc();

  MemoryUsageHelper.objectRegistry?.log();
};

const logPerformance = () => {
  const allPerformanceMarks = performance.getEntriesByType("mark");
  console.log(allPerformanceMarks);
};

const multiChartSurfaces2D: SciChartSurface[] = [];
const singleChartSurfaces2D: SciChartSurface[] = [];
const multiChartSurfaces3D: SciChart3DSurface[] = [];
const singleChartSurfaces3D: SciChart3DSurface[] = [];

const createRootElement = (index: number) => {
  const divElement = document.createElement("div");
  divElement.id = `chart-${index}`;
  const parentNode = document.getElementById("containerId");
  parentNode.appendChild(divElement);

  return divElement;
};

let lastPromise: Promise<any> = Promise.resolve();

const createMultiChart2D = async (index: number) => {
  console.log("createMultiChart2D", index);

  const rootElement = createRootElement(index);
  const initResult = await init2dChartWithSharedContext(rootElement);
  multiChartSurfaces2D.push(initResult.sciChartSurface);
};

const init2dChartWithSharedContext = async (rootElement: HTMLDivElement) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      id: rootElement.id,
      title: [`2D Surface with Shared WASM Context.`, `ID: ${rootElement.id}`],
      titleStyle: {
        fontSize: 14,
      },
    }
  );

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // uncomment to check how MemoryUsageDebugHelper detects an orphan SciCHart-related entity
  // const detachedAnnotation = new BoxAnnotation({
  //     stroke: "#33FF33",
  //     strokeThickness: 5,
  //     fill: "rgba(50, 255, 50, 0.3)",
  //     x1: 3.0,
  //     x2: 5.0,
  //     y1: 7.0,
  //     y2: 9.0
  // })

  return { sciChartSurface };
};

const createSingleChart2D = async (index: number) => {
  console.log("createSingleChart2D", index);
  const rootElement = createRootElement(index);
  const initResult = await init2dChartWithIndividualContext(rootElement);
  singleChartSurfaces2D.push(initResult.sciChartSurface);
};

const init2dChartWithIndividualContext = async (
  rootElement: HTMLDivElement
) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.createSingle(
    rootElement,
    {
      id: rootElement.id,
      title: [
        `2D Surface with Individual WASM Context.`,
        `ID: ${rootElement.id}`,
      ],
      titleStyle: {
        fontSize: 14,
      },
    }
  );

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  return { sciChartSurface };
};

const createMultiChart3D = async (index: number) => {
  console.log("createMultiChart3D", index);
  const rootElement = createRootElement(index);
  const initResult = await init3dChartWithSharedContext(rootElement);
  multiChartSurfaces3D.push(initResult.sciChartSurface);
};

const titleTooltipSvgTemplate: TTooltip3DSvgTemplate = (
  seriesInfos: SeriesInfo3D,
  svgAnnotation: TooltipSvgAnnotation3D
): string => {
  const id = `id_${Date.now()}`;

  const height = 40;
  const tooltipFill =
    svgAnnotation.parentSurface.themeProvider.gridBackgroundBrush;
  const tooltipStroke =
    svgAnnotation.parentSurface.themeProvider.labelForegroundBrush;
  const title = svgAnnotation.title;

  return `<svg class="scichart__cursor-tooltip" width="100%" height="${height}">

        <rect width="100%" height="100%" fill="${tooltipFill}" filter="url(#${id})" />
        <svg width="100%">
            <text x="8" y="20" font-size="14" font-family="Arial" dy="0" fill="${tooltipStroke}">${title}</text>
        </svg>
    </svg>`;
};

const init3dChartWithSharedContext = async (rootElement: HTMLDivElement) => {
  const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(
    rootElement,
    {
      id: rootElement.id,
    }
  );

  const titleTooltip = new TooltipSvgAnnotation3D({
    title: `3D Surface with Shared WASM Context. <tspan x="4" dy="1.2em">ID: ${rootElement.id}</tspan>`,
    tooltipSvgTemplate: titleTooltipSvgTemplate,
  });
  titleTooltip.isHidden = false;
  sciChart3DSurface.annotations.add(titleTooltip);

  sciChart3DSurface.camera = new CameraController(wasmContext, {
    position: new Vector3(300, 300, 300),
    target: new Vector3(0, 50, 0),
  });
  sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
  sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());

  sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext);
  sciChart3DSurface.xAxis.axisTitle = "X Axis";

  sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext);
  sciChart3DSurface.yAxis.axisTitle = "Y Axis";

  sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext);
  sciChart3DSurface.zAxis.axisTitle = "Z Axis";

  return { sciChartSurface: sciChart3DSurface };
};

const createSingleChart3D = async (index: number) => {
  console.log("createSingleChart3D", index);
  const rootElement = createRootElement(index);
  const initResult = await init3dChartWithSeparateContext(rootElement);
  singleChartSurfaces3D.push(initResult.sciChartSurface);
};
const init3dChartWithSeparateContext = async (rootElement: HTMLDivElement) => {
  const { sciChart3DSurface, wasmContext } =
    await SciChart3DSurface.createSingle(rootElement, {
      id: rootElement.id,
    });

  const titleTooltip = new TooltipSvgAnnotation3D({
    title: `3D Surface with Individual WASM Context. <tspan x="4" dy="1.2em">ID: ${rootElement.id}</tspan>`,
    tooltipSvgTemplate: titleTooltipSvgTemplate,
  });
  titleTooltip.isHidden = false;
  sciChart3DSurface.annotations.add(titleTooltip);

  sciChart3DSurface.camera = new CameraController(wasmContext, {
    position: new Vector3(300, 300, 300),
    target: new Vector3(0, 50, 0),
  });
  sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
  sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());

  sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext);
  sciChart3DSurface.xAxis.axisTitle = "X Axis";

  sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext);
  sciChart3DSurface.yAxis.axisTitle = "Y Axis";

  sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext);
  sciChart3DSurface.zAxis.axisTitle = "Z Axis";

  singleChartSurfaces3D.push(sciChart3DSurface);

  return { sciChartSurface: sciChart3DSurface };
};

let counter = 0;

const removeChart = (surface: SciChartSurfaceBase) => {
  console.log("Delete", surface.id);
  const rootElement = surface.domChartRoot;
  surface.delete(true);
  const parentNode = document.getElementById("containerId");
  parentNode.removeChild(rootElement);
};

const deleteLastSurface = (surfaces: SciChartSurfaceBase[]) => {
  const surface = surfaces.pop();
  if (surface) {
    removeChart(surface);
  } else {
    console.warn("surfaces list is empty");
  }
};

const cleanUp = () => {
  console.log("Clear all");

  multiChartSurfaces2D.forEach((scs) => removeChart(scs));
  singleChartSurfaces2D.forEach((scs) => removeChart(scs));
  multiChartSurfaces3D.forEach((scs) => removeChart(scs));
  singleChartSurfaces3D.forEach((scs) => removeChart(scs));
  multiChartSurfaces2D.length = 0;
  singleChartSurfaces2D.length = 0;
  multiChartSurfaces3D.length = 0;
  singleChartSurfaces3D.length = 0;
  const parentNode = document.getElementById("containerId");
  parentNode.innerHTML = "";
  window.gc && window.gc();

  // logMemory();
};

const wrapCreation = async (createFunc: () => Promise<void>) => {
  // await lastPromise;
  lastPromise = createFunc();
};

(document.querySelector("#create1") as HTMLInputElement).onclick = () =>
  wrapCreation(() => createMultiChart2D(counter++));
(document.querySelector("#create2") as HTMLInputElement).onclick = () =>
  wrapCreation(() => createSingleChart2D(counter++));
(document.querySelector("#create3") as HTMLInputElement).onclick = () =>
  wrapCreation(() => createMultiChart3D(counter++));
(document.querySelector("#create4") as HTMLInputElement).onclick = () =>
  wrapCreation(() => createSingleChart3D(counter++));

(document.querySelector("#delete1") as HTMLInputElement).onclick = () =>
  deleteLastSurface(multiChartSurfaces2D);
(document.querySelector("#delete2") as HTMLInputElement).onclick = () =>
  deleteLastSurface(singleChartSurfaces2D);
(document.querySelector("#delete3") as HTMLInputElement).onclick = () =>
  deleteLastSurface(multiChartSurfaces3D);
(document.querySelector("#delete4") as HTMLInputElement).onclick = () =>
  deleteLastSurface(singleChartSurfaces3D);

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
(document.querySelector("#memoryDebug") as HTMLInputElement).onclick =
  function (ev: MouseEvent) {
    console.log(ev);
    MemoryUsageHelper.isMemoryUsageDebugEnabled = (
      ev.target as HTMLInputElement
    ).checked;
  };
(document.querySelector("#autoDispose") as HTMLInputElement).onclick =
  function (ev: MouseEvent) {
    console.log(ev);
    SciChartSurface.autoDisposeWasmContext = (
      ev.target as HTMLInputElement
    ).checked;
    SciChart3DSurface.autoDisposeWasmContext = (
      ev.target as HTMLInputElement
    ).checked;
  };
(document.querySelector("#performanceDebug") as HTMLInputElement).onclick =
  function (ev: MouseEvent) {
    console.log(ev);
    PerformanceDebugHelper.enableDebug = (
      ev.target as HTMLInputElement
    ).checked;
  };
(document.querySelector("#nativeText") as HTMLInputElement).onclick = function (
  ev: MouseEvent
) {
  console.log(ev);
  SciChartDefaults.useNativeText = (ev.target as HTMLInputElement).checked;
};
