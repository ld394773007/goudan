<template>
  <div>
    <mu-appbar class="header-bar">
      <mu-icon-button @click="$router.go(-1)" event="touchstart" icon="keyboard_arrow_left" slot="left" />
      <p class="absolute">我的作业</p>
    </mu-appbar>
    <user-work :showList="false" @isLoad="isLoad"></user-work>
  </div>
</template>

<script>
  import userWork from '@/view/shop/userWork'
  export default {
    components: {
      userWork
    },
    data() {
      return {

      }
    },
    methods: {
      isLoad() {
        this.$vux.loading.hide()
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (vm.$store.state.token === '' || !vm.$store.state.token) {
          next(from.path)
        } else {
          vm.$vux.loading.show({
            text: '加载中'
          })
        }
      })
    }
  }
</script>
