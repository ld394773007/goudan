<template>
  <div class="wrap" id="app">
    <div class="details-header">
      <i class="icon-back" @click="goBack()"></i>
      <p>支付</p>
    </div>
    <div class="order-wrap">
      <div class="order-content">
        <h2>微信扫一扫支付</h2>
        <qrcode class="code" :value="code" size="150" type="img" fg-color="#6cd194"></qrcode>
        <div class="order-btn" @click="handlerClick()" >已完成支付</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Qrcode } from 'vux'
  export default {
    components: {
      Qrcode
    },
    data() {
      return {
        time: ''
      }
    },
    mounted() {
      this.time = setInterval(() => {
        this.getPayStatus()
      }, 6000)
    },
    computed: {
      code() {
        return this.$route.query.code
      },
      id() {
        return this.$route.query.orderId
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      handlerClick() {
        this.getPayStatus(() => {
          this.$vux.alert.show({
            content: '你还没有完成支付哦！ 请确认完成后再次点击！'
          })
        })
      },
      getPayStatus(fn) {
        let { get } = window.instance
        get('/v1/order/query-pay-status', {params: {order_id: this.id}})
        .then(({data}) => {
          if (!data.status) {
            if (data.data.pay_status === 'paied') {
              this.$vux.alert.show({
                content: '你已经完成支付！点击确认查看',
                onHide: () => {
                  clearInterval(this.time)
                  this.$router.push('/shop/success')
                }
              })
            } else {
              fn && fn()
            }
          } else {
            this.$vux.alert.show({
              content: data.message
            })
          }
        })
      }
    },
    beforeRouteLeave: (to, from, next) => {
      clearInterval(this.time)
      next()
    }
  }
</script>

<style scope>
  .order-content h2 {
    text-align: center;
    margin-top: 20px;
  }

  .code {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }
</style>
