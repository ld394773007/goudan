<template>
  <li class="mic-item" @click="addLesson(item)">
    <div class="mic-img">
      <i v-if="hideIcon"></i>
      <img :src=" item.image_src == '' ? '/static/image/bg.png' : item.image_src">
    </div>
    <div class="mic-info">
      <div class="mic-teacher-avatar">
        <img src="/static/image/avatar.png">
      </div>
      <div class="mic-info-main">
        <p class="mic-name" v-text="item.name"></p>
        <p class="mic-teacher-name" v-text="item.teacher.realname">张老师</p>
        <p class="mic-caption" v-text="item.description"></p>
      </div>
    </div>
    <div class="mic-footer">
      <div :class="'mic-time ' + getTime(item).icon">
        <i></i>
        <p v-text="'第' + (index + 1) + '课，' + getTime(item).time"></p>
      </div>
    </div>
  </li>
</template>

<script>
  import utils from '@/utils'

  export default {
    props: {
      hideIcon: {type: Boolean, default: true},
      item: {
        type: Object,
        default: () => ({})
      },
      showDialog: {
        type: Function,
        default: () => ({})
      },
      isLesson: {
        type: Boolean,
        default: false
      },
      index: {
        type: Number,
        default: 0
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.userInfo
      }
    },
    methods: {
      addLesson(item) {
        /* global WebViewJavascriptBridge */
        let nowTime = new Date().getTime()
        let endTime = new Date(item.end_time.replace(/-/ig, '/')).getTime()
        let startTime = new Date(item.start_time.replace(/-/ig, '/')).getTime()
        if (endTime < nowTime) {
          this.$vux.alert.show({
            content: '课程已结束'
          })
        } else if (startTime > nowTime) {
          this.$vux.alert.show({
            content: '课程未开始'
          })
        } else {
          this.$emit('changeStatus')
          var data = JSON.parse(JSON.stringify(item))
          if (window.dsBridge) {
            let res = window.dsBridge.call('doCaseClick', data)
            res && this.$emit('changeStatus')
          }
          // if (window.WebViewJavascriptBridge) {
          //   WebViewJavascriptBridge.callHandler('doCaseClick', data, (req) => {
          //     this.$emit('changeStatus')
          //   })
          // }
        }
      },
      getTime(item) {
        let nowTime = new Date().getTime()
        let startTime = new Date(item.start_time.replace(/-/ig, '/')).getTime()
        let endTime = new Date(item.end_time.replace(/-/ig, '/')).getTime()
        if (endTime < nowTime) {
          return {icon: 'bf', time: '已结束'}
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
          return {
            icon: 'yks',
            time: '已开始' + utils.formatSeconds((nowTime - startTime) / 1000)
          }
        }
      }
    }
  }
</script>
