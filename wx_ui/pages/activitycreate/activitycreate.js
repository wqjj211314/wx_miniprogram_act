// pages/activitycreate/activitycreate.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_create_list:[],
    hosturl:app.globalData.hosturl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let actlist = JSON.parse(decodeURIComponent(options.actlist))
    console.log(actlist)
    this.setData({
      activity_create_list:actlist
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})