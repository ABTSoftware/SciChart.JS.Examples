# Example source editor

`CodePreview` consumes the canonical `SourceFilesVariant.files` project returned by the sandbox service. Its explorer shows the runnable project files, and its ZIP includes the entry points, helpers, stylesheet, dependency manifest, and README. The ZIP omits `.codesandbox/`, `.devcontainer/`, and `sandbox.config.json`; those remain available to hosted sandboxes. The original `files` prop is the reset baseline; editing changes a local draft. `onFilesChange(files)` exposes the complete current draft on edit and reset for an embedding integration. Initialize that integration with the same canonical files passed to this component.

The initial server render contains highlighted `<pre><code>` for the selected file. No client editor library or interaction is needed to receive that source HTML. The complete project also arrives in the serialized source state; the explorer switches the displayed file. Ctrl+A or Cmd+A inside the editor selects only the open file’s code, in both Read and Edit modes, so native copying excludes the line numbers and surrounding page. Line numbers are excluded from the accessibility tree. The file explorer supports arrow keys and Home/End; editing uses a labelled textarea, Tab/Shift+Tab indentation, and Escape to return to Read mode. Fullscreen traps focus and restores page scrolling on exit.

## Live editing

Design: [LIVE-EDIT-PLAN.md](../../../LIVE-EDIT-PLAN.md) and [ADR 0001](../../../docs/adr/0001-live-preview-runs-in-a-same-origin-frame.md). Terms: [CONTEXT.md](../../../CONTEXT.md).

Pressing **Edit** swaps the highlighted read view for CodeMirror 6 (`CodeMirrorEditor.tsx`, a lazy chunk; the textarea is the fallback if it fails to load). Only `src/*.ts|tsx|js|jsx|css` files are editable (`isEditableFile`); the rest stay in read mode with a "read-only" marker. The server-rendered `<pre><code>` is unchanged and the editor is never part of the initial HTML (`CodePreview.serverRender.test.cjs`).

`CodePreview` keeps the draft and reports it through `onFilesChange`. `AppDetailsRouter` owns what happens next: once the draft differs from the example project (`hasDraft`), `LivePreview` replaces the built-in chart. Auto-run fires one second after the last edit (the switch is remembered in `localStorage`); Run and Ctrl/Cmd+Enter run now. Reset, switching example or framework, and closing the tab ask before discarding a draft (the browser Back button cannot be intercepted by the router in use).

`LivePreview` talks to the frame at `/live-frame` only through `postMessage` (`src/liveRuntime/protocol.ts`), checking `event.source` and `event.origin`. The runtime inside the frame is `src/liveRuntime/runtime.ts`, built by `scripts/buildLiveRuntime.cjs`. Examples that import a package outside the runtime's set, or that cannot run in the frame, opt out with `liveEdit: false` in `exampleInfo.tsx`; the Edit button then explains that the example is too complex for the in-page sandbox. Angular stays read-only.

The draft lives in memory for the page visit. "Download project" and CodeSandbox (`POST /api/sandboxurl/:example`) use it.

## Moving app components

`useAppContext()` (also exported as `_useContext`) provides `state.currentExample`, `state.framework`, route flags, and theme, plus theme actions. `StateProvider` reads the router directly, so framework and example always come from the same URL. Keep moved app components beneath this provider; change framework with router links rather than maintaining a second framework state.

`DrawerContent` supplies `NavigationProvider`. Navigation blocks read collapse state and gallery tracking through `useNavigationContext()`; parents no longer forward navigation callbacks. Editor file selection and drafts belong to `CodePreview`. Its direct props describe the loaded source project, including the actual framework when the requested variant is unavailable.

## Checks

From `Examples`, run `npm run testLive` (loader, protocol, live-editing helpers, server render, console log, draft endpoint), `npm run checkLiveExamples` (every example in the live frame; needs `npm run dev`), and `node src/helpers/shared/Helpers/Context.test.cjs`, `node src/components/CodePreview/projectFiles.test.cjs`, `npm run typecheck`, and `npm run checkAppStyles`. The ZIP check uses the system `unzip` reader to validate checksums, paths, and exact UTF-8 file content independently of the writer.
