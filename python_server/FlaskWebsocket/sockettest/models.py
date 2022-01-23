# encoding:utf-8
# !/usr/bin/env python

from exts import db

"""
定义数据库表
"""

class Createinfo(db.Model):
    # 定义表名
    __tablename__ = 'createinfo'
    # 定义字段
    activity_id = db.Column(db.String(255), primary_key=True)
    user_id = db.Column(db.String(255), db.ForeignKey("user.user_id"))
    title = db.Column(db.String(255))
    detail = db.Column(db.Text)
    activity_date = db.Column(db.String(255))
    begintime = db.Column(db.String(255))
    endtime = db.Column(db.String(255))
    addendtime = db.Column(db.String(255))
    latitude = db.Column(db.String(20))
    longitude = db.Column(db.String(20))
    activityaddress = db.Column(db.String(100))
    partinfo = db.Column(db.String(255))
    member = db.Column(db.Integer)
    #create_time = db.Column(db.DateTime, nullable=False, default=datetime.now)
    actuser = db.relationship("user", backref=db.backref("actlist", order_by=activity_date.desc()))
    #actuser = db.relationship("user", backref=db.backref("actlist", order_by=activity_date.asc()))

    def to_json(self):
        return {"id": self.activity_id,
                "user_id":self.user_id,
                "title":self.title,
                "detail":self.detail,
                "activity_date":self.activity_date,
                "begintime":self.begintime,
                "endtime":self.endtime,
                "addendtime":self.addendtime,
                "latitude":self.latitude,
                "longitude":self.longitude,
                "activityaddress":self.activityaddress,
                "partinfo":self.partinfo,
                "member":self.member
                }

class Activitychatmsg(db.Model):
    __tablename__ = 'activitychatmsg'
    # 定义字段
    id = db.Column(db.Integer, primary_key=True)
    activity_id = db.Column(db.String(255), db.ForeignKey("createinfo.activity_id"))
    chatmsg = db.Column(db.String(255))
    msgtime = db.Column(db.String(255))

    def to_json(self):
        return {"id": self.id,
                "activity_id":self.activity_id,
                "chatmsg":self.chatmsg,
                "msgtime":self.msgtime}



class user(db.Model):
    # 定义表名
    __tablename__ = 'user'

    # 定义字段
    user_id = db.Column(db.String(255), primary_key=True)
    user_name = db.Column(db.String(255))
    user_faceid = db.Column(db.String(255))
    gender = db.Column(db.SmallInteger)

    createactivity = db.relationship("Createinfo",backref="createuser")

    def to_json(self):
        return {"user_id": self.user_id,
                "nickName": self.user_name,
                "avatarUrl": self.user_faceid}

class Activitymember(db.Model):
    # 定义表名
    __tablename__ = 'activitymember'

    # 定义字段
    id = db.Column(db.Integer, primary_key=True)
    activity_id = db.Column(db.String(255), db.ForeignKey("createinfo.activity_id"))
    user_id = db.Column(db.String(255), db.ForeignKey("user.user_id"))
    partinfo = db.Column(db.String(500))
    parttime = db.Column(db.String(255))
    partact = db.relationship("Createinfo", backref=db.backref("a", order_by=parttime.desc()))
    user = db.relationship("user", backref="b")


    def to_json(self):
        return {"activity_id": self.activity_id,
                "user_id": self.user_id,
                "partinfo": self.partinfo,
                "parttime":self.parttime}