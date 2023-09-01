<template>
  <div class="page roomList">
    <section class="section section--mmt mb-3">
      <div class="section__heading mt-6">
        <span class="section__title">Room List</span>
      </div>
      <div class="section__content">
        <Error :errorMessage="errorMessage" />
        <p class="section__lead">Enter a room and start chatting!</p>
        <div class="rooms" v-if="rooms">
          <div class="rooms__header">
            <div class="rooms__details">
              <div class="rooms__details-item">
                Total Rooms:
                <span class="badge badge--info"> {{ rooms.length }} </span>
              </div>
              <div class="rooms__details-item">
                Private Rooms:
                <span
                    class="badge badge--danger"
                > {{ getPrivateRooms.length }} </span>
              </div>
              <div class="rooms__details-item">
                Public Rooms:
                <span
                    class="badge badge--success"
                > {{ getPublicRooms.length }} </span>
              </div>
            </div>
            <input
                type="text"
                class="rooms__search-input"
                placeholder="Search | Enter 'my_rooms' for a list of your created rooms"
                v-model.trim="searchInput"
            />
          </div>
          <transition name="slideDown">
            <ul class="rooms__list">
              <transition-group name="slideUp" v-if="filteredRooms.length > 0">
                <li
                    v-for="room in filteredRooms"
                    :key="room._id"
                    class="rooms__list-item"
                >
                  <a
                      :href="`room/getRoom/${room._id}`"
                      @click.prevent="handleRoomClick(room)"
                      class="rooms__list-item-link"
                  >
                    <div class="rooms__item-container">
                      <div class="rooms__item-details">
                        <p> {{ room.name }} </p>
                        <p
                            :class="{
                          public: room.access,
                          private: !room.access}"
                        >{{ room.access === true ? 'Public': 'Private' }}</p>
                        <p>
                          <strong>Users:</strong>
                          {{ room.users.length }}
                        </p>
                        <p>
                          <strong>Room Admin:</strong>
                          {{ room.user ? room.user.handle : 'Unknown User' }}
                        </p>
                      </div>
                      <div class="rooms__item-actions">
                        <div
                            v-show="room.user && getUser._id === room.user._id"
                            class="rooms__item-action"
                        >
                          <a
                              @click.stop="handleDelete(room.name, $event)"
                              class="btn btn--danger"
                          >Delete</a>
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              </transition-group>
              <span v-else>No Rooms</span>
            </ul>
          </transition>
          <!-- Private Room Enter Modal -->
          <Modal name="private-room" ref="privateRoomRef">
            <template v-slot:header>
              <h2
                  class="text-upper"
              >Enter {{ privateRoomName || 'Private Room' }}</h2>
            </template>
            <template v-slot:body>
              <form
                  @submit="handlePrivateRoomCheck"
                  class="form form--nbs pt-3"
              >
                <div class="form__input-group">
                  <ion-icon name="key-outline" class="form__icon"></ion-icon>
                  <input
                      type="password"
                      name="password"
                      class="form__control"
                      placeholder="Enter Password"
                      v-model.trim="privateRoomPassword"
                  />
                  <label for="password" class="form__label">Password</label>
                </div>
                <Error :errors="errors" />
                <button type="submit" class="btn btn--clear btn--info">Enter Room</button>
              </form>
            </template>
          </Modal>
          <!-- Create Room Modal -->
          <Modal name="create-room" ref="createRoomRef">
            <template v-slot:header>
              <h2 class="text-upper">Create Room</h2>
            </template>
            <template v-slot:body>
              <form
                  @submit.prevent="handleCreateRoom"
                  class="form form--nbs pt-3"
              >
                <div class="form__input-group">
                  <ion-icon name="pricetags" class="form__icon"></ion-icon>
                  <input
                      type="text"
                      name="room_name"
                      class="form__control"
                      placeholder="Enter Room Name"
                      v-model.trim="room_name"
                  />
                  <label for="room_name" class="form__label">Room Name</label>
                </div>
                <div class="form__input-group">
                  <ion-icon name="lock-closed" class="form__icon"></ion-icon>
                  <input
                      type="password"
                      name="password"
                      class="form__control"
                      placeholder="Enter Password"
                      pattern=".{5,10}"
                      title="Password must be between 5 and 15 characters"
                      v-model.trim="password"
                  />
                  <label for="password" class="form__label">Password (Optional)</label>
                </div>
                <Error :errors="errors" />
                <button type="submit" class="btn btn--clear btn--danger">Create Room</button>
              </form>
            </template>
          </Modal>
          <div class="rooms__actions">
            <a @click="openModal" class="btn btn--info">Create Room</a>
            <a @click="fetchRoomData" class="btn btn--info">Refresh Rooms</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import Modal from "@/components/layout/Modal.vue";
import Error from "@/components/error/Error.vue";
import {useStore} from "vuex";
import router from "@/router/router";

export default {
    name: 'RoomList',
    props: ['message'],
    components: {
      Modal: Modal,
      Error
    },
    setup(props) {
      const store = useStore();
      const rooms = ref([]);

      const createRoomRef = ref(null)
      const privateRoomRef = ref(null)

      const room_name = ref(null);
      const privateRoomName = ref(null);
      const password = ref(null);
      const privateRoomPassword = ref(null);
      const searchInput = ref('');

      const errorMessage = ref(props.message);
      const errors = ref([])

      const getUser = computed(() => store.getters.getUserData)
      const getRoom = computed(() => store.getters.getRoomData)
      const getSocket = computed(() => store.getters.getSocketData)

      const getPrivateRooms = computed(() => rooms.value.filter(room => room.access === false))
      const getPublicRooms = computed(() => rooms.value.filter(room => room.access === true))

      const filteredRooms = computed(() => {
          if(searchInput.value.toLowerCase() === 'my_rooms') {
            return rooms.value.filter(room => room.user._id === getUser.value._id)
          }else{
            return rooms.value
                .slice()
                .sort(sortAlphabetical)
                .filter(room => room.name.toLowerCase().includes(searchInput.value.toLowerCase()))
          }
      })

      const sortAlphabetical = (a,b) => {
        let roomA = a.name.toUpperCase();
        let roomB = b.name.toLowerCase();
        if(roomA < roomB) {
          return -1;
        }

        if(roomA > roomB) {
          return 1;
        }

        return 0;
      }
      const checkLingeringUser = (data) => {
        for(const room of data) {
          if(room.users.some(room => room._id === getUser.value._id)){
            return true
          }
        }
        return false;
      }

      const fetchRoomData = () => {
        axios.get('/api/room/getAllRoom')
            .then(res => {
              if(checkLingeringUser(res.data)){
                return axios.put(`/api/room/remove/users/all`, {
                  user_id: getUser.value._id
                })
              }else{
                store.dispatch('updateRoomData', res.data);
                rooms.value = res.data;
              }
            })
            .then(res => {
              if(res && res.data) {
                rooms.value = res.data
              }

            })
            .catch(err => {
              console.log(err)
            })
      }
      const openModal = () => {
        createRoomRef.value.open();
      }

      const enterRoom = (room) => {
        router.push({name: 'Room', params: {id: room._id}});
      }

      const handleCreateRoom = () => {
        // event.preventDefault();
        axios.post('/api/room/addRoom', {
          room_name: room_name.value,
          password: password.value,
        })
            .then( res => {
              if(res.data.errors) {
                for(const error of res.data.errors){
                    const [value] = Object.values(error);
                    errors.value.push({value});
                }
              }else{
                store.dispatch('addRoom', res.data);
                room_name.value = null;
                password.value = null;
                createRoomRef.value.close();
                getSocket.value.emit('roomAdded', res.data)
                // fetchRoomData();
              }
            }).catch((err) => {
          console.log(err)
        });
        setTimeout(() => {
            errors.value = [];
        },1500)
      }

      const handleDelete = (roomName, event) => {
          event.preventDefault();
          axios.delete(`/api/room/deleteRoom/${roomName}`)
              .then(res => {
                store.dispatch('deleteRoom', res.data)
                getSocket.value.emit('roomDeleted', {
                  room: res.data,
                  user: getUser.value,
                  admin: true,
                  content: `${res.data.user.username} deleted room ${res.data.name}`
                })
                fetchRoomData();
              })
              .catch((err) => console.log(err))
      }

      const handleRoomClick = (room) => {
        if (
            room.access ||
            getUser.value._id === room.user?._id ||
            room.accessIds.includes(getUser.value._id)
        ) {
          enterRoom(room);
        } else {
          privateRoomName.value = room.name;
          privateRoomRef.value.modalData.room = room; // Gán dữ liệu vào modalData
          // privateRoomRef.value.modalData.setData('room', room);
          privateRoomRef.value.open();
        }
      }

      const handlePrivateRoomCheck = (e) => {
        e.preventDefault();
        axios.post('/api/room/verify', {
          room_name: privateRoomRef.value.modalData.room.name,
          password: privateRoomPassword
        }).then(res => {
          if(res.data.errors) {
            for(const error of res.data.errors) {
              const [key] = Object.keys(error)
              const [value] = Object.values(error)
              errors.value.push({
                key,
                value
              })
            }
            privateRoomPassword.value = null
          }else{
            if(res.data.success) {
              enterRoom(privateRoomRef.value.modalData.room)
            }
          }
          setTimeout(() => {
            errors.value = [];
          }, 1500)
        }).catch(err => console.log(err))
      }

      getSocket.value.on('roomAdded', data => {
        rooms.value.unshift(JSON.parse(data));
      });

      getSocket.value.on('roomListUpdated', data => {
        rooms.value = rooms.value.filter(room => room._id !== JSON.parse(data).room._id)
      })

      getSocket.value.on('updateRooms', data => {
        rooms.value = JSON.parse(data).room;
      })

      getSocket.value.on('roomNameUpdated', data => {
        let updatedIndex = 0;
        rooms.value.forEach((room, index) => {
          if(room._id === JSON.parse(data).room._id) {
            updatedIndex = index
          }
        })
        rooms.value.splice(updatedIndex, 1, JSON.parse(data).room)
      })

      onMounted(() => {
          fetchRoomData();
          console.log('Room Users Length', rooms.value.users)
          console.log('Private Room Ref Set Data', privateRoomRef.value)
          if(errorMessage.value) {
            setTimeout(() => {
              errorMessage.value = ''
            }, 1500)
          }
      })

      return {
        rooms,
        room_name,
        privateRoomName,
        password,
        privateRoomPassword,
        searchInput,
        errorMessage,
        errors,
        getUser,
        getRoom,
        getPrivateRooms,
        getPublicRooms,
        filteredRooms,
        fetchRoomData,
        openModal,
        handleCreateRoom,
        handleDelete,
        handleRoomClick,
        handlePrivateRoomCheck,
        createRoomRef,
        privateRoomRef
      }
    }
  }
</script>

<style lang="scss">
@import '@/assets/scss/views/rooms.scss';
@import '@/assets/scss/component/form.scss';
</style>