<template>
  <div class="m_wrap">
    <div class="m_user_header">
      <router-link  :to="userInfo.realname ? '/editUser' : '/login'">
        <div class="m_user_header_avater" v-if="userInfo.id">
          <img :src="!userInfo.avater || userInfo.avater == '' ? '/static/image/mobile/men.png' : userInfo.avater">
        </div>
      </router-link>
      <div class="m_user_header_info" v-if="userInfo.id">
        <p>{{userInfo.realname}}</p>
      </div>
      <div v-else class="m_user_header_btn">
        <div><x-button type="default" @click.native="showRootCom">注册</x-button></div>
        <div><x-button type="primary" link="/login" style="background-color: #13ce66">登陆</x-button></div>
      </div>

    </div>
    <div class="user-content" ref="downContainer">
        <group label-width="4.5em" label-margin-right="2em" label-align="left">
           <cell title="我的课程" is-link link="../userClass"></cell>
           <cell title="我的作业" is-link link="../userWork"></cell>
           <cell title="我要预习" is-link link="../userMic"></cell>
           <cell title="我的订单" is-link link="../userOrder"></cell>
        </group>
        <group class="mt10" label-width="4.5em" label-margin-right="2em" label-align="left">
           <cell title="关于我们" is-link link=""></cell>
           <cell title="问题反馈" is-link link="../feedback"></cell>
        </group>
        <div class="content-block kf-phonenum">
          <p>24小时客服电话 <a href="tel:028-87654321">028-87654321</a></p>
        </div>
        <div class="content-block" v-if="userInfo.realname">
          <a href="javascript:" class="mod_button white" to="../editPassword">修改密码</a>
        </div>
    </div>
  </div>
</template>
<script>
  import {mapMutations} from 'vuex'
  import {Group, Cell, XButton} from 'vux'
  export default {
    components: {
      Group,
      Cell,
      XButton
    },
    data() {
      return {
        isSignOut: false
      }
    },
    computed: {
      token() {
        return this.$store.state.token
      },
      userInfo() {
        return this.$store.state.userInfo
      },
      phoneNum() {
        let num = this.$store.state.phoneNum
        if (num === '') {
          return '未绑定手机'
        }
        let phoneNum = num.slice(0, 3) + '****' + num.slice(-4)
        return phoneNum
      }
    },
    methods: {
      ...mapMutations([
        'CHANGE_ROOT_COM'
      ]),
      showRootCom() {
        this.CHANGE_ROOT_COM('register')
      }
    }
  }
</script>
<style lang="scss">
@import '../../../assets/css/mixin/mixin.scss';
  .m_user_header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    margin-bottom: 10px;
    height: 130px;
    background-color: #fff;
    &_avater {
      width: 65px;
      height: 65px;
      margin-bottom: 5px;
      overflow: hidden;
      border-radius: 50%;
      @extend %border;
      img {
        width: 100%;
      }
    }
    &_info {
      text-align: center;
    }
    &_btn {
      display: flex;
      div {
        margin: 0 10px;
      }
      button {
        min-width: 100px;
      }
    }
  }
</style>


