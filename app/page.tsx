'use client';

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Clipboard,
  Download,
  FileJson,
  Layers3,
  Lightbulb,
  Move,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Undo2,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  clonePieces,
  defaultPiece,
  formatScore,
  normalizePiece,
  renderScene,
  validateChallenge,
  validateChallengeText,
  visibleScore,
  type Piece,
  type PrimitiveKind,
  type SceneChallenge,
} from '@/lib/scene';
import './globals.css';

const STORAGE_KEY = 'scene-detective:progress:v1';
const WIN_SCORE = 96;

type AuthoredCase = SceneChallenge & {
  id: string;
  chapter: string;
  lesson: string;
  difficulty: string;
  accent: string;
};

const p = (id: string, kind: PrimitiveKind, values: Partial<Piece>): Piece =>
  normalizePiece({
    ...defaultPiece(id, kind, values.layer ?? 0),
    ...values,
    id,
    kind,
  });

const authored = (
  id: string,
  title: string,
  chapter: string,
  lesson: string,
  difficulty: string,
  background: string,
  targetPieces: Piece[],
  pieces: Piece[],
  note: string,
  accent: string,
): AuthoredCase => ({
  id,
  kind: 'scene-detective-challenge',
  version: 1,
  seed: id,
  title,
  chapter,
  lesson,
  difficulty,
  background,
  targetPieces,
  pieces,
  note,
  accent,
});

const AUTHORED_CASES: AuthoredCase[] = [
  authored(
    'arrival',
    'The late arrival',
    '01 / First clue',
    'Place the evidence',
    'Warm-up',
    '#142b3b',
    [
      p('horizon', 'rect', {
        x: 50,
        y: 81,
        w: 96,
        h: 18,
        color: '#e97863',
        layer: 0,
      }),
      p('sun', 'circle', {
        x: 22,
        y: 24,
        radius: 12,
        color: '#ffc66d',
        layer: 1,
      }),
      p('house', 'rect', {
        x: 67,
        y: 65,
        w: 30,
        h: 34,
        color: '#f4e5c4',
        layer: 2,
      }),
      p('roof', 'triangle', {
        x: 67,
        y: 45,
        w: 40,
        h: 28,
        color: '#e65d5d',
        layer: 3,
      }),
      p('door', 'rect', {
        x: 67,
        y: 74,
        w: 8,
        h: 16,
        color: '#334c59',
        layer: 4,
      }),
      p('window', 'diamond', {
        x: 58,
        y: 62,
        w: 8,
        h: 8,
        color: '#7ee2d3',
        layer: 4,
      }),
    ],
    [
      p('horizon', 'rect', {
        x: 50,
        y: 75,
        w: 96,
        h: 18,
        color: '#e97863',
        layer: 0,
      }),
      p('sun', 'circle', {
        x: 30,
        y: 31,
        radius: 12,
        color: '#ffc66d',
        layer: 1,
      }),
      p('house', 'rect', {
        x: 58,
        y: 62,
        w: 30,
        h: 34,
        color: '#f4e5c4',
        layer: 2,
      }),
      p('roof', 'triangle', {
        x: 58,
        y: 45,
        w: 40,
        h: 28,
        color: '#e65d5d',
        layer: 3,
      }),
      p('door', 'rect', {
        x: 58,
        y: 72,
        w: 8,
        h: 16,
        color: '#334c59',
        layer: 4,
      }),
      p('window', 'diamond', {
        x: 50,
        y: 60,
        w: 8,
        h: 8,
        color: '#7ee2d3',
        layer: 4,
      }),
    ],
    'The horizon is steady. Only the landmarks drifted.',
    '#e97863',
  ),
  authored(
    'orbit',
    'A small orbit',
    '02 / Second clue',
    'Turn the signal',
    'Easy',
    '#282040',
    [
      p('planet', 'circle', {
        x: 51,
        y: 56,
        radius: 18,
        color: '#f2b8d8',
        layer: 1,
      }),
      p('ring', 'rect', {
        x: 51,
        y: 56,
        w: 52,
        h: 8,
        rotation: -22,
        color: '#f3d08a',
        alpha: 0.9,
        layer: 2,
      }),
      p('satellite', 'diamond', {
        x: 78,
        y: 25,
        w: 14,
        h: 14,
        rotation: 36,
        color: '#73e0c4',
        layer: 3,
      }),
      p('star', 'star', {
        x: 18,
        y: 23,
        w: 13,
        h: 13,
        color: '#f8e6b5',
        layer: 2,
      }),
      p('star-2', 'star', {
        x: 82,
        y: 77,
        w: 9,
        h: 9,
        color: '#f8e6b5',
        layer: 2,
      }),
    ],
    [
      p('planet', 'circle', {
        x: 51,
        y: 56,
        radius: 18,
        color: '#f2b8d8',
        layer: 1,
      }),
      p('ring', 'rect', {
        x: 51,
        y: 56,
        w: 52,
        h: 8,
        rotation: 18,
        color: '#f3d08a',
        alpha: 0.9,
        layer: 2,
      }),
      p('satellite', 'diamond', {
        x: 78,
        y: 25,
        w: 14,
        h: 14,
        rotation: -15,
        color: '#73e0c4',
        layer: 3,
      }),
      p('star', 'star', {
        x: 18,
        y: 23,
        w: 13,
        h: 13,
        color: '#f8e6b5',
        layer: 2,
      }),
      p('star-2', 'star', {
        x: 82,
        y: 77,
        w: 9,
        h: 9,
        color: '#f8e6b5',
        layer: 2,
      }),
    ],
    'The orbit is the giveaway: find its angle, then align the little satellite.',
    '#73e0c4',
  ),
  authored(
    'signal',
    'Signal in the fog',
    '03 / Third clue',
    'Find the right scale',
    'Easy',
    '#102b30',
    [
      p('beam', 'rect', {
        x: 51,
        y: 44,
        w: 65,
        h: 9,
        color: '#61e0c1',
        layer: 1,
      }),
      p('beacon', 'circle', {
        x: 78,
        y: 44,
        radius: 11,
        color: '#ffd070',
        layer: 2,
      }),
      p('mast', 'rect', {
        x: 78,
        y: 68,
        w: 5,
        h: 42,
        color: '#c9e8dc',
        layer: 1,
      }),
      p('cloud', 'moon', {
        x: 29,
        y: 26,
        radius: 14,
        color: '#8bbbc1',
        alpha: 0.75,
        layer: 2,
      }),
      p('marker', 'diamond', {
        x: 18,
        y: 70,
        w: 11,
        h: 11,
        color: '#e87568',
        layer: 3,
      }),
    ],
    [
      p('beam', 'rect', {
        x: 51,
        y: 44,
        w: 47,
        h: 9,
        color: '#61e0c1',
        layer: 1,
      }),
      p('beacon', 'circle', {
        x: 78,
        y: 44,
        radius: 8,
        color: '#ffd070',
        layer: 2,
      }),
      p('mast', 'rect', {
        x: 78,
        y: 68,
        w: 5,
        h: 42,
        color: '#c9e8dc',
        layer: 1,
      }),
      p('cloud', 'moon', {
        x: 29,
        y: 26,
        radius: 10,
        color: '#8bbbc1',
        alpha: 0.75,
        layer: 2,
      }),
      p('marker', 'diamond', {
        x: 18,
        y: 70,
        w: 11,
        h: 11,
        color: '#e87568',
        layer: 3,
      }),
    ],
    'Not everything moved. Compare the beacon’s halo to the beam’s reach.',
    '#ffd070',
  ),
  authored(
    'rooftop',
    'Rooftop witness',
    '04 / Fourth clue',
    'Read the occlusion',
    'Medium',
    '#263332',
    [
      p('sky-moon', 'circle', {
        x: 79,
        y: 20,
        radius: 9,
        color: '#f7d895',
        layer: 1,
      }),
      p('building', 'rect', {
        x: 57,
        y: 68,
        w: 55,
        h: 46,
        color: '#e9bd6b',
        layer: 2,
      }),
      p('roof', 'triangle', {
        x: 57,
        y: 42,
        w: 64,
        h: 38,
        color: '#d45d5d',
        layer: 4,
      }),
      p('chimney', 'rect', {
        x: 74,
        y: 35,
        w: 9,
        h: 23,
        color: '#e9bd6b',
        layer: 3,
      }),
      p('cat', 'triangle', {
        x: 40,
        y: 62,
        w: 16,
        h: 19,
        color: '#64c6b4',
        layer: 5,
      }),
      p('window', 'rect', {
        x: 58,
        y: 72,
        w: 8,
        h: 11,
        color: '#263332',
        layer: 5,
      }),
    ],
    [
      p('sky-moon', 'circle', {
        x: 79,
        y: 20,
        radius: 9,
        color: '#f7d895',
        layer: 1,
      }),
      p('building', 'rect', {
        x: 57,
        y: 68,
        w: 55,
        h: 46,
        color: '#e9bd6b',
        layer: 2,
      }),
      p('roof', 'triangle', {
        x: 57,
        y: 42,
        w: 64,
        h: 38,
        color: '#d45d5d',
        layer: 3,
      }),
      p('chimney', 'rect', {
        x: 74,
        y: 35,
        w: 9,
        h: 23,
        color: '#e9bd6b',
        layer: 4,
      }),
      p('cat', 'triangle', {
        x: 43,
        y: 59,
        w: 16,
        h: 19,
        color: '#64c6b4',
        layer: 5,
      }),
      p('window', 'rect', {
        x: 58,
        y: 72,
        w: 8,
        h: 11,
        color: '#263332',
        layer: 5,
      }),
    ],
    'The chimney is behind the roofline. Put the layers back before you chase position.',
    '#d45d5d',
  ),
  authored(
    'camouflage',
    'Camouflage study',
    '05 / Fifth clue',
    'Restore the palette',
    'Medium',
    '#33253b',
    [
      p('base', 'rect', {
        x: 50,
        y: 72,
        w: 80,
        h: 22,
        color: '#d05f74',
        layer: 1,
      }),
      p('leaf', 'diamond', {
        x: 29,
        y: 46,
        w: 30,
        h: 45,
        rotation: -18,
        color: '#6bd3b6',
        layer: 2,
      }),
      p('fruit', 'circle', {
        x: 67,
        y: 42,
        radius: 15,
        color: '#f4bd6b',
        layer: 3,
      }),
      p('spark', 'star', {
        x: 74,
        y: 70,
        w: 20,
        h: 20,
        color: '#f6e3a5',
        layer: 4,
      }),
      p('stem', 'rect', {
        x: 50,
        y: 50,
        w: 5,
        h: 45,
        rotation: 24,
        color: '#9d75b6',
        alpha: 0.9,
        layer: 3,
      }),
    ],
    [
      p('base', 'rect', {
        x: 50,
        y: 72,
        w: 80,
        h: 22,
        color: '#d05f74',
        layer: 1,
      }),
      p('leaf', 'diamond', {
        x: 29,
        y: 46,
        w: 30,
        h: 45,
        rotation: -18,
        color: '#927fc1',
        layer: 2,
      }),
      p('fruit', 'circle', {
        x: 67,
        y: 42,
        radius: 15,
        color: '#6bd3b6',
        layer: 3,
      }),
      p('spark', 'star', {
        x: 74,
        y: 70,
        w: 20,
        h: 20,
        color: '#f6e3a5',
        layer: 4,
      }),
      p('stem', 'rect', {
        x: 50,
        y: 50,
        w: 5,
        h: 45,
        rotation: 24,
        color: '#9d75b6',
        alpha: 0.9,
        layer: 3,
      }),
    ],
    'Two colors swapped places. Use the palette as evidence, not decoration.',
    '#6bd3b6',
  ),
  authored(
    'night-shift',
    'Night shift',
    '06 / Final clue',
    'Layer the whole scene',
    'Hard',
    '#101c32',
    [
      p('back-glow', 'moon', {
        x: 24,
        y: 27,
        radius: 20,
        color: '#3f7ea1',
        alpha: 0.5,
        layer: 0,
      }),
      p('moon', 'circle', {
        x: 24,
        y: 27,
        radius: 11,
        color: '#f7d895',
        layer: 1,
      }),
      p('far-hill', 'triangle', {
        x: 39,
        y: 66,
        w: 76,
        h: 38,
        color: '#31536f',
        layer: 2,
      }),
      p('near-hill', 'triangle', {
        x: 72,
        y: 75,
        w: 76,
        h: 45,
        color: '#1b344d',
        layer: 3,
      }),
      p('window', 'rect', {
        x: 64,
        y: 65,
        w: 14,
        h: 21,
        color: '#ffc56a',
        layer: 4,
      }),
      p('mast', 'rect', {
        x: 82,
        y: 48,
        w: 5,
        h: 48,
        color: '#e7e9de',
        layer: 4,
      }),
      p('flag', 'triangle', {
        x: 89,
        y: 34,
        w: 20,
        h: 16,
        color: '#e67568',
        layer: 5,
      }),
    ],
    [
      p('back-glow', 'moon', {
        x: 24,
        y: 27,
        radius: 20,
        color: '#3f7ea1',
        alpha: 0.5,
        layer: 0,
      }),
      p('moon', 'circle', {
        x: 24,
        y: 27,
        radius: 11,
        color: '#f7d895',
        layer: 1,
      }),
      p('far-hill', 'triangle', {
        x: 39,
        y: 66,
        w: 76,
        h: 38,
        color: '#31536f',
        layer: 3,
      }),
      p('near-hill', 'triangle', {
        x: 72,
        y: 75,
        w: 76,
        h: 45,
        color: '#1b344d',
        layer: 2,
      }),
      p('window', 'rect', {
        x: 64,
        y: 65,
        w: 14,
        h: 21,
        color: '#ffc56a',
        layer: 4,
      }),
      p('mast', 'rect', {
        x: 82,
        y: 48,
        w: 5,
        h: 48,
        color: '#e7e9de',
        layer: 4,
      }),
      p('flag', 'triangle', {
        x: 89,
        y: 34,
        w: 20,
        h: 16,
        color: '#e67568',
        layer: 5,
      }),
    ],
    'The final case is about depth. The hills are the same shapes; their order makes the night.',
    '#f7d895',
  ),
];

type Mode = 'case' | 'creator';

function readSlider(value: number | readonly number[]) {
  return Number(Array.isArray(value) ? value[0] : value);
}

function scramblePieces(pieces: Piece[], seed: string) {
  const offset = Array.from(seed).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
  return pieces.map((piece, index) =>
    normalizePiece({
      ...piece,
      x: piece.x + ((offset + index * 13) % 13) - 6,
      y: piece.y + ((offset + index * 7) % 11) - 5,
      rotation: piece.rotation + (index % 2 === 0 ? 18 : -24),
      scale: piece.scale * (index % 2 === 0 ? 0.86 : 1.12),
      layer: piece.layer + (index === 1 ? 1 : 0),
    }),
  );
}

function createChallenge(
  title: string,
  note: string,
  seed: string,
  background: string,
  targetPieces: Piece[],
): SceneChallenge {
  return {
    kind: 'scene-detective-challenge',
    version: 1,
    seed: seed.trim() || 'field-note',
    title: title.trim() || 'Untitled case',
    note: note.trim(),
    background,
    targetPieces: clonePieces(targetPieces),
    pieces: scramblePieces(targetPieces, seed),
  };
}

function drawSelection(
  ctx: CanvasRenderingContext2D,
  piece: Piece,
  width: number,
  height: number,
) {
  const x = (piece.x / 100) * width;
  const y = (piece.y / 100) * height;
  const size =
    (Math.max(piece.w ?? 16, piece.h ?? 16, (piece.radius ?? 10) * 2) *
      piece.scale *
      Math.min(width, height)) /
    100;
  ctx.save();
  ctx.strokeStyle = '#fff8de';
  ctx.lineWidth = Math.max(1.5, width / 180);
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.arc(x, y, size * 0.62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawHintLine(
  ctx: CanvasRenderingContext2D,
  current: Piece,
  target: Piece,
  width: number,
  height: number,
) {
  const x1 = (current.x / 100) * width;
  const y1 = (current.y / 100) * height;
  const x2 = (target.x / 100) * width;
  const y2 = (target.y / 100) * height;
  ctx.save();
  ctx.strokeStyle = '#f6c767';
  ctx.fillStyle = '#f6c767';
  ctx.lineWidth = Math.max(2, width / 130);
  ctx.setLineDash([8, 7]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(x2, y2, Math.max(4, width / 52), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function createResultCard(
  challenge: SceneChallenge,
  pieces: Piece[],
  score: number,
) {
  const card = document.createElement('canvas');
  card.width = 1400;
  card.height = 900;
  const ctx = card.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available in this browser.');
  ctx.fillStyle = '#f6efd9';
  ctx.fillRect(0, 0, card.width, card.height);
  ctx.fillStyle = '#18354b';
  ctx.font = '700 48px Georgia, serif';
  ctx.fillText('SCENE DETECTIVE', 72, 92);
  ctx.fillStyle = '#c65c5e';
  ctx.font = '700 22px Arial, sans-serif';
  ctx.fillText('CASE CLOSED', 76, 134);
  ctx.fillStyle = '#18354b';
  ctx.font = '700 34px Georgia, serif';
  ctx.fillText(challenge.title, 72, 194);
  ctx.fillStyle = '#577080';
  ctx.font = '22px Arial, sans-serif';
  ctx.fillText(
    `Visible match ${formatScore(score)}  •  ${challenge.seed}`,
    74,
    232,
  );
  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = 580;
  targetCanvas.height = 450;
  const targetCtx = targetCanvas.getContext('2d');
  const currentCanvas = document.createElement('canvas');
  currentCanvas.width = 580;
  currentCanvas.height = 450;
  const currentCtx = currentCanvas.getContext('2d');
  if (!targetCtx || !currentCtx)
    throw new Error('Canvas is not available in this browser.');
  renderScene(targetCtx, 580, 450, {
    background: challenge.background,
    pieces: challenge.targetPieces,
  });
  renderScene(currentCtx, 580, 450, {
    background: challenge.background,
    pieces,
  });
  ctx.drawImage(targetCanvas, 72, 276, 580, 450);
  ctx.drawImage(currentCanvas, 748, 276, 580, 450);
  ctx.fillStyle = '#18354b';
  ctx.font = '700 19px Arial, sans-serif';
  ctx.fillText('THE BRIEF', 72, 764);
  ctx.fillText('YOUR RECONSTRUCTION', 748, 764);
  ctx.fillStyle = '#577080';
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText('A visual match, not a secret code.', 72, 804);
  ctx.fillText('Rebuilt from the visible evidence.', 748, 804);
  return card.toDataURL('image/png');
}

function SectionLabel({ children }: { children: string }) {
  return <div className="section-label">{children}</div>;
}

function PieceControls({
  piece,
  onChange,
}: {
  piece: Piece | undefined;
  onChange: (patch: Partial<Piece>) => void;
}) {
  if (!piece)
    return (
      <div className="empty-controls">
        Select a piece on the reconstruction to inspect it.
      </div>
    );
  return (
    <div className="piece-controls">
      <div className="selected-piece-head">
        <span className="piece-chip" style={{ background: piece.color }} />
        <div>
          <strong>{piece.id.replaceAll('-', ' ')}</strong>
          <span>
            {piece.kind} / layer {piece.layer}
          </span>
        </div>
      </div>
      <label className="control-row">
        <span>
          <span>Horizontal</span>
          <output>{Math.round(piece.x)}%</output>
        </span>
        <Slider
          aria-label="Horizontal position"
          min={-10}
          max={110}
          step={1}
          value={[piece.x]}
          onValueChange={(value) => onChange({ x: readSlider(value) })}
        />
      </label>
      <label className="control-row">
        <span>
          <span>Vertical</span>
          <output>{Math.round(piece.y)}%</output>
        </span>
        <Slider
          aria-label="Vertical position"
          min={-10}
          max={110}
          step={1}
          value={[piece.y]}
          onValueChange={(value) => onChange({ y: readSlider(value) })}
        />
      </label>
      <label className="control-row">
        <span>
          <span>Rotation</span>
          <output>{Math.round(piece.rotation)}°</output>
        </span>
        <Slider
          aria-label="Rotation"
          min={0}
          max={359}
          step={1}
          value={[piece.rotation]}
          onValueChange={(value) => onChange({ rotation: readSlider(value) })}
        />
      </label>
      <label className="control-row">
        <span>
          <span>Scale</span>
          <output>{piece.scale.toFixed(2)}×</output>
        </span>
        <Slider
          aria-label="Scale"
          min={0.25}
          max={2.4}
          step={0.01}
          value={[piece.scale]}
          onValueChange={(value) => onChange({ scale: readSlider(value) })}
        />
      </label>
      <label className="control-row">
        <span>
          <span>Width</span>
          <output>{Math.round(piece.w ?? 18)}</output>
        </span>
        <Slider
          aria-label="Width"
          min={4}
          max={60}
          step={1}
          value={[piece.w ?? 18]}
          onValueChange={(value) => onChange({ w: readSlider(value) })}
        />
      </label>
      <label className="control-row">
        <span>
          <span>Height</span>
          <output>{Math.round(piece.h ?? 18)}</output>
        </span>
        <Slider
          aria-label="Height"
          min={4}
          max={60}
          step={1}
          value={[piece.h ?? 18]}
          onValueChange={(value) => onChange({ h: readSlider(value) })}
        />
      </label>
      {(piece.kind === 'circle' || piece.kind === 'moon') && (
        <label className="control-row">
          <span>
            <span>Radius</span>
            <output>{Math.round(piece.radius ?? 10)}</output>
          </span>
          <Slider
            aria-label="Radius"
            min={3}
            max={32}
            step={1}
            value={[piece.radius ?? 10]}
            onValueChange={(value) => onChange({ radius: readSlider(value) })}
          />
        </label>
      )}
      <label className="control-row">
        <span>
          <span>Opacity</span>
          <output>{Math.round((piece.alpha ?? 1) * 100)}%</output>
        </span>
        <Slider
          aria-label="Opacity"
          min={0}
          max={1}
          step={0.01}
          value={[piece.alpha ?? 1]}
          onValueChange={(value) => onChange({ alpha: readSlider(value) })}
        />
      </label>
      <label className="control-row">
        <span>
          <span>Layer</span>
          <output>{piece.layer}</output>
        </span>
        <Slider
          aria-label="Layer"
          min={-2}
          max={8}
          step={1}
          value={[piece.layer]}
          onValueChange={(value) => onChange({ layer: readSlider(value) })}
        />
      </label>
      <label className="color-row">
        <span>Color</span>
        <input
          aria-label="Piece color"
          type="color"
          value={piece.color}
          onChange={(event) => onChange({ color: event.target.value })}
        />
      </label>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>('case');
  const [caseIndex, setCaseIndex] = useState(0);
  const [customChallenge, setCustomChallenge] = useState<SceneChallenge | null>(
    null,
  );
  const [pieces, setPieces] = useState<Piece[]>(() =>
    clonePieces(AUTHORED_CASES[0].pieces),
  );
  const [history, setHistory] = useState<Piece[][]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [selectedId, setSelectedId] = useState(AUTHORED_CASES[0].pieces[0].id);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [won, setWon] = useState(false);
  const [hintText, setHintText] = useState<string | null>(null);
  const [hintPieceId, setHintPieceId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [creatorPieces, setCreatorPieces] = useState<Piece[]>(() => [
    p('circle-1', 'circle', {
      x: 30,
      y: 38,
      radius: 14,
      color: '#f6c767',
      layer: 1,
    }),
    p('triangle-1', 'triangle', {
      x: 65,
      y: 60,
      w: 42,
      h: 36,
      color: '#e67568',
      layer: 2,
    }),
    p('diamond-1', 'diamond', {
      x: 72,
      y: 30,
      w: 18,
      h: 18,
      color: '#73d9bf',
      layer: 3,
    }),
  ]);
  const [creatorSelectedId, setCreatorSelectedId] = useState('circle-1');
  const [creatorTitle, setCreatorTitle] = useState('A note from the field');
  const [creatorNote, setCreatorNote] = useState(
    'Can you rebuild this little scene?',
  );
  const [creatorSeed, setCreatorSeed] = useState('field-note-01');
  const [creatorBackground, setCreatorBackground] = useState('#172b40');
  const [importText, setImportText] = useState('');
  const [resultCard, setResultCard] = useState<string | null>(null);
  const targetCanvasRef = useRef<HTMLCanvasElement>(null);
  const workCanvasRef = useRef<HTMLCanvasElement>(null);
  const creatorCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const activeCase = customChallenge ?? AUTHORED_CASES[caseIndex];
  const score = (() => {
    if (typeof document === 'undefined') return 0;
    try {
      return visibleScore(
        { background: activeCase.background, pieces: activeCase.targetPieces },
        { background: activeCase.background, pieces },
      );
    } catch {
      return 0;
    }
  })();
  const selectedPiece = pieces.find((piece) => piece.id === selectedId);
  const creatorSelectedPiece = creatorPieces.find(
    (piece) => piece.id === creatorSelectedId,
  );
  const caseKey = activeCase.seed;

  const saveProgress = useCallback(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ caseIndex, pieces, completed, customChallenge }),
      );
    } catch {
      /* local progress is optional */
    }
  }, [caseIndex, pieces, completed, customChallenge, hydrated]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw) as {
          caseIndex?: number;
          pieces?: Piece[];
          completed?: Record<string, boolean>;
          customChallenge?: unknown;
        };
        if (saved.completed && typeof saved.completed === 'object')
          setCompleted(saved.completed);
        if (
          Number.isInteger(saved.caseIndex) &&
          (saved.caseIndex as number) >= 0 &&
          (saved.caseIndex as number) < AUTHORED_CASES.length
        )
          setCaseIndex(saved.caseIndex as number);
        if (saved.customChallenge) {
          const checked = validateChallenge(saved.customChallenge);
          if (checked.valid) setCustomChallenge(checked.challenge);
        }
        if (Array.isArray(saved.pieces) && saved.pieces.length <= 8)
          setPieces(saved.pieces.map(normalizePiece));
        setToast('Progress reopened from this device.');
      } catch {
        /* ignore malformed local state */
      } finally {
        setHydrated(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    saveProgress();
  }, [saveProgress]);

  const paintCanvases = useCallback(() => {
    const paint = (
      canvas: HTMLCanvasElement | null,
      scenePieces: Piece[],
      selection?: Piece,
      hint?: Piece,
    ) => {
      if (!canvas) return;
      const bounds = canvas.getBoundingClientRect();
      if (bounds.width < 1 || bounds.height < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(bounds.width * dpr);
      canvas.height = Math.round(bounds.height * dpr);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderScene(ctx, bounds.width, bounds.height, {
        background: activeCase.background,
        pieces: scenePieces,
      });
      if (selection) drawSelection(ctx, selection, bounds.width, bounds.height);
      if (hint) {
        const target = activeCase.targetPieces.find(
          (piece) => piece.id === hint.id,
        );
        if (target)
          drawHintLine(ctx, hint, target, bounds.width, bounds.height);
      }
    };
    paint(targetCanvasRef.current, activeCase.targetPieces);
    paint(
      workCanvasRef.current,
      pieces,
      selectedPiece,
      hintPieceId
        ? pieces.find((piece) => piece.id === hintPieceId)
        : undefined,
    );
  }, [activeCase, pieces, selectedPiece, hintPieceId]);

  useEffect(() => {
    paintCanvases();
    window.addEventListener('resize', paintCanvases);
    return () => window.removeEventListener('resize', paintCanvases);
  }, [paintCanvases]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const changePiece = useCallback(
    (
      id: string,
      patch: Partial<Piece>,
      collection: 'case' | 'creator' = 'case',
    ) => {
      if (collection === 'creator') {
        setCreatorPieces((current) =>
          current.map((piece) =>
            piece.id === id ? normalizePiece({ ...piece, ...patch }) : piece,
          ),
        );
        return;
      }
      setHistory((value) => [...value, clonePieces(pieces)].slice(-40));
      setPieces((current) =>
        current.map((piece) =>
          piece.id === id ? normalizePiece({ ...piece, ...patch }) : piece,
        ),
      );
      setHintText(null);
      setHintPieceId(null);
      setWon(false);
    },
    [pieces],
  );

  const nudge = useCallback(
    (dx: number, dy: number) => {
      if (selectedPiece)
        changePiece(selectedPiece.id, {
          x: selectedPiece.x + dx,
          y: selectedPiece.y + dy,
        });
    },
    [changePiece, selectedPiece],
  );
  const undo = useCallback(() => {
    const previous = history.at(-1);
    if (!previous) return;
    setPieces(previous);
    setHistory((value) => value.slice(0, -1));
    setWon(false);
    setHintText(null);
  }, [history]);
  const resetCase = useCallback(() => {
    setHistory((value) => [...value, clonePieces(pieces)].slice(-40));
    setPieces(clonePieces(activeCase.pieces));
    setSelectedId(activeCase.pieces[0]?.id ?? '');
    setWon(false);
    setHintText(null);
    setHintPieceId(null);
    setToast('Case reset. The evidence is still here.');
  }, [activeCase, pieces]);
  const chooseCase = useCallback((index: number) => {
    setCustomChallenge(null);
    setCaseIndex(index);
    setPieces(clonePieces(AUTHORED_CASES[index].pieces));
    setSelectedId(AUTHORED_CASES[index].pieces[0]?.id ?? '');
    setHistory([]);
    setWon(false);
    setHintText(null);
    setHintPieceId(null);
    setResultCard(null);
  }, []);

  const showHint = useCallback(() => {
    const candidates = pieces
      .map((piece) => {
        const target = activeCase.targetPieces.find(
          (item) => item.id === piece.id,
        );
        if (!target) return { piece, target: piece, error: 0 };
        const colorError =
          piece.color.toLowerCase() === target.color.toLowerCase() ? 0 : 25;
        const error =
          Math.abs(piece.x - target.x) +
          Math.abs(piece.y - target.y) +
          Math.abs(piece.rotation - target.rotation) / 12 +
          Math.abs(piece.scale - target.scale) * 18 +
          Math.abs(piece.layer - target.layer) * 8 +
          colorError;
        return { piece, target, error };
      })
      .sort((a, b) => b.error - a.error);
    const clue = candidates[0];
    if (!clue || clue.error < 1) {
      setHintText(
        'You have the composition. Press Check case when you are ready.',
      );
      return;
    }
    setSelectedId(clue.piece.id);
    setHintPieceId(clue.piece.id);
    const dx = clue.target.x - clue.piece.x;
    const dy = clue.target.y - clue.piece.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      const horizontal = Math.abs(dx) > 2 ? (dx > 0 ? 'right' : 'left') : '';
      const vertical = Math.abs(dy) > 2 ? (dy > 0 ? 'down' : 'up') : '';
      setHintText(
        `Move the ${clue.piece.id.replaceAll('-', ' ')} ${[vertical, horizontal].filter(Boolean).join(' and ')}. Follow the dotted evidence line.`,
      );
    } else if (Math.abs(clue.target.rotation - clue.piece.rotation) > 5)
      setHintText(
        `Turn the ${clue.piece.id.replaceAll('-', ' ')} until its edge catches the same angle.`,
      );
    else if (Math.abs(clue.target.scale - clue.piece.scale) > 0.05)
      setHintText(
        `The ${clue.piece.id.replaceAll('-', ' ')} needs a different scale. Compare its footprint, not its hidden value.`,
      );
    else if (clue.target.color.toLowerCase() !== clue.piece.color.toLowerCase())
      setHintText(
        `Restore the ${clue.piece.id.replaceAll('-', ' ')} color from the target frame.`,
      );
    else
      setHintText(
        `The ${clue.piece.id.replaceAll('-', ' ')} is hiding in the wrong layer.`,
      );
    setToast('A clue has been marked on the reconstruction.');
  }, [activeCase, pieces]);

  const checkCase = useCallback(() => {
    if (score >= WIN_SCORE) {
      setWon(true);
      setCompleted((value) => ({ ...value, [caseKey]: true }));
      setResultCard(createResultCard(activeCase, pieces, score));
      setToast('Case closed. Your result card is ready.');
    } else
      setToast(
        `Not quite — the visible match is ${formatScore(score)}. Try the marked clue or undo a step.`,
      );
  }, [activeCase, caseKey, pieces, score]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches('input, textarea, select, button') || mode !== 'case')
        return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        undo();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        nudge(-2, 0);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nudge(2, 0);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        nudge(0, -2);
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        nudge(0, 2);
      }
      if (event.key.toLowerCase() === 'q') {
        event.preventDefault();
        changePiece(selectedId, {
          rotation: (selectedPiece?.rotation ?? 0) - 5,
        });
      }
      if (event.key.toLowerCase() === 'e') {
        event.preventDefault();
        changePiece(selectedId, {
          rotation: (selectedPiece?.rotation ?? 0) + 5,
        });
      }
      if (event.key === '[') {
        event.preventDefault();
        changePiece(selectedId, { scale: (selectedPiece?.scale ?? 1) - 0.05 });
      }
      if (event.key === ']') {
        event.preventDefault();
        changePiece(selectedId, { scale: (selectedPiece?.scale ?? 1) + 0.05 });
      }
      if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        resetCase();
      }
      if (event.key.toLowerCase() === 'h') {
        event.preventDefault();
        showHint();
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        const index = pieces.findIndex((piece) => piece.id === selectedId);
        setSelectedId(pieces[(index + 1) % pieces.length]?.id ?? selectedId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    changePiece,
    mode,
    nudge,
    pieces,
    resetCase,
    selectedId,
    selectedPiece,
    showHint,
    undo,
  ]);

  const pickPiece = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const bounds = canvas.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    const picked = [...pieces]
      .sort((a, b) => b.layer - a.layer)
      .find(
        (piece) =>
          Math.hypot(x - piece.x, y - piece.y) <=
          Math.max(piece.w ?? 18, piece.h ?? 18, (piece.radius ?? 10) * 2) *
            piece.scale *
            0.7,
      );
    if (picked) {
      setSelectedId(picked.id);
      setHintPieceId(null);
    }
  };

  const exportCurrentChallenge = () => {
    const blob = new Blob([JSON.stringify(activeCase, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeCase.seed || 'scene-detective'}.scene.json`;
    link.click();
    URL.revokeObjectURL(url);
    setToast('Challenge JSON downloaded.');
  };
  const downloadCard = () => {
    const url = resultCard ?? createResultCard(activeCase, pieces, score);
    setResultCard(url);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeCase.seed}-result.png`;
    link.click();
    setToast('PNG result card downloaded.');
  };
  const copyChallenge = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(activeCase, null, 2));
      setToast('Challenge JSON copied to the clipboard.');
    } catch {
      setToast('Clipboard access is unavailable. Use Download JSON instead.');
    }
  };
  const playCreatorChallenge = () => {
    const challenge = createChallenge(
      creatorTitle,
      creatorNote,
      creatorSeed,
      creatorBackground,
      creatorPieces,
    );
    setCustomChallenge(challenge);
    setPieces(clonePieces(challenge.pieces));
    setSelectedId(challenge.pieces[0]?.id ?? '');
    setHistory([]);
    setWon(false);
    setResultCard(null);
    setMode('case');
    setToast('Your authored challenge is ready to play.');
  };
  const exportCreatorChallenge = () => {
    const challenge = createChallenge(
      creatorTitle,
      creatorNote,
      creatorSeed,
      creatorBackground,
      creatorPieces,
    );
    const checked = validateChallenge(challenge);
    if (!checked.valid) {
      setToast(checked.errors[0] ?? 'The challenge needs one more detail.');
      return;
    }
    const blob = new Blob([JSON.stringify(checked.challenge, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${checked.challenge.seed}.scene.json`;
    link.click();
    URL.revokeObjectURL(url);
    setCustomChallenge(checked.challenge);
    setToast('Portable challenge JSON downloaded and validated.');
  };
  const loadChallengeObject = (raw: unknown) => {
    const checked = validateChallenge(raw);
    if (!checked.valid) {
      setToast(checked.errors[0] ?? 'That file could not be loaded.');
      return;
    }
    setCustomChallenge(checked.challenge);
    setPieces(clonePieces(checked.challenge.pieces));
    setSelectedId(checked.challenge.pieces[0]?.id ?? '');
    setHistory([]);
    setWon(false);
    setResultCard(null);
    setMode('case');
    setToast('Challenge loaded. The target stays local to this device.');
  };
  const importFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 100_000) {
      setToast('Challenge files are limited to 100 KB.');
      event.target.value = '';
      return;
    }
    try {
      const checked = validateChallengeText(await file.text());
      if (!checked.valid) {
        setToast(checked.errors[0] ?? 'That file could not be loaded.');
      } else {
        loadChallengeObject(checked.challenge);
      }
    } catch {
      setToast('That file is not valid JSON.');
    }
    event.target.value = '';
  };
  const loadPasted = () => {
    const checked = validateChallengeText(importText);
    if (!checked.valid) {
      setToast(
        checked.errors[0] ?? 'Paste a complete Scene Detective JSON challenge.',
      );
      return;
    }
    loadChallengeObject(checked.challenge);
  };

  useEffect(() => {
    const canvas = creatorCanvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(bounds.width * dpr);
    canvas.height = Math.round(bounds.height * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderScene(ctx, bounds.width, bounds.height, {
      background: creatorBackground,
      pieces: creatorPieces,
    });
    const selected = creatorPieces.find(
      (piece) => piece.id === creatorSelectedId,
    );
    if (selected) drawSelection(ctx, selected, bounds.width, bounds.height);
  }, [creatorBackground, creatorPieces, creatorSelectedId]);
  const updateCreator = (patch: Partial<Piece>) => {
    if (creatorSelectedPiece)
      changePiece(creatorSelectedPiece.id, patch, 'creator');
  };
  const addCreatorPiece = (kind: PrimitiveKind) => {
    if (creatorPieces.length >= 8) {
      setToast('Creator mode is intentionally bounded at eight pieces.');
      return;
    }
    const id = `${kind}-${creatorPieces.filter((piece) => piece.kind === kind).length + 1}`;
    const piece = normalizePiece({
      ...defaultPiece(id, kind, creatorPieces.length + 1),
      x: 35 + ((creatorPieces.length * 11) % 35),
      y: 34 + ((creatorPieces.length * 17) % 35),
      color: ['#f6c767', '#e67568', '#73d9bf', '#f2b8d8'][
        creatorPieces.length % 4
      ],
    });
    setCreatorPieces((value) => [...value, piece]);
    setCreatorSelectedId(id);
  };
  const removeCreatorPiece = () => {
    if (!creatorSelectedPiece || creatorPieces.length <= 1) return;
    const next = creatorPieces.filter(
      (piece) => piece.id !== creatorSelectedPiece.id,
    );
    setCreatorPieces(next);
    setCreatorSelectedId(next[0]?.id ?? '');
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <div className="brand-name">Scene Detective</div>
            <div className="brand-kicker">visual reconstruction bureau</div>
          </div>
        </div>
        <div className="top-actions">
          <Button
            variant={mode === 'case' ? 'default' : 'outline'}
            onClick={() => setMode('case')}
            className="top-button"
          >
            Cases
          </Button>
          <Button
            variant={mode === 'creator' ? 'default' : 'outline'}
            onClick={() => setMode('creator')}
            className="top-button"
          >
            <Sparkles /> Make a challenge
          </Button>
        </div>
      </header>
      <div className="main-layout">
        {mode === 'case' ? (
          <>
            <aside className="case-rail">
              <SectionLabel>Field notes</SectionLabel>
              <div className="rail-intro">
                Six scenes.
                <br />
                One visible truth.
              </div>
              <div className="case-list">
                {AUTHORED_CASES.map((item, index) => (
                  <button
                    key={item.id}
                    className={`case-tab ${!customChallenge && caseIndex === index ? 'active' : ''}`}
                    onClick={() => chooseCase(index)}
                  >
                    <span className="case-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="case-tab-copy">
                      <strong>{item.title}</strong>
                      <small>{item.lesson}</small>
                    </span>
                    {completed[item.seed] ? (
                      <Check className="case-check" />
                    ) : (
                      <span
                        className="case-dot"
                        style={{ background: item.accent }}
                      />
                    )}
                  </button>
                ))}
              </div>
              {customChallenge && (
                <button className="custom-case" onClick={() => setMode('case')}>
                  <span className="case-number">✦</span>
                  <span>
                    <strong>{customChallenge.title}</strong>
                    <small>Your imported case</small>
                  </span>
                  <span className="case-dot" />
                </button>
              )}
              <div className="rail-footer">
                <span className="saved-dot" /> Progress saves on this device
              </div>
            </aside>
            <section className="play-area" aria-labelledby="case-title">
              <div className="case-heading">
                <div>
                  <div className="eyebrow">
                    {customChallenge
                      ? 'Imported challenge'
                      : AUTHORED_CASES[caseIndex].chapter}
                  </div>
                  <h1 id="case-title">{activeCase.title}</h1>
                  <p>{activeCase.note}</p>
                </div>
                <div className="score-badge">
                  <span>Visible match</span>
                  <strong>{formatScore(score)}</strong>
                  <div className="score-track">
                    <i style={{ width: `${score}%` }} />
                  </div>
                </div>
              </div>
              <div className="evidence-grid">
                <div className="frame-card target-card">
                  <div className="frame-label">
                    <span>01</span>
                    <span>The brief</span>
                    <span className="frame-line" />
                  </div>
                  <div className="canvas-wrap">
                    <canvas
                      ref={targetCanvasRef}
                      aria-label="Target composition"
                    />
                  </div>
                  <div className="frame-caption">
                    <span>Keep this visible</span>
                    <span className="target-stamp">TARGET</span>
                  </div>
                </div>
                <div className="frame-card work-card">
                  <div className="frame-label">
                    <span>02</span>
                    <span>Your reconstruction</span>
                    <span className="frame-line" />
                  </div>
                  <div className="canvas-wrap work-canvas-wrap">
                    <canvas
                      ref={workCanvasRef}
                      onClick={pickPiece}
                      tabIndex={0}
                      aria-label="Editable reconstruction"
                    />
                    <div className="canvas-corner-note">
                      click a shape to select
                    </div>
                  </div>
                  <div className="frame-caption">
                    <span>
                      Selected:{' '}
                      {selectedPiece?.id.replaceAll('-', ' ') ?? 'none'}
                    </span>
                    <span className="working-stamp">WORKING</span>
                  </div>
                </div>
              </div>
              <div className="command-strip">
                <span className="command-key">
                  <kbd>←</kbd>
                  <kbd>↑</kbd>
                  <kbd>↓</kbd>
                  <kbd>→</kbd> move
                </span>
                <span className="command-key">
                  <kbd>Q</kbd>
                  <kbd>E</kbd> turn
                </span>
                <span className="command-key">
                  <kbd>[</kbd>
                  <kbd>]</kbd> scale
                </span>
                <span className="command-key">
                  <kbd>Tab</kbd> next piece
                </span>
              </div>
              <div className="below-stage">
                <div className="controls-card">
                  <div className="card-heading">
                    <div>
                      <SectionLabel>Evidence controls</SectionLabel>
                      <h2>Adjust the selected piece</h2>
                    </div>
                    <span className="piece-count">{pieces.length} pieces</span>
                  </div>
                  <PieceControls
                    piece={selectedPiece}
                    onChange={(patch) => changePiece(selectedId, patch)}
                  />
                  <div className="nudge-pad" aria-label="Nudge selected piece">
                    <span className="nudge-label">Nudge</span>
                    <div className="nudge-grid">
                      <span />
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label="Move up"
                        onClick={() => nudge(0, -2)}
                      >
                        <ArrowUp />
                      </Button>
                      <span />
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label="Move left"
                        onClick={() => nudge(-2, 0)}
                      >
                        <ArrowLeft />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label="Move down"
                        onClick={() => nudge(0, 2)}
                      >
                        <ArrowDown />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label="Move right"
                        onClick={() => nudge(2, 0)}
                      >
                        <ArrowRight />
                      </Button>
                    </div>
                  </div>
                  <div className="control-actions">
                    <Button
                      variant="outline"
                      onClick={undo}
                      disabled={!history.length}
                    >
                      <Undo2 /> Undo
                    </Button>
                    <Button variant="outline" onClick={resetCase}>
                      <RotateCcw /> Reset
                    </Button>
                    <Button variant="outline" onClick={showHint}>
                      <Lightbulb /> Hint <kbd>H</kbd>
                    </Button>
                  </div>
                </div>
                <div className="case-tools-card">
                  <div className="card-heading">
                    <div>
                      <SectionLabel>Case tools</SectionLabel>
                      <h2>Close the loop</h2>
                    </div>
                    <Layers3 className="heading-icon" />
                  </div>
                  <p className="tool-copy">
                    A match is judged from the pixels on the page. Hidden
                    parameters don’t matter when the visible scene agrees.
                  </p>
                  {hintText && (
                    <div className="hint-box">
                      <Lightbulb />
                      <span>{hintText}</span>
                      <button
                        aria-label="Dismiss hint"
                        onClick={() => {
                          setHintText(null);
                          setHintPieceId(null);
                        }}
                      >
                        <X />
                      </button>
                    </div>
                  )}
                  <Button className="check-button" onClick={checkCase}>
                    <Check /> Check case <span>{formatScore(score)}</span>
                  </Button>
                  <div className="secondary-tools">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={exportCurrentChallenge}
                    >
                      <Download /> JSON
                    </Button>
                    <Button variant="ghost" size="sm" onClick={copyChallenge}>
                      <Clipboard /> Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Upload /> Import
                    </Button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="application/json,.json"
                      onChange={importFile}
                      hidden
                    />
                  </div>
                </div>
              </div>
              {won && (
                <div className="completion-card">
                  <div className="completion-mark">
                    <Check />
                  </div>
                  <div>
                    <div className="eyebrow">Case closed</div>
                    <h2>You found the visible truth.</h2>
                    <p>
                      {activeCase.title} is reconstructed at{' '}
                      {formatScore(score)}. Save the moment as a result card or
                      keep investigating.
                    </p>
                  </div>
                  <div className="completion-actions">
                    <Button onClick={downloadCard}>
                      <Download /> PNG card
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setWon(false);
                        setResultCard(null);
                        resetCase();
                      }}
                    >
                      Replay
                    </Button>
                    {caseIndex < AUTHORED_CASES.length - 1 &&
                      !customChallenge && (
                        <Button
                          variant="outline"
                          onClick={() => chooseCase(caseIndex + 1)}
                        >
                          Next case <ArrowRight />
                        </Button>
                      )}
                  </div>
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="creator-area" aria-labelledby="creator-title">
            <div className="creator-heading">
              <div>
                <div className="eyebrow">Bounded creator</div>
                <h1 id="creator-title">Make a case worth sending.</h1>
                <p>
                  Arrange up to eight field-tested primitives, then export a
                  self-contained challenge your friend can reopen.
                </p>
              </div>
              <div className="creator-badge">
                <FileJson />
                <span>
                  version 1<br />
                  <strong>portable JSON</strong>
                </span>
              </div>
            </div>
            <div className="creator-grid">
              <div className="creator-canvas-card">
                <div className="frame-label">
                  <span>01</span>
                  <span>Your target composition</span>
                  <span className="frame-line" />
                </div>
                <div className="canvas-wrap creator-canvas-wrap">
                  <canvas
                    ref={creatorCanvasRef}
                    onClick={(event) => {
                      const canvas = event.currentTarget;
                      const bounds = canvas.getBoundingClientRect();
                      const x =
                        ((event.clientX - bounds.left) / bounds.width) * 100;
                      const y =
                        ((event.clientY - bounds.top) / bounds.height) * 100;
                      const picked = [...creatorPieces]
                        .sort((a, b) => b.layer - a.layer)
                        .find(
                          (piece) =>
                            Math.hypot(x - piece.x, y - piece.y) <
                            Math.max(
                              piece.w ?? 18,
                              piece.h ?? 18,
                              (piece.radius ?? 10) * 2,
                            ) *
                              piece.scale *
                              0.7,
                        );
                      if (picked) setCreatorSelectedId(picked.id);
                    }}
                    aria-label="Challenge creator canvas"
                  />
                </div>
                <div className="creator-canvas-foot">
                  <span>Click a shape to edit it</span>
                  <span>{creatorPieces.length} / 8 pieces</span>
                </div>
              </div>
              <div className="creator-controls-card">
                <div className="card-heading">
                  <div>
                    <SectionLabel>Case label</SectionLabel>
                    <h2>Give it a hook</h2>
                  </div>
                  <Sparkles className="heading-icon" />
                </div>
                <label className="text-field">
                  <span>Title</span>
                  <input
                    value={creatorTitle}
                    maxLength={48}
                    onChange={(event) => setCreatorTitle(event.target.value)}
                  />
                </label>
                <label className="text-field">
                  <span>Clue for the player</span>
                  <textarea
                    value={creatorNote}
                    maxLength={160}
                    onChange={(event) => setCreatorNote(event.target.value)}
                    rows={2}
                  />
                </label>
                <label className="text-field">
                  <span>Seed</span>
                  <input
                    value={creatorSeed}
                    maxLength={64}
                    onChange={(event) => setCreatorSeed(event.target.value)}
                  />
                </label>
                <label className="color-row creator-color">
                  <span>Background</span>
                  <input
                    type="color"
                    value={creatorBackground}
                    onChange={(event) =>
                      setCreatorBackground(event.target.value)
                    }
                  />
                </label>
                <div className="card-heading compact-heading">
                  <div>
                    <SectionLabel>Primitive palette</SectionLabel>
                    <h2>Build with evidence</h2>
                  </div>
                </div>
                <div className="primitive-grid">
                  {(
                    [
                      'circle',
                      'rect',
                      'triangle',
                      'diamond',
                      'star',
                      'moon',
                    ] as PrimitiveKind[]
                  ).map((kind) => (
                    <Button
                      key={kind}
                      variant="outline"
                      onClick={() => addCreatorPiece(kind)}
                    >
                      <Plus /> {kind}
                    </Button>
                  ))}
                </div>
                <div className="creator-selected-tools">
                  <div className="selected-piece-head">
                    <span
                      className="piece-chip"
                      style={{ background: creatorSelectedPiece?.color }}
                    />
                    <div>
                      <strong>
                        {creatorSelectedPiece?.id.replaceAll('-', ' ')}
                      </strong>
                      <span>selected target piece</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete selected piece"
                      onClick={removeCreatorPiece}
                      disabled={creatorPieces.length <= 1}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  <PieceControls
                    piece={creatorSelectedPiece}
                    onChange={updateCreator}
                  />
                </div>
                <div className="creator-actions">
                  <Button onClick={playCreatorChallenge}>
                    <Move /> Play this case
                  </Button>
                  <Button variant="outline" onClick={exportCreatorChallenge}>
                    <Download /> Export JSON
                  </Button>
                </div>
              </div>
            </div>
            <div className="import-panel">
              <div>
                <SectionLabel>Reopen a case</SectionLabel>
                <h2>Import validated JSON</h2>
                <p>
                  Files are checked for version, size, ranges and bounded
                  primitives before they enter the bureau.
                </p>
              </div>
              <div className="import-actions">
                <textarea
                  aria-label="Paste challenge JSON"
                  placeholder="Paste a .scene.json challenge here…"
                  value={importText}
                  onChange={(event) => setImportText(event.target.value)}
                />
                <div>
                  <Button variant="outline" onClick={loadPasted}>
                    <Upload /> Load pasted JSON
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => fileRef.current?.click()}
                  >
                    <FileJson /> Choose file
                  </Button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="application/json,.json"
                    onChange={importFile}
                    hidden
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
      {toast && <output className="toast">{toast}</output>}
    </main>
  );
}
