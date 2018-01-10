<template>
  <div class="y-mobile-wrap">
    <m-header class="m_header" :fixed="true">
      <p>名师直播</p>
    </m-header>
    <m-srcoll class="m_body">
       <div class="content">
         <div class="gn-list content-block gn-list-flex">
          <div :key="i" class="gn-list-item" v-for="(item,i) in navList">
            <router-link :to="item.link">
              <div class="gn-list-icon">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="item.icon"></use>
                </svg>
              </div>
              <p class="gn-list-title">{{item.title}}</p>
            </router-link>
          </div>
        </div>
        <div class="live-list">
            <div class="live-list-head">
              <p>今日任务（{{lessonList.length}}）</p>
            </div>
            <div v-if="!lessonList.length" style="padding: 20px 0;text-align:center;">今天暂无任务</div>
            <div class="user-list" v-if="hasList.mic">
              <span class="user-list-title">预 习 课</span>
              <router-link :to="'/playMic?id=' + e.media_id + '&url=' + e.media_src + '&mic_id=' + e.id + '&pid=' + e.m_lesson_paper_id + '&complate=' + ((e.lesson_complete && e.paper_complete) ? 1 : 0)" class="user-list-content" v-if="e.type === 'mic'" :key="i" v-for="(e,i) in lessonList">
                  <div class="user-list-img">
                    <img :src="(e.data.image_src && e.data.image_src != '') ? e.data.image_src : '/static/image/mobile/u188.png'">
                  </div>
                  <div class="user-list-text">
                    <p class="title">{{e.data.name}}</p>
                    <div class="teacher" v-if="e.data.teacher">
                      <img :src="e.data.teacher && (e.data.avater ? e.data.avater : '/static/image/mobile/u287.png')" class="avater">
                      <span>{{e.data.teacher && e.data.teacher.realname}}</span>
                    </div>
                    <p>{{formatTime(e.data.end_time) + ' 前完成'}} </p>
                  </div>
              </router-link>
            </div>
            <div class="user-list" v-if="hasList.lesson">
              <span class="user-list-title blue">课 程</span>
              <div class="user-list-content" v-if="e.type === 'lesson'" :key="i" v-for="(e,i) in lessonList">
                <div class="user-list-img">
                  <img :src="(e.data.image_src && e.data.image_src != '') ? e.data.image_src : '/static/image/mobile/u188.png'">
                </div>
                <div class="user-list-text">
                  <p class="title">{{e.data.name}}</p>
                  <div class="teacher">
                    <img :src="e.data.teacher && (e.data.avater ? e.data.avater : '/static/image/mobile/u287.png')" class="avater">
                    <span>{{e.data.teacher && e.data.teacher.realname}}</span>
                  </div>
                  <p>{{formatTime(e.data.end_time, 1) + ' 前完成'}}</p>
                </div>
              </div>
            </div>
            <div class="user-list" v-if="hasList.work">
              <span class="user-list-title pink">作 业</span>
              <div class="user-list-content" v-if="e.type === 'work'" :key="i" v-for="(e,i) in lessonList">
                <div class="user-list-img">
                  <img src="/static/image/mobile/u188.png">
                </div>
                <div class="user-list-text">
                  <p class="title">{{e.data.name}}</p>
                  <p>{{formatTime(e.data.endTime) + !e.data.endTime ? '' : ' 前完成'}}</p>
                </div>
              </div>
            </div>
          </div>
       </div>
    </m-srcoll>
  </div>
</template>
<script>
  import {dateFormat} from 'vux'
  export default {
    data() {
      return {
        downTrigger: null,                                                    // 下拉刷新出发容器元素
        downRefreshing: false,
        navList: [
          {
            title: '我的课程',
            icon: '#icon-computer-1',
            link: '../userClass'
          },
          {
            title: '我的作业',
            icon: '#icon-file-1',
            link: '../userWork'
          },
          {
            title: '我要预习',
            icon: '#icon-screen',
            link: '../userMic'
          }
        ]
      }
    },
    computed: {
      lessonList() {
        return this.$store.state.lessonList
      },
      token() {
        return this.$store.state.token
      },
      startTime() {
        return dateFormat(new Date(), 'YYYY-MM-DD') + ' 00:00:00'
      },
      endTime() {
        return dateFormat(new Date(), 'YYYY-MM-DD') + ' 24:00:00'
      },
      hasList() {
        let obj = {}
        this.lessonList.forEach(e => {
          if (e.type === 'mic') {
            obj.mic = 1
          } else if (e.type === 'lesson') {
            obj.lesson = 1
          } else if (e.type === 'work') {
            obj.work = 1
          }
        })

        return obj
      }
    },
    methods: {
      // 下拉刷新事件
      downRefresh() {
        this.downRefreshing = true
      },
      formatTime(t, n) {
        if (n) {
          return dateFormat(new Date(t.replace(/-/g, '/')), 'MM-DD HH:mm')
        }
        return dateFormat(t * 1000, 'MM-DD HH:mm')
      }
    }
  }
</script>
