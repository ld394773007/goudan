<template>
  <div>
    <div class="login">
      <mu-appbar class="header-bar home-header" style="background-color: transparent;border:none">
    </mu-appbar>
    <div>
      <div class="login-logo">
        <img src="/static/image/logo.svg">
      </div>
      <mu-text-field label="手机号" labelFloat type="tel" fullWidth v-model="login.phone" />
      <mu-text-field label="密码" type="password" labelFloat fullWidth v-model="login.password" />
      <div class="btn-wrap-login">
        <a class="y-btn-login loading-btn" :class="{'show': uploading}" href="javascript:;" @touchstart="submit">
          <div class="load-wrap">
            <div class="loader1"></div>
          </div>登录</a>
      </div>
      <div class="handler-wrap" :style="{'justify-content':'space-between'}">
        <a href="javascript:" @click="showComponent('register')">新用户注册</a>
        <a href="javascript:" @click="showComponent('editPass')">忘记密码？</a>
      </div>
    </div>
    </div>
    <components :is="component" v-if="component !== ''" @close="close"></components>
  </div>
</template>

<script>
  import utils from '@/utils'
  import register from './register'
  import editPass from './editPass'
  export default {
    name: 'login',
    components: {
      register,
      editPass
    },
    created() {
      let ua = window.navigator.userAgent.toLowerCase()

      if (ua.indexOf('android') !== -1 || ua.indexOf('iphone') !== -1) {
        this.ua = 'phone'
      } else {
        this.ua = 'ipad'
      }
    },
    mounted() {
      this.$vux.loading.hide()
    },
    methods: {
      close() {
        this.component = ''
      },
      showComponent(n) {
        this.component = n
      },
      back() {
        if (this.from.path === '/mobile/editUser') {
          this.$router.push('/mobile/home/user')
        } else {
          this.$router.go(-1)
        }
      },
      submit() {
        let {
          phone,
          password
        } = this.login
        let {
          post
        } = this.$http

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
          .then(({
            data
          }) => {
            if (!data.status) {
              window.instance.defaults.headers = {
                Authorization: 'Bearer ' + data.data
              }
              this.$http.defaults.headers = {
                Authorization: 'Bearer ' + data.data
              }
              this.getUserInfo(data.data)
              this.$store.dispatch('getTodayTask')
              this.$store.commit('savePhoneNum', phone)
              this.$store.commit('updateToken', data.data)
              utils.cookie.set('student', data.data)
              if (this.from.path === '/mobile/editUser') {
                this.$router.push('/mobile/home/user')
              } else {
                this.$router.go(-1)
              }
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
              alert(res)
            }

            this.$store.commit('updateUserInfo', Object.assign(data.data, {
              mobile: phone,
              password: password,
              token: v
            }))
          }
        })
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.from = from
      })
    },
    data() {
      return {
        from: '',
        login: {
          phone: '',
          password: ''
        },
        uploading: false,
        isTeacher: true,
        ua: '',
        component: ''
      }
    }
  }
</script>

