const app = getApp();
Page({
  data: {
    InputBottom: 0,
    friend_openid:"androidtesterid",
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
    //加入房间app.globalData.openid this.data.friend_openid
    app.globalData.onSockettest.emit('join_friend_room', {"user_id_1":"growthwang2","user_id_2":"androidtesterid"});
  },

})