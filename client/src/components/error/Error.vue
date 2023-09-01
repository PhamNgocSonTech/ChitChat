<template>
  <transition
      name="fade"
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
  >
    <div v-if="errorsProps" v-show="errorsProps.length !== 0" class="form__error">
      <transition-group
          name="fade"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
      >
        <span v-for="error in errors" :key="error.key" > {{errorsProps.value}} </span>
      </transition-group>
    </div>
    <div v-else v-show="errorsProps" class="mb-6 form__error">
      <transition
          name="fade"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
      >
        <span> {{errorMessageProps}} </span>
      </transition>
    </div>
  </transition>
</template>

<script>
import {computed} from "vue";

export default {
    name: 'Error',
    props: ['errors', 'message'],
    setup(props) {
      const errorsProps = computed(() => {
         return props.errors
      })
      const errorMessageProps = computed(() => {
        return props.message
      })
      return {
        errorsProps,
        errorMessageProps
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>