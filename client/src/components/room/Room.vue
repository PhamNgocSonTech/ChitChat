<template>
  <div class="page page--room">
    <section class="section section--room section--mmt p-0">
      <div class="section__content u-max-height p-0">
        <div class="chat">
          <Sidebar name="userlist" ref="userListRef">
            <template v-slot:header>
              <div class="userlist__actions">
                <div>
                  <ion-icon name="contacts" class="icon"></ion-icon>
                </div>
                <span class="section__title">Online Users</span>
                <div @click="toggleUserList">
                  <ion-icon name="backspace" class="icon"></ion-icon>
                </div>
              </div>
            </template>
            <template v-slot:body>
              <input
                  type="text"
                  class="rooms__search-input"
                  placeholder="Search user by name"
                  v-model.trim="searchInput"
              />
              <ul class="chat__userlist" v-if="getRoom && filteredUsers">
                <transition-group name="slideDown">
                  <li
                      class="chat__user"
                      v-for="user in filteredUsers"
                      :key="user.lookup._id"
                  >
                    <div class="chat__user-item">
                      <div class="chat__user-image">
                        <img
                            v-if="user.lookup.social.id === null"
                            :src="user.lookup.image"
                            class="chat__user-avatar"
                            alt
                        />
                        <img
                            v-else
                            :src="user.lookup.social.image"
                            class="chat__user-avatar"
                            alt
                        />
                      </div>
                      <div class="chat__user-details">
                        <span>{{ user.lookup.handle }}</span>
                      </div>
                    </div>
                  </li>
                </transition-group>
              </ul>
            </template>
            <template v-slot:footer>
              <button
                  @click="leaveRoom"
                  class="btn btn--clear btn--danger center"
              >Leave Room</button>
            </template>
          </Sidebar>
          <div class="chat__content" v-bind:class="{ mlzero: !sidebarVisible }">
            <div class="chat__header" v-if="room" >
              <span class="section__title">#{{room.name}}</span>
              <div class="chat__actions">
                <ion-icon name="return-down-back-outline" @click="leaveRoom($event)" class="icon"></ion-icon>
                <ion-icon name="create-outline" class="icon" @click="openEditRoom"></ion-icon>
                <ion-icon name="analytics-outline" class="icon" @click="viewRoomDetails"></ion-icon>
                <ion-icon name="people-outline" class="icon" @click="toggleUserList"></ion-icon>
              </div>
            </div>
            <MessageList :messages="messages" />
            <transition name="slideDown">
              <div class="chat__utyping" v-show="usersTyping.length > 0">
                <span> {{ getUsersTyping }} </span>
              </div>
            </transition>
            <ChatInput />
          </div>
        </div>
      </div>
      <Modal name="editRoom" ref="editRoomRef" v-if="getRoom">
        <template v-slot:header>
          <h2 class="text-upper">Edit Room: {{ getRoom.name }}</h2>
        </template>
        <template v-slot:body>
          <form @submit="handleEditRoom" class="form form--nbs pt-3">
            <div class="form__input-group">
              <ion-icon name="pricetags" class="form__icon"></ion-icon>
              <input
                  type="text"
                  name="roomName"
                  class="form__control"
                  placeholder="Enter New Room Name"
                  pattern=".{3,20}"
                  required
                  v-model.trim="newRoomName"
              />
              <label for="roomName" class="form__label">New Room name</label>
            </div>
            <Error :errors="errors" />
            <button type="submit" class="btn btn--clear btn--info">Update Room Name</button>
          </form>
        </template>
      </Modal>
      <Modal name="roomDetails" ref="roomDetailsRef" v-if="getRoom && messages">
        <template v-slot:header>
          <h2 class="lead text-upper">Room Details: {{ getRoom.name }}</h2>
        </template>
        <template v-slot:body>
          <div class="infobox">
            <div class="infobox__item">
              <ion-icon name="planet" class="icon icon-lg"></ion-icon>
            </div>
            <div class="infobox__item">
              <span class="infobox__item--left">Online Users</span>
              <span
                  class="infobox__item--right"
              >{{ getRoom.users.length }}</span>
            </div>
            <div class="infobox__item">
              <span class="infobox__item--left">Messages</span>
              <span class="infobox__item--right">{{ messages.length }}</span>
            </div>
            <div class="infobox__item">
              <span class="infobox__item--left">Room Admin</span>
              <span
                  class="infobox__item--right"
              >{{ getRoom.user ? getRoom.user.handle : 'Unknown User' }}</span>
            </div>
            <div class="infobox__item">
              <span class="infobox__item--left">Created</span>
              <span
                  class="infobox__item--right"
              >{{ moment(getRoom.created_at).fromNow() }}</span>
            </div>
          </div>
        </template>
      </Modal>
    </section>
  </div>
</template>
<script>
import {computed, inject, onBeforeUnmount, onMounted, ref} from "vue";
import {useStore} from "vuex";
import router from "@/router/router";
import {useRoute} from "vue-router";

import axios from "axios";
import MessageList from "@/components/chat/MessageList.vue";
import ChatInput from "@/components/chat/ChatInput.vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import Modal from "@/components/layout/Modal.vue";
import Error from "@/components/error/Error.vue";

export default {
      name: 'Room',
      components: {
        MessageList,
        ChatInput,
        Sidebar,
        Modal,
        Error,
      },
      setup() {
        const moment = inject("moment");
        const store = useStore()
        const route = useRoute()
        const editRoomRef = ref(null)
        const roomDetailsRef = ref(null)
        const userListRef = ref(null)

        const room = ref([])
        const users = ref([])
        const usersTyping = ref([])
        const messages = ref([])
        const newRoomName = ref('')
        const sidebarVisible = ref(window.innerWidth < 768 ? false : true)
        const searchInput = ref('')
        const errors = ref([])
        const roomLeft = ref(false)

        const getUser = computed(() => store.getters.getUserData)
        const getRoom = computed(() => store.getters.getCurrentRoom)
        const getSocket = computed(() => store.getters.getSocketData)

        const filteredUsers = computed(() => {
          return users.value.slice().sort(sortAlphabetical).filter(user => user.lookup.username.toLowerCase().includes(searchInput.value.toLowerCase()))
        })

        const getUsersTyping = computed(() => {
          if(usersTyping.value.length > 0) {
            return `${usersTyping.value.join(', ')} is typing...`
          }
          return ''
        })

        const checkUserTabs = (room) => {
          if(room && room.users.value.findIndex((user) => user.lookup._id === getUser.value._id) === -1){
            router.push({
              name: 'RoomList'
            })
          }
        }
        const sortAlphabetical = (a, b) => {
          let userA = a.lookup.username.toUpperCase();
          let userB = b.lookup.username.toUpperCase();
          if (userA < userB) {
            return -1;
          }
          if (userA > userB) {
            return 1;
          }
          return 0;
        }

        const leaveRoom = (event, newPage) => {
          if(event) {
            event.preventDefault()
          }
          axios.post(`/api/room/remove/users`,{
            room_name: getRoom.value.name
          })
              .then(res => {
                if(room.value.access || room.value.accessIds.includes(getUser.value._id)) {
                    getSocket.value.emit('exitRoom', {
                      room: res.data,
                      user: null,
                      admin: true,
                      content: `${getUser.value.handle} left ${getRoom.value.name}`
                    })
                }
                roomLeft.value = true;
                if(!newPage){
                  router.push({
                    name: 'RoomList'
                  })
                }
              })
        }
        const openEditRoom = () => {
          editRoomRef.value.open();
        }
        const handleEditRoom = (event) => {
          event.preventDefault();
          axios.post('/api/room/update/name', {
            room_name: getRoom.value.name,
            new_room_name: newRoomName.value
          }).then(res => {
            if(res.data.errors) {
              for(const error of res.data.errors) {
                const [key] = Object.keys(error);
                const [value] = Object.values(error);
                errors.value.push({
                  key,
                  value
                })
              }
            }else{
            editRoomRef.value.close();
            getSocket.value.emit('roomUpdateEvent', {
              oldRoomName: getRoom.value.name,
              room: res.data
            })
            getSocket.value.emit('newMessage', {
              room: getRoom.value,
              user: getUser.value,
              admin: true,
              content: `${getUser.value.username} updated room ${getRoom.value.name} to ${newRoomName.value}`
            })
            newRoomName.value = ''
          }
            setTimeout(() => {
              errors.value = [];
            }, 1500)
          })
              .catch(err => console.log(err))
        }

        const viewRoomDetails = () => {
          roomDetailsRef.value.open();
        }

        const toggleUserList= () => {
          userListRef.value.toggle()
          sidebarVisible.value = !sidebarVisible.value
        }

        axios.get(`/api/room/getRoom/${route.params.id}`)
            .then(res => {
              console.log("Res data ", res.data);
              room.value = res.data
              users.value = res.data.users
              store.dispatch('saveCurrentRoom', res.data)

              /** Check for private access and access Id */
              if(!res.data.access) {
                if(!res.data.accessIds.includes(getUser.value.id) &&
                  getUser.value._id !== res.data.user._id
                ) {
                  return router.push({
                    name: 'RoomList',
                    params: {messages: 'You do not have access to this room'}
                  })
                }
              }
              /** Socket IO: User join event, get latest messages from room */
              getSocket.value.emit('userJoined', {
                room: getRoom.value,
                user: getUser.value,
                content: `${getUser.value.handle} joined ${getRoom.value.name}`,
                admin: true
              })
              /** Socket IO: Received New User Event */
              getSocket.value.on('updateRoomData', (data) => {
                data = JSON.parse(data)
                if (data.messages) {
                  messages.value = data.messages
                }
                if (data.room) {
                  room.value = data.room
                  users.value = data.room.users
                  store.dispatch('saveCurrentRoom', data.room)
                }
              })
              /** Socket IO: Reconnect User Event */
              getSocket.value.on('reconnect', () => {
                usersTyping.value = [];
                getSocket.value.emit('reconnectUser', {
                  room: getRoom.value,
                  user: getUser.value
                })
              })

              getSocket.value.on('reconnected', () => {
                console.warn('Reconnected');
              });

              getSocket.value.on('disconnect', () => {
                console.warn('Disconnected');
              });

              /** Socket IO: User Exit Event - Update User List */
              getSocket.value.on('updateUserList', data => {
                users.value = JSON.parse(data).users;
              });

              /** Socket IO: User Exit Event - Check other tabs of the same room and redirect */
              getSocket.value.on('receivedUserExit', room => {
                checkUserTabs(room);
              });

              /** Socket IO: New Messaage Event - Append the new message to the messages array */
              getSocket.value.on('receivedNewMessage', message => {
                messages.value.push(JSON.parse(message));
              });

              /** Socket IO: User Typing Event  */
              getSocket.value.on('receivedUserTyping', data => {
                usersTyping.value = JSON.parse(data).filter(
                    user => user !== getUser.value.handle
                );
              });

              /** Socket IO: Room Deleted Event - Redirect all users */
              getSocket.value.on('roomDeleted', () => {
                store.dispatch('saveCurrentRoom', null);
                setTimeout(() => {
                  router.push({ name: 'RoomList' });
                }, 2000);
              });

              /** Socket IO: Room Updated Event */
              getSocket.value.on('roomUpdated', data => {
                room.value = JSON.parse(data).room;
                store.dispatch('saveCurrentRoom', JSON.parse(data).room);
              });

            }).catch(err => {
              if(err.response.status === 404){
                router.push({
                  name: 'RoomList',
                  params: {message: 'This room does not exist or deleted'}
                })
              }
        })
        onBeforeUnmount(() => {
          if(getRoom.value && !roomLeft.value){
            leaveRoom(null, true)
          }
          getSocket.value.removeListener('userJoined')
        })
        onMounted(() => {
          console.log('get socket user value', users.value)
        })
        return {
          room,
          editRoomRef,
          roomDetailsRef,
          userListRef,
          filteredUsers,
          getUsersTyping,
          messages,
          sidebarVisible,
          leaveRoom,
          openEditRoom,
          handleEditRoom,
          viewRoomDetails,
          toggleUserList,
          searchInput,
          usersTyping,
          getRoom,
          getUser,
          getSocket,
          errors,
          newRoomName,
          moment

        }
    }
  }
</script>

<style lang="scss">
@import '@/assets/scss/views/chat.scss';
@import '@/assets/scss/views/rooms.scss';
@import '@/assets/scss/component/infobox.scss';
</style>