const swiper = require("swiper.js");
function get_activity_list(that,app,activity_id="") {
  console.log("获取活动列表");
  var id = "";
  if(activity_id=="" && that.data.activity_id != undefined) id = that.data.activity_id;

  wx.showLoading({
    title: '',
  });
  var _that = that;
  wx.request({
    url: app.globalData.hosturl + 'get_activity_list', //仅为示例，并非真实的接口地址
    data: {
      "activity_id": id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
     
      //console.log(res.data)
      var list = [];
      console.log("获取list");
      console.log(res.data);
      res.data.forEach(element => {
        console.log(element.activity_id)
        list.push(element);
      });
      _that.setData({
        activity_list: list
      })
      //初始化第一个id
      var first = _that.data.activity_list;

      console.log("活动创建人" + first[0].createuser);
      console.log("更新参与人数" + first[0].member);
      _that.setData({
        first_activity_id: first[0].id,
        activity_id: first[0].id,
        member: first[0].member,
        //swiper_current_index:0
      });
      console.log("初始化第一个activity id = " + first[0].id);
      _that.socketinit();
      swiper.update_swiper(_that,0,0,0,_that.data.activity_list,_that.data.recyler_list);
      //这里应该将活动信息和用户信息都提取保存起来
      _that.getstore_activity_user_info(first[0].id);
      get_init_msg(_that,app,first[0].id);
      wx.stopPullDownRefresh();
      wx.hideLoading({
        success: (res) => {},
      });
    },
    fail(res){
      wx.hideLoading({
        success: (res) => {},
      });
      wx.showToast({
        title: '网络可能异常...',
        icon:"error",
        duration:4000
      })

    }
  });

}
function get_init_msg(that,app,id) {
  const _that = that;
  console.log("获取聊天信息：" + id);
  var doommList = [];
  wx.request({
    url: app.globalData.hosturl + 'get_init_msg', //仅为示例，并非真实的接口地址
    data: {
      "activity_id": id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      if (res.data != "fail") {
        //聊天消息
        var list = _that.data.activity_list;
        res.data.forEach(element => {
          doommList.unshift(element.chatmsg);
        });
        
        //活动信息
        var info = _that.data.activity_info;
        if(info.announcement != ""){
          
          doommList.unshift("最新公告："+info.announcement);
        }
        
        console.log(info);
        var ainfo = [];
        ainfo.unshift("活动详情：" + info.detail);
        ainfo.unshift("活动时间：" + info.activity_date + " " + info.begintime + "-" + info.endtime);
        //ainfo.unshift("报名人数：" + info.member);
        ainfo.unshift("活动地点：" + info.activityaddress);
        //ainfo.unshift(info.title);
        _that.setData({
          doommData: doommList,
          activityinfo: ainfo,
          scrollTop: 0
        });
      }
    }
  });
}
function newuser(app,nickname, avatarUrl, gender) {
  console.log("用户头像" + avatarUrl);
  wx.request({
    url: app.globalData.hosturl + 'newuser', //仅为示例，并非真实的接口地址
    data: {
      "openid": app.globalData.openid,
      "nickName": nickname,
      "avatarUrl": avatarUrl,
      "gender": gender
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {

    }
  })
}
exports.get_activity_list = get_activity_list
exports.get_init_msg = get_init_msg
exports.newuser = newuser