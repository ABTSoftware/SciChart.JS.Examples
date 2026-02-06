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
    receiveNextEvent
} from "scichart";
import { CustomPerformanceDebugHelper, SCPerformanceMark, SCPerformanceMeasure } from "./performanceHelperOverrides";

/**
 * Props interface for {@link PerformanceMeasurementModifier}
 */
export interface PerformanceMeasurementModifierProps extends IChartModifierBaseOptions {
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
     * Whether to enable verbose debug mode
     */
    verbose?: boolean;
}

export class PerformanceMeasurementModifier extends CustomChartModifier2D {
    protected isRecording: boolean = false;
    protected endRecordingFn: () => {
        allMarks: SCPerformanceMark[];
        surfaceRelatedMarks: SCPerformanceMark[];
        measures: SCPerformanceMeasure[];
    };
    protected trackedMarkTypes: Array<EPerformanceMarkType | string> = Object.values(EPerformanceMarkType);
    protected autoInvalidate: boolean = false;
    protected verbose: boolean = false;
    protected cleanupControlBar: () => void;

    public controlBarAnnotation: HtmlCustomAnnotation;

    constructor(props?: PerformanceMeasurementModifierProps) {
        super(props);

        this.trackedMarkTypes = props?.trackedMarkTypes ?? this.trackedMarkTypes;
        this.autoInvalidate = props?.autoInvalidate ?? this.autoInvalidate;
        this.verbose = props?.verbose ?? this.verbose;
    }


    public override onAttach(): void {
        super.onAttach();

        PerformanceDebugHelper.instance = new CustomPerformanceDebugHelper();

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
        this.parentSurface.modifierAnnotations.remove(this.controlBarAnnotation);
        this.controlBarAnnotation = null;
    }

    protected createControlBarAnnotation() {
        const initialX = 0;
        const initialY = 0;

        const controlBarAnnotation = new HtmlCustomAnnotation({
            x1: initialX,
            y1: initialY,
            xCoordinateMode: ECoordinateMode.Pixel,
            yCoordinateMode: ECoordinateMode.Pixel,
            clipping: EAnnotationClippingMode.Chart,
            isSelected: false
        });

        let staticWidthPx: number = undefined;
        let initialWidth = staticWidthPx;

        // minWidth for flex-wrap: allow wrapping, but ensure no control is clipped.
        // Now with just buttons (7 buttons * 36px + gaps 6 * 8px + handles 64px + padding 20px)
        // 32 (left handle) + 252 (buttons) + 48 (gaps) + 32 (right handle) + 20 (padding) = 384px
        // Reduced to accommodate smaller layouts: ~320px
        const minWidth = 320;

        let maxWidth = Number.MAX_SAFE_INTEGER;

        // Move logic
        const onDragStart = (props: { startX: number; startY: number }) => {};

        let lastX = initialX;
        let lastY = initialY;

        const onDrag = ({
            controlBar,
            deltaX,
            deltaY
        }: {
            controlBar: HTMLElement;
            deltaX: number;
            deltaY: number;
        }) => {
            // Get chart dimensions for snap assist
            // Use the parent element of the annotation to determine chart dimensions
            const view = translateToNotScaledRect(this.parentSurface.seriesViewRect);

            const annotationBorders = this.controlBarAnnotation.getAnnotationBorders();
            const controlBarWidth = annotationBorders.x2 - annotationBorders.x1;
            const controlBarHeight = annotationBorders.y2 - annotationBorders.y1;

            // Calculate new position
            let newX1 = lastX + deltaX;
            let newY1 = lastY + deltaY;

            // Snap threshold in pixels
            const snapThreshold = 15;

            const elementRect = new Rect(newX1, newY1, controlBarWidth, controlBarHeight);

            const { x1, x2, y1, isSnapped } = applySnapAssist(elementRect, view, snapThreshold, staticWidthPx);

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
            offsetY
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
            const annotationBorders = this.controlBarAnnotation.getAnnotationBorders();
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
            staticWidthPx = this.controlBarAnnotation.x2 - this.controlBarAnnotation.x1;
        };

        // Capture the current tracked mark types
        const currentTrackedMarkTypes = this.trackedMarkTypes;
        const currentAutoInvalidate = this.autoInvalidate;
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
                this.verbose = checked;
            },
            (selected: string[]) => {
                this.trackedMarkTypes = selected as Array<EPerformanceMarkType | string>;
            },
            () => {
                (PerformanceDebugHelper.instance as CustomPerformanceDebugHelper).clear();
            },
            Object.values(EPerformanceMarkType),
            currentTrackedMarkTypes,
            currentAutoInvalidate,
            currentVerbose
        );

        const {
            controlBar,
            recordOnceButton,
            recordToggleButton,
            invalidateButton,
            exportButton,
            exportFilteredButton,
            clearButton,
            autoInvalidateSwitch,
            verboseSwitch,
            markTypesSelect,
            cleanup
        } = result;

        const autoInvalidateSwitchInput = autoInvalidateSwitch.querySelector(
            'input[type="checkbox"]'
        ) as HTMLInputElement;

        const verboseSwitchInput = verboseSwitch.querySelector('input[type="checkbox"]') as HTMLInputElement;

        // Helper function to update switch disabled state
        const updateSwitchState = (switchElement: HTMLLabelElement, input: HTMLInputElement, disabled: boolean) => {
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
            updateSwitchState(autoInvalidateSwitch, autoInvalidateSwitchInput, disabled);
        };

        // Helper function to update verboseSwitch disabled state
        const updateVerboseSwitchState = (disabled: boolean) => {
            updateSwitchState(verboseSwitch, verboseSwitchInput, disabled);
        };

        const updateMarkTypesSelectState = (disabled: boolean) => {
            markTypesSelect.setDisabled(disabled);
        };

        // Helper function to update button disabled state
        const updateButtonState = (button: HTMLButtonElement, disabled: boolean) => {
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
                    const { measures } = this.endRecordingFn();
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

        // Create the click handler function for exportButton
        const exportButtonClickHandler = (e: MouseEvent) => {
            this.exportPerformanceData();
        };

        // Create the click handler function for exportFilteredButton
        const exportFilteredButtonClickHandler = (e: MouseEvent) => {
            this.exportFilteredPerformanceData();
        };

        // Create the click handler function for clearButton
        const clearButtonClickHandler = (e: MouseEvent) => {
            (PerformanceDebugHelper.instance as CustomPerformanceDebugHelper).clear();
        };

        // Add the click handlers to buttons
        recordOnceButton.addEventListener("click", buttonClickHandler);
        recordToggleButton.addEventListener("click", recordToggleButtonClickHandler);
        invalidateButton.addEventListener("click", invalidateButtonClickHandler);
        exportButton.addEventListener("click", exportButtonClickHandler);
        exportFilteredButton.addEventListener("click", exportFilteredButtonClickHandler);
        clearButton.addEventListener("click", clearButtonClickHandler);

        // Store the cleanup function
        this.cleanupControlBar = () => {
            recordOnceButton.removeEventListener("click", buttonClickHandler);
            recordToggleButton.removeEventListener("click", recordToggleButtonClickHandler);
            invalidateButton.removeEventListener("click", invalidateButtonClickHandler);
            exportButton.removeEventListener("click", exportButtonClickHandler);
            exportFilteredButton.removeEventListener("click", exportFilteredButtonClickHandler);
            clearButton.removeEventListener("click", clearButtonClickHandler);
            cleanup();
        };

        // allow the annotation to render at the full width to measure and store it in maxWidth
        receiveNextEvent(this.parentSurface.painted).then(() => {
            const annotationBorders = controlBarAnnotation.getAdornerAnnotationBorders();
            maxWidth = annotationBorders.x2 - annotationBorders.x1;
            controlBar.style.flexWrap = "wrap";
        });

        this.controlBarAnnotation = controlBarAnnotation;
        this.parentSurface.modifierAnnotations.add(this.controlBarAnnotation);
    }

    protected async startRecordingHandler() {
        return (PerformanceDebugHelper.instance as CustomPerformanceDebugHelper).startRecordingPerformance({
            sciChartSurface: this.parentSurface,
            invalidate: this.autoInvalidate,
            keepCollectedData: true,
            trackedMarkTypes: this.trackedMarkTypes,
            verbose: this.verbose
        });
    }

    protected async recordSingleFrameButtonHandler() {
        const { measures } = await (
            PerformanceDebugHelper.instance as CustomPerformanceDebugHelper
        ).recordSingleRedrawRequest({
            sciChartSurface: this.parentSurface,
            invalidate: this.autoInvalidate,
            keepCollectedData: true,
            trackedMarkTypes: this.trackedMarkTypes,
            verbose: this.verbose
        });

        this.outputParsedMeasures(measures);
    }

    protected exportPerformanceData() {
        const performanceInfoData = [PerformanceDebugHelper.toJSON()];

        // Download the data as a JSON file
        const dataStr = JSON.stringify({ performanceInfoData }, null, 2);
        console.log("Performance Debug Logs (All Data)", performanceInfoData);

        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `profiler-data-all-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    protected exportFilteredPerformanceData() {
        const helper = PerformanceDebugHelper.instance as CustomPerformanceDebugHelper;
        const allMarks = helper.getMarks();

        // Filter marks by current surface
        const surfaceRelatedMarks = allMarks.filter(
            (mark) =>
                mark.detail.contextId === this.parentSurface.id ||
                mark.detail.parentContextId === this.parentSurface.id ||
                mark.detail.parentContextId === this.parentSurface.domCanvas2D.id
        );

        // Filter marks by selected mark types
        const filteredMarks = surfaceRelatedMarks.filter((mark) => {
            const markType = mark.name.split(helper.separator)[0].replace(/Start|End/, "");
            return this.trackedMarkTypes.some((type) => {
                const typeStr = type.toString().replace(/Time$/, "");
                return markType === typeStr || mark.name.includes(type.toString());
            });
        });

        // Create the same format as PerformanceDebugHelper.toJSON() but with filtered marks
        const fullData = PerformanceDebugHelper.toJSON();
        const filteredData = {
            ...fullData,
            marks: filteredMarks.map(({ name, startTime, detail }) => ({ name, startTime, detail }))
        };

        const performanceInfoData = [filteredData];

        // Download the data as a JSON file
        const dataStr = JSON.stringify({ performanceInfoData }, null, 2);
        console.log("Performance Debug Logs (Filtered)", performanceInfoData);

        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `profiler-data-filtered-${this.parentSurface.id}-${new Date()
            .toISOString()
            .replace(/[:.]/g, "-")}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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

        const avgDurations = Array.from(measuresByType.entries()).reduce((acc, [key, values]) => {
            const avg = values.reduce((acc, v) => acc + v.duration, 0) / values.length;
            Object.assign(acc, { [key]: Number.parseFloat(avg.toFixed(2)) });
            return acc;
        }, {} as Record<string, number>);

        console.table(avgDurations);
    }
}

const defaultControlBarBoxShadow = "0 2px 8px rgba(0,0,0,0.2)";
const highlightedControlBarBoxShadow = "0 0 0 2px #81a1c1, 0 2px 8px rgba(0,0,0,0.2)";

function generateControlBarHtml(
    root: HTMLElement,
    onDragStart: (props: { controlBar: HTMLElement; startX: number; startY: number }) => void,
    onDrag: (props: { controlBar: HTMLElement; deltaX: number; deltaY: number }) => void,
    onDragEnd: (props: { controlBar: HTMLElement; offsetX: number; offsetY: number }) => void,
    onResizeDragStart: (startX: number, startY: number) => void,
    onResizeDrag: (deltaX: number, deltaY: number) => void,
    onResizeDragEnd: (offsetX: number, offsetY: number) => void,
    onAutoInvalidateSwitchChange: (checked: boolean) => void,
    onVerboseSwitchChange: (checked: boolean) => void,
    onSelectedMarksChange: (selected: string[]) => void,
    onClearButtonClick: () => void,
    availableMarkTypes: Array<EPerformanceMarkType | string>,
    initialTrackedMarkTypes: Array<EPerformanceMarkType | string>,
    initialAutoInvalidate: boolean,
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

    const recordOnceButton = createIconButton(recordSvg, "Record Single Redraw Request");
    const recordToggleButton = createIconButton(recordStartSvg, "Start Recording");
    const invalidateButton = createIconButton(refreshSvg, "Invalidate");
    const exportButton = createIconButton(exportSvg, "Export All Performance Data to JSON");
    const exportFilteredButton = createIconButton(
        exportFilteredSvg,
        "Export Filtered Performance Data (Current Surface & Selected Marks)"
    );
    const clearButton = createIconButton(clearSvg, "Clear Collected Performance Data");
    const settingsButton = createIconButton(settingsSvg, "Settings");

    const buttonGroup = document.createElement("div");
    buttonGroup.style.display = "flex";
    buttonGroup.style.gap = "8px";
    buttonGroup.append(
        recordOnceButton,
        recordToggleButton,
        invalidateButton,
        exportButton,
        exportFilteredButton,
        clearButton,
        settingsButton
    );

    // Create settings dialog
    const dialogResult = createSettingsDialog(
        onAutoInvalidateSwitchChange,
        onVerboseSwitchChange,
        onSelectedMarksChange,
        availableMarkTypes,
        initialTrackedMarkTypes,
        initialAutoInvalidate,
        initialVerbose
    );

    controlBar.append(buttonGroup);
    root.appendChild(controlBar);
    // Append dialog to document body instead of chart root
    document.body.appendChild(dialogResult.dialog);

    // Settings button click handler
    settingsButton.addEventListener("click", (e) => {
        e.stopPropagation();
        dialogResult.open();
    });

    // Create cleanup function
    const cleanup = () => {
        // Remove handle event listener
        handle.removeEventListener("mousedown", handleMouseDown);

        // Remove resize handle event listener
        resizeHandle.removeEventListener("mousedown", resizeHandleMouseDown);

        // Clean up dialog
        dialogResult.cleanup();

        // Remove dialog from document body
        if (dialogResult.dialog.parentNode) {
            dialogResult.dialog.parentNode.removeChild(dialogResult.dialog);
        }
    };

    return {
        controlBar,
        recordOnceButton,
        recordToggleButton,
        invalidateButton,
        exportButton,
        exportFilteredButton,
        clearButton,
        autoInvalidateSwitch: dialogResult.autoInvalidateSwitch,
        verboseSwitch: dialogResult.verboseSwitch,
        markTypesSelect: dialogResult.markTypesSelect,
        handle,
        resizeHandle,
        cleanup
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
const exportSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3V13M10 3L7 6M10 3L13 6" stroke="#81a1c1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 13V15C4 15.5304 4.21071 16.0391 4.58579 16.4142C4.96086 16.7893 5.46957 17 6 17H14C14.5304 17 15.0391 16.7893 15.4142 16.4142C15.7893 16.0391 16 15.5304 16 15V13" stroke="#81a1c1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
const exportFilteredSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3V13M10 3L7 6M10 3L13 6" stroke="#48bb78" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 13V15C4 15.5304 4.21071 16.0391 4.58579 16.4142C4.96086 16.7893 5.46957 17 6 17H14C14.5304 17 15.0391 16.7893 15.4142 16.4142C15.7893 16.0391 16 15.5304 16 15V13" stroke="#48bb78" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="15" cy="5" r="3" fill="#1e2130" stroke="#48bb78" stroke-width="1.5"/>
        <path d="M13.5 5L14.5 6L16.5 4" stroke="#48bb78" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
const clearSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 5H17M8 5V3C8 2.73478 8.10536 2.48043 8.29289 2.29289C8.48043 2.10536 8.73478 2 9 2H11C11.2652 2 11.5196 2.10536 11.7071 2.29289C11.8946 2.48043 12 2.73478 12 3V5M15 5V16C15 16.2652 14.8946 16.5196 14.7071 16.7071C14.5196 16.8946 14.2652 17 14 17H6C5.73478 17 5.48043 16.8946 5.29289 16.7071C5.10536 16.5196 5 16.2652 5 16V5" stroke="#e53e3e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 9V13M12 9V13" stroke="#e53e3e" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
const settingsSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#81a1c1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.1667 12.5C16.0557 12.7513 16.0226 13.0301 16.0717 13.3006C16.1209 13.5711 16.2501 13.8203 16.4417 14.0167L16.4917 14.0667C16.6461 14.221 16.7687 14.4046 16.8527 14.6067C16.9368 14.8089 16.9806 15.0256 16.9806 15.2442C16.9806 15.4628 16.9368 15.6795 16.8527 15.8817C16.7687 16.0838 16.6461 16.2674 16.4917 16.4217C16.3374 16.5761 16.1538 16.6987 15.9517 16.7827C15.7495 16.8668 15.5328 16.9106 15.3142 16.9106C15.0956 16.9106 14.8789 16.8668 14.6767 16.7827C14.4746 16.6987 14.291 16.5761 14.1367 16.4217L14.0867 16.3717C13.8903 16.1801 13.6411 16.0509 13.3706 16.0017C13.1001 15.9526 12.8213 15.9857 12.57 16.0967C12.3234 16.2024 12.1138 16.3784 11.9675 16.6029C11.8213 16.8274 11.7447 17.0908 11.7467 17.36V17.5C11.7467 17.942 11.5711 18.366 11.2585 18.6785C10.946 18.9911 10.522 19.1667 10.08 19.1667C9.63804 19.1667 9.21404 18.9911 8.90148 18.6785C8.58893 18.366 8.41333 17.942 8.41333 17.5V17.425C8.40667 17.1481 8.32136 16.8788 8.16738 16.6497C8.0134 16.4206 7.79716 16.2411 7.54333 16.1317C7.29204 16.0207 7.01321 15.9876 6.74272 16.0367C6.47223 16.0859 6.22304 16.2151 6.02667 16.4067L5.97667 16.4567C5.82236 16.6111 5.63876 16.7337 5.43662 16.8177C5.23448 16.9018 5.01777 16.9456 4.79917 16.9456C4.58057 16.9456 4.36386 16.9018 4.16172 16.8177C3.95958 16.7337 3.77598 16.6111 3.62167 16.4567C3.46729 16.3024 3.34468 16.1188 3.26063 15.9167C3.17658 15.7145 3.13281 15.4978 3.13281 15.2792C3.13281 15.0606 3.17658 14.8439 3.26063 14.6417C3.34468 14.4396 3.46729 14.256 3.62167 14.1017L3.67167 14.0517C3.86326 13.8553 3.99243 13.6061 4.04158 13.3356C4.09073 13.0651 4.05762 12.7863 3.94667 12.535C3.84095 12.2884 3.66498 12.0788 3.44048 11.9325C3.21598 11.7863 2.95258 11.7097 2.68333 11.7117H2.5C2.05797 11.7117 1.63405 11.5361 1.32149 11.2235C1.00893 10.911 0.833333 10.487 0.833333 10.045C0.833333 9.60297 1.00893 9.17905 1.32149 8.86649C1.63405 8.55393 2.05797 8.37833 2.5 8.37833H2.575C2.85186 8.37167 3.12124 8.28636 3.35034 8.13238C3.57944 7.9784 3.75892 7.76216 3.86833 7.50833C3.97929 7.25704 4.0124 6.97821 3.96325 6.70772C3.9141 6.43723 3.78493 6.18804 3.59333 5.99167L3.54333 5.94167C3.38896 5.78736 3.26634 5.60376 3.18229 5.40162C3.09824 5.19948 3.05447 4.98277 3.05447 4.76417C3.05447 4.54557 3.09824 4.32886 3.18229 4.12672C3.26634 3.92458 3.38896 3.74098 3.54333 3.58667C3.69764 3.43229 3.88124 3.30968 4.08338 3.22563C4.28552 3.14158 4.50223 3.09781 4.72083 3.09781C4.93943 3.09781 5.15614 3.14158 5.35828 3.22563C5.56042 3.30968 5.74402 3.43229 5.89833 3.58667L5.94833 3.63667C6.1447 3.82826 6.39389 3.95743 6.66438 4.00658C6.93487 4.05573 7.2137 4.02262 7.465 3.91167H7.54333C7.78995 3.80595 7.99952 3.62998 8.14577 3.40548C8.29202 3.18098 8.36862 2.91758 8.36667 2.64833V2.5C8.36667 2.05797 8.54226 1.63405 8.85482 1.32149C9.16738 1.00893 9.5913 0.833333 10.0333 0.833333C10.4754 0.833333 10.8993 1.00893 11.2118 1.32149C11.5244 1.63405 11.7 2.05797 11.7 2.5V2.575C11.698 2.84425 11.7746 3.10765 11.9209 3.33215C12.0671 3.55665 12.2767 3.73262 12.5233 3.83833C12.7746 3.94929 13.0535 3.9824 13.3239 3.93325C13.5944 3.8841 13.8436 3.75493 14.04 3.56333L14.09 3.51333C14.2443 3.35896 14.4279 3.23634 14.6301 3.15229C14.8322 3.06824 15.0489 3.02447 15.2675 3.02447C15.4861 3.02447 15.7028 3.06824 15.905 3.15229C16.1071 3.23634 16.2907 3.35896 16.445 3.51333C16.5994 3.66764 16.722 3.85124 16.8061 4.05338C16.8901 4.25552 16.9339 4.47223 16.9339 4.69083C16.9339 4.90943 16.8901 5.12614 16.8061 5.32828C16.722 5.53042 16.5994 5.71402 16.445 5.86833L16.395 5.91833C16.2034 6.1147 16.0743 6.36389 16.0251 6.63438C15.976 6.90487 16.0091 7.1837 16.12 7.435V7.51333C16.2257 7.75995 16.4017 7.96952 16.6262 8.11577C16.8507 8.26202 17.1141 8.33862 17.3833 8.33667H17.5C17.942 8.33667 18.366 8.51226 18.6785 8.82482C18.9911 9.13738 19.1667 9.5613 19.1667 10.0033C19.1667 10.4454 18.9911 10.8693 18.6785 11.1818C18.366 11.4944 17.942 11.67 17.5 11.67H17.425C17.1558 11.668 16.8924 11.7446 16.6679 11.8909C16.4434 12.0371 16.2674 12.2467 16.1617 12.4933L16.1667 12.5Z" stroke="#81a1c1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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

function createSwitch(label: string, initialValue: boolean, onToggle: (checked: boolean) => void): HTMLLabelElement {
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

// === Settings Dialog ===
function createSettingsDialog(
    onAutoInvalidateSwitchChange: (checked: boolean) => void,
    onVerboseSwitchChange: (checked: boolean) => void,
    onSelectedMarksChange: (selected: string[]) => void,
    availableMarkTypes: Array<EPerformanceMarkType | string>,
    initialTrackedMarkTypes: Array<EPerformanceMarkType | string>,
    initialAutoInvalidate: boolean,
    initialVerbose: boolean
) {
    // Create dialog overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "none";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "1000";
    overlay.style.pointerEvents = "all";

    // Create dialog container
    const dialog = document.createElement("div");
    dialog.style.background = "#1e2130";
    dialog.style.border = "1px solid #4a5568";
    dialog.style.borderRadius = "12px";
    dialog.style.padding = "24px";
    dialog.style.minWidth = "320px";
    dialog.style.maxWidth = "500px";
    dialog.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
    dialog.style.position = "relative";

    // Dialog title
    const title = document.createElement("h3");
    title.textContent = "Performance Settings";
    title.style.margin = "0 0 20px 0";
    title.style.color = "#e2e8f0";
    title.style.fontSize = "18px";
    title.style.fontWeight = "600";

    // Close button
    const closeButton = document.createElement("button");
    closeButton.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5L5 15M5 5L15 15" stroke="#81a1c1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    closeButton.title = "Close";
    closeButton.style.position = "absolute";
    closeButton.style.top = "16px";
    closeButton.style.right = "16px";
    closeButton.style.padding = "4px";
    closeButton.style.width = "32px";
    closeButton.style.height = "32px";
    closeButton.style.display = "flex";
    closeButton.style.alignItems = "center";
    closeButton.style.justifyContent = "center";
    closeButton.style.background = "transparent";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "6px";
    closeButton.style.cursor = "pointer";
    closeButton.style.transition = "background 0.2s ease";

    closeButton.addEventListener("mouseenter", () => {
        closeButton.style.background = "#2d3748";
    });
    closeButton.addEventListener("mouseleave", () => {
        closeButton.style.background = "transparent";
    });

    // Content container
    const content = document.createElement("div");
    content.style.display = "flex";
    content.style.flexDirection = "column";
    content.style.gap = "16px";

    // Create switches
    const autoInvalidateSwitch = createSwitch("Auto Invalidate", initialAutoInvalidate, onAutoInvalidateSwitchChange);
    const verboseSwitch = createSwitch("Verbose", initialVerbose, onVerboseSwitchChange);

    // Style switches for dialog
    const switchStyle = (switchElement: HTMLLabelElement) => {
        switchElement.style.border = "1px solid #4a5568";
        switchElement.style.borderRadius = "8px";
        switchElement.style.background = "#2d3748";
        switchElement.style.padding = "12px 14px";
        switchElement.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
    };

    switchStyle(autoInvalidateSwitch);
    switchStyle(verboseSwitch);

    // Create multi-select dropdown
    const markTypesSelectResult = createMultiSelectDropdown(
        "Tracked mark types",
        availableMarkTypes,
        onSelectedMarksChange || ((sel) => console.log("Tracked:", sel)),
        initialTrackedMarkTypes
    );

    // Style the dropdown for dialog
    markTypesSelectResult.element.style.border = "1px solid #4a5568";
    markTypesSelectResult.element.style.borderRadius = "8px";
    markTypesSelectResult.element.style.background = "#2d3748";
    markTypesSelectResult.element.style.padding = "12px 14px";
    markTypesSelectResult.element.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";

    content.appendChild(autoInvalidateSwitch);
    content.appendChild(verboseSwitch);
    content.appendChild(markTypesSelectResult.element);

    dialog.appendChild(title);
    dialog.appendChild(closeButton);
    dialog.appendChild(content);
    overlay.appendChild(dialog);

    // Close dialog function
    const closeDialog = () => {
        overlay.style.display = "none";
    };

    // Open dialog function
    const openDialog = () => {
        overlay.style.display = "flex";
    };

    // Close on overlay click
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            closeDialog();
        }
    });

    // Close on button click
    closeButton.addEventListener("click", closeDialog);

    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && overlay.style.display === "flex") {
            closeDialog();
        }
    };
    document.addEventListener("keydown", handleEscape);

    // Cleanup function
    const cleanup = () => {
        document.removeEventListener("keydown", handleEscape);
        if (markTypesSelectResult.documentClickHandler) {
            document.removeEventListener("click", markTypesSelectResult.documentClickHandler);
        }
    };

    return {
        dialog: overlay,
        open: openDialog,
        close: closeDialog,
        autoInvalidateSwitch,
        verboseSwitch,
        markTypesSelect: markTypesSelectResult,
        cleanup
    };
}

const applySnapAssist = (element: Rect, view: Rect, snapThreshold: number, staticWidthPx: number) => {
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
