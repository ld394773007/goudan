<template>
  <div class="live-play">
    <mu-appbar class="header-bar">
      <mu-icon-button @click="$router.go(-1)" event="touchstart" icon="keyboard_arrow_left" slot="left"/>
      <p class="absolute">公开课</p>
    </mu-appbar>
    <div class="live-video" >
      <video  ref="video" x5-playsinline webkit-playsinline playsinline autoplay controls src="https://www.nio.com/prod/s3fs-public/videos/background/home-es8.mp4" ></video>
    </div>
    <div class="live-play-list">
      <p class="title">课程目录</p>
      <mu-list>
        <mu-list-item title="第一课 hello world"></mu-list-item>
        <mu-list-item title="第一课 hello world"></mu-list-item>
        <mu-list-item title="第一课 hello world"></mu-list-item>
      </mu-list>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showBar: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.video.oncanplay = () => {

      }
    })
  },
  methods: {

  }
}
</script>

