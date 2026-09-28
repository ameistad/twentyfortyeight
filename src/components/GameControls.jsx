export default function GameControls(props) {
  return (
    <div>
      <button class="button mr-4" onClick={props.onUndo}>
        Undo
      </button>
      <button class="button" onClick={props.onRestart}>
        Restart
      </button>
    </div>
  );
}
