from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_user import login_required, roles_required, UserManager, SQLAlchemyAdapter

# Initialise basic Flask application
app = Flask(__name__)
app.config.from_pyfile('config.py')

# Initialise Flask extensions
db = SQLAlchemy(app)        # Initialise Database
mail = Mail(app)            # Initialise Flask-Mail

# Initialise Flask-User
from models import User
db_adapter = SQLAlchemyAdapter(db, User)        # Register the User model
user_manager = UserManager(db_adapter, app)     # Initialize Flask-User

# Import and register blueprints with application
from smartrods.api.routes import mod
from smartrods.site.views import mod
from smartrods.admin.views import mod

app.register_blueprint(api.routes.mod, url_prefix='/api')
app.register_blueprint(site.views.mod)
app.register_blueprint(admin.views.mod, url_prefix='/admin')
