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
    hosturl: app.globalData.hosturl
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
    var id = this.data.activity_id;
    onSockettest.emit('pushmsg', { new_chat_msg: send, activity_id: id, openid: app.globalData.openid });

    this.setData({
      inputMsg: ""
    });
  },
  onLoad: function (options) {

    console.log("onload函数");

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
    var that = this;
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
      console.log("收到成员人数更新");
      console.log(res.new_total_member_num);
      that.setData({
        member: res.new_total_member_num
      });

    });
    //这个是为了将socket加入房间，不然其他人发送消息，无法更新，收不到
    onSockettest.emit("connect_first", { activity_id: this.data.activity_id});
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

        console.log("活动创建人" + first[0].createuser);
        console.log("更新参与人数"+first[0].member);
        _this.setData({
          activity_id: first[0].id,
          member: first[0].member
        });
        console.log("初始化第一个activity id = " + first[0].id);
        _this.socketinit();
        //这里应该将活动信息和用户信息都提取保存起来
        _this.getstore_activity_user_info(first[0].id);
        _this.get_init_msg(first[0].id);
      }
    });

  },
  //划动切换
  slide(e) {
    console.log("切换");
    this.setData({
      activity_id: e.detail.currentItemId,
    });
    //这里应该将活动信息和用户信息都提取保存起来
    this.getstore_activity_user_info(e.detail.currentItemId);
    this.get_init_msg(e.detail.currentItemId);
    //this.socketinit();
  },

  getstore_activity_user_info(activity_id) {
    var aclist = this.data.activity_list;
    //console.log(aclist);
    var that = this;
    aclist.forEach(element => {
      //console.log(element.activity_id);
      if (element.id == activity_id) {
        console.log("获取用户信息：" + element.user_id);
        console.log("获取活动创建人用户信息：" + element.createuser.user_id);
        //提取保存活动信息
        console.log("更新参与人数"+element.member);
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
          ainfo.unshift("活动详情：" + info.detail);
          ainfo.unshift("活动时间：" + info.activity_date + " " +info.begintime + "-" + info.endtime);
          //ainfo.unshift("报名人数：" + info.member);
          ainfo.unshift("活动地点：" + info.activityaddress);
          //ainfo.unshift(info.title);

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
    if(this.data.activity_user_info["user_id"] == app.globalData.login_userInfo["user_id"])
      return;
    let friend_user_info = encodeURIComponent(JSON.stringify(this.data.activity_user_info));
    
    wx.navigateTo({
      url: '../chat/chat?friend_user_info=' + friend_user_info,
    });
  },
  navigateToactivityinfo() {
    this.data.activity_info["member"] = this.data.member;
    let activity_info = encodeURIComponent(JSON.stringify(this.data.activity_info));

    let activity_user_info = encodeURIComponent(JSON.stringify(this.data.activity_user_info));
    console.log("跳转至活动报名界面")
    console.log(activity_info);
    console.log(activity_user_info)
    wx.navigateTo({
      url: '../activityshowinfo/activityshowinfo?activity_user_info=' + activity_user_info + "&activity_info=" + activity_info
    })
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    if (!this.check_user_profile_cache()) {
      this.wxgetUserProfile();
    } else {
      //登录的情况下，点击跳转用户页
      wx.navigateTo({
        url: '../user/user?userinfo=' + encodeURIComponent(JSON.stringify(app.globalData.login_userInfo))
      })
    }
  },
  wxgetUserProfile(){
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("按钮获取用户信息 " + res.userInfo.nickName);
        console.log(res.userInfo);
        app.globalData.login_userInfo["avatarUrl"] = res.userInfo["avatarUrl"];
        app.globalData.login_userInfo["nickName"] = res.userInfo["nickName"];
        app.globalData.login_userInfo["gender"] = res.userInfo["gender"];
        app.globalData.hasUserInfo = true;
        console.log(app.globalData.login_userInfo);
        this.setData({
          login_userInfo: app.globalData.login_userInfo,
          hasUserInfo:true
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
  },
  check_user_profile_cache(){
    var that = this;

    wx.getStorage({
      key: 'openid',
      success(res) {
        console.log("获取本地缓存数据，检查openid数据");
        console.log(res.data);
        try {

          var avatarUrl = wx.getStorageSync('avatarUrl');
          console.log(avatarUrl);
          if (avatarUrl == "" || avatarUrl == undefined) {
            that.setData({
              hasUserInfo: false
            });
            app.globalData.hasUserInfo = false;
            return false;
          }

          var nickName = wx.getStorageSync('nickName');
          console.log(nickName);
          if (nickName == "" || nickName == undefined) {
            that.setData({
              hasUserInfo: false
            });
            app.globalData.hasUserInfo = false;
            return false;
          }
          console.log(nickName);
          var gender = 0;
          //gender = wx.getStorageSync('gender');
          var login_userInfo = {
            "user_id": res.data,
            "nickName": nickName,
            "avatarUrl": avatarUrl,
            "gender": gender
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
      },
      fail(res) {
        return false;
      }
    });
    return true;
    

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
    var bgurl = app.globalData.hosturl + "static/" + this.data.activity_info["id"] + ".jpg";
    return {
      title:this.data.activity_info["title"],
      //desc: '自定义分享描述',
      // path: '',
      //imageUrl:bgurl,
      success: function (res) {
        
        if(res.errMsg == 'shareAppMessage:ok'){
        console.log("成功",res)
        }
      },
      fail:function(res){
        
        console.log("失败",res)
        
      }
    }
  },
  get_activity_info(){
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_activity_info', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": this.data.activity_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.hasOwnProperty("activity_id")) {
          console.log("更新参与人数"+res.data["member"]);
          that.setData({
            member:res.data["member"]
          });
        }
      }
    });
  },
  onShow: function () {
    console.log("首页onShow");
    //查看是否授权
    var that = this;
    this.check_user_profile_cache();
    console.log("onshow 函数"+this.data.activity_id);
    if(this.data.activity_id != ""){
      this.get_init_msg(this.data.activity_id);
    }
    
    this.setData({
      login_userInfo: app.globalData.login_userInfo
    });
  }
})