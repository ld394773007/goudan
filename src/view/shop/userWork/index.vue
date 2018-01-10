<template>
  <div class="user-order-wrap" v-if="show">
    <div class="order-tab-wrap">
      <mu-tabs :value="activeTab" class="order-tab" @change="handleTabChange">
        <mu-tab value="tab1" title="待完成" />
        <mu-tab value="tab2" title="已完成" />
      </mu-tabs>
    </div>
    <div v-if="activeTab === 'tab1'" class="tab-content" ref="wrapper1">
      <div class="no-list task" v-if="!workList.length">
        <img src="/static/image/WorkErr@2x.png">
        <p>暂时没有相关作业</p>
      </div>
      <ul class="mic-list" v-else>
        <workItem class="mu-paper-1" :hideIcon="false" :key="index" :item="item" v-for="(item, index) in workList" />
      </ul>
    </div>
    <div v-if="activeTab === 'tab2'" class="tab-content" ref="wrapper2">
      <div class="no-list task" v-if="!end_workList.length">
        <img src="/static/image/WorkErr@2x.png">
        <p>暂时没有相关作业</p>
      </div>
      <ul class="mic-list" v-else>
        <workItem :end="true" class="mu-paper-1" :hideIcon="false" :key="index" :item="item" v-for="(item, index) in end_workList" />
      </ul>
    </div>

    <userList v-if="showList"></userList>
  </div>
</template>

<script>
  import {
    dateFormat
  } from 'vux'
  import utils from '@/utils'
  import userList from '@/components/student/userList'
  import workItem from '@/components/student/workItem'
  export default {
    props: {
      showList: {
        type: Boolean,
        default: true
      }
    },
    components: {
      workItem,
      userList
    },
    data() {
      return {
        activeTab: 'tab1',
        nworkList: [],
        end_workList: [],
        show: false
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
      handleTabChange(v) {
        this.activeTab = v
      },
      // 获取列表
      async getList() {
        let {
          get
        } = this.$http

        await get('/v1/student-paper/list', {
          params: {
            startTime: this.year_time,
            isComplete: 0
          }
        })
          .then(({
            data
          }) => {
            if (!data.status) {
              this.workList = data.data
              this.workList.forEach((e) => {
                e.type = this.getEndTime(e)
              })
            }
          })

        await get('/v1/student-paper/list', {
          params: {
            startTime: this.year_time,
            isComplete: 1
          }
        })
          .then(({
            data
          }) => {
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
