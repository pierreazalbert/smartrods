from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_user import login_required, roles_required, UserManager, SQLAlchemyAdapter
from flask_bootstrap import Bootstrap

# Initialise basic Flask application
application = Flask(__name__)
application.config.from_pyfile('config.py')

# Initialise Flask extensions
db = SQLAlchemy(application)        # Initialise Database
mail = Mail(application)            # Initialise Flask-Mail
bootstrap = Bootstrap(application)

# Initialise Flask-User DB Adapater
from models import User
db_adapter = SQLAlchemyAdapter(db, User)        # Register the User model
# Modify Register Form
from flask_user.forms import RegisterForm
from wtforms import StringField, validators
class RegisterForm(RegisterForm):
    firstname = StringField('First name', validators=[validators.DataRequired('First name is required')])
    lastname = StringField('Last name', validators=[validators.DataRequired('Last name is required')])
    classroom_id = StringField('Classroom ID', validators=[validators.DataRequired('Classroom ID is required')])
# Initialise Flask-User Manager
user_manager = UserManager(db_adapter, application, register_form = RegisterForm)     # Initialize Flask-User

# Import and register blueprints with application
from smartrods.api.routes import mod
from smartrods.site.views import mod
from smartrods.admin.views import mod

application.register_blueprint(site.views.mod)
application.register_blueprint(api.routes.mod, url_prefix='/api')
application.register_blueprint(admin.views.mod, url_prefix='/admin')
