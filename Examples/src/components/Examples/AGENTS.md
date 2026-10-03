# Writing clear SciChart examples

Apply these rules when creating or refactoring code under this directory. Examples should teach the chart feature through readable, working code with minimal UI plumbing. Preserve the demonstrated behavior unless the task explicitly changes it.

## Reference and scope

Read the current files and their Git diff before editing. Use these as local references:

- [DatapointSelection/drawExample.ts](Charts2D/TooltipsAndHittest/DatapointSelection/drawExample.ts) for chart setup and repeated series configuration.
- [DatapointSelection/index.tsx](Charts2D/TooltipsAndHittest/DatapointSelection/index.tsx) for a small React component using shared layout classes.
- [sc-ui.css](styles/sc-ui.css) for the available layout utilities and native control styles.

The DatapointSelection changes in commit `70a0315e5` illustrate the direction: replace copied series blocks with one loop, inline simple theme values in chart options, remove unused data, replace style objects with shared classes, and use CSS for responsive layout. Follow these principles; do not copy every detail or comment verbatim.

Keep `drawExample.ts` focused on chart creation, data, modifiers, and chart events. Keep `index.tsx` focused on React state, controls, and rendering. Preserve public signatures, returned controls, cleanup, and other framework consumers of `drawExample`.

## Variables and repetition

- Pass simple values directly where they are used. Avoid aliases such as `const stroke = appTheme.ForegroundColor` that add no meaning.
- Construct an axis, series, annotation, or modifier directly in `.add(...)` when its instance is not needed afterward or when the code is already complex around it, but if we have something like `const col1 = new ColumnSeries()`, that might end up being good for beginners to understand the `.add()` method better.
- Keep a named instance when subscribing to its events, updating it later, returning it as a control, or managing its lifecycle. DatapointSelection's selection modifier needs its variable for the event subscription.
- Keep intermediate variables that explain calculations, avoid repeated work, or establish units. Names such as `gap`, `labelWidth`, and `rightX` make label placement easier to understand; do not compress that algorithm into one expression.
- Replace substantially identical series blocks with a simple loop over their varying data. Keep differences explicit and create a fresh series, marker, or provider per iteration when instances carry state or belong to a series.
- Keep a small local factory when repeated setup requires fresh instances, as with `getDataLabelProvider`. Do not introduce a generic factory, configuration framework, or extra component just to reduce a few lines.
- Remove unused arrays, imports, refs, state, callbacks, destructured values, and obsolete helpers after the refactor. Use object shorthand where names match.

## Comments that teach

Keep short comments at meaningful teaching boundaries: selection feedback, optional data labels, event wiring, or an unexpected API constraint. Explain why a choice matters when the code alone does not tell the reader.

Do not narrate every assignment or repeat the same explanation for each series. Remove obsolete TODOs, commented-out implementations, unrelated background, and comments that merely restate a method name.

For example, prefer a comment explaining that labels flip left to avoid clipping and that the gap uses render pixels over simply saying “change label position.” Explain coordinate units and DPI conversions where they are easy to get wrong.

Update comments when behavior or layout changes. A panel that can sit beside or below the chart should not be described as always being “below the chart.” Mark an option as optional only when it really is optional to the feature being demonstrated.

Do not strip all comments to make the file shorter. A reader new to SciChart should be able to identify the feature-specific setup without deciphering the entire example.

## CSS and layout

Use the least inline CSS and JavaScript style objects possible. Choose styling in this order:

1. Reuse the classes already defined in `styles/sc-ui.css`.
2. If a missing layout or control pattern actually repeats across examples, add a small shared utility or component class there and reuse it.
3. For static styling particular to one example, use a plain `.css` file in that example's folder. Scope selectors with an example-specific class to avoid affecting other examples or SciChart-generated elements.
4. Use a small inline style only for a genuinely particular value that is clearer at the use site, especially a runtime value. Do not use this exception for ordinary flex layout, spacing, borders, colors, or scrolling.

These are local Tailwind-like classes, not a Tailwind installation. Check that every class exists; do not invent Tailwind names or arbitrary-value syntax and assume they work. For example, verify `gap-1` before using it, and add its definition if required.

Prefer combinations such as `flex flex-col p-1`, `w-full text-center px-2 border-r`, and the existing `sc-button`, `sc-control`, and `sc-toolbar-row` classes. Use the existing custom icons from `icons` when needed.

Do not create `const styles: Record<string, CSSProperties>`, named static style objects, or object spreads that reconstruct CSS in TSX. Do not import `CSSProperties` just to maintain a static stylesheet in JavaScript.

Use `sc-chart-wrapper` for the standard chart container; it already supplies the shared background and theme text. Do not duplicate it with `style={{ background: appTheme.Background }}` on containing divs.

For a chart with a controls/readout panel, consider `sc-responsive-chart-wrapper`: its two direct children are the chart and panel, with a desktop 70/30 split, a 16rem panel minimum, and a column layout at 600px and below. Check the child structure before applying it. Keep controls accessible on mobile.

Use CSS media queries for visual responsiveness. Remove `useViewType`, measurement refs, and viewport-dependent rendering when they only control layout that CSS can express. Retain hooks when chart computation or behavior genuinely depends on size.

**Never use SCSS modules anywhere in examples code under this directory.** Do not create or import `.module.scss`, including shared SCSS modules outside the example folder. When touching an example that uses them, replace the affected styling with shared classes or plain CSS.

Chart API configuration objects are not DOM CSS: keep options such as marker colors, annotation positions, and `dataLabelProvider.style` in chart code. Preserve chart theme values, DPI handling, and per-series colors rather than forcing them into CSS.

## Refactor and verify

1. Read the complete example, relevant shared styles, and the diff. Find callers before changing `drawExample`'s interface or returned values.
2. Make sure the ui buttons (where present) make sense, are in groups if needed, and are labeled with the feature they control. Remove any unused buttons or state that is really unnecessary.
3. Simplify the repeated setup and remove unused code without hiding the chart feature behind new abstractions.
4. Move ordinary UI styling to existing classes; add shared CSS only for demonstrated reuse. Keep particular static rules in scoped per-folder CSS.
5. Review comments against the final behavior and check that every class used is defined.
6. For code or CSS changes, run from the repository root:

   ```sh
   npm --prefix Examples run typecheck
   npm --prefix Examples run checkExampleUi
   ```

7. Verify affected interactions in the running example. Check desktop and mobile for layout changes; check themes for color changes; check boundaries and DPI for coordinate changes. Check standalone exports when adding per-folder CSS or changing shared chart code.

Finish when the intended feature still works, the relevant checks pass, the diff contains no unrelated edits, no SCSS module imports remain in the touched example, and the explanation reports the changed behavior and any verification limits. Add one focused regression check for new nontrivial logic; do not add tests that merely mirror styling declarations.
