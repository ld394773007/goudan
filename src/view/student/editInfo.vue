<template>
  <div class="container">
    <div v-if="show" class="info-wrap-content" :class="{'show': show}">
      <div class="Info-wrap">
        <div class="info">
          <div class="info-content" v-if="userInfo">
            <a href="javascript:;" class="info-btn" @click="handlerEdit" v-text="editText"></a>
            <div class="info-avater">
              <div class="avater-img">
                <img :src="userInfo.avater == '' ?'/static/image/avatar.png' : userInfo.avater">
              </div>
              <div class="user-info-text">
                <p v-text="userInfo.realname"></p>
                <span v-text="userInfo.en_name"></span>
              </div>

            </div>
            <div class="y-form">
              <div class="info-text" v-if="!edit">
                <p><span>姓名</span><span v-text="form.realname"></span></p>
                <p><span>英文名</span><span v-text="form.en_name"></span></p>
                <p><span>性别</span><span v-text="form.sex == 1 ? '男' : '女'"></span></p>
                <p><span>年级</span><span v-text="grade"></span></p>
                <p><span>学校</span><span v-text="userInfo.school"></span></p>
              </div>
              <el-form ref="form" :model="form" label-width="60px" v-else>
                <el-form-item label="姓名">
                  <el-input placeholder="请填写姓名" v-model="form.realname"></el-input>
                </el-form-item>
                <el-form-item label="英文名">
                  <el-input placeholder="请填写英文名" v-model="form.en_name"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                  <div class="form-radio">
                    <label for="boy">
                            <span>男</span>
                            <input type="radio" id="boy" name="sex" :value="1" v-model="form.sex">
                            <i></i>
                          </label>
                    <label for="girl">
                            <span>女</span>
                            <input type="radio" id="girl" name="sex" :value="2" v-model="form.sex">
                            <i></i>
                          </label>
                  </div>
                </el-form-item>
                <el-form-item label="年级">
                  <el-select style="width:100%" v-model="form.grade" placeholder="请选择年级">
                    <el-option label="一年级" :value="1"></el-option>
                    <el-option label="二年级" :value="2"></el-option>
                    <el-option label="三年级" :value="3"></el-option>
                    <el-option label="四年级" :value="4"></el-option>
                    <el-option label="五年级" :value="5"></el-option>
                    <el-option label="六年级" :value="6"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="学校">
                  <el-input placeholder="请填写学校" v-model="form.school"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <x-button style="background-color: #fff; margin-top: 20px;" @click.native="clickOut">退出</x-button>
        </div>
        <div class="order-info">
          <div v-if="showOrderDetail">
            <orderDetails @back="back" @cancelOrder="cancelOrder" @payOrder="payOrder" @deleteOrder="deleteOrder" :item="orderItem"></orderDetails>
          </div>
          <div class="order-tab" v-if="!showOrderDetail">
            <tab v-model="index">
              <tab-item :selected="tabSelected === item" v-for="(item, index) in tabList" @click="tabSelected = item" :key="index">{{item}}</tab-item>
            </tab>
          </div>
          <swiper v-model="index" height="91.5vh" :show-dots="false" v-if="!showOrderDetail">
            <swiper-item>
              <div>
                <div class="no-order-list" v-if="!unpaidOrderList.length">
                  <img src="/static/image/TaskErr@2x.png">
                  <span>你还没有购买过课程</span>
                </div>
                <ul class="order-list-wrap">
                  <orderItem :key="index" @showDetail="showDetail" @cancelOrder="cancelOrder" @payOrder="payOrder" @deleteOrder="deleteOrder" v-for="(item,index) in unpaidOrderList" :item="item" ></orderItem>
                </ul>
              </div>
            </swiper-item>
            <swiper-item>
              <div>
                <div class="no-order-list" v-if="!orderList.length">
                  <img src="/static/image/TaskErr@2x.png">
                  <span>你还没有购买过课程</span>
                </div>
                <ul class="order-list-wrap">
                  <orderItem :key="index" @showDetail="showDetail"  @cancelOrder="cancelOrder" @payOrder="payOrder" @deleteOrder="deleteOrder" v-for="(item,index) in orderList" :item="item" ></orderItem>
                </ul>
              </div>
            </swiper-item>
          </swiper>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    XButton
  } from 'vux'

  import utils from '@/utils'

  import orderItem from '@/components/student/orderItem'
  import orderDetails from '@/components/student/orderDetails'

  export default {
    components: {
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      XButton,
      orderItem,
      orderDetails
    },
    data() {
      return {
        form: {
          realname: '',
          sex: 1,
          en_name: '',
          school: '',
          grade: 4
        },
        show: false,
        editText: '编辑',
        edit: false,
        index: 0,
        tabSelected: '待支付订单',
        tabList: ['待支付订单', '全部订单'],
        orderList: [],
        unpaidOrderList: [],
        showOrderDetail: false,
        orderItem: {}
      }
    },
    created() {
      this.getOrderList()
    },
    watch: {
      userInfo(n, o) {
        this.form.realname = n.realname
        this.form.sex = n.sex
        this.form.en_name = n.en_name
        this.form.school = n.school
        this.form.grade = n.grade
        this.show = true
      }
    },
    computed: {
      userInfo() {
        let n = this.$store.state.userInfo

        if (n) {
          this.form.realname = n.realname
          this.form.sex = n.sex
          this.form.en_name = n.en_name
          this.form.school = n.school
          this.form.grade = n.grade
          this.show = true
        }

        return this.$store.state.userInfo
      },
      grade() {
        let arr = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']
        return arr[this.form.grade - 1]
      }
    },
    methods: {
      back() {
        this.showOrderDetail = false
      },
      // 获取订单列表
      getOrderList() {
        let { get } = window.shop

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
        this.orderItem = item
        this.showOrderDetail = true
      },
      cancelOrder(id) {
        let { post } = window.shop

        post('/v1/order/cancel', {order_id: id})
        .then(({data}) => {
          if (!data.staus) {
            this.$vux.alert.show({
              content: '订单取消成功！'
            })

            this.showOrderDetail && (this.showOrderDetail = false)

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
        let { post } = window.shop

        post('/v1/order/delete', {order_id: id})
        .then(({data}) => {
          if (!data.staus) {
            this.$vux.alert.show({
              content: '订单删除成功！'
            })

            this.showOrderDetail && (this.showOrderDetail = false)
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
      // 退出登陆
      clickOut() {
        /* global WebViewJavascriptBridge */
        var data = JSON.parse(JSON.stringify(this.userInfo))
        if (window.WebViewJavascriptBridge) {
          WebViewJavascriptBridge.callHandler('doOutClick', data, (req) => {
            utils.cookie.remove('student')
            this.$router.push('/')
          })
        } else {
          utils.cookie.remove('student')
          this.$router.push('/')
        }
      },
      // 修改个人资料
      handlerEdit() {
        let { put } = this.$http
        let this_ = this
        if (this.edit) {
          put('/v1/member/change-profile', this.form)
          .then(({data}) => {
            if (!data.status) {
              this_.edit = false
              this_.editText = '编辑'
              this_.$vux.toast.show('修改成功')
            } else {
              this_.$vux.alert.show({
                content: data.message
              })
            }
          })
        } else {
          this.edit = true
          this.editText = '完成'
        }
      }
    }
  }
</script>

<style scope>
  .order-tab {
    display: flex;
    justify-content: center;
    width: 100%;
    background: #fff;
  }

  .vux-tab {
    width: 60%;
    max-width: 240px;
  }

  .y-wrap .form-radio i {
    top: 50%;
    margin-top: -8px;
  }

</style>
