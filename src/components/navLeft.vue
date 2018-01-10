<template>
  <div class="nav-left">
    <div class="user-info" v-if="userInfo">
      <img :src="userInfo.avater == '' ?'/static/image/avatar.png' : userInfo.avater" @click="clickOut">
      <p class="user-name" v-text="userInfo.realname"></p>
    </div>
    <ul class="nav-list">
      <li class="nav-item" :class="{'active': item.link === active}" :key="index" v-for="(item, index) in navList">
        <router-link :to="item.link">
          <i :class="'y-icon icon-' + item.icon"></i>
          <span v-text="item.title"></span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'navLeft',
  props: {
    clickOut: {
      type: Function,
      default: () => {}
    },
    active: {
      type: String,
      default: ''
    },
    userInfo: {
      default: null
    },
    navList: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

