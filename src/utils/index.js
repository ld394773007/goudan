
import { cookie } from 'vux'
let utils = {
  cookie: {
    remove(t) {
      cookie.remove(t, {
        // doamin: 'yingyushu.com',
        path: '/'
      })
    },
    set(t, data) {
      cookie.set(t, data, {
        // domain: 'yingyushu.com',
        path: '/',
        expires: 7
      })
    }
  },
  getDprImg(path) {
    const dpr = window.devicePixelRatio
    const fileName = path.substring(path.lastIndexOf('/'), path.lastIndexOf('.'))
    console.log(path.replace(fileName, fileName + '@2x'))
    if (dpr === 2) {
      return path.replace(fileName, fileName + '@2x')
    } else if (dpr === 3) {
      return path.replace(fileName, fileName + '@3x')
    } else {
      return path.replace(fileName, fileName + '@2x')
    }
  },
  formatTime(t) {
    let hour = Math.floor(t / 60 / 60)
    let minute = Math.floor(t / 60 % 60)
    let second = Math.floor(t % 60)

    let hourText = hour < 10 ? '0' + hour : hour
    let minuteText = minute < 10 ? '0' + minute : minute
    let secondText = second < 10 ? '0' + second : second
    return hourText + ':' + minuteText + ':' + secondText
  },
  formatSeconds(value, bol) {
    let theTime = parseInt(value) // 秒
    let theTime1 = 0 // 分
    let theTime2 = 0 // 小时
    let theTime3 = 0
    let result = ''
    if (theTime > 60) {
      theTime1 = parseInt(theTime / 60)
      theTime = parseInt(theTime % 60)
      if (theTime1 > 60) {
        theTime2 = parseInt(theTime1 / 60)
        theTime1 = parseInt(theTime1 % 60)
        if (theTime2 > 24) {
          theTime3 = parseInt(theTime2 / 24)
          theTime2 = parseInt(theTime2 % 24)
        }
      }
    }

    if (bol) {
      result = '<i>' + parseInt(theTime) + '</i>秒'
      if (theTime1 > 0) {
        result = '<i>' + parseInt(theTime1) + '</i>分' + result
      }
      if (theTime2 > 0) {
        result = '<i>' + parseInt(theTime2) + '</i>时' + result
      }
    } else {
      result = ''
      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + '分' + result
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + '时' + result
      }
      if (theTime3 > 0) {
        result = '' + parseInt(theTime3) + '天' + result
      }
    }
    return result
  }
}

export default utils
