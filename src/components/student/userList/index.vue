<template>
  <ul class="wx-tab">
      <li v-for="(item,key) in list" :class="{'wx-tab-active': item.path == path}">
        <router-link :key="key" :to="item.path">{{item.title}}</router-link>
      </li>
  </ul>
</template>
<script>
  export default {
    data() {
      return {
        list: [],
        path: ''
      }
    },
    created() {
      this.path = this.$route.fullPath
      this.is_weixin()
    },
    methods: {
      is_weixin() {
        let ua = window.navigator.userAgent.toLowerCase()
        if (ua.match(/MicroMessenger/i) === 'micromessenger') {
          this.list = [
            {title: '课程', path: '/shop/user-course'},
            {title: '作业', path: '/shop/user-work'},
            {title: '订单', path: '/shop/user-order'},
            {title: '家长', path: '/shop/user-parents'}
          ]
        } else {
          this.list = [
            {title: '课程', path: '/shop/user-course'},
            {title: '作业', path: '/shop/user-work'},
            {title: '订单', path: '/shop/user-order'},
            {title: '我的', path: '/shop/user'}
          ]
        }
      }
    }
  }
</script>
