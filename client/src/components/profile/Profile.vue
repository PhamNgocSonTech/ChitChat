<template>
  <div class="page profile">
    <div class="section section--mmt">
      <div class="section__heading mt-10">
        <span class="section__title">{{ user.username }}'s</span>
      </div>
      <div class="section__content">
        <div class="profile__container">
          <span class="lead">{{ user.username }}'s profile</span>
          <div class="profile__item">
            <ion-icon name="contact" class="icon icon-lg"></ion-icon>
          </div>
          <div class="profile__item">
            <span class="profile__item--left">Email</span>
            <span class="profile__item--right">{{ user.email }}</span>
          </div>
          <div class="profile__item">
            <span class="profile__item--left">Username</span>
            <span class="profile__item--right">{{ user.username }}</span>
          </div>
          <div class="profile__item">
            <span class="profile__item--left">Location</span>
            <span class="profile__item--right">{{ user.location || 'Unknown' }}</span>
          </div>
          <div class="profile__actions mt-3">
            <a @click="router.go(-1)" class="btn btn--info">Back</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {ref, computed, onMounted} from "vue";
import axios from "axios";
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import router from "@/router/router";

export default {
  name: 'UserProfile',
  setup() {
    const user = ref({})
    const store = useStore()
    const route = useRoute()
    // const userProps = ref(props.user)
    const getUser = computed(() => store.getters.getUserData);
    const isAuth = computed(() => store.getters.isAuthorized)
    computed(() => store.dispatch('saveUserData'))
    computed(() => store.dispatch('toggleAuthState'))
    onMounted(() => {
      if(localStorage.getItem('authToken')) {
        axios.get(`/api/profile/${route.params.username}`)
            .then(res => {
              user.value = res.data
            })
            .catch(err => err)
      }
    })
    return {
      router,
      user,
      getUser,
      isAuth
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/views/profile";
</style>