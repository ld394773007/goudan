<template>
  <div>
    <mu-appbar class="header-bar">
      <mu-icon-button @click="$router.go(-1)" event="touchstart" icon="keyboard_arrow_left" slot="left" />
      <p class="absolute">我的预习课</p>
    </mu-appbar>
    <div class="user-order-wrap" v-if="show">
      <div class="order-tab-wrap">
        <mu-tabs :value="activeTab" class="order-tab" @change="handleTabChange">
          <mu-tab value="tab1" title="待完成" />
          <mu-tab value="tab2" title="已完成" />
        </mu-tabs>
      </div>
      <div v-if="activeTab === 'tab1'" class="tab-content">
        <div class="no-list task" v-if="!micList.length">
          <img src="/static/image/VideoErr@2x.png">
          <p>没有待学习的微课呢</p>
        </div>
        <ul class="mic-list" v-else>
          <micItem class="mu-paper-1" :key="index" :item="item" v-for="(item, index) in micList" />
        </ul>
      </div>
      <div v-if="activeTab === 'tab2'" class="tab-content">
        <div class="no-list task" v-if="!end_micList.length">
          <img src="/static/image/VideoErr@2x.png">
          <p>没有已完成的微课呢</p>
        </div>
        <ul class="mic-list" v-else>
          <micItem class="mu-paper-1" :key="index" :item="item" v-for="(item, index) in end_micList" />
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
  import {dateFormat} from 'vux'
  import micItem from '@/components/student/micItem'
  export default {
    components: {
      micItem
    },
    data() {
      return {
        show: false,
        index: 0,
        tabSelected: '待做作业',
        tabList: ['待完成', '已完成'],
        micList: [],
        end_micList: [],
        activeTab: 'tab1'
      }
    },
    created() {
      this.getList()
    },
    computed: {
      year_time() {
        let nTime = new Date().getTime()
        let yearTime = dateFormat(new Date(nTime - (4 * 24 * 60 * 60 * 1000)), 'YYYY-MM-DD HH:mm:ss')
        return yearTime
      }
    },
    methods: {
      async getList() {
        let {
          get
        } = this.$http

        await get('/v1/student-mic-lesson/list', {
          params: {
            startTime: this.year_time,
            isComplete: 0
          }
        })
          .then(({
            data
          }) => {
            if (!data.status) {
              this.micList = data.data
            }
          })

        await get('/v1/student-mic-lesson/list', {
          params: {
            startTime: this.year_time,
            isComplete: 1
          }
        })
          .then(({
            data
          }) => {
            if (!data.status) {
              this.end_micList = data.data
            }
          })

        this.show = true
        this.$vux.loading.hide()
      },
      handleTabChange(v) {
        this.activeTab = v
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
