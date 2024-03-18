//const chooseLocation = requirePlugin('chooseLocation');
const app = getApp();
const util = require("../../utils/util.js");
const score = require("score.js");
const share = require("share.js");
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
    part_flag: false,//是否参与
    part_member_num: "",//当前用户参与的编号
    like_flag: false,
    isend: false,
    partbuttonmsg: "我要报名",
    modalName: "",
    avatarUrl_list: [],
    partinfo_keys: [],
    partinfo_values: [],
    user_info_list: [],
    addendtime: "",
    member: 0,
    hosturl: app.globalData.hosturl,
    admin_flag: false,//是否是发布者，超级权限：编辑活动，删除成员
    announcement: "",
    new_announcement: "",
    partinfo_sex:"",
    picker_index: 0,
    picker: ["1级", "2级", "3级", "4级", "5级", "6级", "7级", "8级", "9级", "10级"],
    activity_date: "",
    share_use_id: "",
    part_limit: 1,//0不限制参与，1限制参与,
    entire_part_info: [],
    group_name: "",
    hidden_del_tag: true,
    ungroup_partinfo_list: [],
    pre_edit_group: [],//老的分组成员
    current_edit_group: [],//当前分组成员
    all_group_tag_dict: {},
    all_group_tag_list: [],
    disable_save_group: true,
    current_swiper_item_index: 0,
    sort_users_score: {},
    sort_users_score_empty_flag: true,
    member_users: {},
    login_user_part_list: [],
    cancel_part_members: [],
    confirm_cancel_part: false,
    like_dict: {},
    group_tag: "",//编辑分组
    group_room: "",//编辑分组
    group_limit: "",//编辑分组
    edit_group_tag_dict: {},//编辑分组
    triggered: false,
    moods: [],
    mood_img_list: [],
    select_group_tag: ""//报名所选择的分组
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
    var addendtime = activity_info["addendtime"];
    this.setData({
      activity_info: activity_info,
      new_announcement: activity_info["announcement"],
      member: activity_info["member"],
      addendtime: addendtime,
      activity_user_info: activity_user_info,
      partinfo: activity_info.partinfo == "" ? [] : activity_info.partinfo.split(","),
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
    this.init_activity_all_info(activity_info);
  },
  init_activity_all_info(activity_info) {
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_memberlist', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_info.activity_id,
        "hobby_tag":activity_info.activity_tag
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
    score.get_pk_groups_list(app.globalData.hosturl, that, activity_info.activity_id)
    score.get_like_list(app.globalData.hosturl, that, activity_info.activity_id)
    share.get_activity_moods(app.globalData.hosturl, that, activity_info.activity_id)
  },
  show_user_detail(e) {
    var all_group_tag_list = this.data.all_group_tag_list;
    var group_tag = e.currentTarget.dataset.tag;
    console.log(group_tag);
    all_group_tag_list.forEach(item => {
      if (item["group_tag"] == group_tag) {
        item["show_flag"] = !(item.show_flag);
      }
    })
    this.setData({ all_group_tag_list })
    //console.log();

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
    var all_group_tag_dict = {};
    var ungroup_partinfo_list = [];
    var member_users = {};
    var part_member_num = that.data.part_member_num;
    var login_user_part_list = [];
    console.log(info);
    //提取分组信息
    info.forEach(item => {
      if (item["group_tag"] != "" && item["group_tag"] != null) {
        console.log(item["group_tag"]);
        var tag = item["group_tag"];
        if (all_group_tag_dict[tag] != undefined) {
          all_group_tag_dict[tag].push(item);
        } else {
          all_group_tag_dict[tag] = [item];
        }
        console.log(all_group_tag_dict);
      } else {
        ungroup_partinfo_list.push(item);
      }
      if (item["user_id"] == app.globalData.login_userInfo["user_id"]) {
        login_user_part_list.push(item)
      }
      //初始化成员的字典形式数据，方便wxml获取
      var member_num = item.member_num;
      member_users[member_num] = item;
      //对于重复报名的人，选择第一个member_num作为其member_num,当然首先会保证报名按照member_num或者报名时间升序排列
      //都能保证重复的报名时靠后的
      console.log("找到当前参加的编号")
      if (item["user_id"] == app.globalData.login_userInfo["user_id"] && part_member_num == "") {
        part_member_num = item["member_num"];
        var partinfo = that.data.partinfo;
        //有参与编号代表已参与，已参与如果重复报名需要提供姓名，性别
        if(partinfo.indexOf("姓名") == -1){//没找到
          partinfo.push("姓名")
        }
        if(partinfo.indexOf("性别") == -1){//没找到
          partinfo.push("性别")
        }
        that.setData({
          part_flag: true,
          part_member_num: item["member_num"]
        })
      }

    })
    var all_group_tag_list = [];
    for (var group_tag in all_group_tag_dict) {
      all_group_tag_list.push({ "group_tag": group_tag, "group_users": all_group_tag_dict[group_tag], "show_flag": false });
    }
    console.log("分组信息");
    console.log(all_group_tag_dict);
    console.log(all_group_tag_list);
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
      ungroup_partinfo_list: ungroup_partinfo_list,
      entire_part_info: info,
      all_group_tag_list: all_group_tag_list,
      all_group_tag_dict: all_group_tag_dict,
      member_users: member_users,
      login_user_part_list: login_user_part_list
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
  choosesex(e){
    var value = e.currentTarget.dataset.sex;
    var info = this.data.partinfoinput;
    info["性别"] = value;
    this.setData({
      partinfo_sex:value,
      partinfoinput: info
    });
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
  listenCheckboxChange(e) {
    console.log('当checkbox-group中的checkbox选中或者取消是我被调用');
    //打印对象包含的详细信息
    console.log(e.detail.value);//数组
    var cancel_part_members = e.detail.value;
    this.setData({
      cancel_part_members: cancel_part_members
    })

  },
  confirm_cancel_part() {
    var that = this;
    wx.showLoading({
      title: '取消报名...',
    })
    wx.request({
      url: app.globalData.hosturl + 'delete_member', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": that.data.activity_info.activity_id,
        "cancel_part_members": that.data.cancel_part_members,
        "begintime": that.data.activity_info["begintime"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.update_part_info(that, res);
        wx.hideLoading();
      }
    });
    this.setData({
      modalName: "",
      cancel_part_members: []
    })
  },
  cancel_part() {
    console.log("取消报名");
    if (this.data.login_user_part_list.length > 1) {
      this.setData({
        modalName: "Modal_cancel_part"
      })
      return
    } else {
      var cancel_part_members = this.data.cancel_part_members;
      cancel_part_members.push(this.data.login_user_part_list[0]["member_num"])
      this.setData({ cancel_part_members });
      this.confirm_cancel_part()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log("onshow加载");
    if (app.globalData.openid == this.data.activity_user_info["user_id"] || app.globalData.checking_flag) {
      this.setData({
        admin_flag: true
      });
    }
    //这是针对选择分组成员之后的数据更新，从partuser界面返回
    var edit_group_user = app.globalData.edit_group_user;
    var current_edit_group = this.data.current_edit_group;
    var ungroup_partinfo_list = this.data.ungroup_partinfo_list;
    var new_ungroup_partinfo_list = [];
    console.log(edit_group_user);
    console.log(current_edit_group);
    console.log(typeof (edit_group_user));
    ungroup_partinfo_list.forEach(item => {
      console.log(item);
      console.log([1, 2].includes(1));
      if (edit_group_user.includes(item["member_num"].toString())) {
        current_edit_group.push(item);
      } else {
        new_ungroup_partinfo_list.push(item);
      }
    });
    this.setData({
      current_edit_group: current_edit_group,
      hidden_del_tag: true,
      ungroup_partinfo_list: new_ungroup_partinfo_list
    });
    console.log(current_edit_group);
    app.globalData.edit_group_user = [];//app只短暂存储编辑选择的分组成员
    this.update_save_group_button_status();
    //重新加载见闻的图片记录
    if (app.globalData.reload_activity_share_moods == true) {
      app.globalData.reload_activity_share_moods = false;
      share.get_activity_moods(app.globalData.hosturl, this, this.data.activity_info.activity_id);
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
  //
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
  navigateToIndex() {
    //返回首页的活动页。
    app.globalData.current_activity_id = this.data.activity_info.activity_id;
    wx.switchTab({
      url: '../index/index'
    })
  },
  part_activity() {

    //["通过发起人分享可以参与","通过发起人和成员分享可以参与","所有人均可参与"]
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
            app.globalData.onSockettest.emit('newmember', { activity_id: this.data.activity_info.id, user_id: app.globalData.openid, partinfo: JSON.stringify(this.data.partinfoinput), latitude: this.data.activity_info.latitude, longitude: this.data.activity_info.longitude, "activity_tag": this.data.activity_info.activity_tag, "group_tag": this.data.select_group_tag });
            app.store_userInfo();
            //返回首页的活动页。
            app.globalData.current_activity_id = this.data.activity_info.activity_id;
            wx.switchTab({
              url: '../index/index'
            })
          }
        });
      } else {
        console.log("报名的用户id" + app.globalData.openid);
        console.log(this.data.activity_info);
        app.globalData.onSockettest.emit('newmember', { activity_id: this.data.activity_info.activity_id, user_id: app.globalData.openid, partinfo: JSON.stringify(this.data.partinfoinput), latitude: this.data.activity_info.latitude, longitude: this.data.activity_info.longitude, "activity_tag": this.data.activity_info.activity_tag, "group_tag": this.data.select_group_tag });
        //return;
        //返回首页的活动页。
        app.globalData.current_activity_id = this.data.activity_info.activity_id;
        wx.switchTab({
          url: '../index/index'
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
  edit_group_tag(e) {
    console.log("分组标签" + e.detail.value);
    var group_tag = e.detail.value.trim();
    this.setData({
      group_tag: e.detail.value.trim()
    });
    this.update_save_group_button_status();
  },
  edit_group_room(e) {
    console.log("分组标签" + e.detail.value);
    var group_room = e.detail.value.trim();
    this.setData({
      group_room: e.detail.value.trim()
    });
    this.update_save_group_button_status();
  },
  edit_group_limit(e) {
    console.log("分组标签" + e.detail.value);
    var group_limit = e.detail.value.trim();
    this.setData({
      group_limit: e.detail.value.trim()
    });
    this.update_save_group_button_status();
  },
  update_save_group_button_status() {
    console.log("update_save_group_button_status分组标签：" + this.data.group_name);
    if (this.data.group_tag == "" || this.data.group_room == "" || this.data.group_limit == "" || this.data.current_edit_group.length == 0) {
      this.setData({
        disable_save_group: true
      })
    } else {
      this.setData({
        disable_save_group: false
      })
    }
  },
  //添加分组成员
  add_group_member() {
    if (this.data.ungroup_partinfo_list.length == 0) {
      wx.showToast({
        title: '活动成员已全部分组',
        icon: "none"
      })
      return;
    }
    let ungroup_partinfo_list = encodeURIComponent(JSON.stringify(this.data.ungroup_partinfo_list));

    wx.navigateTo({
      url: 'partuser?ungroup_partinfo_list=' + ungroup_partinfo_list,
    })
  },
  edit_group_member() {
    this.setData({
      hidden_del_tag: false
    })
  },
  del_group_member(e) {
    console.log(e.currentTarget.dataset.num);
    var member_num = e.currentTarget.dataset.num;
    console.log(typeof (member_num));//number
    var new_current_edit_group = [];
    var ungroup_partinfo_list = this.data.ungroup_partinfo_list;
    this.data.current_edit_group.forEach(item => {
      if (item["member_num"] != member_num) {

        new_current_edit_group.push(item);
      } else {
        console.log(item["member_num"] + "被删")
        ungroup_partinfo_list.push(item);
      }
    })
    this.setData({
      current_edit_group: new_current_edit_group,
      ungroup_partinfo_list: ungroup_partinfo_list
    })
  },

  delete_member(e) {
    console.log("移除成员");
    var that = this;
    var membernum = e.currentTarget.dataset.membernum;
    var cancel_part_members = [membernum]
    wx.request({
      url: app.globalData.hosturl + 'delete_member', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": that.data.activity_info.activity_id,
        "cancel_part_members": cancel_part_members
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.update_part_info(that, res);
      }
    });
  },
  clear_group(e) {
    var that = this;
    console.log(e.currentTarget.dataset.tag);
    var group_tag = e.currentTarget.dataset.tag;
    var current = this.data.all_group_tag_dict[group_tag];
    var group_users = []
    current.forEach(item => {
      var temp = {}
      temp["member_num"] = item["member_num"]
      temp["group_tag"] = ""
      group_users.push(temp)
    })
    //更新成员对应的分组标签
    wx.request({
      url: app.globalData.hosturl + 'edit_part_user_group', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": this.data.activity_info.activity_id,
        "group_users": group_users,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        app.globalData.edit_group_user = [];
        app.globalData.group_sel_values = [];

        that.update_part_info(that, res);
      }
    })

    //更新活动的分组列表
    wx.request({
      url: app.globalData.hosturl + 'update_activity_group_tag_dict', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": that.data.activity_info.activity_id,
        "old_group_tag": group_tag,
        "new_group_tag_dict": {}
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data != "") {
          var activity_info = that.data.activity_info;
          activity_info.group_tag_dict = res.data;
          that.setData({ activity_info: activity_info })
        }

      }
    })
  },
  save_group() {
    console.log("保存分组");
    console.log(this.data.current_edit_group);
    var that = this;
    var group_tag = this.data.group_tag;
    var group_users = this.data.current_edit_group;
    console.log(group_users[0].group_tag);
    var pre_group_users = this.data.pre_edit_group;
    var old_group_tag = "";
    if (pre_group_users.length > 0) {
      old_group_tag = pre_group_users[0].group_tag;
    }
    var new_group_tag_dict = { "name": group_tag, "room": this.data.group_room, "limit": this.data.group_limit }
    var params = [];

    pre_group_users.forEach(item => {
      console.log("先跑这里了？" + item["group_tag"]);
      item["group_tag"] = "";
    })
    console.log("查看pre_group_users处理之后的状态");
    console.log(group_users);
    group_users.forEach(item => {
      item["group_tag"] = group_tag;
    })
    group_users.forEach(item => {
      var temp = {};
      temp["member_num"] = item.member_num;
      temp["group_tag"] = item.group_tag;
      params.push(temp);
    })
    pre_group_users.forEach(item => {
      var temp = {};
      temp["member_num"] = item.member_num;
      temp["group_tag"] = item.group_tag;
      params.push(temp);
    })
    console.log(group_users);
    console.log(params);
    //更新成员对应的分组标签
    wx.request({
      url: app.globalData.hosturl + 'edit_part_user_group', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": that.data.activity_info.activity_id,
        "group_users": JSON.stringify(params),
        "activity_tag":that.data.activity_info.activity_tag
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        app.globalData.edit_group_user = [];
        app.globalData.group_sel_values = [];
        that.setData({
          current_edit_group: [],
          group_tag: ""
        });
        that.update_part_info(that, res);
      }
    })
    //更新活动的分组列表
    wx.request({
      url: app.globalData.hosturl + 'update_activity_group_tag_dict',
      data: {
        "activity_id": that.data.activity_info.activity_id,
        "old_group_tag": old_group_tag,
        "new_group_tag_dict": new_group_tag_dict
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data != "") {
          var activity_info = that.data.activity_info;
          activity_info.group_tag_dict = res.data;
          that.setData({ activity_info: activity_info })
        }

      }
    })
    that.setData({
      group_tag: "",
      group_room: "",
      group_limit: "",
      disable_save_group: true
    })
  },
  edit_completed_group(e) {
    console.log(e.currentTarget.dataset.tag);
    var group_tag = e.currentTarget.dataset.tag;
    var current = this.data.all_group_tag_dict[group_tag];
    var edit_group_tag_dict = this.data.activity_info["group_tag_dict"][group_tag]
    console.log(current);
    this.setData({
      current_edit_group: current,
      pre_edit_group: current,
      edit_group_tag_dict: edit_group_tag_dict,
      group_tag: group_tag,
      group_room: edit_group_tag_dict["room"],
      group_limit: edit_group_tag_dict["limit"],
      disable_save_group: false,
      hidden_del_tag: true
    })
    app.globalData.edit_group_user = []
    console.log(this.data.current_edit_group);
  },
  pk_page(e) {
    console.log(e.currentTarget.dataset.tag);
    var group_tag = e.currentTarget.dataset.tag;
    var groups = "";
    if (group_tag == "") {
      groups = this.data.ungroup_partinfo_list;
    } else {
      groups = this.data.all_group_tag_dict[group_tag];
    }
    //all_group_tag_dict
    let group_users = encodeURIComponent(JSON.stringify(groups));

    wx.navigateTo({
      url: 'pkpage?group_users=' + group_users + '&&group_tag=' + group_tag + '&&activity_id=' + this.data.activity_info.activity_id + '&&activity_info=' + encodeURIComponent(JSON.stringify(this.data.activity_info))
    })
  },
  swiper_change(event) {
    console.log("swiper_change")
    console.log(event);
    this.setData({
      current_swiper_item_index: event.detail.current
    })
    //进入排名界面
    if (event.detail.current == 2) {
      //要对点赞情况进行初始化
      var like_dict = score.is_like(this.data.part_member_num, this.data.like_dict);
      this.setData({
        like_dict: like_dict
      })
    }
  },
  like(e) {
    var like_member_group = e.currentTarget.dataset.likemembergroup;
    var part_member_num = this.data.part_member_num;
    var that = this;
    var url = "";//去点赞
    var like_dict = this.data.like_dict;
    if (!like_dict.hasOwnProperty(like_member_group)) {
      like_dict[like_member_group] = { "like_flag": false, "member_nums": [] };
    }
    var member_nums = like_dict[like_member_group]["member_nums"];
    if (like_dict[like_member_group]["like_flag"] == true) {
      url = "del_activity_member_like"//取消点赞
      like_dict[like_member_group]["like_flag"] = false;
      member_nums.splice(member_nums.indexOf(part_member_num), 1)//删除
    } else {
      url = "like_activity_member";//去点赞
      like_dict[like_member_group]["like_flag"] = true;
      member_nums.push(part_member_num)//新增
    }
    this.setData({
      like_dict: like_dict
    })
    wx.request({
      url: app.globalData.hosturl + url, //仅为示例，并非真实的接口地址
      data: {
        "activity_id": that.data.activity_info.activity_id,
        "like_member_group": like_member_group,
        "member_num": part_member_num
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("点赞了")
      },
      fail(res) {
        wx.showToast({
          title: "服务器异常",
          icon: "error"
        })
      }
    });

  },
  update_activity_info() {
    //直接跳转到创建activity的界面
    let activity_info = encodeURIComponent(JSON.stringify(this.data.activity_info));
    wx.navigateTo({
      url: '../activity/activity?activity_info=' + activity_info + "&&test=test"
    })
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onScrollRefresh() {
    console.log("下拉刷新" + this.data.triggered)
    var that = this;
    setTimeout(function () {
      that.setData({
        triggered: false,
      })
    }, 2000);
    this.init_activity_all_info(this.data.activity_info);
  },
  recore_mood() {
    wx.navigateTo({
      url: 'share_mood?activity_id=' + this.data.activity_info["activity_id"],
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.mood_img_list,
      current: e.currentTarget.dataset.url
    });
  },
  listenRadioChange(e) {
    console.log(e.detail.value);
    var sel_value = e.detail.value;
    this.setData({
      select_group_tag: sel_value
    })
  }
})