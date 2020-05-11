<script>
export default {
  render: () => null,
  props: {
    gestureZone: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      touchstartX: 0,
      touchstartY: 0,
      touchendX: 0,
      touchendY: 0
    };
  },
  methods: {
    handleKeydown({ key }) {
      switch (key) {
        case 'ArrowLeft':
          this.$emit('moveLeft');
          break;
        case 'ArrowRight':
          this.$emit('moveRight');
          break;
        case 'ArrowDown':
          this.$emit('moveDown');
          break;
        case 'ArrowUp':
          this.$emit('moveUp');
          break;
        default:
          break;
      }
    },
    handleGesture(event) {
      if (event.type === 'touchstart') {
        this.touchstartX = event.changedTouches[0].screenX;
        this.touchstartY = event.changedTouches[0].screenY;
      }

      if (event.type === 'touchend') {
        this.touchendX = event.changedTouches[0].screenX;
        this.touchendY = event.changedTouches[0].screenY;
        if (this.touchendX < this.touchstartX) {
          this.$emit('moveLeft');
        }

        if (this.touchendX > this.touchstartX) {
          this.$emit('moveRight');
        }

        if (this.touchendY > this.touchstartY) {
          this.$emit('moveDown');
        }

        if (this.touchendY < this.touchstartY) {
          this.$emit('moveUp');
        }
      }
    },
    handleUndoShortKeys() {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        this.$emit('undo');
      }
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleUndoShortKeys);
    document.addEventListener('keyup', this.handleKeydown);
    const gestureZone = document.getElementById(this.gestureZone);
    gestureZone.addEventListener('touchstart', this.handleGesture, false);
    gestureZone.addEventListener('touchend', this.handleGesture, false);
  },
  destroyed() {
    document.removeEventListener('keydown', this.handleUndoShortKeys);
    document.removeEventListener('keyup', this.handleKeydown);
    const gestureZone = document.getElementById(this.gestureZone);
    gestureZone.removeEventListener('touchstart', this.handleGesture);
    gestureZone.removeEventListener('touchend', this.handleGesture);
  }
};
</script>
