<template>
  <div class="m_wrap">
    <mu-appbar class="header-bar">
      <mu-icon-button @click="$router.go(-1)" event="touchstart" icon="keyboard_arrow_left" slot="left"/>
      <p class="absolute">修改密码</p>
    </mu-appbar>
    <group class="mt10" label-width="4.5em" label-margin-right="1em" label-align="right">
      <x-input type="password" title="原密码" required v-model="oldPassword" placeholder="请填写原密码"></x-input>
      <x-input type="password" title="新密码" required v-model="newPassword" placeholder="请填写新密码"></x-input>
      <x-input type="password" title="重复密码" required v-model="rePassword" placeholder="请填重复新密码"></x-input>
    </group>
    <mu-flat-button class="full-btn mt15" event="touchstart" label="确认修改" @click="editPassword" secondary/>
  </div>
</template>
<script>
import {Group, XInput} from 'vux'
export default {
  components: {
    Group,
    XInput
  },
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      rePassword: ''
    }
  },
  methods: {
    editPassword() {
      let {put} = this.$http
      let {oldPassword, newPassword, rePassword} = this
      if (oldPassword !== '' && newPassword !== '' && rePassword === newPassword) {
        this.$vux.loading.show({
          text: '提交中'
        })
        put('/v1/member/change-pwd', {old_password: oldPassword, new_password: newPassword, re_password: rePassword})
        .then(({data}) => {
          this.$vux.loading.hide()
          if (!data.staus) {
            this.$vux.toast.show({
              type: 'text',
              text: '更新成功'
            })
          } else {
            this.$vux.alert.show({
              title: '更新失败',
              content: data.message
            })
          }
        })
      } else if (oldPassword === '') {
        this.$vux.toast.text('请填写旧密码')
      } else if (newPassword === '') {
        this.$vux.toast.text('请填写新密码')
      } else if (rePassword !== newPassword) {
        this.$vux.toast.text('两次密码输入内容不同')
      }
    }
  }
}
</script>

