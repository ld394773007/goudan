<template>
  <div class="m_wrap">
    <m-header class="m_header">
      <a href="javascript:" class="mod_button" slot="left" @click="save(1)"><x-icon type="ios-arrow-back"></x-icon></a>
      <p class="absolute">我的信息</p>
      <a class="mod_button mod_button_text" href="javascript:" slot="right" @click="save(0)">保存</a>
    </m-header>
    <div class="m_body">
      <group label-width="4.5em" label-margin-right="2em" label-align="left">
        <cell title="头像">
          <div class="avater_item">
            <img :src="info.avater == '' ? '/static/image/mobile/men.png' : info.avater">
            <input class="file-input" type="file" @change="uploadAvater">
          </div>
        </cell>
        <cell title="手机号">
          <p>{{info.mobile}}</p>
        </cell>
        <cell title="用户名" @click.native="changeVisible({title: '用户名', key: 'realname'})" is-link >
          <p>{{info.realname}}</p>
        </cell>
        <cell title="英文名" @click.native="changeVisible({title: '英文名', key: 'en_name'})" is-link >
          <p>{{info.en_name}}</p>
        </cell>
        <popup-picker title="性别" show-name :data="sexList" v-model="sexActive" @on-change="changeSex" placeholder="请选择性别"></popup-picker>
        <popup-picker title="年级" show-name :data="gradeList" v-model="gradeActive" @on-change="changeGrade" placeholder="请选择年级"></popup-picker>
        <cell title="学校" @click.native="changeVisible({title: '学校', key: 'school'})" is-link >
          <p>{{info.school}}</p>
        </cell>

      </group>
      <a href="javascript:" class="mod_button white mt15" @click="signOut">退出登陆</a>
    </div>
    <transition name="bottom-top">
      <editInput v-if="visible" :data="inputData" @save="_save" @close="changeVisible"></editInput>
    </transition>
  </div>
</template>
<script>
  import editInput from '../editInput'
  import {Group, Cell, PopupPicker} from 'vux'
  import utils from '@/utils'
  export default {
    components: {
      Group,
      Cell,
      PopupPicker,
      editInput
    },
    data() {
      return {
        sexList: [
          [
            {
              name: '男',
              value: '1'
            },
            {
              name: '女',
              value: '2'
            }
          ]
        ],
        gradeList: [
          [
            {
              name: '一年级',
              value: '1'
            },
            {
              name: '二年级',
              value: '2'
            },
            {
              name: '三年级',
              value: '3'
            },
            {
              name: '四年级',
              value: '4'
            },
            {
              name: '五年级',
              value: '5'
            },
            {
              name: '六年级',
              value: '6'
            }
          ]
        ],
        sexActive: [],
        gradeActive: [],
        inputData: {title: '', key: ''},
        visible: false,
        edit: false,
        info: Object.assign({}, this.userInfo)
      }
    },
    created() {
      let {editData} = this.$store.state
      this.info = Object.assign({}, this.userInfo, editData)
      if (this.info.sex && this.info.sex !== '') {
        this.sexActive = [String(this.info.sex)]
      }
      if (this.info.grade && this.info.grade !== '') {
        this.gradeActive = [String(this.info.grade)]
      }
    },
    computed: {
      userInfo() {
        return Object.assign({}, this.$store.state.userInfo)
      }
    },
    methods: {
      changeSex(v) {
        this.info.sex = Number(v[0])
        this.edit = true
      },
      changeGrade(v) {
        if (!v[0]) return
        this.info.grade = Number(v[0])
        this.edit = true
      },
      uploadAvater(e) {
        let rex = /(png|jpg|jpeg)/
        let readFile = new FileReader()
        readFile.readAsDataURL(e.target.files[0])
        readFile.onload = () => {
          this.info.avater = readFile.result
          this.imgType = rex.exec(readFile.result.split(',')[0])[0]
          this.$store.commit('changeUserIsEdit', true)
        }
      },
      _save(v) {
        this.info = {...this.info, ...v}
        this.edit = true
      },
      changeVisible(v) {
        let {visible} = this
        if (visible) {
          this.visible = false
        } else {
          this.inputData.title = v.title
          this.inputData.key = v.key
          this.visible = true
        }
      },
      // 修改个人信息并返回
      save(n) {
        let {put, post} = this.$http

        if (this.edit) {
          this.$vux.confirm.show({
            title: '提示',
            content: '是否保存用户数据的修改',
            'confirm-text': '保存',
            onConfirm: (v) => {
              this.$vux.loading.show({
                text: '提交中..'
              })
              put('/v1/member/change-profile', this.info)
              .then(({data}) => {
                this.$store.commit('changeUserIsEdit', false)
                if (!data.status) {
                  this.$store.commit('updateUserInfo', this.info)
                  this.$vux.loading.hide()
                  this.$router.go(-1)
                } else {
                  this.$vux.confirm.hide()
                  this.$vux.alert.show({
                    title: '错误',
                    content: data.message
                  })
                }
              })

              this.imgType && post('/v1/member/upload-avater', {
                imgData: this.info.avater.split(',')[1],
                imgType: this.imgType
              })
              .then(({data}) => {
                if (!data.status) {
                  put('/v1/member/change-avater', {
                    avater_id: data.data.avater_id
                  })
                }
              })
            },
            onCancel: () => {
              n && this.$router.go(-1)
            }
          })
        } else {
          n && this.$router.go(-1)

          !n && this.$vux.alert.show({
            content: '你没有更改信息哦！'
          })
        }
      },
      // 退出登陆
      signOut() {
        let {post} = this.$http

        this.$vux.confirm.show({
          title: '提示',
          content: '是否确认退出？',
          'confirm-text': '确定',
          'cancel-text': '取消',
          onConfirm: () => {
            post('/v1/member/sign-out')
            .then(({data}) => {
              if (!data.status) {
                if (window.dsBridge) {
                  let info = this.$store.state.userInfo
                  let res = window.dsBridge.call('doOutClick', info)
                  res && console.log(res)
                }
                this.signOut = true
                utils.cookie.remove('student')
                this.$router.push('/login')
                this.$store.commit('updateUserInfo', {})
                this.$store.commit('updateToken', false)
              }
            })
          }
        })
      },
      // 关闭sheet
      closeSheet(v) {
        if (!this.isEdit) {
          this.$store.commit('changeUserIsEdit', true)
        }
        this.info[v.titleClass] = v.value
        this[`${v.titleClass}Sheet`] = false
      },
      // 格式化性别
      getSex(v) {
        return Number(v) === 1 ? '男' : '女'
      },
      // 格式化班级
      getGrade(v) {
        switch (Number(v)) {
          case 1:
            return '一年级'
          case 2:
            return '二年级'
          case 3:
            return '三年级'
          case 4:
            return '四年级'
          case 5:
            return '五年级'
          case 6:
            return '六年级'
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      if (from.path === '/login') {
        next('/home')
      }
      next()
    },
    beforeRouteLeave(to, from, next) {
      if (to.path === '/mobile/home/user') {
        this.$store.commit('clearEditData')
      }
      next()
    }
  }
</script>
<style lang="scss">
.avater_item {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
  }
  input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}

.m_body .weui-cells {
  margin-top: 0;
}
</style>
