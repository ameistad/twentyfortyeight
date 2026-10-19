import { SIZE } from './game.js';

export const MAX_UNDO = 1000;
export const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

export function validateHistory({ grids, score } = {}) {
  const validTile = value =>
    value === 0 ||
    (Number.isSafeInteger(value) && value >= 2 && 2 ** Math.round(Math.log2(value)) === value);
  const validGrid = grid =>
    Array.isArray(grid) &&
    grid.length === SIZE &&
    grid.every(row => Array.isArray(row) && row.length === SIZE && row.every(validTile)) &&
    grid.some(row => row.some(value => value !== 0));

  if (
    !Array.isArray(grids) ||
    grids.length === 0 ||
    grids.length > MAX_UNDO ||
    !grids.every(validGrid) ||
    !Number.isSafeInteger(score) ||
    score < grids.length - 1
  ) {
    throw new Error('This file does not contain a valid game history.');
  }

  return { grids, score };
}

export function exportHistory(history) {
  return JSON.stringify({ format: 'twentyfortyeight', version: 1, ...validateHistory(history) }, null, 2);
}

export function importHistory(text) {
  let saved;
  try {
    saved = JSON.parse(text);
  } catch {
    throw new Error('This file is not valid JSON. Choose an exported game history.');
  }
  if (!saved || saved.format !== 'twentyfortyeight') {
    throw new Error('Choose a game history exported from twentyfortyeight.');
  }
  if (saved.version !== 1) {
    throw new Error('This game history version is not supported.');
  }
  return validateHistory(saved);
}
