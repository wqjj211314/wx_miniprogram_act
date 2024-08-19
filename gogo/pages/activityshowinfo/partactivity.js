// pages/activityshowinfo/partactivity.js
const app = getApp();
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_info: {},
    modalName: "",
    partinfo: [],
    partinfoinput: {},
    partinfo_sex: "",
    picker_index: 0,
    picker: ["L1", "L1.5", "L2", "L2.5", "L3", "L3.5", "L4", "L5", "L6", "L7"],
    empty_group_tag_dict: true,//用来显示报名预分组的
    part_limit: 1,//0不限制参与，1限制参与,
    select_group_tag: "",//报名所选择的分组
    all_group_tag_dict: {},
    user_info: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var activity_info = JSON.parse(decodeURIComponent(options.activity_info));
    var partinfo = JSON.parse(decodeURIComponent(options.partinfo));
    var all_group_tag_dict = JSON.parse(decodeURIComponent(options.all_group_tag_dict));
    var part_limit = options.part_limit;
    var empty_group_tag_dict = true;
    for (var key in activity_info.group_tag_dict) {
      empty_group_tag_dict = false;
      break
    }
    this.setData({
      partinfo: partinfo,
      activity_info: activity_info,
      empty_group_tag_dict: empty_group_tag_dict,
      all_group_tag_dict: all_group_tag_dict,
      part_limit: part_limit
    })
    this.get_user_info()

  },
  get_user_info() {
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_userinfo',
      data: {
        "user_id": app.globalData.login_userInfo["user_id"]
      },
      success: (res) => {
        console.log("appjs用户openid");
        console.log(res.data);
        
        var partinfoinput = that.data.partinfoinput;
        console.log(partinfoinput)
        for(var key in res.data.part_info){
          console.log(key)
          console.log(res.data.part_info[key])
          if(that.data.partinfo.includes(key)){
            if(key == "性别"){
              that.setData({
                partinfo_sex:res.data.part_info["性别"]
              })
            }
            if(key == "自评等级"){
              that.setData({
                picker_index:that.data.picker.indexOf(res.data.part_info[key])==-1?0:that.data.picker.indexOf(res.data.part_info[key])
              })
            }
            partinfoinput[key] = res.data.part_info[key]
          }
          
        }
        that.setData({
          user_info: res.data,
          partinfoinput:partinfoinput
        })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  part_activity() {
    //["通过发起人分享可以参与","通过发起人和成员分享可以参与","所有人均可参与"]
    var that = this;
    if (!util.check_login(app)) {
      return;
    }

    if (this.data.part_limit != 0 && this.data.activity_info.createuser["user_id"] != app.globalData.login_userInfo["user_id"]) {
      wx.showToast({
        title: '请通过分享报名',
        icon: 'error',
        duration: 2000
      });
      return;
    }
    var info = this.data.partinfoinput;
    //info["自评等级"] = this.data.picker[this.data.picker_index];
    //this.setData({
    //partinfoinput: info
    //});
    console.log(info)
    console.log(this.data.partinfo)
    if (this.data.partinfo.indexOf("自评等级") != -1) {
      if (!info.hasOwnProperty("自评等级")) {
        info["自评等级"] = this.data.picker[0]
      }
    }
    if (Object.keys(info).length != this.data.partinfo.length) {
      wx.showToast({
        title: '请填写报名信息',
        icon: 'error',
        duration: 1000
      })
      return;
    }
    wx.showLoading({
      title: '报名中...',
    })
    wx.request({
      url: app.globalData.hosturl + 'pay_miniprog', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": this.data.activity_info.activity_id,
        "user_id": app.globalData.login_userInfo["user_id"],
        "title": this.data.activity_info.title,
        "partinfo": JSON.stringify(info),
        "latitude": this.data.activity_info.latitude,
        "longitude": this.data.activity_info.longitude,
        "activity_tag": this.data.activity_info.activity_tag,
        "group_tag": this.data.select_group_tag,
        "pay_price": this.data.activity_info.pay_price,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //that.update_part_info(that,res);
        console.log("商户server调用支付统一下单")
        console.log(res.data.result);
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
              //返回首页的活动页。
              setTimeout(function () {
                app.globalData.current_activity_id = that.data.activity_info.activity_id;
                wx.switchTab({
                  url: '../index/index'
                })
              }, 2000)
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
        } else if (res.data.code == 1) {
          wx.showToast({
            title: '报名成功',
            icon: "success",
            duration: 2000
          })
          console.log("免费报名")
          //返回首页的活动页。
          setTimeout(function () {
            app.globalData.current_activity_id = that.data.activity_info.activity_id;
            wx.switchTab({
              url: '../index/index'
            })
          }, 1000)
        } else {
          wx.showToast({
            title: res.data.result,
            icon: "error",
            duration: 2000
          })
        }


      },
      fail(res) {
        wx.showToast({
          title: "服务器异常",
          icon: "error"
        })
      }
    });
    /*
    app.globalData.onSockettest.emit('newmember', { activity_id: this.data.activity_info.activity_id, user_id: app.globalData.openid, partinfo: JSON.stringify(this.data.partinfoinput), latitude: this.data.activity_info.latitude, longitude: this.data.activity_info.longitude, "activity_tag": this.data.activity_info.activity_tag, "group_tag": this.data.select_group_tag });
    */
    this.setData({
      modalName: ""
    })


  },
  choosesex(e) {
    var value = e.currentTarget.dataset.sex;
    var info = this.data.partinfoinput;
    info["性别"] = value;
    this.setData({
      partinfo_sex: value,
      partinfoinput: info
    });
  },
  PickerChange(e) {
    console.log(e);
    var info = this.data.partinfoinput;
    info["自评等级"] = this.data.picker[e.detail.value];
    this.setData({
      picker_index: e.detail.value,
      partinfoinput: info
    });
  },
  listenRadioChange(e) {
    console.log(e.detail.value);
    var sel_value = e.detail.value;
    this.setData({
      select_group_tag: sel_value
    })
  },
  partinfoInput(event) {
    var partinfokey = event.target.dataset.value
    var partinfovalue = event.detail.value;
    //var json = {partinfokey:partinfovalue};
    var info = this.data.partinfoinput;
    info[partinfokey] = partinfovalue;
    
    this.setData({
      partinfoinput: info
    });
    console.log(info);
  },
})