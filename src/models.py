""" Models """

from google.appengine.ext import ndb

class Planning(ndb.Model):
    name = ndb.StringProperty(required=True)
    staffs = ndb.KeyProperty(kind='Staff', repeated=True)
    tasks = ndb.KeyProperty(kind='Task', repeated=True)
    sections = ndb.KeyProperty(kind='Section', repeated=True)
    courses = ndb.KeyProperty(kind='Course', repeated=True)

class Section(ndb.Model):
    name = ndb.StringProperty(required=True)

class Course(ndb.Model):
    name = ndb.StringProperty(required=True)
    section = ndb.KeyProperty(required=True, kind='Section')
    is_blockweek = ndb.BoolProperty(required=True)

class Staff(ndb.Model):
    name = ndb.StringProperty(required=True)
    percent = ndb.FloatProperty(required=True)
    role = ndb.StringProperty(required=True)

class Task(ndb.Model):
    staff_id = ndb.KeyProperty(required=True, kind='Staff')
    hours = ndb.IntProperty(required=True)
    kind = ndb.StringProperty(required=True)
    ceof = ndb.FloatProperty(default=1.0)
    course = ndb.KeyProperty(kind='Course')

class Activity(ndb.Model):
    staff_id = ndb.KeyProperty(required=True, kind='Staff')
    task_id = ndb.KeyProperty(required=True, kind='Task')
    date = ndb.DateProperty(required=True)
    is_am = ndb.BoolProperty(required=True)
