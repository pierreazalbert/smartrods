from __future__ import print_function # In python 2.7
import sys

from flask import Blueprint, render_template, make_response
from flask_login import current_user, login_required


mod = Blueprint('site', __name__, template_folder='templates')

@mod.route('/')
def home():
    return render_template('home.html')
    #return redirect(url_for('site.exercises'))

@mod.route('/test')
@login_required
def test():
    return render_template('test.html')

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
