<template>
  <li class="order-item">
    <div class="order-item-head">
      <p>{{foramtTime(item.created_at)}}</p>
      <span>{{getStatus()}}</span>
    </div>
    <div class="order-item-body" @click="showDetail">
      <div class="order-item-img">
        <img :src="item.product[0].thumb">
      </div>
      <div class="order-item-info">
        <div>
          <p>{{item.product[0].product_name}}</p>
        </div>
        <span>￥{{toDecimal2(getNum(item.order_amount))}}</span>
      </div>
    </div>
    <div class="order-item-foot">
      <a @touchstart="deleteOrder" href="javascript:;" v-if="item.order_status == 2">删除订单</a>
      <a @touchstart="cancelOrder" href="javascript:;" v-if="!item.pay_status && item.order_status < 2">取消订单</a>
      <a @touchstart="payOrder" href="javascript:;" class="payment" v-if="!item.pay_status && item.order_status < 2">去支付</a>
      <p v-if="item.pay_status == 1">实付款：￥{{toDecimal2(getNum(item.order_amount))}}</p>
    </div>
  </li>
</template>

<script>
  import { dateFormat } from 'vux'

  export default {
    props: {
      item: {
        type: Object,
        default: () => ({})
      }
    },
    methods: {
      getStatus() {
        let orderStatus = this.item.order_status
        let payStatus = this.item.pay_status

        if (orderStatus < 2 && !payStatus) {
          return '未支付'
        } else if (orderStatus === 2) {
          return '已取消'
        } else if (payStatus === 1) {
          return '已付款'
        }
      },
      showDetail() {
        this.$emit('showDetail', this.item)
      },
      cancelOrder() {
        this.$emit('cancelOrder', this.item.id)
      },
      payOrder() {
        this.$emit('payOrder', this.item.id)
      },
      deleteOrder() {
        this.$emit('deleteOrder', this.item.id)
      },
      foramtTime(t) {
        let time = new Date(t * 1000)
        return dateFormat(time, 'YYYY-MM-DD')
      },
      // 格式化价格
      getNum(s) {
        return parseFloat(parseFloat(s).toFixed(2))
      },
      toDecimal2(x) {
        let f1 = parseFloat(x)
        if (isNaN(f1)) {
          return false
        }
        let f = Math.round(x * 100) / 100
        let s = f.toString()
        let rs = s.indexOf('.')
        if (rs < 0) {
          rs = s.length
          s += '.'
        }
        while (s.length <= rs + 2) {
          s += '0'
        }
        return s
      }
    }
  }
</script>
