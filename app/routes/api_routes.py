from flask import Blueprint, jsonify, request
from app.models import get_all_tasks, add_task

api = Blueprint('api', __name__)

@api.route('/tasks', methods=['GET'])
def get_tasks_api():
    tasks = get_all_tasks()
    return jsonify({'tasks': tasks})

@api.route('/tasks', methods=['POST'])
def add_task_api():
    new_task = request.json
    add_task(new_task)
    return jsonify({'message': 'Task added successfully!'})
