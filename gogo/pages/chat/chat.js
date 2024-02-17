const app = getApp();
var onSockettest = "";
Page({
  data: {
    InputBottom: 0,
    friend_user_info:{},
    friend_avatar:"",
    login_avatar:"",
    friend_openid:"",
    init_friend_chat_msgs:[],
    scrollTop:0,
    
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
    onSockettest = app.globalData.onSockettest;

    console.log("聊天onLoad");
    var that = this;
    let friend_user_info = JSON.parse(decodeURIComponent(options.friend_user_info));
    console.log("好友信息"+friend_user_info);
    console.log(friend_user_info);
    wx.setNavigationBarTitle({
      title: friend_user_info["nickName"]
    })
    this.setData({
      friend_user_info:friend_user_info,
      friend_openid:friend_user_info["user_id"],
      login_avatar:app.globalData.login_userInfo["avatarUrl"],
      friend_avatar:friend_user_info["avatarUrl"]
    });
    //this.init_friend_chat_list();
    wx.request({
      url: app.globalData.hosturl+'get_init_friend_chat_msgs', //仅为示例，并非真实的接口地址
      data: {
        "user_id_1":this.data.friend_user_info["user_id"],
        "user_id_2":app.globalData.login_userInfo["user_id"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res);
        console.log(res.data.init_friend_chat_msgs);
        res.data.init_friend_chat_msgs.forEach(function(item,index,self){

          item["indexid"] = "index"+index;
  
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
    
      onSockettest.on('new_friend_chat_msg', (res) => {
        console.log("收到新的聊天消息");
        console.log(res.new_friend_chat_msg);
        var chat_msg_list = that.data.init_friend_chat_msgs;
        res.new_friend_chat_msg["indexid"] = "index"+chat_msg_list.length;
        chat_msg_list.push(res.new_friend_chat_msg);
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
    app.globalData.onSockettest.emit('join_friend_room', {user_id_1:this.data.friend_user_info["user_id"],user_id_2:app.globalData.login_userInfo["user_id"]});
  },
  inputMsg: function (e) {
    this.setData({
      inputMsg: e.detail.value
    });
  },
  trimStr(str){
    return str.replace(/(^\s*)|(\s*$)/g,"");
  },
  
  sendMsg() {
    console.log(this.data.inputMsg);
    var send = this.data.inputMsg;
    this.setData({
      inputMsg: ""
    });
    if(this.trimStr(send) == "") return;
    var id = app.globalData.current_activity_id;
    app.globalData.onSockettest.emit('push_friend_chatmsg', { new_chat_msg: send, user_id_2:JSON.stringify(this.data.friend_user_info), user_id_1: JSON.stringify(app.globalData.login_userInfo)});
    console.log(this.data.init_friend_chat_msgs);
  },
})