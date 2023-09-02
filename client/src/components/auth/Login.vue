<template>
  <div class="page login">
    <section class="section section__landing">
      <div class="section__heading">
        <span class="section__title">Login In</span>
      </div>
      <div class="section__content">
        <Error :errorMessage="errorMessage" />
        <p class="section__lead">Welcome Back!</p>
<!--        <div class="social">-->
<!--          <OAuth-->
<!--              provider="facebook"-->
<!--              icon="logo-facebook"-->
<!--              classes="social__item&#45;&#45;facebook"-->
<!--          />-->
<!--          <OAuth provider="google" icon="logo-googleplus" classes="social__item&#45;&#45;google" />-->
<!--        </div>-->
        <form @submit.prevent="handleSubmit" class="form">
                    <span class="form__lead">
                        <ion-icon name="chatbubbles" class="icon"></ion-icon>We are excited to see you again!
                    </span>
          <br />
          <div class="form__input-group">
            <ion-icon name="mail" class="form__icon"></ion-icon>
            <input
                type="email"
                name="email"
                class="form__control"
                placeholder="Enter Email"
                required
                v-model.trim="email"
            />
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
            />
            <label for="password" class="form__label">Password</label>
          </div>
          <div class="form__info-group">
            <span>Don't have an account?</span>
            <router-link to="/register" class="form__link btn btn--rounded">Register</router-link>
          </div>
          <Error :errors="errors" />
          <button type="submit" class="form__submit">Login</button>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import {onMounted, ref,} from "vue";
import {useStore} from "vuex";
import axios from "axios";
import Error from "@/components/error/Error.vue";
import setAuthToken from "@/utils/authToken";
import router from "@/router/router";
// import OAuth from "@/components/social/OAuth.vue";
  export default {
    name: 'Login',
    components: {
      Error,
      // OAuth
    },
    props: {
      message: String
    },
    setup(props) {
      const store = useStore();
      const email = ref('');
      const password = ref('');
      const errorMessage = ref(props.message);
      const errors = ref([])
      // const saveUserData = computed(() => store.dispatch('saveUserData'))
      // const headers = {
      //   'Content-Type': 'application/json', // Xác định định dạng của dữ liệu bạn gửi
      //   'Accept': 'application/json, text/plain, */*' // Cho biết định dạng bạn mong muốn nhận từ máy chủ
      // };
      const handleSubmit = () => {
        errors.value = [];
        if(email.value && password.value) {
          axios.post('/api/auth/login', {
            email: email.value,
            password: password.value
          }).then(res => {
            if(res.data.errors) {
              for(const error of res.data.errors){
                const [key] = Object.keys(error);
                const [value] = Object.values(error)
                errors.value.push({
                    key,
                    value
                })
              }
            }else{
              localStorage.setItem('authToken', res.data.token);
              store.dispatch('toggleAuthState', true);
              store.dispatch('saveUserData', res.data.user);
              setAuthToken(res.data.token);
              router.push({
                name: 'UserProfile',
                params: {handle: res.data.user.handle}
              })
            }
          })
        }
        setTimeout(() => {
          errors.value = []
        }, 1500)
      };
      onMounted(() => {
        if(errorMessage.value) {
          setTimeout(() => {
            errorMessage.value = ''
          }, 1500)
        }
      })
      return {
        email,
        password,
        errorMessage,
        errors,
        handleSubmit

      }
    }
  }
</script>

<style lang="scss">
@import '@/assets/scss/component/form.scss';
</style>