from flask import jsonify, request
from app import models


def get_tasks():
    tasks = models.get_tasks()
    return jsonify({'tasks': tasks})


def put_task():
    data = request.get_json()
    task_data = {
        'name': data.get('name', ''),
        'isParent': data.get('isParent', False),
        'order': data.get('order', 0)
    }

    task_id = models.add_new_task(task_data)

    return jsonify({'status': 'success', 'id': task_id})
