# SciChart with Webpack + TypeScript, strict lib check

Repro for the customer-reported build failure:

```
TS2416: Property 'type' in type 'CompositeAnnotation' is not assignable to the same property
in base type 'BoxAnnotation'.
  Type 'EAnnotationType.CompositeAnnotation' is not assignable to
  type 'EAnnotationType.RenderContextBoxAnnotation'.
```

The only thing that matters here is `"skipLibCheck": false` in [tsconfig.json](tsconfig.json).
With it set, `tsc` type-checks every `.d.ts` under `node_modules/scichart` and reports the
invalid property override in `Charting/Visuals/Annotations/CompositeAnnotation.d.ts`.

Nothing in [src/index.ts](src/index.ts) causes the error — it fails even on an empty file that
merely imports from `scichart`.

## Reproduce

```bash
npm install
npm run check          # skipLibCheck: false -> expect TS2416
npm run check:skiplib  # skipLibCheck: true  -> expect clean (the customer workaround)
npm run build          # webpack + ts-loader -> fails with the same TS2416
```

## Verify a fix

Build the library, then point this example at the local build:

```bash
# in Web/src/SciChart
npm run buildJs
npm run relink

# here
npm link scichart
npm run check          # expect clean
```

Note that `npm install` in this folder breaks the link and it must be redone.

## Versions

All dependencies are at their latest, with one deliberate exception:

- **typescript is pinned to the 6.x line, not 7.x.** TypeScript 7.0.2 (the native port)
  reproduces the TS2416 identically, but `ts-loader@9.6.2` cannot consume it — the webpack
  build dies with `TypeError: Cannot read properties of undefined (reading 'fileExists')`
  because the loader calls `ts.sys` APIs the native port no longer exposes. TypeScript 6.0.3
  keeps `npm run build` working while still being current.
- The error has been confirmed on TypeScript **5.9.3** (the version in the customer report),
  **6.0.3** and **7.0.2**.

`tsconfig.json` uses full `strict: true`. This is stricter than the `demo-webpack-typescript`
example it was copied from (which disabled `strictNullChecks` and `strictPropertyInitialization`),
and produces no extra errors — the `CompositeAnnotation` override is the only problem in
SciChart's declarations under a full strict lib check.

`rootDir` is set explicitly because TypeScript 6 requires it (`TS5011`) when `outDir` is used.

## Running the chart

`npm start`, then visit https://localhost:8080.
