<template v-slot:footer>
  <transition name="fade">
    <div v-show="visible" class="modal">
      <transition name="slideDown">
        <div v-show="visible" class="modal__content">
          <div class="modal__header">
            <slot name="header">
              <h4>Default Header</h4>
            </slot>
          </div>
          <div class="modal__body">
            <slot name="body">
              <h4>Default Body Content</h4>
            </slot>
          </div>
          <div class="modal__footer">
            <slot name="footer">
              <a @click="close" class="btn btn--modal">Close</a>
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import {computed, ref} from 'vue';

export default {
  name: 'Modal',
  props: {
    name: String
  },
  setup(props) {
    const visible = ref(false);
    const nameProps = ref(props.name)
    const modalData = computed(() => visible.value)
    const close = () => {
      visible.value = false;
    };

    const open = () => {
      visible.value = true;
    };

    const setData = (key, value) => {
      visible.value[key] = value
    }
    return {
      visible,
      close,
      open,
      nameProps,
      modalData,
      setData
    };
  }
};
</script>

<!--<template>-->
<!--  <transition name="fade">-->
<!--    <div class="modal">-->
<!--      <transition name="slideDown">-->
<!--        <div v-show="modalData.visible" class="modal__content">-->
<!--          <div class="modal__header">-->
<!--            <slot name="header">-->
<!--              <h4>Default Header</h4>-->
<!--            </slot>-->
<!--          </div>-->
<!--          <div class="modal__body">-->
<!--            <slot name="body">-->
<!--              <h4>Default Body Content</h4>-->
<!--            </slot>-->
<!--          </div>-->
<!--          <div class="modal__footer">-->
<!--            <slot name="footer">-->
<!--&lt;!&ndash;              <a @click="close" class="btn btn&#45;&#45;modal" slot="footer">Close</a>&ndash;&gt;-->
<!--              <a @click="modalData.close" class="btn btn&#45;&#45;modal">Close</a>-->
<!--            </slot>-->
<!--          </div>-->
<!--        </div>-->
<!--      </transition>-->
<!--    </div>-->
<!--  </transition>-->
<!--</template>-->

<!--<script>-->
<!--import {ref} from "vue";-->
<!--import modal from "@/components/layout/Modal.vue";-->

<!--export default {-->
<!--    name: 'Modal',-->
<!--    setup() {-->
<!--      const visible = ref(false);-->
<!--      const open = () => {-->
<!--        visible.value = true;-->
<!--      };-->
<!--      const close = () => {-->
<!--        visible.value = false;-->
<!--      };-->

<!--      // const setData = (key, value) => {-->
<!--      //   modalData[key] = value;-->
<!--      // };-->

<!--      const modalData = computed(() => ({-->
<!--        visible: visible.value,-->
<!--        close,-->
<!--        open,-->
<!--        // setData-->
<!--      }));-->
<!--      return {-->
<!--        modalData-->
<!--      }-->
<!--    }-->

<!--  }-->
<!--</script>-->

<style lang="scss" scoped>
@import '@/assets/scss/component/modal.scss';

</style>