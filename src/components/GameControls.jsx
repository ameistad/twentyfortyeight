export default function GameControls(props) {
  let fileInput;

  return (
    <div class="controls-grid">
      <button class="button" onClick={props.onUndo}>
        Undo
      </button>
      <button class="button" onClick={props.onRestart}>
        Restart
      </button>
      <button class="button button-secondary" onClick={props.onExport}>
        Export history
      </button>
      <button
        class="button button-secondary"
        onClick={() => fileInput.click()}
        disabled={props.importing}
        title="Load an exported file to replace the current game"
      >
        {props.importing ? 'Importing…' : 'Import history'}
      </button>
      <input
        ref={fileInput}
        type="file"
        accept=".json,application/json"
        aria-label="Import game history"
        hidden
        onChange={event => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = '';
          props.onImport(file);
        }}
      />
    </div>
  );
}
