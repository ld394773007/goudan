<template>
  <div class="login">
    <mu-appbar class="header-bar home-header" style="background-color: transparent;border:none">
      <mu-icon-button @click="close" event="touchstart" icon="keyboard_arrow_left" slot="left" />
    </mu-appbar>
    <div>
      <h2 class="register-title">新用户注册</h2>
      <mu-text-field hintText="手机号" type="number" fullWidth v-model="formData.mobile" />
      <div class="code">
        <mu-text-field hintText="验证码" type="text" v-model="formData.captcha" />
        <mu-raised-button :label="codeText" :disabled="codeDisabled" @click="sendCode" />
      </div>
      <mu-text-field hintText="密码" fullWidth type="password" v-model="formData.password" />
      <mu-text-field hintText="重复密码" fullWidth type="password" v-model="formData.repassword" />
      <mu-text-field hintText="姓名" fullWidth type="text" v-model="formData.realname" />
      <mu-text-field hintText="学校" fullWidth type="text" v-model="formData.school" />
      <div class="input-item radio">
        <div class="input-content">
          <label for="boy">
              <input type="radio" name="sex" v-model="formData.sex" id="boy" :value="1">

              <i></i>
              <span>男</span>
            </label>
          <label for="girl">
              <input type="radio" name="sex" v-model="formData.sex" id="girl" :value="0">

              <i></i>
              <span>女</span>
            </label>
        </div>
      </div>
      <div class="btn-wrap-login">
        <a class="y-btn-login loading-btn " :class="{'show': uploading}" href="javascript:;" @touchstart="submit">
          <div class="load-wrap">
            <div class="loader1"></div>
          </div>注册</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Alert
  } from 'vux'

  export default {
    name: 'register',
    components: {
      Alert
    },
    methods: {
      close() {
        this.$emit('close')
      },
      submit() {
        let { post } = this.$http
        let { alert } = this.$vux
        let { mobile, password, repassword, captcha, realname, school } = this.formData
        if (mobile === '') {
          alert.show({
            content: '请填写手机号！'
          })
          return
        } else if (captcha === '') {
          alert.show({
            content: '请填写短信验证码！'
          })
          return
        } else if (password === '') {
          alert.show({
            content: '请填写密码！'
          })
          return
        } else if (password.length < 6) {
          alert.show({
            content: '密码不能小于6位！'
          })
          return
        } else if (repassword === '') {
          alert.show({
            content: '请重复填写密码！'
          })
          return
        } else if (repassword !== password) {
          alert.show({
            content: '两次密码不相同'
          })
          return
        } else if (realname === '') {
          alert.show({
            content: '请填写姓名！'
          })
          return
        } else if (school === '') {
          alert.show({
            content: '请填写学校！'
          })
          return
        }

        this.uploading = true

        post('/v1/user/one-step-signup', {...this.formData})
        .then(({data}) => {
          if (!data.status) {
            alert.show({
              content: '注册成功！2秒后跳转登录页'
            })

            setTimeout(() => {
              alert.hide()
              this.close()
            }, 2000)
          } else {
            alert.show({
              content: data.message
            })
          }

          this.uploading = false
        })
      },
      // 发送验证码
      sendCode() {
        let {
          post
        } = this.$http

        if (this.formData.mobile === '') {
          this.$vux.alert.show({
            title: '提示',
            content: '请输入正确的手机号！'
          })
          return
        }

        post('/v1/user/send-signup-sms', {
          mobile: this.formData.mobile
        })
          .then(({
            data
          }) => {
            if (!data.status) {
              this.$vux.alert.show({
                title: '成功',
                content: '发送验证码成功！'
              })

              setTimeout(() => {
                this.$vux.alert.hide()
              })

              this.codeDisabled = true
              this.codeText = 60

              let time = setInterval(() => {
                if (this.codeText === 0) {
                  clearInterval(time)
                  this.codeText = '发送验证码'
                  this.codeDisabled = false
                } else {
                  this.codeText -= 1
                }
              }, 1000)
            } else {
              this.$vux.alert.show({
                title: '失败',
                content: data.message
              })
            }
          })
      }
    },
    data() {
      return {
        formData: {
          mobile: '',
          password: '',
          repassword: '',
          captcha: '',
          accountType: 'parent',
          realname: '',
          sex: 0
        },
        uploading: false,
        codeDisabled: false,
        codeText: '发送验证码'
      }
    }
  }
</script>
<style scoped>
.code {
  display: flex;
}
.code button {
  margin-left: 10px;
  color: #13ce66;
}
</style>
