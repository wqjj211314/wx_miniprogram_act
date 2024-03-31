//app.js
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
		if (capsule) {
		 	this.globalData.Custom = capsule;
			this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
		} else {
			this.globalData.CustomBar = e.statusBarHeight + 50;
		}
      }
    })
    try {
      console.log("用户APP登录");
      //直接获取缓存保存的
      var openid = wx.getStorageSync('openid');
      console.log(openid)
      if (openid == "" || openid == undefined) {
        //this.globalData.login_userInfo["user_id"] = openid;
        console.log("需要登录获取openid")
        this.user_login();
      }else{
        //发起网络请求
        var that = this;
        wx.request({
          url: that.globalData.hosturl + 'get_userinfo',
          data: {
            "user_id": openid
          },
          success: (res) => {
            that.globalData.openid = res.data.user_id;
            that.globalData.checking_flag = res.data.checking_flag;
            that.globalData.login_userInfo = res.data;
            that.globalData.hasUserInfo = true;
          }
        })
      }
      //this.user_login();
    } catch (e) {
      console.log("持久化登录信息获取失败");
      console.log(e);
      //this.user_login();
    }
    //查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting["scope.userFuzzyLocation"]) {
          console.log("授权了获取模糊位置");
        }
      },
      fail: function (res) {
        console.log("没授权获取模糊位置");
        wx.authorize({
          scope: 'scope.userFuzzyLocation',
          success(res) {
            console.log(res)
            if (res.errMsg == 'authorize:ok') {
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
      }
    })

  },

  globalData: {
    hosturl: "https://www.2week.club:5000/",
    current_activity_id: "",
    activity_info:"",//跳转TAB activity.js页面要使用的，
    activity_user_info: "",
    login_userInfo: {},
    hasUserInfo: false,
    userInfo: null,
    onSockettest: null,
    openid: "",
    partinfo: "",
    appversion: "2.0.2",
    checking_flag: false,
    newest_friend_chat_msg_time: "",
    friend_chat_msg_display: false,
    group_sel_values: [],
    edit_group_user: [],
    edit_index: 0,
    edit_group_tag: "",
    tab_page_path:"pages/index/index",
    reload_activity_share_moods:false,//在分享见闻界面返回活动界面时需要重新加载
    custom_group_tag_dict:{}//创建活动页的自定义分组信息
  },
  user_login() {
    //return;
    var that = this;
    wx.login({
      timeout:3000,
      success(res) {
        console.log("登录授权结果")
        console.log(res)
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
              that.globalData.login_userInfo["signature"] = res.data.signature;
              try {
                wx.setStorageSync('openid', res.data.openid);
                that.globalData.hasUserInfo = true;
                //wx.setStorageSync('nickName', res.data.nickName);
              } catch (e) { }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail(res){
        console.log("登录失败")
      },
      complete(res){
        console.log("登录完成")
        console.log(res)
      }
    });
  },
  
})