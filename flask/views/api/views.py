from flask import jsonify, request
from flask import models


def sync_tasks():
    data = request.get_json()

    parent_tasks_data = data.get('tasks', [])
    print("parent_tasks_data".format(parent_tasks_data), flush=True)

    task_ids = models.sync_tasks(parent_tasks_data)

    return jsonify({'status': 'success', 'taskIds': task_ids})


def get_tasks():
    tasks = models.get_tasks()
    return jsonify({'tasks': tasks})
