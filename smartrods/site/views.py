from flask import Blueprint, render_template, make_response

mod = Blueprint('site', __name__, template_folder='templates')

@mod.route('/')
def home():
    return render_template('home.html')

@mod.route('/test')
def test():
    return render_template('test.html')

@mod.route('/new-login')
def new_login():
    return render_template('login.html')
