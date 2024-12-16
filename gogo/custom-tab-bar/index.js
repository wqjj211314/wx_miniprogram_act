const app = getApp()
Component({
  data: {
      selected: 0,
    "selectedColor": "#4689FF",
    "backgroundColor": "#fff",
    "borderStyle": "white",
    "list": [
      {
        "pagePath": "/pages/index/newindex",
        "iconPath": "/image/index.png",
        "selectedIconPath": "/image/index_sel.png",
        "text": "首页"
      },
      {
        "pagePath": "/pages/activity/activity",
        "iconPath": "/image/add_sel.png",
        "selectedIconPath": "/image/add_sel.png",
        
      },
      {
        "pagePath": "/pages/user/user",
        "iconPath": "/image/my.png",
        "selectedIconPath": "/image/my_sel.png",
        "text": "我的"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url});
      //app.globalData.tab_page_path = url;
      console.log("切换tab");
      console.log(data);
      this.setData({
        selected: data.index
      })
    },
    test(){
      console.log("按钮")
    }
  }
})