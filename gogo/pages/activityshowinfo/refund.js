// pages/activityshowinfo/refund.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_users:{},
    req_item:"",
    req_detail:"",
    part_member_num:"",
    sel_refund_member_list:[],
    activity_info:{},
    refund_fee:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let member_users = JSON.parse(decodeURIComponent(options.member_users));
    let part_member_num = options.part_member_num;
    let activity_info = JSON.parse(decodeURIComponent(options.activity_info));
    
    this.setData({
      member_users,
      part_member_num,
      sel_partner_member_list:[part_member_num],
      activity_info
    })
  },
  priceInput(e) {
    console.log(typeof(e.detail.value))
    //var price = parseFloat(e.detail.value).toFixed(2);
    this.setData({
      refund_fee: e.detail.value
    })
  },
  priceInputBlur(){
    var price = Math.abs(parseFloat(this.data.refund_fee)).toFixed(2);
    //price = parseFloat(this.data.pay_price).toFixed(2);
    console.log(typeof(price))
    console.log(price)
    if(price == "NaN"){
      wx.showToast({
        title: '金额有误',
        icon:"error",
        duration:3000
      })
      this.setData({
        refund_fee:"0.00"
      })
    }else{
      wx.showToast({
        title: '填写退款金额： '+price+"元",
        icon:"none",
        duration:3000
      })
      this.setData({
        refund_fee:price
      })
    }
  },
  refund_some_money(){
    var that = this;
    if(this.data.refund_fee == 0){
      wx.showToast({
        title: '金额不能为0',
        icon:"error",
        duration:3000
      })
      return
    }
    if(this.data.sel_refund_member_list.length == 0){
      wx.showToast({
        title: '至少选择1人',
        icon:"error",
        duration:3000
      })
      return
    }
    wx.showLoading({
      title: '退款中...',
    })
    wx.request({
      url: app.globalData.hosturl + 'refund_member_some_money', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": that.data.activity_info.activity_id,
        "sel_refund_member_list": that.data.sel_refund_member_list,
        "user_id":that.data.activity_info.createuser.user_id,
        "refund_fee": that.data.refund_fee
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.get_members()
        //wx.hideLoading();
      }
    });
    
  },
  listenCheckboxChange(e){
    console.log('当checkbox-group中的checkbox选中或者取消是我被调用');
      //打印对象包含的详细信息
      console.log(e.detail.value);
      var sel_refund_member_list = e.detail.value;
      
      this.setData({
        sel_refund_member_list:sel_refund_member_list,
        
      })
      
  },
  get_members(){
    
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_memberlist', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": that.data.activity_info.activity_id,
        "hobby_tag": that.data.activity_info.activity_tag
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //更新活动信息
        var activity_info = that.data.activity_info;
        console.log(res.data["activity_info"])
        var new_activity_info = res.data["activity_info"]
        for (var key in new_activity_info) {
          if (activity_info.hasOwnProperty(key)) {
            activity_info[key] = new_activity_info[key]
          }
        }
        that.setData({
          activity_info: activity_info
        })
        var result = res.data;
        
        var info = result["user_info_part_info_list"];
        var member_users = {};
        info.forEach(item => {
          var member_num = item.member_num;
      member_users[member_num] = item;
        })
        that.setData({
          member_users:member_users
        })
        
        wx.hideLoading()
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: "活动异常",
          icon: "error"
        })
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