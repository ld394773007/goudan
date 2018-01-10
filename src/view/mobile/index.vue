<template>
  <div>
    <router-view></router-view>
    <transition name="scale">
      <div class="login dialog-login" v-if="show">
        <div class="dialog-login-mask" @touchstart="hideLogin"></div>
        <mu-paper :zDepth="2" class="dialog-login-content">
          <mu-icon-button @click="hideLogin" event="touchstart" class="close-icon" icon="clear"></mu-icon-button>
          <h2>登陆</h2>
          <mu-text-field hintText="手机号" fullWidth  type="number" v-model="login.phone" />
          <mu-text-field hintText="密码" fullWidth  type="password" v-model="login.password" />
          <div class="btn-wrap-login">
            <a class="y-btn-login loading-btn" :class="{'show': uploading}" href="javascript:;" @touchstart="submit(false)">
              <div class="load-wrap">
                <div class="loader1"></div>
              </div>登录</a>
          </div>
          <div class="handler-wrap" :style="{'justify-content': 'space-between'}">
            <a href="javascript:" @click="showComponent('register')">新用户注册</a>
            <a href="javascript:" @click="showComponent('editPass')">忘记密码？</a>
          </div>
        </mu-paper>
      </div>
    </transition>
    <transition name="bottom-top">
      <componetns :is="rootCom" v-if="rootCom" @close="close"></componetns>
    </transition>
  </div>
</template>
<script>
  import {
    cookie
  } from 'vux'
  import utils from '@/utils'
  import register from '@/view/register'
  import editPass from '@//view/editPass'
  export default {
    components: {
      register,
      editPass
    },
    data() {
      return {
        login: {
          phone: '',
          password: ''
        },
        uploading: false
      }
    },
    computed: {
      show() {
        return this.$store.state.showLogin
      },
      direction() {
        return this.$store.state.direction
      },
      rootCom() {
        return this.$store.state.rootCom
      }
    },
    created() {
      let {m, p} = this.$route.query
      let token = cookie.get('student')

      if (m && p) {
        this.login.phone = m
        this.login.password = p
        this.submit(true)
      }
      this.$http.defaults.headers = {
        Authorization: 'Bearer ' + token
      }

      this.$http.defaults.validateStatus = (status) => {
        if (status === 401 || status === 403 || status === 404) {
          utils.cookie.remove('student')
          this.$store.commit('updateToken', false)
          this.hideLogin()
        } else if (status === 200) {
          return true
        }
      }
    },
    methods: {
      close() {
        this.$store.commit('CHANGE_ROOT_COM', '')
      },
      showComponent(n) {
        this.$store.commit('CHANGE_ROOT_COM', n)
      },
      submit(t) {
        let {phone, password} = this.login
        let {post} = this.$http

        if (phone === '') {
          this.$vux.alert.show({
            content: '请填写正确的手机号！'
          })
          return
        }

        if (password === '') {
          this.$vux.alert.show({
            content: '请填写密码'
          })
        }
        this.uploading = true
        post('/v1/user/login', {
          mobile: phone,
          password,
          accountType: 'student'
        })
        .then(({data}) => {
          if (!data.status) {
            utils.cookie.set('student', data.data)
            this.$http.defaults.headers = {
              Authorization: 'Bearer ' + data.data
            }
            window.instance.defaults.headers = {
              Authorization: 'Bearer ' + data.data
            }
            this.$store.commit('savePhoneNum', phone)
            !t && this.$store.commit('changeShowLogin')
            this.$store.commit('updateToken', data.data)
            this.getUserInfo(data.data)
            this.$store.dispatch('getTodayTask')
          } else {
            this.$vux.toast.show({
              text: data.message,
              type: 'cancel',
              width: 'auto',
              position: 'middle'
            })
          }

          this.uploading = false
        })
      },
      hideLogin() {
        this.$store.commit('changeShowLogin')
      },
      getUserInfo(v) {
        let {get} = this.$http
        get('/v1/member/profile')
        .then(({data}) => {
          if (!data.status) {
            let {phone, password} = this.login
            let info = JSON.parse(JSON.stringify(Object.assign(data.data, {
              mobile: phone,
              password: password,
              token: v
            })))

            if (window.dsBridge) {
              let res = window.dsBridge.call('doInfoClick', info)
              res && console.log(res)
            }
            this.$store.commit('updateUserInfo', Object.assign(data.data, {
              mobile: phone,
              password: password,
              token: v
            }))
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .user-order-wrap {
    .tab-content {
      height: 82.5vh;
    }
  }
  .user-title .tab-content {
    height: 82.5vh;
  }

</style>
