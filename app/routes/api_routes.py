from flask import Blueprint
from app.views.api import views

api = Blueprint('api', __name__)


@api.route('/tasks', methods=['GET'])
def get_tasks():
    return views.get_tasks()


@api.route('/tasks', methods=['PUT'])
def put_task():
    return views.put_task()
