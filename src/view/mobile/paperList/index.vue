<template>
  <div class="m_home">
    <m-header class="m_header" :fixed="true">
      <p class="absolute">名校真题</p>
    </m-header>
    <m-srcoll class="m_body">
      <div class="user-list content">
        <router-link to="../testPaper?coursePaperId=240">
          <div class="user-list-content">
            <div class="user-list-img">
              <img src="/static/image/mobile/u188.png">
            </div>
            <div class="user-list-text">
              <p class="title">衔接班中级课程第五课衔接班中级课程第五课</p>
              <p>12月8日 23:00 前完成</p>
            </div>
          </div>
        </router-link>
        <router-link to="../testPaper?coursePaperId=240">
          <div class="user-list-content">
            <div class="user-list-img">
              <img src="/static/image/mobile/u188.png">
            </div>
            <div class="user-list-text">
              <p class="title">衔接班中级课程第五课衔接班中级课程第五课</p>
              <p>12月8日 23:00 前完成</p>
            </div>
          </div>
        </router-link>
      </div>
    </m-srcoll>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    }
  }
</script>

