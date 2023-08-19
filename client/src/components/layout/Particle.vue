<template>
  <div v-bind:id="id" class="particle"></div>

</template>


<script>
import {ref, onMounted} from "vue";
import 'particles.js'
import particleConfig from '@/assets/config/particlesjs-config.json'

export default {
  props: {
    name: String
  },
  setup(props){
    const id = ref(props.name)
    const initParticleJS = () => {
      window.particlesJS(id.value, particleConfig);
    };
  onMounted(() => {
    initParticleJS();
  })
    return {
      id
    }
  },

}

</script>
