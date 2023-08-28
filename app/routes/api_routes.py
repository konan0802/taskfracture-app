from flask import Blueprint
from app.views.api import views

api = Blueprint('api', __name__)


@api.route('/tasks', methods=['GET'])
def get_tasks():
    return views.get_tasks()


@api.route('/addTask', methods=['POST'])
def add_task():
    return views.add_task()


@api.route('/updateTaskOrder', methods=['POST'])
def update_task_order():
    return views.update_task_order()
