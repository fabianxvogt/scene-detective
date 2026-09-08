import assert from 'node:assert/strict';
import {
  defaultPiece,
  normalizePiece,
  scorePixelData,
  validateChallenge,
  validateChallengeText,
} from '../lib/scene.ts';

const target = normalizePiece({
  ...defaultPiece('occluded', 'rect', 0),
  x: 50,
  y: 50,
  w: 20,
  h: 20,
  color: '#e67568',
});
const start = normalizePiece({ ...target, x: 48, y: 52, layer: 4 });
const challenge = {
  kind: 'scene-detective-challenge',
  version: 1,
  seed: 'contract-fixture',
  title: 'Contract fixture',
  note: 'A deliberately small check.',
  background: '#142b3b',
  pieces: [start],
  targetPieces: [target],
};

const accepted = validateChallenge(challenge);
assert.equal(accepted.valid, true, 'valid bounded challenge should load');
if (accepted.valid) {
  assert.equal(
    accepted.challenge.seed,
    challenge.seed,
    'seed must survive validation',
  );
  assert.deepEqual(
    accepted.challenge.targetPieces[0].id,
    'occluded',
    'target must survive validation',
  );
}

assert.equal(
  normalizePiece({ ...start, alpha: 0 }).alpha,
  0,
  'transparent pieces must preserve alpha=0',
);
assert.equal(
  validateChallenge({ ...challenge, pieces: [{ ...start, alpha: 2 }] }).valid,
  false,
  'alpha outside 0–1 must be rejected',
);
assert.equal(
  validateChallenge({ ...challenge, pieces: [{ ...start, w: 3 }] }).valid,
  false,
  'width below the canonical renderer range must be rejected',
);
assert.equal(
  validateChallenge({ ...challenge, pieces: [{ ...start, radius: 33 }] }).valid,
  false,
  'radius above the canonical renderer range must be rejected',
);
assert.equal(
  validateChallenge({ ...challenge, pieces: [{ ...start, kind: 'circle' }] })
    .valid,
  false,
  'start/target primitive kind mismatches must be rejected',
);
assert.equal(
  validateChallenge({ ...challenge, pieces: [{ ...start, layer: -3 }] }).valid,
  false,
  'layers below the player control range must be rejected',
);
assert.equal(
  validateChallenge({ ...challenge, pieces: [{ ...start, layer: 9 }] }).valid,
  false,
  'layers above the player control range must be rejected',
);
assert.equal(
  normalizePiece({ ...start, layer: -2 }).layer,
  -2,
  'accepted lower layer bound must remain exact',
);
assert.equal(
  normalizePiece({ ...start, layer: 8 }).layer,
  8,
  'accepted upper layer bound must remain exact',
);
const editableDelta = validateChallengeText(
  JSON.stringify({
    ...challenge,
    pieces: [{ ...start, w: 4, h: 12, alpha: 0 }],
    targetPieces: [{ ...target, w: 20, h: 24, alpha: 0.55 }],
  }),
);
assert.equal(
  editableDelta.valid,
  true,
  'valid size/opacity deltas must remain importable',
);
if (editableDelta.valid) {
  assert.equal(
    editableDelta.challenge.pieces[0].w,
    4,
    'accepted width must remain exact',
  );
  assert.equal(
    editableDelta.challenge.targetPieces[0].h,
    24,
    'accepted height must remain exact',
  );
  assert.equal(
    editableDelta.challenge.pieces[0].alpha,
    0,
    'accepted opacity must remain exact',
  );
}
const transparentChallenge = {
  ...challenge,
  pieces: [{ ...start, alpha: 0 }],
  targetPieces: [{ ...target, alpha: 0 }],
};
const transparentRoundTrip = validateChallengeText(
  JSON.stringify(transparentChallenge),
);
assert.equal(
  transparentRoundTrip.valid,
  true,
  'transparent challenge JSON must import',
);
if (transparentRoundTrip.valid) {
  assert.equal(
    transparentRoundTrip.challenge.pieces[0].alpha,
    0,
    'transparent start alpha must survive export/import',
  );
  assert.equal(
    transparentRoundTrip.challenge.targetPieces[0].alpha,
    0,
    'transparent target alpha must survive export/import',
  );
}

const roundTrip = validateChallengeText(JSON.stringify(challenge));
assert.equal(roundTrip.valid, true, 'exported JSON must reopen');
assert.equal(
  validateChallengeText('x'.repeat(100_001)).valid,
  false,
  'oversized input must be rejected',
);
assert.equal(
  validateChallenge({
    ...challenge,
    pieces: Array.from({ length: 9 }, (_, i) => ({
      ...start,
      id: `piece-${i}`,
    })),
    targetPieces: Array.from({ length: 9 }, (_, i) => ({
      ...target,
      id: `piece-${i}`,
    })),
  }).valid,
  false,
  'oversized piece lists must be rejected',
);
assert.equal(
  validateChallenge({
    ...challenge,
    targetPieces: [{ ...target, id: 'different-id' }],
  }).valid,
  false,
  'start/target id mismatch must be rejected',
);

const samePixels = new Uint8ClampedArray([10, 20, 30, 255, 10, 20, 30, 255]);
const nearPixels = new Uint8ClampedArray([10, 20, 31, 255, 10, 20, 30, 255]);
assert.equal(
  scorePixelData(samePixels, samePixels, 2, 1),
  100,
  'identical visible pixels must score 100',
);
assert(
  scorePixelData(samePixels, nearPixels, 2, 1) < 100,
  'a visible near-miss must score below 100',
);

console.log(
  'Scene Detective contract checks passed: validation, round-trip, bounds, ids, and pixel scoring.',
);
