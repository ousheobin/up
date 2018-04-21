//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    motto: 'Hello World',
    weekTime: '',
    _num: app.globalData.colorNum,
    upTime: app.globalData.thisTime,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindReturnTap: function () {
    wx.redirectTo({
      url: '../home/home',
    })
  },
  onLoad: function (res) {
    this.setData({
      _num: app.globalData.colorNum
    })
    if (app.globalData.colorNum==1){
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#a4f2e0',
      })
    }
    else if (app.globalData.colorNum==2){
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#f8bdbe',
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.request({
      url: 'https://508cst.gcu.edu.cn/up/wechat/welcome/summary',
      data: {
        userId: wx.getStorageSync('userId'),
        sessionKey: wx.getStorageSync('wxSessionKey')
      },
      success: res => {
        if (res.data.status == "ok" && res.statusCode == 200) {
          this.setData({
            weekTime: res.data.countData.finish
          })
        }
        else {
          if (app.globalData.colorNum == 1) {
            wx.showModal({
              title: '网络传输有问题',
              content: '请检查网络连接或重新打开小程序再次进行操作',
              showCancel: false,
              confirmColor: '#a4f1e4'
            })
          }
          else if (app.globalData.colorNum == 2) {
            wx.showModal({
              title: '网络传输有问题',
              content: '请检查网络连接或重新打开小程序再次进行操作',
              showCancel: false,
              confirmColor: '#f8bdbe'
            })
          }
        }
      },
      fail: function () {
        if (app.globalData.colorNum == 1) {
          wx.showModal({
            title: '网络传输有问题',
            content: '请检查网络连接或重新打开小程序再次进行操作',
            showCancel: false,
            confirmColor: '#a4f1e4'
          })
        }
        else if (app.globalData.colorNum == 2) {
          wx.showModal({
            title: '网络传输有问题',
            content: '请检查网络连接或重新打开小程序再次进行操作',
            showCancel: false,
            confirmColor: '#f8bdbe'
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '一起专注工作，Day day up',
      imageUrl: 'https://508cst.gcu.edu.cn/commons-up/share.jpg'
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
