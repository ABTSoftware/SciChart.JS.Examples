import { SciChartSurface } from "scichart";

/**
 * ControlsManager handles all UI control buttons (close, move, fullscreen)
 */
export class ControlsManager {
    constructor(private containerElement: HTMLElement) {}

    /**
     * Create and add control buttons for a chart
     */
    addControlButtons(
        visualIndex: number,
        actualChartIndex: number,
        parentSciChartSurface: SciChartSurface,
        panelSizes: number[],
        isFullScreen: boolean,
        fullScreenChartIndex: number,
        onClose: (visualIndex: number) => void,
        onMoveUp: (visualIndex: number) => void,
        onMoveDown: (visualIndex: number) => void,
        onToggleFullScreen: (visualIndex: number) => void
    ): void {
        const chartCount = parentSciChartSurface.subCharts.length;

        // Create full-screen button (disable when there's only one chart)
        const fullScreenBtn = this.createFullScreenButton(
            visualIndex,
            isFullScreen,
            fullScreenChartIndex,
            chartCount,
            onToggleFullScreen
        );

        // Create close button - only show if more than 1 chart and not in full-screen
        let closeBtn: HTMLButtonElement | null = null;
        if (chartCount > 1 && !isFullScreen) {
            closeBtn = this.createCloseButton(visualIndex, actualChartIndex, onClose);
        }

        // Create move buttons - only show if not in full-screen
        let moveUpBtn: HTMLButtonElement | null = null;
        let moveDownBtn: HTMLButtonElement | null = null;
        if (!isFullScreen) {
            moveUpBtn = this.createMoveUpButton(visualIndex, chartCount, onMoveUp);
            moveDownBtn = this.createMoveDownButton(visualIndex, chartCount, onMoveDown);
        }

        // Add buttons to the container element
        this.containerElement.appendChild(fullScreenBtn);
        if (closeBtn) this.containerElement.appendChild(closeBtn);
        if (moveUpBtn) this.containerElement.appendChild(moveUpBtn);
        if (moveDownBtn) this.containerElement.appendChild(moveDownBtn);

        // Position the buttons relative to the visual position
        this.positionButtons(visualIndex, panelSizes, fullScreenBtn, closeBtn, moveUpBtn, moveDownBtn);
    }

    /**
     * Create full-screen button
     */
    private createFullScreenButton(
        visualIndex: number,
        isFullScreen: boolean,
        fullScreenChartIndex: number,
        chartCount: number,
        onToggleFullScreen: (visualIndex: number) => void
    ): HTMLButtonElement {
        const fullScreenBtn = document.createElement("button");
        fullScreenBtn.className = "chart-fullscreen-button";
        fullScreenBtn.innerHTML = isFullScreen && fullScreenChartIndex === visualIndex ? "⤓" : "⤢";
        fullScreenBtn.dataset.visualIndex = visualIndex.toString();
        fullScreenBtn.title = isFullScreen && fullScreenChartIndex === visualIndex ? "Exit full screen" : "Full screen";
        fullScreenBtn.disabled = chartCount <= 1; // Disable when there's only one chart

        fullScreenBtn.onclick = (e) => {
            e.stopPropagation();
            if (!fullScreenBtn.disabled) {
                onToggleFullScreen(parseInt(fullScreenBtn.dataset.visualIndex!));
            }
        };

        return fullScreenBtn;
    }

    /**
     * Create close button
     */
    private createCloseButton(
        visualIndex: number,
        actualChartIndex: number,
        onClose: (visualIndex: number) => void
    ): HTMLButtonElement {
        const closeBtn = document.createElement("button");
        closeBtn.className = "chart-close-button";
        closeBtn.innerHTML = "×";
        closeBtn.dataset.chartIndex = actualChartIndex.toString();
        closeBtn.dataset.visualIndex = visualIndex.toString();
        closeBtn.title = "Close chart";

        closeBtn.onclick = (e) => {
            e.stopPropagation();
            onClose(parseInt(closeBtn.dataset.visualIndex!));
        };

        return closeBtn;
    }

    /**
     * Create move up button
     */
    private createMoveUpButton(
        visualIndex: number,
        chartCount: number,
        onMoveUp: (visualIndex: number) => void
    ): HTMLButtonElement {
        const moveUpBtn = document.createElement("button");
        moveUpBtn.className = "chart-move-button chart-move-up";
        moveUpBtn.innerHTML = "↑";
        moveUpBtn.dataset.visualIndex = visualIndex.toString();
        moveUpBtn.title = "Move chart up";
        moveUpBtn.disabled = visualIndex === 0; // Disable if it's the first chart visually

        moveUpBtn.onclick = (e) => {
            e.stopPropagation();
            onMoveUp(parseInt(moveUpBtn.dataset.visualIndex!));
        };

        return moveUpBtn;
    }

    /**
     * Create move down button
     */
    private createMoveDownButton(
        visualIndex: number,
        chartCount: number,
        onMoveDown: (visualIndex: number) => void
    ): HTMLButtonElement {
        const moveDownBtn = document.createElement("button");
        moveDownBtn.className = "chart-move-button chart-move-down";
        moveDownBtn.innerHTML = "↓";
        moveDownBtn.dataset.visualIndex = visualIndex.toString();
        moveDownBtn.title = "Move chart down";
        moveDownBtn.disabled = visualIndex === chartCount - 1; // Disable if it's the last chart visually

        moveDownBtn.onclick = (e) => {
            e.stopPropagation();
            onMoveDown(parseInt(moveDownBtn.dataset.visualIndex!));
        };

        return moveDownBtn;
    }

    /**
     * Position buttons relative to their chart panels
     */
    private positionButtons(
        visualIndex: number,
        panelSizes: number[],
        fullScreenBtn: HTMLButtonElement,
        closeBtn: HTMLButtonElement | null,
        moveUpBtn: HTMLButtonElement | null,
        moveDownBtn: HTMLButtonElement | null
    ): void {
        const yPos = panelSizes.slice(0, visualIndex).reduce((a, b) => a + b, 0);
        const topPosition = `calc(${yPos * 100}% + 10px)`;

        fullScreenBtn.style.top = topPosition;
        if (closeBtn) closeBtn.style.top = topPosition;
        if (moveUpBtn) moveUpBtn.style.top = topPosition;
        if (moveDownBtn) moveDownBtn.style.top = topPosition;
    }

    /**
     * Remove all control buttons
     */
    removeAllButtons(): void {
        if (!this.containerElement) return;

        this.containerElement.querySelectorAll(".chart-close-button").forEach((btn) => btn.remove());
        this.containerElement.querySelectorAll(".chart-move-button").forEach((btn) => btn.remove());
        this.containerElement.querySelectorAll(".chart-fullscreen-button").forEach((btn) => btn.remove());
    }

    /**
     * Update all control buttons based on current state
     */
    updateAllButtons(
        parentSciChartSurface: SciChartSurface,
        chartOrder: number[],
        panelSizes: number[],
        isFullScreen: boolean,
        fullScreenChartIndex: number,
        onClose: (visualIndex: number) => void,
        onMoveUp: (visualIndex: number) => void,
        onMoveDown: (visualIndex: number) => void,
        onToggleFullScreen: (visualIndex: number) => void
    ): void {
        // Remove all existing control buttons
        this.removeAllButtons();

        // Initialize chartOrder if not already done
        if (chartOrder.length === 0) {
            chartOrder = Array.from({ length: parentSciChartSurface.subCharts.length }, (_, i) => i);
        }

        // Create buttons based on visual order (always show full-screen button)
        for (let visualIndex = 0; visualIndex < chartOrder.length; visualIndex++) {
            const actualChartIndex = chartOrder[visualIndex];
            
            // Only show this chart's buttons if it's visible (not hidden in full-screen mode)
            if (!isFullScreen || fullScreenChartIndex === visualIndex) {
                this.addControlButtons(
                    visualIndex,
                    actualChartIndex,
                    parentSciChartSurface,
                    panelSizes,
                    isFullScreen,
                    fullScreenChartIndex,
                    onClose,
                    onMoveUp,
                    onMoveDown,
                    onToggleFullScreen
                );
            }
        }
    }
}