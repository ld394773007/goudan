import Vue from 'vue'
import Vuex from 'vuex'
import {dateFormat} from 'vux'

const store = new Vuex.Store({
  state: {
    userInfo: {},
    lessonList: [],
    phoneNum: '',
    userIsEdit: false,
    token: '',
    showLogin: false,
    editData: {},
    direction: 'forward',
    activeNav: 'home',
    rootCom: ''
  },
  mutations: {
    CHANGE_ROOT_COM(state, payload) {
      state.rootCom = payload
      console.log(payload)
    },
    CHANGE_NAV(state, payload) {
      state.activeNav = payload
    },
    UPDATE_DIRECTION(state, payload) {
      state.direction = payload.direction
    },
    savePhoneNum(state, data) {
      state.phoneNum = data
    },
    updateUserInfo(state, data) {
      state.userInfo = data
    },
    changeUserInfo(state, data) {
      let {key, value} = data
      state.userInfo[key] = value
      state.userIsEdit = true
    },
    changeUserIsEdit(state, t) {
      state.userIsEdit = t
    },
    updateToken(state, data) {
      state.token = data
    },
    changeShowLogin(state) {
      state.showLogin = !state.showLogin
    },
    updateLessonList(state, data) {
      state.lessonList = data
    },
    saveEditData(state, data) {
      state.editData = Object.assign(state.editData, data)
      state.userIsEdit = true
    },
    clearEditData(state) {
      state.editData = {}
    }
  },
  actions: {
    async getTodayTask({commit}) {
      let todayTime = dateFormat(new Date(), 'YYYY-MM-DD') + ' 00:00:00'
      let { get } = Vue.http
      let lessonList = []
      await get('/v1/student-lesson/list?expand=course,teacher,assistant,image,attaches,papers,room,mlesson', {params: {isComplete: 0}})
      .then(({data}) => {
        if (!data.status) {
          data.data.forEach(e => {
            if (e.start_time.split(' ')[0] === todayTime.split(' ')[0]) {
              lessonList.push({type: 'lesson', data: e})
            }
          })
        }
      })

      await get('/v1/student-task/list?expand=course,teacher,assistant,image,attaches,papers,room,mlesson')
      .then(({data}) => {
        if (!data.status) {
          data.data.forEach(e => {
            let startTime = dateFormat(new Date(e.beginTime * 1000), 'YYYY-MM-DD')
            if (startTime === todayTime.split(' ')[0]) {
              lessonList.push({type: 'work', data: e})
            }
          })
        }
      })

      await get('/v1/student-mic-lesson/list?expand=course,teacher,assistant,image,attaches,papers,room,mlesson', {params: {isComplete: 0}})
      .then(({data}) => {
        if (!data.status) {
          data.data.forEach(e => {
            let startTime = dateFormat(new Date(e.start_time * 1000), 'YYYY-MM-DD')
            if (startTime === todayTime.split(' ')[0]) {
              lessonList.push({type: 'mic', data: e})
            }
          })
        }
      })

      commit('updateLessonList', lessonList)
    }
  }
})

export default store
