from flask import jsonify
import app.model.database as db


def get_tasks_api():
    tasks = db.get_all_tasks()
    return jsonify({'tasks': tasks})


def add_task_api(new_task):
    db.add_task(new_task)
    return jsonify({'message': 'Task added successfully!'})
