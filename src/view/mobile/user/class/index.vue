<template>
  <div>
    <mu-appbar class="header-bar">
      <mu-icon-button @click="$router.go(-1)" event="touchstart" icon="keyboard_arrow_left" slot="left" />
      <p class="absolute">我的课程</p>
      <mu-icon-button icon="add" @click="addLesson" slot="right"></mu-icon-button>
    </mu-appbar>
    <user-class :showList="false" @isLoad="isLoad"></user-class>
  </div>
</template>

<script>
  import userClass from '@/view/shop/userCourse'
  export default {
    components: {
      userClass
    },
    data() {
      return {}
    },
    methods: {
      isLoad() {
        this.$vux.loading.hide()
      },
      addLesson() {
        let {get} = this.$http

        this.$vux.confirm.show({
          title: '加入班级',
          showInput: true,
          placeholder: '请输入分班码',
          onConfirm: (v) => {
            this.$vux.loading.show({
              text: '提交中'
            })
            get('/v1/student-course/join-course', {
              params: {courseCode: v}
            })
            .then(({data}) => {
              this.$vux.loading.hide()
              if (!data.status) {
                this.$vux.confirm.hide()
                this.$vux.toast.text('加入班级成功')
              } else {
                this.$vux.toast.text(data.message)
              }
            })
            .catch(() => {
              this.$vux.loading.hide()
            })
          }
        })
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
