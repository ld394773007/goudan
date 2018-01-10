<template>
  <div>
    <mu-appbar class="header-bar home-header">
      <mu-icon-button @click="$router.go(-1)" event="touchstart" icon="keyboard_arrow_left" slot="left"/>
      <p class="absolute">试题测试</p>
    </mu-appbar>
    <div class="paper-info y-mobile-content height" v-if="isLoad">
      <h2>{{paperInfo.name}}</h2>
      <ul class="paper-info-list">
        <li class="paper-info-item">
          <span>来源：</span><span v-text="paperInfo.from"></span>
        </li>
        <li class="paper-info-item">
          <span>建议用时：</span><span v-text="foramtTime(paperInfo.exam_time)"></span>
        </li>
        <li class="paper-info-item">
          <span>进度：</span><span v-text="paperInfo.complete + '/' + paperInfo.total"></span>
        </li>
      </ul>
      <div class="paper-btn">
        <mu-raised-button event="touchstart" :to="btnInfo.link" :label="btnInfo.text" backgroundColor="#13ce66" fullWidth/>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
export default {
  data() {
    return {
      paperInfo: '',
      stuPaperId: '',
      isLoad: false
    }
  },
  created() {
    let {coursePaperId, lessonPaperId, mLessonPaperId} = this.$route.query
    this.getPaper({coursePaperId, lessonPaperId, mLessonPaperId})
  },
  computed: {
    btnInfo() {
      let {paperInfo, stuPaperId} = this
      let obj = {}
      if (paperInfo.is_finished) {
        obj.link = './paperResult?id=' + this.stuPaperId
        obj.text = '查看结果'
      } else {
        obj.link = './paper?stuPaperId=' + stuPaperId
        if (paperInfo.complete === '0') {
          obj.text = '开始答题'
        } else {
          obj.text = '继续答题'
        }
      }
      return obj
    }
  },
  methods: {
    /*
    * 获取学生试卷id
    *
    *@param [data] {object} {班级id, 课程id, 微课id}
    **/
    getPaper(data) {
      let {post} = this.$http
      post('/v1/student-paper/get-paper', data)
      .then(({data}) => {
        if (!data.status) {
          this.stuPaperId = data.data
          this.getPaperContent(data.data)
        }
      })
    },
    /*
    * 获取试卷封面内容
    *
    *@param [id] {num} 试卷id
    **/
    getPaperContent(id) {
      let {get} = this.$http

      get('/v1/student-paper/paper-info', {
        params: {
          stuPaperId: id
        }
      })
      .then(({data}) => {
        if (!data.status) {
          this.paperInfo = data.data
          this.isLoad = true
          this.$vux.loading.hide()
        }
      })
    },
    /*
    *格式化时间-秒转具体时间
    *
    *@param [s] {num} 需要转化的秒
    **/
    foramtTime(s) {
      return utils.formatSeconds(s)
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.$store.state.token === '' || !vm.$store.state.token) {
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

