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
          <div class="no-list task" v-if="!micList.length">
            <img src="/static/image/VideoErr@2x.png">
            <p>没有待学习的微课呢</p>
          </div>
          <ul class="mic-list" v-else>
            <micItem :key="index" :item="item" v-for="(item, index) in micList" />
          </ul>
        </swiper-item>
        <swiper-item>
          <div class="no-list task" v-if="!end_micList.length">
            <img src="/static/image/VideoErr@2x.png">
            <p>没有待学习的微课呢</p>
          </div>
          <ul class="mic-list" v-else>
            <micItem :key="index" :item="item" v-for="(item, index) in end_micList" />
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

  import micItem from '@/components/student/micItem'

  export default {
    name: 'lesson',
    components: {
      TabItem,
      Tab,
      Swiper,
      SwiperItem,
      micItem
    },
    data() {
      return {
        show: true,
        index: 0,
        tabSelected: '待做作业',
        tabList: ['待完成', '已完成'],
        micList: [],
        end_micList: []
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

        await get('/v1/student-mic-lesson/list', {params: {startTime: this.year_time, isComplete: 0}})
        .then(({data}) => {
          if (!data.status) {
            this.micList = data.data
          }
        })

        await get('/v1/student-mic-lesson/list', {params: {startTime: this.year_time, isComplete: 1}})
        .then(({data}) => {
          if (!data.status) {
            this.end_micList = data.data
          }
        })

        this.show = false
      }
    }
  }
</script>

<style scope>
  .vux-tab {
    width: 20%;
  }
</style>
