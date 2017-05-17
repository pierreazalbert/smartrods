from flask import Blueprint
from flask_httpauth import HTTPBasicAuth
from flask_restful import Api, Resource
from smartrods.models import Board, Rods

mod = Blueprint('api', __name__)    # Initialise Blueprint for API
auth = HTTPBasicAuth()              # Initialise API HTTP Authentication
api = Api(mod)                      # Initialise API

@auth.get_password
def get_password(username):
    if username == 'smartrods':
        return 'fae2ba5c-7a51-407b-9c0a-1366ce610ff1'
    return None

@auth.error_handler
def unauthorized():
    return {'error': 'Unauthorized access'}, 401

# @mod.route('/getstuff')
# @auth.login_required
# def getstuff():
#     return '{"result":"You are in the API!"}'

class BoardAPI(Resource):
    decorators = [auth.login_required]
    def get(self, id):
        board = Board.query.get(id)
        if board is None:
            abort(404)
        return {'id':board.id,
                'is_connected':board.is_connected,
                'user':board.user.firstname+' '+board.user.lastname,
                'last_update':str(board.rods[-1].timestamp),
                'contents':board.rods[-1].rods}

    # def post(self):
    #     if not request.json or not 'id' in request.json or not 'rods' in request.json:
    #         abort(400)
    #     if
    #
    #     board = Board.query.get(id)
    #     if board is None:
    #         abort(404)
    #     if


api.add_resource(BoardAPI, '/boards/<int:id>', endpoint='board')
