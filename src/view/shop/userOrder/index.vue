<template>
  <div class="user-order-wrap">
    <div class="order-tab-wrap">
      <mu-tabs :value="activeTab" class="order-tab" @change="handleTabChange">
        <mu-tab value="tab1" title="待支付订单" />
        <mu-tab value="tab2" title="全部订单" />
      </mu-tabs>
    </div>
    <div v-if="activeTab === 'tab1'" class="tab-content">
      <div v-if="unpaidOrderList">
        <div class="no-order-list" v-if="!unpaidOrderList.length">
          <img src="/static/image/TaskErr@2x.png">
          <span>你还没有购买过课程</span>
        </div>
        <ul class="order-list-wrap reset" style="margin: 0 15px;" v-else>
          <orderItem :key="index" class="mu-paper-1" @showDetail="showDetail" @cancelOrder="cancelOrder" @payOrder="payOrder" @deleteOrder="deleteOrder" v-for="(item,index) in unpaidOrderList" :item="item"></orderItem>
        </ul>
      </div>
    </div>
    <div v-if="activeTab === 'tab2'" class="tab-content">
      <div v-if="orderList">
        <div class="no-order-list" v-if="!orderList.length">
          <img src="/static/image/TaskErr@2x.png">
          <span>你还没有购买过课程</span>
        </div>
        <ul class="order-list-wrap reset" style="margin: 0 15px;" v-else>
          <orderItem :key="index" class="mu-paper-1" @showDetail="showDetail" @cancelOrder="cancelOrder" @payOrder="payOrder" @deleteOrder="deleteOrder" v-for="(item,index) in orderList" :item="item"></orderItem>
        </ul>
      </div>
    </div>

    <user-list v-if="showList"></user-list>
  </div>
</template>

<script>
  import userList from '@/components/student/userList'
  import orderItem from '@/components/student/orderItem'
  export default {
    props: {
      showList: {
        type: Boolean,
        default: true
      }
    },
    components: {
      orderItem,
      userList
    },
    data() {
      return {
        activeTab: 'tab2',
        orderList: null,
        unpaidOrderList: null,
        orderItem: null
      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      handleTabChange(v) {
        this.activeTab = v
      },
      // 获取订单列表
      getOrderList() {
        let { get } = window.instance

        get('/v1/order/list?expand=product,coupon,payLog')
        .then(({data}) => {
          if (!data.staus) {
            let unpaid = []
            data.data.forEach((e) => {
              if (e.pay_status === 0) {
                unpaid.push(e)
              }
            })

            this.orderList = data.data
            this.unpaidOrderList = unpaid
            this.$emit('isLoad')
          }
        })
      },
      showDetail(item) {
        this.$router.push('/shop/user-order-detail?id=' + item.id)
      },
      cancelOrder(id) {
        let { post } = window.instance

        post('/v1/order/cancel', {order_id: id})
        .then(({data}) => {
          if (!data.staus) {
            this.$vux.alert.show({
              content: '订单取消成功！'
            })

            this.getOrderList()

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
            this.$vux.alert.show({
              content: '订单删除成功！'
            })
            this.getOrderList()

            setTimeout(() => {
              this.$vux.alert.hide()
            }, 2000)
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
  .user-order-wrap {

  }

  .tab-content {
    height: 84.5vh;
    overflow-y: auto;
    background-color: #fff;
  }

  .order-tab-wrap {
    background: #fff;
  }

  .order-tab {
    margin: 0 auto;
    width: 80%;
    background-color: transparent;
    color: #13ce66;
    margin-bottom: 8px;
  }

  .order-tab .mu-tab-text {
    color: #13ce66;
  }
</style>
