<template>
  <transition name="slideLeft" mode="out-in">
    <div v-if="visible" class="sidebar">
      <div class="sidebar__header">
        <slot name="header">
          <h4>Default Header</h4>
        </slot>
      </div>
      <div class="sidebar__body">
        <slot name="body"></slot>
      </div>
      <div class="sidebar__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </transition>
</template>

<script>
import {ref, onMounted} from "vue";

export default {
  name: 'Sidebar',
  setup() {
    const visible = ref(window.innerWidth < 768 ? false : true);

    const toggle = () => {
      visible.value = !visible.value
    };

    // const shouldShowSidebar = computed(() => window.innerWidth >= 768 || visible.value);

    const handleResize = () => {
      visible.value = window.innerWidth < 768 ? false : true
    };

    onMounted(() => {
      window.addEventListener('resize', handleResize);
    })

    // watch(shouldShowSidebar, (newValue) => {
    //   if(!newValue) {
    //     visible.value = false;
    //   }
    // });
    return {
      visible,
      toggle
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100vh;
  position: fixed;
  left: 0;
  background: rgba($color: #101113, $alpha: 0.9);
  width: 300px;
  overflow: auto;
  display: flex;
  flex-flow: column;
  transition: all 0.5s ease;
  z-index: 10;

  &__header {
    display: flex;
    align-items: center;
    padding: 1rem 0;
    margin: 0 1rem;
    border-bottom: 1px solid #fff;
  }

  &__body {
    height: auto;
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 20px;
  }

  &__footer {
    height: auto;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 85px;
    z-index: 3;
  }
}
</style>