//up.js
const app = getApp()
//获取本周概况
function weekSummary(that,date){
  wx.request({
    url: 'https://508cst.gcu.edu.cn/up/wechat/records/get_week_data',
    data:{
      userId: wx.getStorageSync('userId'),
      sessionKey: wx.getStorageSync('wxSessionKey'),
      beginDate:date
    },
    success:res=>{
      if(res.statusCode=="200" && res.data.status=="ok"){
        that.setData({
          summarytArraies: res.data.records,
          finishTime: res.data.count.finishTime
        })
      }
      else{
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


Page({

  /**
   * 页面的初始数据
   */
  data: {
    hisArraies:[],
    summarytArraies:[],
    _num: app.globalData.colorNum,
    finishTime:'',
    
  },

  //点击日期查看本周概括
  seeSummary:function(e){
    var that = this;
    // console.log(e.currentTarget.dataset.text);
    weekSummary(that, e.currentTarget.dataset.text);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获取日历信息
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
    wx.request({
      url: 'https://508cst.gcu.edu.cn/up/wechat/records/get_calendar_list',
      data:{
        userId: wx.getStorageSync('userId'),
        sessionKey: wx.getStorageSync('wxSessionKey')
      },
      success:res=>{
        if(res.statusCode==200 && res.data.status=="ok"){
          this.setData({
            hisArraies: res.data.calendarList
          })
          weekSummary(that,res.data.calendarList[0].beginDate);
        }
        else{
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
    })
  }
})