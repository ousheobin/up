//app.js
const Promise = require('/utils/es6-promise.js')

App({

  onShow: function (options) {
    this.loginCheck();
    this.getUserInfo();
  },

  onHide: function () {

  },

  onError: function (msg) {

  },

  login: function () {
    this.globalData.initPromise = new Promise((resolve, reject) => {
      // wx.showLoading({
      //   title: '正在获取数据',
      //   mask: true
      // })
      wx.login({
        success: result => {
          wx.request({
            url: 'https://508cst.gcu.edu.cn/up/wechat/access/get_user_basic_info',
            data: {
              'code': result.code
            },
            success: res => {
              if (res.statusCode == 200 && res.data.status == 'ok') {
                wx.setStorageSync('userId', res.data.userId)
                wx.setStorageSync('wxSessionKey', res.data.wxSessionKey)
                resolve();
              } else {
                wx.showModal({
                  title: '非常抱歉',
                  content: '服务器目前好像有些八阿哥，我们正在修复',
                })
              }
            }
          })
        }
      })
    }).then(this.getUserInfo)
  },

  loginCheck: function () {
    var userId = wx.getStorageSync('userId');
    var sessionKey = wx.getStorageSync('wxSessionKey');
    if (userId == '' || sessionKey == '') {
      this.login();
      this.getUserInfo();
    } else {
      wx.checkSession({
        fail: event => {
          this.login();
        }
      })
    }
  },

  getUserInfo: function () {
    wx.getUserInfo({
      success: res => {
        this.globalData.userInfo = res.userInfo;
        var userId = wx.getStorageSync('userId');
        var sessionKey = wx.getStorageSync('wxSessionKey');
        if (userId != null && sessionKey !=null ){
          wx.request({
            url: 'https://508cst.gcu.edu.cn/up/wechat/access/set_user_infomation',
            data: {
              userId: userId,
              sessionKey: sessionKey,
              nickName: res.userInfo.nickName,
              gender: res.userInfo.gender
            }
          })
        }
      },
      error: res => {
        wx.showModal({
          title: '抱歉，授权出错了',
          content: '非常抱歉哦，我们的授权出现了问题，请您确认是否准许Up获取您的用户信息',
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    recordId:'',
    thisTime:'30',
    initPromise:null,
    colorNum:'1'
  }

})