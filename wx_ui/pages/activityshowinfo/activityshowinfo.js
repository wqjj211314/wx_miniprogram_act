//const chooseLocation = requirePlugin('chooseLocation');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_info:[],
    activity_user_info:[],
    partinfo:[],
    partinfo_list:[],
    partinfoinput:{},
    memberlist:{},
    ispart:false,
    partbuttonmsg:"我要报名",
    modalName:"",
    avatarUrl_list:[],
    partinfo_keys:[],
    partinfo_values:[]



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let activity_info = JSON.parse(decodeURIComponent(options.activity_info));
    let activity_user_info = JSON.parse(decodeURIComponent(options.activity_user_info));
    console.log(activity_info);
    console.log(activity_user_info)
    this.setData({
      activity_info:activity_info,
      activity_user_info:activity_user_info,
      partinfo:activity_info.partinfo.split(",")
    });


    var that = this;
    wx.request({
      url: app.globalData.hosturl+'get_memberlist', //仅为示例，并非真实的接口地址
      data: {
        "activity_id":activity_info.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log("成员信息"+res.data);
        var result = res.data;
        console.log(result["avatarUrl_list"]);
        console.log(result["partinfo_keys"]);
        console.log(result["partinfo_values"]);
        var activity_member_info_list = res.data;
        var partinfo_list = [];
        var avatarUrl_list = result["avatarUrl_list"];
        var partinfo_keys = result["partinfo_keys"];
        var partinfo_values = result["partinfo_values"];
        that.setData({
          avatarUrl_list:avatarUrl_list,
          partinfo_keys:partinfo_keys,
          partinfo_values:partinfo_values
        });

        /** 
        for(var item in activity_member_info_list){
          var partinfo = JSON.parse(item["partinfo"]);
          partinfo_list.push(partinfo);
        }
        that.setData({
          memberlist:res.data,
          partinfo_list:partinfo_list
        });
       
        that.data.memberlist.forEach(element => {
          if(element.user_id == app.globalData.openid){
            console.log("");
            that.setData({
              ispart:true,
              partbuttonmsg:"已报名返回首页"
            });
          }
        });
        */
      }
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  partinfoInput(event){
    var partinfokey = event.target.dataset.value
    var partinfovalue = event.detail.value;
    //var json = {partinfokey:partinfovalue};
    var info = this.data.partinfoinput;
    info[partinfokey] = partinfovalue
    this.setData({
      partinfoinput: info
    });
    console.log(info);
  },
  part_activity(){
    if(this.data.ispart){
      //最后就是返回上一个页面。
      wx.navigateBack({
        delta: 1  // 返回上一级页面。
      })
      return
    }
    if(Object.keys(this.data.partinfoinput).length!=this.data.partinfo.length){
      wx.showToast({
        title: '请填写报名信息',
        icon: 'error',
        duration: 1000
      })
    }else{
        var that =this;
        if(!app.globalData.hasUserInfo){
          wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              console.log("按钮获取用户信息 "+res.userInfo.nickName)
              app.globalData.login_userInfo = res.userInfo;
              app.globalData.hasUserInfo = true;
              console.log("报名的用户id"+app.globalData.openid);
              app.globalData.onSockettest.emit('newmember', {activity_id:this.data.activity_info.id,user_id:app.globalData.openid,partinfo: JSON.stringify(this.data.partinfoinput)});
              //最后就是返回上一个页面。
              wx.navigateBack({
                delta: 1  // 返回上一级页面。
              })
            }
          });
        }else{
          console.log("报名的用户id"+app.globalData.openid);
          app.globalData.onSockettest.emit('newmember', {activity_id:this.data.activity_info.id,user_id:app.globalData.openid,partinfo: JSON.stringify(this.data.partinfoinput)});
          //最后就是返回上一个页面。
          wx.navigateBack({
            delta: 1  // 返回上一级页面。
          })
        }
      
        
    }
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
 
})