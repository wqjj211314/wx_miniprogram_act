# encoding:utf-8
# !/usr/bin/env python

from models import Createinfo,Activitychatmsg,user,Activitymember
from exts import db,socket_io,app
import time,json
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
"""
用来操作数据库的函数方法
"""

def new_user(openid, nickName, avatarUrl, gender):
    try:
        users = user.query.filter_by(user_id=openid).all()
        if len(users) == 0:
            print("新建用户中.....")
            user1 = user(user_id=openid, user_name=nickName, user_faceid=avatarUrl, gender=gender)

            db.session.add_all([user1])
            db.session.commit()
        else:
            print("用户数据更新")
            users[0].user_name = nickName
            users[0].user_faceid = avatarUrl
            users[0].gender = gender
            db.session.commit()

    except:
            db.session.rollback()

def new_activity(openid, activity_id, title, detail, activity_data, begintime,
                 endtime, addendtime, latitude, longitude, address, partinfo):
    try:
        acts = Createinfo.query.filter_by(activity_id=activity_id).all()
        print(acts)
        if len(acts) == 0:
            print("创建活动中........")
            activity = Createinfo(activity_id=activity_id,
                                  user_id=openid,
                                  title=title,
                                  detail=detail,
                                  activity_date=activity_data,
                                  begintime=begintime,
                                  endtime=endtime,
                                  addendtime=addendtime,
                                  latitude=latitude,
                                  longitude=longitude,
                                  activityaddress=address,
                                  partinfo=partinfo,
                                  member=0)

            db.session.add_all([activity])
            db.session.commit()
        else:
            print("活动已创建，不需要重复创建")
    except:
        db.session.rollback()

def new_chatmsg(activity_id, msg):
    try:
        print(str(time.time()))
        msg = Activitychatmsg(activity_id=activity_id, chatmsg=msg,msgtime=str(time.time()))

        db.session.add_all([msg])
        db.session.commit()
    except:
        db.session.rollback()

def get_ten_chatmsg(activity_id):
    #order_by(Activitychatmsg.msgtime.asc())；order_by(Activitychatmsg.msgtime.desc())
    msgs = Activitychatmsg.query.filter_by(activity_id=activity_id).order_by(Activitychatmsg.msgtime.desc()).limit(10)#.order_by(Activitychatmsg.msgtime.asc())
    list = []
    for item in msgs:
        print(item.to_json())
        list.append(item.to_json())
    print("获取最新的10条聊天信息")
    print(list)
    #list.append("测试消息")
    return list

def get_user(user_id):
    user_oj = user.query.filter_by(user_id=user_id).first()

    return user_oj

def get_member(activity_id):
    a = Createinfo.query.filter_by(activity_id=activity_id).first().member

    return a

def new_actmember(activity_id,user_id,partinfo):
    try:
        a = Activitymember.query.filter_by(activity_id = activity_id,user_id=user_id).first()
        if a==None:
            print("用户未报名")
            Createinfo.query.filter(Createinfo.activity_id == activity_id).update({'member': Createinfo.member + 1})
            # 提交会话
            db.session.commit()
            msg = Activitymember(activity_id=activity_id,
                                  user_id=user_id, parttime=str(time.time()), partinfo=partinfo)
            db.session.add_all([msg])
            db.session.commit()
        else:
            print("用户已经报名")
            print(a)
            return False

    except:
        db.session.rollback()
    return True