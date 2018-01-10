<template>
  <div>
    <mu-appbar class="header-bar">
      <mu-icon-button @click="$router.go(-1)" event="touchstart" icon="keyboard_arrow_left" slot="left" />
      <p class="absolute">我的订单</p>
    </mu-appbar>
    <user-order :showList="false" @isLoad="isLoad"></user-order>
  </div>
</template>

<script>
  import userOrder from '@/view/shop/userOrder'
  export default {
    components: {
      userOrder
    },
    data() {
      return {}
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
