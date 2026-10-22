import { FC, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/light";
import ts from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml";
import { EPageFramework, FRAMEWORK_NAME } from "../../helpers/shared/Helpers/frameworkParametrization";
import { Dialog } from "../Dialog/Dialog";
import { ETheme, type ExampleSourceFile } from "../../helpers/types/types";
import { _useContext } from "../../helpers/shared/Helpers/Context";
import "react-syntax-highlighter/dist/esm/styles/hljs/dark";
import { FileExplorer, FileIcon } from "./FileExplorer";
import { createProjectZip, getDefaultSourceFile } from "./projectFiles";

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

export type CodeEditorProps = {
    files: ExampleSourceFile[];
    selectedFile: ExampleSourceFile;
    handleFileClick: (fileName: string) => void;
    desiredFramework: EPageFramework;
    actualFramework: EPageFramework | null;
    examplePath: string;
    isMaxWidth: boolean;
    onFilesChange?: (files: ExampleSourceFile[]) => void;
};

export const CodePreview: FC<CodeEditorProps> = ({
    files,
    selectedFile,
    handleFileClick,
    desiredFramework,
    actualFramework,
    examplePath,
    onFilesChange,
}) => {
    const { state } = _useContext();
    const [draftFiles, setDraftFiles] = useState(files);
    const [isEditing, setIsEditing] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showExplorer, setShowExplorer] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [status, setStatus] = useState("");
    const editorRef = useRef<HTMLElement>(null);
    const gutterRef = useRef<HTMLPreElement>(null);
    const fullscreenButtonRef = useRef<HTMLButtonElement>(null);
    const readButtonRef = useRef<HTMLButtonElement>(null);
    const activeFile = draftFiles.find((file) => file.name === selectedFile?.name) ?? getDefaultSourceFile(draftFiles);
    const modifiedNames = useMemo(
        () =>
            new Set(
                draftFiles
                    .filter((file) => file.content !== files.find((original) => original.name === file.name)?.content)
                    .map((file) => file.name)
            ),
        [draftFiles, files]
    );
    const lineCount = activeFile?.content.split("\n").length ?? 1;
    const lineNumbers = Array.from({ length: lineCount }, (_, index) => index + 1).join("\n");
    const frameworkName = FRAMEWORK_NAME[actualFramework || desiredFramework];
    const isLight = state.theme === ETheme.light;

    useEffect(() => {
        setDraftFiles(files);
        setIsEditing(false);
        setStatus("");
    }, [files, examplePath]);

    useEffect(() => {
        setShowDialog(!!actualFramework && actualFramework !== desiredFramework);
    }, [examplePath, actualFramework, desiredFramework]);

    useEffect(() => {
        if (gutterRef.current) gutterRef.current.style.transform = "";
    }, [activeFile?.name, isEditing]);

    useEffect(() => {
        if (!isFullscreen) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        editorRef.current?.focus();
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isFullscreen]);

    const updateFiles = (next: ExampleSourceFile[]) => {
        setDraftFiles(next);
        onFilesChange?.(next);
    };
    const updateContent = (content: string) =>
        updateFiles(draftFiles.map((file) => (file.name === activeFile.name ? { ...file, content } : file)));
    const handleEditorKeys = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Escape") {
            event.stopPropagation();
            setIsEditing(false);
            readButtonRef.current?.focus();
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
    const closeFullscreen = () => {
        setIsFullscreen(false);
        fullscreenButtonRef.current?.focus();
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
        if (!isFullscreen) return;
        if (event.key === "Escape") {
            event.preventDefault();
            closeFullscreen();
        }
        if (event.key === "Tab") {
            const focusable = Array.from(
                editorRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), textarea, [tabindex="0"]') ??
                    []
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && (document.activeElement === first || document.activeElement === editorRef.current)) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        }
    };
    const download = (blob: Blob, name: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = name;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setStatus(`Downloaded ${name}`);
    };
    const downloadProject = () => {
        try {
            const zip = createProjectZip(draftFiles);
            download(
                new Blob([zip.buffer as ArrayBuffer], { type: "application/zip" }),
                `${examplePath}-${actualFramework || desiredFramework}.zip`
            );
        } catch (error) {
            setStatus(error instanceof Error ? error.message : "Unable to download the project.");
        }
    };

    if (!activeFile) return <p role="status">Loading example source…</p>;

    return (
        <section
            ref={editorRef}
            className={`sc-editor-code ${isFullscreen ? "sc-editor-code-fullscreen" : ""}`}
            role={isFullscreen ? "dialog" : undefined}
            aria-modal={isFullscreen ? true : undefined}
            aria-label={`${frameworkName} example source editor`}
            tabIndex={-1}
            onKeyDown={handleWorkspaceKeys}
        >
            <header className="sc-editor-project-header">
                <div className="sc-editor-project-title">
                    <strong>Source</strong>
                    <span>{frameworkName} project</span>
                </div>
                <div className="sc-editor-project-actions">
                    <button type="button" onClick={downloadProject}>
                        Download project
                    </button>
                    <button
                        type="button"
                        disabled={!modifiedNames.size}
                        onClick={() => {
                            updateFiles(files);
                            setStatus("Project edits reset");
                        }}
                    >
                        Reset edits
                    </button>
                    <button
                        ref={fullscreenButtonRef}
                        type="button"
                        aria-pressed={isFullscreen}
                        onClick={() => (isFullscreen ? closeFullscreen() : setIsFullscreen(true))}
                    >
                        {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    </button>
                </div>
            </header>
            <div className="sc-editor-workspace">
                {showExplorer && (
                    <FileExplorer
                        files={draftFiles}
                        selectedName={activeFile.name}
                        modifiedNames={modifiedNames}
                        onSelect={handleFileClick}
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
                            ☰
                        </button>
                        <div className="sc-editor-active-file">
                            <FileIcon name={activeFile.name} />
                            <span>{activeFile.name}</span>
                            {modifiedNames.has(activeFile.name) && (
                                <span className="sc-editor-modified" aria-label="Modified">
                                    ●
                                </span>
                            )}
                        </div>
                        <div className="sc-editor-mode-switch" aria-label="Source mode">
                            <button
                                ref={readButtonRef}
                                type="button"
                                aria-pressed={!isEditing}
                                onClick={() => setIsEditing(false)}
                            >
                                Read
                            </button>
                            <button type="button" aria-pressed={isEditing} onClick={() => setIsEditing(true)}>
                                Edit
                            </button>
                        </div>
                    </div>
                    {isEditing ? (
                        <div className="sc-editor-edit-surface">
                            <div className="sc-editor-edit-gutter" aria-hidden="true">
                                <pre ref={gutterRef}>{lineNumbers}</pre>
                            </div>
                            <textarea
                                key={activeFile.name}
                                aria-label={`Edit ${activeFile.name}`}
                                aria-describedby="example-editor-edit-help"
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
                    ) : (
                        <div
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
                    )}
                    <footer className="sc-editor-status-bar">
                        <span id="example-editor-edit-help">
                            {isEditing
                                ? "Tab indents · Shift+Tab unindents · Escape exits editing"
                                : modifiedNames.size
                                ? `${modifiedNames.size} modified · local edits`
                                : "Read source · select Edit to make changes"}
                        </span>
                        <span>{lineCount} lines · UTF-8</span>
                    </footer>
                </div>
            </div>
            <div className="sc-editor-status-message" role="status" aria-live="polite">
                {status || "Download the complete project to run your changes."}
            </div>
            <Dialog
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                text={`This example is available in ${FRAMEWORK_NAME[actualFramework]} instead of ${FRAMEWORK_NAME[desiredFramework]}.`}
            />
        </section>
    );
};
