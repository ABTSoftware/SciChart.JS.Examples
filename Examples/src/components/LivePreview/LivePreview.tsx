import { FC, useCallback, useEffect, useRef, useState } from "react";
import { baseAppPath } from "../../constants";
import type { ExampleSourceFile } from "../../helpers/types/types";
import { _useContext } from "../../helpers/shared/Helpers/Context";
import { isTrustedEvent, parseFrameMessage, type LiveFramework, type PageMessage } from "../../liveRuntime/protocol";
import { appendEntry, type ConsoleEntry } from "./consoleLog";

/** CSS variables from the site's shell that the example project's appTheme.ts reads from the document root. */
const THEME_VARIABLES = [
    "--bg",
    "--bg-chart",
    "--bg-darker",
    "--bg-toolbars",
    "--border-color",
    "--light-blue",
    "--primary",
    "--text",
    "--sc-background",
];
const AUTO_RUN_DELAY_MS = 1000;
const FRAME_URL = () => `${baseAppPath}/live-frame`;

const readThemeVariables = () => {
    const style = getComputedStyle(document.documentElement);
    const vars: Record<string, string> = {};
    for (const name of THEME_VARIABLES) {
        const value = style.getPropertyValue(name).trim();
        if (value) vars[name] = value;
    }
    return vars;
};

export type LivePreviewProps = {
    files: ExampleSourceFile[];
    framework: LiveFramework;
    autoRun: boolean;
    /** Bumped by the Run button; a change runs the current files now. */
    runRequest: number;
    /** The console output of the current run, for the drawer under the source editor. */
    onConsole: (entries: ConsoleEntry[]) => void;
    /** The files that were just sent to the frame. */
    onRan: (files: ExampleSourceFile[]) => void;
};

/**
 * The live preview: a same-origin frame (see docs/adr/0001) that runs the visitor's draft. The frame is created on
 * first use and kept between runs. The last working chart stays visible when a run fails.
 */
export const LivePreview: FC<LivePreviewProps> = ({ files, framework, autoRun, runRequest, onConsole, onRan }) => {
    const { state } = _useContext();
    const [frameKey, setFrameKey] = useState(0);
    const [entries, setEntries] = useState<ConsoleEntry[]>([]);
    const [status, setStatus] = useState<"loading" | "running" | "ready" | "failed">("loading");
    const frameRef = useRef<HTMLIFrameElement>(null);
    const readyRef = useRef(false);
    const runIdRef = useRef(0);
    const runsInFrameRef = useRef(0);
    const entryIdRef = useRef(0);
    const latest = useRef({ files, framework, theme: state.theme });
    latest.current = { files, framework, theme: state.theme };

    const send = useCallback((message: PageMessage) => {
        frameRef.current?.contentWindow?.postMessage(message, window.location.origin);
    }, []);

    const run = useCallback(() => {
        if (!readyRef.current) return; // the pending run is sent on `ready`
        runIdRef.current += 1;
        runsInFrameRef.current += 1;
        onRan(latest.current.files);
        setEntries([]);
        setStatus("running");
        send({
            type: "run",
            runId: runIdRef.current,
            framework: latest.current.framework,
            files: latest.current.files,
            themeName: latest.current.theme,
            themeVars: readThemeVariables(),
        });
    }, [send, onRan]);

    // Console output goes up to the drawer
    useEffect(() => onConsole(entries), [entries, onConsole]);

    // Messages from the frame
    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            if (!isTrustedEvent(event, frameRef.current?.contentWindow, window.location.origin)) return;
            const message = parseFrameMessage(event.data);
            if (!message) return;
            if (message.type === "ready") {
                readyRef.current = true;
                run();
                return;
            }
            if (message.runId !== runIdRef.current) return; // a result of an older run
            const id = ++entryIdRef.current;
            switch (message.type) {
                case "run-ok":
                    setStatus((current) => (current === "failed" ? current : "ready"));
                    break;
                case "console":
                    setEntries((current) => appendEntry(current, { id, kind: message.level, text: message.text }));
                    break;
                case "error":
                    if (message.phase === "teardown" && runsInFrameRef.current > 1) {
                        // Edited code broke its own cleanup, or the frame holds state from an earlier run:
                        // discard the frame and run again in a fresh one. A fresh frame is never discarded for this.
                        readyRef.current = false;
                        setFrameKey((key) => key + 1);
                        return;
                    }
                    setStatus("failed");
                    setEntries((current) =>
                        appendEntry(current, {
                            id,
                            kind: message.phase === "compile" ? "compile" : "runtime",
                            text: message.message,
                            file: message.file,
                            line: message.line,
                        })
                    );
                    break;
            }
        };
        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, [run]);

    // A new frame is not ready until it says so.
    useEffect(() => {
        readyRef.current = false;
        runsInFrameRef.current = 0;
    }, [frameKey]);

    // Auto-run: one second after the last change. The first run after the preview appears is immediate.
    const isFirstRun = useRef(true);
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            run();
            return undefined;
        }
        if (!autoRun) return undefined;
        const timer = window.setTimeout(run, AUTO_RUN_DELAY_MS);
        return () => window.clearTimeout(timer);
    }, [files, autoRun, run]);

    // Run button, and theme changes
    const previousRequest = useRef(runRequest);
    useEffect(() => {
        if (previousRequest.current !== runRequest) {
            previousRequest.current = runRequest;
            run();
        }
    }, [runRequest, run]);
    const previousTheme = useRef(state.theme);
    useEffect(() => {
        if (previousTheme.current === state.theme) return undefined;
        previousTheme.current = state.theme;
        // The theme variables change a moment after the theme state does.
        const timer = window.setTimeout(run, 50);
        return () => window.clearTimeout(timer);
    }, [state.theme, run]);

    // Leaving the page or switching example: stop the draft's code.
    useEffect(() => () => send({ type: "dispose" }), [send]);

    return (
        <div className="sc-live-preview" data-status={status}>
            <div className="sc-live-preview-viewport">
                <iframe
                    key={frameKey}
                    ref={frameRef}
                    className="sc-live-preview-frame"
                    title="Live preview of your edits"
                    src={FRAME_URL()}
                />
                {status !== "ready" && status !== "failed" && (
                    <div className="sc-live-preview-status" role="status">
                        {status === "loading" ? "Starting live preview…" : "Running…"}
                    </div>
                )}
            </div>
        </div>
    );
};
