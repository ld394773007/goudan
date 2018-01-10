<template>
  <div class="paper-result ">
    <mu-appbar class="header-bar home-header">
      <mu-icon-button @click="$router.go(-1)" event="touchstart" icon="keyboard_arrow_left" slot="left" />
      <div class="absolute">
        评测结果
      </div>
    </mu-appbar>
    <div class="paper-result-content paper-list" v-if="resultData != ''">
      <p class="result-title">{{resultData.paper.name}}</p>
      <div class="result-info">
        <div class="info-left">
          <span>{{`共${resultData.paper.total}道题`}}</span>
          <span>作答用时： 4分36秒</span>
        </div>
        <div class="info-right">
          <span>得分：</span>
          <span class="red">{{score}}</span>
        </div>
      </div>
      <div class="paper-list-title">
        <span class="wd">
          未答
        </span>
        <span class="cw">
          错误
        </span>
        <span class="yd">
          正确
        </span>
      </div>
      <div class="user-list result-list">
        <span class="user-list-title">试题</span>
        <ul>
          <li class="paper-item" :key="i" v-for="(e,i) in resultData.result">
            <mu-raised-button :label="`${e.sort}`" :backgroundColor="getStatus(e)"/>
          </li>
        </ul>
      </div>
      <mu-raised-button style="margin-top: 20px;" v-if="!paperId" event="touchstart" @click="encrypted" label="查看详细报告" fullWidth/>
    </div>
    <div style="margin-to: 20px;">
      <result v-if="paperId" :pid="paperId" />
    </div>
  </div>
</template>

<script>
  import result from '@/components/paper/result'
  export default {
    components: {
      result
    },
    data() {
      return {
        id: '',
        paperId: 0,
        resultData: ''
      }
    },
    created() {
      this.id = this.$route.query.id
      this.getPaperResult()
    },
    computed: {
      score() {
        let score = 0

        this.resultData.result.forEach(e => {
          if (e.isRight) {
            score += e.point
          }
        })

        return score
      }
    },
    methods: {
      // 加密结果
      encrypted() {
        let {get} = window.frontend
        this.$vux.loading.show({
          text: '加载中'
        })
        get('/v1/student-result/encrypt', {
          params: {stuPaperId: this.id}
        })
        .then(({data}) => {
          if (!data.status) {
            this.paperId = data.data
          }
        })
      },
      async getPaperResult() {
        let {
          get
        } = this.$http
        let {
          id
        } = this.$route.query

        await get('/v1/student-paper/paper-result', {
          params: {
            stuPaperId: id
          }
        })
          .then(({
            data
          }) => {
            if (!data.status) {
              this.resultData = data.data
            } else {
              this.$vux.alert({
                title: '错误提示',
                content: data.message
              })
            }
          })
        this.$vux.loading.hide()
      },
      // 获取试题作答情况
      getStatus(item) {
        if (item.answer === '') {
          return '#ccc'
        } else if (item.isRight) {
          return '#13ce66'
        } else {
          return '#FF0000'
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.$vux.loading.show({
          text: '加载中'
        })
      })
    }
  }
</script>

