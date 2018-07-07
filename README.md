# ECAL M&ID Planneur

Webapplication to organize semesters planning of the Bachelor Media&Interaction Design
This simplifies creating semester plannings with the multiple courses, classes and professors constraints.

It features:
- Full yearly overview of Winter and Spring Semester with AM/PM detail
- Calculation of staff hours including different rates and automatic extras
- Changelists & email notification
- Staff reports
- Administration mode

# Install

- Install the google cloud SDK and AppEngine component
- clone this repository
- install the dependencies `pip install -t lib -r requirements.txt`
- Optional: test locally `dev_appserver.py .`

# Deploy

`gcloud app deploy --version 2018-2019 --project=ecal-planneur --quiet`
