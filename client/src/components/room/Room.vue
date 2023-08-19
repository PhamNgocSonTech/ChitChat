<template>
  <div class="page page--room">
    <section class="section section--room section--mmt p-0">
      <div class="section__content u-max-height p-0">
        <div class="chat">
<!--          <Sidebar name="userlist" ref="userList">-->
<!--            <template slot="header">-->
<!--              <div class="userlist__actions">-->
<!--                <div>-->
<!--                  <ion-icon name="contacts" class="icon"></ion-icon>-->
<!--                </div>-->
<!--                <span class="section__title">Online Users</span>-->
<!--                <div @click="toggleUserList">-->
<!--                  <ion-icon name="backspace" class="icon"></ion-icon>-->
<!--                </div>-->
<!--              </div>-->
<!--            </template>-->
<!--            <template slot="body">-->
<!--              <input-->
<!--                  type="text"-->
<!--                  class="rooms__search-input"-->
<!--                  placeholder="Search user by name"-->
<!--                  v-model.trim="searchInput"-->
<!--              />-->
<!--              <ul class="chat__userlist" v-if="this.getCurrentRoom && filteredUsers">-->
<!--                <transition-group name="slideDown">-->
<!--                  <li-->
<!--                      class="chat__user"-->
<!--                      v-for="user in filteredUsers"-->
<!--                      :key="user.lookup._id"-->
<!--                  >-->
<!--                    <div class="chat__user-item">-->
<!--                      <div class="chat__user-image">-->
<!--                        <img-->
<!--                            v-if="user.lookup.social.id === null"-->
<!--                            :src="user.lookup.image"-->
<!--                            class="chat__user-avatar"-->
<!--                            alt-->
<!--                        />-->
<!--                        <img-->
<!--                            v-else-->
<!--                            :src="user.lookup.social.image"-->
<!--                            class="chat__user-avatar"-->
<!--                            alt-->
<!--                        />-->
<!--                      </div>-->

<!--                      <div class="chat__user-details">-->
<!--                        <span>{{ user.lookup.handle }}</span>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </li>-->
<!--                </transition-group>-->
<!--              </ul>-->
<!--            </template>-->
<!--            <template slot="footer">-->
<!--              <button-->
<!--                  @click="leaveRoom"-->
<!--                  class="btn btn&#45;&#45;clear btn&#45;&#45;danger center"-->
<!--              >Leave Room</button>-->
<!--            </template>-->
<!--          </Sidebar>-->
          <div class="chat__content" >
            <div class="chat__header" >
              <span class="section__title"></span>
              <div class="chat__actions">
                <ion-icon name="return-left" class="icon"></ion-icon>
                <ion-icon name="create"  class="icon"></ion-icon>
                <ion-icon name="analytics"  class="icon"></ion-icon>
                <ion-icon name="people"  class="icon"></ion-icon>
              </div>
            </div>
<!--            <MessageList :messages="messages" />-->
            <transition name="slideDown">
              <div class="chat__utyping">
                <span> getUsersTyping </span>
              </div>
            </transition>
<!--            <ChatInput />-->
          </div>
        </div>
      </div>
<!--      <Modal name="editRoom" ref="editRoom" v-if="this.getCurrentRoom">-->
<!--        <template slot="header">-->
<!--          <h2 class="text-upper">Edit Room: {{ this.getCurrentRoom.name }}</h2>-->
<!--        </template>-->
<!--        <template slot="body">-->
<!--          <form @submit="handleEditRoom" slot="body" class="form form&#45;&#45;nbs pt-3">-->
<!--            <div class="form__input-group">-->
<!--              <ion-icon name="pricetags" class="form__icon"></ion-icon>-->
<!--              <input-->
<!--                  type="text"-->
<!--                  name="roomName"-->
<!--                  class="form__control"-->
<!--                  placeholder="Enter New Room Name"-->
<!--                  pattern=".{3,20}"-->
<!--                  required-->
<!--                  v-model.trim="newRoomName"-->
<!--              />-->
<!--              <label for="roomName" class="form__label">New Room name</label>-->
<!--            </div>-->
<!--            <Error :errors="errors" />-->
<!--            <button type="submit" class="btn btn&#45;&#45;clear btn&#45;&#45;info">Update Room Name</button>-->
<!--          </form>-->
<!--        </template>-->
<!--      </Modal>-->
<!--      <Modal name="roomDetails" ref="roomDetails" v-if="this.getCurrentRoom && messages">-->
<!--        <template slot="header">-->
<!--          <h2 class="lead text-upper">Room Details: {{ this.getCurrentRoom.name }}</h2>-->
<!--        </template>-->
<!--        <template slot="body">-->
<!--          <div class="infobox">-->
<!--            <div class="infobox__item">-->
<!--              <ion-icon name="planet" class="icon icon-lg"></ion-icon>-->
<!--            </div>-->
<!--            <div class="infobox__item">-->
<!--              <span class="infobox__item&#45;&#45;left">Online Users</span>-->
<!--              <span-->
<!--                  class="infobox__item&#45;&#45;right"-->
<!--              >{{ this.getCurrentRoom.users.length }}</span>-->
<!--            </div>-->
<!--            <div class="infobox__item">-->
<!--              <span class="infobox__item&#45;&#45;left">Messages</span>-->
<!--              <span class="infobox__item&#45;&#45;right">{{ messages.length }}</span>-->
<!--            </div>-->
<!--            <div class="infobox__item">-->
<!--              <span class="infobox__item&#45;&#45;left">Room Admin</span>-->
<!--              <span-->
<!--                  class="infobox__item&#45;&#45;right"-->
<!--              >{{ this.getCurrentRoom.user ? this.getCurrentRoom.user.handle : 'Unknown User' }}</span>-->
<!--            </div>-->
<!--            <div class="infobox__item">-->
<!--              <span class="infobox__item&#45;&#45;left">Created</span>-->
<!--              <span-->
<!--                  class="infobox__item&#45;&#45;right"-->
<!--              >{{ moment(this.getCurrentRoom.created_at).fromNow() }}</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->
<!--      </Modal>-->
    </section>
  </div>
</template>

<script>
  export default {
      name: 'Room'
  }
</script>

<style lang="scss">
@import '@/assets/scss/views/rooms.scss';
@import '@/assets/scss/component/form.scss';
</style>