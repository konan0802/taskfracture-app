from flask import Blueprint, request
from app.views.api import views  # APIのビジネスロジック

api = Blueprint('api', __name__)


@api.route('/tasks', methods=['GET'])
def get_tasks():
    return views.get_tasks()


@api.route('/tasks', methods=['POST'])
def add_task():
    new_task = request.json
    return views.add_task(new_task)
