# encoding:utf-8
# !/usr/bin/env python


from exts import db,socket_io
from flask_socketio import SocketIO,join_room
from models import Createinfo,Activitychatmsg,user
from databaseutil import new_user,new_activity,new_chatmsg,new_actmember,get_member

@socket_io.on('testss')
def test_connect(res):
    print("test connect 开始")
    print(res)
    join_room("MTYxNjI0NjMyNi42MzM1NTQyoyhbt4nFpV-VgIi3zscNdwByooPw")
    socket_io.emit('server_response', {'chatmsg': "inputmsg"},
                   room="MTYxNjI0NjMyNi42MzM1NTQyoyhbt4nFpV-VgIi3zscNdwByooPw")

@socket_io.on('connect_first')
def connect_first(res):
    print("connect_first")
    print(res)
    join_room(res["activity_id"])

@socket_io.on('pushmsg')
def pushmsg(res):
    print("pushmsg开始")

    print(res)
    print(res["activity_id"])
    print(res["chatmsg"])
    join_room(res["activity_id"])
    new_chatmsg(res["activity_id"],res["chatmsg"])
    socket_io.emit('server_response', {'chatmsg': res["chatmsg"]},room=res["activity_id"])

@socket_io.on('newmember')
def newmember(res):
    print("newmember 添加成员，报名")

    # 更新成员数量，并添加成员信息
    activity_id = res["activity_id"]
    user_id = res["user_id"]
    partinfo = res["partinfo"]
    print(activity_id)
    print(user_id)
    print(partinfo)
    flag = new_actmember(activity_id, user_id, partinfo)
    if flag:
        join_room(activity_id)
        socket_io.emit('newmember', {'newmember': get_member(activity_id)},room=activity_id)


