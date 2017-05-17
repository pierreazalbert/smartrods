from flask import Blueprint
from flask_user import roles_required

mod = Blueprint('admin', __name__, template_folder='templates')

@mod.route('/')
@roles_required('admin')
def index():
    return '<h1>You are on the admin section!</h1>'
