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
