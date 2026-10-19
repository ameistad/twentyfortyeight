# Game history

- Meaning: an ordered sequence of board snapshots and the current move count.
- Source of truth: `App` owns `grids` and `score`. The final grid is the current
  board; tile IDs and animation flags are transient rendering state reconstructed
  from it on load or undo.
- Browser persistence: `savedGrids` and `savedScore` mirror those values in
  localStorage. Loading validates them together; invalid saves start a new game.
- Export: an immutable JSON snapshot of the same values, with
  `format: "twentyfortyeight"` and `version: 1`. Import validates the entire file
  before replacing the game. Exported snapshots do not change with later play.
- `grids`: 1–1,000 boards, oldest first. Each is a 4×4 row-major array of numbers;
  0 means empty and occupied cells contain safe-integer powers of two, at least 2.
  Each board must contain a tile. The newest 1,000 states are retained on moves.
- `score`: a nonnegative safe integer counting successful moves, not merged tile
  points. It is at least `grids.length - 1` and can be larger when old history has
  been dropped. Undo removes the last grid and decrements the count; restart resets
  it to zero with one initial grid.
- Enforced by: `src/history.js` validation and `src/history.test.js` regression tests.
- Decided: 2026-10-19, while adding game history export/import.
