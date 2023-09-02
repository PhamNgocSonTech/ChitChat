<template>
  <div class="page home">
    <section class="section section__landing">
      <div class="section__heading">
        <span class="section__title"></span>
      </div>
      <div class="section__content">
        <p
            class="section__lead"
        >CHIT CHAT is realtime chat application created using Vue JS, Socket IO and Node JS. Create A Room, Join a Room, Chat with people from all over! Connect with new friends and have fun!</p>
        <router-link to="/" class="btn btn--anim btn--white">Learn More</router-link>
        <router-link to="/register" class="btn btn--anim btn--info">Register Now</router-link>
        <div class="section__graphic">
          <img src="@/assets/img/Home.svg" alt />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Typed from "typed.js";
import {onMounted} from "vue";
export default {
  name: 'Home',
  setup() {
    onMounted(() => {
      let options = {
        strings: [
          'Chit Chat Experience Realtime Chatting',
          'Connect with Everyone',
          'Chat with Friends'
        ],
        typeSpeed: 100,
        loop: true
      };

      new Typed('.section__title', options);
    })
  }
}
</script>


