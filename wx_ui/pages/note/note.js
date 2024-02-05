// pages/note/note.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    test:[[[0, 1], [2, 3]]],
    users:{
      0:{"name":"wangqiang"},
      1:{"name":"yinyin"},
      2:{"name":"gege"},
      3:{"name":"yang"}
    },
    hourMinuteSecond: '2024-02-04 22:22',//时分，根据需要选择
    timeDivision: ''//时分秒，根据需要选择
  },
  toweek(datestr){
    //let datestr = '2017-12-30'
    let datelist = ['周日','周一','周二','周三','周四','周五','周六',]
    return datelist[new Date(datestr).getDay()];
  },
      // 时分的事件方法
  selectDateMinuteChange(e) {
    var datetime = e.detail.value;
    var datestr = datetime.split(" ")[0];
    var result = this.toweek(datestr);
    console.log("日期是周几:"+result);
    this.setData({
      hourMinuteSecond: e.detail.value
    })

  },
  // 时分秒的事件方法
  selectDateSecondChange(e) {
    this.setData({
      timeDivision: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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