import test from 'node:test';
import assert from 'node:assert/strict';
import { addRandomTile, moveTiles, tilesFromGrid, tilesToGrid } from './game.js';
import { exportHistory, importHistory, MAX_UNDO } from './history.js';

const board = () => [
  [2, 2, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];
const encode = overrides =>
  JSON.stringify({ format: 'twentyfortyeight', version: 1, grids: [board()], score: 0, ...overrides });

test('export is a snapshot and restores boards, move count, undo, and continued play', () => {
  const first = board();
  const moved = moveTiles(tilesFromGrid(first), 'left');
  const next = tilesToGrid(addRandomTile(moved.tiles));
  const original = { grids: [first, next], score: 1 };
  const text = exportHistory(original);
  const saved = structuredClone(original);
  original.grids[1][0][0] = 128;
  original.score++;

  const restored = importHistory(text);
  assert.deepEqual(restored, saved);
  assert.deepEqual(tilesToGrid(tilesFromGrid(restored.grids.at(-1))), saved.grids[1]);
  restored.grids.pop();
  restored.score--;
  assert.deepEqual(restored, { grids: [board()], score: 0 });
  const continued = moveTiles(tilesFromGrid(restored.grids.at(-1)), 'left');
  assert.equal(continued.moved, true);
  assert.equal(tilesToGrid(continued.tiles)[0][0], 4);
});

test('retains a move count larger than the capped history', () => {
  const history = { grids: Array.from({ length: MAX_UNDO }, board), score: 2500 };
  assert.deepEqual(importHistory(exportHistory(history)), history);
});

test('rejects malformed files, unrelated JSON, and unsupported versions', () => {
  for (const text of ['{', 'null', '[]', '{}', encode({ format: 'other' }), encode({ version: 2 })]) {
    assert.throws(() => importHistory(text));
  }
});

test('validates every board and move count before accepting history', () => {
  const invalidBoards = [
    [],
    [[2]],
    board().slice(1),
    board().map(row => row.slice(1)),
    board().map(row => row.map(() => 0))
  ];
  for (const value of [-2, 1, 3, 2.5, '2', null, 2 ** 53, 2 ** 52 - 1]) {
    const grid = board();
    grid[0][0] = value;
    invalidBoards.push(grid);
  }
  for (const grid of invalidBoards) {
    assert.throws(() => importHistory(encode({ grids: [grid, board()], score: 1 })));
  }
  for (const grids of [null, [], {}, Array.from({ length: MAX_UNDO + 1 }, board)]) {
    assert.throws(() => importHistory(encode({ grids, score: MAX_UNDO })));
  }
  for (const score of [-1, 0.5, '1', null, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => importHistory(encode({ score })));
  }
  assert.throws(() => importHistory(encode({ grids: [board(), board()], score: 0 })));
});
