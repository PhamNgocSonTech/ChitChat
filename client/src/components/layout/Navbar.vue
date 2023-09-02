<template>
  <header>
    <nav class="nav">
      <div class="navbar__brand">
        <ion-icon name="chatbox-ellipses" class="navbar__icon navbar__icon--logo"></ion-icon>
        <router-link to="/" class="navbar__textbrand">ChitChat</router-link>
      </div>
      <span class="navbar__toggle">
                <ion-icon
                    name="menu-outline"
                    @click="navToggleState = !navToggleState"
                    class="navbar__icon navbar__toggle--icon"
                ></ion-icon>
            </span>
      <ul class="navbar__nav" v-if="!isAuth">
        <li class="nav__item">
          <router-link to="/" class="nav__link">Home</router-link>
        </li>
        <li class="nav__item">
          <router-link to="/about" class="nav__link">About</router-link>
        </li>
      </ul>
      <ul class="navbar__nav navbar__nav--right" v-if="!isAuth">
        <li class="nav__item">
          <a
              href="https://github.com/PhamNgocSonTech/ChitChat"
              target="_blank"
              class="nav__link"
          >
            <ion-icon name="logo-github" class="navbar__icon"></ion-icon>
          </a>
        </li>
        <li class="nav__item">
          <router-link to="/login" class="nav__link nav__link&#45;&#45;rounded">Login</router-link>
        </li>
        <li class="nav__item">
              <router-link to="/register" class="nav__link nav__link&#45;&#45;rounded">Register</router-link>
        </li>
      </ul>
      <SignedInLinks :logout="logout" :user="user" v-if="isAuth" />
    </nav>
    <nav class="snav" :class="{'snav--shown': navToggleState}">
      <Particle name="particlejs-nav"/>
      <ul class="snav__nav" v-if="!isAuth">
        <li class="snav__item" @click="closeSideNav">
          <router-link to="/" class="nav__link">Home</router-link>
        </li>
        <li class="snav__item" @click="closeSideNav">
          <router-link to="/about" class="nav__link">About</router-link>
        </li>
        <li class="snav__item" @click="closeSideNav">
          <router-link to="/login" class="nav__link">Login</router-link>

        </li>
        <li class="snav__item" @click="closeSideNav">
          <router-link to="/register" class="nav__link">Register</router-link>

        </li>
        <li class="snav__item">
          <a
              href="https://github.com/PhamNgocSonTech/ChitChat"
              target="_blank"
              class="nav__link"
          >
            <ion-icon name="logo-github" class="navbar__icon"></ion-icon>
          </a>
        </li>
      </ul>

      <ul class="snav__nav" v-if="isAuth">
        <li class="snav__item" @click="closeSideNav">
          <router-link
              v-if="typeof user.handle !== 'undefined'"
              :to="{ name: 'UserProfile', params: { handle: user.handle } }"
              class="nav__link nav__link--rounded"
          >{{ user.handle }}</router-link>
        </li>
        <li class="snav__item" @click="closeSideNav">
          <button
              @click.prevent="logout"
              class="nav__link nav__link--btn nav__link--rounded"
          >Logout</button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import {ref, computed} from "vue";
import {useStore} from "vuex";
import router from "@/router/router";
import Particle from "@/components/layout/Particle.vue";
import SignedInLinks from "@/components/layout/SignedInLinks.vue";
export default {
  name: 'Navbar',
  components: {
    Particle,
    SignedInLinks
  },
  setup() {
    const navToggleState = ref(false);
    const store = useStore();
    const user = computed(() => store.getters.getUserData)
    const isAuth = computed(() => store.getters.isAuthorized)
    const closeSideNav = () => {
      navToggleState.value = false
    }
    const logout = () => {
      if(localStorage.getItem('authToken')){
        localStorage.clear();
        store.dispatch('toggleAuthState',false)
        router.push({name: 'Login'})
      }
    }

    // onMounted(() => {
    //   if(localStorage.getItem('authToken')){
    //     store.dispatch('toggleAuthState',true)
    //   }else{
    //     localStorage.clear();
    //     store.dispatch('toggleAuthState',false)
    //   }
    // })

      if(localStorage.getItem('authToken')){
        store.dispatch('toggleAuthState',true)
      }else{
        localStorage.clear();
        store.dispatch('toggleAuthState',false)
      }
    return {
      navToggleState,
      isAuth,
      user,
      closeSideNav,
      logout,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/component/navbar.scss";
</style>