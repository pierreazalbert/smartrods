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

# Initialise Flask-User
from models import User
db_adapter = SQLAlchemyAdapter(db, User)        # Register the User model
user_manager = UserManager(db_adapter, application)     # Initialize Flask-User

# Import and register blueprints with application
from smartrods.api.routes import mod
from smartrods.site.views import mod
from smartrods.admin.views import mod

application.register_blueprint(site.views.mod)
application.register_blueprint(api.routes.mod, url_prefix='/api')
application.register_blueprint(admin.views.mod, url_prefix='/admin')
