# Independent review checklist

Review the exact candidate revision, not a moving working tree.

## Source correctness

- Confirm target/current render at identical parameters reaches the completion
  threshold.
- Confirm a visually identical result with hidden/occluded parameter changes is
  scored from pixels rather than secret parameter equality.
- Confirm intentional position/rotation/scale/color/layer near-misses remain
  below the completion threshold.
- Confirm transparent and occluded shapes behave through compositing.
- Confirm malformed JSON, unsupported version, oversized files, invalid ranges,
  duplicate IDs and start/target ID mismatches are rejected.

## Journey

- Start each authored case, understand its teaching clue and complete it.
- Use sliders, nudge buttons, keyboard shortcuts, hint, reset and undo.
- Refresh during a case and reopen the saved progress.
- Finish a case, replay it, and download a PNG result card.
- Create a challenge, export it, paste/import it again, and reopen/play it.
- Check the desktop layout and a narrow viewport on a touch-capable device if
  available.

## Release gate

Do not call the product fully accepted from source tests alone. For the exact
runtime revision
`00f31c5be28b310dc586751bf26ad7f8c3030e58`, independent source review,
fresh-player visual/playability review and parent acceptance are recorded.
The final build, saved Site version, public URL and standalone source URL must
still be recorded against the documentation-inclusive deployed revision.
