<template>
  <div class="page login">
    <section class="section section__landing">
      <div class="section__heading">
        <span class="section__title">Register Here</span>
      </div>
      <div class="section__content">
        <p class="section__lead">We hope you will enjoy our application!</p>
        <div class="social">
<!--          <OAuth-->
<!--              provider="facebook"-->
<!--              icon="logo-facebook"-->
<!--              classes="social__item&#45;&#45;facebook"-->
<!--          />-->
<!--          <OAuth provider="google" icon="logo-googleplus" classes="social__item&#45;&#45;google"/>-->
        </div>
        <form @submit.prevent="handleSubmit" class="form">
                    <span class="form__lead">
                        <ion-icon name="person-add" class="icon"></ion-icon>We always welcome new friends!
                    </span>
          <br>
          <div class="form__input-group">
            <ion-icon name="person" class="form__icon"></ion-icon>
            <input
                type="text"
                name="username"
                class="form__control"
                placeholder="Enter Username"
                required
                v-model.trim="username"
            >
            <label for="username" class="form__label">Username</label>
          </div>
          <div class="form__input-group">
            <ion-icon name="mail" class="form__icon"></ion-icon>
            <input
                type="email"
                name="email"
                class="form__control"
                placeholder="Enter Email"
                required
                v-model.trim="email"
            >
            <label for="email" class="form__label">Email</label>
          </div>
          <div class="form__input-group">
            <ion-icon name="lock-closed" class="form__icon"></ion-icon>
            <input
                type="password"
                name="password"
                class="form__control"
                placeholder="Enter Password"
                pattern=".{5,15}"
                title="Password must be between 5 and 15 characters"
                required
                v-model.trim="password"
            >
            <label for="password" class="form__label">Password</label>
          </div>
          <div class="form__info-group">
            <span>Already have an account?</span>
            <router-link to="/login" class="form__link btn btn--rounded">Login</router-link>
          </div>
          <Error :errors="errors"/>
          <button type="submit" class="form__submit">Register</button>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import axios from "axios";
import slugify from 'slugify';
import setAuthToken from "@/utils/authToken";
import router from "@/router/router";
import Error from "@/components/error/Error.vue";

export default {
    name: 'Register',
    components: {
      Error
    },
    setup() {
      const store = useStore()
      const username = ref('');
      const email = ref('');
      const password = ref();
      const errors = ref([]);
      const getSocket = computed(() => store.getters.getSocket)
      const handleSubmit = () => {
        errors.value = [];
        if(username.value && password.value && email.value) {
          axios.post('/api/auth/register', {
            handle: slugify(username.value.toLowerCase()),
            username: username.value,
            email: email.value,
            password: password.value
          }).then(res => {
            if(res.data.errors) {
              for(const error of res.data.errors) {
                const [key] = Object.keys(error);
                const [value] = Object.values(errors);
                errors.value.push({
                  key,
                  value
                })
              }
            }else{
              localStorage.setItem('authToken', res.data.token);
              store.dispatch('toggleAuthState', true);
              store.dispatch('saveUserData', res.data.user)
              setAuthToken(res.data.token);
              router.push({
                name: 'UserProfile',
                params: {handle: res.data.user.handle}
              })
            }
          })
        }
        setTimeout(() => {
            errors.value = [];
        }, 1500)
      }

      return {
        username,
        email,
        password,
        errors,
        getSocket,
        handleSubmit
      }
    },

  }
</script>
<style lang="scss">
@import '@/assets/scss/component/form.scss';
</style>