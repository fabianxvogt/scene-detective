<!-- portfolio
{
  "title": "Scene Detective",
  "topic": "Play & products/Games",
  "type": "product",
  "description": "Reconstruct layered scenes in six visual deduction cases.",
  "demo": "https://scene-detective.fabianxvogt.chatgpt.site/"
}
-->

# Scene Detective

Scene Detective is a short, browser-first visual reconstruction game. A player
studies a target composition, adjusts a small set of bounded primitives, and
closes the case when the rendered image matches the visible evidence. Completed
cases can produce a PNG result card, and player-authored cases can travel as
versioned `.scene.json` files.

## Status

**Released publicly.** Site version 3 is deployed from immutable runtime SHA
`79e513a156462d4f569f29282fb2718f84f5e6d7` after independent source review,
fresh-player playability review and parent acceptance. The documentation-only
source head may be newer than the deployed runtime; no product code changed
after that release.

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
near-misses. On the accepted runtime revision, independent browser review
completed all six authored reconstructions; the final four measured reset to
solved at 82→100%, 92→100%, 80→100% and 81→100%. Human playability and visual
quality remain separate acceptance gates; source tests do not claim them.

The in-app browser did not expose an exact 390px CSS viewport override or a
full runtime-console assertion. The owner calibration run recorded no warning
or error entries, and the responsive controls were visibly stacked and usable
on the available narrow surface.

## Hosting

The project uses the existing Site destination in `.openai/hosting.json`; no
replacement Site or paid service is required. Deployment uses the exact saved
version produced from the accepted source state rather than an unsaved local
build.

Live app: [scene-detective.fabianxvogt.chatgpt.site](https://scene-detective.fabianxvogt.chatgpt.site)

Public source: [github.com/fabianxvogt/scene-detective](https://github.com/fabianxvogt/scene-detective)

## License

MIT. See [docs/README.md](docs/README.md) for the project record and evidence
navigation.
