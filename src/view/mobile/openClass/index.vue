<template>
  <div class="m_home">
    <m-header class="m_header" :fixed="true">
      <p>公开课</p>
    </m-header>
    <m-srcoll class="m_body">
      <div class="content">
        <div class="open-class-num">共有3个课程</div>
        <div class="open-class-list">
          <div :key="i" class="open-class-item" v-for="i in 7">
            <router-link to="../playClass">
              <div class="open-class-img img_center">
                <span class="open-class-message">未开始</span>
                <i class="open-class-play"></i>
                <img v-lazy="'/static/image/mobile/u973.png'" />
              </div>
              <div class="open-class-text">2016全国高考志愿填报指南</div>
            </router-link>
          </div>
        </div>
      </div>
    </m-srcoll>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    mounted() {
      this.$vux.loading.hide()
    }
  }
</script>
