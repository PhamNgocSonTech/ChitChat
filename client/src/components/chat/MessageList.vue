<template>
  <div class="chat__c-messagelist">
    <ul class="chat__messages" ref="messagesRef" v-if="messagesProps">
      <transition-group name="slideDown">
        <li class="chat__message" v-for="message in messagesProps" :key="message._id">
          <!-- Message belongs to the user -->
          <div
              class="chat__message-item u-flex-right"
              v-if="!message.admin && message.user && message.user._id === user._id"
          >
            <div class="chat__message-body">
              <div class="chat__message-content chat__message-content--right">
                <span>{{ message.content }}</span>
              </div>
              <div class="chat__message-details">
                <span>{{ message.user.handle }}</span>
                <span>{{ moment(message.created_at).fromNow() }}</span>
              </div>
            </div>
            <img
                v-if="!message.user.social.id"
                :src="message.user.image"
                class="chat__user-avatar"
                alt
            />
            <img
                v-else
                :src="message.user.social.image"
                class="chat__user-avatar"
                alt
            />
          </div>
          <!-- Message belongs to the admin -->
          <div class="chat__message-item u-flex-center" v-else-if="message.admin">
            <img
                src="@/assets/img/icons8-businessman.svg"
                class="chat__user-avatar"
                alt
            />
            <div class="chat__message-body">
              <div class="chat__message-content">
                <span>{{ message.content }}</span>
              </div>
              <div class="chat__message-details">
                <span>Admin</span>
                <span>{{ moment(message.created_at).fromNow() }}</span>
              </div>
            </div>
          </div>

          <!-- Message has been deleted -->
          <div class="chat__message-item" v-else-if="!message.user">
            <img
                src="@/assets/img/icons8-account-64.png"
                class="chat__user-avatar"
                alt
            />

            <div class="chat__message-body">
              <div class="chat__message-content chat__message-content--left">
                <span>{{ message.content }}</span>
              </div>
              <div class="chat__message-details">
                <span>Unknown User</span>
                <span>{{ moment(message.created_at).fromNow() }}</span>
              </div>
            </div>
          </div>

          <!-- Message belongs to another user -->
          <div class="chat__message-item" v-else>
            <img
                v-if="!message.user.social.id"
                :src="message.user.image"
                class="chat__user-avatar"
                alt
            />
            <img
                v-else
                :src="message.user.social.image"
                class="chat__user-avatar"
                alt
            />
            <div class="chat__message-body">
              <div class="chat__message-content chat__message-content--left">
                <span>{{ message.content }}</span>
              </div>
              <div class="chat__message-details">
                <span>{{ message.user.handle }}</span>
                <span>{{ moment(message.created_at).fromNow() }}</span>
              </div>
            </div>
          </div>
        </li>
      </transition-group>
    </ul>
  </div>
</template>

<!--<template>-->
<!--  <div class="chat__c-messagelist">-->
<!--    <ul class="chat__messages" ref="messagesProps" v-if="messagesProps" >-->
<!--      <transition-group name="slideDown">-->
<!--        <li class="chat__message" v-for="message in messagesProps" :key="message._id">-->
<!--          &lt;!&ndash; Message belongs to the user &ndash;&gt;-->
<!--          <div-->
<!--              class="chat__message-item u-flex-right"-->
<!--              v-if="!message.admin && message.user && message.user._id === user._id"-->
<!--          >-->
<!--            <div class="chat__message-body">-->
<!--              <div class="chat__message-content chat__message-content&#45;&#45;right">-->
<!--                <span> {{ message.content }} </span>-->
<!--              </div>-->
<!--              <div class="chat__message-details">-->
<!--                <span> {{ message.user.handle }} </span>-->
<!--                <span> {{ moment(message.created_at).fromNow() }} </span>-->
<!--              </div>-->
<!--            </div>-->
<!--            <img-->
<!--                v-if="!message.user.social.id"-->
<!--                :src="message.user.image"-->
<!--                class="chat__user-avatar"-->
<!--                alt-->
<!--            >-->
<!--            <img v-else :src="message.user.social.image" class="chat__user-avatar" alt>-->
<!--          </div>-->
<!--          &lt;!&ndash; Message belongs to the admin &ndash;&gt;-->
<!--          <div class="chat__message-item u-flex-center" v-else-if="message.admin">-->
<!--            <img-->
<!--                src="../../assets/img/icons8-businessman.svg"-->
<!--                class="chat__user-avatar"-->
<!--                alt-->
<!--            >-->
<!--            <div class="chat__message-body">-->
<!--              <div class="chat__message-content">-->
<!--                <span> {{ message.content }} </span>-->
<!--              </div>-->
<!--              <div class="chat__message-details">-->
<!--                <span>Admin</span>-->
<!--                <span> {{ moment(message.created_at).fromNow() }} </span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

<!--          &lt;!&ndash; Message has been deleted &ndash;&gt;-->
<!--          <div class="chat__message-item" v-else-if="!message.user">-->
<!--            <img src="@/assets/img/icons8-account-64.png" class="chat__user-avatar" alt>-->

<!--            <div class="chat__message-body">-->
<!--              <div class="chat__message-content chat__message-content&#45;&#45;left">-->
<!--                <span> {{ message.content }} </span>-->
<!--              </div>-->
<!--              <div class="chat__message-details">-->
<!--                <span>Unknown User</span>-->
<!--                <span> {{ moment(message.created_at).fromNow() }} </span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

<!--          &lt;!&ndash; Message belongs to another user &ndash;&gt;-->
<!--          <div class="chat__message-item" v-else>-->
<!--            <img-->
<!--                v-if="!message.user.social.id"-->
<!--                :src="message.user.image"-->
<!--                class="chat__user-avatar"-->
<!--                alt-->
<!--            >-->
<!--            <img v-else :src="message.user.social.image" class="chat__user-avatar" alt>-->
<!--            <div class="chat__message-body">-->
<!--              <div class="chat__message-content chat__message-content&#45;&#45;left">-->
<!--                <span> {{ message.content }} </span>-->
<!--              </div>-->
<!--              <div class="chat__message-details">-->
<!--                <span> {{ message.user.handle }} </span>-->
<!--                <span> {{ moment(message.created_at).fromNow() }} </span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </li>-->
<!--      </transition-group>-->
<!--    </ul>-->
<!--  </div>-->
<!--</template>-->

<script>
import {ref, computed, onMounted, onUpdated, inject} from "vue";
import {useStore} from "vuex";

export default {
  name: 'MessageList',
  props: {
    messages: Array
  },
  setup(props) {
    const store = useStore();
    const moment = inject('moment')
    const messagesRef = ref(null)
    const user = ref(null)
    const getUser = computed(() => store.getters.getUserData)
    const messagesProps = ref(props.messages);
    // const messagesProps = computed(() => {
    //   return props.messages
    // })
    // messagesRef.value = messagesProps.value
      user.value = getUser.value


    const scrollMessages = () => {
      if(messagesRef.value){
        messagesRef.value.scrollTop = messagesRef.value.scrollHeight
      }
    }

    console.log("Messages Ref", messagesRef.value)
    console.log("Messages", messagesProps.value)
    onMounted(() => {
      scrollMessages();
    })

    onUpdated(() => {
      scrollMessages();
    })
    return {
      messagesProps,
      messagesRef,
      user,
      moment,
      getUser
    }
  },
}
</script>


<style lang="scss" scoped>

</style>