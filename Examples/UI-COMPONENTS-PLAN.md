# Example UI and layout contract

The 181 demos use native HTML controls and a small shared stylesheet. Controls follow shadcn's neutral appearance without adding Tailwind, a component library, or a runtime. Chart setup stays in `drawExample.ts`.

## Layout

-   `.sc-chart-wrapper` owns chart sizing, positioning and overflow.
-   A direct `.sc-toolbar-row` child creates a column layout: toolbar first, chart content filling the remaining space. The toolbar uses consistent padding, left alignment and horizontal scrolling on narrow screens.
-   Join related actions or mutually exclusive choices with `.sc-button-group`, `role="group"` and an accessible name. Use `aria-pressed` for selection; independent on/off settings use switches.
-   Keep the small Tailwind-like utilities (`flex`, `flex-col`, `gap-2`, `w-full`, `ml-auto`, etc.) for composition. Chart-specific grids and overlays stay local.

## Controls

| Control                                | Classes                                                |
| -------------------------------------- | ------------------------------------------------------ |
| Default button                         | `sc-button`                                            |
| Outline button                         | `sc-button sc-button-outline`                          |
| Destructive action                     | `sc-button sc-button-destructive`                      |
| Icon button                            | `sc-button sc-button-icon`, with an accessible name    |
| Horizontal group                       | `sc-button-group` containing buttons directly          |
| Vertical group                         | `sc-button-group flex-col` containing buttons directly |
| Checkbox                               | Native checkbox with `sc-checkbox`, inside a label     |
| Switch                                 | `sc-switch` label containing a native checkbox         |
| Select                                 | Native select with `sc-select`                         |
| Text, number, color or multiline input | Native input or textarea with `sc-input`               |
| Slider                                 | Native range input with `sc-range`                     |
| Label and control                      | `sc-control`                                           |

Buttons have a 40px minimum height; icon buttons are 40×40px. Text inputs and selects use a 36px height. All configurable corner radii derive from `--radius`; circular thumbs retain their circular shape. Keep labels, native validation, values, keyboard behavior and disabled states in markup. Use inline styles for dynamic chart colors and chart-specific geometry only. Native sliders need only `sc-range`; keep their styling in CSS, without per-input styling helpers.

## Styles and export

`styles/sc-ui.css` contains recurring controls, layout utilities and theme tokens. It reads the gallery's `--text` and `--bg` values, with standalone light/dark fallbacks. Dialogs shared by four demos remain here; specialized menus, accordions, floating panels and medical cards have local CSS imported by their owners. There is no ripple script or MUI/SCSS dependency in exported example UI.

The exporter follows relative imports and re-exports recursively, preserves helper directories and copies local CSS. The CSS postprocessor scans every exported TS/JS/HTML file, retains used selector alternatives and native states, and keeps transitive custom-property dependencies, including those referenced by local CSS. Source-viewer tabs preserve relative paths so matching filenames remain distinct.

Run `npm run checkExampleUi` in `Examples` to check all 181 demos and their available framework variants, copied import paths, class coverage, selector pruning and stylesheet idempotence. Run `npx tsc --noEmit` for the application typecheck. The checker reports shared CSS size and the median and largest exported subsets.
