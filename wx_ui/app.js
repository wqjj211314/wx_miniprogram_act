//app.js
App({
  onLaunch: function () {
    // 获取系统信息  
    wx.getSystemInfo({
      success: (res) => {
        // 获取屏幕高度
        this.screenHeight = res.screenHeight
        // 获取状态栏高度
        this.statusBarHeight = res.statusBarHeight
        // 通过操作系统 确定自定义导航栏高度  
        if (res.system.substring(0, 3) == "iOS") {
          this.navBarHeight = 42
        } else {
          this.navBarHeight = 44
        }
      }
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
    
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: that.globalData.hosturl+'getopenid',
            data: {
              code: res.code
            },
            success:(res)=>{
              console.log("appjs用户openid");
              console.log(res.data.openid);
              that.globalData.openid = res.data.openid;
              that.globalData.login_userInfo["user_id"] = res.data.openid;
              try {
                wx.setStorageSync('openid', res.data.openid);
              } catch (e) { }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
    

 
  },
  globalData: {
    hosturl:"https://www.2week.club:5000/",
    current_activity_id:"",
    activity_user_info:"",
    login_userInfo:{},
    hasUserInfo:false,
    userInfo: null,
    onSockettest:null,
    openid:"",
    partinfo:""
  },
  user_login(){

  }
})