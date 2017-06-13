from smartrods import db
from flask_user import UserMixin
import datetime

class School (db.Model):
    __tablename__ = "school"
    id = db.Column('id', db.Integer, autoincrement=True, primary_key = True)
    name = db.Column('name', db.String(50), nullable=False, unique=True)

    classrooms = db.relationship('Classroom', backref='school')

class Classroom (db.Model):
    __tablename__ = "classroom"
    id = db.Column('id', db.Integer, autoincrement=True, primary_key = True)
    name = db.Column('name', db.String(50), nullable=False)
    school_id = db.Column('school_id', db.Integer, db.ForeignKey('school.id'))

    users = db.relationship('User', backref='classroom')
    activities = db.relationship('Activity', backref='classroom', order_by='asc(Activity.started)')

class User (db.Model, UserMixin):
    __tablename__ = "user"
    id = db.Column('id', db.Integer, autoincrement=True, primary_key = True)

    # User Authentication information
    username = db.Column('username', db.String(50), nullable=False, unique=True)
    password = db.Column('password', db.String(255), nullable=False, default='')

    # User Email information
    email = db.Column('email', db.String(255), nullable=False, unique=True)
    confirmed_at = db.Column('confirmed_at', db.DateTime())

    # User information
    is_enabled = db.Column('is_enabled', db.Boolean(), nullable=False, default=False)
    firstname = db.Column('firstname', db.String(50), nullable=False, default='')
    lastname = db.Column('lastname', db.String(50), nullable=False, default='')
    classroom_id = db.Column('classroom_id', db.Integer, db.ForeignKey('classroom.id'))

    # Relationships
    roles = db.relationship('Role', secondary='user_roles',
            backref=db.backref('users', lazy='dynamic'))
    board = db.relationship('Board', uselist=False, backref='user')
    activities = db.relationship('Activity', secondary='classroom', backref='users', order_by='asc(Activity.started)')
    events = db.relationship('Event', backref='user', order_by='asc(Event.timestamp)')

class Role(db.Model):
    id = db.Column('id', db.Integer, autoincrement=True, primary_key = True)
    name = db.Column(db.String(50), unique=True)

class UserRoles(db.Model):
    id = db.Column('id', db.Integer, autoincrement=True, primary_key = True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id', ondelete='CASCADE'))
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id', ondelete='CASCADE'))

class Board (db.Model):
    __tablename__ = "board"
    id = db.Column('id', db.Integer, autoincrement=True, primary_key = True)
    is_connected = db.Column('is_connected', db.Boolean(), nullable=False, default=False)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('user.id'))

    events = db.relationship('Event', order_by='asc(Event.timestamp)', backref='board')

class Activity (db.Model):
    __tablename__ = "activity"
    id = db.Column('id', db.Integer, autoincrement=True, primary_key = True)
    type_id = db.Column('type_id', db.Integer, db.ForeignKey('activity_type.id'))
    started = db.Column('started', db.DateTime)
    paused = db.Column('paused', db.Boolean, default=False)
    elapsed = db.Column('elapsed', db.Interval, default=datetime.timedelta(seconds=0,minutes=0,hours=0))
    ended = db.Column('ended', db.DateTime)
    classroom_id = db.Column('classroom_id', db.Integer, db.ForeignKey('classroom.id'))

    events = db.relationship('Event', order_by='asc(Event.timestamp)', backref='activity')

class ActivityType (db.Model):
    id = db.Column('id', db.Integer, autoincrement=True, primary_key = True)
    name = db.Column(db.String(50))
    target = db.Column(db.Integer)
    solution_max_size = db.Column(db.Integer)

    activities = db.relationship('Activity', backref='type', order_by='asc(Activity.started)')

class Event (db.Model):
    __tablename__ = "event"
    id = db.Column('id', db.Integer, autoincrement=True, primary_key = True)
    timestamp = db.Column('timestamp', db.DateTime)
    actions = db.Column('actions', db.String)
    outcomes = db.Column('outcomes', db.String)
    statistics = db.Column('statistics', db.String)
    activity_id = db.Column('activity_id', db.Integer, db.ForeignKey('activity.id'))
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('user.id'))
    rods = db.Column('rods', db.String, nullable=False)
    board_id = db.Column('board_id', db.Integer, db.ForeignKey('board.id'))
