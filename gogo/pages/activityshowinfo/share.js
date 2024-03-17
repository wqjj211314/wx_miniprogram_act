function get_activity_moods(hosturl,that,activity_id){
  wx.request({
    url: hosturl + 'get_activity_moods', //仅为示例，并非真实的接口地址
    data: {
      "activity_id": activity_id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log(res.data);
      console.log("获取轮播图");
      var mood_img_list = [];
      if(res.data instanceof Array){
        res.data.forEach(item=>{
          mood_img_list.push(item.img_url)
        })
      }
      that.setData({
        moods:res.data,
        mood_img_list:mood_img_list
      })
    },
    fail(res) {
      wx.showToast({
        title: "服务器异常",
        icon: "error"
      })
    }
  });
}

exports.get_activity_moods = get_activity_moods