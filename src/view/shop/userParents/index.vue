<template>
  <div class="user-order-wrap user-title">
    <div class="parent-header">
      <p>孩子学习情况统计</p>
      <div>
        <input type="month" v-model="dateTime" class="y-date">
        <span>选择</span>
      </div>
    </div>
    <p style="font-size: 12px;margin: 0 0 10px 5px;">微信暂不支持在线上课，请使用IPAD登录英语树进行上课！</p>
    <div class="parent-list">
      <div class="parent-item">
        <div class="parent-item-head">
          <p>【￥299】寒假英高班开始报名啦，名额有限先到先得！</p>
        </div>
        <div class="parent-item-body">
          <div class="parent-body-title">
            <p>第一课</p>
            <span>2017年10月23日 19:30-20:30</span>
          </div>
          <div class="parent-body-tag">
            <mu-raised-button class="demo-raised-button" label="按时上课" icon="mood" primary/>
            <mu-raised-button class="demo-raised-button" label="积极发言" icon="mood" primary/>
            <mu-raised-button class="demo-raised-button" label="答题认真" icon="mood" primary/>
            <mu-raised-button class="demo-raised-button" label="迟到" icon="sentiment_very_dissatisfied" secondary/>
            <mu-raised-button class="demo-raised-button" label="再积极点" icon="sentiment_very_dissatisfied" secondary/>
            <mu-raised-button class="demo-raised-button" label="作答遗漏" icon="sentiment_very_dissatisfied" secondary/>
          </div>
          <div class="parent-body-foot">
            <span>共作答：</span>
            <x-circle style="width: 60px;margin: 0 20px 0 10px;" :percent="100" :stroke-width="2" stroke-color="#04BE02">
              <span>5题</span>
            </x-circle>
            <span>正确率：</span>
            <x-circle style="width: 60px;margin: 0 20px 0 10px;" :percent="100" :stroke-width="2" stroke-color="#04BE02">
              <span>100%</span>
            </x-circle>
          </div>
        </div>
        <div class="parent-item-foot">
          <mu-flat-button label="查看详情" class="demo-flat-button" primary/>
          <parent-detail />
        </div>
      </div>
    </div>

    <userList></userList>
  </div>
</template>

<script>
  import { dateFormat, XCircle } from 'vux'
  import userList from '@/components/student/userList'
  import parentDetail from '@/components/student/parentDetail'
  export default {
    components: {
      XCircle,
      parentDetail,
      userList
    },
    data() {
      return {
        activeTab: 'tab1',
        orderList: null,
        unpaidOrderList: null,
        orderItem: null,
        dateTime: '2017-10'
      }
    },
    created() {
      this.getOrderList()
    },
    watch: {
      dateTime(n, o) {
        if (n === '') {
          this.dateTime = dateFormat(new Date(), 'YYYY-MM')
        }
      }
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
  .parent-header {
    padding: 0 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    height: 40px;
    background: #fff;
    border-bottom: 1px #f5f5f5 solid;
  }

  .parent-header > p {
    display: flex;
    align-items: center;
  }

  .parent-header > div {
    width: 120px;
    position: relative;
  }

  .parent-header > div > span {
    position: absolute;
    right: 0;
    top: 8px;
    font-size: 15px;
    z-index: 9;
    color: #13ce66;
  }

  .parent-header .y-date {
    position: absolute;
    left: 0;
    top: 0;
    width: 120px;
    z-index: 99;
  }

  .parent-list {
    height: 80vh;
  }

  .parent-item {
    background: #fff;
  }

  .parent-item-head {
    height: 40px;
    line-height: 40px;
  }

  .parent-item-head > p {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .parent-item-body {
    padding-bottom: 20px;
    border-top: 1px #f5f5f5 solid;
    border-bottom: 1px #f5f5f5 solid;
  }

  .parent-body-title {
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
  }

  .parent-body-title > span {
    color: #666;
  }

  .parent-body-tag  {
    margin: 10px 0 20px 0;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .parent-body-tag .mu-raised-button {
    margin: 5px;
    width: 110px;
  }

  .parent-body-tag .mu-raised-button-wrapper {
    justify-content: flex-start;
  }

  .parent-body-tag .mu-icon {
    margin-left: 5px;
  }

  .parent-body-foot {
    display: flex;
    justify-content: center;
    align-items: center;
  }



</style>
