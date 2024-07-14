// pages/good/order.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deliver_status:"",
    order_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var deliver_status = options.deliver_status;
    this.setData({
      deliver_status:deliver_status
    })
    this.get_order_list(deliver_status);
  },
  get_order_list(deliver_status){
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.globalData.hosturl + 'query_order', //仅为示例，并非真实的接口地址
      data: {
        "user_id": app.globalData.login_userInfo["user_id"],
        "deliver_status":deliver_status
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          console.log(res.data.result)
          that.setData({
            order_list: res.data.result,
          })
          if(res.data.result.length == 0){
            wx.showToast({
              title: '没找到订单',
              icon:'success',
              duration:3000
            })
          }
        }
      },
      fail: function (error) {
        wx.hideLoading();
      }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  gooddetail(e){
    var that = this;
    
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var order = this.data.order_list[index];
    console.log(order)
    var good_info = encodeURIComponent(JSON.stringify({"good_id":order.good_id}));
    
    wx.navigateTo({
      url: '../good/gooddetail?good_info=' + good_info
    })
  },

  cancel_order(e){
    var that = this;
    
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var order = this.data.order_list[index];
    console.log(order)
    wx.request({
      url: app.globalData.hosturl + 'cancel_order', //仅为示例，并非真实的接口地址
      data: {
        "user_id": app.globalData.login_userInfo["user_id"],
        "order_id":order.order_id,
        "deliver_status":this.data.deliver_status
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          console.log(res.data.result)
          that.setData({
            order_list: res.data.result,
          })
          if(res.data.result.length == 0){
            wx.showToast({
              title: '没找到订单',
              icon:'success',
              duration:3000
            })
          }
        }
      },
      fail: function (error) {
        wx.hideLoading();
      }
    })
  },
  pay_order(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var order = this.data.order_list[index];
    console.log(order)
    wx.request({
      url: app.globalData.hosturl + 'pay_order', //仅为示例，并非真实的接口地址
      data: {
        "user_id": app.globalData.login_userInfo["user_id"],
        "order_id":order.order_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          wx.requestPayment({
            'timeStamp': res.data.result.timeStamp,
            'nonceStr': res.data.result.nonceStr,
            'package': res.data.result.package,
            'signType': res.data.result.signType,
            'paySign': res.data.result.paySign,
            'success': function (res) {
              // 进行逻辑判断
              console.log("成功支付")
              wx.showToast({
                title: '报名成功',
                icon: "success",
                duration: 2000
              })
              
            },
            'fail': function (res) {
              console.log("取消支付")
              console.log(res)
            },
            'complete': function (res) {
              //接口调用结束的回调函数（调用成功、失败都会执行）
              console.log("支付")
            }
          })
        } else {
          wx.showToast({
            title: res.data.result,
            icon: "error",
            duration: 2000
          })
        }
      },
      fail: function (error) {
        wx.hideLoading();
      }
    })
  }
})