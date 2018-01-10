<template>
  <div class="st-wrap">
    <mu-appbar class="header-bar home-header" style="background-color: transparent;border:none">
      <mu-icon-button @click="$router.go(-1)" icon="keyboard_arrow_left" slot="left"/>
    </mu-appbar>
    <div class="st-banner">
      <img src="/static/image/mobile/st_bg.png">
    </div>
    <div class="st-content">
      <h2 class="st-title">学霸从试听开始</h2>
      <div class="st-from" id="st-from">
        <mu-text-field hintText="请输入学生姓名" v-model="fromData.realname"/>
        <mu-text-field hintText="请输入手机号" v-model="fromData.mobile" />
        <mu-raised-button event="touchstart" @click="submit" label="免费预约试听" fullWidth/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fromData: {
        mobile: '',
        realname: ''
      }
    }
  },
  methods: {
    submit() {
      let {mobile, realname} = this.fromData
      let {post} = window.frontend

      if (realname === '') {
        this.$vux.toast.text('请填写姓名！')
        return
      }
      if (mobile === '') {
        this.$vux.toast.text('请填写手机号！')
        return
      }

      post('/v1/business/checkin', {mobile, realname})
      .then(({data}) => {
        if (!data.status) {
          this.$vux.alert.show({
            content: '提交成功！我们会尽快安排老师与你联系，为你安排课程。'
          })
        } else {
          this.$vux.alert.show({
            title: '错误提示',
            content: '提交成功！我们会尽快安排老师与你联系，为你安排课程。'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .st-wrap {
    height: 100vh;
    background-color: rgba(60, 68, 86, 1);
  }
  .st-banner > img{
    width: 100%;
  }
  .st-title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    font-size: 26px;
    color: #fff;
    background-color: #ffad85;
  }
  .st-content {
    width: 90vw;
    height: 90vw;
    margin: 30px auto;
    background-color: #fff;
    .st-from {
      padding: 20px;

      .mu-text-field {
        width: 100%;
        margin-bottom: 10px;
      }
      .mu-raised-button {
        margin-top: 20px;
        background-color: #ff855c;
        color: #fff;
      }
    }
  }
</style>
