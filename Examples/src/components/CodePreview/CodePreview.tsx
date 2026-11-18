import {
    Component,
    FC,
    lazy,
    ReactNode,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent,
    type PointerEvent as ReactPointerEvent,
} from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/light";
import ts from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml";
import { EPageFramework, FRAMEWORK_NAME } from "../../helpers/shared/Helpers/frameworkParametrization";
import { ETheme, type ExampleSourceFile } from "../../helpers/types/types";
import { _useContext } from "../../helpers/shared/Helpers/Context";
import "react-syntax-highlighter/dist/esm/styles/hljs/dark";
import { FileExplorer, FileIcon } from "./FileExplorer";
import { createProjectZip, getDefaultSourceFile } from "./projectFiles";
import { ConsoleDrawer } from "../LivePreview/ConsoleDrawer";
import { countErrors, type ConsoleEntry } from "../LivePreview/consoleLog";
import { ConfirmDialog } from "../CodeSandbox/components/ConfirmDialog";
import { hasDraft, isEditableFile, LIVE_EDIT_MESSAGES, type LiveEditAvailability } from "./liveEditing";

const noop = (): void => undefined;
const loadCodeMirrorEditor = (): Promise<typeof import("./CodeMirrorEditor")> => import("./CodeMirrorEditor");
const CodeMirrorEditor = lazy(loadCodeMirrorEditor);

/** Shows the fallback when the editor chunk fails to load, so editing still works with a plain textarea. */
class EditorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    render() {
        return this.state.failed ? this.props.fallback : this.props.children;
    }
}

const EditorLanguageMap: Record<string, string> = {
    ts: "typescript",
    js: "javascript",
    css: "css",
    html: "html",
    jsx: "javascript",
    tsx: "typescript",
    csv: "csv",
    json: "json",
};

SyntaxHighlighter.registerLanguage("typescript", ts);
SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("xml", xml);
SyntaxHighlighter.registerLanguage("html", xml);

const DarkStyles: Record<string, CSSProperties> = {
    hljs: {
        display: "block",
        overflowX: "auto",
        padding: "0.25em",
        background: "#121212", // feel free to change to match var(--bg)
        color: "#DCDCDC",
    },
    "hljs-keyword": {
        color: "#569CD6",
    },
    "hljs-literal": {
        color: "#569CD6",
    },
    "hljs-symbol": {
        color: "#569CD6",
    },
    "hljs-name": {
        color: "#569CD6",
    },
    "hljs-link": {
        color: "#569CD6",
        textDecoration: "underline",
    },
    "hljs-built_in": {
        color: "#4EC9B0",
    },
    "hljs-type": {
        color: "#4EC9B0",
    },
    "hljs-number": {
        color: "#B8D7A3",
    },
    "hljs-class": {
        color: "#B8D7A3",
    },
    "hljs-string": {
        color: "#D69D85",
    },
    "hljs-meta-string": {
        color: "#D69D85",
    },
    "hljs-regexp": {
        color: "#9A5334",
    },
    "hljs-template-tag": {
        color: "#9A5334",
    },
    "hljs-subst": {
        color: "#DCDCDC",
    },
    "hljs-function": {
        color: "#DCDCDC",
    },
    "hljs-title": {
        color: "#DCDCDC",
    },
    "hljs-params": {
        color: "#DCDCDC",
    },
    "hljs-formula": {
        color: "#DCDCDC",
    },
    "hljs-comment": {
        color: "#57A64A",
        fontStyle: "italic",
    },
    "hljs-quote": {
        color: "#57A64A",
        fontStyle: "italic",
    },
    "hljs-doctag": {
        color: "#608B4E",
    },
    "hljs-meta": {
        color: "#9B9B9B",
    },
    "hljs-meta-keyword": {
        color: "#9B9B9B",
    },
    "hljs-tag": {
        color: "#9B9B9B",
    },
    "hljs-variable": {
        color: "#BD63C5",
    },
    "hljs-template-variable": {
        color: "#BD63C5",
    },
    "hljs-attr": {
        color: "#9CDCFE",
    },
    "hljs-attribute": {
        color: "#9CDCFE",
    },
    "hljs-builtin-name": {
        color: "#9CDCFE",
    },
    "hljs-section": {
        color: "gold",
    },
    "hljs-emphasis": {
        fontStyle: "italic",
    },
    "hljs-strong": {
        fontWeight: "bold",
    },
    "hljs-bullet": {
        color: "#D7BA7D",
    },
    "hljs-selector-tag": {
        color: "#D7BA7D",
    },
    "hljs-selector-id": {
        color: "#D7BA7D",
    },
    "hljs-selector-class": {
        color: "#D7BA7D",
    },
    "hljs-selector-attr": {
        color: "#D7BA7D",
    },
    "hljs-selector-pseudo": {
        color: "#D7BA7D",
    },
    "hljs-addition": {
        backgroundColor: "#144212",
        display: "inline-block",
        width: "100%",
    },
    "hljs-deletion": {
        backgroundColor: "#600",
        display: "inline-block",
        width: "100%",
    },
};

const LightStyles: Record<string, CSSProperties> = {
    hljs: {
        display: "block",
        overflowX: "auto",
        padding: "0.25em",
        background: "white",
        color: "black",
    },
    "hljs-comment": {
        color: "#008000",
    },
    "hljs-quote": {
        color: "#008000",
    },
    "hljs-variable": {
        color: "#008000",
    },
    "hljs-keyword": {
        color: "#00f",
    },
    "hljs-selector-tag": {
        color: "#00f",
    },
    "hljs-built_in": {
        color: "#00f",
    },
    "hljs-name": {
        color: "#00f",
    },
    "hljs-tag": {
        color: "#00f",
    },
    "hljs-string": {
        color: "#a31515",
    },
    "hljs-title": {
        color: "#a31515",
    },
    "hljs-section": {
        color: "#a31515",
    },
    "hljs-attribute": {
        color: "#a31515",
    },
    "hljs-literal": {
        color: "#a31515",
    },
    "hljs-template-tag": {
        color: "#a31515",
    },
    "hljs-template-variable": {
        color: "#a31515",
    },
    "hljs-type": {
        color: "#a31515",
    },
    "hljs-addition": {
        color: "#a31515",
    },
    "hljs-deletion": {
        color: "#2b91af",
    },
    "hljs-selector-attr": {
        color: "#2b91af",
    },
    "hljs-selector-pseudo": {
        color: "#2b91af",
    },
    "hljs-meta": {
        color: "#2b91af",
    },
    "hljs-doctag": {
        color: "#808080",
    },
    "hljs-attr": {
        color: "#f00",
    },
    "hljs-symbol": {
        color: "#00b0e8",
    },
    "hljs-bullet": {
        color: "#00b0e8",
    },
    "hljs-link": {
        color: "#00b0e8",
    },
    "hljs-emphasis": {
        fontStyle: "italic",
    },
    "hljs-strong": {
        fontWeight: "bold",
    },
};

export type LiveEditControls = {
    availability: LiveEditAvailability["status"];
    autoRun: boolean;
    onAutoRunChange: (autoRun: boolean) => void;
    onRun: () => void;
    /** The pointer entered the editor: a good moment to start downloading the runtime. */
    onPrepare: () => void;
    /** With auto-run off: the draft has changed since the last run, so the play button shows. */
    runPending: boolean;
};

export type CodeEditorProps = {
    files: ExampleSourceFile[];
    framework: EPageFramework;
    examplePath: string;
    onFilesChange?: (files: ExampleSourceFile[]) => void;
    live?: LiveEditControls;
    /** Output of the live preview's current run, or null while no preview is running. */
    consoleEntries?: ConsoleEntry[] | null;
};

export const CodePreview: FC<CodeEditorProps> = ({
    files,
    framework,
    examplePath,
    onFilesChange,
    live,
    consoleEntries = null,
}) => {
    const { state } = _useContext();
    const [draftFiles, setDraftFiles] = useState(files);
    const [selectedName, setSelectedName] = useState(() => getDefaultSourceFile(files)?.name);
    const [isEditing, setIsEditing] = useState(false);
    const [showExplorer, setShowExplorer] = useState(true);
    const [notice, setNotice] = useState<string | null>(null);
    const [confirmReset, setConfirmReset] = useState(false);
    const prepared = useRef(false);
    const [consoleOpen, setConsoleOpen] = useState(false);
    const errorCount = consoleEntries ? countErrors(consoleEntries) : 0;
    const previousErrorCount = useRef(0);
    useEffect(() => {
        // The drawer opens on the first error and stays as the visitor leaves it.
        if (previousErrorCount.current === 0 && errorCount > 0) setConsoleOpen(true);
        previousErrorCount.current = errorCount;
    }, [errorCount]);
    const editorRef = useRef<HTMLElement>(null);
    const gutterRef = useRef<HTMLPreElement>(null);
    const editToggleRef = useRef<HTMLInputElement>(null);
    const codeScrollRef = useRef<HTMLDivElement>(null);
    const verticalTrackRef = useRef<HTMLDivElement>(null);
    const verticalThumbRef = useRef<HTMLDivElement>(null);
    const horizontalTrackRef = useRef<HTMLDivElement>(null);
    const horizontalThumbRef = useRef<HTMLDivElement>(null);
    const scrollbarDrag = useRef<{ axis: "vertical" | "horizontal"; offset: number; pointerId: number } | null>(null);
    const activeFile = draftFiles.find((file) => file.name === selectedName) ?? getDefaultSourceFile(draftFiles);
    const modifiedNames = useMemo(
        () =>
            new Set(
                draftFiles
                    .filter((file) => file.content !== files.find((original) => original.name === file.name)?.content)
                    .map((file) => file.name)
            ),
        [draftFiles, files]
    );
    const draftExists = hasDraft(draftFiles, files);
    const liveAvailable = live?.availability === "available";
    const showEditor = isEditing && !!activeFile && isEditableFile(activeFile.name);
    const lineCount = activeFile?.content.split("\n").length ?? 1;
    const lineNumbers = Array.from({ length: lineCount }, (_, index) => index + 1).join("\n");
    const frameworkName = FRAMEWORK_NAME[framework];
    const isLight = state.theme === ETheme.light;

    const updateScrollbars = useCallback(() => {
        const viewport = codeScrollRef.current;
        if (!viewport) return;
        const updateAxis = (
            axis: "vertical" | "horizontal",
            track: HTMLDivElement | null,
            thumb: HTMLDivElement | null,
            position: number,
            visibleSize: number,
            contentSize: number
        ) => {
            if (!track || !thumb) return;
            const trackSize = axis === "vertical" ? track.clientHeight : track.clientWidth;
            const hasOverflow = contentSize > visibleSize + 1 && trackSize > 0;
            track.style.visibility = hasOverflow ? "visible" : "hidden";
            if (!hasOverflow) return;
            const thumbSize = Math.min(trackSize, Math.max(24, (trackSize * visibleSize) / contentSize));
            const scrollRange = contentSize - visibleSize;
            const trackRange = trackSize - thumbSize;
            const offset = (position / scrollRange) * trackRange;
            thumb.style[axis === "vertical" ? "height" : "width"] = `${thumbSize}px`;
            thumb.style.transform = axis === "vertical" ? `translateY(${offset}px)` : `translateX(${offset}px)`;
        };
        updateAxis(
            "vertical",
            verticalTrackRef.current,
            verticalThumbRef.current,
            viewport.scrollTop,
            viewport.clientHeight,
            viewport.scrollHeight
        );
        updateAxis(
            "horizontal",
            horizontalTrackRef.current,
            horizontalThumbRef.current,
            viewport.scrollLeft,
            viewport.clientWidth,
            viewport.scrollWidth
        );
    }, []);

    const handleScrollbarPointerDown = (event: ReactPointerEvent<HTMLDivElement>, axis: "vertical" | "horizontal") => {
        const viewport = codeScrollRef.current;
        const thumb = axis === "vertical" ? verticalThumbRef.current : horizontalThumbRef.current;
        if (!viewport || !thumb) return;
        const trackRect = event.currentTarget.getBoundingClientRect();
        const pointerPosition = axis === "vertical" ? event.clientY - trackRect.top : event.clientX - trackRect.left;
        const thumbSize = axis === "vertical" ? thumb.offsetHeight : thumb.offsetWidth;
        const trackSize = axis === "vertical" ? trackRect.height : trackRect.width;
        const scrollRange = axis === "vertical"
            ? viewport.scrollHeight - viewport.clientHeight
            : viewport.scrollWidth - viewport.clientWidth;
        const thumbPosition = scrollRange > 0
            ? ((axis === "vertical" ? viewport.scrollTop : viewport.scrollLeft) / scrollRange) *
              (trackSize - thumbSize)
            : 0;
        const onThumb = thumb.contains(event.target as Node);
        const offset = onThumb ? pointerPosition - thumbPosition : thumbSize / 2;
        scrollbarDrag.current = { axis, offset, pointerId: event.pointerId };
        event.currentTarget.setPointerCapture(event.pointerId);
        if (!onThumb) handleScrollbarPointerMove(event, axis);
        event.preventDefault();
    };

    function handleScrollbarPointerMove(event: ReactPointerEvent<HTMLDivElement>, axis: "vertical" | "horizontal") {
        const drag = scrollbarDrag.current;
        const viewport = codeScrollRef.current;
        if (!drag || drag.axis !== axis || drag.pointerId !== event.pointerId || !viewport) return;
        const trackRect = event.currentTarget.getBoundingClientRect();
        const trackSize = axis === "vertical" ? trackRect.height : trackRect.width;
        const thumb = axis === "vertical" ? verticalThumbRef.current : horizontalThumbRef.current;
        if (!thumb) return;
        const thumbSize = axis === "vertical" ? thumb.offsetHeight : thumb.offsetWidth;
        const pointerPosition = axis === "vertical" ? event.clientY - trackRect.top : event.clientX - trackRect.left;
        const trackRange = trackSize - thumbSize;
        const scrollRange = axis === "vertical"
            ? viewport.scrollHeight - viewport.clientHeight
            : viewport.scrollWidth - viewport.clientWidth;
        if (trackRange <= 0 || scrollRange <= 0) return;
        const position = Math.max(0, Math.min(1, (pointerPosition - drag.offset) / trackRange)) * scrollRange;
        if (axis === "vertical") viewport.scrollTop = position;
        else viewport.scrollLeft = position;
    }

    const stopScrollbarDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (scrollbarDrag.current?.pointerId === event.pointerId) scrollbarDrag.current = null;
    };

    // A refetch of the same project hands over a new array with the same content: that must not discard
    // an edit that has already started.
    const baseline = useRef({ files, examplePath });
    useEffect(() => {
        const previous = baseline.current;
        baseline.current = { files, examplePath };
        if (previous.examplePath === examplePath && !hasDraft(files, previous.files)) return;
        setDraftFiles(files);
        setSelectedName(getDefaultSourceFile(files)?.name);
        setIsEditing(false);
    }, [files, examplePath]);

    useEffect(() => {
        if (gutterRef.current) gutterRef.current.style.transform = "";
    }, [activeFile?.name, isEditing]);

    useEffect(() => {
        const viewport = codeScrollRef.current;
        if (!viewport) return undefined;
        const observer = new ResizeObserver(updateScrollbars);
        observer.observe(viewport);
        const code = viewport.querySelector("pre:not(.sc-editor-read-gutter)");
        if (code) observer.observe(code);
        updateScrollbars();
        return () => observer.disconnect();
    }, [activeFile?.content, activeFile?.name, isEditing, updateScrollbars]);

    const updateFiles = (next: ExampleSourceFile[]) => {
        setDraftFiles(next);
        onFilesChange?.(next);
    };
    const startEditing = () => {
        if (!live) return;
        if (live.availability !== "available") {
            setNotice(LIVE_EDIT_MESSAGES[live.availability]);
            return;
        }
        setNotice(null);
        setIsEditing(true);
    };
    const prepare = () => {
        if (!live || live.availability !== "available" || prepared.current) return;
        prepared.current = true;
        void loadCodeMirrorEditor();
        live.onPrepare();
    };
    const resetDraft = () => {
        setConfirmReset(false);
        updateFiles(files);
    };
    const updateContent = (content: string) =>
        updateFiles(draftFiles.map((file) => (file.name === activeFile.name ? { ...file, content } : file)));
    const handleEditorKeys = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Escape") {
            event.stopPropagation();
            setIsEditing(false);
            editToggleRef.current?.focus();
            return;
        }
        if (event.key !== "Tab") return;
        event.preventDefault();
        const textarea = event.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const content = activeFile.content;
        if (event.shiftKey) {
            const lineStart = content.slice(0, start).lastIndexOf("\n") + 1;
            const indentation = content.slice(lineStart, start).match(/^( {1,4}|\t)/)?.[0];
            if (!indentation) return;
            updateContent(content.slice(0, lineStart) + content.slice(lineStart + indentation.length));
            requestAnimationFrame(() =>
                textarea.setSelectionRange(
                    start - indentation.length,
                    Math.max(start - indentation.length, end - indentation.length)
                )
            );
        } else {
            updateContent(content.slice(0, start) + "    " + content.slice(end));
            requestAnimationFrame(() => textarea.setSelectionRange(start + 4, start + 4));
        }
    };
    const handleWorkspaceKeys = (event: KeyboardEvent<HTMLElement>) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
            const textarea = editorRef.current?.querySelector("textarea");
            if (textarea) {
                event.preventDefault();
                textarea.focus({ preventScroll: true });
                textarea.select();
            } else {
                const source = editorRef.current?.querySelector<HTMLElement>(".sc-editor-code-scroll");
                const code = source?.querySelector("code");
                const selection = window.getSelection();
                if (code && selection) {
                    event.preventDefault();
                    source.focus({ preventScroll: true });
                    const range = document.createRange();
                    range.selectNodeContents(code);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
            return;
        }
    };
    const download = (blob: Blob, name: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = name;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    const downloadProject = () => {
        const zip = createProjectZip(
            draftFiles.filter(
                ({ name }) =>
                    name !== "sandbox.config.json" &&
                    !name.split("/").some((part) => part === ".codesandbox" || part === ".devcontainer")
            )
        );
        download(
            new Blob([zip.buffer as ArrayBuffer], { type: "application/zip" }),
            `${examplePath}-${framework}.zip`
        );
    };

    if (!activeFile) return <p role="status">Loading example source…</p>;

    const textareaEditor = (
                        <div className="sc-editor-edit-surface">
                            <div className="sc-editor-edit-gutter" aria-hidden="true">
                                <pre ref={gutterRef}>{lineNumbers}</pre>
                            </div>
                            <textarea
                                key={activeFile.name}
                                aria-label={`Edit ${activeFile.name}`}
                                aria-description="Tab indents · Shift+Tab unindents · Escape exits editing"
                                value={activeFile.content}
                                spellCheck={false}
                                autoCapitalize="off"
                                autoCorrect="off"
                                wrap="off"
                                onChange={(event) => updateContent(event.target.value)}
                                onKeyDown={handleEditorKeys}
                                onScroll={(event) => {
                                    if (gutterRef.current)
                                        gutterRef.current.style.transform = `translateY(${-event.currentTarget
                                            .scrollTop}px)`;
                                }}
                            />
                        </div>
    );

    return (
        <section
            ref={editorRef}
            className="sc-editor-code"
            aria-label={`${frameworkName} example source editor`}
            tabIndex={-1}
            onKeyDown={handleWorkspaceKeys}
            onPointerEnter={prepare}
            onFocus={prepare}
        >
            <div className="sc-editor-workspace">
                {showExplorer && (
                    <FileExplorer
                        files={draftFiles}
                        selectedName={activeFile.name}
                        modifiedNames={modifiedNames}
                        onSelect={setSelectedName}
                    />
                )}
                <div className="sc-editor-file-panel">
                    <div className="sc-editor-file-toolbar">
                        <button
                            type="button"
                            className="sc-editor-explorer-toggle"
                            aria-label={showExplorer ? "Hide file explorer" : "Show file explorer"}
                            aria-pressed={showExplorer}
                            onClick={() => setShowExplorer(!showExplorer)}
                        >
                            <svg
                                className="sc-editor-files-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M14 2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
                                <path d="M14 2v6h6M3 5v15a3 3 0 0 0 3 3h11" />
                            </svg>
                        </button>
                        <div className="sc-editor-active-file">
                            <FileIcon name={activeFile.name} />
                            <span>{activeFile.name}</span>
                            {live && live.availability !== "narrow" && !isEditableFile(activeFile.name) && (
                                <span className="sc-editor-readonly-marker" title="This file cannot be edited">
                                    read-only
                                </span>
                            )}
                            {modifiedNames.has(activeFile.name) && (
                                <span className="sc-editor-modified" aria-label="Modified">
                                    ●
                                </span>
                            )}
                        </div>
                        {live && live.availability !== "narrow" && (
                            <div className="sc-editor-live-actions">
                                {isEditing && (
                                    <label className="sc-editor-autorun" title="Auto-run: run one second after you stop typing">
                                        <span className="sc-editor-autorun-text">Auto-run</span>
                                        <input
                                            type="checkbox"
                                            role="switch"
                                            aria-label="Auto-run"
                                            className="sc-editor-switch"
                                            checked={live.autoRun}
                                            onChange={(event) => live.onAutoRunChange(event.target.checked)}
                                        />
                                    </label>
                                )}
                                {isEditing && !live.autoRun && live.runPending && (
                                    <button
                                        type="button"
                                        className="sc-editor-icon-button sc-editor-run"
                                        aria-label="Run"
                                        title="Run (Ctrl/Cmd+Enter)"
                                        onClick={live.onRun}
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
                                        </svg>
                                    </button>
                                )}
                                <label
                                    className="sc-editor-edit-toggle"
                                    title={liveAvailable ? "Edit the code and see the chart change" : undefined}
                                >
                                    <span>Edit</span>
                                    <input
                                        ref={editToggleRef}
                                        type="checkbox"
                                        role="switch"
                                        className="sc-editor-switch"
                                        checked={isEditing}
                                        aria-disabled={!liveAvailable || undefined}
                                        onChange={() => (isEditing ? setIsEditing(false) : startEditing())}
                                    />
                                </label>
                            </div>
                        )}
                        <div className="sc-editor-project-actions">
                            {draftExists && (
                                <button
                                    type="button"
                                    aria-label="Reset to the original example"
                                    title="Reset to the original example"
                                    onClick={() => setConfirmReset(true)}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                                        <path d="M3 3v5h5" />
                                    </svg>
                                </button>
                            )}
                            <button
                                type="button"
                                aria-label={`Copy ${activeFile.name}`}
                                title={`Copy ${activeFile.name}`}
                                onClick={() => navigator.clipboard.writeText(activeFile.content)}
                            >
                                <ContentCopyIcon fontSize="small" />
                            </button>
                            <button
                                type="button"
                                aria-label="Download project"
                                title="Download project"
                                onClick={downloadProject}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M12 3v11m0 0 4-4m-4 4-4-4" />
                                    <path d="M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {notice && (
                        <p className="sc-editor-notice" role="status">
                            {notice}
                        </p>
                    )}
                    <ConfirmDialog
                        isOpen={confirmReset}
                        title="Discard your changes?"
                        message="Reset removes all your edits and shows the original example again."
                        onCancel={() => setConfirmReset(false)}
                        onConfirm={resetDraft}
                    />
                    {showEditor ? (
                        <EditorBoundary fallback={textareaEditor}>
                            <Suspense fallback={textareaEditor}>
                                <div className="sc-editor-cm-surface">
                                    <CodeMirrorEditor
                                        name={activeFile.name}
                                        value={activeFile.content}
                                        isLight={isLight}
                                        onChange={updateContent}
                                        onEscape={() => {
                                            setIsEditing(false);
                                            editToggleRef.current?.focus();
                                        }}
                                        onRun={live?.onRun ?? noop}
                                    />
                                </div>
                            </Suspense>
                        </EditorBoundary>
                    ) : (
                        <>
                            <div
                                ref={codeScrollRef}
                                id="EXAMPLE_CODE"
                                className="sc-editor-code-scroll"
                                tabIndex={0}
                                role="region"
                                aria-label={`${activeFile.name} source, scroll to read`}
                                onCopy={(event) => {
                                    const selection = window.getSelection();
                                    if (
                                        selection?.rangeCount &&
                                        selection.getRangeAt(0).toString() === activeFile.content
                                    ) {
                                        event.preventDefault();
                                        event.clipboardData.setData("text/plain", activeFile.content);
                                    }
                                }}
                                onScroll={updateScrollbars}
                            >
                                <pre className="sc-editor-read-gutter" aria-hidden="true">
                                    {lineNumbers}
                                </pre>
                                <SyntaxHighlighter
                                    language={EditorLanguageMap[activeFile.name.split(".").pop()] || "text"}
                                    style={isLight ? LightStyles : DarkStyles}
                                    customStyle={{
                                        margin: 0,
                                        padding: "0.75rem 1rem 1rem 0.75rem",
                                        background: "transparent",
                                        overflow: "visible",
                                    }}
                                    codeTagProps={{
                                        style: { fontFamily: "inherit", fontSize: "inherit", lineHeight: "inherit" },
                                    }}
                                >
                                    {activeFile.content}
                                </SyntaxHighlighter>
                            </div>
                            <div
                                ref={verticalTrackRef}
                                className="sc-editor-scrollbar sc-editor-scrollbar-vertical"
                                aria-hidden="true"
                                onPointerDown={(event) => handleScrollbarPointerDown(event, "vertical")}
                                onPointerMove={(event) => handleScrollbarPointerMove(event, "vertical")}
                                onPointerUp={stopScrollbarDrag}
                                onPointerCancel={stopScrollbarDrag}
                            >
                                <div ref={verticalThumbRef} className="sc-editor-scrollbar-thumb" />
                            </div>
                            <div
                                ref={horizontalTrackRef}
                                className="sc-editor-scrollbar sc-editor-scrollbar-horizontal"
                                aria-hidden="true"
                                onPointerDown={(event) => handleScrollbarPointerDown(event, "horizontal")}
                                onPointerMove={(event) => handleScrollbarPointerMove(event, "horizontal")}
                                onPointerUp={stopScrollbarDrag}
                                onPointerCancel={stopScrollbarDrag}
                            >
                                <div ref={horizontalThumbRef} className="sc-editor-scrollbar-thumb" />
                            </div>
                        </>
                    )}
                    {consoleEntries && (
                        <ConsoleDrawer
                            entries={consoleEntries}
                            open={consoleOpen}
                            onToggle={() => setConsoleOpen(!consoleOpen)}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};
