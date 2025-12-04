import {
  CustomChartModifier2D,
  EAnnotationClippingMode,
  HtmlCustomAnnotation,
  ECoordinateMode,
  IChartModifierBaseOptions,
  PerformanceDebugHelper,
  EPerformanceMarkType,
  translateToNotScaledRect,
  Rect,
  receiveNextEvent,
} from "scichart";
import {
  CustomPerformanceDebugHelper,
  SCPerformanceMeasure,
} from "./performanceHelperOverrides";

/**
 * Props interface for {@link PerformanceMeasurementModifier}
 */
export interface PerformanceMeasurementModifierProps
  extends IChartModifierBaseOptions {
  /**
   * Array of mark types to track in performance measurements
   * Can be values from EPerformanceMarkType enum or custom string values
   */
  trackedMarkTypes?: Array<EPerformanceMarkType | string>;
  /**
   * Whether to automatically invalidate the chart when recording
   */
  autoInvalidate?: boolean;
  /**
   * Whether to keep collected performance data after recording
   */
  keepCollectedData?: boolean;
  /**
   * Whether to enable verbose debug mode
   */
  verbose?: boolean;
}

export class PerformanceMeasurementModifier extends CustomChartModifier2D {
  protected isRecording: boolean = false;
  protected endRecordingFn: () => SCPerformanceMeasure[];
  protected controlBarAnnotation: HtmlCustomAnnotation;
  protected trackedMarkTypes: Array<EPerformanceMarkType | string> =
    Object.values(EPerformanceMarkType);
  protected autoInvalidate: boolean = false;
  protected keepCollectedData: boolean = false;
  protected verbose: boolean = false;
  protected cleanupControlBar: () => void;

  constructor(props?: PerformanceMeasurementModifierProps) {
    super(props);

    this.trackedMarkTypes = props?.trackedMarkTypes ?? this.trackedMarkTypes;
    this.autoInvalidate = props?.autoInvalidate ?? this.autoInvalidate;
    this.keepCollectedData = props?.keepCollectedData ?? this.keepCollectedData;
    this.verbose = props?.verbose ?? this.verbose;
  }

  public override onAttach(): void {
    super.onAttach();

    this.createControlBarAnnotation();
  }

  public override onDetach(): void {
    super.onDetach();

    // End recording if still active
    if (this.isRecording && this.endRecordingFn) {
      try {
        this.endRecordingFn();
      } catch (e) {
        console.error("Error ending recording:", e);
      }
      this.endRecordingFn = null;
      this.isRecording = false;
    }

    // Clean up control bar event listeners
    if (this.cleanupControlBar) {
      this.cleanupControlBar();
      this.cleanupControlBar = null;
    }

    // Clean up the annotation if it exists
    this.parentSurface.annotations.remove(this.controlBarAnnotation);
    this.controlBarAnnotation = null;
  }

  protected createControlBarAnnotation() {
    const initialX = 0;
    const initialY = 170;

    const controlBarAnnotation = new HtmlCustomAnnotation({
      x1: initialX,
      y1: initialY,
      xCoordinateMode: ECoordinateMode.Pixel,
      yCoordinateMode: ECoordinateMode.Pixel,
      clipping: EAnnotationClippingMode.Chart,
      isSelected: false,
    });

    let staticWidthPx: number = undefined;
    let initialWidth = staticWidthPx;

    // minWidth for flex-wrap: allow wrapping, but ensure no control is clipped.
    // Widest control: multi-select (160px), plus handles and padding.
    // 32 (left handle) + 160 (multi-select) + 32 (right handle) + 32 (padding) = 256px
    const minWidth = 256;

    let maxWidth = Number.MAX_SAFE_INTEGER;

    // Move logic
    const onDragStart = (props: { startX: number; startY: number }) => {};

    let lastX = initialX;
    let lastY = initialY;

    const onDrag = ({
      controlBar,
      deltaX,
      deltaY,
    }: {
      controlBar: HTMLElement;
      deltaX: number;
      deltaY: number;
    }) => {
      // Get chart dimensions for snap assist
      // Use the parent element of the annotation to determine chart dimensions
      const view = translateToNotScaledRect(this.parentSurface.seriesViewRect);

      const annotationBorders =
        this.controlBarAnnotation.getAnnotationBorders();
      const controlBarWidth = annotationBorders.x2 - annotationBorders.x1;
      const controlBarHeight = annotationBorders.y2 - annotationBorders.y1;

      // Calculate new position
      let newX1 = lastX + deltaX;
      let newY1 = lastY + deltaY;

      // Snap threshold in pixels
      const snapThreshold = 15;

      const elementRect = new Rect(
        newX1,
        newY1,
        controlBarWidth,
        controlBarHeight
      );

      const { x1, x2, y1, isSnapped } = applySnapAssist(
        elementRect,
        view,
        snapThreshold,
        staticWidthPx
      );

      // Apply the new position
      this.controlBarAnnotation.x1 = x1;
      this.controlBarAnnotation.y1 = y1;

      // if the control bar wasn't resized to a specific width - let it be responsive
      if (staticWidthPx) {
        this.controlBarAnnotation.x2 = x2;
      }

      // Add visual feedback when snapped
      if (isSnapped) {
        controlBar.style.boxShadow = highlightedControlBarBoxShadow;
      } else {
        controlBar.style.boxShadow = defaultControlBarBoxShadow;
      }
    };

    const onDragEnd = ({
      controlBar,
      offsetX,
      offsetY,
    }: {
      controlBar: HTMLElement;
      offsetX: number;
      offsetY: number;
    }) => {
      lastX += offsetX;
      lastY += offsetY;
      controlBar.style.boxShadow = defaultControlBarBoxShadow;
    };

    let resizeStartX = 0;

    // Resize logic
    const onResizeDragStart = (startX: number, startY: number) => {
      const annotationBorders =
        this.controlBarAnnotation.getAnnotationBorders();
      this.controlBarAnnotation.x2 = annotationBorders.x2;

      resizeStartX = startX;
      initialWidth = annotationBorders.x2 - annotationBorders.x1;
    };

    const onResizeDrag = (deltaX: number, _deltaY: number) => {
      // Calculate new width
      let newWidth = initialWidth + deltaX;

      // Constrain width between minWidth and maxWidth
      if (newWidth < minWidth) {
        newWidth = minWidth;
      } else if (newWidth > maxWidth) {
        newWidth = maxWidth;
      }

      this.controlBarAnnotation.x2 = this.controlBarAnnotation.x1 + newWidth;
    };

    const onResizeDragEnd = (offsetX: number, offsetY: number) => {
      // Update staticWidthPx to persist the new width after resizing
      staticWidthPx =
        this.controlBarAnnotation.x2 - this.controlBarAnnotation.x1;
    };

    // Capture the current tracked mark types
    const currentTrackedMarkTypes = this.trackedMarkTypes;
    const currentAutoInvalidate = this.autoInvalidate;
    const currentKeepCollectedData = this.keepCollectedData;
    const currentVerbose = this.verbose;

    // First generate the control bar with default handlers
    const result = generateControlBarHtml(
      controlBarAnnotation.htmlElement,
      onDragStart,
      onDrag,
      onDragEnd,
      onResizeDragStart,
      onResizeDrag,
      onResizeDragEnd,
      (checked: boolean) => {
        this.autoInvalidate = checked;
      },
      (checked: boolean) => {
        this.keepCollectedData = checked;
      },
      (checked: boolean) => {
        this.verbose = checked;
      },
      (selected: string[]) => {
        this.trackedMarkTypes = selected as Array<
          EPerformanceMarkType | string
        >;
      },
      Object.values(EPerformanceMarkType),
      currentTrackedMarkTypes,
      currentAutoInvalidate,
      currentKeepCollectedData,
      currentVerbose
    );

    const {
      controlBar,
      recordOnceButton,
      recordToggleButton,
      invalidateButton,
      autoInvalidateSwitch,
      keepDataSwitch,
      verboseSwitch,
      markTypesSelect,
      cleanup,
    } = result;

    const autoInvalidateSwitchInput = autoInvalidateSwitch.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;

    const verboseSwitchInput = verboseSwitch.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;

    // Helper function to update switch disabled state
    const updateSwitchState = (
      switchElement: HTMLLabelElement,
      input: HTMLInputElement,
      disabled: boolean
    ) => {
      input.disabled = disabled;
      const switchContainer = switchElement.querySelector("div") as HTMLElement;
      if (switchContainer) {
        switchContainer.style.opacity = disabled ? "0.5" : "1";
        switchContainer.style.cursor = disabled ? "not-allowed" : "pointer";
      }
      switchElement.style.opacity = disabled ? "0.5" : "1";
      switchElement.style.cursor = disabled ? "not-allowed" : "pointer";
    };

    // Helper function to update autoInvalidateSwitch disabled state
    const updateAutoInvalidateSwitchState = (disabled: boolean) => {
      updateSwitchState(
        autoInvalidateSwitch,
        autoInvalidateSwitchInput,
        disabled
      );
    };

    // Helper function to update verboseSwitch disabled state
    const updateVerboseSwitchState = (disabled: boolean) => {
      updateSwitchState(verboseSwitch, verboseSwitchInput, disabled);
    };

    const updateMarkTypesSelectState = (disabled: boolean) => {
      markTypesSelect.setDisabled(disabled);
    };

    // Helper function to update button disabled state
    const updateButtonState = (
      button: HTMLButtonElement,
      disabled: boolean
    ) => {
      button.disabled = disabled;
      button.style.opacity = disabled ? "0.5" : "1";
      button.style.cursor = disabled ? "not-allowed" : "pointer";
    };

    // Create the click handler function for recordOnceButton
    const buttonClickHandler = async (e: MouseEvent) => {
      // Store original button state
      const originalSvg = recordOnceButton.innerHTML;
      const originalTitle = recordOnceButton.title;

      // Disable recordOnceButton and recordToggleButton, and show spinner on recordOnceButton
      recordOnceButton.disabled = true;
      recordOnceButton.innerHTML = spinnerSvg;
      recordOnceButton.title = "Processing...";
      recordOnceButton.style.opacity = "0.7";
      recordOnceButton.style.cursor = "wait";

      // Disable recordToggleButton while recordOnceButton is processing
      updateButtonState(recordToggleButton, true);

      // Disable switches and markTypesSelect while processing
      updateAutoInvalidateSwitchState(true);
      updateVerboseSwitchState(true);
      updateMarkTypesSelectState(true);

      try {
        // Call the handler function
        await this.recordSingleFrameButtonHandler();
        console.log("Single frame recording completed");
      } catch (err) {
        console.error("Error in single frame recording:", err);
      } finally {
        // Restore button state
        recordOnceButton.disabled = false;
        recordOnceButton.innerHTML = originalSvg;
        recordOnceButton.title = originalTitle;
        recordOnceButton.style.opacity = "";
        recordOnceButton.style.cursor = "pointer";

        // Re-enable recordToggleButton, autoInvalidateSwitch and markTypesSelect only if not recording
        if (!this.isRecording) {
          updateButtonState(recordToggleButton, false);
          updateAutoInvalidateSwitchState(false);
          updateVerboseSwitchState(false);
          updateMarkTypesSelectState(false);
        }
      }
    };

    // Create the click handler function for recordToggleButton (toggle between start/stop recording)
    const recordToggleButtonClickHandler = (e: MouseEvent) => {
      if (!this.isRecording) {
        // Start recording
        recordToggleButton.title = "Stop Recording";
        recordToggleButton.innerHTML = recordStopSvg; // Change to stop icon
        this.isRecording = true;

        // Disable recordOnceButton, switches and markTypesSelect while recording
        updateButtonState(recordOnceButton, true);
        updateAutoInvalidateSwitchState(true);
        updateVerboseSwitchState(true);
        updateMarkTypesSelectState(true);

        // Start recording and get the end function
        this.startRecordingHandler()
          .then((endFn) => {
            this.endRecordingFn = endFn;
          })
          .catch((err) => {
            console.error("Error starting recording:", err);
            this.isRecording = false;
            recordToggleButton.title = "Start Recording";
            recordToggleButton.innerHTML = recordStartSvg; // Change back to start icon

            // Re-enable recordOnceButton, switches and markTypesSelect on error
            updateButtonState(recordOnceButton, false);
            updateAutoInvalidateSwitchState(false);
            updateVerboseSwitchState(false);
            updateMarkTypesSelectState(false);
          });
      } else {
        // End recording
        recordToggleButton.title = "Start Recording";
        recordToggleButton.innerHTML = recordStartSvg; // Change back to start icon
        this.isRecording = false;

        // Re-enable recordOnceButton, switches and markTypesSelect after recording stops
        updateButtonState(recordOnceButton, false);
        updateAutoInvalidateSwitchState(false);
        updateVerboseSwitchState(false);
        updateMarkTypesSelectState(false);

        try {
          const measures = this.endRecordingFn();
          this.outputParsedMeasures(measures);
        } catch (e) {
          console.error("Error ending recording:", e);
        }
        this.endRecordingFn = null;
      }
    };

    // Create the click handler function for invalidateButton
    const invalidateButtonClickHandler = (e: MouseEvent) => {
      this.parentSurface.invalidateElement();
    };

    // Add the click handlers to buttons
    recordOnceButton.addEventListener("click", buttonClickHandler);
    recordToggleButton.addEventListener(
      "click",
      recordToggleButtonClickHandler
    );
    invalidateButton.addEventListener("click", invalidateButtonClickHandler);

    // Store the cleanup function
    this.cleanupControlBar = () => {
      recordOnceButton.removeEventListener("click", buttonClickHandler);
      recordToggleButton.removeEventListener(
        "click",
        recordToggleButtonClickHandler
      );
      invalidateButton.removeEventListener(
        "click",
        invalidateButtonClickHandler
      );
      cleanup();
    };

    // allow the annotation to render at the full width to measure and store it in maxWidth
    receiveNextEvent(this.parentSurface.painted).then(() => {
      const annotationBorders =
        controlBarAnnotation.getAdornerAnnotationBorders();
      maxWidth = annotationBorders.x2 - annotationBorders.x1;
      controlBar.style.flexWrap = "wrap";
    });

    this.controlBarAnnotation = controlBarAnnotation;
    this.parentSurface.annotations.add(this.controlBarAnnotation);
  }

  protected async startRecordingHandler() {
    return (
      PerformanceDebugHelper.instance as CustomPerformanceDebugHelper
    ).startRecordingPerformance({
      sciChartSurface: this.parentSurface,
      invalidate: this.autoInvalidate,
      keepCollectedData: this.keepCollectedData,
      trackedMarkTypes: this.trackedMarkTypes,
      verbose: this.verbose,
    });
  }

  protected async recordSingleFrameButtonHandler() {
    const measures = await (
      PerformanceDebugHelper.instance as CustomPerformanceDebugHelper
    ).recordSingleRedrawRequest({
      sciChartSurface: this.parentSurface,
      invalidate: this.autoInvalidate,
      keepCollectedData: this.keepCollectedData,
      trackedMarkTypes: this.trackedMarkTypes,
      verbose: this.verbose,
    });

    this.outputParsedMeasures(measures);
  }

  protected outputParsedMeasures(measures: SCPerformanceMeasure[]) {
    const measuresByType = new Map<string, SCPerformanceMeasure[]>();

    measures.forEach((m) => {
      const measureType = m.name.split("_")[0].replace("Time", "");
      if (measuresByType.has(measureType)) {
        measuresByType.get(measureType).push(m);
      } else {
        measuresByType.set(measureType, [m]);
      }
    });

    const avgDurations = Array.from(measuresByType.entries()).reduce(
      (acc, [key, values]) => {
        const avg =
          values.reduce((acc, v) => acc + v.duration, 0) / values.length;
        Object.assign(acc, { [key]: Number.parseFloat(avg.toFixed(2)) });
        return acc;
      },
      {} as Record<string, number>
    );

    console.table(avgDurations);
  }
}

const defaultControlBarBoxShadow = "0 2px 8px rgba(0,0,0,0.2)";
const highlightedControlBarBoxShadow =
  "0 0 0 2px #81a1c1, 0 2px 8px rgba(0,0,0,0.2)";

function generateControlBarHtml(
  root: HTMLElement,
  onDragStart: (props: {
    controlBar: HTMLElement;
    startX: number;
    startY: number;
  }) => void,
  onDrag: (props: {
    controlBar: HTMLElement;
    deltaX: number;
    deltaY: number;
  }) => void,
  onDragEnd: (props: {
    controlBar: HTMLElement;
    offsetX: number;
    offsetY: number;
  }) => void,
  onResizeDragStart: (startX: number, startY: number) => void,
  onResizeDrag: (deltaX: number, deltaY: number) => void,
  onResizeDragEnd: (offsetX: number, offsetY: number) => void,
  onAutoInvalidateSwitchChange: (checked: boolean) => void,
  onKeepDataSwitchChange: (checked: boolean) => void,
  onVerboseSwitchChange: (checked: boolean) => void,
  onSelectedMarksChange: (selected: string[]) => void,
  availableMarkTypes: Array<EPerformanceMarkType | string>,
  initialTrackedMarkTypes: Array<EPerformanceMarkType | string>,
  initialAutoInvalidate: boolean,
  initialKeepCollectedData: boolean,
  initialVerbose: boolean
) {
  // === Container ===
  const controlBar = document.createElement("div");
  controlBar.className = "control-bar";

  controlBar.style.display = "flex";
  // controlBar.style.flexWrap = "wrap";
  controlBar.style.gap = "6px";
  controlBar.style.alignItems = "center";
  controlBar.style.justifyContent = "start";
  controlBar.style.padding = "8px 10px";
  controlBar.style.background = "#1e2130";
  controlBar.style.border = "1px solid #2d3748";
  controlBar.style.borderRadius = "10px";
  controlBar.style.boxSizing = "border-box";
  controlBar.style.position = "relative";
  controlBar.style.userSelect = "none";
  controlBar.style.width = "fit-content";
  controlBar.style.pointerEvents = "all";
  controlBar.style.boxShadow = defaultControlBarBoxShadow;

  // === Move Handle (left, anchored) ===
  const handle = document.createElement("div");
  handle.textContent = "⠇"; // vertical dots for move
  handle.style.cursor = "grab";
  handle.style.fontSize = "22px";
  handle.style.fontWeight = "bold";
  handle.style.opacity = "0.7";
  handle.style.userSelect = "none";
  handle.style.position = "absolute";
  handle.style.left = "0";
  handle.style.top = "0";
  handle.style.height = "28px";
  handle.style.display = "flex";
  handle.style.alignItems = "flex-start";
  handle.style.justifyContent = "center";
  handle.style.padding = "0 6px";
  handle.style.background = "#2d3748";
  handle.style.borderRadius = "8px 0 0 8px";
  handle.style.borderRight = "1px solid #4a5568";
  handle.style.color = "#81a1c1";

  let startX = 0;
  let startY = 0;

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    handle.style.cursor = "grabbing";

    if (onDragStart) onDragStart({ controlBar, startX, startY });

    const handleMouseMove = (ev: MouseEvent) => {
      const deltaX = ev.clientX - startX;
      const deltaY = ev.clientY - startY;
      if (onDrag) onDrag({ controlBar, deltaX, deltaY });
    };

    const handleMouseUp = (ev: MouseEvent) => {
      const offsetX = ev.clientX - startX;
      const offsetY = ev.clientY - startY;
      handle.style.cursor = "grab";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      if (onDragEnd) onDragEnd({ controlBar, offsetX, offsetY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
  };

  handle.addEventListener("mousedown", handleMouseDown);
  controlBar.appendChild(handle);
  // Add padding-left to controlBar to avoid overlap with move handle
  controlBar.style.paddingLeft = "32px";

  // === Resize Handle (right) ===
  const resizeHandle = document.createElement("div");
  // SVG for vertical resize ("drag right")
  resizeHandle.innerHTML = `<svg width="18" height="32" viewBox="0 0 18 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="6" width="4" height="20" rx="2" fill="#4a5568"/><circle cx="9" cy="10" r="1.5" fill="#81a1c1"/><circle cx="9" cy="16" r="1.5" fill="#81a1c1"/><circle cx="9" cy="22" r="1.5" fill="#81a1c1"/></svg>`;
  resizeHandle.style.cursor = "ew-resize";
  resizeHandle.style.display = "flex";
  resizeHandle.style.alignItems = "center";
  resizeHandle.style.justifyContent = "center";
  resizeHandle.style.userSelect = "none";
  resizeHandle.style.position = "absolute";
  resizeHandle.style.top = "0";
  resizeHandle.style.right = "0";
  resizeHandle.style.height = "100%";
  resizeHandle.style.width = "32px";
  resizeHandle.style.background = "#2d3748";
  resizeHandle.style.borderRadius = "0 8px 8px 0";
  resizeHandle.style.borderLeft = "1px solid #4a5568";
  resizeHandle.style.padding = "0";

  let resizeStartX = 0;
  let resizeStartY = 0;

  const resizeHandleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;
    resizeHandle.style.cursor = "ew-resize";

    if (onResizeDragStart) onResizeDragStart(resizeStartX, resizeStartY);

    const handleResizeMouseMove = (ev: MouseEvent) => {
      const deltaX = ev.clientX - resizeStartX;
      const deltaY = ev.clientY - resizeStartY;
      if (onResizeDrag) onResizeDrag(deltaX, deltaY);
    };

    const handleResizeMouseUp = (ev: MouseEvent) => {
      const offsetX = ev.clientX - resizeStartX;
      const offsetY = ev.clientY - resizeStartY;
      resizeHandle.style.cursor = "ew-resize";
      document.removeEventListener("mousemove", handleResizeMouseMove);
      document.removeEventListener("mouseup", handleResizeMouseUp);
      if (onResizeDragEnd) onResizeDragEnd(offsetX, offsetY);
    };

    document.addEventListener("mousemove", handleResizeMouseMove);
    document.addEventListener("mouseup", handleResizeMouseUp, { once: true });
  };

  resizeHandle.addEventListener("mousedown", resizeHandleMouseDown);
  controlBar.appendChild(resizeHandle);
  // Add padding-right to controlBar to avoid overlap with resize handle and add margin
  controlBar.style.paddingRight = "44px";

  // Group 1: Icon Buttons (no border/background)

  const recordOnceButton = createIconButton(
    recordSvg,
    "Record Single Redraw Request"
  );
  const recordToggleButton = createIconButton(
    recordStartSvg,
    "Start Recording"
  );
  const invalidateButton = createIconButton(refreshSvg, "Invalidate");

  const buttonGroup = document.createElement("div");
  buttonGroup.style.display = "flex";
  buttonGroup.style.gap = "8px";
  buttonGroup.append(recordOnceButton, recordToggleButton, invalidateButton);

  // Group 2: Switches
  const autoInvalidateSwitch = createSwitch(
    "Auto Invalidate",
    initialAutoInvalidate,
    onAutoInvalidateSwitchChange
  );
  const keepDataSwitch = createSwitch(
    "Keep collected data",
    initialKeepCollectedData,
    onKeepDataSwitchChange
  );
  const verboseSwitch = createSwitch(
    "Verbose",
    initialVerbose,
    onVerboseSwitchChange
  );

  // Style each label/control pair
  const switchStyle = (switchElement: HTMLLabelElement) => {
    switchElement.style.border = "1px solid #4a5568";
    switchElement.style.borderRadius = "8px";
    switchElement.style.background = "#2d3748";
    switchElement.style.padding = "6px 10px";
    switchElement.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
  };

  switchStyle(autoInvalidateSwitch);
  switchStyle(keepDataSwitch);
  switchStyle(verboseSwitch);

  const switch3Result = createMultiSelectDropdown(
    "Tracked mark types",
    availableMarkTypes,
    onSelectedMarksChange || ((sel) => console.log("Tracked:", sel)),
    initialTrackedMarkTypes
  );

  controlBar.append(
    buttonGroup,
    autoInvalidateSwitch,
    keepDataSwitch,
    verboseSwitch,
    switch3Result.element
  );
  root.appendChild(controlBar);

  // Create cleanup function
  const cleanup = () => {
    // Remove handle event listener
    handle.removeEventListener("mousedown", handleMouseDown);

    // Remove resize handle event listener
    resizeHandle.removeEventListener("mousedown", resizeHandleMouseDown);

    // Clean up document click handler from multiselect
    if (switch3Result.documentClickHandler) {
      document.removeEventListener("click", switch3Result.documentClickHandler);
    }
  };

  return {
    controlBar,
    recordOnceButton,
    recordToggleButton,
    invalidateButton,
    autoInvalidateSwitch,
    keepDataSwitch,
    verboseSwitch,
    markTypesSelect: switch3Result,
    handle,
    resizeHandle,
    cleanup,
  };
}

const recordSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7" fill="#f56565" stroke="#e53e3e" stroke-width="2"/></svg>`;
const recordStopSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="10" height="10" rx="2" fill="#4a5568" stroke="#2d3748" stroke-width="2"/></svg>`;
const recordStartSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="8" stroke="#48bb78" stroke-width="2"/>
        <path d="M8 6L14 10L8 14V6Z" fill="#48bb78" stroke="#48bb78" stroke-width="1" stroke-linejoin="round"/>
    </svg>`;
const refreshSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C12.7614 3 15.1716 4.73954 16.2398 7.25" stroke="#81a1c1" stroke-width="2" stroke-linecap="round"/>
        <path d="M17 4V7.5H13.5" stroke="#81a1c1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
const spinnerSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#4a5568" stroke-width="2" stroke-opacity="0.3"/>
            <path d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.76121C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12" stroke="#81a1c1" stroke-width="2" stroke-linecap="round">
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 12 12"
                    to="360 12 12"
                    dur="1s"
                    repeatCount="indefinite"/>
            </path>
        </svg>`;

// === Helper creators ===
function createIconButton(svg: string, title: string): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.innerHTML = svg;
  btn.title = title;
  btn.style.padding = "6px";
  btn.style.width = "36px";
  btn.style.height = "36px";
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.background = "#2d3748";
  btn.style.border = "1px solid #4a5568";
  btn.style.borderRadius = "8px";
  btn.style.cursor = "pointer";
  btn.style.transition = "all 0.2s ease";
  btn.style.color = "#81a1c1";
  btn.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
  btn.addEventListener("mouseenter", () => {
    if (!btn.disabled) {
      btn.style.background = "#3d4b61";
      btn.style.transform = "translateY(-1px)";
      btn.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
    }
  });
  btn.addEventListener("mouseleave", () => {
    if (!btn.disabled) {
      btn.style.background = "#2d3748";
      btn.style.transform = "translateY(0)";
      btn.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
    }
  });
  btn.addEventListener("mousedown", () => {
    if (!btn.disabled) {
      btn.style.transform = "translateY(1px)";
      btn.style.boxShadow = "0 0 2px rgba(0,0,0,0.1)";
    }
  });
  btn.addEventListener("mouseup", () => {
    if (!btn.disabled) {
      btn.style.transform = "translateY(-1px)";
      btn.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
    }
  });
  return btn;
}

function createSwitch(
  label: string,
  initialValue: boolean,
  onToggle: (checked: boolean) => void
): HTMLLabelElement {
  const wrapper = document.createElement("label");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "8px";
  wrapper.style.cursor = "pointer";
  wrapper.style.fontSize = "14px";
  wrapper.style.fontWeight = "500";
  wrapper.style.color = "#e2e8f0";

  // Create a custom switch instead of the default checkbox
  const switchContainer = document.createElement("div");
  switchContainer.style.position = "relative";
  switchContainer.style.width = "32px";
  switchContainer.style.height = "18px";

  const input = document.createElement("input") as HTMLInputElement;
  input.type = "checkbox";
  input.checked = initialValue;
  input.style.opacity = "0";
  input.style.width = "0";
  input.style.height = "0";
  input.style.position = "absolute";
  input.addEventListener("change", () => onToggle(input.checked));

  const slider = document.createElement("span");
  slider.style.position = "absolute";
  slider.style.cursor = "pointer";
  slider.style.top = "0";
  slider.style.left = "0";
  slider.style.right = "0";
  slider.style.bottom = "0";
  slider.style.backgroundColor = initialValue ? "#48bb78" : "#4a5568";
  slider.style.borderRadius = "34px";
  slider.style.transition = "0.3s";

  // Create the circle that slides
  const circle = document.createElement("span");
  circle.style.position = "absolute";
  circle.style.content = '""';
  circle.style.height = "14px";
  circle.style.width = "14px";
  circle.style.left = "2px";
  circle.style.bottom = "2px";
  circle.style.backgroundColor = "#e2e8f0";
  circle.style.borderRadius = "50%";
  circle.style.transition = "0.3s";
  circle.style.transform = initialValue ? "translateX(14px)" : "translateX(0)";

  slider.appendChild(circle);
  switchContainer.appendChild(input);
  switchContainer.appendChild(slider);

  // Update the slider when checkbox state changes
  input.addEventListener("change", function () {
    if (this.checked) {
      slider.style.backgroundColor = "#48bb78";
      circle.style.transform = "translateX(14px)";
    } else {
      slider.style.backgroundColor = "#4a5568";
      circle.style.transform = "translateX(0)";
    }
  });

  const span = document.createElement("span");
  span.textContent = label;

  wrapper.appendChild(switchContainer);
  wrapper.appendChild(span);
  return wrapper;
}

// === MultiSelect ===
function createMultiSelectDropdown(
  label: string,
  options: string[],
  onChange?: (selected: string[]) => void,
  initialSelected?: Array<string | EPerformanceMarkType>
): {
  element: HTMLDivElement;
  setDisabled: (disabled: boolean) => void;
  documentClickHandler: (e: MouseEvent) => void;
} {
  const wrapper = document.createElement("div");

  wrapper.style.position = "relative";
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "flex-start";
  wrapper.style.fontSize = "15px";
  wrapper.style.cursor = "pointer";
  wrapper.style.gap = "4px";
  wrapper.title = "Tracked Performance Mark Types";

  const dropdown = document.createElement("div");
  dropdown.style.border = "1px solid #4a5568";
  dropdown.style.borderRadius = "8px";
  dropdown.style.padding = "6px 10px";
  dropdown.style.background = "#2d3748";
  dropdown.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
  dropdown.style.cursor = "pointer";
  dropdown.style.minWidth = "160px";

  // Label and count row inside dropdown, with arrow icon anchored right
  const labelRow = document.createElement("div");
  labelRow.style.display = "flex";
  labelRow.style.flexDirection = "row";
  labelRow.style.alignItems = "center";
  labelRow.style.gap = "6px";
  labelRow.style.width = "100%";
  labelRow.style.justifyContent = "space-between";

  const leftGroup = document.createElement("div");
  leftGroup.style.display = "flex";
  leftGroup.style.alignItems = "center";
  leftGroup.style.gap = "6px";

  const labelSpan = document.createElement("span");
  labelSpan.textContent = "Marks";
  labelSpan.style.fontWeight = "600";
  labelSpan.style.color = "#e2e8f0";

  const countSpan = document.createElement("span");
  countSpan.style.fontWeight = "normal";
  countSpan.style.color = "#81a1c1";

  leftGroup.appendChild(labelSpan);
  leftGroup.appendChild(countSpan);

  // Dropdown arrow icon (SVG)
  const arrowIcon = document.createElement("span");
  arrowIcon.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" style="display:block" xmlns="http://www.w3.org/2000/svg"><path d="M3 6l4 4 4-4" stroke="#81a1c1" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  arrowIcon.style.display = "flex";
  arrowIcon.style.alignItems = "center";
  arrowIcon.style.justifyContent = "center";
  arrowIcon.style.marginLeft = "8px";
  arrowIcon.style.transition = "transform 0.2s";

  labelRow.appendChild(leftGroup);
  labelRow.appendChild(arrowIcon);
  dropdown.appendChild(labelRow);

  const list = document.createElement("div");
  list.style.position = "absolute";
  list.style.top = "100%";
  list.style.left = "0";
  list.style.border = "1px solid #4a5568";
  list.style.background = "#1e2130";
  list.style.borderRadius = "8px";
  list.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
  list.style.marginTop = "4px";
  list.style.zIndex = "100";
  list.style.display = "none";
  list.style.minWidth = "100%";
  list.style.boxSizing = "border-box";
  list.style.maxHeight = "180px";
  list.style.overflowY = "auto";

  // Initialize with provided values or default to all options
  const selected = new Set<string>(initialSelected || options);
  let isDisabled = false;

  function updateCount() {
    countSpan.textContent = `(${selected.size})`;
  }

  // merge standard mark types with the custom ones if they were provided
  const allOptions = Array.from(new Set(options.concat(initialSelected)));

  for (let i = 0; i < allOptions.length; i++) {
    const opt = allOptions[i];
    const item = document.createElement("div");
    item.textContent = opt;
    item.style.padding = "8px 12px";
    item.style.cursor = "pointer";
    item.style.background = selected.has(opt) ? "#3d4b61" : "#1e2130";
    item.style.textAlign = "left";
    item.style.fontWeight = "300";
    item.style.fontSize = "14px";
    item.style.color = "#e2e8f0";

    // Add border between items (except for the last one)
    if (i < allOptions.length - 1) {
      item.style.borderBottom = "1px solid #2d3748";
    }

    item.addEventListener("mouseenter", () => {
      if (!isDisabled) {
        item.style.background = "#4c5c78";
      }
    });
    item.addEventListener("mouseleave", () => {
      item.style.background = selected.has(opt) ? "#3d4b61" : "#1e2130";
    });

    item.addEventListener("click", (e) => {
      if (isDisabled) return;

      e.stopPropagation();

      if (selected.has(opt)) {
        selected.delete(opt);
        item.style.background = "#1e2130";
      } else {
        selected.add(opt);
        item.style.background = "#3d4b61";
      }

      updateCount();
      if (onChange) onChange(Array.from(selected));
    });

    list.appendChild(item);
  }

  // Initial count
  updateCount();

  dropdown.addEventListener("click", (e) => {
    if (isDisabled) return;

    e.stopPropagation();
    const isOpen = list.style.display === "block";
    list.style.display = isOpen ? "none" : "block";
    // Rotate arrow if open
    arrowIcon.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
  });

  const documentClickHandler = () => {
    list.style.display = "none";
    arrowIcon.style.transform = "rotate(0deg)";
  };

  document.addEventListener("click", documentClickHandler);

  const setDisabled = (disabled: boolean) => {
    isDisabled = disabled;
    wrapper.style.opacity = disabled ? "0.5" : "1";
    wrapper.style.cursor = disabled ? "not-allowed" : "pointer";
    dropdown.style.cursor = disabled ? "not-allowed" : "pointer";

    if (disabled) {
      // Close the dropdown if it's open
      list.style.display = "none";
      arrowIcon.style.transform = "rotate(0deg)";
    }
  };

  wrapper.appendChild(dropdown);
  wrapper.appendChild(list);

  // Fire initial onChange with all options selected
  if (onChange) onChange(Array.from(selected));

  return { element: wrapper, setDisabled, documentClickHandler };
}

const applySnapAssist = (
  element: Rect,
  view: Rect,
  snapThreshold: number,
  staticWidthPx: number
) => {
  const chartWidth = view.width;
  const chartHeight = view.height;

  // Extract values from element Rect
  let newX1 = element.x;
  let newY1 = element.y;
  const elementWidth = element.width;
  const elementHeight = element.height;
  let newX2 = newX1 + (staticWidthPx || elementWidth);

  // Snap to left edge
  if (Math.abs(newX1) < snapThreshold) {
    newX1 = 0;
    newX2 = newX1 + (staticWidthPx || elementWidth);
  }

  // Snap to right edge (considering control bar width)
  if (Math.abs(newX2 - chartWidth) < snapThreshold) {
    newX2 = chartWidth;
    newX1 = newX2 - elementWidth;
  }

  // Snap to horizontal center
  const centerX = chartWidth / 2;
  const controlBarCenterX = newX1 + elementWidth / 2;
  if (Math.abs(controlBarCenterX - centerX) < snapThreshold) {
    newX1 = centerX - elementWidth / 2;
    newX2 = newX1 + elementWidth;
  }

  // Snap to top edge
  if (Math.abs(newY1) < snapThreshold) {
    newY1 = 0;
  }

  // Snap to bottom edge (considering control bar height)
  if (Math.abs(newY1 + elementHeight - chartHeight) < snapThreshold) {
    newY1 = chartHeight - elementHeight;
  }

  // Snap to vertical center
  const centerY = chartHeight / 2;
  const elementCenterY = newY1 + elementHeight / 2;
  if (Math.abs(elementCenterY - centerY) < snapThreshold) {
    newY1 = centerY - elementHeight / 2;
  }

  const isSnapped =
    newX1 === 0 ||
    newX2 === chartWidth ||
    Math.abs(controlBarCenterX - centerX) < 1 ||
    newY1 === 0 ||
    newY1 === chartHeight - elementHeight ||
    Math.abs(elementCenterY - centerY) < 1;

  return { x1: newX1, x2: newX2, y1: newY1, isSnapped };
};
