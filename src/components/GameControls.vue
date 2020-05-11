<template>
  <div>
    <button class="button mr-4" @click="$emit('undo')">
      Undo
    </button>
    <button class="button" @click="$emit('restart')">
      Restart
    </button>
  </div>
</template>

<style scoped>
.mr-4 {
  margin-right: 4rem;
}
.button {
  padding: 0.5rem 1rem 0.5rem 1rem;
  border-radius: 0.25rem;
  background: #ed8936;
  border: 1px solid #ed8936;
  font-weight: 700;
}
</style>
