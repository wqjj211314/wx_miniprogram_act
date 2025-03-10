const app = getApp();
const iotest = require("../index/weapp.socket.io.js");  // 引入 socket.io
var onSockettest = "";
Page({
  data: {
    InputBottom: 0,
    friend_user_info: {},
    friend_avatar: "",
    login_avatar: "",
    friend_openid: "",
    init_friend_chat_msgs: [],
    scrollTop: 0,

  },
  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    onSockettest = iotest(app.globalData.hosturl,{
      pingInterval:25000,
      pingTimeout:60000
    })
    console.log("聊天onLoad");
    var that = this;
    let friend_user_info = JSON.parse(decodeURIComponent(options.friend_user_info));
    console.log("好友信息" + friend_user_info);
    console.log(friend_user_info);
    wx.setNavigationBarTitle({
      title: friend_user_info["nickName"]
    })
    this.setData({
      friend_user_info: friend_user_info,
      friend_openid: friend_user_info["user_id"],
      login_avatar: app.globalData.login_userInfo["avatarUrl"],
      friend_avatar: friend_user_info["avatarUrl"]
    });
    //this.init_friend_chat_list();
    wx.request({
      url: app.globalData.hosturl + 'get_init_friend_chat_msgs', //仅为示例，并非真实的接口地址
      data: {
        "user_id_1": this.data.friend_user_info["user_id"],
        "user_id_2": app.globalData.login_userInfo["user_id"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
        console.log(res.data.init_friend_chat_msgs);
        res.data.init_friend_chat_msgs.forEach(function (item, index, self) {

          item["indexid"] = "index" + index;

        });
        that.setData({
          init_friend_chat_msgs: res.data.init_friend_chat_msgs
        });
        //滚动底部
        wx.createSelectorQuery().select('#chatid').boundingClientRect(function (rect) {
          wx.pageScrollTo({
            scrollTop: rect.height,
            duration: 300 // 滑动速度
          })
          that.setData({
            scrollTop: rect.height - that.data.scrollTop
          });
        }).exec();
      }
    });

    //if(!onSockettest._callbacks.$new_friend_chat_msg){
    console.log("没监听new_friend_chat_msg");
    console.log(onSockettest)
    var room_id = "";
    if (app.globalData.login_userInfo["user_id"] >= this.data.friend_user_info["user_id"]) {
      room_id = app.globalData.login_userInfo["user_id"] + "_" + this.data.friend_user_info["user_id"]
    } else {
      room_id = this.data.friend_user_info["user_id"] + "_" + app.globalData.login_userInfo["user_id"]
    }
    console.log("房间号"+room_id)
    console.log("还在用？")
    onSockettest.on('connect', function (res) { // 监听socket 是否连接成功
      console.log("监听成功");
      onSockettest.emit('join_friend_room', { user_id_1: app.globalData.login_userInfo["user_id"], user_id_2: that.data.friend_user_info["user_id"] });
    });
    //onSockettest.emit('join_friend_room', { user_id_1: app.globalData.login_userInfo["user_id"], user_id_2: this.data.friend_user_info["user_id"] });

    onSockettest.on('new_friend_chat_msg', (new_friend_chat_msg) => {
      console.log("收到新的聊天消息");
      console.log(new_friend_chat_msg);
      var chat_msg_list = that.data.init_friend_chat_msgs;
      new_friend_chat_msg["indexid"] = "index" + chat_msg_list.length;
      //是不是当前聊天的消息，不是就不要显示，方式socketio room push有问题
      //自身发的消息本地已加入列表
      if(new_friend_chat_msg["user_id_1"] == app.globalData.login_userInfo["user_id"]){
        return
      }
      if(new_friend_chat_msg["user_id_1"] != app.globalData.login_userInfo["user_id"]){
        if(new_friend_chat_msg["user_id_2"] != app.globalData.login_userInfo["user_id"]){
          return
        }
        
      }
      
      if(new_friend_chat_msg["user_id_1"] != this.data.friend_user_info["user_id"]){
        if(new_friend_chat_msg["user_id_2"] != this.data.friend_user_info["user_id"]){
          return
        }
      }
      chat_msg_list.push(new_friend_chat_msg);
      console.log(chat_msg_list);
      that.setData({
        init_friend_chat_msgs: chat_msg_list
      });
      console.log(that.data.init_friend_chat_msgs);
      //滚动底部
      wx.createSelectorQuery().select('#chatid').boundingClientRect(function (rect) {
        wx.pageScrollTo({
          scrollTop: rect.height,
          duration: 300 // 滑动速度
        })
        that.setData({
          scrollTop: rect.height - that.data.scrollTop
        });
      }).exec();
    });
    //};

    //加入房间app.globalData.openid this.data.friend_openid
    console.log(this.data.friend_user_info["user_id"]);
    console.log(app.globalData.login_userInfo["user_id"]);
    console.log( { user_id_1: app.globalData.login_userInfo["user_id"], user_id_2: this.data.friend_user_info["user_id"] })
    //app.globalData.onSockettest.emit('connect', { user_id_1: app.globalData.login_userInfo["user_id"], user_id_2: this.data.friend_user_info["user_id"] });
    
  },
  inputMsg: function (e) {
    this.setData({
      inputMsg: e.detail.value
    });
  },
  trimStr(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },

  sendMsg() {
    var that = this;
    console.log(this.data.inputMsg);
    var send = this.data.inputMsg;
    this.setData({
      inputMsg: ""
    });
    if (this.trimStr(send) == "") return;
    //本地直接显示
    var chat_msg_list = this.data.init_friend_chat_msgs;
    chat_msg_list.push({ "user_id_1": app.globalData.login_userInfo["user_id"], "user_id_2": this.data.friend_user_info["user_id"], "chatmsg": send.trim(), "indexid": "index" + (chat_msg_list.length + 1) });
    this.setData({
      init_friend_chat_msgs: chat_msg_list
    });

    //滚动底部
    wx.createSelectorQuery().select('#chatid').boundingClientRect(function (rect) {
      wx.pageScrollTo({
        scrollTop: rect.height,
        duration: 300 // 滑动速度
      })
      that.setData({
        scrollTop: rect.height - that.data.scrollTop
      });
    }).exec();

    //var id = app.globalData.current_activity_id;
    //app.globalData.onSockettest.emit('push_friend_chatmsg', { new_chat_msg: send, user_id_2:JSON.stringify(this.data.friend_user_info), user_id_1: JSON.stringify(app.globalData.login_userInfo)});
    //console.log(this.data.init_friend_chat_msgs);

    wx.request({
      url: app.globalData.hosturl + 'push_friend_chat_msg', //仅为示例，并非真实的接口地址
      data: {
        "user_id_1": app.globalData.login_userInfo["user_id"],
        "user_id_2": that.data.friend_user_info["user_id"],
        "new_chat_msg": send.trim()
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

      }
    });
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    var room_id = "";
    if (app.globalData.login_userInfo["user_id"] >= this.data.friend_user_info["user_id"]) {
      room_id = app.globalData.login_userInfo["user_id"] + "_" + this.data.friend_user_info["user_id"]
    } else {
      room_id = this.data.friend_user_info["user_id"] + "_" + app.globalData.login_userInfo["user_id"]
    }
    onSockettest.emit("leave_friend_room", { "room_id": room_id });
    onSockettest.close();
  },
})