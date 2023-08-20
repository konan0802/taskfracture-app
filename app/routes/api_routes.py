from flask import Blueprint, request
from app.views.api import views  # APIのビジネスロジック

api = Blueprint('api', __name__)


@api.route('/tasks', methods=['GET'])
def get_tasks_api():
    return views.get_tasks_api()


@api.route('/tasks', methods=['POST'])
def add_task_api():
    new_task = request.json
    return views.add_task_api(new_task)
