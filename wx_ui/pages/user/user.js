// pages/user/user.js
//在page页面引入app，同时声明变量，获得所需要的全局变量
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ismask:'block',
    checking_flag:false,
    userinfo:{},
    t_length:0

  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  navigateToActivity(){
    wx.navigateTo({
      url: '../activity/activity'
    })
  },
  navigateToActivitycreate(){
    wx.navigateTo({
      url: '../activitycreate/activitycreate'
    })
   
  },
  navigateToActivityadd(){
    wx.navigateTo({
      url: '../activitypart/activitypart'
    })
  },
  navigateToActivitychecking(){
    wx.navigateTo({
      url: '../activitycheck/activitycheck'
    })
  },  
  navigateToindex(){
    wx.navigateTo({
      url: '../index/index'
    })
  },
  navigateToFriendList(){
    wx.navigateTo({
      url: '../friend/friend'
    })
  },
  chat_with_dev(){
    if(app.globalData.login_userInfo["user_id"] == "o2QXs5XL_7sbn0-XYrEhdV0DR3UA")
      return;
    let friend_user_info = encodeURIComponent(JSON.stringify(app.globalData.login_userInfo));
    wx.navigateTo({
      url: '../chat/chat?friend_user_info=' + friend_user_info,
    });
  },
  click_setting(){
    wx.showToast({
      title: '功能未开放',
      icon:"none",
      duration:2000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user_info = JSON.parse(decodeURIComponent(options.userinfo))
    //console.log("创建的活动"+options);
    this.setData({
      userinfo:user_info,
    });
    if(app.globalData.login_userInfo["user_id"] == "o2QXs5XL_7sbn0-XYrEhdV0DR3UA"){
      this.setData({
        checking_flag:true,
      });
    }
  },
  bindText: function (e) {
    var t_text = e.detail.value.length;
    // console.log(t_text)
    this.setData({
      t_length: t_text
    }) 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})