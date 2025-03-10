// pages/user/user.js
//在page页面引入app，同时声明变量，获得所需要的全局变量
const app = getApp();
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ismask: 'block',
    checking_flag: false,
    userinfo: {},
    t_length: 0,
    new_nickName:"",
    friend_chat_msg_display:false,
    url:"pages/user/user",
    triggered: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user_info = JSON.parse(decodeURIComponent(options.userinfo))
    console.log("用户页 user onLoad");
    this.setData({
      userinfo:user_info
    });
  },
  

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  navigateToActivity() {
    wx.navigateTo({
      url: '../activity/activity'
    })
  },
  
  navigateToActivitycreate() {
    wx.navigateTo({
      url: '../activitycreate/activitycreate?user_id='+this.data.userinfo.user_id
    })

  },
  navigateToActivitypart() {
    wx.navigateTo({
      url: '../activitypart/activitypart?user_id='+this.data.userinfo.user_id
    })
  },
  navigateToActivitychecking() {
    wx.navigateTo({
      url: '../activitycheck/activitycheck'
    })
  },
  navigateToindex() {
    wx.navigateTo({
      url: '../index/newindex'
    })
  },
  navigateToFriendList() {
    wx.navigateTo({
      url: '../friend/friend'
    })
  },
  navigateTohobbylist() {
    console.log(this.data.userinfo);
    wx.navigateTo({
      url: '../hobby/hobbylist?user_id='+this.data.userinfo.user_id
    })
  },
  chat() {
    let friend_user_info = encodeURIComponent(JSON.stringify(this.data.userinfo));
    wx.navigateTo({
      url: '../chat/chat?friend_user_info=' + friend_user_info,
    });
    
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
    console.log("用户页 user onShow");
    
    
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  
})