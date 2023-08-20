from flask import jsonify
from app.models import get_all_tasks, add_task


def get_tasks_api():
    tasks = get_all_tasks()
    return jsonify({'tasks': tasks})


def add_task_api():
    # 仮のデータ（実際にはリクエストからデータを取得する）
    task = {
        'name': 'New Task',
        'estimated_hours': 3,
        'actual_hours': 2,
        'status': 0,
        'parent_task_id': None
    }
    add_task(task)
    return jsonify({'message': 'Task added successfully!'})
