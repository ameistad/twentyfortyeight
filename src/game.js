export const SIZE = 4;

let nextId = 1;

// Maps a line index and a position along it (0 = nearest the wall) to a cell.
const cell = {
  left: (line, pos) => ({ x: pos, y: line }),
  right: (line, pos) => ({ x: SIZE - 1 - pos, y: line }),
  up: (line, pos) => ({ x: line, y: pos }),
  down: (line, pos) => ({ x: line, y: SIZE - 1 - pos })
};

export function tilesFromGrid(grid) {
  return grid.flatMap((row, y) => row.flatMap((value, x) => (value ? [{ id: nextId++, value, x, y }] : [])));
}

export function tilesToGrid(tiles) {
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  for (const tile of tiles) {
    if (!tile.removed) grid[tile.y][tile.x] = tile.value;
  }
  return grid;
}

export function addRandomTile(tiles, values = [2]) {
  const grid = tilesToGrid(tiles);
  const emptyCells = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (grid[y][x] === 0) emptyCells.push({ x, y });
    }
  }
  if (emptyCells.length === 0) return tiles;
  const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = values[Math.floor(Math.random() * values.length)];
  return [...tiles, { id: nextId++, value, x, y, isNew: true }];
}

// Merged source tiles are kept (flagged `removed`) so they can slide into the merge cell.
export function moveTiles(tiles, direction) {
  const at = cell[direction];
  const live = tiles.filter(tile => !tile.removed);
  const result = [];
  let moved = false;

  for (let line = 0; line < SIZE; line++) {
    const lineTiles = [];
    for (let pos = 0; pos < SIZE; pos++) {
      const { x, y } = at(line, pos);
      const tile = live.find(t => t.x === x && t.y === y);
      if (tile) lineTiles.push(tile);
    }

    let target = 0;
    for (let i = 0; i < lineTiles.length; i++) {
      const { x, y } = at(line, target++);
      const a = lineTiles[i];
      const b = lineTiles[i + 1];
      if (b && a.value === b.value) {
        result.push(
          { id: a.id, value: a.value, x, y, removed: true },
          { id: b.id, value: b.value, x, y, removed: true },
          { id: nextId++, value: a.value * 2, x, y, merged: true }
        );
        moved = true;
        i++;
      } else {
        if (a.x !== x || a.y !== y) moved = true;
        result.push({ id: a.id, value: a.value, x, y });
      }
    }
  }

  // Stable order keeps <For> from moving DOM nodes, which would cancel their slide transition.
  result.sort((a, b) => a.id - b.id);
  return { tiles: result, moved };
}
