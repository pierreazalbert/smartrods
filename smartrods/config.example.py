# Flask settings
DEBUG = True
SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://username:password@host:port/dbname'
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = 'typeyoursecretkeyhere'
WTF_CSRF_ENABLED = True

# Flask-Mail settings
# MAIL_SERVER = 'smtp-host'
# MAIL_PORT = 465
# MAIL_USE_SSL = True
# MAIL_USE_TLS = False
# MAIL_USERNAME =  'smtp-username'
# MAIL_PASSWORD = 'smtp-password'
# MAIL_DEFAULT_SENDER = '"AppName" <donotreply@myapp.com>'
USER_ENABLE_EMAIL = False

# Flask-User settings
USER_APP_NAME = "AppName"                # Used by email templates
USER_ENABLE_CHANGE_USERNAME = False
