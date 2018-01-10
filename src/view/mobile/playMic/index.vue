<template>
  <div class="play-mic">
    <mu-appbar class="header-bar home-header" style="background-color: transparent;border:none">
      <mu-icon-button @click="$router.go(-1)" event="touchstart" icon="keyboard_arrow_left" slot="left"/>
    </mu-appbar>
    <div class="video-wrap">
      <video ref="video" :src="src" controls autoplay></video>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        src: '',
        id: 0,
        mic_id: 0,
        pid: 0,
        playing: true,
        complate: 0
      }
    },
    mounted() {
      let video = this.$refs.video
      let time_ = ''
      let { post } = this.$http

      if (localStorage.getItem('' + this.id)) {
        video.currentTime = localStorage.getItem('' + this.id)
      }

      video.onpause = function() {
        clearInterval(time_)
      }

      video.onplaying = () => {
        console.log(this.complate, this.playing)
        if (this.complate === '0') {
          if (this.playing) {
            this.playing = false
            time_ = setInterval(() => {
              localStorage.setItem('' + this.id, video.currentTime)
              video.currentTime && post('/v1/student-mic-lesson/progress', {mic_lesson_id: this.mic_id, study_time: Math.round(video.currentTime)})
            }, 10 * 1000)
          }
        }
      }

      video.onended = () => {
        if (this.complate === '0') {
          clearInterval(time_)
          localStorage.removeItem('' + this.id)
          post('/v1/student-mic-lesson/complete', {mic_lesson_id: this.mic_id})
          if (this.pid === 'null' || !this.pid) {
            this.$vux.confirm.show({
              title: '预习课程已经完成了，是否返回？',
              onConfirm: () => {
                this.$router.go(-1)
              }
            })
          } else {
            this.$vux.confirm.show({
              title: '课程学习完成！ 是否开始完成作业？',
              onConfirm: () => {
                this.$router.push('./testPaper?mLessonPaperId=' + this.pid)
              },
              onCancel: () => {
                this.$router.go(-1)
              }
            })
          }
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.src = to.query.url.replace(/http:/, 'https:')
        vm.pid = to.query.pid
        vm.id = to.query.id
        vm.mic_id = to.query.mic_id
        vm.complate = to.query.complate
      })
    }
  }
</script>

