<template>
  <div class="grid-container">
    <div v-for="(row, index) in grid" :key="index" class="grid-row">
      <div
        v-for="(value, index) in row"
        :key="index"
        class="grid-block"
        :style="{ background: valueColors[value] || '#e8e8e8' }"
      >
        <transition name="slide-fade">
          <span :class="{ 'grid-hidden-value': value === 0 }">{{ value }}</span>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    grid: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      valueColors: {
        2: '#fffaf0',
        4: '#feebc8',
        8: '#fbd38d',
        16: '#f6ad55',
        32: '#ed8936',
        64: '#dd6b20',
        128: '#c05621',
        256: '#9c4221',
        512: '#7b341e',
        1025: '#67200a',
        2048: '#530c00',
        4096: '#3f0000'
      }
    };
  }
};
</script>

<style scoped>
.grid-container {
  background-color: #474747;
  border-radius: 0.5rem;
  padding: 0.4rem;
  user-select: none;
}
.grid-row {
  display: flex;
}
.grid-block {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4.5rem;
  width: 4.5rem;
  margin: 0.4rem;
  border-radius: 0.25rem;
  font-size: 2rem;
  font-weight: 900;
}
.grid-hidden-value {
  color: #e8e8e8;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
