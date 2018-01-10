<template>
  <div class="container">
    <div class="loading-wrap transparent" v-if="addLoading">
      <div class="loader"></div>
    </div>
    <div class="con-head home">
      <h2>我的任务</h2>
    </div>
    <div class="no-list task" v-if="!lessonList.length && !workList.length && !micList.length">
      <img src="/static/image/TaskErr@2x.png">
      <p>没有要做的任务啦</p>
    </div>
    <div class="loading-wrap" v-if="show">
      <div class="loader"></div>
    </div>
    <div class="con-content" v-else>
      <ul class="mic-list">
        <lessonItem @changeStatus="changeStatus" :key="index" :index="index" :item="item" v-for="(item, index) in lessonList" />
        <workItem :key="index" :item="item" v-for="(item, index) in workList"></workItem>
        <micItem :key="index" :item="item" v-for="(item, index) in micList"></micItem>
      </ul>
    </div>

  </div>
</template>

<script>
  import { dateFormat } from 'vux'
  import lessonItem from '@/components/student/lessonItem'
  import micItem from '@/components/student/micItem'
  import workItem from '@/components/student/workItem'

  export default {
    components: {
      lessonItem,
      micItem,
      workItem
    },
    data() {
      return {
        show: true,
        lessonList: [],
        workList: [],
        micList: [],
        addLoading: false
      }
    },
    created() {
      this.getList()
    },
    computed: {
      year_time() {
        let nTime = new Date().getTime()
        let yearTime = dateFormat(new Date(nTime - (30 * 24 * 60 * 60 * 1000)), 'YYYY-MM-DD HH:mm:ss')
        console.log(yearTime)
        return yearTime
      }
    },
    methods: {
      changeStatus() {
        this.addLoading = !this.addLoading
      },
      // 获取所有的列表
      async getList() {
        let {
          get
        } = this.$http

        await get('/v1/student-mic-lesson/list', {params: {startTime: this.year_time, isComplete: 0}})
          .then(({
            data
          }) => {
            if (!data.status) {
              this.micList = data.data
            }
          })

        await get('/v1/student-paper/list', {params: {startTime: this.year_time, isComplete: 0}})
          .then(({
            data
          }) => {
            if (!data.status) {
              if (data.data.length) {
                this.workList = data.data
                this.workList.forEach((e) => {
                  e.type = this.getEndTime(e)
                })
              }
              this.workList = data.data
            }
          })

        await get('/v1/student-lesson/list?expand=course,teacher,assistant,image,room', {params: {startTime: this.year_time}})
          .then(({
            data
          }) => {
            if (!data.status) {
              let lessonList = []

              data.data.forEach((e, i) => {
                let nTime = new Date().getTime()
                let endTime = new Date(e.end_time.replace(/-/ig, '/')).getTime()
                if (nTime < endTime) {
                  lessonList.push(e)
                }
              })

              lessonList.length && (this.lessonList = lessonList)
            }
          })

        this.show = false
      },
      getEndTime(item) {
        var endTime = item.endTime * 1000
        if (item.endTime) {
          var endTime1 = new Date(endTime).format('MM-dd hh:mm')
          var s = endTime1.split(' ')
          var s_ = s[0].split('-')
          var timeStr = '<i>' + s_[0].replace(/^0/, '') + '</i>月' + '<i>' + s_[1].replace(/^0/, '') + '</i>日' + '<i>' + s[1] + '</i>'
        }

        /**
        * type  1: 进行中 2：完成 3：结束 4：失败
        */
        switch (item.taskStatus) {
          case 0:
            if (this.serverTime > endTime && endTime !== 0) {
              return {
                type: 3,
                timeStr: timeStr
              }
            } else {
              return {
                type: 1,
                timeStr: timeStr
              }
            }
          case 1:
            if (this.serverTime > endTime && endTime !== 0) {
              return {
                type: 4,
                timeStr: timeStr
              }
            } else {
              return {
                type: 1,
                timeStr: timeStr
              }
            }
          case 2:
            return {
              type: 2,
              timeStr: timeStr
            }
        }
      }
    }
  }
</script>
