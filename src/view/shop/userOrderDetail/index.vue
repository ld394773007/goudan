<template>
  <div v-if="orderData" class="user-detail">
    <orderDetails @back="goBack" @cancelOrder="cancelOrder" @payOrder="payOrder" @deleteOrder="deleteOrder" :item="orderData"></orderDetails>
    <mu-raised-button @click="goBack" label="返回列表页" fullWidth primary/>
  </div>
</template>

<script>
  import orderDetails from '@/components/student/orderDetails'
  export default {
    components: {
      orderDetails
    },
    data() {
      return {
        orderData: null
      }
    },
    created() {
      this.getOrder()
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      // 获取订单详情
      getOrder() {
        let { get } = window.instance
        get('/v1/order/detail', {params: {order_id: this.$route.query.id, expand: 'product,coupon,payLog'}})
        .then(({data}) => {
          if (!data.status) {
            this.orderData = data.data
          } else {
            this.$vux.alert.show({
              content: data.message
            })
          }
        })
      },
      cancelOrder(id) {
        let { post } = window.instance

        post('/v1/order/cancel', {order_id: id})
        .then(({data}) => {
          if (!data.staus) {
            this.$vux.alert.show({
              content: '订单取消成功！'
            })

            this.showOrderDetail && (this.showOrderDetail = false)

            this.getOrder()

            setTimeout(() => {
              this.$vux.alert.hide()
            }, 2000)
          } else {
            this.$vux.alert.show({
              content: data.message
            })
          }
        })
      },
      payOrder(id) {
        this.$router.push('/shop/order?id=' + id)
      },
      deleteOrder(id) {
        let { post } = window.instance

        post('/v1/order/delete', {order_id: id})
        .then(({data}) => {
          if (!data.staus) {
            let time = setTimeout(() => {
              this.$vux.alert.hide()
              this.$router.go(-1)
            }, 2000)

            this.$vux.alert.show({
              content: '订单删除成功！',
              onHide: () => {
                clearTimeout(time)
                this.$vux.alert.hide()
                this.$router.go(-1)
              }
            })
          } else {
            this.$vux.alert.show({
              content: data.message
            })
          }
        })
      }
    }
  }
</script>

<style scope>
  .user-detail .order-list-wrap {
    height: auto;
    overflow-y: auto;
    margin-bottom: 20px;
    margin-top: 0;
  }

</style>
