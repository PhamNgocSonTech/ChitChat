<template>
  <div class="chat__c-messagelist">
    <ul class="chat__messages" ref="messages" >
      <transition-group name="slideDown">
        <li class="chat__message">
          <!-- Message belongs to the user -->
          <div
              class="chat__message-item u-flex-right"
          >
            <div class="chat__message-body">
              <div class="chat__message-content chat__message-content--right">
                <span> message.content </span>
              </div>
              <div class="chat__message-details">
                <span> message.user.handle </span>
                <span> moment(message.created_at).fromNow() </span>
              </div>
            </div>
            <img
                class="chat__user-avatar"
                alt
            >
            <img class="chat__user-avatar" alt>
          </div>
          <!-- Message belongs to the admin -->
          <div class="chat__message-item u-flex-center">
            <img
                src="../../assets/img/icons8-businessman.svg"
                class="chat__user-avatar"
                alt
            >
            <div class="chat__message-body">
              <div class="chat__message-content">
                <span> message.content </span>
              </div>
              <div class="chat__message-details">
                <span>Admin</span>
                <span> moment(message.created_at).fromNow() </span>
              </div>
            </div>
          </div>

          <!-- Message has been deleted -->
          <div class="chat__message-item">
            <img src="@/assets/img/icons8-account-64.png" class="chat__user-avatar" alt>

            <div class="chat__message-body">
              <div class="chat__message-content chat__message-content--left">
                <span> message.content </span>
              </div>
              <div class="chat__message-details">
                <span>Unknown User</span>
                <span> moment(message.created_at).fromNow() </span>
              </div>
            </div>
          </div>

          <!-- Message belongs to another user -->
          <div class="chat__message-item">
            <img
                class="chat__user-avatar"
                alt
            >
            <img class="chat__user-avatar" alt>
            <div class="chat__message-body">
              <div class="chat__message-content chat__message-content--left">
                <span> message.content </span>
              </div>
              <div class="chat__message-details">
                <span> message.user.handle</span>
                <span> moment(message.created_at).fromNow()</span>
              </div>
            </div>
          </div>
        </li>
      </transition-group>
    </ul>
  </div>
</template>

<script>

</script>


<style>

</style>