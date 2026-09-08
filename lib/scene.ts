export const SCENE_SCHEMA_VERSION = 1 as const;
export const MAX_CHALLENGE_BYTES = 100_000;

export type PrimitiveKind =
  | 'rect'
  | 'circle'
  | 'triangle'
  | 'diamond'
  | 'star'
  | 'moon';

export type Piece = {
  id: string;
  kind: PrimitiveKind;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  alpha?: number;
  layer: number;
  w?: number;
  h?: number;
  radius?: number;
};

export type SceneChallenge = {
  kind: 'scene-detective-challenge';
  version: typeof SCENE_SCHEMA_VERSION;
  seed: string;
  title: string;
  note: string;
  background: string;
  pieces: Piece[];
  targetPieces: Piece[];
};

export type SceneSnapshot = {
  background: string;
  pieces: Piece[];
};

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const KINDS = new Set<PrimitiveKind>([
  'rect',
  'circle',
  'triangle',
  'diamond',
  'star',
  'moon',
]);

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const clonePieces = (pieces: Piece[]) =>
  pieces.map((piece) => ({ ...piece }));

export function normalizePiece(piece: Piece): Piece {
  return {
    ...piece,
    x: clamp(Number(piece.x) || 0, -18, 118),
    y: clamp(Number(piece.y) || 0, -18, 118),
    rotation: (((Number(piece.rotation) || 0) % 360) + 360) % 360,
    scale: clamp(Number(piece.scale) || 1, 0.25, 2.4),
    color: HEX_COLOR.test(piece.color) ? piece.color : '#ffffff',
    alpha: clamp(Number(piece.alpha ?? 1) || 1, 0, 1),
    layer: Math.round(clamp(Number(piece.layer) || 0, -20, 20)),
    w: clamp(Number(piece.w ?? 18) || 18, 4, 60),
    h: clamp(Number(piece.h ?? 18) || 18, 4, 60),
    radius: clamp(Number(piece.radius ?? 10) || 10, 3, 32),
  };
}

export function validateChallenge(
  input: unknown,
):
  | { valid: true; challenge: SceneChallenge }
  | { valid: false; errors: string[] } {
  const errors: string[] = [];
  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['The file is not a JSON object.'] };
  }
  const value = input as Partial<SceneChallenge>;
  if (value.kind !== 'scene-detective-challenge') {
    errors.push('This is not a Scene Detective challenge.');
  }
  if (value.version !== SCENE_SCHEMA_VERSION) {
    errors.push(
      `Unsupported challenge version (expected ${SCENE_SCHEMA_VERSION}).`,
    );
  }
  if (
    typeof value.seed !== 'string' ||
    value.seed.length < 1 ||
    value.seed.length > 64
  ) {
    errors.push('Seed must be a short non-empty string.');
  }
  if (
    typeof value.title !== 'string' ||
    value.title.trim().length < 1 ||
    value.title.length > 48
  ) {
    errors.push('Title must be 1–48 characters.');
  }
  if (typeof value.note !== 'string' || value.note.length > 160) {
    errors.push('Note must be 160 characters or fewer.');
  }
  if (
    typeof value.background !== 'string' ||
    !HEX_COLOR.test(value.background)
  ) {
    errors.push('Background must be a six-digit hex color.');
  }
  const pieces = Array.isArray(value.pieces) ? value.pieces : [];
  const targetPieces = Array.isArray(value.targetPieces)
    ? value.targetPieces
    : [];
  if (pieces.length < 1 || pieces.length > 8) {
    errors.push('A challenge needs between 1 and 8 pieces.');
  }
  if (targetPieces.length !== pieces.length) {
    errors.push(
      'Start and target scenes must contain the same number of pieces.',
    );
  }

  const checkPieces = (list: unknown[], label: string) => {
    const ids = new Set<string>();
    list.forEach((raw, index) => {
      if (!raw || typeof raw !== 'object') {
        errors.push(`${label} piece ${index + 1} is not an object.`);
        return;
      }
      const piece = raw as Partial<Piece>;
      if (typeof piece.id !== 'string' || !/^[a-z0-9-]{1,24}$/.test(piece.id)) {
        errors.push(`${label} piece ${index + 1} has an invalid id.`);
      } else if (ids.has(piece.id)) {
        errors.push(`${label} contains duplicate piece id “${piece.id}”.`);
      } else {
        ids.add(piece.id);
      }
      if (!KINDS.has(piece.kind as PrimitiveKind)) {
        errors.push(
          `${label} piece ${index + 1} uses an unsupported primitive.`,
        );
      }
      for (const [key, min, max] of [
        ['x', -18, 118],
        ['y', -18, 118],
        ['scale', 0.25, 2.4],
        ['layer', -20, 20],
      ] as const) {
        const numeric = Number(piece[key]);
        if (!Number.isFinite(numeric) || numeric < min || numeric > max) {
          errors.push(
            `${label} piece ${index + 1} has an out-of-range ${key}.`,
          );
        }
      }
      if (!Number.isFinite(Number(piece.rotation))) {
        errors.push(`${label} piece ${index + 1} has an invalid rotation.`);
      }
      if (typeof piece.color !== 'string' || !HEX_COLOR.test(piece.color)) {
        errors.push(`${label} piece ${index + 1} has an invalid color.`);
      }
      for (const key of ['w', 'h', 'radius'] as const) {
        if (
          piece[key] !== undefined &&
          (!Number.isFinite(Number(piece[key])) ||
            Number(piece[key]) < 3 ||
            Number(piece[key]) > 60)
        ) {
          errors.push(`${label} piece ${index + 1} has an invalid ${key}.`);
        }
      }
    });
  };
  checkPieces(pieces, 'Start');
  checkPieces(targetPieces, 'Target');
  if (pieces.length === targetPieces.length && pieces.length > 0) {
    const startIds = new Set((pieces as Piece[]).map((piece) => piece.id));
    const targetIds = new Set(
      (targetPieces as Piece[]).map((piece) => piece.id),
    );
    if (
      startIds.size !== targetIds.size ||
      [...startIds].some((id) => !targetIds.has(id))
    ) {
      errors.push('Start and target scenes must use the same piece ids.');
    }
  }

  if (errors.length > 0) return { valid: false, errors: errors.slice(0, 8) };
  const challenge = {
    kind: 'scene-detective-challenge' as const,
    version: SCENE_SCHEMA_VERSION,
    seed: value.seed as string,
    title: (value.title as string).trim(),
    note: value.note as string,
    background: value.background as string,
    pieces: clonePieces(pieces as Piece[]).map(normalizePiece),
    targetPieces: clonePieces(targetPieces as Piece[]).map(normalizePiece),
  };
  return { valid: true, challenge };
}

export function validateChallengeText(text: string) {
  if (new TextEncoder().encode(text).byteLength > MAX_CHALLENGE_BYTES) {
    return {
      valid: false as const,
      errors: ['Challenge files are limited to 100 KB.'],
    };
  }
  try {
    return validateChallenge(JSON.parse(text));
  } catch {
    return { valid: false as const, errors: ['The file is not valid JSON.'] };
  }
}

function polygon(ctx: CanvasRenderingContext2D, points: [number, number][]) {
  ctx.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
}

function drawPiece(
  ctx: CanvasRenderingContext2D,
  piece: Piece,
  width: number,
  height: number,
) {
  const x = (piece.x / 100) * width;
  const y = (piece.y / 100) * height;
  const unit = Math.min(width, height) / 100;
  const w = (piece.w ?? 18) * unit * piece.scale;
  const h = (piece.h ?? 18) * unit * piece.scale;
  const radius = (piece.radius ?? 10) * unit * piece.scale;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((piece.rotation * Math.PI) / 180);
  ctx.globalAlpha = piece.alpha ?? 1;
  ctx.fillStyle = piece.color;
  if (piece.kind === 'rect') ctx.fillRect(-w / 2, -h / 2, w, h);
  if (piece.kind === 'circle') {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  if (piece.kind === 'triangle')
    polygon(ctx, [
      [0, -h / 2],
      [w / 2, h / 2],
      [-w / 2, h / 2],
    ]);
  if (piece.kind === 'diamond')
    polygon(ctx, [
      [0, -h / 2],
      [w / 2, 0],
      [0, h / 2],
      [-w / 2, 0],
    ]);
  if (piece.kind === 'star') {
    const points: [number, number][] = [];
    for (let index = 0; index < 10; index += 1) {
      const angle = -Math.PI / 2 + index * (Math.PI / 5);
      const length =
        index % 2 === 0 ? Math.min(w, h) / 2 : Math.min(w, h) / 4.4;
      points.push([Math.cos(angle) * length, Math.sin(angle) * length]);
    }
    polygon(ctx, points);
  }
  if (piece.kind === 'moon') {
    ctx.beginPath();
    ctx.arc(-unit * 1.2, 0, radius, 0, Math.PI * 2);
    ctx.arc(unit * 3.5, -unit * 2.5, radius * 0.94, 0, Math.PI * 2, true);
    ctx.fill('evenodd');
  }
  ctx.restore();
}

export function drawBackdrop(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, shade(color, -12));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(1, width / 700);
  for (let x = width * 0.08; x < width; x += width * 0.12) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = height * 0.12; y < height; y += height * 0.15) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

export function renderScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  snapshot: SceneSnapshot,
) {
  ctx.clearRect(0, 0, width, height);
  drawBackdrop(ctx, width, height, snapshot.background);
  [...snapshot.pieces]
    .sort((a, b) => a.layer - b.layer)
    .forEach((piece) => drawPiece(ctx, piece, width, height));
}

function shade(hex: string, amount: number) {
  const value = parseInt(hex.slice(1), 16);
  const adjust = (channel: number) =>
    clamp(Math.round(channel + amount), 0, 255);
  const r = adjust((value >> 16) & 255);
  const g = adjust((value >> 8) & 255);
  const b = adjust(value & 255);
  return `rgb(${r}, ${g}, ${b})`;
}

export function renderRaster(snapshot: SceneSnapshot, width = 96, height = 72) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available in this browser.');
  renderScene(ctx, width, height, snapshot);
  return ctx.getImageData(0, 0, width, height);
}

export function visibleScore(target: SceneSnapshot, current: SceneSnapshot) {
  const targetPixels = renderRaster(target);
  const currentPixels = renderRaster(current);
  return scorePixelData(
    targetPixels.data,
    currentPixels.data,
    targetPixels.width,
    targetPixels.height,
  );
}

export function scorePixelData(
  targetPixels: ArrayLike<number>,
  currentPixels: ArrayLike<number>,
  width: number,
  height: number,
) {
  let total = 0;
  for (let index = 0; index < targetPixels.length; index += 4) {
    const error =
      Math.abs(targetPixels[index] - currentPixels[index]) * 0.3 +
      Math.abs(targetPixels[index + 1] - currentPixels[index + 1]) * 0.59 +
      Math.abs(targetPixels[index + 2] - currentPixels[index + 2]) * 0.11;
    total += error;
  }
  const maxError = width * height * 255;
  return clamp(100 - (total / maxError) * 100, 0, 100);
}

export function formatScore(value: number) {
  return `${Math.round(value)}%`;
}

export const defaultPiece = (
  id: string,
  kind: PrimitiveKind,
  layer: number,
): Piece => ({
  id,
  kind,
  x: 50,
  y: 50,
  rotation: 0,
  scale: 1,
  color: '#f7c873',
  layer,
  w: kind === 'rect' ? 20 : 18,
  h: kind === 'rect' ? 12 : 18,
  radius: 10,
});
