""" Models """

from datetime import datetime


class Calendar(object):

    def __init__(self, name, data):
        self.name = name
        self.start = data['start']
        self.months = []
        i = self.start
        years = name.split('-')
        # first fill
        for m in data['months']:
            month = {'label': m['label'], 'days': [], 'num_days': m['days']}
            for d in range(1, m['days'] + 1):
                year = years[0 if len(self.months) < 5 else 1]
                date_str = str(d) + '-' + m['label'] + '-' + year
                date_val = datetime.strptime(date_str, '%d-%B-%Y')
                day = {
                    'date': date_str,
                    'date_value': date_val,
                    'tags': []  # used as class in template
                }

                # add tags :
                # check if day is weekend
                if i % 7 > 4:
                    day['tags'].append('weekend')
                # check if day is today or past
                now = datetime.now()
                now_str = datetime.strftime(now, '%d-%B-%Y')
                if now_str == date_str:
                    day['tags'].append('today')
                elif now > date_val:
                    day['tags'].append('past')

                # format tag string
                day['tags'] = ' '.join(day['tags'])
                # append day to month
                month['days'].append(day)
                i += 1
            self.months.append(month)

        # special weeks
        for kind in ['holiday', 'workshop', 'nocourse', 'evals']:
            if kind not in data['special'] or data['special'][kind] is None:
                continue
            for sp in data['special'][kind]:
                self.add_special(kind, sp['label'], sp['start'], sp['end'])

    def add_special(self, kind, label, start, end):
        month_start_num = int(start.split('/')[1]) - 8
        if month_start_num < 0: month_start_num += 8 + 4
        month_start = self.months[month_start_num]
        start_day = int(start.split('/')[0]) - 1

        month_end_num = int(end.split('/')[1]) - 8
        if month_end_num < 0: month_end_num += 8 + 4
        month_end = self.months[month_end_num]
        end_day = int(end.split('/')[0])

        num_days = 0
        for m in range(month_start_num, month_end_num + 1):
            start_d = 0
            if m == month_start_num: start_d = start_day
            end_d = 31
            if m == month_end_num: end_d = end_day
            for d in range(start_d, end_d):
                day = self.months[m]['days'][d]
                day[kind] = label if num_days == 0 else ' '
                num_days += 1
