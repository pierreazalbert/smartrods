from __future__ import print_function # In python 2.7
import sys

from flask import Blueprint, abort, make_response, jsonify, request, render_template, g, url_for
from flask_login import login_required
from flask_restful import Api, Resource
from flask_httpauth import HTTPBasicAuth
from smartrods import db
from smartrods.models import *
from smartrods.api.process import *
import datetime

mod = Blueprint('api', __name__, template_folder='templates', static_folder='static')    # Initialise Blueprint for API
auth = HTTPBasicAuth()              # Initialise API HTTP Authentication
api = Api(mod)                      # Initialise API

@auth.get_password
def get_password(username):
    if username == 'smartrods-hardware':
        return '4FSpm8m6gWpuNktxMzWyJUxdLwedqMpy'
    return None

@auth.error_handler
def unauthorized():
    return make_response(jsonify({'error': 'Unauthorized access'}), 401)

class ActivityTypeAPI(Resource):

    decorators = [login_required]

    # returns id of an activity type based on name, target number and max solution size
    def get(self):
        # Check correct format of request
        if not request.args or not 'activity_name' in request.args or not 'target_number' in request.args or not 'solution_max_size' in request.args:
            return {'error': 'The request format is invalid. You must supply an activity name, a target number and a maximum solution size'}, 404

        # Check correct format of request arguments (action and activity_type)
        if type(request.args['activity_name']) != unicode:
            return {'error': 'Please provide an activity name in string format'}, 404
        try:
            target_number = int(request.args['target_number'])
        except:
            return {'error': 'The activity target number must be an integer'}, 404
        try:
            solution_max_size = int(request.args['solution_max_size'])
        except:
            return {'error': 'The activity maximum solution size must be an integer'}, 404

        if (request.args['activity_name'] == "NumberBonds"):
            activity_name = "Number Bonds"

        activity_type = ActivityType.query.filter_by(name=activity_name, target=target_number, solution_max_size=solution_max_size).first()
        return {'activity_type_id':activity_type.id}, 200;

api.add_resource(ActivityTypeAPI, '/activity_types', endpoint='activity_type')

class ActivityAPI(Resource):

    decorators = [login_required]

    def get(self, id):
        # Check classroom exists
        classroom = Classroom.query.get(id) #check existence instead of loading object?
        if classroom is None:
            return {'error': 'There is no classroom with the requested ID'}, 404

        activity = classroom.activities[-1]
        if activity.type.id == 0:
            activityname = activity.type.name
        else:
            activityname = activity.type.name + " to " + str(activity.type.target)
        elapsed = str(activity.elapsed)
        if len(elapsed) == 7:
            elapsed = '0' + elapsed
        return {'activity_id':activity.id,
                'activity_type':activity.type.id,
                'activity_name':activityname,
                'started':str(activity.started),
                'paused':activity.paused,
                'elapsed':elapsed,
                'solution_max_size':activity.type.solution_max_size}, 200;

    def post(self, id):
        # Check classroom exists
        classroom = Classroom.query.get(id) #check existence instead of loading object?
        if classroom is None:
            return {'error': 'There is no classroom with the requested ID'}, 404

        # Check correct format of request
        if not request.json or not 'action' in request.json or not 'activity_type' in request.json:
            return {'error': 'The request format is invalid. You must supply an action and an activity type'}, 404

        # Check correct format of request arguments (action and activity_type)
        if type(request.json['action']) != unicode:
            return {'error': 'Please provide the action name in string format'}, 404
        if type(request.json['activity_type']) != int:
            return {'error': 'Please provide the activity type in int format'}, 404

        # Determine what to do based on arguments
        if request.json['action'] == 'start':
            now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            #check if an activity is currently running, if yes, terminate it
            currentactivity = classroom.activities[-1]
            if currentactivity.ended is None:
                currentactivity.ended = now
                currentactivity.paused = False
            #start acvitiy with given activity type
            newactivity = Activity(started=now, classroom_id=id, type_id=request.json['activity_type'])
            db.session.add(newactivity)
            activity_type = ActivityType.query.get(request.json['activity_type'])
            action = 'Started activity: ' + str(activity_type.name) + ' to ' + str(activity_type.target)
            zerostats = "{'progression': 0, 'fluency': 0, 'success_count': 0, 'solutions_found': [], 'actions_count': 0, 'systematicity': 'none', 'accuracy': 0}"
            for user in classroom.users:
                newevent = Event(timestamp=now, activity_id=newactivity.id, user_id=user.id, actions=action, outcomes="-", statistics=zerostats, board_id=user.board.id, rods="-")
                db.session.add(newevent)
            db.session.commit()
        elif request.json['action'] == 'pause' or request.json['action'] == 'resume' or request.json['action'] == 'stop':
            return {'error': 'POST requests to this endpoint are reserved to starting activities, for pause/resume/stop please use PUT'}, 404
        else:
            return {'error': 'Please provide a valid action type (start, pause, resume or stop)'}, 404

        return {'message': action + ' in classroom ' + str(id),
                'timestamp':now}, 201

    def put(self, id):
        # Check classroom exists
        classroom = Classroom.query.get(id) #check existence instead of loading object?
        if classroom is None:
            return {'error': 'There is no classroom with the requested ID'}, 404

        # Check correct format of request
        if not request.json or not 'action' in request.json or not 'activity_id' in request.json:
            return {'error': 'The request format is invalid. You must supply at least an action and an activity type (time elapsed is optional)'}, 404

        # Check correct format of request arguments (action and activity_type)
        if type(request.json['action']) != unicode:
            return {'error': 'Please provide the action name in string format'}, 404
        if type(request.json['activity_id']) != int:
            return {'error': 'Please provide the activity id in int format'}, 404
        if 'elapsed' in request.json:
            if type(request.json['elapsed']) != unicode:
                return {'error': 'Please provide the elapsed time in string format'}, 404

        now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        # Determine what to do based on arguments
        if request.json['action'] == 'start':
            return {'error': 'PUT requests to this endpoint are reserved to pausing, resuming or ending activities, to start an activity please use PUT'}, 404
        elif request.json['action'] == 'pause':
            #pause activity with given activity id
            activity = Activity.query.get(request.json['activity_id'])
            activity.paused = True
            elapsed = datetime.datetime.strptime(request.json['elapsed'], '%H:%M:%S')
            activity.elapsed = datetime.timedelta(hours=elapsed.hour, minutes=elapsed.minute, seconds=elapsed.second)
            db.session.commit()
            return {'message': 'Paused activity with id ' + str(activity.id) + ' in classroom ' + str(id),
                    'timestamp':now}, 201
        elif request.json['action'] == 'resume':
            #resume acvitiy with given activity id
            activity = Activity.query.get(request.json['activity_id'])
            activity.paused = False
            db.session.commit()
            return {'message': 'Resumed activity with id ' + str(activity.id) + ' in classroom ' + str(id),
                    'timestamp':now}, 201
        elif request.json['action'] == 'stop':
            #stop activity with given activity id
            activity = Activity.query.get(request.json['activity_id'])
            activity.paused = False
            elapsed = datetime.datetime.strptime(request.json['elapsed'], '%H:%M:%S')
            activity.elapsed = datetime.timedelta(hours=elapsed.hour, minutes=elapsed.minute, seconds=elapsed.second)
            activity.ended = now
            db.session.commit()
            return {'message': 'Ended activity with id ' + str(activity.id) + ' in classroom ' + str(id),
                    'timestamp':now}, 201
        else:
            return {'error': 'Please provide a valid action type (start, pause, resume or stop)'}, 404

api.add_resource(ActivityAPI, '/classrooms/<int:id>/activities', endpoint='activity')

class ClassroomAPI(Resource):

    decorators = [login_required]

    # Get list of all students in classroom + contents of their boards
    def get(self, id):
        classroom = Classroom.query.get(id)
        if classroom is None:
            return {'error': 'There is no classroom with the requested ID'}, 404

        if classroom.activities == []:
            now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            newactivity = Activity(started=now, classroom_id=id, type_id=0)
            db.session.add(newactivity)
            activity_type = ActivityType.query.get(0)
            action = 'Started activity: ' + str(activity_type.name)
            zerostats = "{'progression': 0, 'fluency': 0, 'success_count': 0, 'solutions_found': [], 'actions_count': 0, 'systematicity': 'none', 'accuracy': 0}"
            for user in classroom.users:
                newevent = Event(timestamp=now, activity_id=newactivity.id, user_id=user.id, actions=action, outcomes="-", statistics=zerostats, board_id=user.board.id, rods="-")
                db.session.add(newevent)
            db.session.commit()

        results = []
        for user in classroom.users:
            events = []
            for event in user.activities[-1].events:
                if event.user_id == user.id:
                    events.append({ 'timestamp':event.timestamp,
                                'actions':event.actions,
                                'outcomes':event.outcomes,
                                'statistics':event.statistics,
                                'rods':event.rods})
            results.append({'id':user.board.id,
                            'is_connected':user.board.is_connected,
                            'user':user.firstname+' '+user.lastname,
                            'last_update':str(user.board.events[-1].timestamp),
                            'events':events})
        return make_response(jsonify(results), 200)

api.add_resource(ClassroomAPI, '/classrooms/<int:id>', endpoint='classroom')

class BoardAPI(Resource):

    decorators = [auth.login_required]

    # Get information about a specific board
    # Returns only events in current activity
    def get(self, id):
        board = Board.query.get(id)
        if board is None:
            return {'error': 'There is no board with the requested ID'}, 404
        events = board.user.activities[-1].events
        data = []
        for event in events:
            if event.user_id == board.user.id:
                data.append({'timestamp':str(event.timestamp),
                             'rods':event.rods})
        return {'id':board.id,
                'is_connected':board.is_connected,
                'user':board.user.firstname+' '+board.user.lastname,
                'events':data}, 200;

                # 'rods': [board.rods[i].rods for i in range(len(board.rods))][:200]

    # Update rods on board
    def post(self, id):

        # Check board exists
        board = Board.query.get(id) #check existence instead of loading object?
        if board is None:
            return {'error': 'There is no board with the requested ID'}, 404

        # Check correct format of request
        if not request.json or not 'timestamp' in request.json or not 'rods' in request.json:
            return {'error': 'The request format is invalid. You must supply a timestamp and a rods object'}, 404

        # Check correct format of request arguments (rods and timestamp)
        if type(request.json['timestamp']) != unicode:
            return {'error': 'Please provide a valid timestamp string (YYYY-MM-DD hh:mm:ss)'}, 404
        if type(request.json['rods']) is not list or len(request.json['rods']) is not 10:
            return {'error': 'Please provide a valid rods data structure (10*10 2D array with values of type Int between 0 and 10).'}, 404
        for i in request.json['rods']:
            if type(i) is not list or len(i) is not 10:
                return {'error': 'Please provide a valid rods data structure (10*10 2D array with values of type Int between 0 and 10).'}, 404

        # Process rods data
        user = board.user
        activity = user.activities[-1]
        last_event = activity.events[-1]
        last_stats = eval(last_event.statistics)
        if last_event.rods == "-":
            last_data = None
        else:
            last_data = eval(last_event.rods.replace('{', '[').replace('}', ']'))

        new_data = request.json['rods']

        [actions, outcomes, stats] = processData(new_data, last_data, activity, last_stats)

        # print (actions, file=sys.stderr)
        # print (outcomes, file=sys.stderr)
        # print (stats, file=sys.stderr)

        # Create new event object and add it to activity
        newevent = Event(timestamp = request.json['timestamp'],
                            activity_id = activity.id,
                            user_id = user.id,
                            actions = str(actions),
                            outcomes = str(outcomes),
                            statistics = str(stats),
                            board_id = board.id,
                            rods = request.json['rods'])
        db.session.add(newevent)
        db.session.commit()

        # Return data to confirm success
        # return {'timestamp':request.json['timestamp'],
        #         'rods':request.json['rods'],
        #         'board_id':id}, 201
        return {'message':'Successfully updated contents of board ' + str(board.id),
                'timestamp':request.json['timestamp']}, 201

api.add_resource(BoardAPI, '/boards/<int:id>', endpoint='board')

class VirtualBoardAPI(Resource):

    decorators = [login_required]

    # Get information about a specific board
    # Returns only events in current activity
    def get(self, id):
        board = Board.query.get(id)
        if board is None:
            return {'error': 'There is no board with the requested ID'}, 404
        events = board.user.activities[-1].events
        data = []
        for event in events:
            if event.user_id == board.user.id:
                data.append({'timestamp':str(event.timestamp),
                             'rods':event.rods})
        return {'id':board.id,
                'is_connected':board.is_connected,
                'user':board.user.firstname+' '+board.user.lastname,
                'events':data}, 200;

                # 'rods': [board.rods[i].rods for i in range(len(board.rods))][:200]

    # Update rods on board
    def post(self, id):

        # Check board exists
        board = Board.query.get(id) #check existence instead of loading object?
        if board is None:
            return {'error': 'There is no board with the requested ID'}, 404

        # Check correct format of request
        if not request.json or not 'timestamp' in request.json or not 'rods' in request.json:
            return {'error': 'The request format is invalid. You must supply a timestamp and a rods object'}, 404

        # Check correct format of request arguments (rods and timestamp)
        if type(request.json['timestamp']) != unicode:
            return {'error': 'Please provide a valid timestamp string (YYYY-MM-DD hh:mm:ss)'}, 404
        if type(request.json['rods']) is not list or len(request.json['rods']) is not 10:
            return {'error': 'Please provide a valid rods data structure (10*10 2D array with values of type Int between 0 and 10).'}, 404
        for i in request.json['rods']:
            if type(i) is not list or len(i) is not 10:
                return {'error': 'Please provide a valid rods data structure (10*10 2D array with values of type Int between 0 and 10).'}, 404

        # Process rods data
        user = board.user
        activity = user.activities[-1]
        last_event = activity.events[-1]
        last_stats = eval(last_event.statistics)
        if last_event.rods == "-":
            last_data = None
        else:
            last_data = eval(last_event.rods.replace('{', '[').replace('}', ']'))

        new_data = request.json['rods']

        [actions, outcomes, stats] = processData(new_data, last_data, activity, last_stats)

        # print (actions, file=sys.stderr)
        # print (outcomes, file=sys.stderr)
        # print (stats, file=sys.stderr)

        # Create new event object and add it to activity
        newevent = Event(timestamp = request.json['timestamp'],
                            activity_id = activity.id,
                            user_id = user.id,
                            actions = str(actions),
                            outcomes = str(outcomes),
                            statistics = str(stats),
                            board_id = board.id,
                            rods = request.json['rods'])
        db.session.add(newevent)
        db.session.commit()

        # Return data to confirm success
        # return {'timestamp':request.json['timestamp'],
        #         'rods':request.json['rods'],
        #         'board_id':id}, 201
        return {'message':'Successfully updated contents of board ' + str(board.id),
                'timestamp':request.json['timestamp']}, 201

api.add_resource(VirtualBoardAPI, '/virtualboards/<int:id>', endpoint='virtualboard')

@mod.errorhandler(404)
def not_found(error):
    return {'error': 'Not found'}, 404

# @mod.route('/docs')
# def docs():
#     return render_template('index.html')
