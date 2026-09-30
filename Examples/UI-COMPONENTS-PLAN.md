# Example UI and layout contract

## Goal

Keep example controls and chart layout framework-neutral. A demo should use ordinary HTML with shared CSS classes so its markup can move between React, vanilla JavaScript, and Angular without changing `drawExample.ts`.

## Inventory

The current examples tree has 181 demo `index.tsx` files and one shared `FloatingPanel` component. Each demo now uses `sc-chart-wrapper` as its chart container. The examples use native buttons, button groups, checkboxes, switches, selects, text and number inputs, color inputs, and range inputs; chart-specific editors and dialogs remain local to the demo.

## Layout contract

- `.sc-chart-wrapper` is the only shared chart container class. It owns the chart area's size, positioning, overflow, and chart touch behavior.
- A direct `.sc-toolbar-row` child opts the wrapper into the standard toolbar layout. CSS places that row first and lets the other direct children fill the remaining height. The markup does not need a toolbar modifier on the wrapper.
- `.sc-toolbar-row` uses shared padding and gap, stays at a consistent minimum height, and scrolls horizontally when controls do not fit. One child stays left-aligned; two or more direct children are distributed across the row by CSS, so markup does not need a spacing utility.
- Use `.sc-button-group` inside the row to join related buttons. Keep chart-specific grids and overlays explicit; do not add wrapper variants to support isolated layouts.
- Use small unprefixed utilities from `sc-ui.css` for common composition (`flex`, `flex-col`, `flex-wrap`, `flex-1`, `w-full`, `h-full`). Component classes keep the `sc-` prefix.

## Control contract

| Control                      | Markup classes                                                                               |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| Button                       | `.sc-button` plus an optional variant such as `.sc-button-primary` or `.sc-button-secondary` |
| Joined buttons               | `.sc-button-group` around `.sc-button` elements; use `aria-pressed` for selected state       |
| Checkbox or radio            | Native input with `.sc-checkbox` or `.sc-radio`                                              |
| Switch                       | Native checkbox styled with `.sc-switch`                                                     |
| Select                       | Native `<select class="sc-select">`                                                          |
| Text, number, or color input | Native input with `.sc-input`                                                                |
| Range                        | Native `<input type="range" class="sc-range">`                                               |
| Related controls             | `.sc-control` and `.sc-control-row` where they describe the markup clearly                   |

Keep labels, `id`/`htmlFor`, native values, constraints, and accessibility attributes in the HTML. Use native state and framework bindings for behavior; CSS supplies presentation only.

## Stylesheet responsibilities

- `sc-ui.css` contains reusable controls, small unprefixed layout utilities, theme tokens, and a centered CSS-only ripple for copied demos.
- The shared chart wrapper and toolbar layout now live in `sc-ui.css`; the unused example stylesheet was removed.
- `sc-ui-ripple.css` and the app-level `sc-ripple.ts` provide pointer-origin ripple placement in the live site. The CSS-only fallback stays centered so an exported demo needs no event listener.
- Theme-aware controls read the existing `--bg`, `--text`, `--bg-toolbars`, and related theme variables. Fallbacks are defined once in the stylesheet root.
- Use native CSS nesting. Do not add SASS-only syntax, MUI selectors, or double-dash component modifiers to these CSS files.

## Migration rule

When updating an example, prefer the shared classes over inline control styles or per-demo wrappers. Keep inline styles only for values that are genuinely data-driven or chart-specific, such as a generated color, a plot overlay position, or grid sizing unique to that demo. Do not change chart setup or `drawExample.ts` to fit the UI contract.

## Review checklist

- Every example chart container uses `.sc-chart-wrapper`.
- A toolbar is a direct `.sc-toolbar-row` child of that wrapper; the wrapper needs no toolbar modifier.
- Toolbar controls remain left-aligned with the standard padding, gap, and fixed height.
- Component selectors use `sc-` names; utility classes stay short and unprefixed.
- Dark, light, and standalone theme modes keep controls readable.
- Exported markup needs only HTML, CSS, and the chosen framework's ordinary event bindings.
