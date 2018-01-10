<template>
  <li class="mic-item work">
    <div class="mic-img">
      <i class="tag-kh" v-if="hideIcon"></i>
      <img :src="item.course ? (item.course.image_src == '' ? '/static/image/bg.png' : item.course.image_src) : (item.lesson.image_src == '' ? '/static/image/bg.png' : item.lesson.image_src)" alt="">
    </div>
    <div class="mic-info work">
      <div class="mic-info-main">
        <p class="mic-name">{{item.name}}</p>
        <p class="mic-teacher-name">{{item.lesson ? item.lesson.name : item.course.name}}</p>
        <p class="mic-time-mes" v-html="item.endTime ? '请在' + item.type.timeStr + '前完成' : '这个任务不限时间哦'"></p>
      </div>
    </div>
    <div class="mic-footer">
      <router-link v-if="!end" :to="'./testPaper?' + (item.coursePaperId ? 'coursePaperId=' + item.coursePaperId : 'lessonPaperId=' + item.lessonPaperId)" class="y-btn">开始做作业</router-link>
      <a href="javascript:" v-else @touchstart="lookResult" class="y-btn">查看成绩</a>
    </div>
  </li>
</template>

<script>
  export default {
    props: {
      end: {type: Boolean, default: false},
      hideIcon: {type: Boolean, default: true},
      item: {
        type: Object,
        default: () => ({})
      }
    },
    methods: {
      lookResult() {
        this.getPaper({coursePaperId: this.item.coursePaperId, lessonPaperId: this.item.lessonPaperId})
      },
      getPaper(data) {
        let {post} = this.$http
        this.$vux.loading.show({
          text: '加载中'
        })
        post('/v1/student-paper/get-paper', data)
        .then(({data}) => {
          if (!data.status) {
            this.$vux.loading.hide()
            this.$router.push('./paperResult?id=' + data.data)
          }
        })
      }
    }
  }
</script>
