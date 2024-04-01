// pages/user/money.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money_list:[],
    can_get:false,
    bank_num:"",
    bank_account_name:"",


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '',
    })
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'query_money_record',
      data: {
        "user_id":app.globalData.login_userInfo["user_id"],
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if(res.data.code == 200){
          var result = res.data.result;
          var money_list = result["money_result"]
          var can_get = result["can_get"]
          var userinfo = result["userinfo"]
          var bank_num = "";
          var bank_account_name = "";
          if(money_list.length > 0){
            bank_num = money_list[0]["bank_num"]
            bank_account_name = money_list[0]["bank_account_name"]
          }
          that.setData({
            money_list:money_list,
            can_get:can_get,
            userinfo:userinfo,
            bank_num:bank_num,
            bank_account_name:bank_account_name
          })
        }else if(res.data.code == -1){
          wx.showToast({
            title: res.data.result,
            icon:"error",
            duration:3000
          })
        }
       
      },
      fail(res){
        wx.hideLoading()
      }
    });
  },
  getallmoney(){
    var that = this;
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.hosturl + 'get_all_money',
      data: {
        "user_id":app.globalData.login_userInfo["user_id"],
        "bank_num":that.data.bank_num,
        "bank_account_name":that.data.bank_account_name
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if(res.data.code == 200){
          var result = res.data.result;
          var money_list = result["money_result"]
          var can_get = result["can_get"]
          var userinfo = result["userinfo"]
          var bank_num = "";
          var bank_account_name = "";
          if(money_list.length > 0){
            bank_num = money_list[0]["bank_num"]
            bank_account_name = money_list[0]["bank_account_name"]
          }
          that.setData({
            money_list:money_list,
            can_get:can_get,
            userinfo:userinfo,
            bank_num:bank_num,
            bank_account_name:bank_account_name
          })
        }else if(res.data.code == -1){
          wx.showToast({
            title: res.data.result,
            icon:"error",
            duration:3000
          })
        }
       
      },
      fail(res){
        wx.hideLoading()
      }
    });
  },
  banknumInput(e) {
    console.log(typeof(e.detail.value))
    //var price = parseFloat(e.detail.value).toFixed(2);
    this.setData({
      bank_num: e.detail.value
    })
  },
  bankaccountnameInput(e) {
    console.log(typeof(e.detail.value))
    //var price = parseFloat(e.detail.value).toFixed(2);
    this.setData({
      bank_account_name: e.detail.value
    })
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