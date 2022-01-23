# encoding:utf-8
# !/usr/bin/env python

"""
配置类
数据库参数
db参数
flask app参数

"""
class Config(object):
    # 配置参数
    # 设置连接数据库的URL
    user = 'wangqiang'
    password = '211314'
    database = 'activityinfo'
    #app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://%s:%s@10.206.0.4:3306/%s' % (user, password, database)
    SQLALCHEMY_DATABASE_URI = 'mysql://%s:%s@118.195.153.2:3306/%s' % (user, password, database)
    # 设置sqlalchemy自动更跟踪数据库
    SQLALCHEMY_TRACK_MODIFICATIONS = True

    # 查询时会显示原始SQL语句
    #app.config['SQLALCHEMY_ECHO'] = True
    SQLALCHEMY_ECHO = True
    # 禁止自动提交数据处理
    #app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = False
    SQLALCHEMY_COMMIT_ON_TEARDOWN = False

    #app.config['SECRET_KEY'] = 'secret!'
    SECRET_KEY = 'secret!'
    #app.config['DEBUG'] = True
    DEBUG = True
    #app.config['INFO'] = True
    INFO = True
    #ssl_context=('2week.club.key', '2week.club.pem')