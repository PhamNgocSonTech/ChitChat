<template>
  <div class="page profile">
    <div class="section section--profile profile__content">
      <div class="section__heading mt-10">
        <span class="section__title">Update Account</span>
      </div>
      <div class="section__content">
        <form @submit.prevent="handleSubmit" class="form">
          <p class="lead">Edit Profile Details</p>
          <div class="profile__item" v-if="user.social.id">
            <img :src="user.image" alt class="profile__image" />
          </div>
          <div class="profile__item" v-else>
            <img :src="user.social.image" alt class="profile__image" />
          </div>
          <br />
          <div class="form__input-group">
            <ion-icon name="person" class="form__icon"></ion-icon>
            <input
                type="text"
                name="handle"
                class="form__control"
                placeholder="Enter New Handle"
                v-model.trim="handle"
            />
            <label for="username" class="form__label">Display Handle</label>
          </div>
          <div class="form__input-group" v-if="getUser.social.id === null">
            <ion-icon name="mail" class="form__icon"></ion-icon>
            <input
                type="email"
                name="email"
                class="form__control"
                placeholder="Enter New Email"
                v-model.trim="email"
            />
            <label for="email" class="form__label">Email</label>
          </div>
          <div class="form__input-group">
            <ion-icon name="location" class="form__icon"></ion-icon>
            <input
                type="location"
                name="location"
                class="form__control"
                placeholder="Enter New Location"
                v-model.trim="location"

            />
            <label for="location" class="form__label">Location</label>
          </div>
          <Error :errors="errors" />
          <div class="form__actions mt-3">
            <a @click="handleBackButton" class="btn btn--info">Back</a>
            <button type="submit" class="btn btn--clear btn--danger">Update Account</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import axios from "axios";
import _ from 'lodash'
import Error from "@/components/error/Error.vue";
import slugify from "slugify";
import router from "@/router/router";

export default {
    name: 'EditUserProfile',
    components: {
      Error,
    },
    setup() {
      const store = useStore();
      const user = ref({});
      const email = ref('');
      const handle = ref('');
      const location = ref('');
      const errors = ref([]);
      const getUser = computed(() => store.getters.getUserData);
      const isAuthorized = computed(() => store.getters.isAuthorized);

      const handleBackButton = () => {
        router.go(-1)
      };

      const checkFields = () => {
        if(handle.value === getUser.value.handle){
          return true;
        }
      };

      const handleSubmit = () => {
        const updateUserDetails = {
          handle:
            handle.value === getUser.value.handle ? null : slugify(handle.value.toLowerCase()),
          email: email.value === getUser.value.email ? null : email.value,
          location: location.value === getUser.value.location ? null : location.value,
        };
        if(localStorage.getItem('authToken')) {
          axios.put('/api/user/updateUser', updateUserDetails)
              .then(async (res) => {
                  if(res.data.errors) {
                    for(const error in errors) {
                      const [key] = Object.keys(error)
                      const [value] = Object.values(error)
                      errors.value.push({
                        key,
                        value
                      })
                    }
                  }else{
                    await store.dispatch('saveUserData', res.data.user);
                    user.value = res.data.user;
                    router.push({
                      name: 'UserProfile',
                      params: {
                        handle:
                        updateUserDetails.handle === null
                          ? getUser.value.handle
                          : updateUserDetails.handle
                      }
                    })
                  }
              })
              .catch((err) => {
                console.log(err)
              })
          setTimeout(() => {
            errors.value = []
          }, 1500)
        }
      }

      // onMounted(() => {
        if(localStorage.getItem('authToken') && _.isEmpty(getUser.value)) {
            axios.get('/api/user/getCurrentUser')
                .then((res) => {
                    store.dispatch('saveUserData', res.data);
                    store.dispatch('toggleAuthState', true);
                    user.value = res.data;
                })
                .catch(err => err)
        }else{
          user.value = getUser.value
        }
        /** Assign model values */
        const userKey = Object.keys(getUser.value)
        for(let key of userKey ) {
          if(userKey.includes[key]) {
            this[key] = getUser.value[key];
          }
        }
      // })
      return {
        // store,
        user,
        getUser,
        isAuthorized,
        email,
        handle,
        location,
        errors,
        handleBackButton,
        handleSubmit,
        checkFields,
      }
    }
  }
</script>

<style>
@import "@/assets/scss/views/profile.scss";
@import "@/assets/scss/component/form.scss";
</style>