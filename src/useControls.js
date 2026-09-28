import { onMount, onCleanup } from 'solid-js';

const arrowKeys = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down'
};

export function useControls({ onMove, onUndo }) {
  let touchStart = null;

  const handleKeyup = event => {
    const direction = arrowKeys[event.key];
    if (direction) onMove(direction);
  };

  const handleKeydown = event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
      event.preventDefault();
      onUndo();
    }
  };

  const handleTouchstart = event => {
    const { screenX, screenY } = event.changedTouches[0];
    touchStart = { x: screenX, y: screenY };
  };

  const handleTouchend = event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].screenX - touchStart.x;
    const dy = event.changedTouches[0].screenY - touchStart.y;
    touchStart = null;
    if (dx === 0 && dy === 0) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      onMove(dx > 0 ? 'right' : 'left');
    } else {
      onMove(dy > 0 ? 'down' : 'up');
    }
  };

  const listeners = {
    keyup: handleKeyup,
    keydown: handleKeydown,
    touchstart: handleTouchstart,
    touchend: handleTouchend
  };

  onMount(() => {
    for (const [type, listener] of Object.entries(listeners)) document.addEventListener(type, listener);
  });
  onCleanup(() => {
    for (const [type, listener] of Object.entries(listeners)) document.removeEventListener(type, listener);
  });
}
