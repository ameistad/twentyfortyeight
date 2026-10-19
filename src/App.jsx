import { batch, createSignal, createEffect } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { addRandomTile, moveTiles, tilesFromGrid, tilesToGrid } from './game';
import { useControls } from './useControls';
import Grid from './components/Grid';
import GameControls from './components/GameControls';
import { exportHistory, importHistory, MAX_IMPORT_BYTES, MAX_UNDO, validateHistory } from './history';

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

const newGameTiles = () => addRandomTile(addRandomTile([]));

export default function App() {
  let saved;
  try {
    saved = validateHistory({ grids: load('savedGrids'), score: load('savedScore') });
  } catch {
    // Missing or damaged browser saves start a fresh game.
  }
  const initialTiles = saved ? tilesFromGrid(saved.grids[saved.grids.length - 1]) : newGameTiles();
  const [grids, setGrids] = createSignal(saved?.grids || [tilesToGrid(initialTiles)]);
  const [score, setScore] = createSignal(saved?.score || 0);
  const [fileStatus, setFileStatus] = createSignal('');
  const [fileError, setFileError] = createSignal(false);
  const [importing, setImporting] = createSignal(false);
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
    setFileStatus('');
  }

  function saveHistory() {
    try {
      const blob = new Blob([exportHistory({ grids: grids(), score: score() })], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `twentyfortyeight-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setFileError(false);
      setFileStatus('Game history exported.');
    } catch {
      setFileError(true);
      setFileStatus('Could not export game history. Please try again.');
    }
  }

  async function loadHistory(file) {
    if (!file) return;
    setImporting(true);
    try {
      if (file.size > MAX_IMPORT_BYTES) throw new Error('Choose a game history file smaller than 2 MB.');
      const history = importHistory(await file.text());
      batch(() => {
        setTiles(tilesFromGrid(history.grids[history.grids.length - 1]));
        setGrids(history.grids);
        setScore(history.score);
        setFileError(false);
        setFileStatus('Game history imported. Ready to play.');
      });
    } catch (error) {
      setFileError(true);
      setFileStatus(`${error.message || 'Could not read this file.'} Your current game is unchanged.`);
    } finally {
      setImporting(false);
    }
  }

  useControls({ onMove: move, onUndo: undo });

  return (
    <div>
      <Grid tiles={tiles} />
      <div class="score">{score()}</div>
      <div class="game-controls">
        <GameControls
          onUndo={undo}
          onRestart={restart}
          onExport={saveHistory}
          onImport={loadHistory}
          importing={importing()}
        />
      </div>
      <p class="file-status" classList={{ 'file-error': fileError() }} role="status" aria-live="polite">
        {fileStatus()}
      </p>
      <div class="info-block">
        Made by <a href="https://github.com/ameistad">ameistad</a>. Source available on{' '}
        <a href="https://github.com/ameistad/twentyfortyeight">GitHub</a>.
      </div>
    </div>
  );
}
