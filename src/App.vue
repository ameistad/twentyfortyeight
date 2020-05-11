<template>
  <div id="app">
    <div>
      <GenerateGrid :grid="grid" />
      <MoveBlocks
        gesture-zone="app"
        @undo="undo"
        @moveLeft="moveLeft"
        @moveRight="moveRight"
        @moveDown="moveDown"
        @moveUp="moveUp"
      />
      <div class="score">
        {{ score }}
      </div>
      <div class="game-controls">
        <GameControls @undo="undo" @restart="restart" />
      </div>
      <div class="info-block">
        Made by <a href="https://twitter.com/ameistad">@ameistad</a>. Source available on
        <a href="https://github.com/ameistad/twentyfortyeight">Github</a>.
      </div>
    </div>
  </div>
</template>

<script>
import '@/utils/arrayEquals';
import GenerateGrid from '@/components/GenerateGrid';
import MoveBlocks from '@/components/MoveBlocks';
import GameControls from '@/components/GameControls';

function cloneGrid(grid) {
  // spread creates a shallow copy and doesn't create a immutable array.
  return grid.map(row => [...row]);
}

function getZeroPositions(grid) {
  const zeroPositions = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 0) zeroPositions.push({ y, x });
    }
  }
  return zeroPositions;
}

function addRandomNumbers(grid, randoms, values = [2]) {
  let newGrid = cloneGrid(grid);
  const zeroPositions = getZeroPositions(newGrid);
  if (zeroPositions.length === 0 || zeroPositions.length < randoms) return newGrid;
  while (randoms) {
    const positionIndex = Math.floor(Math.random() * zeroPositions.length);
    const position = zeroPositions[positionIndex];
    newGrid[position.y][position.x] = values[Math.floor(Math.random() * values.length)];
    zeroPositions.splice(positionIndex, 1);
    randoms--;
  }
  return newGrid;
}

function moveZeroes(arr) {
  const zeroes = [];
  const notZeroes = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 0) {
      zeroes.push(0);
    } else {
      notZeroes.push(arr[i]);
    }
  }
  return [...notZeroes, ...zeroes];
}

function addValues(arr) {
  const r = moveZeroes(arr);
  for (let i = 1; i < arr.length; i++) {
    if (r[i - 1] === r[i]) {
      r[i - 1] = r[i - 1] + r[i];
      r[i] = 0;
    }
  }
  return moveZeroes(r);
}
// function isGameOver(grid) {
//   const isGameOver = true;
//   for (let i = 0; i < grid.length; i++) {
//     const column = grid[i].map(valie =>)
//   }
// }

const initialGrid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

export default {
  name: 'App',
  components: {
    GenerateGrid,
    MoveBlocks,
    GameControls
  },
  data() {
    const savedGrids = JSON.parse(localStorage.getItem('savedGrids'));
    const savedScore = JSON.parse(localStorage.getItem('savedScore'));
    return {
      grids: savedGrids || [addRandomNumbers(initialGrid, 2, [2])],
      score: savedScore || 0
    };
  },
  computed: {
    grid: {
      get() {
        return this.grids[this.grids.length - 1];
      },
      set(grid) {
        if (!this.grids[this.grids.length - 1].equals(grid)) {
          this.grids.push(addRandomNumbers(grid, 1, [2, 2, 2, 2, 4]));
          this.score++;
        }
        if (this.grids.length > 1000) {
          // max stored grids for undo
          this.grids.shift();
        }
      }
    }
  },
  watch: {
    grids() {
      localStorage.setItem('savedGrids', JSON.stringify(this.grids));
    },
    score() {
      localStorage.setItem('savedScore', JSON.stringify(this.score));
    }
  },
  methods: {
    undo() {
      if (this.grids.length > 1) {
        this.grids.splice(this.grids.length - 1, 1);
        this.score--;
      }
    },
    restart() {
      this.grids = [addRandomNumbers(initialGrid, 2, [2])];
      this.score = 0;
    },
    moveDown() {
      const grid = cloneGrid(this.grid);
      for (let j = 0; j < grid.length; j++) {
        let column = grid.map(row => row[j]);
        column = [...column].reverse();
        column = addValues(column);
        column = [...column].reverse();
        for (let i = 0; i < grid.length; i++) {
          grid[i][j] = column[i];
        }
      }
      this.grid = grid;
    },
    moveUp() {
      let grid = this.grid.map(row => [...row]);
      for (let j = 0; j < grid.length; j++) {
        let column = grid.map(row => row[j]);
        column = addValues(column);
        for (let i = 0; i < grid.length; i++) {
          grid[i][j] = column[i];
        }
      }
      this.grid = grid;
    },
    moveLeft() {
      let grid = this.grid.map(row => {
        row = addValues(row);
        return row;
      });
      this.grid = grid;
    },
    moveRight() {
      let grid = this.grid.map(row => {
        row = [...row].reverse();
        row = addValues(row);
        row = [...row].reverse();
        return row;
      });
      this.grid = grid;
    }
  },
  mounted() {
    this.gestureZone = this.$refs.grid;
  }
};
</script>

<style>
html,
body {
  height: 100vh;
  overscroll-behavior-y: contain;
  overflow: hidden;
}
#app {
  display: flex;
  justify-content: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.score {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  font-size: 2.5rem;
  font-weight: 900;
}
.info-block {
  display: flex;
  justify-content: center;
  white-space: pre-wrap;
  margin-top: 3rem;
  font-size: 0.75rem;
}
.game-controls {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}
</style>
