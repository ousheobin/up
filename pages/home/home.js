//home.js
const app = getApp()
var date = require('date.js');
var defaultEvent='';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    message:'',
    message2:'',
    focusTime:'',
    num:'',
    thing:'',
    summaryErrorTimes: 0,
    _num: app.globalData.colorNum
  },
  //输入想做的事情
  thingInput:function(e){
    this.setData({
      thing: e.detail.value
    })
  },
  //input聚焦
  thingFocus:function(){
    if(this.data.message!=''){
      this.setData({
        message:''
      })
    }
  },
  //input失焦
  thingBlur:function(e){
    if(this.data.thing==''){
      this.setData({
        message: this.data.message2
      })
    }
  },
  //查看本周概况
  weekSummary:function(){
    wx.navigateTo({
      url: '../up/up'
    })
  },

  //开始计时
  startUp:function(){
    var time = date.formatTime(new Date());
    if(this.data.thing==''){
      this.setData({
        thing:defaultEvent
      })
    }
    wx.request({
      url: 'https://508cst.gcu.edu.cn/up/wechat/records/add_record',
      data:{
        userId: wx.getStorageSync('userId'),
        sessionKey: wx.getStorageSync('wxSessionKey'),
        beginTime:time,
        content:this.data.thing,
        minutes: app.globalData.thisTime
      },
      success: res=> {
        if (res.statusCode == 200 && res.data.status == "ok") {
          app.globalData.recordId = res.data.recordId;
          wx.redirectTo({
            url: '../time/time',
          })
        }else {
          if (app.globalData.colorNum==1){
            wx.showModal({
              title: '网络传输有问题',
              content: '请检查网络连接或重新打开小程序再次进行操作',
              showCancel: false,
              confirmColor: '#a4f1e4'
            })
          }
          else if (app.globalData.colorNum==2){
            wx.showModal({
              title: '网络传输有问题',
              content: '请检查网络连接或重新打开小程序再次进行操作',
              showCancel: false,
              confirmColor: '#f8bdbe'
            })
          }
        }
      },
      fail:function(){
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

  blueClick: function (data) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#a4f2e0',
    })
    app.globalData.colorNum = '1'
    this.setData({
      _num: app.globalData.colorNum
    })
  },
  pinkClick: function (data) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#f8bdbe',
    })
    app.globalData.colorNum = '2'
    this.setData({
      _num: app.globalData.colorNum
    })
   
  },


  /**
   * 生命周期函数--监听页面加载
   */
 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.setData({
      _num: app.globalData.colorNum
    })
    if (app.globalData.colorNum == 1) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#a4f2e0',
      })
    }
    else if (app.globalData.colorNum == 2) {
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

    if (app.globalData.initPromise == null ){
      this.initInfo();
    }else{
      app.globalData.initPromise.then(this.initInfo);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  initInfo: function(){
    wx.showLoading({
      title: '正在获取数据',
      mask:true
    })
    wx.request({
      url: 'https://508cst.gcu.edu.cn/up/wechat/welcome/summary',
      data: {
        userId: wx.getStorageSync('userId'),
        sessionKey: wx.getStorageSync('wxSessionKey')
      },
      header: {
        'content-type': 'application/json'
      },
      success: res=>{
        if (res.statusCode == 200 && res.data.status == "ok") {
          defaultEvent = res.data.hints;
          this.setData({
            message: res.data.hints,
            message2: res.data.hints,
            focusTime: res.data.countData.finish,
            num: res.data.countData.finishTime
          })
          wx.hideLoading();
        }
        else {
          if (this.data.summaryErrorTimes < 20){
            this.data.summaryErrorTimes = this.data.summaryErrorTimes + 1;
            console.log('获取summary失败，重新尝试，次数：' + this.data.summaryErrorTimes)
            setTimeout(this.initInfo,1000);
          }else{
            wx.hideLoading();
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
        }
      },
      fail:function(){
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
  }
})