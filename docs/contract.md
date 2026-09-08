# Scene Detective contract notes

Classification: **INCREMENTAL** product implementation. Evidence labels below
are **EMPIRICAL** for automated checks and **REPORTED** for the brief.

## Player outcome

A curious player can solve six short visual reconstruction cases in a few
minutes, learn a new visual relationship in each case, save progress locally,
reopen it, and leave with a portable PNG result card. A creator can compose a
small target from the same primitives used by the player, export it as JSON,
and reopen it on another browser/device.

## Visible scoring

`lib/scene.ts` renders the target and current compositions to the same 96 × 72
canvas and compares their composited RGB pixels. The score therefore measures
what is visible: a fully occluded piece can differ in hidden parameters without
penalizing the visible image, while an intentional near-miss lowers the score.
The score is a bounded canonical raster comparison, not a claim of general
perceptual similarity. Completion currently requires a 96% visible match.

## Challenge format

The v1 format is `scene-detective-challenge` version `1` with a short seed,
title/note, six-digit hex background, and 1–8 pieces in both a start and target
scene. Piece IDs must match across the two scenes. Primitive kind, position,
scale, layer, color and optional size fields are bounded; JSON text is capped at
100 KB. Import rejects malformed, unsupported, oversized and out-of-range
input without executing arbitrary code.

## Authored cases

1. The late arrival — placement.
2. A small orbit — rotation.
3. Signal in the fog — scale.
4. Rooftop witness — occlusion and layer order.
5. Camouflage study — palette restoration.
6. Night shift — full-scene layering.

## Honest limits

The local contract test cannot establish a fresh player’s understanding,
artistic quality, touch comfort or device-independent performance. Those remain
explicit independent review gates. The browser edition is static and local;
there is no remote leaderboard, account, external image input, audio system or
hosted inference.
