from flask import Blueprint, abort, make_response, jsonify, request, render_template
from flask_httpauth import HTTPBasicAuth
from flask_restful import Api, Resource
from smartrods import db
from smartrods.models import *

mod = Blueprint('api', __name__, static_folder='static', static_url_path='static', template_folder='templates')    # Initialise Blueprint for API
auth = HTTPBasicAuth()              # Initialise API HTTP Authentication
api = Api(mod)                      # Initialise API

@auth.get_password
def get_password(username):
    if username == 'smartrods':
        return 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1'
    return None

@auth.error_handler
def unauthorized():
    return make_response(jsonify({'error': 'Unauthorized access'}), 401)

class ClassroomAPI(Resource):

    decorators = [auth.login_required]

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

    decorators = [auth.login_required]

    # Get information about a specific board
    # Returns only first 200 rods objects
    def get(self, id):
        board = Board.query.get(id)
        if board is None:
            return {'error': 'There is no board with the requested ID'}, 404
        activity = []
        for event in board.rods:
            activity.append({'timestamp':str(event.timestamp),
                             'rods':event.rods})
        return {'id':board.id,
                'is_connected':board.is_connected,
                'user':board.user.firstname+' '+board.user.lastname,
                'activity':activity}, 200;

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

        # Return data to confirm success
        return {'timestamp':request.json['timestamp'],
                'rods':request.json['rods'],
                'board_id':id}, 201

api.add_resource(BoardAPI, '/boards/<int:id>', endpoint='board')

@mod.errorhandler(404)
def not_found(error):
    return {'error': 'Not found'}, 404

@mod.route('/docs')
def docs():
    return render_template('index.html')
