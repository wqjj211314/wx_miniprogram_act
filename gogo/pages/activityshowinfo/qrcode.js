// pages/activityshowinfo/qrcode.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode_url:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var activity_id = options.activity_id;
    
  },
  sign_qrcode(activity_id){
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_activity_qrcode_url', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_id,
        "user_id":app.globalData.login_userInfo["user_id"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          qrcode_url:res.data.qrcode_url
        })
      },
      fail(res) {
        
      }
    });
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