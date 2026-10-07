import { useRef, useState } from "react";
import { CloseIcon, CopyIcon, DeleteSweepIcon } from "../../../icons";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { DrawingTool, toolGroups } from "./tools";
import { toolIcons } from "./toolIcons";

const ToolIcon = ({ name }: { name: string }) => (
    <span
        className="inline-flex flex-none"
        style={{ width: 28, height: 28 }}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: toolIcons[name].replace("<svg ", '<svg style="width:100%;height:100%" ') }}
    />
);

export default function TradingDrawingTools() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>>(undefined);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const [selectedTool, setSelectedTool] = useState<DrawingTool | undefined>();
    const [search, setSearch] = useState("");
    const [isReady, setIsReady] = useState(false);
    const [hasSelectedAnnotation, setHasSelectedAnnotation] = useState(false);

    const stopTool = () => {
        controlsRef.current?.stopActiveTools();
        setSelectedTool(undefined);
    };
    const selectTool = (tool: DrawingTool) => {
        const controls = controlsRef.current;
        if (!controls) return;
        if (tool.gesture === "erase") controls.startEraser();
        else controls.startTool(tool.annotationType, tool.options);
        setSelectedTool(tool);
        dialogRef.current?.close();
    };
    const syncChartState = () => {
        if (!controlsRef.current?.isToolActive()) setSelectedTool(undefined);
        setHasSelectedAnnotation(
            controlsRef.current?.sciChartSurface.annotations.asArray().some((annotation) => annotation.isSelected) ??
                false
        );
    };
    const query = search.trim().toLowerCase();
    const groups = toolGroups
        .map((group) => ({
            ...group,
            tools: group.tools.filter((tool) => `${group.label} ${tool.label}`.toLowerCase().includes(query)),
        }))
        .filter((group) => group.tools.length);

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row flex-wrap">
                <button
                    type="button"
                    className="sc-button sc-button-outline"
                    disabled={!isReady}
                    aria-haspopup="dialog"
                    onClick={() => {
                        stopTool();
                        setSearch("");
                        dialogRef.current?.showModal();
                        searchRef.current?.focus();
                    }}
                >
                    <ToolIcon name="Pen" /> Drawing tools
                </button>
                {selectedTool && (
                    <>
                        <span className="flex items-center gap-2" style={{ fontSize: 13 }} role="status">
                            <ToolIcon name={selectedTool.icon} />
                            <span>
                                {selectedTool.label} ·{" "}
                                {selectedTool.gesture === "erase"
                                    ? "Click or drag to erase"
                                    : selectedTool.gesture === "drag"
                                    ? "Drag to draw"
                                    : "Click to place points"}
                            </span>
                        </span>
                        <button
                            type="button"
                            className="sc-button sc-button-icon"
                            title="Cancel drawing (Esc)"
                            aria-label="Cancel drawing"
                            onClick={stopTool}
                        >
                            <CloseIcon />
                        </button>
                    </>
                )}
                <div className="flex gap-2 ml-auto">
                    <button
                        type="button"
                        className="sc-button sc-button-icon"
                        disabled={!isReady || !hasSelectedAnnotation}
                        onClick={() => controlsRef.current?.duplicateSelectedAnnotation()}
                        aria-label="Copy selected annotation"
                        title="Duplicate selected annotation (Ctrl/Cmd+D)"
                    >
                        <CopyIcon />
                    </button>
                    <button
                        type="button"
                        className="sc-button sc-button-icon sc-button-danger"
                        disabled={!isReady}
                        aria-label="Delete all annotations"
                        title="Delete all annotations"
                        onClick={() => {
                            stopTool();
                            controlsRef.current?.deleteAllAnnotations();
                        }}
                    >
                        <DeleteSweepIcon />
                    </button>
                </div>
            </header>
            <SciChartReact
                className="flex-1"
                initChart={drawExample}
                onInit={(result: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = result;
                    result.sciChartSurface.rendered.subscribe(syncChartState);
                    syncChartState();
                    setIsReady(true);
                }}
                onDelete={(result: TResolvedReturnType<typeof drawExample>) => {
                    result.sciChartSurface.rendered.unsubscribe(syncChartState);
                    result.dispose();
                    controlsRef.current = undefined;
                }}
            />
            <dialog
                ref={dialogRef}
                className="sc-modal p-0"
                style={{ width: "min(860px, calc(100% - 32px))", margin: "auto", touchAction: "auto" }}
                aria-labelledby="trading-tools-title"
                onClick={(event) => event.target === event.currentTarget && dialogRef.current?.close()}
            >
                <header
                    className="sc-modal-header top-0 sticky pl-4"
                    style={{ background: "var(--sc-background)" }}
                >
                    <strong id="trading-tools-title">Drawing tools</strong>
                    <button
                        type="button"
                        className="sc-button sc-button-icon"
                        aria-label="Close drawing tools"
                        onClick={() => dialogRef.current?.close()}
                    >
                        <CloseIcon />
                    </button>
                </header>
                <div className="sc-modal-body">
                    <input
                        ref={searchRef}
                        type="search"
                        className="sc-input"
                        aria-label="Search drawing tools"
                        placeholder="Search drawing tools…"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        autoFocus
                    />
                    <p className="text-xs">
                        Choose a tool, then draw on the chart. Press Esc to cancel. Select a drawing to move or edit it.
                    </p>
                    {groups.map((group) => (
                        <section key={group.label}>
                            <h3 style={{ margin: "5px 3px", fontSize: 14, fontWeight: 600 }}>{group.label}</h3>
                            <div
                                className="gap-2"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
                                }}
                            >
                                {group.tools.map((tool) => (
                                    <button
                                        type="button"
                                        key={tool.label}
                                        className="sc-button sc-button-outline justify-start"
                                        onClick={() => selectTool(tool)}
                                    >
                                        <ToolIcon name={tool.icon} />
                                        <span>{tool.label}</span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    ))}
                    {!groups.length && <p role="status">No tools match “{search}”.</p>}
                </div>
            </dialog>
        </div>
    );
}
