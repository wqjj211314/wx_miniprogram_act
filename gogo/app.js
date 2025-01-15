//app.js
const util = require("utils/util.js");
App({
  onLaunch: function () {
    this.autoUpdate();
    //this.get_friend_newest_chat_msg();
    const windowInfo = wx.getWindowInfo();
    this.globalData.windowInfo = windowInfo;
    if(windowInfo != ""){
      var safeArea = windowInfo.safeArea;
      if(safeArea!=undefined){
        this.globalData.safeArea = windowInfo.windowHeight - safeArea.bottom;
      }
    }
    this.globalData.StatusBar = windowInfo.statusBarHeight;
    console.log("机器状态栏高度"+windowInfo.statusBarHeight);
    let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - windowInfo.statusBarHeight;
          //this.globalData.
          console.log("机器胶囊高度"+capsule.height);
          console.log("机器胶囊高度CustomBar"+this.globalData.CustomBar);
        } else {
          this.globalData.CustomBar = windowInfo.statusBarHeight + 50;
        }
    try {
      console.log("用户APP登录");
      //直接获取缓存保存的
      var openid = wx.getStorageSync('openid');
      console.log(openid)
      if (openid == "" || openid == undefined) {
        //this.globalData.login_userInfo["user_id"] = openid;
        console.log("需要登录获取openid")
        this.user_login();
      } else {
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
            that.getLocation();
          }
        })
      }
      //this.user_login();
    } catch (e) {
      console.log("持久化登录信息获取失败");
      console.log(e);
      //this.user_login();
    }


  },

  globalData: {
    hosturl: "https://www.2week.club:5000/",
    current_activity_id: "",
    activity_info: "",//跳转TAB activity.js页面要使用的，
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
    re_group_users:{},
    tab_page_path: "pages/index/index",
    reload_activity_share_moods: false,//在分享见闻界面返回活动界面时需要重新加载
    custom_group_tag_dict: {},//创建活动页的自定义分组信息
    fix_partner_pk_groups:[],
    contact_address:"",
    contact_name:"",
    contact_tel:"",
    add_activity_flag:false,
    windowInfo:"",
    safeArea:0
  },
  user_login() {
    //return;
    this.getLocation()
    util.get_open_id(this,this)
  },
  autoUpdate: function () {
    var self = this
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //检测到新版本，需要更新，给出提示
          wx.showModal({
            title: '更新提示',
            content: '检测到新版本，是否下载新版本并重启小程序？',
            success: function (res) {
              if (res.confirm) {
                //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                self.downLoadAndUpdate(updateManager)
              }
            }
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  /**
   * 下载小程序新版本并重启应用
   */
  downLoadAndUpdate: function (updateManager) {
    var self = this
    wx.showLoading();
    //静默下载更新小程序新版本
    updateManager.onUpdateReady(function () {
      wx.hideLoading()
      //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '已经有新版本了哟~',
        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
      })
    })
  },
  get_friend_newest_chat_msg: function () {
    console.log("get_friend_newest_chat_msg");
    try {
      var user_id = "";
      user_id = wx.getStorageSync('openid');
    } catch (e) { }
    wx.request({
      url: this.globalData.hosturl + 'get_friend_newest_chat_msg', //仅为示例，并非真实的接口地址
      data: {
        "user_id": user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("get_friend_newest_chat_msg");
        console.log(res);
        console.log(wx.getStorageSync('newest_friend_chat_msg_time'));
        if (res.data != null) {
          var msg_time = res.data.msgtime;
          var msg_time_date = new Date(msg_time);
          var last_time_date = new Date("2022-01-01 23:17:51");
          try {
            console.log(wx.getStorageSync('newest_friend_chat_msg_time'));
            if (wx.getStorageSync('newest_friend_chat_msg_time') != "") {
              last_time_date = new Date(wx.getStorageSync('newest_friend_chat_msg_time'));
              if (msg_time_date > last_time_date) {
                wx.setStorageSync('newest_friend_chat_msg_time', msg_time);
                wx.showTabBarRedDot({
                  index: 3,
                });
              }
            } else {
              wx.setStorageSync('newest_friend_chat_msg_time', msg_time);
              wx.showTabBarRedDot({
                index: 3,
              });
              
            }
          } catch (e) { }
        }
      }
    });
  },
  getLocation() {
    var that = this;
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
        wx.getLocation({
          type: 'wgs84',
          success (res) {
            const latitude = res.latitude
            const longitude = res.longitude
            console.log("实时位置"+res.latitude)
            wx.request({
              url: that.globalData.hosturl + 'update_user_location', //仅为示例，并非真实的接口地址
              data: {
                "user_id": that.globalData.login_userInfo.user_id,
                "latitude":latitude,
                "longitude":longitude
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
               
              }
            });
            
          }
         })
         
      }
    });

  },
  again_getLocation: function () {
    let that = this;
    // 获取位置信息
    wx.getSetting({
      success: (res) => {
        console.log("位置信息" + res)
        console.log(res.authSetting['scope.userLocation'])
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
            success: function (res) {
              console.log(res)
              if (res.cancel) {
                wx.showToast({
                  title: '授权失败',
                  icon: 'success',
                  duration: 1000
                })
                
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    console.log(dataAu)
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用getLocationt的API
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                     
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
          that.getLocation();

        }
        else { //授权后默认加载
          that.getLocation();
        }
      }
    })

  },

})