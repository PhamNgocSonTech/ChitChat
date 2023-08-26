<template>
  <div id="app" class="app">
    <Navbar/>
    <Particle name="particle-js"/>
    <transition
      :name="transitionName"
      :enter-active-class="enterActive"
      :leave-active-class="leaveActive"
      mode="out-in"
    >
      <router-view/>
    </transition>
    <Footer v-if="['Home', 'Login', 'Register', 'About'].includes($route.name)"/>
  </div>
</template>

<script>
import {ref, onMounted} from "vue";
import _ from "lodash";
import Navbar from "@/components/layout/Navbar.vue";
import Footer from "@/components/layout/Footer.vue";
import Particle from "@/components/layout/Particle.vue";
import {useRouter} from "vue-router";
const DEFAULT_TRANSITION = 'fade';
const DEFAULT_ENTER_ACTIVE_CLASS = 'animated fadeIn';
const DEFAULT_LEAVE_ACTIVE_CLASS = 'animated fadeOut';
export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
    Particle
  },
  setup () {
    const transitionName = ref(DEFAULT_TRANSITION);
    const enterActive = ref(DEFAULT_ENTER_ACTIVE_CLASS);
    const leaveActive = ref(DEFAULT_LEAVE_ACTIVE_CLASS);

    const resetTransition = () => {
      transitionName.value = DEFAULT_TRANSITION;
      enterActive.value = DEFAULT_ENTER_ACTIVE_CLASS;
      leaveActive.value = DEFAULT_LEAVE_ACTIVE_CLASS;
    };

    onMounted(() => {
      const router = useRouter();
      router.beforeEach((to, from, next) => {
        if (!_.isEmpty(to.meta)) {
          if (to.meta.transitionName) {
            transitionName.value = to.meta.transitionName;
          }

          if (to.meta.enterActive) {
            enterActive.value = to.meta.enterActive;
          }

          if (to.meta.leaveActive) {
            leaveActive.value = to.meta.leaveActive;
          }
        }

        if (!to.meta.requiresAuth) {
          resetTransition();
        }
        next();
      });
    })
    return {
      transitionName,
      enterActive,
      leaveActive
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/base/base.scss';
</style>
