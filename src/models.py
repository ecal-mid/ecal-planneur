""" Models """

import yaml
from google.appengine.ext import ndb

from .calendar import Calendar

def get_yaml(name, filename):
    yaml_path = 'config/'+name+'/'+filename+'.yaml'
    return yaml.load(open(yaml_path))

class Config(object):
    def __init__(self, name):
        self.yaml = get_yaml(name, 'config')
        self.hours_base = self.yaml['hours_base']

class Planning(object):
    config = None
    def __init__(self, name):
        self.name = name
        Planning.config = Config(self.name)
        self.sections = []
        self.courses = []
        self.staffs = []
        self.activities = None
        self.parse_courses(get_yaml(self.name, 'courses'))
        self.parse_staff(get_yaml(self.name, 'staff'))
        self.calendar = Calendar(self.name, get_yaml(self.name, 'calendar'))

    def parse_courses(self, data):
        for s in data['Sections']:
            self.sections.append(Section(s))
        for c in data['Courses']:
            self.courses.append(Course(c, self.sections))

    def parse_staff(self, data):
        for s in data['Staffs']:
            self.staffs.append(Staff(s))

    def get_staff_by_name(self, name):
        s = filter(lambda x: x.name == name, self.staffs)
        if len(s): return s[0].get_json()
        return None

class Section(object):
    def __init__(self, data):
        self.name = data['name']

class Course(object):
    def __init__(self, data, sections):
        self.name = data['name']
        self.desc = data['desc']
        self.is_blockweek = None
        if 'is_blockweek' in data:
            self.is_blockweek = data['is_blockweek']
        self.section = filter(lambda x: x.name == self.name[:6], sections)[0]


class Staff(object):
    def __init__(self, data):
        self.name = data['name']
        self.role = data['role']
        self.percent = data['percent']
        self.tasks = []
        if 'tasks' in data:
            for t in data['tasks']:
                self.tasks.append(Task(t))
        self.add_automatic_tasks()

    def add_automatic_tasks(self):
        # automatically add tasks to professors
        if self.role == 'Professor':
            self.tasks.append(Task({'kind' : 'eval'}))
            # automatically add admin (1.6% of staff hours)
            self.tasks.append(Task({
                'kind' : 'admin',
                'hours' : 0.01 * self.percent * Planning.config.hours_base * 0.016
            }))
            # automatically add training (10% of teaching hours)
            self.tasks.append(Task({
                'kind' : 'training',
                'hours' : self.get_teaching_hours() * 0.1
            }))

        # todo:
        # /!\ fill current tasks hours from activities before adding auto tasks

        # automatically add diploma task if has task with course 3cvmid2
        if len(filter(lambda x: x.course == '3cvmid2', self.tasks)):
            self.tasks.append(Task({'kind': 'pres_diploma'}))

    def get_teaching_hours(self):
        return sum(t.coef if t.coef == 2.2 else 0 for t in self.tasks)

    def get_current_percent(self):
        return sum(t.get_percent() for t in self.tasks)

    def get_current_hours(self):
        return self.get_current_percent() / 100 * Planning.config.hours_base

    def get_json(self):
        d = self.__dict__.copy()
        d['tasks'] = []
        for t in self.tasks:
            d['tasks'].append(t.get_json())
        d['current_percent'] = self.get_current_percent()
        d['current_hours'] = self.get_current_hours()
        return d

    def get_key(self):
        return self.name.replace(' ', '.').lower()

    def debug(self):
        print(self.name, self.get_current_percent(), self.percent)
        for t in self.tasks:
            print('  ', t.id, "{0:.2f}".format(t.get_percent()))


class Task(object):
    def __init__(self, data):
        self.kind = data['kind']
        self.course = None
        if 'course' in data:
            self.course = data['course']
        self.coef = None
        if 'coef' in data:
            self.coef = data['coef']
        else:
            self.coef = 2.2 if self.kind is 'course' else 1
        self.hours = 0
        if 'hours' in data:
            self.hours = data['hours']

    def get_key(self):
        key = self.kind
        if self.course: key += '.' + self.course
        return key

    def get_percent(self):
        return self.hours * self.coef / Planning.config.hours_base * 100

    def get_json(self):
        d = self.__dict__.copy()
        d['percent'] = self.get_percent()
        return d


class Activity(ndb.Model):
    staff_id = ndb.StringProperty(required=True)
    task_id = ndb.StringProperty(required=True)
    date = ndb.DateProperty(required=True)
    is_pm = ndb.BooleanProperty(required=True)
