<template>
  <div class="page roomList">
    <section class="section section--mmt mb-3">
      <div class="section__heading mt-6">
        <span class="section__title">Room List</span>
      </div>
      <div class="section__content">
<!--        <Error :errorMessage="errorMessage" />-->
        <p class="section__lead">Enter a room and start chatting!</p>
        <div class="rooms">
          <div class="rooms__header">
            <div class="rooms__details">
              <div class="rooms__details-item">
                Total Rooms:
                <span class="badge badge--info"> rooms.length </span>
              </div>
              <div class="rooms__details-item">
                Private Rooms:
                <span
                    class="badge badge--danger"
                > getPrivateRooms.length </span>
              </div>
              <div class="rooms__details-item">
                Public Rooms:
                <span
                    class="badge badge--success"
                > getPublicRooms.length </span>
              </div>
            </div>
            <input
                type="text"
                class="rooms__search-input"
                placeholder="Search | Enter 'my_rooms' for a list of your created rooms"
            />
          </div>
          <transition name="slideDown">
            <ul class="rooms__list">
              <transition-group name="slideUp">
                <li
                    class="rooms__list-item"
                >
                  <a
                      class="rooms__list-item-link"
                  >
                    <div class="rooms__item-container">
                      <div class="rooms__item-details">
                        <p> room.name </p>
<!--                        <p-->
<!--                            :class="{ public: room.access, private: !room.access}"-->
<!--                        >{{ room.access === true ? 'Public': 'Private' }}</p>-->
                        <p>
                          <strong>Users:</strong>
                           room.users.length
                        </p>
                        <p>
                          <strong>Room Admin:</strong>
<!--                          {{ room.user ? room.user.handle : 'Unknown User' }}-->
                        </p>
                      </div>
                      <div class="rooms__item-actions">
                        <div
                            class="rooms__item-action"
                        >
                          <a
                              class="btn btn--danger"
                          >Delete</a>
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              </transition-group>
              <span>No Rooms</span>
            </ul>
          </transition>
          <!-- Private Room Enter Modal -->
<!--          <Modal name="private-room" ref="privateRoom">-->
<!--            <template slot="header">-->
<!--              <h2-->
<!--                  class="text-upper"-->
<!--              >Enter {{ this.privateRoomName || 'Private Room' }}</h2>-->
<!--            </template>-->
<!--            <template slot="body">-->
<!--              <form-->
<!--                  @submit="handlePrivateRoomCheck"-->
<!--                  slot="body"-->
<!--                  class="form form&#45;&#45;nbs pt-3"-->
<!--              >-->
<!--                <div class="form__input-group">-->
<!--                  <ion-icon name="key" class="form__icon"></ion-icon>-->
<!--                  <input-->
<!--                      type="password"-->
<!--                      name="password"-->
<!--                      class="form__control"-->
<!--                      placeholder="Enter Password"-->
<!--                      v-model.trim="privateRoomPassword"-->
<!--                  />-->
<!--                  <label for="password" class="form__label">Password</label>-->
<!--                </div>-->
<!--                <Error :errors="errors" />-->
<!--                <button type="submit" class="btn btn&#45;&#45;clear btn&#45;&#45;info">Enter Room</button>-->
<!--              </form>-->
<!--            </template>-->
<!--          </Modal>-->
          <!-- Create Room Modal -->
<!--          <Modal name="create-room" ref="createRoom">-->
<!--            <template slot="header">-->
<!--              <h2 class="text-upper">Create Room</h2>-->
<!--            </template>-->
<!--            <template slot="body">-->
<!--              <form-->
<!--                  @submit="handleCreateRoom"-->
<!--                  slot="body"-->
<!--                  class="form form&#45;&#45;nbs pt-3"-->
<!--              >-->
<!--                <div class="form__input-group">-->
<!--                  <ion-icon name="list-box" class="form__icon"></ion-icon>-->
<!--                  <input-->
<!--                      type="text"-->
<!--                      name="room_name"-->
<!--                      class="form__control"-->
<!--                      placeholder="Enter Room Name"-->
<!--                      v-model.trim="room_name"-->
<!--                  />-->
<!--                  <label for="room_name" class="form__label">Room Name</label>-->
<!--                </div>-->
<!--                <div class="form__input-group">-->
<!--                  <ion-icon name="key" class="form__icon"></ion-icon>-->
<!--                  <input-->
<!--                      type="password"-->
<!--                      name="password"-->
<!--                      class="form__control"-->
<!--                      placeholder="Enter Password"-->
<!--                      pattern=".{5,10}"-->
<!--                      title="Password must be between 5 and 15 characters"-->
<!--                      v-model.trim="password"-->
<!--                  />-->
<!--                  <label for="password" class="form__label">Password (Optional)</label>-->
<!--                </div>-->
<!--                <Error :errors="errors" />-->
<!--                <button type="submit" class="btn btn&#45;&#45;clear btn&#45;&#45;danger">Create Room</button>-->
<!--              </form>-->
<!--            </template>-->
<!--          </Modal>-->
          <div class="rooms__actions">
            <a class="btn btn--info">Create Room</a>
            <a class="btn btn--info">Refresh Rooms</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'RoomList'
  }
</script>

<style lang="scss">
@import '@/assets/scss/views/rooms.scss';
@import '@/assets/scss/component/form.scss';
</style>