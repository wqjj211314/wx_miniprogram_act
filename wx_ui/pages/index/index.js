const socket = require("../../utils/socket.js");
var doommList = [];
const app = getApp();
const iotest = require("weapp.socket.io.js");  // 引入 socket.io
var onSockettest = ""// 连接 socket
Page({
  data: {
    doommData: doommList,
    scrollTop: 0,
    inputMsg: '',
    img_l: '',
    imgList: [],
    index: null,
    isFocus: false,
    isdisplay: true,
    vertical: true,
    activity_id: "",
    option_activity_id: "",
    activity_list: [],
    activity_info: [],
    activity_user_info: [],
    login_userInfo: {},
    member: 0,
    hosturl: app.globalData.hosturl,
    hasUserInfo: false
  },
  openKey(e) {
    console.log('onClick', e.detail)
    this.setData({
      isdisplay: false
    });
    this.setData({
      //isFocus:true,
    });
  },
  onblurkey() {
    console.log("onblurkey");
    this.setData({
      isFocus: false,
      isdisplay: true
    })
  },
  inputMsg: function (e) {
    this.setData({
      inputMsg: e.detail.value
    });
  },
  sendMsg() {
    console.log(this.data.inputMsg);
    var send = this.data.inputMsg;
    var id = app.globalData.current_activity_id;
    onSockettest.emit('pushmsg', { new_chat_msg: send, activity_id: id, openid: app.globalData.openid });

    this.setData({
      inputMsg: ""
    });
  },
  onLoad: function (options) {

    //查看是否授权
    var that = this;
    wx.getStorage({
      key: 'openid',
      success(res) {
        console.log("获取本地缓存数据，检查openid数据");
        console.log(res.data);
        try {
          var avatarUrl = "";
          avatarUrl = wx.getStorageSync('avatarUrl');
          var nickName = "未命名";
          nickName = wx.getStorageSync('nickName');
          console.log(nickName);
          var gender = 0;
          gender = wx.getStorageSync('gender');
          var login_userInfo = {
            "user_id": res.data,
            "nickName": nickName,
            "avatarUrl": avatarUrl,
            "gender":gender
          };
          that.setData({
            login_userInfo: login_userInfo,
            hasUserInfo: true
          });
          app.globalData.login_userInfo = login_userInfo;
          app.globalData.hasUserInfo = true;
        } catch (e) {
          // Do something when catch error
        }
      }
    });

    if (options.hasOwnProperty("activity_id")) {
      var info = JSON.parse(decodeURIComponent(options.activity_id));
      console.log("创建的活动id" + info);
      this.setData({
        option_activity_id: info.activity_id
      })
    }
    this.get_activity_list();


  },
  socketinit() {
    if (onSockettest != "") {
      onSockettest.close();//关闭连接
    }
    onSockettest = iotest(app.globalData.hosturl)// 连接 socket
    app.globalData.onSockettest = onSockettest
    onSockettest.on('connect', function (res) { // 监听socket 是否连接成功
      console.log("监听成功");
    });

    //房间聊天消息，还未添加用户头像等信息，待添加
    onSockettest.on('new_chat_msg', (res) => {
      console.log(res.new_chat_msg);
      console.log(this.data.doommData);
      doommList.push(res.new_chat_msg);
      var top = doommList.length * 100;
      this.setData({
        doommData: doommList,
        scrollTop: top
      });
      console.log(this.data.doommData);

    });
    onSockettest.on('new_member', (res) => {
      console.log(res.new_total_member_num);
      this.setData({
        member: res.new_total_member_num
      });

    });
    //这个是为了将socket加入房间，不然其他人发送消息，无法更新，收不到
    onSockettest.emit("connect_first", { activity_id: app.globalData.current_activity_id });
  },

  get_activity_list() {
    var _this = this;
    wx.request({
      url: app.globalData.hosturl + 'get_activity_list', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": this.data.option_activity_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res.data)
        var list = _this.data.activity_list;
        console.log("获取list");
        console.log(res.data);
        res.data.forEach(element => {
          console.log(element.activity_id)
          list.push(element);
        });
        _this.setData({
          activity_list: list
        })
        //初始化第一个id
        var first = _this.data.activity_list;

        app.globalData.current_activity_id = first[0].id;
        console.log("活动创建人" + first[0].createuser);
        _this.setData({
          activity_id: app.globalData.current_activity_id,
          member: first[0].member
        });
        console.log("初始化第一个activity id = " + app.globalData.current_activity_id);
        _this.socketinit();
        //这里应该将活动信息和用户信息都提取保存起来
        _this.getstore_activity_user_info(_this.data.activity_id);
        _this.get_init_msg(app.globalData.current_activity_id);
      }
    });

  },
  //划动切换
  slide(e) {
    console.log("切换！");
    app.globalData.current_activity_id = e.detail.currentItemId;
    this.setData({
      activity_id: app.globalData.current_activity_id,
    });
    //这里应该将活动信息和用户信息都提取保存起来
    this.getstore_activity_user_info(e.detail.currentItemId);
    this.get_init_msg(app.globalData.current_activity_id);
    this.socketinit();
  },

  getstore_activity_user_info(activity_id) {
    var aclist = this.data.activity_list;
    //console.log(aclist);
    var that = this;
    aclist.forEach(element => {
      //console.log(element.activity_id);
      if (element.id == activity_id) {
        var activity_user_id = element.user_id;
        console.log("获取用户信息：" + element.user_id);
        console.log("获取活动创建人用户信息：" + element.createuser.user_id);
        //提取保存活动信息
        that.setData({
          activity_info: element,
          member: element.member
        });
        this.setData({
          activity_user_info: element.createuser
        })

        return;
      }

    });
  },
  update_activity_user_info(data) {
    if (data != "fail") {
      app.globalData.activity_user_info = data;
      this.setData({
        activity_user_info: data
      })
    }
  },
  get_init_msg(id) {
    const _this = this;
    console.log("获取聊天信息：" + id);
    doommList = [];
    wx.request({
      url: app.globalData.hosturl + 'get_init_msg', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data != "fail") {
          //聊天消息
          var list = _this.data.activity_list;
          res.data.forEach(element => {
            doommList.unshift(element.chatmsg);
          });
          //活动信息
          var info = _this.data.activity_info;
          console.log(info);
          var ainfo = [];
          ainfo.unshift("活动时间：" + info.begintime + "-" + info.endtime);
          ainfo.unshift("活动日期：" + info.activity_date);
          ainfo.unshift("活动地点：" + info.activityaddress);
          ainfo.unshift("活动详情：" + info.detail);
          ainfo.unshift("报名人数：" + info.member);
          ainfo.unshift(info.title);

          var top = (doommList.length + ainfo.length) * 100;
          _this.setData({
            doommData: doommList,
            activityinfo: ainfo,
            scrollTop: top
          });
        }
      }
    });
  },

  // 这个是创建活动的用户信息，暂时不做专门的用户信息展示
  show_activityuser_info() {
    let friend_user_info = encodeURIComponent(JSON.stringify(this.data.activity_user_info));
    
    wx.navigateTo({
      url: '../chat/chat?friend_user_info=' + friend_user_info,
    });
  },
  navigateToactivityinfo() {
    let activity_info = encodeURIComponent(JSON.stringify(this.data.activity_info));

    let activity_user_info = encodeURIComponent(JSON.stringify(this.data.activity_user_info));
    console.log("跳转至活动报名界面")
    console.log(activity_info);
    console.log(activity_user_info)
    wx.navigateTo({
      url: '../activityshowinfo/activityshowinfo?activity_user_info=' + activity_user_info + "&activity_info=" + activity_info
    })
  },
  navigateTouserinfo() {
    //wx.navigateTo({
    //url: '../user/user'
    //})
  },
  navigateToChat() {
    //wx.navigateTo({
    //url: '../user/user'
    //})
  },
  bindGetUserInfo: function (res) {
    if (res.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      var info = res.detail.userInfo;
      console.log(info);
      that.setData({
        login_userInfo: info
      });
      wx.navigateTo({
        url: '../user/user?userinfo=' + encodeURIComponent(JSON.stringify(info))
      })
    } else {
      console.log("拒绝授权");
    }
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    if (!app.globalData.hasUserInfo) {
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log("按钮获取用户信息 " + res.userInfo.nickName);
          console.log(res.userInfo);
          app.globalData.login_userInfo = res.userInfo;
          app.globalData.hasUserInfo = true;
          this.setData({
            login_userInfo: res.userInfo,
            hasUserInfo: true
          });
          //本地缓存用户数据，避免频繁登录
          try {
            wx.setStorageSync('nickName', app.globalData.login_userInfo.nickName);
            wx.setStorageSync('avatarUrl', app.globalData.login_userInfo.avatarUrl);
          } catch (e) { }
          //未登录的情况下，点击只是登录，不跳转用户页
          //wx.navigateTo({
          //url: '../user/user?userinfo='+encodeURIComponent(JSON.stringify(res.userInfo))
          //});
          this.newuser(app.globalData.login_userInfo.nickName, app.globalData.login_userInfo.avatarUrl, app.globalData.login_userInfo.gender);
        }
      });
    } else {
      //登录的情况下，点击跳转用户页
      wx.navigateTo({
        url: '../user/user?userinfo=' + encodeURIComponent(JSON.stringify(app.globalData.login_userInfo))
      })
    }
  },
  newuser(nickname, avatarUrl, gender) {
    console.log("用户头像" + avatarUrl);
    wx.request({
      url: app.globalData.hosturl + 'newuser', //仅为示例，并非真实的接口地址
      data: {
        "openid": app.globalData.openid,
        "nickName": nickname,
        "avatarUrl": avatarUrl,
        "gender": gender
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onShow: function () {
    this.setData({
      login_userInfo: app.globalData.login_userInfo
    });
  }
})