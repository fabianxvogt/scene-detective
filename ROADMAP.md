# Scene Detective roadmap

State: **released publicly**

## Now

- Observe real player use on the public app.
- Keep the deployed runtime SHA and documentation head distinct for traceability.

## Next

- Consider a small curated gallery only if real use shows it improves replay.

## Later

- Observe whether player-authored challenges are actually reopened and shared.
- Consider a small curated gallery only if real use shows it improves replay.

## Done

- Standalone source home created at `games/scene-detective`.
- Six original authored visual cases implemented.
- Visible composited-raster scoring implemented; hidden parameter equality is
  not required for a match.
- Keyboard/touch controls, hints, reset, undo, local progress and replay.
- Bounded creator, validated JSON import/export and PNG result card.
- Local contract verification and production build pass.
- Exact runtime `00f31c5be28b310dc586751bf26ad7f8c3030e58` accepted by source and
  fresh-player review; cases 3–6 measured reset→solved at 82→100%, 92→100%,
  80→100% and 81→100%.
- Browser limits recorded: no exact 390px CSS viewport override or full
  console assertion was available through the in-app browser; owner logs were
  empty and the available narrow surface showed stacked controls.
- Public Site version 3 is live at
  https://scene-detective.fabianxvogt.chatgpt.site from immutable runtime SHA
  `79e513a156462d4f569f29282fb2718f84f5e6d7`.
- Public source is available at
  https://github.com/fabianxvogt/scene-detective.
