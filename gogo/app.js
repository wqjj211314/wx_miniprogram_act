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

    try {
      console.log("用户APP登录");
      this.user_login();
    } catch (e) {
      console.log("持久化登录信息获取失败");
      console.log(e);
      //this.user_login();
    }
    wx.authorize({
      scope: 'scope.userFuzzyLocation',
      success(res) {
          console.log(res)
          if(res.errMsg == 'authorize:ok'){
              wx.getFuzzyLocation({
                  type: 'wgs84',
                  success(res) {
                    console.log("获取模糊地址")
                      console.log(res)  //此时里面有经纬度
                  }
              })
          }
      },
      fail(err) {
          console.log(err)   
      }                    
  })
  },

  globalData: {
    hosturl: "https://www.2week.club:5000/",
    current_activity_id: "",
    activity_user_info: "",
    login_userInfo: {},
    hasUserInfo: false,
    userInfo: null,
    onSockettest: null,
    openid: "",
    partinfo: "",
    appversion: "2.0.2",
    checking_flag: false,
    newest_friend_chat_msg_time:"",
    friend_chat_msg_display:false,
    group_sel_values:[],
    edit_group_user:[],
    edit_index:0,
    edit_group_tag:""
  },
  user_login() {
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: that.globalData.hosturl + 'getopenid',
            data: {
              code: res.code
            },
            success: (res) => {
              console.log("appjs用户openid");
              console.log(res.data);
              console.log(res.data.openid);
              console.log(that.globalData.login_userInfo);
              that.globalData.openid = res.data.openid;
              that.globalData.checking_flag = res.data.checking_flag;
              that.globalData.login_userInfo["user_id"] = res.data.openid;
              that.globalData.login_userInfo["nickName"] = res.data.nickName;
              that.globalData.login_userInfo["avatarUrl"] = res.data.avatarUrl;
              that.globalData.login_userInfo["gender"] = res.data.gender;
              try {
                wx.setStorageSync('openid', res.data.openid);
                //wx.setStorageSync('nickName', res.data.nickName);
              } catch (e) { }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  store_userInfo: function () {
    try {
      //wx.setStorageSync('nickName', this.globalData.login_userInfo.nickName);
      //wx.setStorageSync('avatarUrl', this.globalData.login_userInfo.avatarUrl);
    } catch (e) { }
  }
})