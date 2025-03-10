const io = require("weapp.socket.io.js");  // 引入 socket.io
const App = getApp();

let wsStatus = false;
let onSocket = null;
onSocket = io(App.globalData.hosturl)// 连接 socket
console.log("还在用？")
export const connect = function (cb) { 

  if (!onSocket) {

    onSocket.on('connect', function (res) { // 监听socket 是否连接成功
      cb(true, onSocket)
      wsStatus = true
    })

    // onSocket.on('login', function (res) {
    //   console.log(res)
    // })
    
    setTimeout(function () { // 超时10秒，返回false
      if (!wsStatus) {
        cb(false, onSocket)
      }
    }, 10000)
    
  } else {
    cb(true, onSocket)
  }
}