from __future__ import print_function, division # In python 2.7
import sys

from flask import Blueprint, render_template, make_response
from flask_login import current_user, login_required
from smartrods import db
from smartrods.models import *

mod = Blueprint('site', __name__, template_folder='templates')

@mod.route('/')
def home():
    return render_template('home.html')
    #return redirect(url_for('site.exercises'))

@mod.route('/js/<filename>')
@login_required
def script(filename):
    return render_template('./js/'+filename)

@mod.route('/classroom')
@login_required
def classroom():
    return render_template('classroom.html')

@mod.route('/exercises')
@login_required
def exercises():
    return render_template('exercises.html')

@mod.route('/report/<int:activity_id>')
@login_required
def report(activity_id):
    activity = Activity.query.get(activity_id)
    progression = {'Very High':0, 'High':0, 'Medium':0, 'Low':0}
    accuracy = {'Very High':0, 'High':0, 'Medium':0, 'Low':0}
    fluency = {'Very High':0, 'High':0, 'Medium':0, 'Low':0}
    systematicity = {'Very High':0, 'High':0, 'Medium':0, 'Low':0}
    classroomsize = len(activity.users)
    individual = []
    for user in activity.users:
        statistics = eval([event.statistics for event in user.events if event.activity_id == activity_id][-1])
        individual.append({'user': user.firstname + ' ' + user.lastname, 'statistics':statistics})

        print(type(statistics["progression"]), file=sys.stderr)
        if statistics["progression"] > 75:
            print(int(1/classroomsize*100), file=sys.stderr)
            progression["Very High"] += int(1/classroomsize*100)
        elif statistics["progression"] > 50:
            print(int(1/classroomsize*100), file=sys.stderr)
            progression["High"] += int(1/classroomsize*100)
        elif statistics["progression"] > 25:
            print(int(1/classroomsize*100), file=sys.stderr)
            progression["Medium"] += int(1/classroomsize*100)
        else:
            print(int(1/classroomsize*100), file=sys.stderr)
            progression["Low"] += int(1/classroomsize*100)

        print(progression, file=sys.stderr)

        if (statistics["accuracy"] > 75):
            accuracy["Very High"] += int(1/classroomsize*100)
        elif (statistics["accuracy"] > 50):
            accuracy["High"] += int(1/classroomsize*100)
        elif (statistics["accuracy"] > 25):
            accuracy["Medium"] += int(1/classroomsize*100)
        else:
            accuracy["Low"] += int(1/classroomsize*100)

        if (statistics["fluency"] > 15):
            fluency["Very High"] += int(1/classroomsize*100)
        elif (statistics["fluency"] > 10):
            fluency["High"] += int(1/classroomsize*100)
        elif (statistics["fluency"] > 5):
            fluency["Medium"] += int(1/classroomsize*100)
        else:
            fluency["Low"] += int(1/classroomsize*100)

        if (statistics["systematicity"] == "very high"):
            systematicity["Very High"] += int(1/classroomsize*100)
        elif (statistics["systematicity"] == "high"):
            systematicity["High"] += int(1/classroomsize*100)
        elif (statistics["systematicity"] == "medium"):
            systematicity["Medium"] += int(1/classroomsize*100)
        elif (statistics["systematicity"] == "none"):
            systematicity["Low"] += int(1/classroomsize*100);
    return render_template('report.html', activity = activity, individual=individual, overall=[progression, accuracy, fluency, systematicity])

@mod.route('/boardzoom/<board_id>')
@login_required
def enlarge(board_id):
    return render_template('boardzoom.html', board_id=board_id)

@mod.route('/virtualboard/<board_id>')
@login_required
def virtual(board_id):
    return render_template('virtualboard.html', board_id=board_id)
