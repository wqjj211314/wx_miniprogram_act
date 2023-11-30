//const chooseLocation = requirePlugin('chooseLocation');
const app = getApp();
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_info: [],
    activity_user_info: [],
    partinfo: [],
    partinfo_list: [],
    partinfoinput: {},
    memberlist: {},
    ispart: false,
    isend: false,
    partbuttonmsg: "我要报名",
    modalName: "",
    avatarUrl_list: [],
    partinfo_keys: [],
    partinfo_values: [],
    user_info_list: [],
    addendtime: "",
    member: 0,
    disable_flag: false,
    hosturl: app.globalData.hosturl,
    checking_flag: false,
    announcement:"",
    new_announcement:"",
    picker_index:0,
    picker:["小白","青铜","白银","黄金","钻石"],
    activity_date:"",
    share_use_id:"",
    part_limit:1,//0不限制参与，1限制参与,
    entire_part_info:[],
    ungroup_partinfo_list:[]
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.openid == this.data.activity_user_info["user_id"]||app.globalData.checking_flag){
      this.setData({
        checking_flag:true
      });
    }
    
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
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    //chooseLocation.setLocation(null);
  },
})