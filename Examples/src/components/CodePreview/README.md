# Example source editor

`CodePreview` consumes the canonical `SourceFilesVariant.files` project returned by the sandbox service. Its explorer and project ZIP include the same entry points, helpers, stylesheet, and dependency manifest sent to StackBlitz and CodeSandbox. The original `files` prop is the reset baseline; editing changes a local draft. `onFilesChange(files)` exposes the complete current draft on edit and reset for an embedding integration. Initialize that integration with the same canonical files passed to this component.

The initial server render contains highlighted `<pre><code>` for the selected file. No client editor library or interaction is needed to receive that source HTML. The complete project also arrives in the serialized source state; the explorer switches the displayed file. Ctrl+A or Cmd+A inside the editor selects only the open file’s code, in both Read and Edit modes, so native copying excludes the line numbers and surrounding page. Line numbers are excluded from the accessibility tree. The file explorer supports arrow keys and Home/End; editing uses a labelled textarea, Tab/Shift+Tab indentation, and Escape to return to Read mode. Fullscreen traps focus and restores page scrolling on exit.

Edits live in memory until the example/framework changes or the page reloads. Selection and project downloads use the draft. The existing hosted sandbox actions open the canonical example, not this local draft. There is no execution of edited code on the examples page.

## Future harness adapter

Connect `onFilesChange` to a separate preview controller when a compilation service and harness deployment exist. The controller, not `CodePreview`, owns compilation, iframe creation/disposal, readiness, and replaying the latest compiled content. Keep semantic source rendering for the selected file if an editor such as Monaco later replaces the textarea.

The [SciClawd harness contract](https://github.com/SciChartOrg/SciClawd/blob/main/use/suds/sciclawd/scichart-harness.md) runs edited JavaScript on a **separate origin**. Use the intended parent origin in the harness `?from=` parameter. Both sides must check `event.origin` and `event.source`; use an exact target origin for `postMessage`. Do not evaluate edited code, import it, or inject it into the parent document.

After `sciclawd-harness-ready`, the controller sends `sciclawd-chart-content` with `definitionJson`, `js`, and/or `chartData`. A later `sciclawd-chart-data` message updates `data`. Receive `sciclawd-chart-error` and `sciclawd-chart-event` through that same checked boundary. Full replacement must tear down the previous chart and user handlers. Function-style JS receives `(surface, SciChart, data, emit)` and can return update/teardown; module-style `js.code` exports `setup(div, SciChart, data, emit)`, `update(SciChart, data, emit)`, and optional `teardown`.

This editor supplies editable project files and a controller callback. It deliberately does not invent a compiler, runner URL, or pretend Run button before that infrastructure exists.

## Checks

From `Examples`, run `node src/components/CodePreview/projectFiles.test.cjs`, `npm run typecheck`, and `npm run checkAppStyles`. The ZIP check uses the system `unzip` reader to validate checksums, paths, and exact UTF-8 file content independently of the writer.
