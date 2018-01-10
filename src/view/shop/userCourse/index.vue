<template>
  <div class="user-order-wrap user-title" v-if="show">
    <div class="order-tab-wrap">
      <mu-tabs :value="activeTab" class="order-tab" @change="handleTabChange">
        <mu-tab value="tab1" title="待上课程" />
        <mu-tab value="tab2" title="已结束" />
      </mu-tabs>
    </div>
    <div v-if="activeTab === 'tab1'" class="tab-content">
      <div class="no-list task" v-if="!lessonList.length">
        <img src="/static/image/CourseErr@2x.png">
        <p>暂时没有课程</p>
      </div>
      <ul class="mic-list">
        <lessonItem class="mu-paper-1" :hideIcon="false" :key="index" :item="item" v-for="(item, index) in lessonList" />
      </ul>
    </div>
    <div v-if="activeTab === 'tab2'" class="tab-content">
      <div class="no-list task" v-if="!endLessonList.length">
        <img src="/static/image/CourseErr@2x.png">
        <p>暂时没有课程</p>
      </div>
      <ul class="mic-list">
        <lessonItem class="mu-paper-1" :hideIcon="false" :key="index" :item="item" v-for="(item, index) in endLessonList" />
      </ul>
    </div>

    <user-list v-if="showList"></user-list>
  </div>
</template>

<script>
  import {dateFormat} from 'vux'
  import utils from '@/utils'
  import userList from '@/components/student/userList'
  import lessonItem from '@/components/student/lessonItem'
  export default {
    props: {
      showList: {
        type: Boolean,
        default: true
      }
    },
    components: {
      lessonItem,
      userList
    },
    data() {
      return {
        activeTab: 'tab1',
        lessonList: [],
        endLessonList: [],
        show: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleTabChange(v) {
        this.activeTab = v
      },
      // 获取列表
      async getList() {
        let t = new Date().getTime() - (1000 * 60 * 60 * 24 * 30)
        let time = dateFormat(new Date(t), 'YYYY-MM-DD HH:mm:ss')
        let {
          get
        } = this.$http

        await get('/v1/student-lesson/list?expand=course,teacher,assistant,image,room', {
          params: {
            startTime: time,
            pageSize: 100
          }
        })
          .then(({
            data
          }) => {
            if (!data.status) {
              let endLessonList = []
              let lessonList = []

              data.data.forEach((e, i) => {
                let nTime = new Date().getTime()
                let endTime = new Date(e.end_time.replace(/-/ig, '/')).getTime()
                if (nTime > endTime) {
                  endLessonList.push(e)
                } else {
                  lessonList.push(e)
                }
              })

              lessonList.length && (this.lessonList = lessonList)
              endLessonList.length && (this.end_lessonList = endLessonList)
            }
          })

        this.show = true
        this.$emit('isLoad')
      },
      getTime(item) {
        let nowTime = new Date().getTime()
        let startTime = new Date(item.start_time.replace(/-/ig, '/')).getTime()
        let endTime = new Date(item.end_time.replace(/-/ig, '/')).getTime()
        if (endTime < nowTime) {
          return '已结束'
        } else if (startTime > nowTime) {
          let t = item
            .start_time
            .split(' ')
          let t1 = t[0].split('-')
          let t2 = t[1].split(':')
          return {
            icon: 'wks',
            time: t1[1].replace(/^0/, '') + '月' + t1[2].replace(/^0/, '') + '日' + t2[0] + '时' + t2[1] + '分'
          }
        } else {
          return '已开始' + utils.formatSeconds((nowTime - startTime) / 1000)
        }
      }
    }
  }
</script>
