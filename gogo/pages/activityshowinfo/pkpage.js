// pages/activityshowinfo/pkpage.js
const app = getApp();
const score = require("score.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_info: {},
    is_begin: false,
    is_end: true,
    is_addend: false,
    is_cancelend: false,
    activity_id: "",
    group_tag: "",
    modalName: "",
    sample_group: [[[0, 1], [2, 3]], [[0, 1], [4, 5]], [[2, 3], [4, 5]], [[0, 2], [1, 3]], [[0, 4], [1, 5]], [[2, 4], [3, 5]], [[0, 3], [1, 2]], [[0, 5], [1, 4]], [[2, 5], [3, 4]]],
    group_users: [],//这是当前分组的成员，数组形式
    sel_pk_group_member_list: [],
    sel_pk_group_user_list: [],//选择的对阵成员列表，默认是所有成员
    admin_users: [],
    admin_flag: false,
    show_member_info_flag: false,
    boy_num: 0,
    boy_member_num_list: [],
    girl_num: 0,
    girl_member_num_list: [],
    member_users: {},//当前分组成员的字典形式，“#1”是key，成员信息是value
    all_pk_info: {},//获取到的当前group_tag的Activitymemberpk信息
    pk_groups: [],
    custom_pk_group: [],
    edit_pk_group_index: 0,
    score_pk_group: [[0, 1], [2, 3]],
    pk_group_score: [],
    pk_group_score_tags: [],
    sort_users_score: {},
    sort_users_score_list: [],
    sort_users_score_empty_flag: true,
    sort_groups_score: {},
    hidden_pk_group: false,
    hidden_score_list: false,
    triggered: false,
    submit_flag: false,
    method: "",//对阵选项的方法调用
    method_tip: "",
    show_edit_flag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("onLoad加载");
    let group_users = JSON.parse(decodeURIComponent(options.group_users));
    let group_tag = options.group_tag;
    var boy_num = 0;
    var boy_member_num_list = [];
    var girl_num = 0;
    var girl_member_num_list = [];

    //初始化成员的字典形式数据，方便wxml获取
    //var member_users = {}
    var admin_users = [];
    var sel_pk_group_member_list = [];
    var sel_pk_group_user_list = [];

    group_users.forEach(item => {
      var member_num = item.member_num;
      sel_pk_group_member_list.push(member_num);
      sel_pk_group_user_list.push(item);
      //member_users[member_num] = item;
      if (item.admin_status == 1) {
        admin_users.push(item);
        if (item.user_id == app.globalData.login_userInfo["user_id"]) {
          this.setData({
            admin_flag: true
          })
        }
      }
      if (item.gender == "0") {
        girl_num = girl_num + 1;
        girl_member_num_list.push(item.member_num)
      } else if (item.gender == "1") {
        boy_num = boy_num + 1;
        boy_member_num_list.push(item.member_num)
      }
    })
    if (admin_users.length == 0 || this.data.activity_info["user_id"] == app.globalData.login_userInfo["user_id"]) {
      this.setData({
        admin_flag: true
      })
    }
    var activity_tag = JSON.parse(decodeURIComponent(options.activity_info)).activity_tag;
    var activity_info = JSON.parse(decodeURIComponent(options.activity_info));
    this.setData({
      group_users: group_users,
      sel_pk_group_member_list: sel_pk_group_member_list,
      sel_pk_group_user_list: sel_pk_group_user_list,
      boy_num: boy_num,
      boy_member_num_list: boy_member_num_list,
      girl_num: girl_num,
      girl_member_num_list: girl_member_num_list,
      group_tag: group_tag,
      member_users: JSON.parse(decodeURIComponent(options.member_users)),
      activity_id: options.activity_id,
      room: options.room,
      activity_info: activity_info,
      admin_users: admin_users,
      is_begin: new Date(activity_info["begintime"]) - new Date() <= 0,
      is_end: new Date(activity_info["endtime"]) - new Date() <= 0,
      is_addend: new Date(activity_info["addendtime"]) - new Date() <= 0,
      is_cancelend: new Date(activity_info["cancelendtime"]) - new Date() <= 0,
    })
    //获取已存储的对阵列表
    score.get_pk_groups(app.globalData.hosturl, this, options.activity_id, group_tag, activity_tag);
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(function(){
      wx.hideLoading()
    },2500)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log("onshow加载");

    var edit_group_user = app.globalData.edit_group_user;
    var edit_index = app.globalData.edit_index;
    console.log(edit_index);
    var custom_pk_group = this.data.custom_pk_group;
    custom_pk_group[edit_index] = edit_group_user;
    app.globalData.edit_group_user = [];
    console.log(edit_group_user)
    console.log(custom_pk_group)
    this.setData({
      custom_pk_group
    })
    var timestamp = new Date().getTime();
    console.log(timestamp)
    timestamp = Math.floor(timestamp / 1000)
    console.log(typeof (timestamp))
    var store_admin_timestamp = wx.getStorageSync("pk_admin_timestamp");

    console.log(store_admin_timestamp)
    if (this.data.admin_users.length > 0 && (store_admin_timestamp == "" || store_admin_timestamp == undefined || (timestamp - Number(store_admin_timestamp) > 7776000))) {
      wx.showModal({
        title: '操作说明',
        content: '当前分组已指定管理员，仅管理员可以操作新增修改对阵列表和比分等信息！',
        complete: (res) => {
          if (res.cancel) {

          }

          if (res.confirm) {
            wx.setStorageSync('pk_admin_timestamp', timestamp);
          }
        }
      })
    }
    if (app.globalData.fix_partner_pk_groups.length > 0) {
      console.log(app.globalData.fix_partner_pk_groups)
      this.setData({
        pk_groups: this.data.pk_groups.concat(app.globalData.fix_partner_pk_groups),
        submit_flag: true
      })
      app.globalData.fix_partner_pk_groups = []
    }
  },


  show_user_detail() {
    this.setData({
      show_member_info_flag: !this.data.show_member_info_flag
    })
  },
  show_modal(e) {
    console.log(e.currentTarget.dataset.target)
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: ""
    })
  },
  getvs(sample) {
    //[[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]]
    //[[[0], [2]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]]
    //var score = new Array(len).fill(0);
    var pk_groups = [];
    var that = this;
    sample.forEach((item) => {
      var pk_num = item.length;//几方对阵？对阵方数量
      var pk_group = [];
      item.forEach((each_group_sample) => {
        var group_user_num = each_group_sample.length;//一方出战多少人，每个对阵方几个人
        var each_group = [];
        console.log(each_group_sample);
        each_group_sample.forEach((num_index) => {
          console.log(num_index);
          each_group.push(that.data.sel_pk_group_user_list[num_index].member_num)
        })
        pk_group.push(each_group);
      })
      var score = new Array(pk_num).fill(0);
      var score_tags = [];
      //score[score.length-1] = "";//比分标签
      pk_group.push(score);
      pk_group.push(score_tags);
      pk_groups.push(pk_group);
    });
    return pk_groups;
  },
  get2v2() {
    var sample4 = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]];
    var sample5 = [[[0, 1], [2, 3]], [[0, 2], [1, 4]], [[0, 3], [2, 4]], [[0, 4], [1, 3]], [[1, 2], [3, 4]]];
    var sample6 = [[[0, 1], [2, 3]], [[0, 2], [4, 5]], [[1, 4], [3, 5]], [[0, 3], [1, 2]], [[0, 4], [2, 5]], [[1, 5], [3, 4]], [[0, 5], [1, 3]], [[0, 5], [2, 4]]]
    var sample7 = [[[0, 1], [2, 3]], [[0, 4], [5, 6]], [[1, 5], [4, 6]], [[0, 2], [1, 3]], [[2, 4], [3, 5]], [[0, 6], [4, 5]], [[1, 2], [3, 6]], [[0, 3], [1, 4]], [[0, 5], [2, 6]], [[1, 6], [2, 5]], [[0, 1], [3, 4]]]
    var sample8 = [[[0, 1], [2, 3]], [[4, 5], [6, 7]], [[4, 6], [5, 7]], [[0, 2], [1, 3]], [[0, 3], [1, 2]], [[4, 7], [5, 6]], [[0, 4], [1, 5]], [[2, 6], [3, 7]], [[2, 7], [3, 6]], [[0, 5], [1, 4]], [[0, 6], [1, 7]], [[2, 4], [3, 5]], [[2, 5], [3, 4]], [[0, 7], [1, 6]]]
    var sample = sample6;
    if (this.data.sel_pk_group_user_list.length < 4) {
      wx.showToast({
        title: '人数太少,请自定义对阵',
        duration: 2000,
        icon: "none"
      })
      return;
    } else if (this.data.sel_pk_group_user_list.length > 8) {
      wx.showToast({
        title: '人数太多,请自定义对阵',
        duration: 2000,
        icon: "none"
      })
      return;
    }
    if (this.data.sel_pk_group_user_list.length == 4) {
      sample = sample4;
    } else if (this.data.sel_pk_group_user_list.length == 5) {
      sample = sample5;
    } else if (this.data.sel_pk_group_user_list.length == 7) {
      sample = sample7;
    } else if (this.data.sel_pk_group_user_list.length == 8) {
      sample = sample8;
    }
    var pk_groups = this.getvs(sample);
    var new_pk_groups = this.data.pk_groups.concat(pk_groups);
    this.setData({
      pk_groups: new_pk_groups,
      modalName: "",
      submit_flag: true
    })
  },
  get1v1() {
    var sample2 = [[[0], [1]], [[0], [1]], [[0], [1]]];
    var sample3 = [[[0], [1]], [[0], [2]], [[1], [2]]];
    var sample4 = [[[0], [1]], [[2], [3]], [[1], [3]], [[0], [2]], [[1], [2]], [[0], [3]]];
    var sample5 = [[[0], [1]], [[2], [3]], [[2], [4]], [[0], [4]], [[1], [3]], [[1], [2]], [[0], [3]], [[3], [4]], [[1], [4]], [[0], [2]]]
    var sample6 = [[[0], [1]], [[2], [3]], [[4], [5]], [[0], [4]], [[1], [2]], [[3], [5]], [[0], [3]], [[1], [4]], [[2], [5]], [[0], [2]], [[3], [4]], [[1], [5]], [[0], [5]], [[2], [4]], [[1], [3]]]
    var sample = sample4;
    if (this.data.sel_pk_group_user_list.length < 2) {
      wx.showToast({
        title: '人数太少,请自定义对阵',
        duration: 2000,
        icon: "none"
      })
      return;
    } else if (this.data.sel_pk_group_user_list.length > 6) {
      wx.showToast({
        title: '人数太多,请自定义对阵',
        duration: 2000,
        icon: "none"
      })
      return;
    }
    if (this.data.sel_pk_group_user_list.length == 2) {
      sample = sample2;
    }
    else if (this.data.sel_pk_group_user_list.length == 3) {
      sample = sample3;
    } else if (this.data.sel_pk_group_user_list.length == 4) {
      sample = sample4;
    } else if (this.data.sel_pk_group_user_list.length == 5) {
      sample = sample5;
    } else if (this.data.sel_pk_group_user_list.length == 6) {
      sample = sample6;
    }
    var pk_groups = this.getvs(sample);
    var new_pk_groups = this.data.pk_groups.concat(pk_groups);
    this.setData({
      pk_groups: new_pk_groups,
      modalName: "",
      submit_flag: true
    })

  },
  get_boygirl_pk() {
    if (this.data.activity_info["activity_status"] >= 800) {
      wx.showToast({
        title: this.data.activity_info["activity_status_comment"],
        icon: "error",
        duration: 3000
      })
      return
    }
    var boy_num = 0;
    var girl_num = 0;
    var boy_member_num_list = [];
    var girl_member_num_list = [];
    for (var index in this.data.sel_pk_group_user_list) {
      if (this.data.sel_pk_group_user_list[index].gender == 1) {
        boy_num = boy_num + 1
        boy_member_num_list.push(this.data.sel_pk_group_user_list[index].member_num)
      } else if (this.data.sel_pk_group_user_list[index].gender == 0) {
        girl_num = girl_num + 1
        girl_member_num_list.push(this.data.sel_pk_group_user_list[index].member_num)
      }
    }
    if (girl_num >= 2 && boy_num >= 2) {
      if (boy_num + girl_num > 8) {
        wx.showToast({
          title: '人数太多!',
          icon: "error",
          duration: 2000
        })
      } else {
        var that = this;
        console.log(boy_member_num_list)
        console.log(girl_member_num_list)
        wx.request({
          url: app.globalData.hosturl + 'get_boygirl_pk_list', //仅为示例，并非真实的接口地址
          data: {
            "boy_member_num_list": boy_member_num_list,
            "girl_member_num_list": girl_member_num_list,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res);
            if (res.data.code == 200) {
              var new_pk_groups = that.data.pk_groups;
              console.log(res.data)
              var pk_groups_res = res.data.pk_groups;
              for (let i in pk_groups_res) {
                new_pk_groups.push(pk_groups_res[i]);
              }
              //new_pk_groups.push(res.data.pk_groups);
              that.setData({ pk_groups: new_pk_groups, modalName: "", submit_flag: true });
            }
          }
        });

      }
    } else {
      wx.showToast({
        title: '混双人数不足',
        icon: "error",
        duration: 2000
      })
    }
  },

  del_pk_group(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var new_pk_groups = this.data.pk_groups;
    new_pk_groups.splice(index, 1);
    this.setData({ pk_groups: new_pk_groups, submit_flag: true });

  },
  new_pk_group(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var new_pk_groups = this.data.pk_groups;
    var newobj = JSON.parse(JSON.stringify(new_pk_groups[index]));//深度拷贝
    //比分要清零
    newobj[newobj.length - 2] = new Array(newobj.length - 2).fill(0)
    newobj[newobj.length - 1][0] = "";//标签也清楚
    new_pk_groups.push(newobj);
    this.setData({ pk_groups: new_pk_groups, submit_flag: true });
  },
  score_pk_group(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var score_pk_group = this.data.pk_groups[index];
    console.log(score_pk_group);//[[1,2],[3,4]]//不是[[[1,2],[3,4]]]
    var pk_group_score = [];//new Array(score_pk_group.length-1).fill(0);
    var score = score_pk_group[score_pk_group.length - 2];
    score.forEach(item => {
      if (item != 0) {//默认的比分是0
        pk_group_score = score;
        return;
      }
    });
    this.setData({
      edit_pk_group_index: index,
      score_pk_group: score_pk_group,
      pk_group_score: pk_group_score,
      pk_group_score_tags: score_pk_group[score_pk_group.length - 1],
      modalName: "scoreModal"
    });

  },
  input_score(e) {
    var score = e.detail.value;
    var score_index = e.currentTarget.dataset.index;
    score = parseInt(score.replace(/\D/g, ''));
    console.log("比分" + score);
    console.log("index=" + score_index);
    var pk_group_score = this.data.pk_group_score;
    console.log(this.data.pk_groups)
    pk_group_score[score_index] = score;
    console.log(this.data.pk_groups)
    this.setData({
      pk_group_score: pk_group_score
    })
  },
  input_score_tag(e) {
    var score_tag = e.detail.value;
    console.log("比分标签" + score_tag);
    var pk_group_score_tags = this.data.pk_group_score_tags;
    pk_group_score_tags[0] = score_tag;
    this.setData({
      pk_group_score_tags: pk_group_score_tags
    })
  },
  update_score(e) {
    var pk_group_score = this.data.pk_group_score;
    var score_pk_group = this.data.score_pk_group;
    var pk_groups = this.data.pk_groups;
    console.log(pk_groups);
    score_pk_group[score_pk_group.length - 2] = pk_group_score;
    pk_groups[this.data.edit_pk_group_index] = score_pk_group;
    console.log("提交比分")
    console.log(this.data.edit_pk_group_index);
    console.log(score_pk_group);
    console.log(pk_groups);
    this.setData({
      pk_groups: pk_groups,
      modalName: "",
      pk_group_score: [],//清空比分记录
      pk_group_score_tags: [],
      submit_flag: true
    });
    score.get_score(pk_groups);
  },

  update_pk_group() {
    if (this.data.activity_info["activity_status"] >= 800) {
      wx.showToast({
        title: this.data.activity_info["activity_status_comment"],
        icon: "error",
        duration: 3000
      })
      return
    }
    //新增，更新
    wx.showLoading({
      title: '更新中...',
    })
    var that = this;
    var pk_groups = this.data.pk_groups;
    var activity_id = this.data.activity_id;
    var group_tag = this.data.group_tag;
    wx.request({
      url: app.globalData.hosturl + 'new_update_activity_member_pk', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_id,
        "group_tag": group_tag,
        "pk_groups": pk_groups,
        "begintime": this.data.activity_info["begintime"],
        "modify_time": this.data.all_pk_info["modify_time"] == undefined ? "" : this.data.all_pk_info["modify_time"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
        wx.hideLoading()
        if (res.data.code == -1) {
          wx.showToast({
            title: res.data,
            icon: "none",
            duration: 3000
          })
        } else if (res.data.code == 200) {
          //获取已存储的对阵列表
          var activity_tag = that.data.activity_info.activity_tag;
          score.get_pk_groups(app.globalData.hosturl, that, that.data.activity_id, that.data.group_tag, activity_tag);
          wx.showToast({
            title: '提交成功',
            icon: "success",
            duration: 3000
          })
        }

      }
    });
  },
  clear_pk_group() {
    this.setData({ pk_groups: [], submit_flag: true, modalName: "" })
  },
  clear_pk_group2() {
    //新增，更新
    if (this.data.activity_info["activity_status"] >= 800) {
      wx.showToast({
        title: this.data.activity_info["activity_status_comment"],
        icon: "error",
        duration: 3000
      })
      return
    }
    var activity_id = this.data.activity_id;
    var group_tag = this.data.group_tag;
    wx.request({
      url: app.globalData.hosturl + 'del_activity_member_pk', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_id,
        "group_tag": group_tag
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
      }
    });
  },
  //添加分组成员
  add_group_member(e) {
    let group_users = encodeURIComponent(JSON.stringify(this.data.group_users));
    var index = e.currentTarget.dataset.index;
    console.log(typeof (index));
    console.log(index);
    app.globalData.edit_index = parseInt(index);
    wx.navigateTo({
      url: 'partuser?ungroup_partinfo_list=' + group_users,
    })
  },
  save_custom_pk_group() {
    var pk_groups = this.data.pk_groups;
    var custom_pk_group = this.data.custom_pk_group;
    console.log(custom_pk_group)
    var len = custom_pk_group.length;
    var score = new Array(len).fill(0);
    custom_pk_group.push(score);//比分
    custom_pk_group.push([]);//标签
    pk_groups.push(this.data.custom_pk_group);
    app.globalData.edit_group_user = [];
    app.globalData.edit_index = 0;
    console.log(pk_groups);
    this.setData({
      pk_groups: pk_groups,
      modalName: "",
      custom_pk_group: [],
      submit_flag: true
    })
  },
  expand_pk_group() {
    var hidden_pk_group = !this.data.hidden_pk_group;
    console.log("展示隐藏对阵情况" + hidden_pk_group);
    this.setData({
      hidden_pk_group
    })
  },
  expand_score_list() {
    var hidden_score_list = !this.data.hidden_score_list;
    this.setData({
      hidden_score_list
    })
  },
  sigle_recored() {
    var pk_groups = this.data.pk_groups;
    var sel_pk_group_user_list = this.data.sel_pk_group_user_list;
    for (var index in sel_pk_group_user_list) {
      var item = [];
      item.push([sel_pk_group_user_list[index]["member_num"]])
      item.push([0])
      item.push([])
      pk_groups.push(item)
    }
    this.setData({
      pk_groups: pk_groups,
      modalName: "",
      submit_flag: true
    })

  },
  onScrollRefresh() {
    console.log("下拉刷新" + this.data.triggered)
    var that = this;
    setTimeout(function () {
      that.setData({
        triggered: false,
        submit_flag: false
      })
    }, 2000);
    //获取已存储的对阵列表
    var activity_tag = that.data.activity_info.activity_tag;
    score.get_pk_groups(app.globalData.hosturl, that, that.data.activity_id, that.data.group_tag, activity_tag);
  },
  get_fixed_partner_pk() {
    console.log("固定搭档")
    this.setData({
      modalName: ""
    })
    if (this.data.group_users.length < 3) {
      wx.showToast({
        title: '人数最少3人，当前分组无法使用此功能',
        icon: "none",
        duration: 3000
      })
      return
    }
    if (this.data.group_users.length > 8) {
      wx.showToast({
        title: '人数最多8人，当前分组无法使用此功能',
        icon: "none",
        duration: 3000
      })
      return
    }
    wx.navigateTo({
      url: 'fixpartner?' + 'member_users=' + encodeURIComponent(JSON.stringify(this.data.member_users)) + '&&group_users=' + encodeURIComponent(JSON.stringify(this.data.group_users)),
    })
  },
  showpkmodal(e) {
    var method = e.currentTarget.dataset.method;
    console.log("显示成员选择")
    var methodtip = e.currentTarget.dataset.methodtip;
    this.setData({
      modalName: "selpkusersModal",
      method: method,
      methodtip: methodtip
    })
  },
  listenCheckboxChange(e) {
    console.log('当checkbox-group中的checkbox选中或者取消是我被调用');
    //打印对象包含的详细信息
    console.log(e.detail.value);
    var sel_pk_group_member_list = e.detail.value;
    var sel_pk_group_user_list = []
    for (var index in sel_pk_group_member_list) {
      var member_num = sel_pk_group_member_list[index]
      sel_pk_group_user_list.push(this.data.member_users[member_num])
    }
    this.setData({
      sel_pk_group_member_list: sel_pk_group_member_list,
      sel_pk_group_user_list: sel_pk_group_user_list
    })

  },
  show_edit() {
    this.setData({
      show_edit_flag: !this.data.show_edit_flag
    })
  }
})