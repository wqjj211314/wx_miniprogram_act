// pages/activity/blank.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(!app.globalData.add_activity_flag){
      app.globalData.add_activity_flag = true;
      wx.navigateTo({
        url: '/pages/activity/activity',
      });
     
    }
   
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
    console.log("ssss")
    console.log(app.globalData.add_activity_flag)
    console.log(app.globalData.tab_page_path)
    if(app.globalData.add_activity_flag){
      app.globalData.add_activity_flag = false;
      wx.switchTab({
        url: app.globalData.tab_page_path
      })
      
    }
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