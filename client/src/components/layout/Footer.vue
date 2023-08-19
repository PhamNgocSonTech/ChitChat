<template>
  <footer class="footer section__footer">
    <div class="footer__content">
      <div class="footer__left">
        <span>Copyright &copy; 2023 Pham Ngoc Son</span>
      </div>
      <div class="footer__right">
        <span>Contact Me</span>
        <a
            href="https://github.com/PhamNgocSonTech/ChitChat"
            target="_blank"
            class="nav__link"
        >
          <ion-icon name="logo-github" class="footer__icon"></ion-icon>
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
}

</script>

<style lang="scss">
@import "@/assets/scss/component/footer.scss";
</style>