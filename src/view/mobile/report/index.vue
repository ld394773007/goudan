<template>
  <div>
    <mu-appbar class="header-bar home-header">
      <mu-icon-button @click="$router.go(-1)" event="touchstart" icon="keyboard_arrow_left" slot="left" />
      <p class="absolute">我的成绩</p>
    </mu-appbar>
    <div class="user-list y-mobile-content height" >
      <div class="user-list-content" :key="i" v-for="(e,i) in reportList">
        <div class="user-list-img">
          <img src="/static/image/mobile/u188.png">
        </div>
        <div class="user-list-text">
          <p class="title">{{e.name}}</p>
          <a href="javascript:" @touchstart="lookResult(e)" class="y-btn">点击查看成绩</a>
        </div>

      </div>
      <div style="background: #fff;" class="no-list task height"><img src="/static/image/WorkErr@2x.png"> <p>暂时没有可查看的成绩</p></div>
    </div>
  </div>
</template>

<script>
  import {dateFormat} from 'vux'
  export default {
    data() {
      return {
        reportList: []
      }
    },
    created() {
      this.getReportList()
    },
    computed: {
      year_time() {
        let nTime = new Date().getTime()
        let yearTime = dateFormat(new Date(nTime - (30 * 24 * 60 * 60 * 1000)), 'YYYY-MM-DD HH:mm:ss')
        return yearTime
      }
    },
    methods: {
      async getReportList() {
        let {get} = this.$http
        await get('/v1/student-paper/list', {params: {
          isComplete: 1,
          startTime: this.year_time
        }})
        .then(({data}) => {
          if (!data.status) {
            if (!data.status) {
              this.reportList = data.data
              this.$vux.loading.hide()
            }
          }
        })
      },
      lookResult(item) {
        this.getPaper({coursePaperId: item.coursePaperId, lessonPaperId: item.lessonPaperId})
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
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (!vm.$store.state.token) {
          next(from.path)
        } else {
          vm.$vux.loading.show({
            text: '加载中'
          })
        }
      })
    }
  }
</script>

