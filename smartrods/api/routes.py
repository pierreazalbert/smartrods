from __future__ import print_function # In python 2.7
import sys

from flask import Blueprint, abort, make_response, jsonify, request, render_template, g
from flask_login import login_required
from flask_restful import Api, Resource
from smartrods import db
from smartrods.models import *
from smartrods.api.process import *
import datetime

mod = Blueprint('api', __name__, static_folder='static', static_url_path='static', template_folder='templates')    # Initialise Blueprint for API
#auth = HTTPBasicAuth()              # Initialise API HTTP Authentication
api = Api(mod)                      # Initialise API

# @auth.get_password
# def get_password(username):
#     if username == 'smartrods':
#         return 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1'
#     return None
#
# @auth.error_handler
# def unauthorized():
#     return make_response(jsonify({'error': 'Unauthorized access'}), 401)

class ActivityAPI(Resource):

    #decorators = [login_required]

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
        return {'activity_id':activity.id,
                'activity_name':activityname,
                'started':str(activity.started)}, 200;

    def put(self, id):

        # Check classroom exists
        classroom = Classroom.query.get(id) #check existence instead of loading object?
        if classroom is None:
            return {'error': 'There is no classroom with the requested ID'}, 404

        # Check correct format of request
        if not request.json or not 'action' in request.json or not 'type_or_id' in request.json:
            return {'error': 'The request format is invalid. You must supply an action and an activity type'}, 404

        # Check correct format of request arguments (action and activity_type)
        if type(request.json['action']) != str:
            return {'error': 'Please provide a the action name in string format'}, 404
        if type(request.json['type_or_id']) != int:
            return {'error': 'Please provide the activity id (pause, resume, stop) or activity type (start) in int format'}, 404

        # Determine what to do based on arguments
        if request.json['action'] == 'start':
            #start acvitiy with given activity type
            now = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
            newactivity = Activity(started=now, classroom_id=id, type_id=request.json['type_or_id'])
            db.session.add(newactivity)
            activity_type = ActivityType.query.get(equest.json['type_or_id'])
            action = 'Started activity: ' + activity_type.name + ' to ' + activity_type.target
            zerostats = "{'progression': 0, 'fluency': 0, 'success_count': 0, 'solutions_found': [], 'actions_count': 0, 'systematicity': 'none', 'accuracy': 0}"
            for user in classroom.users:
                newevent = Event(timestamp=now, activity_id=newactivity.id, user_id=user.id, actions=action, outcomes="-", statistics=zerostats, board_id=user.board.id, rods="-")
                db.session.add(newevent)
            db.session.commit()

        # elif request.json['action'] == 'pause':
        #     #pause acvitiy with given activity id
        # elif request.json['action'] == 'resume':
        #     #resume acvitiy with given activity id
        # elif request.json['action'] == 'stop':
        #     #stop activity with given activity id
        else:
            return {'error': 'Please provide a valid action type (start, pause, resume or stop)'}, 404

        return {'message': action + ' in classroom ' + id,
                'timestamp':now}, 201

api.add_resource(ActivityAPI, '/classrooms/<int:id>/activities/', endpoint='activity')

class ClassroomAPI(Resource):

    decorators = [login_required]

    # Get list of all students in classroom + contents of their boards
    def get(self, id):
        classroom = Classroom.query.get(id)
        if classroom is None:
            return {'error': 'There is no classroom with the requested ID'}, 404
        results = []
        for user in classroom.users:
            results.append({'id':user.board.id,
                            'is_connected':user.board.is_connected,
                            'user':user.firstname+' '+user.lastname,
                            'last_update':str(user.board.rods[-1].timestamp),
                            'rods':user.board.rods[-1].rods})
        return make_response(jsonify(results), 200)

api.add_resource(ClassroomAPI, '/classrooms/<int:id>', endpoint='classroom')

class BoardAPI(Resource):

    #decorators = [login_required]

    # Get information about a specific board
    # Returns only events in current activity
    def get(self, id):
        board = Board.query.get(id)
        if board is None:
            return {'error': 'There is no board with the requested ID'}, 404
        events = board.user.activities[-1].events
        data = []
        for event in events:
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

        # Create new rods object
        newrods = Rods(timestamp=request.json['timestamp'], rods=request.json['rods'], board_id=id)
        db.session.add(newrods)
        db.session.commit()

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

        [actions, outcomes, stats] = processData(new_data, last_data, activity.type, last_stats)

        print (actions, file=sys.stderr)
        print (outcomes, file=sys.stderr)
        print (stats, file=sys.stderr)

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

@mod.errorhandler(404)
def not_found(error):
    return {'error': 'Not found'}, 404

@mod.route('/docs')
def docs():
    return render_template('index.html')
