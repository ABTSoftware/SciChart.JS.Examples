import { SciChartSurface, Rect } from "scichart";
import { AxisSynchroniser } from "./chartManager";

/**
 * LayoutManager handles all layout-related operations and UI controls
 */
export class LayoutManager {
    private panelSizes: number[] = [];
    private chartOrder: number[] = [];
    private isDragging = false;
    private activeSplitter: HTMLDivElement | null = null;
    private dragStartY = 0;
    private dragStartSizes: number[] = [];
    
    // Full-screen state management
    private isFullScreen = false;
    private fullScreenChartIndex = -1;
    private originalPanelSizes: number[] = [];
    private originalChartOrder: number[] = [];
    
    // Callback for resize events
    private onPanelResize?: (visualIndex: number, oldSize: number, newSize: number, splitterIndex: number) => void;
    
    // Debouncing for resize callbacks
    private resizeDebounceTimeout: number | null = null;
    private pendingResizeCallbacks: Array<{
        visualIndex: number;
        oldSize: number;
        newSize: number;
        splitterIndex: number;
    }> = [];
    private readonly RESIZE_DEBOUNCE_DELAY = 100; // milliseconds

    constructor(private containerElement: HTMLElement) {
        this.setupContainerForGrid();
    }

    /**
     * Set up the container for CSS Grid layout
     */
    private setupContainerForGrid(): void {
        if (this.containerElement) {
            this.containerElement.style.display = "grid";
            this.containerElement.style.gridTemplateColumns = "1fr";
        }
    }

    /**
     * Get current panel sizes
     */
    getPanelSizes(): number[] {
        return [...this.panelSizes];
    }

    /**
     * Get current chart order
     */
    getChartOrder(): number[] {
        return [...this.chartOrder];
    }

    /**
     * Initialize panel sizes for a given number of charts
     */
    initializePanelSizes(chartCount: number, positions?: { height: number }[]): void {
        if (positions && positions.length === chartCount) {
            this.panelSizes = positions.map(pos => pos.height);
        } else {
            // Equal distribution
            const equalSize = 1 / chartCount;
            this.panelSizes = Array(chartCount).fill(equalSize);
        }
        
        // Initialize chart order
        this.chartOrder = Array.from({ length: chartCount }, (_, i) => i);
    }

    /**
     * Add a new panel with specified height
     */
    addPanel(height?: number): void {
        if (this.panelSizes.length === 0) {
            const initialSize = height ?? 1;
            this.panelSizes.push(initialSize);
        } else {
            if (height) {
                // Normalize existing panels to make room for new panel
                const totalExistingSize = this.panelSizes.reduce((a, b) => a + b, 0);
                const availableSpace = 1 - height;
                const scaleFactor = availableSpace / totalExistingSize;
                this.panelSizes = this.panelSizes.map((size) => size * scaleFactor);
                this.panelSizes.push(height);
            } else {
                // Resize existing panels and add new one with equal distribution
                const chartCount = this.panelSizes.length;
                const newSize = 1 / (chartCount + 1);
                this.panelSizes = this.panelSizes.map((size) => size * (chartCount / (chartCount + 1)));
                this.panelSizes.push(newSize);
            }
        }

        // Update chart order to include the new chart
        this.chartOrder.push(this.panelSizes.length - 1);
    }

    /**
     * Remove a panel at the specified visual index
     */
    removePanel(visualIndex: number): void {
        if (visualIndex < 0 || visualIndex >= this.panelSizes.length) return;

        // Remove panel size
        this.panelSizes.splice(visualIndex, 1);

        // Update chartOrder - remove the chart and adjust indices
        const removedChartIndex = this.chartOrder[visualIndex];
        this.chartOrder.splice(visualIndex, 1);
        // Adjust remaining indices that are greater than the removed chart index
        this.chartOrder = this.chartOrder.map((chartIndex) => 
            chartIndex > removedChartIndex ? chartIndex - 1 : chartIndex
        );

        // Normalize remaining panel sizes
        if (this.panelSizes.length > 0) {
            const totalSize = this.panelSizes.reduce((a, b) => a + b, 0);
            this.panelSizes = this.panelSizes.map((size) => size / totalSize);
        }
    }

    /**
     * Update chart positions using SciChartSubSurface.subPosition
     */
    updateChartPositions(parentSciChartSurface: SciChartSurface): void {
        let currentY = 0;
        for (let i = 0; i < this.panelSizes.length; i++) {
            // Use chartOrder to get the correct chart for this position
            const chartIndex = this.chartOrder.length > 0 ? this.chartOrder[i] : i;
            if (chartIndex < parentSciChartSurface.subCharts.length) {
                const chart = parentSciChartSurface.subCharts[chartIndex];
                chart.subPosition = new Rect(0, currentY, 1, this.panelSizes[i]);
                currentY += this.panelSizes[i];
            }
        }
    }

    /**
     * Update the container's grid template rows based on panel sizes
     */
    updateGridTemplate(): void {
        if (!this.containerElement) return;

        // Create grid template with panels and splitters
        const gridRows: string[] = [];

        for (let i = 0; i < this.panelSizes.length; i++) {
            gridRows.push(`${this.panelSizes[i] * 100}%`);

            // Add splitter row between panels (except after the last panel)
            if (i < this.panelSizes.length - 1) {
                gridRows.push("0px");
            }
        }

        this.containerElement.style.gridTemplateRows = gridRows.join(" ");
    }

    /**
     * Create a splitter element
     */
    private createSplitter(index: number): HTMLDivElement | null {
        if (typeof document === "undefined") {
            console.error("Document is not available - cannot create splitter element");
            return null;
        }

        try {
            const splitter = document.createElement("div");
            if (!splitter) {
                console.error("Failed to create splitter element");
                return null;
            }

            splitter.className = "grid-splitter";
            splitter.dataset.index = index.toString();

            // Add accessibility attributes
            splitter.setAttribute("role", "separator");
            splitter.setAttribute("aria-label", `Chart pane splitter ${index + 1}`);
            splitter.setAttribute("title", "Drag to resize chart panes");

            return splitter;
        } catch (error) {
            console.error("Error creating splitter element:", error);
            return null;
        }
    }

    /**
     * Set up event handlers for grid splitter dragging
     */
    private setupSplitterEvents(
        splitter: HTMLDivElement,
        parentSciChartSurface: SciChartSurface,
        axisSynchronizer: AxisSynchroniser
    ): void {
        const splitterIndex = parseInt(splitter.dataset.index!);

        splitter.addEventListener("mousedown", (e) => {
            e.preventDefault();
            this.isDragging = true;
            this.activeSplitter = splitter;
            this.dragStartY = e.clientY;
            this.dragStartSizes = [...this.panelSizes];
            document.body.style.userSelect = "none";
            document.body.style.cursor = "row-resize";

            document.addEventListener("mousemove", this.handleMouseMove);
            document.addEventListener("mouseup", this.handleMouseUp);
        });
    }

    private handleMouseMove = (e: MouseEvent) => {
        if (!this.isDragging || !this.activeSplitter || !this.containerElement) return;

        const rect = this.containerElement.getBoundingClientRect();
        const deltaY = e.clientY - this.dragStartY;
        const deltaRatio = deltaY / rect.height;

        const splitterIndex = parseInt(this.activeSplitter.dataset.index!);
        const upperPanelIndex = splitterIndex;
        const lowerPanelIndex = splitterIndex + 1;

        // Store old sizes for callback
        const oldUpperSize = this.panelSizes[upperPanelIndex];
        const oldLowerSize = this.panelSizes[lowerPanelIndex];

        // Calculate new sizes based on drag delta
        const newUpperSize = Math.max(0.1, Math.min(0.9, this.dragStartSizes[upperPanelIndex] + deltaRatio));
        const newLowerSize = Math.max(0.1, Math.min(0.9, this.dragStartSizes[lowerPanelIndex] - deltaRatio));

        // Ensure minimum sizes (10% each)
        if (newUpperSize >= 0.1 && newLowerSize >= 0.1) {
            this.panelSizes[upperPanelIndex] = newUpperSize;
            this.panelSizes[lowerPanelIndex] = newLowerSize;

            // Queue resize callbacks if sizes actually changed (debounced)
            if (Math.abs(oldUpperSize - newUpperSize) > 0.001) {
                this.queueResizeCallback(upperPanelIndex, oldUpperSize, newUpperSize, splitterIndex);
            }
            if (Math.abs(oldLowerSize - newLowerSize) > 0.001) {
                this.queueResizeCallback(lowerPanelIndex, oldLowerSize, newLowerSize, splitterIndex);
            }

            // Trigger layout update through callback
            this.onLayoutChange?.();
        }
    };

    private handleMouseUp = () => {
        this.isDragging = false;
        this.activeSplitter = null;
        document.body.style.userSelect = "";
        document.body.style.cursor = "";

        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
    };

    // Callback for layout changes
    private onLayoutChange?: () => void;

    /**
     * Set callback for layout changes
     */
    setLayoutChangeCallback(callback: () => void): void {
        this.onLayoutChange = callback;
    }

    /**
     * Queue a resize callback for debounced execution
     */
    private queueResizeCallback(visualIndex: number, oldSize: number, newSize: number, splitterIndex: number): void {
        // Add to pending callbacks
        this.pendingResizeCallbacks.push({
            visualIndex,
            oldSize,
            newSize,
            splitterIndex
        });

        // Clear existing timeout
        if (this.resizeDebounceTimeout !== null) {
            clearTimeout(this.resizeDebounceTimeout);
        }

        // Set new timeout
        this.resizeDebounceTimeout = window.setTimeout(() => {
            this.flushResizeCallbacks();
            this.resizeDebounceTimeout = null;
        }, this.RESIZE_DEBOUNCE_DELAY);
    }

    /**
     * Execute all pending resize callbacks
     */
    private flushResizeCallbacks(): void {
        if (!this.onPanelResize || this.pendingResizeCallbacks.length === 0) {
            this.pendingResizeCallbacks = [];
            return;
        }

        // Group callbacks by visualIndex to get the final state for each panel
        const finalCallbacks = new Map<number, {
            visualIndex: number;
            oldSize: number;
            newSize: number;
            splitterIndex: number;
        }>();

        // Keep the first oldSize and last newSize for each panel
        for (const callback of this.pendingResizeCallbacks) {
            const existing = finalCallbacks.get(callback.visualIndex);
            if (existing) {
                // Keep original oldSize, update to latest newSize
                finalCallbacks.set(callback.visualIndex, {
                    ...callback,
                    oldSize: existing.oldSize
                });
            } else {
                finalCallbacks.set(callback.visualIndex, callback);
            }
        }

        // Execute the final callbacks
        for (const callback of finalCallbacks.values()) {
            this.onPanelResize(callback.visualIndex, callback.oldSize, callback.newSize, callback.splitterIndex);
        }

        // Clear pending callbacks
        this.pendingResizeCallbacks = [];
    }

    /**
     * Set callback for panel resize events
     */
    setPanelResizeCallback(callback: (visualIndex: number, oldSize: number, newSize: number, splitterIndex: number) => void): void {
        this.onPanelResize = callback;
    }

    /**
     * Rebuild all splitters with correct positioning
     */
    rebuildSplitters(parentSciChartSurface: SciChartSurface, axisSynchronizer: AxisSynchroniser): void {
        if (!this.containerElement) {
            console.warn("Container element not available for splitter rebuild");
            return;
        }

        // Remove all existing splitters
        this.containerElement.querySelectorAll(".grid-splitter").forEach((splitter) => splitter.remove());

        // Create splitters between charts (n-1 splitters for n charts)
        const chartCount = parentSciChartSurface.subCharts?.length ?? 0;

        // Ensure we have at least 2 charts before creating splitters
        if (chartCount < 2) {
            return;
        }

        for (let i = 0; i < chartCount - 1; i++) {
            try {
                const splitter = this.createSplitter(i);
                if (splitter) {
                    splitter.style.gridRow = `${2 * i + 2}`;
                    this.containerElement.appendChild(splitter);
                    this.setupSplitterEvents(splitter, parentSciChartSurface, axisSynchronizer);
                } else {
                    console.error(`Failed to create splitter at index ${i}`);
                }
            } catch (error) {
                console.error(`Error creating splitter at index ${i}:`, error);
            }
        }

        // Verify splitters were created correctly
        const actualSplitterCount = this.containerElement.querySelectorAll(".grid-splitter").length;
        const expectedSplitterCount = chartCount - 1;

        if (actualSplitterCount !== expectedSplitterCount) {
            console.warn(`Splitter count mismatch: expected ${expectedSplitterCount}, got ${actualSplitterCount}`);
        }
    }

    /**
     * Move a chart up in the visual order
     */
    moveChartUp(visualIndex: number): boolean {
        if (visualIndex <= 0 || visualIndex >= this.chartOrder.length) return false;

        // Swap panel sizes to reflect the new order
        [this.panelSizes[visualIndex - 1], this.panelSizes[visualIndex]] = 
        [this.panelSizes[visualIndex], this.panelSizes[visualIndex - 1]];

        // Swap the chart order
        [this.chartOrder[visualIndex - 1], this.chartOrder[visualIndex]] = 
        [this.chartOrder[visualIndex], this.chartOrder[visualIndex - 1]];

        return true;
    }

    /**
     * Move a chart down in the visual order
     */
    moveChartDown(visualIndex: number): boolean {
        if (visualIndex < 0 || visualIndex >= this.chartOrder.length - 1) return false;

        // Swap panel sizes to reflect the new order
        [this.panelSizes[visualIndex], this.panelSizes[visualIndex + 1]] = 
        [this.panelSizes[visualIndex + 1], this.panelSizes[visualIndex]];

        // Swap the chart order
        [this.chartOrder[visualIndex], this.chartOrder[visualIndex + 1]] = 
        [this.chartOrder[visualIndex + 1], this.chartOrder[visualIndex]];

        return true;
    }

    /**
     * Enter full-screen mode for a specific chart
     */
    enterFullScreen(visualIndex: number): void {
        if (this.isFullScreen) return; // Already in full-screen mode

        // Store current state
        this.originalPanelSizes = [...this.panelSizes];
        this.originalChartOrder = [...this.chartOrder];
        
        // Set full-screen state
        this.isFullScreen = true;
        this.fullScreenChartIndex = visualIndex;

        // Hide all splitters
        if (this.containerElement) {
            this.containerElement.querySelectorAll(".grid-splitter").forEach((splitter) => {
                (splitter as HTMLElement).style.display = "none";
            });
        }

        // Set panel sizes for full-screen mode
        for (let i = 0; i < this.chartOrder.length; i++) {
            if (i === visualIndex) {
                // Show the selected chart at full height
                this.panelSizes[i] = 1;
            } else {
                // Completely hide other charts
                this.panelSizes[i] = 0;
            }
        }
    }

    /**
     * Exit full-screen mode
     */
    exitFullScreen(): void {
        if (!this.isFullScreen) return; // Not in full-screen mode

        // Restore original state
        this.panelSizes = [...this.originalPanelSizes];
        this.chartOrder = [...this.originalChartOrder];
        
        // Reset full-screen state
        this.isFullScreen = false;
        this.fullScreenChartIndex = -1;

        // Show all splitters
        if (this.containerElement) {
            this.containerElement.querySelectorAll(".grid-splitter").forEach((splitter) => {
                (splitter as HTMLElement).style.display = "flex";
            });
        }
    }

    /**
     * Toggle full-screen mode for a specific chart
     */
    toggleFullScreen(visualIndex: number): void {
        if (this.isFullScreen && this.fullScreenChartIndex === visualIndex) {
            this.exitFullScreen();
        } else {
            this.enterFullScreen(visualIndex);
        }
    }

    /**
     * Check if currently in full-screen mode
     */
    isInFullScreen(): boolean {
        return this.isFullScreen;
    }

    /**
     * Get the current full-screen chart index
     */
    getFullScreenChartIndex(): number {
        return this.fullScreenChartIndex;
    }

    /**
     * Clean up resources
     */
    cleanup(): void {
        // Clear any pending resize debounce timeout
        if (this.resizeDebounceTimeout !== null) {
            clearTimeout(this.resizeDebounceTimeout);
            this.resizeDebounceTimeout = null;
        }
        
        // Clear pending resize callbacks
        this.pendingResizeCallbacks = [];

        // Remove all splitters and control buttons
        if (this.containerElement) {
            this.containerElement.querySelectorAll(".grid-splitter").forEach((splitter) => splitter.remove());
            this.containerElement.querySelectorAll(".chart-close-button").forEach((button) => button.remove());
            this.containerElement.querySelectorAll(".chart-move-button").forEach((button) => button.remove());
            this.containerElement.querySelectorAll(".chart-fullscreen-button").forEach((button) => button.remove());
        }

        // Reset state
        this.panelSizes = [];
        this.chartOrder = [];
        this.isFullScreen = false;
        this.fullScreenChartIndex = -1;
        this.originalPanelSizes = [];
        this.originalChartOrder = [];

        // Remove event listeners
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
    }
}