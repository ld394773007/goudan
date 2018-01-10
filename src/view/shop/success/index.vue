<template>
  <div class="wrap" id="app">
    <div class="details-header">
      <i class="icon-back" @click="goBack()"></i>
      <p>支付结果</p>
    </div>
    <div class="order-wrap">
      <div class="order-content success">
        <div class="success-wrap">
          <img src="/static/image/success.svg">
          <h2>报名成功</h2>
        </div>
        <router-link to="/home/student" class="order-success-btn">查看课程</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scope>
  .order-content.success {
    max-width: 320px;
  }
  .success-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    width: 100%;
    max-width: 320px;
    background: #fff;
  }

  .order-content h2 {
    text-align: center;
    margin-top: 20px;
    font-size: 24px;
  }

  .order-success-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 32px;
    margin: 20px auto;
    border: 1px solid #EDF0F6;
    border-radius: 94px;
    color: #4A90E2;
  }
</style>
