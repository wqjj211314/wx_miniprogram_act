// pages/good/address.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contact_address:"",
    contact_name:"",
    contact_tel:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  contact_tel(e){
    this.setData({
      contact_tel:e.detail.value
    })
  },
  contact_address(e){
    this.setData({
      contact_address:e.detail.value
    })
  },
  contact_name(e){
    this.setData({
      contact_name:e.detail.value
    })
  },
  confirm(){
    app.globalData.contact_address = this.data.contact_address;
    app.globalData.contact_name = this.data.contact_name;
    app.globalData.contact_tel = this.data.contact_tel;
    wx.navigateBack()
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