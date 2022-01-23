1.配置socketio 需要保证版本的一致性：https://flask-socketio.readthedocs.io/en/latest/#version-compatibility
    如果确认版本没问题，但是仍然提示版本不匹配，可以重装python环境
2.注意小程序的socketio是基于2.x版本的js socketio封装的，因此第1点的版本要对应适配
3.出现not accepted origin ,可以使用socket_io = SocketIO(app,cors_allowed_origins = "*")解决