//const chooseLocation = requirePlugin('chooseLocation');
const app = getApp();
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ungroup_partinfo_list:[],
    sel_values:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let ungroup_partinfo_list = this.data.ungroup_partinfo_list;
    if (options.hasOwnProperty("ungroup_partinfo_list")){
      ungroup_partinfo_list = JSON.parse(decodeURIComponent(options.ungroup_partinfo_list));
    }
    that.setData({
      ungroup_partinfo_list:ungroup_partinfo_list
    });
  },
  listenCheckboxChange(e){
    console.log('当checkbox-group中的checkbox选中或者取消是我被调用');
      //打印对象包含的详细信息
      console.log(e.detail.value);
      var sel_values = e.detail.value;
      this.setData({
        sel_values:sel_values
      })
      
  },
  save_group(){
    //不能带参数，那就存在app里面吧
    var temp = app.globalData.edit_group_user;
    var edit_group_user = temp.concat(this.data.sel_values);
    app.globalData.edit_group_user = edit_group_user;
    console.log(edit_group_user);
    wx.navigateBack({
      url: 'activityshowinfo'
    })
  }
})