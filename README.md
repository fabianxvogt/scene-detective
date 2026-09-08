# Scene Detective

Scene Detective is a short, browser-first visual reconstruction game. A player
studies a target composition, adjusts a small set of bounded primitives, and
closes the case when the rendered image matches the visible evidence. Completed
cases can produce a PNG result card, and player-authored cases can travel as
versioned `.scene.json` files.

## Status

**Building / verification.** The complete v1 journey is implemented locally;
independent source review, fresh-player playability review and exact-revision
acceptance are still open. No public deployment is claimed yet.

## Quickstart

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by the server. The production artifact can be
checked with `npm run build`.

## What is included

- Six authored cases teaching placement, rotation, scale, occlusion, color and
  layering.
- Canvas-based target and reconstruction renderer with visible raster scoring.
- Mouse/touch-friendly sliders and nudge controls, plus keyboard shortcuts.
- Hint, reset, undo, progress save/reopen and replayable completion state.
- Bounded creator mode with six primitives and an eight-piece cap.
- Validated version-1 challenge JSON import/export with a 100 KB limit.
- PNG result cards that include the target and reconstruction.

Progress is stored locally in the browser. No account, remote images,
leaderboard, arbitrary script import or hosted inference is used.

## Verification

```bash
npm run verify:contract
npm run build
```

`verify:contract` covers malformed/oversized challenge input, range and ID
checks, seed/target round-tripping, identical visible pixels and visible
near-misses. Human playability and visual quality remain separate acceptance
gates; source tests do not claim them.

## Hosting

The project is configured as a static Sites build in `.openai/hosting.json`.
The selected Site remains private and unpublished until independent review and
the parent task accept the exact revision. Deployment uses the existing Site
project rather than creating a replacement.

## License

MIT. See [docs/README.md](docs/README.md) for the project record and evidence
navigation.
