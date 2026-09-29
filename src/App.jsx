import { createSignal, createEffect } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { addRandomTile, moveTiles, tilesFromGrid, tilesToGrid } from './game';
import { useControls } from './useControls';
import Grid from './components/Grid';
import GameControls from './components/GameControls';

const MAX_UNDO = 1000;

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

const newGameTiles = () => addRandomTile(addRandomTile([]));

export default function App() {
  const savedGrids = load('savedGrids');
  const initialTiles = savedGrids ? tilesFromGrid(savedGrids[savedGrids.length - 1]) : newGameTiles();
  const [grids, setGrids] = createSignal(savedGrids || [tilesToGrid(initialTiles)]);
  const [score, setScore] = createSignal(load('savedScore') || 0);
  // Tile objects keep their id across moves so the DOM node is reused and can slide.
  const [tiles, setTiles] = createStore(initialTiles);

  createEffect(() => localStorage.setItem('savedGrids', JSON.stringify(grids())));
  createEffect(() => localStorage.setItem('savedScore', JSON.stringify(score())));

  function move(direction) {
    const result = moveTiles(tiles, direction);
    if (!result.moved) return;
    const next = addRandomTile(result.tiles, [2, 2, 2, 2, 4]);
    setTiles(reconcile(next, { key: 'id' }));
    setGrids(prev => [...prev, tilesToGrid(next)].slice(-MAX_UNDO));
    setScore(s => s + 1);
  }

  function undo() {
    if (grids().length > 1) {
      const prev = grids().slice(0, -1);
      setGrids(prev);
      setTiles(tilesFromGrid(prev[prev.length - 1]));
      setScore(s => s - 1);
    }
  }

  function restart() {
    const next = newGameTiles();
    setTiles(next);
    setGrids([tilesToGrid(next)]);
    setScore(0);
  }

  useControls({ onMove: move, onUndo: undo });

  return (
    <div>
      <Grid tiles={tiles} />
      <div class="score">{score()}</div>
      <div class="game-controls">
        <GameControls onUndo={undo} onRestart={restart} />
      </div>
      <div class="info-block">
        Made by <a href="https://github.com/ameistad">ameistad</a>. Source available on{' '}
        <a href="https://github.com/ameistad/twentyfortyeight">GitHub</a>.
      </div>
    </div>
  );
}
