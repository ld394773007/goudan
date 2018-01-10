<template>
  <div class="wrap" id="app" v-if="detailData">
    <div class="details-header">
      <i class="icon-back" @click="goBack"></i>
      <p>课程详情</p>
    </div>
    <div class="order-wrap">
      <div class="order-content">
        <div class="order-content-info">
          <div class="order-info-text">
            <h1>订单信息</h1>
            <p class="order-text">商品名称：<span v-text="detailData.product[0].product_name"></span></p>
            <!--<p class="order-text">开课时间: <span>2017年10月10日 开始 每周六 20：00 ~ 21:00</span></p>
              <p class="order-text">授课教师：<span>钟平</span></p>-->
          </div>
          <div class="order-mode">
            <h1>支付方式</h1>
            <div>
              <!--<label class="mode-label" for="zfb">
                    <p>
                      <i class="mode-icon zfb"></i>
                      支付宝
                    </p>
                    <input type="radio" id="zfb" name="mode">
                    <i class="input-icon"></i>
                    <span class="mode-border"></span>
                  </label>-->
              <label class="mode-label" for="wx">
                    <p>
                      <i class="mode-icon wx"></i>
                      微信
                    </p>
                    <input checked type="radio" id="wx" name="mode">
                    <i class="input-icon"></i>
                    <span class="mode-border"></span>

                  </label>
            </div>
          </div>
          <div class="settlement">
            <h1>结算</h1>
            <p class="order-text">订单价格：<span v-text=" '￥' + goodAmount"></span></p>
            <p class="order-text">已优惠：<span v-text="'-￥' + couponAmount"></span></p>
            <p class="order-text">需支付：<span v-text="'￥' + toDecimal2(getNum(detailData.order_amount))"></span></p>
          </div>
        </div>
        <div class="order-btn" @click="sendPay">去支付</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        detailData: null,
        payList: []
      }
    },
    created() {
      this.getPayList()
      this.createOrder()
    },
    computed: {
      id() {
        return this.$route.query.id
      },
      goodAmount() {
        let getNum = this.getNum
        let detailData = this.detailData
        return this.toDecimal2(getNum(detailData.goods_amount) + getNum(detailData.pay_fee) + getNum(detailData.shipping_fee))
      },
      couponAmount() {
        let getNum = this.getNum
        let detailData = this.detailData
        return this.toDecimal2(getNum(detailData.coupon_amount) + getNum(detailData.discount_amount))
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      // 发起支付
      sendPay() {
        let { post } = window.instance
        post('/v1/order/pay', {
          order_id: this.id,
          pay_code: this.payList[0].pay_code
        })
          .then(({data}) => {
            if (!data.status) {
              switch (data.data.type) {
                case 'url':
                  window.location = data.data.data
                  break
                case 'qrcode':
                  this.$router.push('/shop/pay?code=' + data.data.data + '&orderId=' + this.id)
                  break
                case 'jsapi':
                  this.sendWechart(JSON.parse(data.data.data.json))
                  break
                case 'success':
                  this.$router.push('/shop/success')
                  break
              }
            } else {
              this.$vux.alert.show({
                content: data.message
              })
            }
          })
      },
      // 发起微信支付
      sendWechart(json) {
        if (typeof WeixinJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(json), false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(json))
            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(json))
          }
        } else {
          this.onBridgeReady(json)
        }
      },
      // 调用微信sdk
      onBridgeReady(data) {
        let { get } = window.instance
        /* global WeixinJSBridge */
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          data,
          (res) => {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              get('/v1/order/query-pay-status', {params: {order_id: this.id}})
              .then(({data}) => {
                if (!data.status) {
                  if (data.data.pay_status === 'paied') {
                    this.$router.push('/shop/success')
                  }
                } else {
                  this.$vux.alert.show({
                    content: data.message
                  })
                }
              })
              this.$router.push('/shop/success')
            }
          }
        )
      },
      // 创建订单
      createOrder() {
        let { get } = window.instance
        get('/v1/order/detail', {
          params: {
            'order_id': this.id,
            expand: 'product, coupon, payLog'
          }
        })
          .then(({data}) => {
            if (!data.status) {
              this.detailData = data.data
            } else {
              this.$vux.alert.show({
                content: data.message
              })
            }
          })
      },
      // 获取支付方式列表
      getPayList: function() {
        let { get } = window.instance
        get('/v1/order/pay-list')
          .then(({data}) => {
            if (!data.status) {
              this.payList = data.data
            }
          })
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
