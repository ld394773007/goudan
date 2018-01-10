<template>
  <li class="mic-item">
    <div class="mic-img">
      <img :src=" (!item.image_src || item.image_src == '') ? '/static/image/bg.png' : item.image_src">
    </div>
    <div class="mic-info">
      <div class="mic-teacher-avatar">
        <img :src=" (!item.teacher.avater || item.teacher.avater == '') ? '/static/image/avatar.png' : item.image_src">
      </div>
      <div class="mic-info-main">
        <p class="mic-name" v-text="item.name"></p>
        <p class="mic-teacher-name" v-text="item.teacher.realname">张老师</p>
        <p class="mic-caption" v-text="item.desc"></p>
      </div>
    </div>
    <div class="mic-footer">
      <router-link :to="'./testPaper?mLessonPaperId=' + item.m_lesson_paper_id" class="y-btn" v-if="item.lesson_complete && item.m_lesson_paper_id && !item.paper_complete">开始做作业</router-link>
      <router-link :to="'./playMic?id=' + item.media_id + '&url=' + item.media_src + '&mic_id=' + item.id + '&pid=' + item.m_lesson_paper_id + '&complate=' + ((item.lesson_complete && item.paper_complete) ? 1 : 0)" class="y-btn" v-else>{{item.lesson_complete ? '继续学习' : '开始学习'}}</router-link>
    </div>
  </li>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        default: () => ({})
      }
    }
  }
</script>
