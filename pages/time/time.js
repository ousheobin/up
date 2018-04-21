//time.js
const app = getApp();

var timer;
function time(that,minute,second){
  var min=minute;
  var sec=second;
  if(minute==0 && second==0){ //计时结束
    console.log('结束屏幕常亮');
    wx.setKeepScreenOn({
      keepScreenOn: false
    })
    wx.vibrateLong();
    that.setData({
      clock: '0' + min + ':' + '0'+ sec
    });
    clearTimeout(timer);
    finishStatus(true);
  }
  else{
    if (second == -1) {
      min = --minute;
      second = 59;
      sec = 59;
    }
    if (minute < 10) {
      min = '0' + minute;
    }
    if (second < 10) {
      sec = '0' + second;
    }
    that.setData({
      clock: min + ':' + sec
    });
    timer=setTimeout(function () { time(that, minute, --second) }, 1000);
  }
}
//放弃计时
function giveUp(){
  if (app.globalData.colorNum==1){
    wx.showModal({
      title: '提示',
      content: '确定要放弃吗',
      confirmColor: '#a4f1e4',
      cancelColor: '#a9a9a9',
      success: function (res) {
        if (res.confirm) {
          console.log("点击确定");
          clearTimeout(timer);
          finishStatus(false);
          console.log('结束屏幕常亮');
          wx.setKeepScreenOn({
            keepScreenOn: false
          })
        }
        else if (res.cancel) {
          console.log("点击取消");
        }
      }
    })
  }
  else if (app.globalData.colorNum==2){
    wx.showModal({
      title: '提示',
      content: '确定要放弃吗',
      confirmColor: '#f8bdbe',
      cancelColor: '#a9a9a9',
      success: function (res) {
        if (res.confirm) {
          console.log("点击确定");
          clearTimeout(timer);
          finishStatus(false);
          console.log('结束屏幕常亮');
          wx.setKeepScreenOn({
            keepScreenOn: false
          })
        }
        else if (res.cancel) {
          console.log("点击取消");
        }
      }
    })
  }
}

//返回是否完成
function finishStatus(status){
  wx.request({
    url: 'https://508cst.gcu.edu.cn/up/wechat/records/update_finish_status',
    data:{
      userId: wx.getStorageSync('userId'),
      sessionKey: wx.getStorageSync('wxSessionKey'),
      recordId: app.globalData.recordId,
      isFinish:status
    },
    success:res=>{
      if (res.statusCode == 200 && res.data.status == "ok"){
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
  if(status==false){
    wx.redirectTo({
      url: '../home/home',
    })
  }
  else if(status==true){
    wx.redirectTo({
      url: '../finish/finish',
    })
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clock: '',
    _num: app.globalData.colorNum,
    brightness: 1.0
  },
  clickGiveUp:function(){
    giveUp();
  },
  // //旋转函数
  // transform: function () {
  //   console.log("点击");
  //   console.log(leftCircle);
  //   // leftCircle.style.bordetColor="#000";
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: app.globalData.title,
    })
    time(that, app.globalData.thisTime,0);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('启动屏幕常亮');
    this.setData({
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
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    wx.getScreenBrightness({
      success: res => {
        this.setData({
          brightness: res.value
        })
      }
    });
    if (this.data.brightness > 0.6) {
      wx.setScreenBrightness({
        value: 0.6,
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(timer);
    finishStatus(false);
    console.log('恢复亮度:' + this.data.brightness);
    wx.setScreenBrightness({
      value: this.data.brightness,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('恢复亮度:' + this.data.brightness);
    wx.setScreenBrightness({
      value: this.data.brightness,
    })
  },
})