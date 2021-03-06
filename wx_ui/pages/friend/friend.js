// pages/friend.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session_list:[]

  },
  init_friend_chat_list(){
    var _this = this;
    wx.request({
      url: app.globalData.hosturl+'get_friend_chat_list', //仅为示例，并非真实的接口地址
      data: {
        "user_id": "growthwang2"//app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        /**
          [{
            'user_id_1': {
              'user_id': 'growthwang2',
              'nickName': 'growthwang2',
              'avatarUrl': ''
            },
            'user_id_2': {
              'user_id': 'androidtesterid',
              'nickName': 'androidtesterid',
              'avatarUrl': ''
            },
            'friend_nickName': 'growthwang2',
            'friend_avatarUrl': '',
            'chatmsg': '121',
            'msgtime': '2022-06-19 20:48:30'
          }, 
          {
            'user_id_1': {
              'user_id': 'growthwang2',
              'nickName': 'growthwang2',
              'avatarUrl': ''
            },
            'user_id_2': {
              'user_id': 'androidtesterid2',
              'nickName': 'androidtester2',
              'avatarUrl': ''
            },
            'friend_nickName': 'growthwang2',
            'friend_avatarUrl': '',
            'chatmsg': 'growthwang msg',
            'msgtime': '2022-06-18 13:51:27'
          }]
         */
        var list = _this.data.session_list;
        console.log("获取list");
        console.log(res.data);
        res.data.forEach(element => {
          console.log(element.chatmsg)
          list.push(element);
        });
        _this.setData({
          session_list:list
        })
        
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init_friend_chat_list();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },


})