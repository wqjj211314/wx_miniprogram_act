// pages/activityshowinfo/requestpartner.js
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
    sel_partner_member_list:[],
    activity_info:{}

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
  listenCheckboxChange(e){
    console.log('当checkbox-group中的checkbox选中或者取消是我被调用');
      //打印对象包含的详细信息
      console.log(e.detail.value);
      var sel_partner_member_list = e.detail.value;
      
      this.setData({
        sel_partner_member_list:sel_partner_member_list,
        
      })
      
  },
  chooseitem(event) {
    var req_item = event.target.dataset.value;
    this.setData({
      req_item: req_item
    })
  },
  itemInput(e) {
    this.setData({
      req_item: e.detail.value
    })
  },
  detailInput(e) {
    this.setData({
      req_detail: e.detail.value
    })
  },
  request_item(){
    var req_item = this.data.req_item;
    var req_detail = this.data.req_detail;
    var sel_partner_member_list = this.data.sel_partner_member_list;
    if(req_item == ""){
      wx.showToast({
        title: '请填写请求事项',
        icon:"error",
        duration:3000
      })
      return
    }
    if(sel_partner_member_list.length < 2){
      wx.showToast({
        title: '成员不足',
        icon:"error",
        duration:3000
      })
      return
    }
    wx.request({
      url: app.globalData.hosturl + 'request_partner', //仅为示例，并非真实的接口地址
      data: {
        "user_id": app.globalData.login_userInfo["user_id"],
        "activity_id":this.data.activity_info["activity_id"],
        "user_member_num":this.data.part_member_num,
        "req_item":req_item,
        "req_detail":req_detail,
        "sel_partner_member_list":sel_partner_member_list
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        wx.showToast({
          title: res.data.result,
          icon:"none",
          duration:3000
        })
        wx.navigateBack()
       
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