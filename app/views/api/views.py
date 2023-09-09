from flask import jsonify, request
from app import models


def get_tasks():
    tasks = models.get_all_tasks()
    # print(tasks, flush=True)
    return jsonify({'tasks': tasks})


def add_task():
    data = request.get_json()
    task_data = {
        'name': data.get('name', ''),
        'isParent': data.get('isParent', False),
        'order': data.get('order', 0)
    }

    task_id = models.add_new_task(task_data)

    return jsonify({'status': 'success', 'id': task_id})


def update_task_order():
    data = request.get_json()
    task_order_data = data.get('taskOrder', [])

    models.update_task_order(task_order_data)

    return jsonify({'status': 'success'})
