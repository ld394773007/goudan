<template>
  <div class="details" id="app" v-if="detailData">
    <div class="details-header">
      <i class="icon-back" @click="goBack"></i>
      <p>课程详情</p>
    </div>
    <div class="details-content" ref="content">
      <div class="buy-avater-img">
        <img :src="detailData.images[0].image_src">
      </div>
      <div class="details-info">
        <div>
          <h1 v-text="detailData.pro_name"></h1>
        </div>
        <div>
          <p><span v-text="'￥' + (detailData.promote_price ? detailData.promote_price : detailData.price)"></span>
            <s v-text="'￥' + (detailData.market_price)"></s>
          </p>
          <a href="javascript:" class="y-order-btn" @click="clearChart">立即报名</a>
        </div>
      </div>
    </div>
    <div class="introduce">
      <div class="tab">
        <div class="tab-header">
          <a href="javascript:" class="tab-header-item active">课程介绍</a>
        </div>
        <div class="tab-content">
          <div class="tab-content-item active">
            <div class="introduce-content" v-html="detailData.pro_desc">

            </div>
          </div>
          <div class="tab-content-item"></div>
          <div class="tab-content-item"></div>
        </div>
      </div>
    </div>

    <div class="flexd-wrap" :class="{'show': show}">
      <div class="flexd-wrap-text">
        <h2>{{detailData.pro_name}}</h2>
        <p>{{'￥' + (detailData.promote_price ? detailData.promote_price : detailData.price)}}<s v-text="'￥' + (detailData.market_price)"></s></p>
      </div>
      <div class="flexd-wrap-btn">
        <a href="javascript:" class="order-btn" @click="clearChart"><span>立即报名</span></a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        detailData: null,
        show: false
      }
    },
    created() {
      this.getDetail()
    },
    computed: {
      id() {
        return this.$route.query.id
      }
    },
    methods: {
      goBack() {
        window.history.back()
      },
      // 获取商品详情
      getDetail() {
        let { get } = window.instance

        get('/v1/product/detail', {
          params: {
            id: this.id,
            expand: 'link,images,platform'
          }
        })
        .then(({data}) => {
          if (!data.status) {
            this.detailData = data.data
            let title = document.getElementById('title')
            let img = document.getElementById('image')
            let description = document.getElementById('description')

            title.setAttribute('content', data.data.pro_name)
            img.setAttribute('content', data.data.thumb_src)
            description.setAttribute('content', data.data.pro_brief)
            this.$nextTick(() => {
              this.showFlexd()
            })
          }
        })
      },
      // 清空购物车
      clearChart() {
        let { post } = window.instance
        post('/v1/cart/clear')
          .then(({data}) => {
            if (!data.status) {
              this.addChart()
            } else {
              this.$vux.alert.show({
                content: data.message
              })
            }
          })
      },
      // 加入购物车
      addChart() {
        let { post } = window.instance
        post('/v1/cart/add', {
          pro_id: this.id,
          number: 1
        })
          .then(({data}) => {
            if (!data.status) {
              this.createOrder()
            } else {
              this.$vux.alert.show({
                content: data.message
              })
            }
          })
      },
      // 创建订单
      createOrder() {
        let { post } = window.instance
        post('/v1/order/create')
          .then(({data}) => {
            if (!data.status) {
              this.$router.push('/shop/order?id=' + data.data.id)
            } else {
              this.$vux.alert.show({
                content: data.message
              })
            }
          })
      },
      showFlexd() {
        let $contentH = this.$refs.content.offsetHeight
        console.log($contentH)
        window.addEventListener('scroll', () => {
          let top = document.body.scrollTop
          if ((top >= $contentH + 44)) {
            this.show = true
          } else {
            this.show = false
          }
        })
      }
    }
  }
</script>

