<template>
  <div class="container">
    <div class="con-head">
      <tab v-model="index">
        <tab-item :selected="tabSelected === item" v-for="(item, index) in tabList" @click="tabSelected = item" :key="index">{{item}}</tab-item>
      </tab>
    </div>
    <div class="loading-wrap" v-if="show">
      <div class="loader"></div>
    </div>
    <div class="con-content" v-else>
      <swiper v-model="index" height="84.5vh" :show-dots="false">
        <swiper-item>
          <div class="no-list task" v-if="!workList.length">
            <img src="/static/image/WorkErr@2x.png">
            <p>暂时没有相关作业</p>
          </div>
          <ul class="mic-list" v-else>
            <workItem :key="index" :item="item" v-for="(item, index) in workList" />
          </ul>
        </swiper-item>
        <swiper-item>
          <div class="no-list task" v-if="!end_workList.length">
            <img src="/static/image/WorkErr@2x.png">
            <p>暂时没有相关作业</p>
          </div>
          <ul class="mic-list" v-else>
            <workItem :end="true" :key="index" :item="item" v-for="(item, index) in end_workList" />
          </ul>
        </swiper-item>
      </swiper>
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

  import workItem from '@/components/student/workItem'

  export default {
    name: 'lesson',
    components: {
      TabItem,
      Tab,
      Swiper,
      SwiperItem,
      workItem
    },
    data() {
      return {
        show: true,
        index: 0,
        tabSelected: '待做作业',
        tabList: ['待做作业', '已完成'],
        workList: [],
        end_workList: []
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
      async getList() {
        let { get } = this.$http

        await get('/v1/student-paper/list', {params: {startTime: this.year_time, isComplete: 0}})
        .then(({data}) => {
          if (!data.status) {
            this.workList = data.data
            this.workList.forEach((e) => {
              e.type = this.getEndTime(e)
            })
          }
        })

        await get('/v1/student-paper/list', {params: {startTime: this.year_time, isComplete: 1}})
        .then(({data}) => {
          if (!data.status) {
            if (!data.status) {
              if (data.data.length) {
                this.workList.forEach((e) => {
                  e.type = this.getEndTime(e)
                })
              }
              this.end_workList = data.data
            }
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

<style scope>
  .vux-tab {
    width: 20%;
  }
</style>
