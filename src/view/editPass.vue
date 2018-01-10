<template>
  <div class="login">
    <mu-appbar class="header-bar home-header" style="background-color: transparent;border:none">
      <mu-icon-button @click="close" replace event="touchstart" icon="keyboard_arrow_left" slot="left" />
    </mu-appbar>
    <div>
      <h2 class="register-title">设置新密码</h2>
      <mu-text-field hintText="手机号" fullWidth  v-model="formData.mobile" type="number"/>
      <div class="code">
        <mu-text-field hintText="短信验证码"  v-model="formData.captcha" type="text"/>
        <mu-raised-button :label="codeText" :disabled="codeUpload" @click="sendCode" />
      </div>
      <mu-text-field hintText="新密码" fullWidth v-model="formData.new_password" type="password"/>
      <mu-text-field hintText="重复新密码" fullWidth v-model="formData.re_password" type="password"/>
      <div class="btn-wrap-login">
        <a class="y-btn-login loading-btn" :class="{'show': uploading}" href="javascript:;" @click="submit">
          <div class="load-wrap">
            <div class="loader1"></div>
          </div>提交</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'editPass',
    methods: {
      close() {
        this.$emit('close')
      },
      submit() {
        let {mobile, captcha} = this.formData
        let { alert } = this.$vux
        let { post } = this.$http

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
        } else if (this.formData.new_password === '') {
          alert.show({
            content: '请填写密码！'
          })

          return
        } else if (this.formData.new_password.length < 6) {
          alert.show({
            content: '密码不能小于6位！'
          })

          return
        } else if (this.formData.re_password === '') {
          alert.show({
            content: '请重复填写密码！'
          })

          return
        } else if (this.formData.re_password !== this.formData.new_password) {
          alert.show({
            content: '两次密码不相同'
          })

          return
        }

        this.uploading = true

        post('/v1/user/exam-reset-pwd-sms', {mobile, captcha})
        .then(({data}) => {
          if (!data.status) {
            this.resetPass(this.formData.mobile, this.formData.captcha, this.formData.new_password, this.formData.re_password)
          } else {
            alert.show({
              content: data.message
            })
          }
        })
      },
      resetPass(mobile, captcha, newPassword, rePassword) {
        let { put } = this.$http
        let { alert } = this.$vux

        put('/v1/user/reset-pwd', {mobile, captcha, new_password: newPassword, re_password: rePassword})
        .then(({data}) => {
          if (!data.status) {
            alert.show({
              content: '更新密码成功！2秒后返回登录页'
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
      sendCode() {
        let {
          post
        } = this.$http

        if (this.formData.mobile === '') {
          this.$vux.alert.show({
            title: '提示',
            content: '请输入手机号！'
          })
          return
        }
        if (!/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(this.formData.mobile)) {
          this.$vux.alert.show({
            title: '提示',
            content: '请输入正确的手机号！'
          })
          return
        }

        post('/v1/user/send-reset-pwd-sms', {
          mobile: this.formData.mobile
        })
          .then(({
            data
          }) => {
            if (!data.status) {
              this.$vux.alert.show({
                title: '成功',
                content: '短信发送成功！'
              })

              setTimeout(() => {
                this.$vux.alert.hide()
              }, 2000)

              this.codeUpload = true
              this.codeText = 60

              let time = setInterval(() => {
                if (this.codeText === 0) {
                  clearInterval(time)
                  this.codeText = '发送验证码'
                  this.codeUpload = false
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
        uploading: false,
        codeUpload: false,
        codeText: '发送验证码',
        isTeacher: true,
        formData: {
          mobile: '',
          new_password: '',
          re_password: '',
          captcha: ''
        }
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

