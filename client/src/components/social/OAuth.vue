<template>
  <button class="social__btn btn btn--clear p-0" >
    <div class="social__item">
      <ion-icon :name="icon" class="icon"></ion-icon>
<!--      Connect With {{ provider }}-->
      Connect With provider
    </div>
  </button>
</template>

<script>
  export default {
    name: 'OAuth'
  }
</script>

<style lang="scss" scoped>
@import '@/assets/scss/component/social.scss';
</style>