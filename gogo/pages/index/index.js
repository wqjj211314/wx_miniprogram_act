const socket = require("../../utils/socket.js");
const util = require("../../utils/util.js");
const swiper = require("swiper.js");
const server = require("server.js");
var doommList = [];
const app = getApp();
const iotest = require("weapp.socket.io.js");  // 引入 socket.io
var onSockettest = ""// 连接 socket
Page({
  data: {
    doommData: doommList,
    chat_msgs:[],
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
    first_activity_id: "",
    activity_list: [],//实际数据
    activity_info: [],
    announcement:"",
    activity_user_info: [],
    login_userInfo: {},
    member: 0,
    hosturl: app.globalData.hosturl,
    current:0,
    swiper_index:0,
    recyler_list: [], //展示数据
    data_current_index: 0, //真实的index
    swiper_current_index: 0, //swiper当前的index
    duration: 300, //动画时常,
    server_request_count:0,
    activity_date:"",
    share_res_limit:0,
    share_use_id:"",
    friend_chat_msg_display:false,
    url:"pages/index/index"
  },
  onLoad: function (options) {

    console.log("onload函数");
    var url = util.getCurrentPageUrl();
    console.log(url);
    this.setData({url});
    if (options.hasOwnProperty("activity_id")) {
      var info = JSON.parse(decodeURIComponent(options.activity_id));
      console.log("创建的活动id" + info);
      this.setData({
        activity_id: info.activity_id
      });
    }
    if (options.hasOwnProperty("share_use_id")){
      let share_use_id = decodeURIComponent(options.share_use_id);
        this.setData({
          share_use_id:share_use_id
        });
    }
    server.get_activity_list(this, app);
    server.get_friend_newest_chat_msg(this, app);
    

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
      console.log(res);
      console.log(this.data.chat_msgs);
      var chat_msgs = this.data.chat_msgs;
      //chat_msgs.push(res.new_chat_msg);
      chat_msgs.push(res);
      var top = chat_msgs.length * 100;
      this.setData({
        chat_msgs: chat_msgs,
        scrollTop: top
      });
      console.log(this.data.chat_msgs);

    });

    onSockettest.on('new_member', (res) => {
      console.log("收到成员人数更新");
      console.log(res.new_total_member_num);
      that.setData({
        member: res.new_total_member_num
      });

    });
    //这个是为了将socket加入房间，不然其他人发送消息，无法更新，收不到
    onSockettest.emit("connect_first", { activity_id: this.data.activity_id });
  },


  getstore_activity_user_info(activity_id) {
    var aclist = this.data.recyler_list;
    //console.log(aclist);
    var that = this;
    aclist.forEach(element => {
      //console.log(element.activity_id);
      if (element.activity_id == activity_id) {
        console.log("获取用户信息：" + element.user_id);
        console.log("获取活动创建人用户信息：" + element.createuser.user_id);
        //提取保存活动信息
        console.log("更新参与人数" + element.member);
        that.setData({
          activity_info: element,
          member: element.member
        });
        this.setData({
          activity_user_info: element.createuser
        });
        //var activity_date = new Date(element.activity_date);
        var activity_date = util.convert_date(element.activity_date);
        that.setData({
          activity_date:activity_date
        });



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

  // 这个是创建活动的用户信息，暂时不做专门的用户信息展示
  show_activityuser_info() {
    if (this.data.activity_user_info["user_id"] == app.globalData.login_userInfo["user_id"])
      return;
    let friend_user_info = encodeURIComponent(JSON.stringify(this.data.activity_user_info));
    
    //wx.navigateTo({
      //url: '../chat/chat?friend_user_info=' + friend_user_info,
    //});
    wx.navigateTo({
      url: '../user/userinfo?userinfo=' + friend_user_info,
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
      url: '../activityshowinfo/activityshowinfo?activity_user_info=' + activity_user_info + "&activity_info=" + activity_info+"&share_use_id="+this.data.share_use_id
    })
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    if (!this.check_user_profile_cache()) {
      console.log("没有登录");
      wx.showToast({
        title: '请重新进入程序',
        icon:"none"
      })
    } else {
      console.log("已经登录");
      var userInfo = app.globalData.login_userInfo;
      if(userInfo.avatarUrl==""||userInfo.gender==-1||userInfo.nickName==""){
        wx.navigateTo({
          url: '../user/login?userInfo='+encodeURIComponent(JSON.stringify(userInfo))
        })
      }else{
      //登录的情况下，点击跳转用户页
      wx.navigateTo({
        url: '../user/user'
        
      })
    }
    }
  },

  check_user_profile_cache() {
    console.log("检查是否登录");
    var that = this;
    try {
      var openid = wx.getStorageSync('openid');
      if (openid == "" || openid == undefined) {
        that.setData({
          hasUserInfo: false
        });
        app.globalData.hasUserInfo = false;
        return false;
      }
      /** 
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
      var userInfo = {
        "user_id": openid,
        "nickName": nickName,
        "avatarUrl": avatarUrl,
        "gender": gender
      };
      console.log(this.data.login_userInfo);
      that.setData({
        login_userInfo: userInfo,
        hasUserInfo: true
      });
      console.log(this.data.login_userInfo);
      */
      //app.globalData.login_userInfo = userInfo;
      app.globalData.hasUserInfo = true;
    } catch (e) {
      console.log("持久化登录信息获取失败");
      console.log(e);
    }

    return true;



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var bgurl = app.globalData.hosturl + "static/" + this.data.activity_info["activity_id"] + ".jpg";
    console.log("当前活动activity_id:" + this.data.activity_info["activity_id"]);
    console.log("当前活动activity_id:" + this.data.activity_id);
    var share_use_id = "";
    if(app.globalData.login_userInfo.hasOwnProperty("user_id")){
      share_use_id = app.globalData.login_userInfo["user_id"];
    }else{
      console.log("用户未登录，无法获取用户信息");
    }
    return {
      title: this.data.activity_info["title"],
      //desc: '自定义分享描述',
      path: '/pages/index/index?activity_id=' + encodeURIComponent(JSON.stringify({ "activity_id": this.data.activity_id }))+'&share_use_id='+share_use_id,
      //imageUrl:bgurl,
      success: function (res) {

        if (res.errMsg == 'shareAppMessage:ok') {
          console.log("成功", res)
        }
      },
      fail: function (res) {

        console.log("失败", res)

      }
    }
  },

  get_activity_info(activity_id) {
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_activity_info', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.hasOwnProperty("activity_id")) {
          console.log("更新参与人数" + res.data["member"]);
          that.setData({
            member: res.data["member"]
          });
        }
      }
    });
  },

  onShow: function () {
    console.log("首页onShow");
    this.setData({
      
      friend_chat_msg_display:app.globalData.friend_chat_msg_display
    });
    //查看是否授权
    var that = this;
    this.check_user_profile_cache();
    console.log("onshow 函数" + this.data.activity_id);
    console.log("onshow 函数" + this.data.option_activity_id);
    if (this.data.activity_id != "") {
      //server.get_init_msg(this,app,this.data.activity_id);
    }
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.hosturl + 'getopenid',
            data: {
              code: res.code
            },
            success: (res) => {
              console.log("appjs用户openid");
              console.log(res.data);
              console.log(res.data.openid);
              
              var login_userInfo = that.data.login_userInfo;
              login_userInfo["user_id"] = res.data.openid;
              login_userInfo["nickName"] = res.data.nickName;
              login_userInfo["avatarUrl"] = res.data.avatarUrl;
              login_userInfo["gender"] = res.data.gender;
              that.setData({
                login_userInfo,
                hasUserInfo:true
              });
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下拉刷新");

    //this.get_activity_list();
    //wx.stopPullDownRefresh();
  },
  refresh() {
    server.get_activity_list(this, app, "refresh");
    server.get_friend_newest_chat_msg(this, app);
  },
  //划动切换
  slide(e) {
    //this.socketinit();
    console.log("slide切换至" + e.detail.current);
    swiper.update_swiper(this,e.detail.current,this.data.swiper_current_index,this.data.data_current_index,this.data.activity_list,this.data.recyler_list);

    this.setData({
      activity_id: this.data.recyler_list[e.detail.current].activity_id,
      current:e.detail.current
    });
    //这里应该将活动信息和用户信息都提取保存起来
    this.getstore_activity_user_info(this.data.recyler_list[e.detail.current].activity_id);
    server.get_init_msg(this, app, this.data.recyler_list[e.detail.current].activity_id);
    
  },
  openKey(e) {
    console.log('onClick', e.detail)
    if(!util.check_login(app)){
      return;
    }
    this.setData({
      isdisplay: false
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
    var activity_id = this.data.activity_id;
    onSockettest.emit('pushmsg', { new_chat_msg: send, activity_id: activity_id, user_id: this.data.hasUserInfo?app.globalData.login_userInfo["user_id"]:"",nickName: this.data.hasUserInfo?app.globalData.login_userInfo["nickName"]:"匿名" });

    this.setData({
      inputMsg: ""
    });
  },
  navigateToActivity() {
    wx.navigateTo({
      url: '../activity/activity'
    })
  },
  navigateToFriendList() {
    wx.navigateTo({
      url: '../friend/friend'
    })
  },
})