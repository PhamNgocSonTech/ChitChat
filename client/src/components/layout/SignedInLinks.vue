<template>
  <ul class="navbar__nav navbar__nav--right">
    <li class="nav__item">
      <router-link to="/rooms" class="nav__link nav__link--rounded">Rooms</router-link>
    </li>
    <li class="nav__item">
      <router-link
          v-if="Object.keys(user).length > 0"
          :to="{name: 'UserProfile', params: { handle: user.handle  }}"
          class="nav__link nav__link--rounded"
      >{{ getUser.handle }}</router-link>
    </li>
    <li class="nav__item">
      <button
          @click.prevent="logoutProps"
          class="nav__link nav__link--btn nav__link--rounded"
      >Logout</button>
    </li>
  </ul>
</template>

<script>
import {computed, ref} from "vue";
import {useStore} from "vuex";
// import {computed, ref} from "vue";
// import {mapGetters} from "vuex";

export default {
    name: 'SingedInLinks',
    props: ['logout', 'user'],
    // props: {
    //   user: Object,
    //   logoutProps: Function
    // },
    setup(props) {
      const store = useStore();
      const userProps = ref(props.user)
      const getUser = computed(() => store.getters.getUserData)
      const isAuth = computed(() => store.getters.isAuthorized)
      const logoutProps = ref(props.logout);
      // const userProps = ref(props.user);
      return {
        userProps,
        logoutProps,
        getUser,
        isAuth

      }
    }
  }
</script>

<style lang="scss" scoped>
@import "@/assets/scss/component/navbar";
</style>