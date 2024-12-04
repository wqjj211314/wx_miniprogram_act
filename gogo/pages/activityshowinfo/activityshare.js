
const share = require("share.js");
const app = getApp();
// pages/activityshowinfo/activityshare.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    triggered: false,
    moods: [],
    mood_img_list: [],
    admin_flag:false,
    activity_id:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var activity_id = options["activity_id"];
    share.get_activity_moods(app.globalData.hosturl, this, activity_id);
    this.setData({
      admin_flag:options.admin_flag,
      activity_id:activity_id
    })
  },
  recore_mood() {
    if (this.data.moods.length > 20) {
      wx.showToast({
        title: '最多支持20条见闻分享',
        icon: "none",
        duration: 3000
      })
      return;
    }
    wx.navigateTo({
      url: 'share_mood?activity_id=' + this.data.activity_id,
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.mood_img_list,
      current: e.currentTarget.dataset.url
    });
  },
  onScrollRefresh() {
    console.log("下拉刷新" + this.data.triggered)
    var that = this;
    setTimeout(function () {
      that.setData({
        triggered: false
      })
    }, 2000);
    share.get_activity_moods(app.globalData.hosturl, this, this.data.activity_id);
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