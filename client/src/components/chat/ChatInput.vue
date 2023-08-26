<template>
  <div class="chat__input">
        <textarea
            class="chat__input-control"
            placeholder="Type a Message"
            v-model.trim="content"
            v-on:keyup="triggerMessageSend($event)"
            data-gramm_editor="false"
        ></textarea>
    <button class="btn btn--clear btn--info m-0 u-border-rad-0" @click.prevent="sendMessage">Send</button>
  </div>
</template>

<script>
import {ref, computed} from "vue";
import {useStore} from "vuex";

export default {
  name: 'ChatInput',
  setup() {
    const store = useStore()

    const content = ref('')
    const getUser = computed(() =>  store.getters.getUserData)
    const getRoom = computed(() => store.getters.getCurrentRoom)
    const getSocket = computed(() => store.getters.getSocketData)


    const sendUserTyping = () => {
      getSocket.value.emit('userTyping', {
        room: getRoom.value,
        user: getUser.value
      })
    }

    const sendUserNotTyping = () => {
      getSocket.value.emit('removeUserTyping', {
        room: getRoom.value,
        user: getUser.value
      })
    }

    const sendMessage = () => {
      getSocket.value.emit('newMessage', {
        room: getRoom.value,
        user: getUser.value,
        content: content.value
      });
      content.value = ''
      sendUserNotTyping();
    }

    const triggerMessageSend = (event) => {
      event.preventDefault();
      if(event.keyCode === 13 && !event.shiftKey){
        sendMessage();
      }else{
        if(content.value !== '') {
          sendUserTyping();
        }else{
          sendUserNotTyping();
        }
      }
    }
    return {
      content,
      triggerMessageSend,
      sendMessage,
      getUser,
      getRoom,
      getSocket
    }
  }
}

</script>

<style lang="scss" scoped>

</style>