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
    announcement: "",
    new_announcement: "",
    picker_index: 0,
    picker: ["小白", "青铜", "白银", "黄金", "钻石"],
    activity_date: "",
    share_use_id: "",
    part_limit: 1,//0不限制参与，1限制参与,
    entire_part_info: [],
    group_name:"",
    hidden_del_tag:true,
    ungroup_partinfo_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("加载用户活动详情页");
    let activity_info = JSON.parse(decodeURIComponent(options.activity_info));
    let activity_user_info = JSON.parse(decodeURIComponent(options.activity_user_info));
    if (options.hasOwnProperty("share_use_id")) {
      let share_use_id = decodeURIComponent(options.share_use_id);

      this.setData({
        share_use_id: share_use_id
      });
    }
    console.log(activity_info);
    console.log(activity_user_info);
    var addendtime = activity_info["activity_date"] + " " + activity_info["addendtime"];
    this.setData({
      activity_info: activity_info,
      new_announcement: activity_info["announcement"],
      member: activity_info["member"],
      addendtime: addendtime,
      activity_user_info: activity_user_info,
      partinfo: activity_info.partinfo.split(","),
      share_res_limit: activity_info["part_limit"]
    });
    console.log(new Date(addendtime).getTime());
    console.log(new Date().getTime());

    var activity_date = util.convert_date(activity_info.activity_date);
    that.setData({
      activity_date: activity_date
    });
    wx.setNavigationBarTitle({
      title: activity_info.title
    })
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_memberlist', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_info.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.update_part_info(that, res);
        that.set_part_limit();

      },
      fail(res) {
        wx.showToast({
          title: "活动异常",
          icon: "error"
        })
      }
    });
    console.log("是否登录");
    console.log(app.globalData.hasUserInfo);
  },
  update_part_status() {
    console.log("更新update_part_status");
    console.log(this.data.addendtime);
    console.log(new Date(this.data.addendtime).getTime());
    console.log(new Date().getTime());
    this.setData({
      ispart: false,
      partbuttonmsg: "我要报名"
    });
    if (new Date(this.data.addendtime).getTime() < new Date().getTime()) {
      console.log("报名截止返回首页");
      this.setData({
        isend: true,
        partbuttonmsg: "报名截止返回首页"
      });
    }
    this.data.user_info_list.forEach(item => {
      console.log(item);
      if (item["user_id"] == app.globalData.login_userInfo["user_id"]) {
        console.log("已报名返回首页");
        //可以重复代为报名
        this.setData({
          
          //ispart: true,
          //partbuttonmsg: "已报名返回首页"
        });
      }
    });
  },
  update_part_info(that, res) {
    console.log("成员信息" + res.data);
    var result = res.data;
    console.log(result["avatarUrl_list"]);
    console.log(result["partinfo_keys"]);
    console.log(result["partinfo_values"]);
    console.log(result["user_info_part_info_list"]);
    var user_info_list = result["user_info_list"];
    console.log(user_info_list.length);
    var num = user_info_list.length;
    //这么搞才能刷新绑定的数据，不然不会刷新，似乎跟当初渲染的方式有关
    var info = that.data.activity_info;
    info["member"] = num;

    var avatarUrl_list = result["avatarUrl_list"];
    var partinfo_keys = result["partinfo_keys"];
    var partinfo_values = result["partinfo_values"];

    //测试用，创建20个参与人员
    var info = result["user_info_part_info_list"];
    console.log(info);
    var entire_part_info = [];
    //for (var i = 0; i < 20; i++) {
      //entire_part_info.push(JSON.parse(JSON.stringify(info[0])));
    //}
    //console.log(entire_part_info);
    //entire_part_info.push(JSON.parse(JSON.stringify(info)));
    that.setData({
      avatarUrl_list: avatarUrl_list,
      partinfo_keys: partinfo_keys,
      partinfo_values: partinfo_values,
      user_info_list: user_info_list,
      ungroup_partinfo_list:info,
      entire_part_info: info
    });
    that.update_part_status();
  },
  chat_with(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var chat_user_info = this.data.user_info_list[index];
    if (chat_user_info["user_id"] != app.globalData.login_userInfo["user_id"]) {
      wx.navigateTo({
        url: '../chat/chat?friend_user_info=' + encodeURIComponent(JSON.stringify(chat_user_info)),
      });

    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  PickerChange(e) {
    console.log(e);
    var info = this.data.partinfoinput;
    info["段位"] = this.data.picker[e.detail.value];
    this.setData({
      picker_index: e.detail.value,
      partinfoinput: info
    });
  },
  cancel_part() {
    console.log("取消报名");
    var that = this;
    that.setData({
      ispart: false
    })
    wx.request({
      url: app.globalData.hosturl + 'delete_member', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": that.data.activity_info.id,
        "user_id": app.globalData.login_userInfo["user_id"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        that.update_part_info(that, res);

      }
    });
  },

  delete_member(e) {
    console.log("移除成员");
    var that = this;

    var index = e.currentTarget.dataset.index;
    var user_id = this.data.user_info_list[index]["user_id"];
    wx.request({
      url: app.globalData.hosturl + 'delete_member', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": that.data.activity_info.id,
        "user_id": user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.update_part_info(that, res);
        that.setData({
          modalName: null
        })

      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.openid == this.data.activity_user_info["user_id"] || app.globalData.checking_flag) {
      this.setData({
        checking_flag: true
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
  set_part_limit() {
    var part_limit = 1;//限制参与
    var share_user_id = this.data.share_use_id;
    if (this.data.activity_info["part_limit"] == 1) {//"通过发起人和成员分享可以参与"

      this.data.user_info_list.forEach(item => {
        console.log(item);
        if (item["user_id"] == share_user_id) {//成员
          part_limit = 0;//不限制参与
          //break;
        }
      });
      if (this.data.activity_user_info["user_id"] == share_user_id) {
        part_limit = 0;//不限制参与
      }
    } else if (this.data.activity_info["part_limit"] == 2) {//"通过发起人分享可以参与"
      if (this.data.activity_user_info["user_id"] == share_user_id) {
        part_limit = 0;//不限制参与
      }

    } else if (this.data.activity_info["part_limit"] == 0) {//"所有人均可参与"
      part_limit = 0;//不限制参与
    }
    this.setData({
      part_limit: part_limit
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var bgurl = app.globalData.hosturl + "static/" + this.data.activity_info["id"] + ".jpg";
    let activity_info = encodeURIComponent(JSON.stringify(this.data.activity_info));
    console.log("小程序分享onShareAppMessage");
    //var share_res_limit = this.get_share_limit();//0不限制参与，1限制参与
    var share_use_id = "";
    if (app.globalData.login_userInfo.hasOwnProperty("user_id")) {
      share_use_id = app.globalData.login_userInfo["user_id"];
    } else {
      console.log("用户未登录，无法获取用户信息");
    }
    let activity_user_info = encodeURIComponent(JSON.stringify(this.data.activity_user_info));
    return {
      title: this.data.activity_info["title"],
      //desc: '自定义分享描述',
      path: '/pages/activityshowinfo/activityshowinfo?activity_user_info=' + activity_user_info + "&activity_info=" + activity_info + "&share_use_id=" + share_use_id,
      //imageUrl:bgurl,
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log("成功", res)
        }
      },
      fail: function (res) {
        console.log("失败", res)
      }
    }
  },
  partinfoInput(event) {
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
  part_activity() {
    if (this.data.isend || this.data.ispart) {
      //返回首页的活动页。
      wx.navigateTo({
        url: '../index/index?activity_id=' + encodeURIComponent(JSON.stringify({ "activity_id": this.data.activity_info.id }))
      })
      return;
    }
    if (this.data.part_limit != 0 && this.data.activity_user_info["user_id"] != app.globalData.login_userInfo["user_id"]) {
      wx.showToast({
        title: '请通过分享报名',
        icon: 'error',
        duration: 2000
      });
      return;
    }
    if (Object.keys(this.data.partinfoinput).length != this.data.partinfo.length) {
      wx.showToast({
        title: '请填写报名信息',
        icon: 'error',
        duration: 1000
      })
    } else {
      var that = this;
      if (!app.globalData.hasUserInfo) {
        wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            console.log("按钮获取用户信息 " + res.userInfo.nickName)
            app.globalData.login_userInfo = res.userInfo;
            app.globalData.hasUserInfo = true;
            console.log("报名的用户id" + app.globalData.openid);
            console.log(this.data.activity_info);
            app.globalData.onSockettest.emit('newmember', { activity_id: this.data.activity_info.id, user_id: app.globalData.openid, partinfo: JSON.stringify(this.data.partinfoinput), latitude: this.data.activity_info.latitude, longitude: this.data.activity_info.longitude });
            app.store_userInfo();
            //返回首页的活动页。
            wx.navigateTo({
              url: '../index/index?activity_id=' + encodeURIComponent(JSON.stringify({ "activity_id": this.data.activity_info.id }))
            })
          }
        });
      } else {
        console.log("报名的用户id" + app.globalData.openid);
        console.log(this.data.activity_info);
        app.globalData.onSockettest.emit('newmember', { activity_id: this.data.activity_info.id, user_id: app.globalData.openid, partinfo: JSON.stringify(this.data.partinfoinput), latitude: this.data.activity_info.latitude, longitude: this.data.activity_info.longitude });
        //return;
        //返回首页的活动页。
        wx.navigateTo({
          url: '../index/index?activity_id=' + encodeURIComponent(JSON.stringify({ "activity_id": this.data.activity_info.id }))
        })
      }


    }
  },
  showModal(e) {
    if (this.data.user_info_list.length == 0) {
      wx.showToast({
        title: '来一起参与吧',
        icon: "none",
        duration: 2000
      })
      return;
    }
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  show_info_modal(e) {

    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  update_activity_announcement() {
    var that = this;
    this.setData({
      modalName: null
    })
    wx.request({
      url: app.globalData.hosturl + 'update_activity_announcement', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": this.data.activity_info.id,
        "announcement": this.data.announcement
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //that.update_part_info(that,res);
        console.log(res.data.announcement);
        that.setData({
          new_announcement: res.data.announcement
        });

      },
      fail(res) {
        wx.showToast({
          title: "网路异常",
          icon: "error"
        })
      }
    });

  },
  detailInput(e) {
    this.setData({
      announcement: e.detail.value
    })
  },
  onShareTimeline() {
    var bgurl = app.globalData.hosturl + "static/" + this.data.activity_info["id"] + ".jpg";
    let activity_info = encodeURIComponent(JSON.stringify(this.data.activity_info));
    console.log("小程序分享onShareTimeline");
    //var share_res_limit = this.get_share_limit();//0不限制参与，1限制参与
    var share_use_id = "";
    if (app.globalData.login_userInfo.hasOwnProperty("user_id")) {
      share_use_id = app.globalData.login_userInfo["user_id"];
    } else {
      console.log("用户未登录，无法获取用户信息");
    }
    let activity_user_info = encodeURIComponent(JSON.stringify(this.data.activity_user_info));
    return {
      title: this.data.activity_info["title"],
      //desc: '自定义分享描述',
      path: '/pages/activityshowinfo/activityshowinfo?activity_user_info=' + activity_user_info + "&activity_info=" + activity_info + "&share_use_id=" + share_use_id,
      //imageUrl:bgurl,
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log("成功", res)
        }
      },
      fail: function (res) {
        console.log("失败", res)
      }
    }
  },
  edit_group_name(e) {
    this.setData({
      group_name: e.detail.value
    })
  },
  //添加分组成员
  add_group_member() {
    let ungroup_partinfo_list = encodeURIComponent(JSON.stringify(this.data.ungroup_partinfo_list));

    wx.navigateTo({
      url: 'partuser?ungroup_partinfo_list='+ungroup_partinfo_list,
    })
  },
  edit_group_member() {
    this.setData({
      hidden_del_tag:false
    })
  },
  del_group_member(that,app,activity_id="") {
  
  },
  save_group(that,app,activity_id="") {
  
  }
})