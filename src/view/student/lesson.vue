<template>
  <div class="container">
    <div class="loading-wrap transparent" v-if="addLoading">
      <div class="loader"></div>
    </div>
    <div class="con-head">
      <tab v-model="index">
        <tab-item :selected="tabSelected === item" v-for="(item, index) in tabList" @click="tabSelected = item" :key="index">{{item}}</tab-item>
      </tab>
      <a href="javascript:;" @click="dialogShow = true"><i class="add-icon"></i>加入课程</a>
    </div>
    <div class="loading-wrap" v-if="show">
      <div class="loader"></div>
    </div>
    <div class="con-content" v-else>
      <swiper v-model="index" height="84.5vh" :show-dots="false">
        <swiper-item>
          <div class="no-list task" v-if="!lessonList.length">
            <img src="/static/image/CourseErr@2x.png">
            <p>暂时没有课程</p>
          </div>
          <ul class="mic-list" v-else>
            <lessonItem @changeStatus="changeStatus" :key="index" :item="item" v-for="(item, index) in lessonList" />
          </ul>
        </swiper-item>
        <swiper-item>
          <div class="no-list task" v-if="!end_lessonList.length">
            <img src="/static/image/CourseErr@2x.png">
            <p>暂时没有课程</p>
          </div>
          <ul class="mic-list" v-else>
            <lessonItem :key="index" :item="item" v-for="(item, index) in end_lessonList" />
          </ul>
        </swiper-item>
      </swiper>
    </div>
    <div class="stu-dialog" v-if="dialogShow">
        <div class="mask" @click="dialogShow = false"></div>
        <div class="stu-dialog-wrap">
           <div class="stu-dialog-head">
              <div>
                <p>添加课程</p>
                <span>课程代码由老师提供</span>
              </div>
              <i @click="dialogShow = false"></i>
            </div>
            <div class="stu-dialog-body">
              <div :class="{'err': addLessonErr}">
                <input type="text" ref="addLesson_input" placeholder="请输入课程代码" v-model="codeData" @focus="addLessonErr = false">
                <i></i>
              </div>
              <p v-if="addLessonErr"><i></i>课程代码错误！</p>

            </div>
             <a href="javascript:;" @click="addLesson">确定加入</a>
        </div>
      </div>
  </div>
</template>

<script>
  import {
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    dateFormat
  } from 'vux'

  import lessonItem from '@/components/student/lessonItem'

  export default {
    name: 'lesson',
    components: {
      TabItem,
      Tab,
      Swiper,
      SwiperItem,
      lessonItem
    },
    data() {
      return {
        show: true,
        index: 0,
        tabSelected: '待上课',
        tabList: ['待上课', '已结束'],
        lessonList: [],
        end_lessonList: [],
        dialogShow: false,
        addLessonErr: false,
        codeData: '',
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
        return yearTime
      }
    },
    methods: {
      changeStatus() {
        this.addLoading = !this.addLoading
      },
      async getList() {
        let {
          get
        } = this.$http

        await get('/v1/student-lesson/list?expand=course,teacher,assistant,image,room', {
          params: {
            startTime: this.year_time,
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

        this.show = false
      },
      addLesson() {
        let { post } = this.$http
        post('/v1/student-code/use-code', {code: this.codeData})
        .then(({data}) => {
          if (!data.status) {
            this.getList()
            this.dialogShow = false
            this.$vux.alert.show({
              content: '加入成功！'
            })
          } else {
            this.$vux.alert.show({
              content: data.message
            })
            this.addLessonErr = true
          }
        })
      }
    }
  }
</script>

<style scope>
  .vux-tab {
    width: 20%;
  }
</style>
