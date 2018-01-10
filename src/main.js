// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router/index'
import store from './store'
import App from './App'
import Es6Promise from 'es6-promise'
import fastClick from 'fastclick'
import { AjaxPlugin, AlertPlugin, LoadingPlugin, ToastPlugin, ConfirmPlugin, cookie } from 'vux'
import MHeader from '@/components/common/header'
import MSrcoll from '@/components/common/srcoll'
import MuseUI from 'muse-ui'
import utils from '@/utils'
import 'muse-ui/dist/muse-ui.css'
import '@/assets/css/mobile/index.scss'
import '@/assets/css/index.scss'

import VueLazyload from 'vue-lazyload'

Vue.component('MHeader', MHeader)
Vue.component('MSrcoll', MSrcoll)
Vue.use(VueLazyload, {
  loading: '/static/images/mobile/loading.gif'
})
Vue.use(MuseUI)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
Vue.use(AjaxPlugin)
Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
Es6Promise.polyfill()
fastClick.attach(document.body)
// Vue.http.defaults.baseURL = window.location.origin + '/fr_u'
Vue.http.defaults.baseURL = 'https://www.yingyushu.com/fr_u'
// Vue.http.defaults.baseURL = 'http://uc.yys.com'
Vue.config.productionTip = false
window.vue = Vue
window.frontend = Vue.http.create({
  baseURL: 'https://www.yingyushu.com/fr_b'
})

window.instance = Vue.http.create({
  baseURL: 'https://www.yingyushu.com/fr_shop',
  headers: {
    Authorization: 'Bearer ' + cookie.get('student')
  },
  validateStatus: (status) => {
    if (status === 401 || status === 403 || status === 404) {
      let path = window.location.href
      utils.cookie.remove('student')
      if (path.indexOf('shop') !== -1) {
        router.push('/')
      } else {
        store.commit('changeShowLogin')
      }
    } else if (status === 200) {
      return true
    }
  }
})

window.instance.interceptors.response.use((req) => {
  if (req.data.status === 302) {
    window.sessionStorage.setItem('redirectUrl', window.location.href)
    window.location = req.data.data.url
  }
  return req
})

// 与原生应用通讯对象初始化
if (window['_dsbridge&&_dsbridge']) {
  window['_dsbridge&&_dsbridge'].init()
}
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')

Date.prototype.format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1,                 // 月份
    'd+': this.getDate(),                    // 日
    'h+': this.getHours(),                   // 小时
    'm+': this.getMinutes(),                 // 分
    's+': this.getSeconds(),                 // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds()             // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
