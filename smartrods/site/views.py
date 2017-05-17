from flask import Blueprint

mod = Blueprint('site', __name__, template_folder='templates')

@mod.route('/home')
def home():
    return '<h1>You are on the homepage!</h1>'
