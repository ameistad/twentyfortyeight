import { For } from 'solid-js';
import { SIZE } from '../game';

const valueColors = {
  2: '#fffaf0',
  4: '#feebc8',
  8: '#fbd38d',
  16: '#f6ad55',
  32: '#ed8936',
  64: '#dd6b20',
  128: '#c05621',
  256: '#9c4221',
  512: '#7b341e',
  1024: '#67200a',
  2048: '#530c00',
  4096: '#3f0000'
};

export default function Grid(props) {
  return (
    <div class="grid-container">
      <div class="grid-cells">
        <For each={Array(SIZE * SIZE)}>{() => <div class="grid-cell" />}</For>
      </div>
      <For each={props.tiles}>
        {tile => (
          <div class="tile" classList={{ 'tile-merged': tile.merged }} style={{ '--x': tile.x, '--y': tile.y }}>
            <div
              class="tile-inner"
              classList={{ 'tile-new': tile.isNew, 'tile-merged': tile.merged }}
              style={{ background: valueColors[tile.value] || '#3f0000', '--digits': String(tile.value).length }}
            >
              {tile.value}
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
