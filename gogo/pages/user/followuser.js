// pages/user/followuser.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    follow_list:[],
    triggered:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.get_follow_list()
  },
  get_follow_list(){
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_follow_list',
      data: {
        "user_id":app.globalData.login_userInfo["user_id"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if(res.data.code == 200){
          that.setData({
            follow_list:res.data.result
          })
          if(res.data.result.length==0){
            wx.showToast({
              title: '还没有关注',
              icon:'success'
            })
          }
        }
      }
    });
  },
  chat_with(e){
    var index = e.currentTarget.dataset.index;
    var userinfo = this.data.follow_list[index];
    wx.navigateTo({
      url: '../chat/chat?friend_user_info=' + encodeURIComponent(JSON.stringify(userinfo)),
    });
  },
  create_activity_list(e){
    var index = e.currentTarget.dataset.index;
    var userinfo = this.data.follow_list[index];
    wx.navigateTo({
      url: '../activitycreate/activitycreate?user_id='+userinfo.user_id
    })
  },
  onScrollRefresh() {
    this.get_follow_list();
    var that = this;
    setTimeout(function () {
      that.setData({
        triggered: false,
      })
    }, 2000);
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

  }
})