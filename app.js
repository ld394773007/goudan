//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  }, 
  getUserInfo (cb) {
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登陆接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success:(res) => {
              this.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(this.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    g_isPlayingMusic: false,
    g_currentMusicPostId: null,
    movieBase: "https://api.adline.com.cn",
    musicBase: "https://api.huxiaowen.vip",
    QQMusicBase: "https://c.y.qq.com",
    doubanBase: "https://douban.uieee.com"
  }
})