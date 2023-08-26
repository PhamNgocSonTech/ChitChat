<template>
  <transition
      name="fade"
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
  >
    <div v-if="errors" v-show="errors.length !== 0" class="form__error">
      <transition-group
          name="fade"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
      >
        <span v-for="error in errors" :key="error.key" > {{error.value}} </span>
      </transition-group>
    </div>
    <div v-else v-show="errorMessage" class="mb-6 form__error">
      <transition
          name="fade"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
      >
        <span> {{errorMessage}} </span>
      </transition>
    </div>
  </transition>
</template>

<script>
import {ref} from "vue";

export default {
    name: 'Error',
    props: {
      errorsProps: [],
      message: String,
    },
    setup(props) {
      const errors = ref(props.errorsProps)
      const errorMessage = ref(props.message)
      return {
        errors,
        errorMessage
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>