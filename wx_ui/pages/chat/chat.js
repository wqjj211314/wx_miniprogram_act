const app = getApp();
Page({
  data: {
    InputBottom: 0,
    friend_user_info:{},
    friend_avatar:"",
    login_avatar:"",
    friend_openid:"",
    init_friend_chat_msgs:[],
    scrollTop:0
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
    let friend_user_info = JSON.parse(decodeURIComponent(options.friend_user_info));
    console.log("好友信息"+friend_user_info);
    console.log(friend_user_info);
    this.setData({
      friend_user_info:friend_user_info,
      friend_openid:friend_user_info["user_id"],
      login_avatar:app.globalData.login_userInfo["avatarUrl"],
      friend_avatar:friend_user_info["avatarUrl"]
    });
    //this.init_friend_chat_list();
    //监听房间消息
    app.globalData.onSockettest.on('init_friend_chat_msgs', (res) => {
      console.log(res.init_friend_chat_msgs);
      var top = res.init_friend_chat_msgs.length * 100; 
      this.setData({
        init_friend_chat_msgs: res.init_friend_chat_msgs,
        scrollTop:top
     });
    });   
    
    app.globalData.onSockettest.on('new_friend_chat_msg', (res) => {
      console.log(res.new_friend_chat_msg);
      var chat_msg_list = this.data.init_friend_chat_msgs;
      chat_msg_list.push(res.new_friend_chat_msg);
      var top = chat_msg_list.length * 100;
      this.setData({
        init_friend_chat_msgs: chat_msg_list,
        scrollTop:top
      });
    });    
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
  sendMsg() {
    console.log(this.data.inputMsg);
    var send = this.data.inputMsg;
    var id = app.globalData.current_activity_id;
    app.globalData.onSockettest.emit('push_friend_chatmsg', { new_chat_msg: send, user_id_2:JSON.stringify(this.data.friend_user_info), user_id_1: JSON.stringify(app.globalData.login_userInfo)});

    this.setData({
      inputMsg: ""
    });
  },
})